# MuteX

> A production-grade, local-first desktop application for muting video files.

MuteX removes audio tracks from video files while preserving the original video stream and quality. All processing happens entirely on your machine — no internet, no cloud, no accounts.

---

## Features

- Select single or multiple video files
- Drag & Drop support
- Remove audio, preserve video stream (no re-encode)
- Choose custom output folder
- Real-time progress per file
- Full error reporting
- Works completely offline

## Supported Platforms

| Platform | Architecture | Format |
|---|---|---|
| Windows | x64 | `.msi` / `.exe` |
| macOS | Apple Silicon (arm64) | `.dmg` |
| macOS | Intel (x86_64) | `.dmg` |
| Linux | x64 | `.deb` |
| Linux | x64 | `.AppImage` |

## Technology Stack

- **Rust** — Core application logic
- **Tauri v2** — Desktop framework (lightweight, secure, cross-platform)
- **TypeScript + HTML/CSS** — Frontend UI
- **FFmpeg** — Video processing engine (bundled or system)

---

## Development Setup

### Prerequisites

- [Rust](https://rustup.rs/) (latest stable)
- [Node.js](https://nodejs.org/) v18+
- [npm](https://www.npmjs.com/) v9+
- FFmpeg installed on system (for development)

### Install & Run

```bash
# Clone the repo
git clone https://github.com/sambhavdwivediofficial/MuteX.git
cd mutex

# Install frontend dependencies
npm install

# Run in development mode
npm run tauri dev
```

---

## Architecture

```
┌─────────────────────────────────────┐
│         Frontend (UI Layer)         │
│   HTML + CSS + TypeScript (Vite)    │
└──────────────┬──────────────────────┘
               │  Tauri IPC (invoke)
┌──────────────▼──────────────────────┐
│        Tauri v2 (Bridge Layer)      │
│   Commands / Events / Permissions   │
└──────────────┬──────────────────────┘
               │  Rust function calls
┌──────────────▼──────────────────────┐
│       Rust Application Core         │
│  commands/ │ ffmpeg/ │ utils/       │
└──────────────┬──────────────────────┘
               │  Child process (spawn)
┌──────────────▼──────────────────────┐
│            FFmpeg Binary            │
│    (system PATH or bundled)         │
└─────────────────────────────────────┘
```

---

## License

MIT © MuteX Contributors
