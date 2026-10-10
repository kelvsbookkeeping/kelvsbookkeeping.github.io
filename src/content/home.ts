import type { Image, WorkChapter } from './schema'
import { method } from './method'
import { sampleNotice, sampleProjects, workCount } from './work'
import { sampleShots } from './sample-shots'

/**
 * Home page copy. The hero pairs a thin line with a bold one. The bold line is sized in `cqi` in
 * features/home/hero/hero.css so it fills the column: re-measure it when you change the words
 * (see the comment on `.hero__title` there).
 */
export const homeHero = {
  headlineThin: 'Clean books. On-time VAT.',
  headlineBold: 'Numbers you can trust.',
  subhead: 'I help business owners keep their books current and file VAT accurately and on time.',
  cta: { label: 'Get in touch', to: '/#contact' },
}

/**
 * The statement under the hero: words light up as the page scrolls, each keyword lands bold and
 * moves the tracker. Replace the words, keep four keywords (the tracker shows them in order).
 * A string is plain words; `{ key }` is a keyword. A keyword's `label` is what the tracker shows for
 * it (a step of the method); without one the tracker repeats the keyword.
 */
export type ManifestoPart = string | { key: string; label?: string }

export const homeManifesto = {
  eyebrow: method.eyebrow,
  parts: [
    'Your books, balanced. Your evenings, back. I turn',
    { key: 'shoeboxes', label: 'Receive' },
    'of',
    { key: 'receipts', label: 'Post' },
    'into',
    { key: 'clean,', label: 'Import' },
    { key: 'reconciled', label: 'Reconcile' },
    'monthly reports, using tools like Xero and QuickBooks so small business owners always know where their',
    { key: 'money', label: 'Close' },
    'went and what they can spend next.',
  ] satisfies ManifestoPart[],
}

export const homeSections = {
  work: {
    eyebrow: 'Selected work',
    title: 'Sample projects.',
    lede: 'Sample case studies showing how I work. Client books are confidential, so the company and every figure are fictional.',
  },
  proof: {
    eyebrow: 'Proof',
    title: 'What I run for clients today.',
  },
  objections: {
    eyebrow: 'Before you write',
    title: 'The three questions everyone asks.',
  },
}

export const ctaBand = {
  title: 'Tell me what is eating your week.',
  body: 'PLACEHOLDER - tell me what to put here: one or two sentences on what the visitor gets when they write to you.',
  button: 'Email me your question',
}

/* ---------- Work section ---------- */

/** Full-size covers, 1800x1125, with 480 / 640 / 960 copies for the Work tiles (scripts/sample-projects/build.mjs). */
const cover = (id: string, alt: string): Image => ({
  src: `/images/covers/${id}.webp`,
  alt,
  width: 1800,
  height: 1125,
  srcSet: [480, 640, 960].map((w) => `/images/covers/${w}/${id}.webp ${w}w`).join(', ') + `, /images/covers/${id}.webp 1800w`,
})

/** The URL of a chapter's showcase sheet. Real, shareable and in the sitemap. */
export const chapterPath = (id: string) => `/work/${id}`

export const workSection = {
  ...homeSections.work,
  /** The title as one display line in the hero's thin + bold pairing. */
  titleThin: 'Sample',
  titleBold: 'projects.',
  all: { label: `See all ${workCount} sample projects`, to: '/work' },
}

/**
 * The Work chapters, in bento order: one per sample project (content/work.ts). The bento, the sheets and
 * the sitemap follow this list (the bento's grid areas in work.css are keyed by chapter id).
 */
export const workChapters: WorkChapter[] = sampleProjects.map((project, i) => ({
  id: project.id,
  title: project.title,
  line: project.line,
  count: 1,
  unit: 'sample',
  description: project.description,
  marks: project.tools,
  items: [],
  lead: cover(`sample-${project.id}`, `${project.title}: the sample report for a fictional company`),
  link: { label: 'Open the full sample', href: project.href, external: true },
  study: {
    ...sampleNotice,
    number: `Project ${String(i + 1).padStart(2, '0')}`,
    meta: [sampleNotice.company, ...project.tools.map((tool) => tool.name.replace('Microsoft ', '')), project.when].join(' · '),
    window: project.window,
    screen: { src: `/images/covers/sample-${project.id}-full.webp`, alt: `${project.window}: the full sample screen, fictional data`, ...sampleShots[project.id]! },
    brief: project.brief,
    did: project.did,
    result: project.result,
    tools: project.tools,
  },
}))

export const findChapter = (id: string | undefined) => workChapters.find((chapter) => chapter.id === id)
