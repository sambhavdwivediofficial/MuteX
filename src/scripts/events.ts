import type { AppState, VideoFile } from "./types";
import { pickFiles, pickOutputFolder, muteVideos, onMuteProgress } from "./api";
import {
  setStatusText,
  setOutputPickerText,
  setMuteButtonEnabled,
  setClearButtonEnabled,
  setDropzoneActive,
  renderFileItem,
  updateFileItem,
  removeFileItem,
  clearFileList,
} from "./ui";

function generateId(): string {
  return Math.random().toString(36).slice(2, 10);
}

function basename(path: string): string {
  return path.split(/[\\/]/).pop() ?? path;
}

function canMute(state: AppState): boolean {
  return state.files.size > 0 && state.outputDir !== null && !state.isProcessing;
}

function syncButtons(state: AppState): void {
  setMuteButtonEnabled(canMute(state));
  setClearButtonEnabled(state.files.size > 0 && !state.isProcessing);
}

function addFiles(state: AppState, paths: string[]): void {
  const existingPaths = new Set([...state.files.values()].map((f) => f.path));
  for (const path of paths) {
    if (existingPaths.has(path)) continue;
    const id = generateId();
    const file: VideoFile = {
      id,
      path,
      name: basename(path),
      status: "pending",
      progress: 0,
    };
    state.files.set(id, file);
    renderFileItem(file);
  }
  syncButtons(state);
  const count = state.files.size;
  setStatusText(count === 1 ? "1 file selected" : `${count} files selected`);
}

export function bindEvents(state: AppState): void {
  const dropzone = document.getElementById("dropzone")!;
  const outputPicker = document.getElementById("output-picker")!;
  const muteBtn = document.getElementById("mute-btn")!;
  const clearBtn = document.getElementById("clear-btn")!;
  const fileList = document.getElementById("file-list")!;

  dropzone.addEventListener("click", async (e: MouseEvent) => {
    e.stopPropagation();
    if (state.isProcessing) return;
    try {
      const paths = await pickFiles();
      if (paths.length > 0) addFiles(state, paths);
    } catch (err) {
      setStatusText(`Error opening file picker: ${String(err)}`);
    }
  });

  dropzone.addEventListener("keydown", (e: KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      dropzone.click();
    }
  });

  dropzone.addEventListener("dragover", (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDropzoneActive(true);
  });

  dropzone.addEventListener("dragleave", (e: DragEvent) => {
    e.stopPropagation();
    if (!dropzone.contains(e.relatedTarget as Node)) {
      setDropzoneActive(false);
    }
  });

  dropzone.addEventListener("drop", (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDropzoneActive(false);
    if (state.isProcessing) return;
    const paths = Array.from(e.dataTransfer?.files ?? []).map((f) => (f as any).path ?? f.name);
    if (paths.length > 0) addFiles(state, paths);
  });

  outputPicker.addEventListener("click", async (e: MouseEvent) => {
    e.stopPropagation();
    if (state.isProcessing) return;
    try {
      const folder = await pickOutputFolder();
      if (folder) {
        state.outputDir = folder;
        setOutputPickerText(folder);
        syncButtons(state);
      }
    } catch (err) {
      setStatusText(`Error opening folder picker: ${String(err)}`);
    }
  });

  fileList.addEventListener("click", (e: MouseEvent) => {
    const btn = (e.target as HTMLElement).closest<HTMLButtonElement>("[data-id]");
    if (!btn || state.isProcessing) return;
    const id = btn.dataset.id!;
    state.files.delete(id);
    removeFileItem(id);
    syncButtons(state);
    const count = state.files.size;
    setStatusText(
      count === 0 ? "Ready" : count === 1 ? "1 file selected" : `${count} files selected`
    );
  });

  clearBtn.addEventListener("click", (e: MouseEvent) => {
    e.stopPropagation();
    if (state.isProcessing) return;
    state.files.clear();
    clearFileList();
    syncButtons(state);
    setStatusText("Ready");
  });

  muteBtn.addEventListener("click", async (e: MouseEvent) => {
    e.stopPropagation();
    if (!canMute(state)) return;

    state.isProcessing = true;
    syncButtons(state);
    setStatusText("Processing…");

    for (const file of state.files.values()) {
      file.status = "pending";
      file.progress = 0;
      updateFileItem(file);
    }

    const unlisten = await onMuteProgress((payload) => {
      const file = [...state.files.values()].find((f) => f.path === payload.file);
      if (!file) return;
      file.status = "processing";
      file.progress = payload.progress;
      updateFileItem(file);
      setStatusText(`Processing ${payload.index + 1} of ${payload.total}…`);
    });

    try {
      const results = await muteVideos({
        input_paths: [...state.files.values()].map((f) => f.path),
        output_dir: state.outputDir!,
      });

      for (const result of results) {
        const file = [...state.files.values()].find((f) => f.path === result.file);
        if (!file) continue;
        file.status = result.success ? "success" : "error";
        file.progress = result.success ? 1 : 0;
        file.outputPath = result.output || undefined;
        file.error = result.error || undefined;
        updateFileItem(file);
      }

      const successCount = results.filter((r) => r.success).length;
      const failCount = results.length - successCount;

      if (failCount === 0) {
        setStatusText(`Done — ${successCount} file${successCount !== 1 ? "s" : ""} muted`);
      } else {
        setStatusText(`Done — ${successCount} succeeded, ${failCount} failed`);
      }
    } catch (err) {
      setStatusText(`Error: ${String(err)}`);
    } finally {
      unlisten();
      state.isProcessing = false;
      syncButtons(state);
    }
  });
}
