import './style.css';
import { buildCommand } from './commands.js';

const icons = {
  video: '<i class="fa-solid fa-film"></i>',
  music: '<i class="fa-solid fa-music"></i>',
  playlist: '<i class="fa-solid fa-list"></i>',
  batch: '<i class="fa-solid fa-layer-group"></i>',
  sun: '<i class="fa-solid fa-sun"></i>',
  moon: '<i class="fa-solid fa-moon"></i>',
  copy: '<i class="fa-regular fa-copy"></i>',
  check: '<i class="fa-solid fa-check"></i>',
  settings: '<i class="fa-solid fa-gear"></i>',
  filter: '<i class="fa-solid fa-filter"></i>',
  quality: '<i class="fa-solid fa-tower-broadcast"></i>',
  audio: '<i class="fa-solid fa-headphones"></i>',
  list: '<i class="fa-solid fa-list-ul"></i>',
  star: '<i class="fa-solid fa-star"></i>',
  lock: '<i class="fa-solid fa-lock"></i>',
  network: '<i class="fa-solid fa-network-wired"></i>',
  speed: '<i class="fa-solid fa-bolt"></i>',
  chapters: '<i class="fa-solid fa-scissors"></i>',
  info: '<i class="fa-solid fa-circle-info"></i>',
  warning: '<i class="fa-solid fa-triangle-exclamation"></i>',
  download: '<i class="fa-solid fa-download"></i>',
  globe: '<i class="fa-solid fa-globe"></i>',
  key: '<i class="fa-solid fa-key"></i>'
};

const workflows = {
  video: { id: 'video', name: 'Video', icon: icons.video },
  audio: { id: 'audio', name: 'Audio', icon: icons.music },
  playlist: { id: 'playlist', name: 'Playlist', icon: icons.playlist },
  batch: { id: 'batch', name: 'Batch', icon: icons.batch }
};

const categories = [
  { id: 'general', name: 'General', icon: icons.settings },
  { id: 'selection', name: 'Select', icon: icons.filter },
  { id: 'format', name: 'Format', icon: icons.quality },
  { id: 'audio', name: 'Audio', icon: icons.audio },
  { id: 'subtitles', name: 'Subs', icon: icons.list },
  { id: 'thumbnails', name: 'Thumbs', icon: icons.star },
  { id: 'output', name: 'Output', icon: icons.download },
  { id: 'network', name: 'Network', icon: icons.network },
  { id: 'speed', name: 'Speed', icon: icons.speed },
  { id: 'chapters', name: 'Chapters', icon: icons.chapters },
  { id: 'auth', name: 'Auth', icon: icons.lock },
  { id: 'metadata', name: 'Meta', icon: icons.info },
  { id: 'sponsor', name: 'Sponsor', icon: icons.star },
  { id: 'advanced', name: 'Advanced', icon: icons.warning }
];

let state = {
  workflow: 'video',
  copied: false,
  theme: localStorage.getItem('ytdlp-theme') || 'light',
  activeCategory: 'general',
  formData: {}
};

function initFormData() {
  state.formData = {
    url: '', batchFile: '',
    update: false, ignoreErrors: false, abortOnError: false, listExtractors: false, flatPlaylist: false, matchFilters: '',
    playlistItems: '', date: '', datebefore: '', dateafter: '', minFilesize: '', maxFilesize: '', maxDownloads: '', ageLimit: '', downloadArchive: '', noPlaylist: false, playlistRandom: false, playlistReverse: false,
    format: 'best', formatSort: '', mergeOutputFormat: '', preferFreeFormats: false,
    extractAudio: false, audioFormat: 'mp3', audioQuality: '0', keepVideo: false,
    writeSubs: false, writeAutoSubs: false, subLangs: 'en', embedSubs: false, convertSubs: '',
    writeThumbnail: false, embedThumbnail: false, convertThumbnails: '',
    outputTemplate: '', outputPath: '', outputNaPlaceholder: 'NA', restrictFilenames: false, windowsFilenames: false, trimFilenames: '', noOverwrites: false, continueDL: true, part: true, mtime: false,
    writeDescription: false, writeInfoJson: false, writeComments: false, cleanInfoJson: false,
    proxy: '', socketTimeout: '', sourceAddress: '', impersonate: '', forceIpv4: false, forceIpv6: false, referer: '', cookies: '', cookiesFromBrowser: '',
    concurrentFragments: 1, limitRate: '', retries: 10, noContinue: false, noPart: false, bufferSize: '', hlsUseMpegts: false, downloadSections: '',
    splitChapters: false, chaptersStart: '', chaptersEnd: '', chaptersName: '',
    username: '', password: '', twofactor: '', videoPassword: '', netrc: false, netrcLocation: '',
    embedMetadata: true, metadataFromTitle: '', parseMetadata: '', embedChapters: false, addMetadata: false, addChapters: false,
    sponsorblockMark: '', sponsorblockRemove: '', sponsorblockChapters: false,
    quiet: false, noWarnings: false, simulate: false, dumpJson: false, dumpSingleJson: false, verbose: false, forceDownloadArchive: false,
    ffmpegLocation: '', remuxVideo: '', recodeVideo: '', postProcessorArgs: ''
  };
}

function initTheme() {
  document.documentElement.setAttribute('data-theme', state.theme);
}

function toggleTheme() {
  state.theme = state.theme === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', state.theme);
  localStorage.setItem('ytdlp-theme', state.theme);
  render();
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

const debounce = (fn, delay) => {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => fn(...args), delay);
  };
};

const debouncedRenderCommand = debounce(() => renderCommand(), 150);

function renderCommand() {
  const cmdEl = document.querySelector('.apple-terminal-code');
  if (cmdEl) {
    const cmd = buildCommand(state.workflow, state.formData);
    const highlighted = highlightCommand(cmd);
    cmdEl.innerHTML = highlighted + '<span class="apple-cursor-blink"></span>';
  }
}

function highlightCommand(cmd) {
  if (cmd.startsWith('#')) {
    return `<span class="url">${escapeHtml(cmd)}</span>`;
  }
  
  const parts = cmd.split(/(\s+)/);
  let result = '';
  let inQuote = false;
  let currentQuote = '';
  let currentStr = '';
  
  for (const part of parts) {
    if ((part === '"' || part === "'") && !inQuote) {
      if (currentStr) {
        result += `<span class="arg">${escapeHtml(currentStr)}</span>`;
        currentStr = '';
      }
      inQuote = true;
      currentQuote = part;
      result += `<span class="arg">${escapeHtml(part)}</span>`;
    } else if (part === currentQuote && inQuote) {
      result += `<span class="arg">${escapeHtml(part)}</span>`;
      inQuote = false;
      currentQuote = '';
    } else if (inQuote) {
      result += `<span class="arg">${escapeHtml(part)}</span>`;
    } else if (part.startsWith('-')) {
      result += `<span class="flag">${escapeHtml(part)}</span>`;
    } else if (part.startsWith('yt-dlp')) {
      result += `<span class="cmd">${escapeHtml(part)}</span>`;
    } else if (part.startsWith('http') || part.includes('://') || (part.startsWith('"') && (part.includes('.') || part.includes('http')))) {
      result += `<span class="url">${escapeHtml(part)}</span>`;
    } else {
      result += escapeHtml(part);
    }
  }
  
  if (currentStr) {
    result += `<span class="arg">${escapeHtml(currentStr)}</span>`;
  }
  
  return result;
}

function render() {
  const app = document.querySelector('#app');
  app.innerHTML = `
    <div class="apple-app">
      <nav class="apple-navbar">
        <div class="apple-navbar-inner">
          <div class="apple-brand">
            <div class="apple-brand-icon"><i class="fa-solid fa-download"></i></div>
            <div class="apple-brand-text">
              <h1>yt-dlp</h1>
              <span>Command Generator</span>
            </div>
          </div>
          <button class="apple-theme-btn" id="themeToggle" title="Toggle theme">
            <i class="fa-solid ${state.theme === 'dark' ? 'fa-moon' : 'fa-sun'}"></i>
          </button>
        </div>
      </nav>

      <main class="apple-main">
        <div class="apple-workflow-tabs">
          ${Object.values(workflows).map(w => `
            <button class="apple-workflow-tab ${state.workflow === w.id ? 'active' : ''}" data-workflow="${w.id}">
              ${w.icon}
              <span>${w.name}</span>
            </button>
          `).join('')}
        </div>

        <div class="apple-panel">
          <div class="apple-panel-header">
            <h2 class="apple-panel-title">${workflows[state.workflow].name} Options</h2>
          </div>
          <div class="apple-panel-body">
            <div class="apple-input-wrap">
              <input type="text" class="apple-input" id="urlInput" placeholder=" " value="${escapeHtml(state.formData.url || '')}">
              <label class="apple-input-label" for="urlInput">Video URL</label>
            </div>
            
            <div class="apple-categories">
              ${categories.map(cat => `
                <button class="apple-category-btn ${state.activeCategory === cat.id ? 'active' : ''}" data-category="${cat.id}">
                  ${cat.icon}
                  <span>${cat.name}</span>
                </button>
              `).join('')}
            </div>

            <div class="apple-options">
              ${renderCategoryFields()}
            </div>
          </div>
        </div>

        <div class="apple-terminal-card">
          <div class="apple-terminal-header">
            <div class="apple-terminal-dots">
              <span class="apple-terminal-dot red"></span>
              <span class="apple-terminal-dot yellow"></span>
              <span class="apple-terminal-dot green"></span>
            </div>
            <span class="apple-terminal-title">Generated Command</span>
            <div class="apple-terminal-actions">
              <button class="apple-copy-btn ${state.copied ? 'copied' : ''}" id="copyBtn">
                <i class="fa-regular fa-copy"></i>
                ${state.copied ? 'Copied' : 'Copy'}
              </button>
            </div>
          </div>
          <div class="apple-terminal-body">
            <div class="apple-terminal-code">${highlightCommand(buildCommand(state.workflow, state.formData))}<span class="apple-cursor-blink"></span></div>
          </div>
        </div>

        <footer class="apple-footer">
          <p>Requires <a href="https://github.com/yt-dlp/yt-dlp" target="_blank">yt-dlp</a> + <a href="https://ffmpeg.org/" target="_blank">FFmpeg</a></p>
        </footer>
      </main>
    </div>
  `;
  
  attachEventListeners();
}

function renderCategoryFields() {
  const fieldsByCategory = {
    general: [
      { type: 'toggle', id: 'update', label: 'Check for Updates', desc: 'Check yt-dlp updates on startup' },
      { type: 'toggle', id: 'ignoreErrors', label: 'Ignore Errors', desc: 'Continue with next video on errors' },
      { type: 'toggle', id: 'abortOnError', label: 'Abort on Error', desc: 'Stop download when error occurs' },
      { type: 'toggle', id: 'flatPlaylist', label: 'Flat Playlist', desc: 'Faster extraction for large playlists' },
      { type: 'input', id: 'matchFilters', label: 'Match Filters', placeholder: 'like_count>1000,duration<300' }
    ],
    selection: [
      { type: 'input', id: 'playlistItems', label: 'Playlist Items', placeholder: '1:10 or 1,3,5' },
      { type: 'input', id: 'date', label: 'Upload Date', placeholder: 'today, yesterday, thisweek' },
      { type: 'input', id: 'datebefore', label: 'Date Before', placeholder: 'YYYYMMDD' },
      { type: 'input', id: 'dateafter', label: 'Date After', placeholder: 'YYYYMMDD' },
      { type: 'input', id: 'minFilesize', label: 'Min Filesize', placeholder: '50M or 1G' },
      { type: 'input', id: 'maxFilesize', label: 'Max Filesize', placeholder: '2G' },
      { type: 'input', id: 'maxDownloads', label: 'Max Downloads', placeholder: '10' },
      { type: 'input', id: 'downloadArchive', label: 'Download Archive', placeholder: 'archive.txt' },
      { type: 'toggle', id: 'noPlaylist', label: 'No Playlist', desc: 'Download single video only' },
      { type: 'toggle', id: 'playlistRandom', label: 'Random Order', desc: 'Download playlist in random order' },
      { type: 'toggle', id: 'playlistReverse', label: 'Reverse', desc: 'Download playlist in reverse' }
    ],
    format: [
      { type: 'select', id: 'format', label: 'Video Format', options: [
        { value: 'best', label: 'Best (auto)' },
        { value: 'bestvideo+bestaudio', label: 'Best Video + Audio' },
        { value: 'best[ext=mp4]', label: 'Best MP4' },
        { value: 'bestvideo[ext=webm]+bestaudio', label: 'Best WebM' },
        { value: 'best[height<=2160]', label: 'Max 4K' },
        { value: 'best[height<=1080]', label: 'Max 1080p' },
        { value: 'best[height<=720]', label: 'Max 720p' },
        { value: 'best[height<=480]', label: 'Max 480p' },
        { value: 'worst', label: 'Worst' }
      ]},
      { type: 'input', id: 'formatSort', label: 'Format Sort', placeholder: 'res:desc,br:desc,size' },
      { type: 'select', id: 'mergeOutputFormat', label: 'Container', options: [
        { value: '', label: 'Auto' },
        { value: 'mp4', label: 'MP4' },
        { value: 'mkv', label: 'MKV' },
        { value: 'webm', label: 'WebM' },
        { value: 'mov', label: 'MOV' }
      ]},
      { type: 'toggle', id: 'preferFreeFormats', label: 'Prefer Free', desc: 'Prefer WebM over MP4' }
    ],
    audio: [
      { type: 'toggle', id: 'extractAudio', label: 'Extract Audio', desc: 'Extract audio and convert to specified format' },
      { type: 'select', id: 'audioFormat', label: 'Audio Format', options: [
        { value: 'mp3', label: 'MP3 (Best compatibility)' },
        { value: 'm4a', label: 'M4A (AAC)' },
        { value: 'flac', label: 'FLAC (Lossless)' },
        { value: 'opus', label: 'OPUS (Open format)' },
        { value: 'wav', label: 'WAV (Uncompressed)' },
        { value: 'aac', label: 'AAC' },
        { value: 'vorbis', label: 'Vorbis/OGG' }
      ]},
      { type: 'select', id: 'audioQuality', label: 'Audio Quality', options: [
        { value: '0', label: 'Best (lowest file size)' },
        { value: '2', label: 'High (256k)' },
        { value: '5', label: 'Medium (192k)' },
        { value: '8', label: 'Low (128k)' }
      ]},
      { type: 'toggle', id: 'keepVideo', label: 'Keep Video', desc: 'Keep video file after extraction' }
    ],
    subtitles: [
      { type: 'toggle', id: 'writeSubs', label: 'Write Subtitles', desc: 'Download subtitle file' },
      { type: 'toggle', id: 'writeAutoSubs', label: 'Auto Subtitles', desc: 'Download auto-generated subtitles' },
      { type: 'input', id: 'subLangs', label: 'Languages', placeholder: 'en,es,fr or en.*' },
      { type: 'toggle', id: 'embedSubs', label: 'Embed Subtitles', desc: 'Burn subtitles into video' },
      { type: 'select', id: 'convertSubs', label: 'Convert To', options: [
        { value: '', label: 'No conversion' },
        { value: 'srt', label: 'SRT' },
        { value: 'ass', label: 'ASS/SSA' },
        { value: 'vtt', label: 'VTT' }
      ]}
    ],
    thumbnails: [
      { type: 'toggle', id: 'writeThumbnail', label: 'Write Thumbnail', desc: 'Download thumbnail image' },
      { type: 'toggle', id: 'embedThumbnail', label: 'Embed Thumbnail', desc: 'Add as video cover art' },
      { type: 'select', id: 'convertThumbnails', label: 'Convert To', options: [
        { value: '', label: 'No conversion' },
        { value: 'jpg', label: 'JPEG' },
        { value: 'png', label: 'PNG' }
      ]}
    ],
    output: [
      { type: 'input', id: 'outputTemplate', label: 'Filename Template', placeholder: '%(title)s.%(ext)s' },
      { type: 'input', id: 'outputPath', label: 'Output Directory', placeholder: '~/Downloads' },
      { type: 'input', id: 'outputNaPlaceholder', label: 'NA Placeholder', placeholder: 'NA' },
      { type: 'toggle', id: 'restrictFilenames', label: 'ASCII Only', desc: 'Use ASCII characters in filenames' },
      { type: 'toggle', id: 'windowsFilenames', label: 'Windows Compatible', desc: 'Make filenames Windows-safe' },
      { type: 'input', id: 'trimFilenames', label: 'Max Length', placeholder: '100' },
      { type: 'toggle', id: 'noOverwrites', label: 'No Overwrite', desc: "Don't replace existing files" },
      { type: 'toggle', id: 'continueDL', label: 'Resume', desc: 'Resume partial downloads' },
      { type: 'toggle', id: 'part', label: 'Use .part', desc: 'Write to .part during download' },
      { type: 'toggle', id: 'mtime', label: 'Set MTime', desc: 'Set file modification time' }
    ],
    network: [
      { type: 'input', id: 'proxy', label: 'Proxy', placeholder: 'http://proxy:port or socks5://...' },
      { type: 'input', id: 'socketTimeout', label: 'Timeout', placeholder: '30' },
      { type: 'input', id: 'sourceAddress', label: 'Source IP', placeholder: '192.168.1.1' },
      { type: 'select', id: 'impersonate', label: 'Browser', options: [
        { value: '', label: 'Default' },
        { value: 'chrome', label: 'Chrome' },
        { value: 'chrome-120', label: 'Chrome 120' },
        { value: 'edge', label: 'Edge' },
        { value: 'safari', label: 'Safari' },
        { value: 'firefox', label: 'Firefox' }
      ]},
      { type: 'toggle', id: 'forceIpv4', label: 'IPv4 Only', desc: 'Force IPv4 connections' },
      { type: 'toggle', id: 'forceIpv6', label: 'IPv6 Only', desc: 'Force IPv6 connections' },
      { type: 'input', id: 'referer', label: 'Referer', placeholder: 'https://example.com' },
      { type: 'input', id: 'cookies', label: 'Cookie File', placeholder: 'cookies.txt' },
      { type: 'select', id: 'cookiesFromBrowser', label: 'Browser Cookies', options: [
        { value: '', label: 'None' },
        { value: 'chrome', label: 'Chrome' },
        { value: 'firefox', label: 'Firefox' },
        { value: 'edge', label: 'Edge' },
        { value: 'brave', label: 'Brave' },
        { value: 'safari', label: 'Safari' }
      ]}
    ],
    speed: [
      { type: 'select', id: 'concurrentFragments', label: 'Threads', options: [
        { value: 1, label: '1 (default)' },
        { value: 4, label: '4' },
        { value: 8, label: '8' },
        { value: 16, label: '16' }
      ]},
      { type: 'input', id: 'limitRate', label: 'Speed Limit', placeholder: '5M or 500K' },
      { type: 'select', id: 'retries', label: 'Retries', options: [
        { value: 10, label: '10 (default)' },
        { value: 3, label: '3' },
        { value: 0, label: '0' },
        { value: 'infinite', label: 'Infinite' }
      ]},
      { type: 'toggle', id: 'noContinue', label: 'No Continue', desc: 'Restart download instead of resuming' },
      { type: 'toggle', id: 'noPart', label: 'No Part File', desc: "Don't use .part files" },
      { type: 'input', id: 'bufferSize', label: 'Buffer Size', placeholder: '1024 or 16K' },
      { type: 'toggle', id: 'hlsUseMpegts', label: 'Use MPEG-TS', desc: 'Use mpegts container for HLS videos' }
    ],
    chapters: [
      { type: 'toggle', id: 'splitChapters', label: 'Split Chapters', desc: 'Split into separate files per chapter' },
      { type: 'input', id: 'downloadSections', label: 'Download Section', placeholder: 'intro or *0:00-1:00' },
      { type: 'input', id: 'chaptersName', label: 'Chapter Template', placeholder: '%(title)s - %(chapter)s.%(ext)s' }
    ],
    auth: [
      { type: 'input', id: 'username', label: 'Username', placeholder: 'email@example.com' },
      { type: 'input', id: 'password', label: 'Password', placeholder: 'Password' },
      { type: 'input', id: 'twofactor', label: '2FA Code', placeholder: '123456' },
      { type: 'input', id: 'videoPassword', label: 'Video Password', placeholder: 'Password' },
      { type: 'toggle', id: 'netrc', label: 'Use .netrc', desc: 'Use ~/.netrc for authentication' },
      { type: 'input', id: 'netrcLocation', label: 'Netrc Location', placeholder: '~/.netrc' }
    ],
    metadata: [
      { type: 'toggle', id: 'embedMetadata', label: 'Embed Metadata', desc: 'Include title, author, date in file' },
      { type: 'toggle', id: 'embedChapters', label: 'Embed Chapters', desc: 'Include chapter markers' },
      { type: 'toggle', id: 'writeInfoJson', label: 'Write JSON', desc: 'Save metadata to .info.json' },
      { type: 'toggle', id: 'writeDescription', label: 'Write Description', desc: 'Save description to file' },
      { type: 'toggle', id: 'writeComments', label: 'Write Comments', desc: 'Include video comments' },
      { type: 'toggle', id: 'cleanInfoJson', label: 'Clean JSON', desc: 'Remove internal metadata' },
      { type: 'input', id: 'metadataFromTitle', label: 'Parse Title', placeholder: '%(title)s:%(artist)s' },
      { type: 'input', id: 'parseMetadata', label: 'Parse Metadata', placeholder: 'title:%(artist)s - %(title)s' }
    ],
    sponsor: [
      { type: 'select', id: 'sponsorblockMark', label: 'Mark', options: [
        { value: '', label: 'Disabled' },
        { value: 'all', label: 'All categories' },
        { value: 'sponsor', label: 'Sponsor' },
        { value: 'intro', label: 'Intro/Outro' },
        { value: 'outro', label: 'Outro' },
        { value: 'selfpromo', label: 'Self-promotion' },
        { value: 'interaction', label: 'Interaction' },
        { value: 'music_offtopic', label: 'Music non-music' }
      ]},
      { type: 'select', id: 'sponsorblockRemove', label: 'Remove', options: [
        { value: '', label: 'Disabled' },
        { value: 'all', label: 'All categories' },
        { value: 'sponsor', label: 'Sponsor' },
        { value: 'intro', label: 'Intro/Outro' },
        { value: 'selfpromo', label: 'Self-promotion' }
      ]},
      { type: 'toggle', id: 'sponsorblockChapters', label: 'Chapters Only', desc: 'Only download chapter markers' }
    ],
    advanced: [
      { type: 'toggle', id: 'simulate', label: 'Simulate', desc: "Don't download, just show info" },
      { type: 'toggle', id: 'verbose', label: 'Verbose', desc: 'Show detailed debug output' },
      { type: 'toggle', id: 'quiet', label: 'Quiet', desc: 'Suppress output' },
      { type: 'toggle', id: 'noWarnings', label: 'No Warnings', desc: 'Suppress warnings' },
      { type: 'toggle', id: 'dumpJson', label: 'Dump JSON', desc: 'Print video info as JSON' },
      { type: 'toggle', id: 'dumpSingleJson', label: 'Dump Single JSON', desc: 'Print info for multiple videos as JSON' },
      { type: 'toggle', id: 'forceDownloadArchive', label: 'Force Archive', desc: 'Force recording to archive' },
      { type: 'input', id: 'ffmpegLocation', label: 'FFmpeg Path', placeholder: '/usr/local/bin/ffmpeg' },
      { type: 'select', id: 'remuxVideo', label: 'Remux To', options: [
        { value: '', label: 'No remuxing' },
        { value: 'mp4', label: 'MP4' },
        { value: 'mkv', label: 'MKV' },
        { value: 'mov', label: 'MOV' }
      ]},
      { type: 'select', id: 'recodeVideo', label: 'Recode To', options: [
        { value: '', label: 'No recoding' },
        { value: 'mp4', label: 'MP4 (H.264)' },
        { value: 'webm', label: 'WebM (VP9)' }
      ]},
      { type: 'input', id: 'postProcessorArgs', label: 'Post-Processor Args', placeholder: 'ffmpeg:-vn -ar 44100' }
    ]
  };

  const fields = fieldsByCategory[state.activeCategory] || [];
  
  if (fields.length === 0) {
    return '<div class="apple-empty">No options in this category</div>';
  }

  return fields.map(field => {
    if (field.type === 'select') {
      return `
        <div class="apple-select-wrap">
          <label class="apple-select-label">${field.label}</label>
          <select class="apple-select" id="${field.id}">
            ${field.options.map(opt => `<option value="${opt.value}" ${String(state.formData[field.id]) === String(opt.value) ? 'selected' : ''}>${opt.label}</option>`).join('')}
          </select>
        </div>
      `;
    }
    
    if (field.type === 'input') {
      return `
        <div class="apple-input-wrap">
          <input type="text" class="apple-input" id="${field.id}" placeholder=" " value="${escapeHtml(state.formData[field.id] || '')}">
          <label class="apple-input-label" for="${field.id}">${field.label}</label>
        </div>
      `;
    }
    
    // Toggle
    return `
      <div class="apple-option-row">
        <div class="apple-option-info">
          <span class="apple-option-label">${field.label}</span>
          <span class="apple-option-desc">${field.desc}</span>
        </div>
        <label class="apple-toggle">
          <input type="checkbox" id="${field.id}" ${state.formData[field.id] ? 'checked' : ''}>
          <span class="apple-toggle-track"></span>
        </label>
      </div>
    `;
  }).join('');
}

function attachEventListeners() {
  document.getElementById('themeToggle')?.addEventListener('click', toggleTheme);
  
  document.querySelectorAll('.apple-workflow-tab').forEach(btn => {
    btn.addEventListener('click', () => {
      state.workflow = btn.dataset.workflow;
      initFormData();
      render();
    });
  });
  
  document.querySelectorAll('.apple-category-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      state.activeCategory = btn.dataset.category;
      render();
    });
  });
  
  // Text inputs
  const textInputs = ['url', 'matchFilters', 'playlistItems', 'date', 'datebefore', 'dateafter', 
    'minFilesize', 'maxFilesize', 'maxDownloads', 'downloadArchive', 'formatSort', 'outputTemplate', 
    'outputPath', 'outputNaPlaceholder', 'trimFilenames', 'proxy', 'socketTimeout', 'sourceAddress', 
    'referer', 'cookies', 'subLangs', 'downloadSections', 'chaptersName', 'username', 'password', 
    'twofactor', 'videoPassword', 'netrcLocation', 'metadataFromTitle', 'parseMetadata', 'limitRate', 
    'bufferSize', 'ffmpegLocation', 'postProcessorArgs'];
  
  textInputs.forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      el.addEventListener('input', (e) => {
        state.formData[id] = e.target.value;
        debouncedRenderCommand();
      });
    }
  });
  
  // Selects
  const selectInputs = ['format', 'mergeOutputFormat', 'audioFormat', 'audioQuality', 'convertSubs', 
    'convertThumbnails', 'impersonate', 'cookiesFromBrowser', 'sponsorblockMark', 'sponsorblockRemove',
    'remuxVideo', 'recodeVideo', 'concurrentFragments', 'retries'];
  
  selectInputs.forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      el.addEventListener('change', (e) => {
        state.formData[id] = e.target.value;
        debouncedRenderCommand();
      });
    }
  });
  
  // Checkboxes
  const checkboxInputs = ['update', 'ignoreErrors', 'abortOnError', 'flatPlaylist', 'noPlaylist', 
    'playlistRandom', 'playlistReverse', 'extractAudio', 'preferFreeFormats', 'writeSubs', 'writeAutoSubs',
    'embedSubs', 'writeThumbnail', 'embedThumbnail', 'restrictFilenames', 'windowsFilenames', 'noOverwrites',
    'continueDL', 'part', 'mtime', 'forceIpv4', 'forceIpv6', 'noContinue', 'noPart', 'hlsUseMpegts',
    'splitChapters', 'embedMetadata', 'embedChapters', 'writeInfoJson', 'writeDescription', 'writeComments',
    'cleanInfoJson', 'netrc', 'sponsorblockChapters', 'simulate', 'verbose', 'quiet', 'noWarnings',
    'dumpJson', 'dumpSingleJson', 'forceDownloadArchive', 'keepVideo', 'addMetadata', 'addChapters'];
  
  checkboxInputs.forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      el.addEventListener('change', (e) => {
        state.formData[id] = e.target.checked;
        debouncedRenderCommand();
      });
    }
  });
  
  // URL input
  const urlInput = document.getElementById('urlInput');
  if (urlInput) {
    urlInput.addEventListener('input', (e) => {
      state.formData.url = e.target.value;
      debouncedRenderCommand();
    });
  }
  
  // Copy button
  document.getElementById('copyBtn')?.addEventListener('click', () => {
    const command = buildCommand(state.workflow, state.formData);
    navigator.clipboard.writeText(command).then(() => {
      state.copied = true;
      const btn = document.getElementById('copyBtn');
      btn.innerHTML = `<i class="fa-solid fa-check"></i> Copied`;
      btn.classList.add('copied');
      setTimeout(() => {
        state.copied = false;
        btn.innerHTML = `<i class="fa-regular fa-copy"></i> Copy`;
        btn.classList.remove('copied');
      }, 2000);
    });
  });
}

// Initialize
initFormData();
initTheme();
render();
