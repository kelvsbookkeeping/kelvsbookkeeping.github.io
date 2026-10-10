import { useId, useState, type CSSProperties } from 'react'
import { Link } from 'react-router'
import { ArrowUpRight } from '@phosphor-icons/react'
import { chapterPath, workChapters, workSection } from '@/content/home'
import './work.css'

/** The open folder's picture is lazy, so Chrome reads its real width (`auto`); the fallback is its share of the screen. */
const SHOT_SIZES = 'auto, (min-width: 900px) 40vw, 92vw'

/**
 * Work: the projects as a stack of file folders. Each folder has a labelled tab, stepped across the top
 * like the tabs in a filing drawer; closed folders show only their tab and top edge, and the open one
 * shows its sample screen, who and when, one line on the outcome, and the link to its case study
 * (/work/<project>, a sheet over Home). Every folder starts closed, so the section reads as a stack;
 * pressing a tab opens that folder (closing the one before), and pressing the open tab closes it again.
 */
export function WorkSection() {
  const uid = useId()
  const [open, setOpen] = useState(-1) // -1: all closed

  return (
    <section id="work" className="wk wb" aria-labelledby="work-title">
      <header className="wb__head">
        <p className="wk-eyebrow">{workSection.eyebrow}</p>
        <h2 id="work-title" className="wk-title">
          <span className="wk-title__thin">{workSection.titleThin}</span> <span className="wk-title__bold">{workSection.titleBold}</span>
        </h2>
        <p className="wb__lede">{workSection.lede}</p>
      </header>
      <ol className="wf" style={{ '--n': workChapters.length } as CSSProperties}>
        {workChapters.map((chapter, i) => {
          const isOpen = i === open
          return (
            <li key={chapter.id} className="wf__folder" data-open={isOpen ? '' : undefined} style={{ '--i': i } as CSSProperties}>
              <h3 className="wf__tabwrap">
                <button type="button" id={`${uid}-tab-${i}`} className="wf__tab" aria-expanded={isOpen} aria-controls={`${uid}-sheet-${i}`} onClick={() => setOpen(isOpen ? -1 : i)}>
                  <i>{String(i + 1).padStart(2, '0')}</i>
                  <span>{chapter.title}</span>
                </button>
              </h3>
              <div id={`${uid}-sheet-${i}`} className="wf__sheet" role="region" aria-labelledby={`${uid}-tab-${i}`} inert={!isOpen}>
                <div className="wf__inner">
                  <div className="wf__content">
                    <span className="wb__window" aria-hidden>
                      <span className="wb__bar">
                        <i />
                        <b>{chapter.study?.window}</b>
                        <span>Sample screen</span>
                      </span>
                      {chapter.lead ? (
                        <img src={chapter.lead.src} srcSet={chapter.lead.srcSet} sizes={SHOT_SIZES} alt="" width={chapter.lead.width} height={chapter.lead.height} loading="lazy" decoding="async" />
                      ) : null}
                    </span>
                    <div className="wb__body">
                      <span className="wb__chips">
                        <span className="wb__chip">{chapter.study?.number}</span>
                        <span className="wb__chip wb__chip--sample">{chapter.study?.label}</span>
                      </span>
                      <b className="wb__name">{chapter.title}</b>
                      <span className="wb__meta">{chapter.study?.meta}</span>
                      <span className="wb__line">{chapter.line}</span>
                      <Link to={chapterPath(chapter.id)} state={{ sheet: true }} preventScrollReset className="wb__more">
                        View case study
                        <ArrowUpRight size={15} weight="bold" aria-hidden />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </li>
          )
        })}
      </ol>
    </section>
  )
}
