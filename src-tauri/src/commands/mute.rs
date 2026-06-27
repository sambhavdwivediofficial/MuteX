use serde::{Deserialize, Serialize};
use std::path::PathBuf;
use tauri::{AppHandle, Emitter};

use crate::errors::AppError;
use crate::ffmpeg::FfmpegProcessor;
use crate::utils::path::{build_output_path, is_valid_dir, is_valid_file};

#[derive(Debug, Deserialize)]
pub struct MuteRequest {
    pub input_paths: Vec<String>,
    pub output_dir: String,
}

#[derive(Debug, Clone, Serialize)]
pub struct MuteProgress {
    pub file: String,
    pub index: usize,
    pub total: usize,
    pub progress: f32,
}

#[derive(Debug, Clone, Serialize)]
pub struct MuteResult {
    pub file: String,
    pub output: String,
    pub success: bool,
    pub error: Option<String>,
}

#[tauri::command]
pub async fn mute_video(
    app: AppHandle,
    request: MuteRequest,
) -> Result<Vec<MuteResult>, AppError> {
    let output_dir = PathBuf::from(&request.output_dir);

    if !is_valid_dir(&output_dir) {
        return Err(AppError::InvalidOutputDir(request.output_dir.clone()));
    }

    let processor = FfmpegProcessor::new()?;
    let total = request.input_paths.len();
    let mut results: Vec<MuteResult> = Vec::with_capacity(total);

    for (index, input_str) in request.input_paths.iter().enumerate() {
        let input = PathBuf::from(input_str);

        if !is_valid_file(&input) {
            results.push(MuteResult {
                file: input_str.clone(),
                output: String::new(),
                success: false,
                error: Some(format!("File not found: {}", input_str)),
            });
            continue;
        }

        let output = build_output_path(&input, &output_dir);
        let output_str = output.to_string_lossy().to_string();
        let file_name = input_str.clone();
        let app_clone = app.clone();
        let file_name_clone = file_name.clone();

        let on_progress = move |progress: f32| {
            let _ = app_clone.emit(
                "mute:progress",
                MuteProgress {
                    file: file_name_clone.clone(),
                    index,
                    total,
                    progress,
                },
            );
        };

        match processor.mute_video(&input, &output, on_progress).await {
            Ok(_) => results.push(MuteResult {
                file: file_name,
                output: output_str,
                success: true,
                error: None,
            }),
            Err(e) => results.push(MuteResult {
                file: file_name,
                output: String::new(),
                success: false,
                error: Some(e.to_string()),
            }),
        }
    }

    Ok(results)
}
