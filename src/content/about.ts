import type { Image, ToolMark } from './schema'
import { certification, site, yearsInAccountingWord } from './site'
import { tools } from './tools'

/**
 * The Home About section: the desk illustration stands on a hairline floor with the lead over its
 * space; the tools as grouped cards (logo, name, level), credentials below. The roles held are in Proof.
 */
export const aboutSection = {
  eyebrow: 'About',
  titleThin: "Hi, I'm",
  titleBold: `${site.name}.`,
  lede: 'My aim is to be your reliable accounts assistant and bookkeeper, so the books stop taking up your mind and your energy.',
  /** The year count is worked out from the year the career began (content/site.ts), so it moves on by itself each January. */
  lead: `${yearsInAccountingWord} years in accounting.`,
  leadQuiet: 'Today I keep the books current, file VAT on time and close the month for business owners.',
  picture: {
    src: '/images/profile/desk.webp',
    srcSet: '/images/profile/800/desk.webp 800w, /images/profile/desk.webp 1200w',
    alt: `Illustration of ${site.name} at a desk, working at a monitor with a coffee beside them`,
    width: 1200,
    height: 889,
  } satisfies Image,
}

/** How well a tool is known. The badge beside each tool shows it. */
export type ToolLevel = 'Advanced' | 'Proficient' | 'Familiar' | 'Basic'

/** The tool cards under the story: one card per group, each tool with its level, and an optional note. */
export const toolGroups: { title: string; note?: string; tools: { tool: ToolMark; level: ToolLevel }[] }[] = [
  {
    title: 'Accounting Software',
    note: 'Xero Level 2 certified. QuickBooks Online ProAdvisor.',
    tools: [
      { tool: tools.xero, level: 'Advanced' },
      { tool: tools.quickbooks, level: 'Advanced' },
    ],
  },
  {
    title: 'Document Capture',
    note: 'Bills and receipts captured and published to the ledger.',
    tools: [
      { tool: tools.dext, level: 'Proficient' },
      { tool: tools.hubdoc, level: 'Proficient' },
    ],
  },
  {
    title: 'ERP & Procurement',
    note: 'Basic working knowledge, not daily tools.',
    tools: [
      { tool: tools.sap, level: 'Basic' },
      { tool: tools.oracle, level: 'Basic' },
    ],
  },
  {
    title: 'Microsoft & Productivity',
    tools: [
      { tool: tools.microsoft365, level: 'Proficient' },
      { tool: tools.excel, level: 'Proficient' },
      { tool: tools.outlook, level: 'Proficient' },
    ],
  },
  {
    title: 'Communication',
    tools: [
      { tool: tools.teams, level: 'Proficient' },
      { tool: tools.zoom, level: 'Proficient' },
      { tool: tools.meet, level: 'Proficient' },
    ],
  },
  {
    title: 'AI & Design',
    tools: [
      { tool: tools.claude, level: 'Familiar' },
      { tool: tools.canva, level: 'Basic' },
    ],
  },
]

export type AboutCredential = {
  id: 'xero' | 'quickbooks' | 'place' | 'degree'
  title: string
  detail: string
  /** A logo for the mark; without one the mark is an icon chosen by `id`. */
  image?: Image
  /** A dark-theme version of the mark, when the light one would vanish on a dark ground (or the reverse). */
  imageDark?: Image
  href?: string
}

const logo = (tool: ToolMark): Image => ({ src: tool.logo, alt: '', width: 64, height: 64 })

export const credentials: AboutCredential[] = [
  { id: 'xero', title: certification.title, detail: certification.detail, image: logo(tools.xero) },
  { id: 'quickbooks', title: 'QuickBooks Online ProAdvisor', detail: 'Certified July 2020', image: logo(tools.quickbooks) },
  { id: 'degree', title: 'Bachelor of Science in Accountancy', detail: 'Global Reciprocal Colleges · 2016' },
  { id: 'place', title: `Based ${site.timePlace}`, detail: 'Philippines · working with Irish clients' },
]
