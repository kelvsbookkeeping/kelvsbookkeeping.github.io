import { useId, useState, type CSSProperties, type KeyboardEvent } from 'react'
import { Link } from 'react-router'
import { ArrowUpRight } from '@phosphor-icons/react'
import { PageMeta } from '@/app/PageMeta'
import type { PageRoute } from '@/app/routes'
import { PageHeader } from '@/components/page/PageHeader'
import { chapterPath } from '@/content/home'
import { caseSteps, showcasePage, showcaseStats } from '@/content/showcase'
import { CaseFilm } from './CaseFilm'
import './showcase.css'

const pad2 = (n: number) => String(n).padStart(2, '0')

/**
 * The five steps as a walk: the numbered list (tabs), the current step's sample screen in a window, and
 * its story under the window. Pointing at, focusing or pressing a step shows it; the arrow keys move
 * along the list. One step shows at a time.
 */
function CaseWalk({ Heading }: { Heading: 'h3' | 'h4' }) {
  const c = showcasePage
  const uid = useId()
  const [at, setAt] = useState(0)
  const step = caseSteps[at]!
  const onKey = (event: KeyboardEvent<HTMLButtonElement>) => {
    const move = { ArrowDown: 1, ArrowRight: 1, ArrowUp: -1, ArrowLeft: -1 }[event.key]
    if (!move) return
    event.preventDefault()
    const next = (at + move + caseSteps.length) % caseSteps.length
    setAt(next)
    document.getElementById(`${uid}-tab-${next}`)?.focus()
  }

  return (
    <div className="kt-walk">
      <div className="kt-walk__nav">
        <div className="kt-walk__list" role="tablist" aria-orientation="vertical" aria-label={c.stepsTitle} style={{ '--n': caseSteps.length, '--at': at } as CSSProperties}>
          {caseSteps.map((s, i) => (
            <button
              key={s.id}
              id={`${uid}-tab-${i}`}
              type="button"
              role="tab"
              className="kt-walk__tab"
              aria-selected={i === at}
              aria-controls={`${uid}-panel`}
              tabIndex={i === at ? 0 : -1}
              onClick={() => setAt(i)}
              onPointerEnter={(event) => event.pointerType === 'mouse' && setAt(i)}
              onFocus={() => setAt(i)}
              onKeyDown={onKey}
            >
              <i>{pad2(i + 1)}</i>
              {s.name}
            </button>
          ))}
        </div>
      </div>

      <div id={`${uid}-panel`} role="tabpanel" aria-labelledby={`${uid}-tab-${at}`} className="kt-walk__panel">
        <div className="kt-window">
          <p className="kt-window__bar" aria-hidden>
            <i />
            <span>{step.address}</span>
          </p>
          <div className="kt-window__screen" tabIndex={0} role="group" aria-label={c.labels.screen}>
            <img key={step.id} src={step.screen.src} alt={step.screen.alt} width={step.screen.width} height={step.screen.height} decoding="async" />
          </div>
        </div>

        <div key={step.id} className="kt-walk__story">
          <p className="kt-walk__count">
            {pad2(at + 1)} / {pad2(caseSteps.length)}
          </p>
          <Heading className="kt-walk__title">{step.title}</Heading>
          <p className="kt-walk__body">{step.body}</p>
          <p className="kt-walk__out">
            <span className="kt-label">{c.labels.out}</span>
            {step.out}
          </p>
          <div className="kt-walk__foot">
            <ul className="kt-step__tools" aria-label="Tools used">
              {step.tools.map((tool) => (
                <li key={tool.name}>
                  <img src={tool.logo} alt="" width={16} height={16} loading="lazy" decoding="async" />
                  {tool.name.replace('Microsoft ', '')}
                </li>
              ))}
            </ul>
            {step.samples.map((sample) => (
              <Link key={sample.id} className="kt-step__link" to={chapterPath(sample.id)} state={{ sheet: true }} preventScrollReset>
                {c.labels.sample}: {sample.label}
                <ArrowUpRight size={14} weight="bold" aria-hidden />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

/** The head (H1 on the page, H2 as a Home section) with the notice that this is a sample. */
function ShowcaseHeader({ nested }: { nested: boolean }) {
  const c = showcasePage
  return (
    <PageHeader level={nested ? 2 : 1} id={nested ? 'showcase-title' : undefined} eyebrow={c.eyebrow} titleThin={c.titleThin} titleBold={c.titleBold} lede={c.lede}>
      <p className="kt-notice">{c.notice}</p>
    </PageHeader>
  )
}

/** The film, the month in four figures, then the five steps as a walk. Nested = inside a Home section, so every heading steps down one level. */
function ShowcaseBody({ nested }: { nested: boolean }) {
  const c = showcasePage
  const H2 = nested ? 'h3' : 'h2'
  const H3 = nested ? 'h4' : 'h3'

  return (
    <>
      <CaseFilm />

      <dl className="kt-stats">
        {showcaseStats.map(([n, unit]) => (
          <div key={unit}>
            <dt>{n}</dt>
            <dd className="pg-mono">{unit}</dd>
          </div>
        ))}
      </dl>

      <section className="kt-case" aria-labelledby="kt-case-title">
        <H2 id="kt-case-title" className="pg-h2">
          {c.stepsTitle}
        </H2>
        <CaseWalk Heading={H3} />
      </section>
    </>
  )
}

/**
 * Showcase, "one month of books": a sample month for one fictional company, walked in order from the
 * client's documents to the month-end reports: a short film, four figures, then the
 * five steps as a walk, each with its sample screen in a window and links to the sample
 * projects that go deeper.
 */
export function ShowcasePage({ page }: { page: PageRoute }) {
  return (
    <div className="pg kt">
      <PageMeta page={page} />
      <ShowcaseHeader nested={false} />
      <ShowcaseBody nested={false} />
    </div>
  )
}

/** The same page as the Home section after Proof (the sidebar Showcase entry scrolls Home to #showcase). */
export function ShowcaseSection() {
  return (
    <section id="showcase" className="pg pg--section kt" aria-labelledby="showcase-title">
      <ShowcaseHeader nested />
      <ShowcaseBody nested />
    </section>
  )
}
