import { services, servicesSection } from '@/content/services'
import './services.css'

/**
 * Services, "Ledger". Every service is one ruled line of a ledger page: an account-style code, the
 * service, what it covers, and the tools it runs on, closed with a double rule and a total like a
 * finished account. A still layout, no scroll scene: it reads top to bottom like a statement.
 */
export function ServicesSection() {
  const { columns, total } = servicesSection

  return (
    <section id="services" className="sv" aria-labelledby="services-title">
      <header className="sv__head">
        <p className="sv__eyebrow">
          {servicesSection.eyebrow}
          <span className="sv__rule" aria-hidden />
        </p>
        <h2 id="services-title" className="sv__title">
          <span>{servicesSection.titleThin}</span> <b>{servicesSection.titleBold}</b>
        </h2>
        <p className="sv__lede">{servicesSection.lede}</p>
      </header>

      <div className="sv__ledger">
        <div className="sv__row sv__row--head" aria-hidden>
          <span>{columns.code}</span>
          <span>{columns.service}</span>
          <span>{columns.detail}</span>
          <span>{columns.tools}</span>
        </div>
        <ol className="sv__rows">
          {services.map((service) => (
            <li key={service.id} className="sv__row">
              <span className="sv__code">{service.code}</span>
              <span className="sv__name">{service.title}</span>
              <span className="sv__desc">{service.summary}</span>
              <span className="sv__tools">
                {service.tools.map((tool) => (
                  <span key={tool}>{tool}</span>
                ))}
              </span>
            </li>
          ))}
        </ol>
        <p className="sv__row sv__row--total">
          <span>{total.label}</span>
          <span>
            {services.length} {total.unit}
          </span>
          <span>{total.note}</span>
        </p>
      </div>
    </section>
  )
}
