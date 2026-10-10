import type { ReactNode } from 'react'
import { PageMeta } from '@/app/PageMeta'
import type { PageRoute } from '@/app/routes'
import { PageHeader } from '@/components/page/PageHeader'
import { ArrowUpRight, Medal, SealCheck } from '@phosphor-icons/react'
import { certificates, clientAccounts, communityQuotes, processGuides, proofPage, videoTestimonials } from '@/content/proof'
import { isoDay, proofJsonLd } from '@/lib/seo'
import './proof.css'

const pad2 = (n: number) => String(n).padStart(2, '0')

/** One band of the ledger: a label that holds while its band scrolls by, the record beside it. */
function Band({ id, title, count, nested, children }: { id: string; title: string; count: string; nested: boolean; children: ReactNode }) {
  const H = nested ? 'h3' : 'h2'
  return (
    <section className="pf-band" aria-labelledby={id}>
      <div className="pf-band__label">
        <H id={id}>{title}</H>
        <span className="pg-mono">{count}</span>
      </div>
      <div className="pf-band__body">{children}</div>
    </section>
  )
}

/** The bands (the community one only once there is a quote). Nested = inside a Home section, so every heading steps down one level. */
function ProofLedger({ nested }: { nested: boolean }) {
  const c = proofPage
  const Role = nested ? 'h4' : 'h3'

  return (
    <div className="pf-ledger">
      <Band id="pf-certs" title={c.bands.certificates} count={`${pad2(certificates.length)} badges`} nested={nested}>
        <ul className="pf-certs">
          {certificates.map((cert) => (
            <li key={cert.id}>
              <a className="pf-cert" href={cert.verify ?? cert.full} target="_blank" rel="noopener">
                <span className="pf-cert__badge" aria-hidden>
                  <span className="pf-cert__seal">
                    {cert.logo ? <img src={cert.logo} alt="" width={64} height={64} loading="lazy" decoding="async" /> : <Medal weight="fill" />}
                  </span>
                  <SealCheck className="pf-cert__tick" weight="fill" />
                </span>
                <Role>{cert.title}</Role>
                <span className="pg-mono">{cert.issuer}</span>
                <span className="pg-mono">{cert.date}</span>
                <span className="pf-cert__open">
                  {cert.verify ? c.verify : c.open}
                  <ArrowUpRight size={13} weight="bold" aria-hidden />
                </span>
              </a>
            </li>
          ))}
        </ul>
      </Band>

      {communityQuotes.length ? (
      <Band id="pf-quotes" title={c.bands.quotes} count={`${pad2(communityQuotes.length)} notes`} nested={nested}>
        {communityQuotes.map((q) => (
          <blockquote key={q.text} className="pf-quote">
            <p>{q.text}</p>
            <footer>
              <cite>{q.name}</cite>
              <span className="pg-mono">{q.context}</span>
              <time className="pg-mono" dateTime={isoDay(q.date)}>
                {q.date}
              </time>
            </footer>
          </blockquote>
        ))}
      </Band>
      ) : null}

      <Band id="pf-guides" title={c.bands.guides} count={`${pad2(processGuides.length)} guides`} nested={nested}>
        <p className="pf-guides__note">{c.guidesNote}</p>
        {processGuides.map((guide) => (
          <details key={guide.id} className="pf-guide" name="pf-guide">
            <summary>
              <Role>{guide.title}</Role>
              <span className="pg-mono">{guide.tool}</span>
            </summary>
            <div className="pf-guide__body">
              <p>
                <b>When to use it.</b> {guide.when}
              </p>
              {guide.methods.map((method, i) => (
                <div key={method.name ?? i}>
                  {method.name ? <p className="pf-guide__method">{method.name}</p> : null}
                  <ol>
                    {method.steps.map((step) => (
                      <li key={step.text}>
                        {step.text}
                        {step.shot ? (
                          <span className="pf-shot">
                            <img src={step.shot.src} alt={step.shot.alt} width={step.shot.width} height={step.shot.height} loading="lazy" decoding="async" />
                          </span>
                        ) : null}
                      </li>
                    ))}
                  </ol>
                </div>
              ))}
              <p className="pf-guide__check">
                <b>Check.</b> {guide.check}
              </p>
            </div>
          </details>
        ))}
      </Band>

      <Band id="pf-clients" title={c.bands.clients} count={`${pad2(clientAccounts.length)} roles`} nested={nested}>
        {clientAccounts.map((a, i) => (
          <div key={a.label} className="pf-account">
            <span className="pf-key" data-blank={a.logo ? undefined : ''}>
              {a.logo ? <img src={a.logo.src} alt="" width={a.logo.width} height={a.logo.height} loading="lazy" decoding="async" /> : pad2(i + 1)}
            </span>
            <div>
              <Role>{a.role}</Role>
              <p className="pg-mono">{a.label}</p>
            </div>
            <div className="pf-account__work">
              <p>{a.work}</p>
              <ul className="pf-tags">
                {a.tags.map((t) => (
                  <li key={t} className="pg-mono">
                    {t}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </Band>
    </div>
  )
}

/**
 * Proof, "the ledger": hairline bands to scan like a record: the certificates and awards as documents
 * that open full size, the community notes once there are any, and the roles held as client accounts.
 */
export function ProofPage({ page }: { page: PageRoute }) {
  const c = proofPage

  return (
    <div className="pg pf">
      <PageMeta page={page} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: proofJsonLd({ path: page.path, title: page.title, description: page.description, quotes: communityQuotes, videos: videoTestimonials }),
        }}
      />

      <PageHeader eyebrow={c.eyebrow} titleThin={c.titleThin} titleBold={c.titleBold} lede={c.lede} />
      <ProofLedger nested={false} />
    </div>
  )
}

/** The same ledger as a Home section after About (the sidebar Proof entry scrolls Home to #proof). */
export function ProofSection() {
  const c = proofPage

  return (
    <section id="proof" className="pg pg--section pf" aria-labelledby="proof-title">
      <PageHeader level={2} id="proof-title" eyebrow={c.eyebrow} titleThin={c.titleThin} titleBold={c.titleBold} lede={c.lede} />
      <ProofLedger nested />
    </section>
  )
}
