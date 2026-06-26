use serde::Serialize;
use thiserror::Error;

#[derive(Debug, Error, Serialize)]
pub enum AppError {
    #[error("FFmpeg not found. Please install FFmpeg and ensure it is in your PATH.")]
    FfmpegNotFound,

    #[error("FFmpeg process failed: {0}")]
    FfmpegFailed(String),

    #[error("Invalid input file: {0}")]
    InvalidInputFile(String),

    #[error("Invalid output directory: {0}")]
    InvalidOutputDir(String),

    #[error("File has no audio track: {0}")]
    NoAudioTrack(String),

    #[error("Output file already exists: {0}")]
    OutputFileExists(String),

    #[error("I/O error: {0}")]
    Io(String),

    #[error("Unexpected error: {0}")]
    Unexpected(String),
}

impl From<std::io::Error> for AppError {
    fn from(e: std::io::Error) -> Self {
        AppError::Io(e.to_string())
    }
}
