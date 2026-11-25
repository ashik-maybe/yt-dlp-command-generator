import { describe, expect, it, vi } from 'vitest'
import { render } from 'ink-testing-library'
import { OutcomeScreen } from '../../src/tui/screens/OutcomeScreen.tsx'
import { curatedTasks } from '../../src/tui/tasks.ts'

const groups = [
  {
    label: 'Common tasks',
    items: curatedTasks.map((task) => ({ id: task.id, name: task.label, hint: task.hint })),
  },
]

function tick(ms = 50): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

describe('task-first outcome screen', () => {
  it('renders common tasks with plain labels and hints', () => {
    const { lastFrame } = render(
      <OutcomeScreen
        groups={groups}
        selectedId="best-video"
        onSelect={() => {}}
        showMore
        onMore={() => {}}
      />,
    )

    const frame = lastFrame() ?? ''
    expect(frame).toContain('Common tasks')
    expect(frame).toContain('Download video')
    expect(frame).toContain('Audio only')
    expect(frame).toContain('More tasks...')
    expect(frame).not.toContain('16 options')
  })

  it('supports arrow navigation', async () => {
    const { lastFrame, stdin } = render(
      <OutcomeScreen
        groups={groups}
        selectedId="best-video"
        onSelect={() => {}}
        showMore
        onMore={() => {}}
      />,
    )

    stdin.write('\u001B[B')
    await tick()
    const frame = lastFrame() ?? ''
    expect(frame).toContain('Audio only')
    expect(frame).toContain('>')
  })

  it('selects a curated task', async () => {
    const onSelect = vi.fn()
    const { stdin } = render(
      <OutcomeScreen
        groups={groups}
        selectedId="best-video"
        onSelect={onSelect}
        showMore
        onMore={() => {}}
      />,
    )

    stdin.write('\u001B[B')
    await tick()
    stdin.write('\r')
    await tick()
    expect(onSelect).toHaveBeenCalledWith('audio-mp3')
  })

  it('opens more tasks row', async () => {
    const onMore = vi.fn()
    const { stdin } = render(
      <OutcomeScreen
        groups={groups}
        selectedId="best-video"
        onSelect={() => {}}
        showMore
        onMore={onMore}
      />,
    )

    for (let i = 0; i < 6; i++) {
      stdin.write('\u001B[B')
      await tick()
    }
    stdin.write('\r')
    await tick()
    expect(onMore).toHaveBeenCalled()
  })
})
