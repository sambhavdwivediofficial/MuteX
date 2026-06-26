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
git clone https://github.com/your-org/mutex.git
cd mutex

# Install frontend dependencies
npm install

# Run in development mode
npm run tauri dev
```

### Build for Production

```bash
npm run tauri build
```

Outputs are placed in `src-tauri/target/release/bundle/`.

---

## Project Structure

```
MuteX/
├── src/                        # Frontend (HTML/CSS/TypeScript)
│   ├── index.html
│   ├── styles/
│   │   ├── tokens.css          # Design tokens (colors, spacing, typography)
│   │   └── main.css            # Global styles
│   ├── scripts/
│   │   ├── main.ts             # App entry point
│   │   ├── api.ts              # Tauri command wrappers
│   │   ├── types.ts            # Shared TypeScript types
│   │   ├── ui.ts               # DOM manipulation helpers
│   │   └── events.ts           # Event listeners & handlers
│   └── components/
│       ├── dropzone.ts         # Drag & drop component
│       ├── filelist.ts         # File list component
│       └── progressbar.ts      # Progress indicator component
│
├── src-tauri/                  # Rust backend (Tauri)
│   ├── src/
│   │   ├── main.rs             # Tauri entry point
│   │   ├── lib.rs              # App builder & command registration
│   │   ├── commands/
│   │   │   ├── mod.rs
│   │   │   ├── mute.rs         # mute_video Tauri command
│   │   │   └── file.rs         # File picker / folder picker commands
│   │   ├── ffmpeg/
│   │   │   ├── mod.rs
│   │   │   ├── processor.rs    # FFmpeg process execution logic
│   │   │   └── resolver.rs     # FFmpeg binary path resolution
│   │   ├── utils/
│   │   │   ├── mod.rs
│   │   │   └── path.rs         # Path manipulation utilities
│   │   └── errors/
│   │       ├── mod.rs
│   │       └── app_error.rs    # Unified AppError type
│   ├── capabilities/
│   │   └── default.json        # Tauri v2 capability permissions
│   ├── icons/                  # App icons (all sizes)
│   ├── Cargo.toml
│   ├── tauri.conf.json
│   └── build.rs
│
├── .github/
│   └── workflows/
│       ├── build.yml           # CI: build & test on every push
│       └── release.yml         # CD: build & publish on git tag
│
├── package.json
├── tsconfig.json
├── vite.config.ts
├── .gitignore
├── .gitattributes
└── README.md
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
