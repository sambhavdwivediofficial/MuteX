export type FileStatus = "pending" | "processing" | "success" | "error";

export interface VideoFile {
  id: string;
  path: string;
  name: string;
  status: FileStatus;
  progress: number;
  error?: string;
  outputPath?: string;
}

export interface AppState {
  files: Map<string, VideoFile>;
  outputDir: string | null;
  isProcessing: boolean;
}

export interface MuteRequest {
  input_paths: string[];
  output_dir: string;
}

export interface MuteResult {
  file: string;
  output: string;
  success: boolean;
  error: string | null;
}

export interface MuteProgress {
  file: string;
  index: number;
  total: number;
  progress: number;
}

export interface PickedFiles {
  paths: string[];
}
