use std::path::PathBuf;
use which::which;

use crate::errors::AppError;
pub fn resolve_ffmpeg_path() -> Result<PathBuf, AppError> {
    match which("ffmpeg") {
        Ok(path) => {
            log::info!("FFmpeg found at: {}", path.display());
            Ok(path)
        }
        Err(_) => {
            log::error!("FFmpeg not found in PATH");
            Err(AppError::FfmpegNotFound)
        }
    }
}
