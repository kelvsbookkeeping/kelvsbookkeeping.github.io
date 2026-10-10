import { useEffect, useRef } from 'react'
import type { FlowSettings, SymbolFlow } from './symbol-flow'
import './background.css'

/** Where the content column sits, so the floating figures calm down behind it. */
export type ContentLayout = 'sidebar-expanded' | 'sidebar-collapsed' | 'full-width'

/** Medium strength, calm speed, no mouse reaction, calmer behind the text. */
const SETTINGS: FlowSettings = { strength: 0.8, speed: 1, calm: true }
const CENTER_EASE = 0.08 // per frame: the calm zone glides with the content instead of jumping
const BACKGROUND_DELAY_MS = 6000 // after load, for a visitor who has not touched anything yet

function readColors() {
  const css = getComputedStyle(document.documentElement)
  return {
    mark: css.getPropertyValue('--bg-mark'),
    glow: css.getPropertyValue('--bg-glow'),
    green: css.getPropertyValue('--accent-deep'),
  }
}

/** Content column center in CSS px, from the same tokens the sidebar layout uses. */
function contentCenter(layout: ContentLayout, viewportWidth: number): number {
  if (layout === 'full-width') return viewportWidth / 2
  const css = getComputedStyle(document.documentElement)
  const px = (name: string) => parseFloat(css.getPropertyValue(name))
  const sidebar = px('--sidebar-w')
  const pad = sidebar + 2 * px('--sidebar-gap')
  const shift = layout === 'sidebar-collapsed' ? (px('--rail-w') - sidebar) / 2 : 0
  return pad + (viewportWidth - pad) / 2 + shift
}

/**
 * Fixed, full-viewport background behind every page: floating figures and symbols (symbol-flow.ts). It loads in
 * its own chunk after the first input (or a quiet spell), so it never competes with boot; the canvas
 * fades in on its first frame. Reduced motion gets one still frame and no loop.
 */
export function SignalFlowBackground({ layout }: { layout: ContentLayout }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const layoutRef = useRef(layout)

  useEffect(() => {
    layoutRef.current = layout
  }, [layout])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    let flow: SymbolFlow | null = null
    let frame = 0
    let cancelled = false
    let center = 0 // set in start(): reading styles here forced a style recalc during boot
    const cleanups: (() => void)[] = []
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const draw = (now: number) => {
      if (!flow) return
      const target = contentCenter(layoutRef.current, window.innerWidth)
      center += (target - center) * (reduceMotion ? 1 : CENTER_EASE)
      flow.setCenter(center)
      flow.render(now / 1000)
    }

    const loop = (now: number) => {
      draw(now)
      frame = requestAnimationFrame(loop)
    }

    const start = async () => {
      const { createSymbolFlow } = await import('./symbol-flow')
      // The figures are drawn once into sprites, so the mono face must be in first (a fallback face is fine).
      await document.fonts?.load("500 16px 'IBM Plex Mono'").catch(() => undefined)
      if (cancelled) return
      center = contentCenter(layoutRef.current, window.innerWidth)
      flow = createSymbolFlow(canvas, readColors(), SETTINGS)

      const resize = () => {
        flow?.resize(window.innerWidth, window.innerHeight)
        if (reduceMotion) draw(40_000)
      }
      resize()
      window.addEventListener('resize', resize)
      cleanups.push(() => window.removeEventListener('resize', resize))

      // Theme switch: only the figure and glow colors change; the page background shows through the canvas.
      const themeObserver = new MutationObserver(() => {
        flow?.setColors(readColors())
        if (reduceMotion) draw(40_000)
      })
      themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] })
      cleanups.push(() => themeObserver.disconnect())

      if (reduceMotion) draw(40_000)
      else frame = requestAnimationFrame(loop)
      canvas.dataset.ready = 'true'
    }

    // Decoration waits for the page to be usable: it loads on the visitor's first input or scroll, or
    // once the loaded page has sat still for a while, then on an idle slot, outside the boot window.
    const idle = window.requestIdleCallback ?? ((cb: () => void) => window.setTimeout(cb, 200))
    const cancelIdle = window.cancelIdleCallback ?? window.clearTimeout
    const WAKE_EVENTS = ['pointermove', 'pointerdown', 'touchstart', 'wheel', 'keydown', 'scroll'] as const
    let idleId = 0
    let timer = 0
    const wake = () => {
      if (idleId) return
      unlisten()
      idleId = idle(() => void start())
    }
    const unlisten = () => {
      WAKE_EVENTS.forEach((type) => window.removeEventListener(type, wake))
      window.removeEventListener('load', armTimer)
      window.clearTimeout(timer)
    }
    const armTimer = () => (timer = window.setTimeout(wake, BACKGROUND_DELAY_MS))
    WAKE_EVENTS.forEach((type) => window.addEventListener(type, wake, { passive: true, once: true }))
    if (document.readyState === 'complete') armTimer()
    else window.addEventListener('load', armTimer, { once: true })

    return () => {
      cancelled = true
      unlisten()
      if (idleId) cancelIdle(idleId)
      cancelAnimationFrame(frame)
      cleanups.forEach((fn) => fn())
      flow?.dispose()
    }
  }, [])

  return <canvas ref={canvasRef} className="app-bg" aria-hidden />
}
