import type { AppState } from "./types";
import { bindEvents } from "./events";
import { setFfmpegStatus, setStatusText } from "./ui";
import { invoke } from "@tauri-apps/api/core";

const state: AppState = {
  files: new Map(),
  outputDir: null,
  isProcessing: false,
};

async function checkFfmpeg(): Promise<void> {
  try {
    await invoke("check_ffmpeg");
    setFfmpegStatus(true);
  } catch (e) {
    const msg = String(e);
    if (msg.includes("FfmpegNotFound") || msg.toLowerCase().includes("ffmpeg")) {
      setFfmpegStatus(false);
      setStatusText("FFmpeg not found — install it and add to PATH, then restart");
    } else {
      setFfmpegStatus(true);
    }
  }
}

document.addEventListener("DOMContentLoaded", () => {
  bindEvents(state);
  checkFfmpeg().catch(console.error);
});
