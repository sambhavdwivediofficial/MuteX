import { invoke } from "@tauri-apps/api/core";
import { listen, UnlistenFn } from "@tauri-apps/api/event";
import type { MuteProgress, MuteRequest, MuteResult, PickedFiles } from "./types";

export async function pickFiles(): Promise<string[]> {
  const result = await invoke<PickedFiles>("pick_files");
  return result.paths;
}

export async function pickOutputFolder(): Promise<string | null> {
  return invoke<string | null>("pick_output_folder");
}

export async function muteVideos(request: MuteRequest): Promise<MuteResult[]> {
  return invoke<MuteResult[]>("mute_video", { request });
}

export async function onMuteProgress(
  handler: (progress: MuteProgress) => void
): Promise<UnlistenFn> {
  return listen<MuteProgress>("mute:progress", (event) => {
    handler(event.payload);
  });
}
