import { ArrowUpRight, GraduationCap, MapPin } from '@phosphor-icons/react'
import { aboutSection, credentials, toolGroups, type AboutCredential } from '@/content/about'
import { certification, externalLinks, socials } from '@/content/site'
import { personJsonLd } from '@/lib/seo'
import './about.css'

/** The mark for a credential that has no logo. */
const CRED_ICON = { degree: GraduationCap, place: MapPin, xero: MapPin, quickbooks: MapPin } as const

const personLd = personJsonLd({
  description: aboutSection.lede,
  skills: toolGroups.flatMap((group) => group.tools.map((t) => t.tool.name)),
  credential: { name: certification.title, id: certification.detail.replace(/^(Member|Credential) ID /, ''), url: certification.href },
  sameAs: [...socials.filter((s) => !s.partner && s.href.startsWith('http')).map((s) => s.href), ...(certification.href ? [certification.href] : [])],
  companyUrl: externalLinks.company,
})

function Credential({ c }: { c: AboutCredential }) {
  const Mark = CRED_ICON[c.id]
  const body = (
    <>
      <span className="ab__cred-mark">
        {c.image ? <img className={c.imageDark ? 'only-light' : undefined} src={c.image.src} alt="" width={c.image.width} height={c.image.height} loading="lazy" decoding="async" /> : <Mark size={16} weight="fill" aria-hidden />}
        {c.imageDark ? <img className="only-dark" src={c.imageDark.src} alt="" width={c.imageDark.width} height={c.imageDark.height} loading="lazy" decoding="async" /> : null}
      </span>
      <span className="ab__cred-copy">
        <b>{c.title}</b>
        <small>{c.detail}</small>
      </span>
    </>
  )
  return c.href ? (
    <a className="ab__cred" href={c.href} target="_blank" rel="noopener noreferrer">
      {body}
      <ArrowUpRight className="ab__cred-go" size={15} weight="bold" aria-hidden />
    </a>
  ) : (
    <span className="ab__cred">{body}</span>
  )
}

/**
 * About, "The floor": the desk illustration set large, standing on a
 * hairline floor that runs edge to edge, the story set over its space; the tools as grouped cards
 * (each logo on a raised paper key, with its level) and the credentials sit below the floor. The picture rises onto the
 * floor as it scrolls in (CSS scroll-driven, compositor only; still under reduced motion).
 */
export function AboutSection() {
  const s = aboutSection
  return (
    <section id="about" className="ab" aria-labelledby="ab-title">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: personLd }} />
      <header>
        <p className="wk-eyebrow">{s.eyebrow}</p>
        <h2 id="ab-title" className="wk-title">
          <span>{s.titleThin}</span> <span className="wk-title__bold">{s.titleBold}</span>
        </h2>
        <p className="ab__lede">{s.lede}</p>
      </header>

      <div className="ab__stage">
        <p className="ab__lead">
          {s.lead} <span>{s.leadQuiet}</span>
        </p>
        <div className="ab__pic">
          <img
            src={s.picture.src}
            srcSet={s.picture.srcSet}
            sizes="auto, (min-width: 1024px) 46vw, 92vw"
            alt={s.picture.alt}
            width={s.picture.width}
            height={s.picture.height}
            loading="lazy"
            decoding="async"
          />
        </div>
      </div>

      <div className="ab__below">
        <ul className="ab__groups">
          {toolGroups.map((group) => (
            <li key={group.title} className="ab__group">
              <h3 className="ab__group-title">{group.title}</h3>
              <ul className="ab__tools">
                {group.tools.map(({ tool, level }) => (
                  <li key={tool.name} className="ab__tool">
                    <span className="ab__key">
                      <img src={tool.logo} alt="" width={20} height={20} loading="lazy" decoding="async" />
                    </span>
                    <span className="ab__tool-name">{tool.name}</span>
                    <span className="ab__level" data-level={level}>
                      {level}
                    </span>
                  </li>
                ))}
              </ul>
              {group.note ? <p className="ab__group-note">{group.note}</p> : null}
            </li>
          ))}
        </ul>
      </div>

      <div className="ab__creds">
        {credentials.map((c) => (
          <Credential key={c.id} c={c} />
        ))}
      </div>
    </section>
  )
}
