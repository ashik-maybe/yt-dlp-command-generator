/**
 * User-facing strings of the app, as typed data.
 *
 * Every string in this file is an entry: a stable id, a role, and the
 * text itself. Later phases read the text by id when they render screens.
 */

import type { AppContent, TextItem, TextRole } from './schema.ts'

export interface StringEntry extends TextItem {
  /** The user-facing string. */
  text: string
}

export interface WarningEntry extends TextItem {
  /** Validator finding code the warning matches. */
  code: string
  /** The warning text shown to users. */
  text: string
}

function e(id: string, role: TextRole, text: string): StringEntry {
  return { id, role, text }
}

/** Hero: heading and the sentence under it. */
export const heroStrings: StringEntry[] = [
  e('heroHeading', 'heading', "Save the video. We'll write the command."),
  e('heroSupport', 'label', 'Paste a link, get a command.'),
]

/** Names of the outcomes the app offers. */
export const outcomeStrings: StringEntry[] = [
  e('outcomeDownloadVideo', 'label', 'Video download'),
  e('outcomeExtractAudio', 'label', 'Audio only'),
  e('outcomeConvertFormat', 'label', 'Converted file'),
  e('outcomeResumeDownload', 'label', 'Resume download'),
  e('outcomeListFormats', 'label', 'Format list'),
  e('outcomeCopyCommand', 'label', 'Command copy'),
]

/** Labels for format quality. */
export const qualityLabels: StringEntry[] = [
  e('qualityBest', 'label', 'Best'),
  e('qualityGood', 'label', 'Good'),
  e('qualityMedium', 'label', 'Medium'),
  e('qualityLow', 'label', 'Low'),
]

/** Install lines, one per platform. */
export const installLines: StringEntry[] = [
  e('installMacos', 'label', 'brew install yt-dlp'),
  e(
    'installLinux',
    'label',
    'curl -L https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp -o yt-dlp',
  ),
  e(
    'installPowerShell',
    'label',
    'Invoke-WebRequest -Uri https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp.exe -OutFile yt-dlp.exe',
  ),
  e(
    'installCmd',
    'label',
    'curl -L https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp.exe -o yt-dlp.exe',
  ),
]

/** Paste instructions with the real keystrokes. */
export const pasteInstructions: StringEntry[] = [
  e('pasteWindows', 'label', 'Paste with Ctrl+V'),
  e('pasteMac', 'label', 'Paste with Cmd+V'),
  e('pasteLinux', 'label', 'Paste with Ctrl+V'),
]

/** Copy instructions with the real keystrokes. */
export const copyInstructions: StringEntry[] = [
  e('copyWindows', 'label', 'Copy with Ctrl+C'),
  e('copyMac', 'label', 'Copy with Cmd+C'),
  e('copyLinux', 'label', 'Copy with Ctrl+C'),
]

/** Warnings, keyed by the validator finding code they match. */
export const validatorWarnings: WarningEntry[] = [
  {
    code: 'UNKNOWN_FLAG',
    id: 'warnUnknownFlag',
    role: 'warning',
    text: 'The plan uses a flag the spec does not list',
  },
  {
    code: 'MISSING_REQUIRED',
    id: 'warnMissingRequired',
    role: 'warning',
    text: 'The plan drops a required flag the spec lists',
  },
  {
    code: 'REQUIRES_UNSATISFIED',
    id: 'warnRequiresUnsatisfied',
    role: 'warning',
    text: 'A requires chain is not satisfied',
  },
  {
    code: 'CONFLICT',
    id: 'warnConflict',
    role: 'warning',
    text: 'Two plan flags conflict per the spec',
  },
  {
    code: 'UNSUPPORTED',
    id: 'warnUnsupported',
    role: 'warning',
    text: 'The plan uses a flag the spec marks unsupported',
  },
  {
    code: 'DEPRECATED_FLAG',
    id: 'warnDeprecatedFlag',
    role: 'warning',
    text: 'The plan uses a flag the spec marks deprecated',
  },
]

/** Confidence labels of the plan path. */
export const confidenceLabels: StringEntry[] = [
  e('confidenceVerified', 'label', 'verified'),
  e('confidenceValidated', 'label', 'validated'),
  e('confidenceUnverified', 'label', 'unverified'),
]

/** Coverage copy: exact counts are stated only when they come from the spec. */
export const coverageNote: StringEntry = e('coverageNote', 'label', 'Counts come from the spec')

/** Empty state of the app. */
export const emptyState: StringEntry[] = [
  e('emptyTitle', 'label', 'No links yet'),
  e('emptyHint', 'hint', 'Add a link to start'),
]

/** Error state of the app. */
export const errorState: StringEntry[] = [
  e('errorTitle', 'error', 'The command could not be generated'),
  e('errorHint', 'hint', 'Try again later'),
]

/** Button labels. */
export const buttons: StringEntry[] = [
  e('generateButton', 'label', 'Generate command'),
  e('copyButton', 'label', 'Copy command'),
  e('tryAgainButton', 'label', 'Try again'),
  e('addLinkButton', 'label', 'Add link'),
]

/** Typed view of the app content, per schema.ts. */
export const appContent: AppContent = {
  homeHeading: { id: 'heroHeading', role: 'heading' },
}
