import { recipes } from '../recipes/index.ts'

export interface TaskItem {
  /** Stable task id. */
  id: string
  /** Plain label shown to the user. */
  label: string
  /** Short plain hint. */
  hint: string
}

/** Six curated tasks shown on the default path. */
export const curatedTasks: readonly TaskItem[] = [
  { id: 'best-video', label: 'Download video', hint: 'Save the best video' },
  { id: 'audio-mp3', label: 'Audio only', hint: 'Save audio as MP3' },
  { id: 'list-formats', label: 'List formats', hint: 'Show available formats' },
  { id: 'subtitles-only', label: 'Subtitles', hint: 'Download subtitle files' },
  { id: 'playlist-range', label: 'Playlist', hint: 'Download part of a playlist' },
  { id: 'clip-by-section', label: 'Clip a section', hint: 'Save a time range' },
]

/** Return every recipe as a task item. */
export function allTasks(): TaskItem[] {
  return recipes.map((recipe) => ({
    id: recipe.id,
    label: recipe.name,
    hint: 'Use this task',
  }))
}
