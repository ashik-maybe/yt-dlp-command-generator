import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
} from '@radix-ui/react-dialog'
import type { ReactNode } from 'react'
import { useMemo, useState } from 'react'
import type { OptionSpec } from '../../core/types.ts'
import { spec } from '../../spec/index.ts'
import { Button } from '../primitives/Button.tsx'
import { Callout } from '../primitives/Callout.tsx'
import './advanced.css'

/** One option of the spec, as the drawer renders it. */
interface AdvancedOption extends OptionSpec {
  /** Section the option is listed under, when the spec provides one. */
  section?: string
}

/** Options of the generated spec, as the drawer renders them. */
const OPTIONS = spec.options as AdvancedOption[]

/** Official yt-dlp README, linked from the Doc entries. */
const YTDLP_DOCS = 'https://github.com/yt-dlp/yt-dlp/blob/master/README.md'

export interface AdvancedDrawerProps {
  /** Extra controls rendered in the drawer. */
  children?: ReactNode
  /** Open state of the dialog. Omit to let the drawer manage it. */
  open?: boolean
  /** Called when the dialog requests an open-state change. */
  onOpenChange?: (open: boolean) => void
}

export function AdvancedDrawer({ children, open, onOpenChange }: AdvancedDrawerProps) {
  const [search, setSearch] = useState('')
  const [raw, setRaw] = useState('')

  const options = useMemo(() => {
    const needle = search.trim().toLowerCase()
    if (!needle) return OPTIONS
    return OPTIONS.filter(
      (option) =>
        option.flag.toLowerCase().includes(needle) ||
        option.metavar?.toLowerCase().includes(needle) === true ||
        option.section?.toLowerCase().includes(needle) === true,
    )
  }, [search])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogPortal>
        <DialogOverlay className="advanced-overlay" />
        <DialogContent className="advanced-content" aria-describedby="advanced-drawer-description">
          <DialogTitle className="advanced-title">Advanced options</DialogTitle>
          <DialogDescription id="advanced-drawer-description" className="advanced-description">
            Paste raw arguments, or pick an option from the spec.
          </DialogDescription>
          <Callout tone="warning">Raw arguments are not verified against the spec.</Callout>
          <label className="advanced-field" htmlFor="advanced-raw">
            Raw arguments
          </label>
          <textarea
            id="advanced-raw"
            className="advanced-raw"
            rows={4}
            value={raw}
            onChange={(event) => setRaw(event.target.value)}
            placeholder="yt-dlp --extract-audio --audio-format mp3 URL"
          />
          <label className="advanced-field" htmlFor="advanced-search">
            Search options
          </label>
          <input
            id="advanced-search"
            type="search"
            className="advanced-search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search by flag, section, or metavar"
          />
          {options.length === 0 ? (
            <p className="advanced-empty">No options match this search.</p>
          ) : (
            <ul className="advanced-options">
              {options.map((option) => (
                <li className="advanced-option" key={option.flag}>
                  <span className="advanced-flag">--{option.flag}</span>
                  <span className="advanced-metavar">{option.metavar ?? ''}</span>
                  <span className="advanced-section">{option.section ?? ''}</span>
                  {option.anchor && (
                    <a
                      className="advanced-doc"
                      href={`${YTDLP_DOCS}#${option.anchor}`}
                      style={{ minHeight: 44 }}
                    >
                      Doc
                    </a>
                  )}
                </li>
              ))}
            </ul>
          )}
          {children}
          <DialogClose asChild>
            <Button className="advanced-close">Close</Button>
          </DialogClose>
        </DialogContent>
      </DialogPortal>
      <DialogTrigger asChild>
        <Button>Advanced</Button>
      </DialogTrigger>
    </Dialog>
  )
}
