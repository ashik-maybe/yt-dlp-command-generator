/**
 * Shapes of the user-facing content of the app.
 *
 * This file holds no strings. Every user string of the app is data that
 * matches one of these shapes. It fills in during P2.
 */

export type TextRole = 'heading' | 'label' | 'error' | 'warning' | 'hint'

export interface TextItem {
  /** Stable key of the string. */
  id: string
  /** Where the string is used. */
  role: TextRole
}

export interface AppContent {
  /** Heading on the home screen. */
  homeHeading: TextItem
}
