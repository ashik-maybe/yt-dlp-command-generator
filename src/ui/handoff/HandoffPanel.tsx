import { useState } from 'react'
import { installLines, pasteInstructions, type StringEntry } from '../../content/index.ts'
import { spec } from '../../spec/index.ts'
import { Callout, Field, Kbd, Panel, Segmented } from '../primitives/index.ts'
import './handoff.css'

/** Options the user picks from. */
const SHELL_OPTIONS = ['posix', 'PowerShell', 'cmd'] as const
type ShellOption = (typeof SHELL_OPTIONS)[number]

/** Keystrokes that open a terminal, per segmented option. */
const TERMINAL_KEYS: Record<ShellOption, string> = {
  posix: 'Ctrl+Alt+T',
  PowerShell: 'Ctrl+Shift+N',
  cmd: 'Win+R',
}

interface ShellConfig {
  /** Id of the install line in content. */
  installId: string
  /** Id of the paste instruction in content. */
  pasteId: string
}

function configFor(option: ShellOption): ShellConfig {
  switch (option) {
    case 'PowerShell':
      return { installId: 'installPowerShell', pasteId: 'pasteWindows' }
    case 'cmd':
      return { installId: 'installCmd', pasteId: 'pasteWindows' }
    default:
      return { installId: 'installLinux', pasteId: 'pasteLinux' }
  }
}

function entry(entries: StringEntry[], id: string): StringEntry | undefined {
  return entries.find((item) => item.id === id)
}

/** Version typed into the check, and whether it differs from the spec. */
function versionState(value: string): { typed: string; differs: boolean } {
  const typed = value.trim()
  return { typed, differs: typed !== '' && typed !== spec.version }
}

export function HandoffPanel() {
  const [option, setOption] = useState<ShellOption>('posix')
  const [version, setVersion] = useState('')
  const { typed, differs } = versionState(version)

  const config = configFor(option)
  const install = entry(installLines, config.installId)
  const paste = entry(pasteInstructions, config.pasteId)
  const pasteKey = paste ? paste.text.replace(/^Paste with\s+/i, '') : ''

  return (
    <Panel className="handoff">
      <h2 className="handoff-title">Handoff</h2>
      <Field label="Shell">
        <Segmented
          options={[...SHELL_OPTIONS]}
          value={option}
          onChange={(value) => setOption(value as ShellOption)}
        />
      </Field>
      {install && <code className="handoff-install">{install.text}</code>}
      <p className="handoff-keystrokes">
        Open a terminal with <Kbd>{TERMINAL_KEYS[option]}</Kbd>. Paste with <Kbd>{pasteKey}</Kbd>.
      </p>
      <Field label="Version">
        <input
          className="handoff-version"
          value={version}
          placeholder={spec.version}
          onChange={(event) => setVersion(event.target.value)}
        />
      </Field>
      {differs && (
        <Callout tone="warning">
          Pasted version {typed} differs from spec version {spec.version}
        </Callout>
      )}
    </Panel>
  )
}
