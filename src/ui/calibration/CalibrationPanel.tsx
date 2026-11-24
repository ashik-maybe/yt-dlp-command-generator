import { useId, useState, type ChangeEvent } from 'react'
import { Callout } from '../primitives/Callout.tsx'
import { Field } from '../primitives/Field.tsx'
import { parseToolOutput, type FormatRow } from './parse.ts'

interface CalibrationPanelProps {
  /** Called with the parsed rows when parsing succeeds. */
  onParsed: (rows: FormatRow[]) => void
}

export function CalibrationPanel({ onParsed }: CalibrationPanelProps) {
  const textareaId = useId()
  const [text, setText] = useState('')
  const [rows, setRows] = useState<FormatRow[]>([])
  const [error, setError] = useState<string | null>(null)

  const handleTextChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    const next = event.target.value
    setText(next)
    const result = parseToolOutput(next)
    if (result.ok) {
      setRows(result.rows)
      setError(null)
      onParsed(result.rows)
      return
    }
    setRows([])
    setError(result.error)
  }

  return (
    <div className="calibration-panel">
      <Field
        label="yt-dlp output"
        description="Paste `yt-dlp -F` output or a `yt-dlp --version` line. Parsing runs on the pasted text only; nothing is fetched."
        error={error}
        htmlFor={textareaId}
      >
        <textarea
          id={textareaId}
          className="calibration-textarea"
          rows={8}
          placeholder="Paste `yt-dlp -F` output…"
          value={text}
          onChange={handleTextChange}
        />
      </Field>
      {rows.length > 0 && (
        <Callout title={`Parsed formats (${rows.length})`}>
          <table className="calibration-rows">
            <thead>
              <tr>
                <th scope="col">ID</th>
                <th scope="col">Ext</th>
                <th scope="col">Resolution</th>
                <th scope="col">Protocol</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.formatId}>
                  <td>{row.formatId}</td>
                  <td>{row.ext}</td>
                  <td>{row.resolution ?? '—'}</td>
                  <td>{row.protocol ?? '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Callout>
      )}
    </div>
  )
}
