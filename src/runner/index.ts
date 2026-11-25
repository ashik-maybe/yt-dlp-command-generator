/// <reference types="node" />
import { spawn } from 'node:child_process'

export interface ProgressSink {
  onStdout?: (chunk: string) => void
  onStderr?: (chunk: string) => void
}

export interface RunResult {
  exitCode: number | null
  stdout: string
  stderr: string
  durationMs: number
}

const ENOENT_EXIT_CODE = 127

export async function runProcess(
  argv: string[],
  signal?: AbortSignal,
  sink?: ProgressSink,
): Promise<RunResult> {
  const start = Date.now()
  let stdout = ''
  let stderr = ''
  let settled = false

  const [command, ...args] = argv
  if (!command) {
    return { exitCode: 1, stdout, stderr, durationMs: Date.now() - start }
  }

  return new Promise<RunResult>((resolve) => {
    const child = spawn(command, args, {
      stdio: ['ignore', 'pipe', 'pipe'],
    })

    let killTimer: ReturnType<typeof setTimeout> | undefined

    const finish = (result: RunResult) => {
      if (settled) return
      settled = true
      if (killTimer) clearTimeout(killTimer)
      signal?.removeEventListener('abort', onAbort)
      resolve(result)
    }

    const onAbort = () => {
      if (child.exitCode !== null || child.killed) return
      child.kill('SIGTERM')
      killTimer = setTimeout(() => {
        if (child.exitCode === null) {
          child.kill('SIGKILL')
        }
      }, 2000)
    }

    if (signal) {
      if (signal.aborted) {
        onAbort()
      } else {
        signal.addEventListener('abort', onAbort, { once: true })
      }
    }

    child.stdout.on('data', (data: { toString(): string }) => {
      const chunk = data.toString()
      stdout += chunk
      sink?.onStdout?.(chunk)
    })

    child.stderr.on('data', (data: { toString(): string }) => {
      const chunk = data.toString()
      stderr += chunk
      sink?.onStderr?.(chunk)
    })

    child.on('error', (err: Error & { code?: string }) => {
      const durationMs = Date.now() - start
      if (err.code === 'ENOENT') {
        finish({ exitCode: ENOENT_EXIT_CODE, stdout, stderr, durationMs })
        return
      }
      finish({ exitCode: 1, stdout, stderr, durationMs })
    })

    child.on('close', (code: number | null, sig: string | null) => {
      const durationMs = Date.now() - start
      if (sig === 'SIGTERM' || sig === 'SIGKILL') {
        finish({ exitCode: 130, stdout, stderr, durationMs })
        return
      }
      finish({ exitCode: code ?? 1, stdout, stderr, durationMs })
    })
  })
}
