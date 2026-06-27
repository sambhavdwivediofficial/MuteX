use serde::Serialize;
use tauri::AppHandle;
use tauri_plugin_dialog::{DialogExt, FilePath};

use crate::errors::AppError;
use crate::ffmpeg::resolve_ffmpeg_path;

#[derive(Debug, Serialize)]
pub struct PickedFiles {
    pub paths: Vec<String>,
}

#[tauri::command]
pub async fn check_ffmpeg() -> Result<(), AppError> {
    resolve_ffmpeg_path().map(|_| ())
}

#[tauri::command]
pub async fn pick_files(app: AppHandle) -> Result<PickedFiles, AppError> {
    let files = app
        .dialog()
        .file()
        .add_filter(
            "Video Files",
            &["mp4", "mkv", "mov", "avi", "webm", "flv", "ts", "m4v", "wmv"],
        )
        .set_title("Select Video Files")
        .blocking_pick_files()
        .unwrap_or_default();

    let paths = files
        .into_iter()
        .filter_map(|fp| match fp {
            FilePath::Path(p) => p.to_str().map(|s| s.to_string()),
            _ => None,
        })
        .collect();

    Ok(PickedFiles { paths })
}

#[tauri::command]
pub async fn pick_output_folder(app: AppHandle) -> Result<Option<String>, AppError> {
    let folder = app
        .dialog()
        .file()
        .set_title("Select Output Folder")
        .blocking_pick_folder();

    let result = folder.and_then(|fp| match fp {
        FilePath::Path(p) => p.to_str().map(|s| s.to_string()),
        _ => None,
    });

    Ok(result)
}
