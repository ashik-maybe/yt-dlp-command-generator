import { Check } from 'lucide-react'
import { useState } from 'react'
import type { Confidence } from '../../core/types.ts'
import { Button } from '../primitives/Button.tsx'
import { Icon } from '../primitives/Icon.tsx'
import { Segmented } from '../primitives/Segmented.tsx'
import './receipt.css'

export interface CommandReceiptProps {
  /** The rendered yt-dlp command as one string. */
  command: string
  /** Confidence of the plan that produced the command. */
  confidence: Confidence
  /** Version string of the run that produced the command. */
  version: string
  /** Plain-English sentences describing the command. */
  sentences: string[]
}

const ONE_LINE = 'One line'
const MULTI_LINE = 'Multi line'

function selectAll(text: string): void {
  const el = document.createElement('textarea')
  el.value = text
  el.setAttribute('readonly', '')
  el.style.position = 'absolute'
  el.style.left = '-9999px'
  el.style.opacity = '0'
  document.body.appendChild(el)
  el.select()
  document.execCommand('copy')
  document.body.removeChild(el)
}

export function CommandReceipt({ command, confidence, version, sentences }: CommandReceiptProps) {
  const [singleLine, setSingleLine] = useState(true)
  const [status, setStatus] = useState<'idle' | 'copied' | 'press'>('idle')

  const text = singleLine
    ? command
        .split('\n')
        .map((line) => line.trim())
        .filter(Boolean)
        .join(' ')
        .trim()
    : command

  async function copyCommand(): Promise<void> {
    if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
      try {
        await navigator.clipboard.writeText(text)
        setStatus('copied')
        return
      } catch {
        // Clipboard API denied or failed. Fall back below.
      }
    }
    selectAll(text)
    setStatus('press')
  }

  return (
    <div className="receipt">
      {sentences.length > 0 && <p className="receipt-sentences">{sentences.join(' ')}</p>}
      <div className="receipt-head">
        <span className="receipt-confidence">{confidence}</span>
        <span className="receipt-stamp">CHECKED · {version}</span>
        <Segmented
          options={[ONE_LINE, MULTI_LINE]}
          value={singleLine ? ONE_LINE : MULTI_LINE}
          onChange={(value) => setSingleLine(value === ONE_LINE)}
        />
      </div>
      <pre className="receipt-code" aria-live="polite" aria-label="Generated command">
        <code>{text}</code>
      </pre>
      <Button className="receipt-copy" variant="secondary" onClick={copyCommand}>
        Copy command
        {status === 'copied' && <Icon icon={Check} className="receipt-copy-icon" />}
      </Button>
      <output className="receipt-status">
        {status === 'copied' ? 'Copied' : status === 'press' ? 'Press Ctrl+C' : ''}
      </output>
    </div>
  )
}
