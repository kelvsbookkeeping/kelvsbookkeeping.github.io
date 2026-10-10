/**
 * "Connected dots" background: a quiet field of points that drift a little and link up with their
 * neighbours, hinting at tools working together. A few points are green and glow softly in turn.
 *
 * Plain 2D canvas, transparent: the page's own --bg shows through, so only the dot and line colors
 * follow the theme. Every position is a pure function of time, so reduced motion can draw one still
 * frame. This module is loaded with a dynamic import, after first paint.
 */

export type FlowColors = { accent: string; deep: string }
export type FlowSettings = { strength: number; speed: number; calm: boolean }

const AREA_PER_DOT = 14500 // CSS px squared: about 90 dots on a laptop screen, 24 on a phone
const MIN_DOTS = 24
const MAX_DOTS = 120
const LINK = 185 // CSS px: dots closer than this are joined, fainter the further apart
const DRIFT = 46 // CSS px each dot wanders from its home
const MARGIN = 60 // the field runs past the edges, so links reach off screen instead of stopping short

type Dot = { x: number; y: number; fx: number; fy: number; px: number; py: number; green: boolean; seed: number; cx: number; cy: number; k: number }

function rgb(hex: string): string {
  const value = parseInt(hex.trim().replace('#', ''), 16)
  return `${(value >> 16) & 255} ${(value >> 8) & 255} ${value & 255}`
}

/** Seeded random so the field is the same on every visit. */
function seededRandom(seed: number) {
  let s = seed
  return () => (s = (s * 16807) % 2147483647) / 2147483647
}

export function createDotNetwork(canvas: HTMLCanvasElement, colors: FlowColors, settings: FlowSettings) {
  const ctx = canvas.getContext('2d')
  let accent = rgb(colors.accent)
  let deep = rgb(colors.deep)
  let width = 1
  let height = 1
  let centerX = 0.5
  let dots: Dot[] = []

  /** 1 at the edges, eased down behind the content center so text stays easy to read. */
  const calm = (x: number, y: number) => {
    if (!settings.calm) return 1
    const d = Math.hypot(x / width - centerX, (y / height - 0.5) * 1.25)
    const t = Math.min(1, Math.max(0, (d - 0.12) / 0.43))
    return 0.34 + 0.66 * t * t * (3 - 2 * t)
  }

  return {
    resize(w: number, h: number) {
      width = w
      height = h
      const dpr = Math.min(window.devicePixelRatio, 1.5)
      canvas.width = Math.round(w * dpr)
      canvas.height = Math.round(h * dpr)
      ctx?.setTransform(dpr, 0, 0, dpr, 0, 0)

      // A jittered grid, not pure chance: the dots cover the screen evenly, with no clumps or bald patches.
      const count = Math.min(MAX_DOTS, Math.max(MIN_DOTS, Math.round((w * h) / AREA_PER_DOT)))
      const cols = Math.max(2, Math.round(Math.sqrt((count * w) / h)))
      const rows = Math.max(2, Math.ceil(count / cols))
      const cellW = (w + 2 * MARGIN) / cols
      const cellH = (h + 2 * MARGIN) / rows
      const random = seededRandom(11)
      dots = []
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          dots.push({
            x: -MARGIN + (c + 0.15 + random() * 0.7) * cellW,
            y: -MARGIN + (r + 0.15 + random() * 0.7) * cellH,
            fx: 0.05 + random() * 0.07,
            fy: 0.05 + random() * 0.07,
            px: random() * Math.PI * 2,
            py: random() * Math.PI * 2,
            green: random() < 0.2,
            seed: random(),
            cx: 0,
            cy: 0,
            k: 1,
          })
        }
      }
    },

    /** Put the calm zone behind the content column (x in CSS px). */
    setCenter(xPx: number) {
      centerX = xPx / width
    },

    setColors(next: FlowColors) {
      accent = rgb(next.accent)
      deep = rgb(next.deep)
    },

    render(seconds: number) {
      if (!ctx) return
      const t = seconds * settings.speed
      ctx.clearRect(0, 0, width, height)

      // Where each dot is now (cx, cy), and how calm its spot is (k).
      for (const d of dots) {
        d.cx = d.x + Math.sin(t * d.fx + d.px) * DRIFT
        d.cy = d.y + Math.cos(t * d.fy + d.py) * DRIFT
        d.k = calm(d.cx, d.cy)
      }

      ctx.lineWidth = 1
      dots.forEach((p, i) => {
        for (const q of dots.slice(i + 1)) {
          const dist = Math.hypot(p.cx - q.cx, p.cy - q.cy)
          if (dist >= LINK) continue
          const alpha = 0.38 * (1 - dist / LINK) * settings.strength * Math.min(p.k, q.k)
          ctx.strokeStyle = `rgb(${p.green && q.green ? deep : accent} / ${alpha.toFixed(3)})`
          ctx.beginPath()
          ctx.moveTo(p.cx, p.cy)
          ctx.lineTo(q.cx, q.cy)
          ctx.stroke()
        }
      })

      for (const d of dots) {
        const strength = settings.strength * d.k
        // Each green dot brightens for a moment in its own slow turn, like a tick landing.
        const glow = d.green ? Math.max(0, Math.sin(t * 0.35 + d.seed * Math.PI * 2)) ** 6 : 0
        if (glow > 0.02) {
          ctx.fillStyle = `rgb(${deep} / ${(0.16 * glow * strength).toFixed(3)})`
          ctx.beginPath()
          ctx.arc(d.cx, d.cy, 9, 0, Math.PI * 2)
          ctx.fill()
        }
        ctx.fillStyle = `rgb(${d.green ? deep : accent} / ${((0.5 + 0.4 * glow) * strength).toFixed(3)})`
        ctx.beginPath()
        ctx.arc(d.cx, d.cy, d.green ? 2.4 : 2, 0, Math.PI * 2)
        ctx.fill()
      }
    },

    dispose() {
      dots = []
    },
  }
}

export type DotNetwork = ReturnType<typeof createDotNetwork>
