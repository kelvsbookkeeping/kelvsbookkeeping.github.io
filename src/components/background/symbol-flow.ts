/**
 * "Data in motion" background: softly glowing figures, currency signs, percent signs and tiny calculator,
 * bar chart, trend line and pie chart marks drifting left to right in loose streams, like numbers being
 * processed, with plain points of light drifting between them. Three depths: small, faint and slow far
 * away; larger, brighter and a little faster up close. Each mark brightens now and then, like a figure
 * being picked up.
 *
 * Plain 2D canvas, transparent: the page's own --bg shows through, so only the mark and glow colors follow
 * the theme. Every glyph is drawn once, with its glow, into a small sprite, so a frame is only image copies.
 * Every position is a pure function of time, so reduced motion can draw one still frame. This module is
 * loaded with a dynamic import, after first paint.
 */

export type FlowColors = { mark: string; glow: string; green: string }
export type FlowSettings = { strength: number; speed: number; calm: boolean }

const AREA_PER_MARK = 15500 // CSS px squared: about 85 marks on a laptop screen, 28 on a phone
const MIN_MARKS = 28
const MAX_MARKS = 110
const MARGIN = 80 // marks enter and leave past the edges, never popping in on screen
const SPRITE = 48 // sprite glyph size in CSS px, before the device pixel ratio
const BLUR = 12 // glow radius in CSS px, at sprite size

const TEXT_GLYPHS = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '$', '€', '£', '₱', '%', '+', '=', '÷', '×']
const LIGHT = 'light' // a plain point of light between the figures
const ICON_GLYPHS = ['calculator', 'bars', 'trend', 'pie'] as const
type Glyph = string

/** Three depths: [share of marks, size px, speed px/s, opacity]. */
const LAYERS = [
  { share: 0.45, size: [13, 17], speed: [10, 16], alpha: 0.36 },
  { share: 0.38, size: [17, 23], speed: [16, 25], alpha: 0.52 },
  { share: 0.17, size: [23, 31], speed: [25, 36], alpha: 0.7 },
] as const

type Mark = {
  glyph: Glyph
  green: boolean
  x: number // start x, CSS px
  y: number // lane y, CSS px
  size: number
  speed: number
  alpha: number
  wave: number // vertical sway amplitude, CSS px
  fw: number // sway frequency
  phase: number
  seed: number
}

function rgb(hex: string): string {
  const value = parseInt(hex.trim().replace('#', ''), 16)
  return `${(value >> 16) & 255} ${(value >> 8) & 255} ${value & 255}`
}

/** Seeded random so the field is the same on every visit. */
function seededRandom(seed: number) {
  let s = seed
  return () => (s = (s * 16807) % 2147483647) / 2147483647
}

/** Line icons in a 1 x 1 box centred on the origin. */
function drawIcon(ctx: CanvasRenderingContext2D, name: (typeof ICON_GLYPHS)[number], s: number) {
  const h = s / 2
  ctx.lineWidth = s * 0.075
  ctx.lineCap = 'round'
  ctx.lineJoin = 'round'
  ctx.beginPath()
  if (name === 'calculator') {
    const w = s * 0.7
    ctx.roundRect(-w / 2, -h, w, s, s * 0.1)
    ctx.stroke()
    ctx.strokeRect(-w / 2 + s * 0.12, -h + s * 0.12, w - s * 0.24, s * 0.2)
    for (let r = 0; r < 3; r++) {
      for (let c = 0; c < 3; c++) {
        ctx.fillRect(-w / 2 + s * (0.13 + c * 0.16), -h + s * (0.45 + r * 0.16), s * 0.1, s * 0.09)
      }
    }
  } else if (name === 'bars') {
    ctx.moveTo(-h, h)
    ctx.lineTo(h, h)
    ctx.stroke()
    ;[0.35, 0.6, 0.45, 0.9].forEach((v, i) => ctx.fillRect(-h + s * (0.08 + i * 0.24), h - s * v - s * 0.06, s * 0.15, s * v))
  } else if (name === 'trend') {
    ctx.moveTo(-h, h * 0.7)
    ctx.lineTo(-h * 0.35, 0)
    ctx.lineTo(h * 0.05, h * 0.35)
    ctx.lineTo(h * 0.85, -h * 0.75)
    ctx.moveTo(h * 0.3, -h * 0.8)
    ctx.lineTo(h * 0.88, -h * 0.8)
    ctx.lineTo(h * 0.88, -h * 0.2)
    ctx.stroke()
  } else {
    ctx.arc(0, 0, h * 0.9, 0, Math.PI * 2)
    ctx.stroke()
    ctx.beginPath()
    ctx.moveTo(0, 0)
    ctx.arc(0, 0, h * 0.9, -Math.PI / 2, Math.PI * 0.15)
    ctx.closePath()
    ctx.fill()
  }
}

/** One glyph, glowing, on a transparent sprite canvas (device pixels). */
function makeSprite(glyph: Glyph, color: string, glow: string, dpr: number): HTMLCanvasElement {
  const pad = BLUR * 2
  const side = Math.ceil((SPRITE + pad * 2) * dpr)
  const sprite = document.createElement('canvas')
  sprite.width = side
  sprite.height = side
  const ctx = sprite.getContext('2d')
  if (!ctx) return sprite
  ctx.scale(dpr, dpr)
  ctx.translate(SPRITE / 2 + pad, SPRITE / 2 + pad)
  // A wide, faint halo first: the soft light each figure floats in.
  const halo = ctx.createRadialGradient(0, 0, 0, 0, 0, SPRITE / 2 + pad)
  halo.addColorStop(0, `rgb(${glow} / ${glyph === LIGHT ? 0.55 : 0.16})`)
  halo.addColorStop(1, `rgb(${glow} / 0)`)
  ctx.fillStyle = halo
  ctx.fillRect(-SPRITE / 2 - pad, -SPRITE / 2 - pad, SPRITE + pad * 2, SPRITE + pad * 2)

  ctx.fillStyle = `rgb(${color})`
  ctx.strokeStyle = `rgb(${color})`
  ctx.shadowColor = `rgb(${glow} / 0.9)`
  ctx.shadowBlur = BLUR * dpr
  const paint = () => {
    if (glyph === LIGHT) {
      ctx.beginPath()
      ctx.arc(0, 0, SPRITE * 0.09, 0, Math.PI * 2)
      ctx.fill()
    } else if ((ICON_GLYPHS as readonly string[]).includes(glyph)) drawIcon(ctx, glyph as (typeof ICON_GLYPHS)[number], SPRITE * 0.62)
    else {
      ctx.font = `500 ${SPRITE * 0.8}px 'IBM Plex Mono', ui-monospace, monospace`
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillText(glyph, 0, SPRITE * 0.04)
    }
  }
  paint()
  paint() // a second pass deepens the glow without hardening the edge
  return sprite
}

export function createSymbolFlow(canvas: HTMLCanvasElement, colors: FlowColors, settings: FlowSettings) {
  const ctx = canvas.getContext('2d')
  let mark = rgb(colors.mark)
  let glow = rgb(colors.glow)
  let green = rgb(colors.green)
  let width = 1
  let height = 1
  let dpr = 1
  let centerX = 0.5
  let marks: Mark[] = []
  let sprites = new Map<string, HTMLCanvasElement>()

  const spriteFor = (m: Mark) => {
    const key = `${m.glyph}|${m.green ? 1 : 0}`
    let sprite = sprites.get(key)
    if (!sprite) {
      sprite = makeSprite(m.glyph, m.green ? green : mark, m.green ? green : glow, dpr)
      sprites.set(key, sprite)
    }
    return sprite
  }

  /** 1 at the edges, eased down behind the content center so text stays easy to read. */
  const calm = (x: number, y: number) => {
    if (!settings.calm) return 1
    const d = Math.hypot(x / width - centerX, (y / height - 0.5) * 1.25)
    const t = Math.min(1, Math.max(0, (d - 0.12) / 0.43))
    return 0.3 + 0.7 * t * t * (3 - 2 * t)
  }

  return {
    resize(w: number, h: number) {
      width = w
      height = h
      dpr = Math.min(window.devicePixelRatio, 1.5)
      canvas.width = Math.round(w * dpr)
      canvas.height = Math.round(h * dpr)
      ctx?.setTransform(dpr, 0, 0, dpr, 0, 0)
      sprites = new Map()

      // Lanes spread evenly down the screen, each mark jittered within its lane: an even field, no clumps.
      const count = Math.min(MAX_MARKS, Math.max(MIN_MARKS, Math.round((w * h) / AREA_PER_MARK)))
      const random = seededRandom(23)
      const span = w + 2 * MARGIN
      marks = []
      for (let i = 0; i < count; i++) {
        const pick = random()
        const layer = pick < LAYERS[0].share ? LAYERS[0] : pick < LAYERS[0].share + LAYERS[1].share ? LAYERS[1] : LAYERS[2]
        const kind = random()
        const pool: readonly Glyph[] = kind < 0.22 ? [LIGHT] : kind < 0.36 ? ICON_GLYPHS : TEXT_GLYPHS
        const glyph = pool[Math.floor(random() * pool.length)] ?? LIGHT
        const lane = (i + 0.2 + random() * 0.6) / count
        marks.push({
          glyph,
          green: random() < 0.18,
          x: random() * span,
          y: -20 + lane * (h + 40),
          size: layer.size[0] + random() * (layer.size[1] - layer.size[0]),
          speed: layer.speed[0] + random() * (layer.speed[1] - layer.speed[0]),
          alpha: layer.alpha,
          wave: 10 + random() * 26,
          fw: 0.12 + random() * 0.18,
          phase: random() * Math.PI * 2,
          seed: random(),
        })
      }
      // Far marks first, so near ones paint over them.
      marks.sort((a, b) => a.size - b.size)
    },

    /** Put the calm zone behind the content column (x in CSS px). */
    setCenter(xPx: number) {
      centerX = xPx / width
    },

    setColors(next: FlowColors) {
      mark = rgb(next.mark)
      glow = rgb(next.glow)
      green = rgb(next.green)
      sprites = new Map()
    },

    render(seconds: number) {
      if (!ctx) return
      const t = seconds * settings.speed
      const span = width + 2 * MARGIN
      ctx.clearRect(0, 0, width, height)

      for (const m of marks) {
        const x = ((((m.x + m.speed * t) % span) + span) % span) - MARGIN
        const y = m.y + Math.sin(t * m.fw + m.phase) * m.wave
        // Each mark brightens for a moment in its own slow turn, like a figure being picked up.
        const pulse = Math.max(0, Math.sin(t * 0.3 + m.seed * Math.PI * 2)) ** 8
        const alpha = (m.alpha + 0.3 * pulse) * settings.strength * calm(x, y)
        if (alpha < 0.01) continue
        const sprite = spriteFor(m)
        const scale = m.size / SPRITE
        const side = (sprite.width / dpr) * scale
        ctx.globalAlpha = Math.min(1, alpha)
        ctx.drawImage(sprite, x - side / 2, y - side / 2, side, side)
      }
      ctx.globalAlpha = 1
    },

    dispose() {
      marks = []
      sprites = new Map()
    },
  }
}

export type SymbolFlow = ReturnType<typeof createSymbolFlow>
