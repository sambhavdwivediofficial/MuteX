mod commands;
mod errors;
mod ffmpeg;
mod utils;

pub fn run() {
    tauri::Builder::default()
        // Register plugins
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_shell::init())
        .plugin(tauri_plugin_log::Builder::default().build())
        // Register Tauri commands (IPC handlers)
        .invoke_handler(tauri::generate_handler![
            commands::mute::mute_video,
            commands::file::pick_files,
            commands::file::pick_output_folder,
        ])
        .run(tauri::generate_context!())
        .expect("error while running MuteX application");
}
