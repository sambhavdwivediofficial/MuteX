use std::path::{Path, PathBuf};

pub fn build_output_path(input: &Path, output_dir: &Path) -> PathBuf {
    let stem = input
        .file_stem()
        .and_then(|s| s.to_str())
        .unwrap_or("output");

    let ext = input
        .extension()
        .and_then(|e| e.to_str())
        .unwrap_or("mp4");

    let filename = format!("{}_muted.{}", stem, ext);
    output_dir.join(filename)
}

pub fn is_valid_file(path: &Path) -> bool {
    path.exists() && path.is_file()
}

pub fn is_valid_dir(path: &Path) -> bool {
    path.exists() && path.is_dir()
}

#[cfg(test)]
mod tests {
    use super::*;
    use std::path::PathBuf;

    #[test]
    fn test_build_output_path() {
        let input = PathBuf::from("/home/user/my_video.mp4");
        let output_dir = PathBuf::from("/home/user/muted");
        let result = build_output_path(&input, &output_dir);
        assert_eq!(result, PathBuf::from("/home/user/muted/my_video_muted.mp4"));
    }

    #[test]
    fn test_build_output_path_mkv() {
        let input = PathBuf::from("/videos/clip.mkv");
        let output_dir = PathBuf::from("/output");
        let result = build_output_path(&input, &output_dir);
        assert_eq!(result, PathBuf::from("/output/clip_muted.mkv"));
    }
}
