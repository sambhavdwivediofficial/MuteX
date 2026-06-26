use std::path::{Path, PathBuf};
use std::process::Stdio;
use tokio::io::{AsyncBufReadExt, BufReader};
use tokio::process::Command;

use crate::errors::AppError;
use crate::ffmpeg::resolver::resolve_ffmpeg_path;

pub struct FfmpegProcessor {
    ffmpeg_path: PathBuf,
}

impl FfmpegProcessor {
    pub fn new() -> Result<Self, AppError> {
        let ffmpeg_path = resolve_ffmpeg_path()?;
        Ok(Self { ffmpeg_path })
    }

    pub async fn mute_video(
        &self,
        input: &Path,
        output: &Path,
        on_progress: impl Fn(f32) + Send + 'static,
    ) -> Result<(), AppError> {
        if !input.exists() {
            return Err(AppError::InvalidInputFile(
                input.display().to_string(),
            ));
        }

        let input_str = input
            .to_str()
            .ok_or_else(|| AppError::Io("Invalid input path encoding".into()))?;

        let output_str = output
            .to_str()
            .ok_or_else(|| AppError::Io("Invalid output path encoding".into()))?;

        let mut child = Command::new(&self.ffmpeg_path)
            .args([
                "-y",
                "-i", input_str,
                "-an",
                "-c:v", "copy",
                output_str,
            ])
            .stdout(Stdio::null())
            .stderr(Stdio::piped())
            .spawn()
            .map_err(|e| AppError::Io(e.to_string()))?;

        if let Some(stderr) = child.stderr.take() {
            let mut reader = BufReader::new(stderr).lines();
            while let Ok(Some(line)) = reader.next_line().await {
                log::debug!("[ffmpeg] {}", line);
                on_progress(0.5);
            }
        }

        let status = child
            .wait()
            .await
            .map_err(|e| AppError::Io(e.to_string()))?;

        if status.success() {
            on_progress(1.0);
            log::info!("Muted successfully: {}", output.display());
            Ok(())
        } else {
            let code = status.code().unwrap_or(-1);
            log::error!("FFmpeg exited with code {}", code);
            Err(AppError::FfmpegFailed(format!(
                "FFmpeg exited with code {}",
                code
            )))
        }
    }
}
