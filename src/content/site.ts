import type { Credential, SocialLink } from './schema'

/**
 * Who the site is about. START HERE: every page, the sidebar, the SEO tags and the legal pages read
 * these values, so changing them here changes them everywhere.
 */
export const site = {
  name: 'Kelvin Dienzo',
  brand: 'KelvsBookkeeping',
  /** The brand name as the logo draws it: `before` + a check mark (the v) + `after`, then `rest` in the light weight. */
  brandWord: { before: 'Kel', after: 's', rest: 'Bookkeeping' },
  /** Your logo mark as pictures, for the Work logo faces (the sidebar and phone bar draw it live, see
   *  components/brand/BrandMark.tsx). The navy square reads on both themes, so both point at one file. */
  logo: {
    light: '/images/brand/logo-mark.webp',
    dark: '/images/brand/logo-mark.webp',
    headerLight: '/images/brand/logo-mark-96.webp',
    headerDark: '/images/brand/logo-mark-96.webp',
  },
  /** The live address, no trailing slash. Canonical URLs, the sitemap and the JSON-LD use it. */
  url: 'https://kelvsbookkeeping.github.io',
  role: 'Accounts Assistant | Bookkeeper | Irish VAT Specialist',
  /** The role as the sidebar shows it under your name, one entry per line. */
  roleLines: ['Accounts Assistant | Bookkeeper', 'Irish VAT Specialist'],
  email: 'kelvsbookkeeping@gmail.com',
  emailSubject: 'Bookkeeping inquiry',
  replyPromise: 'Reply within one business day.',
  location: 'Caloocan City, Philippines',
  /** Two-letter country code (ISO 3166) for the Person JSON-LD address. */
  countryCode: 'PH',
  /** Your clock, shown live at the top of the sidebar. Any IANA zone, e.g. 'America/New_York'. */
  timeZone: 'Asia/Manila',
  timePlace: 'in Caloocan City',
  avatar: { src: '/images/profile/avatar-portrait.webp', alt: 'Kelvin Dienzo', width: 800, height: 800 },
  /** The sidebar picture (112px, 44px on the rail). */
  avatarSmall: '/images/profile/avatar-portrait-224.webp',
} as const

/** The year the career began (May 2016). The year counts below follow the calendar: ten in 2026, eleven in 2027. */
export const careerStartYear = 2016
export const yearsInAccounting = Math.max(1, new Date().getFullYear() - careerStartYear)
const NUMBER_WORDS = ['Zero', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen', 'Twenty']
/** The count as a word ("Ten") while there is a word for it, then as a figure. */
export const yearsInAccountingWord = NUMBER_WORDS[yearsInAccounting] ?? String(yearsInAccounting)

/** A credential shown in About and the sidebar check. Delete the `image` to show it without a badge. */
export const certification: Credential = {
  title: 'Xero Level 2 Certification',
  detail: 'Certified September 2025',
  issuer: 'Xero',
}

/** Up to five fit the sidebar header. `icon` picks the glyph in components/brand/SocialIcon.tsx. */
export const socials: SocialLink[] = [
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/kelvsbookkeeping', external: true, icon: 'linkedin' },
  { label: 'Email', href: 'mailto:kelvsbookkeeping@gmail.com', icon: 'email' },
  { label: 'OnlineJobsPH', href: 'https://v2.onlinejobs.ph/jobseekers/info/2715080', external: true, icon: 'onlinejobs' },
]

/** Off-site links the pages point at. Replace each `#` with a real URL. */
export const externalLinks = {
  showcase: '#',
  company: '#',
} as const

export function mailtoHref(): string {
  return `mailto:${site.email}?subject=${encodeURIComponent(site.emailSubject)}`
}
