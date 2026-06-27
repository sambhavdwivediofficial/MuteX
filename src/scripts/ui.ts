import type { VideoFile, FileStatus } from "./types";

export function setStatusText(text: string): void {
  const el = document.getElementById("status-text");
  if (el) el.textContent = text;
}

export function setFfmpegStatus(ok: boolean): void {
  const dot = document.getElementById("ffmpeg-dot");
  const label = document.getElementById("ffmpeg-status");
  if (dot) {
    dot.classList.toggle("status-dot--ok", ok);
    dot.classList.toggle("status-dot--error", !ok);
  }
  if (label) {
    label.textContent = ok ? "FFmpeg ready" : "FFmpeg not found";
  }
}

export function setOutputPickerText(path: string | null): void {
  const el = document.getElementById("output-picker-text");
  if (!el) return;
  if (path) {
    el.textContent = path;
    el.classList.add("output-picker__text--set");
  } else {
    el.textContent = "Select output folder…";
    el.classList.remove("output-picker__text--set");
  }
}

export function setMuteButtonEnabled(enabled: boolean): void {
  const btn = document.getElementById("mute-btn") as HTMLButtonElement | null;
  if (btn) btn.disabled = !enabled;
}

export function setClearButtonEnabled(enabled: boolean): void {
  const btn = document.getElementById("clear-btn") as HTMLButtonElement | null;
  if (btn) btn.disabled = !enabled;
}

export function setDropzoneActive(active: boolean): void {
  const dz = document.getElementById("dropzone");
  if (dz) dz.classList.toggle("dropzone--active", active);
}

export function renderFileItem(file: VideoFile): void {
  const list = document.getElementById("file-list");
  if (!list) return;

  const existing = document.getElementById(`file-${file.id}`);
  if (existing) {
    updateFileItem(file);
    return;
  }

  const item = document.createElement("div");
  item.id = `file-${file.id}`;
  item.className = "file-item";
  item.setAttribute("role", "listitem");
  item.innerHTML = buildFileItemHTML(file);
  list.appendChild(item);
}

export function updateFileItem(file: VideoFile): void {
  const item = document.getElementById(`file-${file.id}`);
  if (!item) return;

  item.className = `file-item file-item--${file.status}`;

  const progressFill = item.querySelector<HTMLElement>(".progress-bar__fill");
  if (progressFill) {
    const pct = Math.round(file.progress * 100);
    progressFill.style.width = `${pct}%`;
    progressFill.classList.toggle("progress-bar__fill--success", file.status === "success");
    progressFill.classList.toggle("progress-bar__fill--error", file.status === "error");
    progressFill.classList.toggle("progress-bar__fill--indeterminate", file.status === "processing" && file.progress < 1);
  }

  const statusEl = item.querySelector<HTMLElement>(".file-item__status");
  if (statusEl) {
    statusEl.innerHTML = buildStatusIcon(file.status);
  }
}

export function removeFileItem(id: string): void {
  const item = document.getElementById(`file-${id}`);
  item?.remove();
}

export function clearFileList(): void {
  const list = document.getElementById("file-list");
  if (list) list.innerHTML = "";
}

function buildFileItemHTML(file: VideoFile): string {
  return `
    <div class="file-item__icon">
      ${videoIcon()}
    </div>
    <div class="file-item__info">
      <span class="file-item__name">${escapeHtml(file.name)}</span>
      <span class="file-item__path">${escapeHtml(file.path)}</span>
    </div>
    <div class="file-item__progress">
      <div class="progress-bar">
        <div class="progress-bar__fill" style="width: 0%"></div>
      </div>
    </div>
    <div class="file-item__status">
      ${buildStatusIcon(file.status)}
    </div>
    <button class="file-item__remove" data-id="${file.id}" aria-label="Remove ${escapeHtml(file.name)}" type="button">
      ${closeIcon()}
    </button>
  `;
}

function buildStatusIcon(status: FileStatus): string {
  switch (status) {
    case "success":
      return `<svg class="icon-status icon-status--success" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3 8.5L6.5 12L13 5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
    case "error":
      return `<svg class="icon-status icon-status--error" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><line x1="4" y1="4" x2="12" y2="12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><line x1="12" y1="4" x2="4" y2="12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>`;
    case "processing":
      return `<svg class="icon-status" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="8" cy="8" r="5.5" stroke="currentColor" stroke-width="1.5" stroke-dasharray="3 3"/></svg>`;
    default:
      return `<svg class="icon-status icon-status--pending" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="8" cy="8" r="5.5" stroke="currentColor" stroke-width="1.5"/></svg>`;
  }
}

function videoIcon(): string {
  return `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="1" y="3" width="14" height="10" rx="1.5" stroke="currentColor" stroke-width="1.25"/><path d="M6.5 5.75L10.5 8L6.5 10.25V5.75Z" fill="currentColor"/></svg>`;
}

function closeIcon(): string {
  return `<svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg"><line x1="1" y1="1" x2="11" y2="11" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><line x1="11" y1="1" x2="1" y2="11" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>`;
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
