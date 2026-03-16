# yt-dlp Command Generator

<p align="center">
  <img src="https://img.shields.io/badge/Bun-000000?style=for-the-badge&logoColor=white" alt="Bun">
  <img src="https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logoColor=white" alt="Vite">
</p>

A beautiful, hyper-responsive webapp that lets you graphically select options and generates ready-to-use yt-dlp commands. Copy, paste, done!

---

## ✨ Features

- **4 Workflows** - Video, Audio, Playlist, Batch modes
- **14 Categories** - All yt-dlp options organized
- **Real-time Preview** - Command updates as you type
- **One-click Copy** - Copy commands to clipboard instantly
- **Dual Themes** - Light & Dark mode (persists in localStorage)
- **Responsive** - Works beautifully on desktop, tablet, and mobile

---

## 🚀 Workflows

| Workflow | Description |
|----------|-------------|
| **Video** | Download single videos in your preferred format & quality |
| **Audio** | Extract audio with format & quality options (MP3, FLAC, M4A, etc.) |
| **Playlist** | Download entire playlists with filtering & ordering options |
| **Batch** | Process multiple URLs from a file |

---

## 📂 Categories

| Category | Options |
|----------|---------|
| **General** | Update check, ignore errors, flat playlist, match filters |
| **Selection** | Playlist items, date filters, filesize limits, random/reverse order |
| **Format** | Quality presets (4K, 1080p, 720p), format sorting, container selection |
| **Audio** | Extract audio, format, quality, keep video |
| **Subtitles** | Write/embed subs, auto subs, languages, conversion |
| **Thumbnails** | Write/embed thumbnails, format conversion |
| **Output** | Filename template, path, restrictions, resume, overwrite |
| **Network** | Proxy, timeout, cookies, browser impersonation, IPv4/IPv6 |
| **Speed** | Concurrent fragments, rate limit, retries, buffer size |
| **Chapters** | Split chapters, download sections, chapter templates |
| **Auth** | Username/password, 2FA, video password, .netrc |
| **Metadata** | Embed metadata, chapters, JSON, description, comments |
| **Sponsor** | SponsorBlock integration (mark/remove segments) |
| **Advanced** | Simulate, verbose, quiet, FFmpeg location, remux/recode |

---

## 🛠️ Tech Stack

- **Bun** - Fast JavaScript runtime & package manager
- **Vite** - Next-generation frontend tooling
- **Vanilla JS** - No framework, lightweight & fast
- **FontAwesome 6** - Beautiful icons

---

## 📦 Installation

```bash
# Clone the repository
git clone https://github.com/ashik-maybe/yt-dlp-command-generator
cd yt-dlp-command-generator

# Install dependencies with bun
bun install
```

---

## 🎯 Usage

```bash
# Start development server
bun run dev

# Build for production
bun run build

# Preview production build
bun run preview
```

Then open http://localhost:5173 in your browser.

---

## 📋 Requirements

- [yt-dlp](https://github.com/yt-dlp/yt-dlp) - Main downloader
- [FFmpeg](https://ffmpeg.org/) - For transcoding (most features)

---

<p align="center">Made with ☕ and 🎬</p>
