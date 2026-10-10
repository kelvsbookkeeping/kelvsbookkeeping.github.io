import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react'
import type { Icon } from '@phosphor-icons/react'
import { ArrowsLeftRight, Bank, CaretLeft, CaretRight, Check, CheckCircle, Database, FileCsv, FileText, FileXls, Pause, Play, Receipt, SealCheck, Tag, Tray } from '@phosphor-icons/react'
import { BrandMark, BrandName } from '@/components/brand/BrandMark'
import { caseFilm, type FilmScene } from '@/content/showcase'

const INTRO_MS = 6200
const SCENE_MS = 6800
const OUTRO_MS = 5200
const pad2 = (n: number) => String(n).padStart(2, '0')
/** When a part of a scene starts moving, in ms from the scene's start (showcase.css reads --d as its delay). */
const at = (ms: number) => ({ '--d': `${ms}ms` }) as CSSProperties
const prefersReducedMotion = () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

/**
 * The Showcase film: The Bookkeeper Method as a short looping animation, drawn live (no video file).
 * It opens on the promise and the five steps as a flow, plays one scene per step (its number and a
 * progress strip on top, the headline on the left, the step acted out on a card on the right), and
 * closes on one line. It plays only while on screen, has a pause button, and under reduced motion it
 * stands still on a scene with previous / next to step through. The stage is decorative: the steps
 * below say the same in text.
 */
export function CaseFilm() {
  const scenes = caseFilm.scenes
  const last = scenes.length + 1 // 0 = the opening, 1..n = the scenes, n + 1 = the closing line
  const ref = useRef<HTMLDivElement>(null)
  // Reduced motion: no autoplay, and start on the first scene rather than the opening.
  const [index, setIndex] = useState(() => (prefersReducedMotion() ? 1 : 0))
  const [playing, setPlaying] = useState(() => !prefersReducedMotion())
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(([entry]) => setInView(!!entry?.isIntersecting), { threshold: 0.35 })
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  const running = playing && inView
  useEffect(() => {
    if (!running) return
    const wait = index === 0 ? INTRO_MS : index === last ? OUTRO_MS : SCENE_MS
    const timer = window.setTimeout(() => setIndex((i) => (i >= last ? 0 : i + 1)), wait)
    return () => window.clearTimeout(timer)
  }, [running, index, last])

  const step = (by: number) => {
    setPlaying(false)
    setIndex((i) => (i + by + last + 1) % (last + 1))
  }
  const scene = index >= 1 && index <= scenes.length ? scenes[index - 1] : undefined

  return (
    <div ref={ref} className="kf" data-running={running || undefined}>
      <div className="kf__stage" aria-hidden>
        <span className="kf__glow" />
        {scene ? (
          <>
            <div className="kf__top">
              <span className="kf__brand">
                <BrandMark className="kf__mark" />
                <BrandName className="kf__name" />
              </span>
              <span className="kf__count">
                <b>{pad2(index)}</b> / {pad2(scenes.length)}
              </span>
              <span className="kf__dashes">
                {scenes.map((s, i) => (
                  <i key={s.id} data-state={i < index - 1 ? 'done' : i === index - 1 ? 'now' : undefined} style={{ '--ms': `${SCENE_MS}ms` } as CSSProperties} />
                ))}
              </span>
            </div>
            <Scene key={scene.id} scene={scene} />
          </>
        ) : index === 0 ? (
          <Opening key="opening" />
        ) : (
          <Closing key="closing" />
        )}
      </div>

      <div className="kf__controls">
        <button type="button" onClick={() => setPlaying((p) => !p)} aria-label={playing ? 'Pause the animation' : 'Play the animation'}>
          {playing ? <Pause size={16} weight="fill" aria-hidden /> : <Play size={16} weight="fill" aria-hidden />}
          {playing ? 'Pause' : 'Play'}
        </button>
        <button type="button" onClick={() => step(-1)} aria-label="Previous scene">
          <CaretLeft size={16} weight="bold" aria-hidden />
        </button>
        <button type="button" onClick={() => step(1)} aria-label="Next scene">
          <CaretRight size={16} weight="bold" aria-hidden />
        </button>
        <p className="kf__caption" aria-live="polite">
          {scene ? `${pad2(index)} · ${scene.eyebrow}` : index === 0 ? caseFilm.caption : caseFilm.closing.caption}
        </p>
      </div>
    </div>
  )
}

/** The opening: the brand, the promise line by line, then the five steps as a flow. */
function Opening() {
  const { eyebrow, lines, trust } = caseFilm.opening
  return (
    <div className="kf__intro">
      <span className="kf__intro-brand">
        <BrandMark className="kf__mark" />
        <BrandName className="kf__name" />
      </span>
      <p className="kf__kicker" style={at(350)}>
        {eyebrow}
      </p>
      <p className="kf__quote">
        {lines.map((line, i) => (
          <span key={line} style={at(700 + i * 480)}>
            {line}
          </span>
        ))}
        <span style={at(700 + lines.length * 480)}>
          {trust.before} <b>{trust.word}</b>
        </span>
      </p>
      <ol className="kf__flow">
        {caseFilm.scenes.map((s, i) => (
          <li key={s.id} style={at(2700 + i * 420)}>
            <i>{pad2(i + 1)}</i>
            {s.eyebrow}
          </li>
        ))}
      </ol>
    </div>
  )
}

/** The closing line: the five steps tick off along one line, then the statement. */
function Closing() {
  const { thin, bold } = caseFilm.closing
  const n = caseFilm.scenes.length
  return (
    <div className="kf__intro kf__outro">
      <ol className="kf__ticks" style={{ '--n': n } as CSSProperties}>
        {caseFilm.scenes.map((s, i) => (
          <li key={s.id} style={at(350 + i * 380)}>
            <i>
              <Check size={18} weight="bold" />
            </i>
            {s.eyebrow}
          </li>
        ))}
      </ol>
      <p className="kf__close" style={at(350 + n * 380 + 200)}>
        <span>{thin}</span> <b>{bold}</b>
      </p>
      <span className="kf__intro-brand kf__outro-brand" style={at(350 + n * 380 + 900)}>
        <BrandMark className="kf__mark" />
        <BrandName className="kf__name" />
      </span>
    </div>
  )
}

function Scene({ scene }: { scene: FilmScene }) {
  const Visual = VISUALS[scene.id]
  return (
    <div className="kf__scene">
      <div className="kf__copy">
        <p className="kf__eyebrow">{scene.eyebrow}</p>
        <p className="kf__title">
          <span>{scene.thin}</span>
          <b>{scene.bold}</b>
        </p>
        <p className="kf__sub">{scene.sub}</p>
      </div>
      <div className="kf__visual">{Visual ? <Visual /> : null}</div>
    </div>
  )
}

/** The white card every step is acted out on: an icon, a title and a line, then the step's own parts. */
function Card({ icon: Glyph, title, sub, children }: { icon: Icon; title: string; sub: string; children: ReactNode }) {
  return (
    <div className="kf-card">
      <div className="kf-card__head">
        <span className="kf-card__ico">
          <Glyph size={22} weight="fill" />
        </span>
        <span>
          <b>{title}</b>
          <small>{sub}</small>
        </span>
      </div>
      {children}
    </div>
  )
}

const Tick = ({ ms }: { ms: number }) => (
  <i className="kf-tick" style={at(ms)}>
    <Check size={11} weight="bold" />
  </i>
)

/** Receive: documents float into the inbox one by one, stack, and each gets a small check. */
function ReceiveVisual() {
  const v = caseFilm.visuals.receive
  const icons = [FileText, Receipt, FileText, Bank]
  return (
    <Card icon={Tray} title={v.title} sub={v.sub}>
      <ul className="kf-docs">
        {v.docs.map((doc, i) => {
          const Glyph = icons[i % icons.length]!
          return (
            <li key={doc.name} style={at(500 + i * 700)}>
              <Glyph size={18} weight="fill" />
              <span>{doc.name}</span>
              <b>{doc.amount}</b>
              <Tick ms={500 + i * 700 + 560} />
            </li>
          )
        })}
      </ul>
      <p className="kf-card__foot" style={at(500 + v.docs.length * 700 + 300)}>
        <span>{v.foot.label}</span>
        <b>{v.foot.value}</b>
      </p>
    </Card>
  )
}

/** Post: a transaction drops into the ledger and is labelled; the cursor clicks Post; the rows appear; a check confirms. */
function PostVisual() {
  const v = caseFilm.visuals.post
  return (
    <Card icon={Tag} title={v.title} sub={v.sub}>
      <div className="kf-txn" style={at(450)}>
        <p>
          <span>{v.txn.name}</span>
          <b>{v.txn.amount}</b>
        </p>
        <p>
          {v.txn.labels.map((label, i) => (
            <em key={label} style={at(1100 + i * 420)}>
              {label}
            </em>
          ))}
          <span className="kf-btn" style={at(2700)}>
            {v.button}
            <svg className="kf-cursor" viewBox="0 0 20 20" style={at(1950)}>
              <path d="M4 2l11 7.5-5 1.2 3 5.6-2.3 1.2-3-5.7L4 15z" />
            </svg>
          </span>
        </p>
      </div>
      <ul className="kf-rows">
        {v.rows.map((row, i) => (
          <li key={row.label} style={at(3150 + i * 380)}>
            <span>{row.label}</span>
            <b>{row.value}</b>
          </li>
        ))}
      </ul>
      <p className="kf-card__foot" style={at(3150 + v.rows.length * 380 + 250)}>
        <span>{v.foot.label}</span>
        <b>
          {v.foot.value} <CheckCircle size={16} weight="fill" />
        </b>
      </p>
    </Card>
  )
}

/** Import: files travel along an arrow into the database and come out as transaction rows. */
function ImportVisual() {
  const v = caseFilm.visuals.import
  const icons = [FileCsv, FileXls, FileText]
  return (
    <Card icon={Bank} title={v.title} sub={v.sub}>
      <div className="kf-pipe">
        <ul>
          {v.files.map((file, i) => {
            const Glyph = icons[i % icons.length]!
            return (
              <li key={file} style={at(350 + i * 220)}>
                <Glyph size={16} weight="fill" />
                {file}
              </li>
            )
          })}
        </ul>
        <span className="kf-pipe__track">
          {v.files.map((file, i) => (
            <i key={file} style={at(1100 + i * 520)} />
          ))}
        </span>
        <span className="kf-pipe__db" style={at(1700)}>
          <Database size={30} weight="fill" />
          <small>{v.target}</small>
        </span>
      </div>
      <ul className="kf-rows">
        {v.rows.map((row, i) => (
          <li key={row.label} style={at(3000 + i * 400)}>
            <span>{row.label}</span>
            <b>{row.value}</b>
          </li>
        ))}
      </ul>
      <p className="kf-card__foot" style={at(3000 + v.rows.length * 400 + 250)}>
        <span>{v.foot.label}</span>
        <b>{v.foot.value}</b>
      </p>
    </Card>
  )
}

/** Reconcile: bank and ledger side by side; matches connect and light up, one difference is flagged, then resolved. */
function ReconcileVisual() {
  const v = caseFilm.visuals.reconcile
  return (
    <Card icon={ArrowsLeftRight} title={v.title} sub={v.sub}>
      <div className="kf-match">
        <p className="kf-match__head">
          <span>{v.columns[0]}</span>
          <i />
          <span>{v.columns[1]}</span>
        </p>
        {v.rows.map((row, i) => {
          const ms = 550 + i * 650
          return (
            <p key={row.bank} className="kf-match__row" data-flag={row.flag ? '' : undefined} style={at(ms)}>
              <b>{row.bank}</b>
              <i />
              <span>
                {row.flag ? (
                  <>
                    <em className="kf-match__flag">{row.flag}</em>
                    <em className="kf-match__ok">{row.ledger}</em>
                  </>
                ) : (
                  row.ledger
                )}
              </span>
            </p>
          )
        })}
      </div>
      <p className="kf-card__foot" style={at(550 + v.rows.length * 650 + 1300)}>
        <span>{v.foot.label}</span>
        <b>
          {v.foot.value} <CheckCircle size={16} weight="fill" />
        </b>
      </p>
    </Card>
  )
}

/** Close: the checklist completes, the period-end report appears, and a large check seals it: Period Closed. */
function CloseVisual() {
  const v = caseFilm.visuals.close
  const sealAt = 500 + v.checks.length * 480 + 1500
  return (
    <Card icon={CheckCircle} title={v.title} sub={v.sub}>
      <div className="kf-close">
        <ul className="kf-checks">
          {v.checks.map((check, i) => (
            <li key={check} style={at(500 + i * 480)}>
              <Tick ms={500 + i * 480 + 260} />
              {check}
            </li>
          ))}
        </ul>
        <div className="kf-report" style={at(500 + v.checks.length * 480 + 300)}>
          <b>{v.report.title}</b>
          <small>{v.report.sub}</small>
          <span className="kf-report__bars">
            {v.report.bars.map((h, i) => (
              <i key={i} style={{ '--h': `${h}%`, ...at(500 + v.checks.length * 480 + 700 + i * 130) } as CSSProperties} />
            ))}
          </span>
        </div>
        <p className="kf-seal" style={at(sealAt)}>
          <SealCheck size={46} weight="fill" />
          <b>{v.seal}</b>
        </p>
      </div>
    </Card>
  )
}

const VISUALS: Record<string, () => ReactNode> = { receive: ReceiveVisual, post: PostVisual, import: ImportVisual, reconcile: ReconcileVisual, close: CloseVisual }
