import { site } from '@/content/site'
import './brand.css'

/** The brand check: a short blue down-stroke into a long green up-stroke. `pathLength` lets brand.css draw each stroke. */
export function BrandCheck({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 52 60" className={className} aria-hidden="true">
      <polyline points="6,32 20,52" pathLength={1} fill="none" stroke="#13B5EA" strokeWidth="13" strokeLinecap="round" />
      <polyline points="20,52 47,7" pathLength={1} fill="none" stroke="#2CA01C" strokeWidth="13" strokeLinecap="round" />
    </svg>
  )
}

/** Your logo mark: the check on its rounded square. `className` sizes and places it. */
export function BrandMark({ className }: { className?: string }) {
  return (
    <span className={`brand-icon ${className ?? ''}`} aria-hidden>
      <BrandCheck />
    </span>
  )
}

/** The brand name as a logotype (content/site.ts `brandWord`): the check stands in for the v. */
export function BrandName({ className }: { className?: string }) {
  const { before, after, rest } = site.brandWord
  return (
    <span className={`brand-name ${className ?? ''}`} aria-hidden>
      <b>{before}</b>
      <BrandCheck className="brand-v" />
      <b>{after}</b>
      <span className="brand-name__light">{rest}</span>
    </span>
  )
}
