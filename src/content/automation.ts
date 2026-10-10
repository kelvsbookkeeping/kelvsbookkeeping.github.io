import { method } from './method'
import type { ToolMark } from './schema'
import { tools } from './tools'

/**
 * The live workflow diagram on Home: a receipt's journey through the books, drawn stage by stage as
 * the page scrolls (receipt -> capture -> coding -> bank feed -> match -> reconciled -> month end).
 *
 * Coordinates are in the diagram's own 1200 x 600 units: the main path is the top row, the month-end
 * work the bottom row. `plane` is who moves it: `lead` = the bookkeeper, `auto` = the software does
 * it. `step` is the method step (0 to 4: the five steps in method.ts). Nodes are listed in build order.
 */
export type FlowPlane = 'lead' | 'auto'
export type FlowIcon = 'receipt' | 'scan' | 'tag' | 'bank' | 'match' | 'check' | 'close' | 'report' | 'analysis' | 'vat' | 'filed' | 'query'

export type FlowNode = {
  id: string
  title: string
  tag: string
  plane: FlowPlane
  icon: FlowIcon
  x: number
  y: number
  w: number
  h: number
  step: number
  /** One line for the inspector. */
  about: string
  /** The tools used at this stage: drawn as logo chips in place of the tag line (the tag still names them). */
  tools?: ToolMark[]
}

/** `solid` links are the main path (arrows a packet runs); `dashed` links reroute it: an unmatched line loops back, reconciled books branch out. */
export type FlowLink = { from: string; to: string; style: 'solid' | 'dashed'; label?: string }

const ROWS = [64, 376]
const box = (col: number, row: number) => ({ x: 24 + col * 200, y: ROWS[row]!, w: 156, h: 136 })


export const liveAutomation = {
  eyebrow: 'Live workflow',
  titleThin: 'Receive. Post. Import.',
  titleBold: 'Reconcile. Close.',
  steps: method.steps.map((step) => ({ name: step.name, body: step.body })),
  panel: { lead: 'Receipt to', rest: 'Monthly Report' },
  legend: { auto: 'Software', lead: 'Bookkeeper' },
  zones: { booking: 'Xero / QuickBooks', pipeline: 'Month end' },
  /** Logos drawn beside the first zone's label. */
  zoneTools: [tools.xero, tools.quickbooks] as ToolMark[],
  connected: 'Books up to date',
  hint: { hover: 'Hover a stage to inspect', tap: 'Tap a stage to inspect' },
  nodes: [
    { id: 'receipt', title: 'Receipt In', tag: 'Outlook / upload', plane: 'lead', icon: 'receipt', ...box(0, 0), step: 0, about: 'A client emails or uploads an invoice, bill or receipt the day it arrives; emailed ones land in Outlook.', tools: [tools.outlook] },
    { id: 'capture', title: 'Captured', tag: 'Dext / Hubdoc', plane: 'auto', icon: 'scan', ...box(1, 0), step: 0, about: 'Dext or Hubdoc reads the supplier, date, amount and VAT off the document.', tools: [tools.dext, tools.hubdoc] },
    { id: 'code', title: 'Coded', tag: 'Account + VAT rate', plane: 'lead', icon: 'tag', ...box(2, 0), step: 1, about: 'I check the capture and code it to the right account and VAT rate.' },
    { id: 'feed', title: 'Bank Feed', tag: 'Daily import', plane: 'auto', icon: 'bank', ...box(3, 0), step: 2, about: 'Bank and card transactions flow into Xero or QuickBooks every day.' },
    { id: 'match', title: 'Matched', tag: 'Rules + review', plane: 'auto', icon: 'match', ...box(4, 0), step: 3, about: 'Bank rules suggest a match for each line; anything unclear goes back to be recoded.' },
    { id: 'reconcile', title: 'Reconciled', tag: 'Books match bank', plane: 'lead', icon: 'check', ...box(5, 0), step: 3, about: 'I reconcile every account, so the books agree with the bank to the cent.' },
    { id: 'close', title: 'Month Closed', tag: 'Accruals + checks', plane: 'lead', icon: 'close', ...box(0, 1), step: 4, about: 'Accruals, prepayments and control accounts are checked in Excel, then the month is locked.', tools: [tools.excel] },
    { id: 'vat', title: 'VAT Workpaper', tag: 'Excel workpaper', plane: 'lead', icon: 'vat', ...box(3, 1), step: 4, about: 'An Excel workpaper backs every figure on the VAT return before it is filed.', tools: [tools.excel] },
    { id: 'query', title: 'Client Query', tag: 'Outlook / Teams', plane: 'lead', icon: 'query', ...box(5, 1), step: 4, about: 'Anything missing or unusual goes to the client as one short list by Outlook, or on a quick Teams, Zoom or Google Meet call.', tools: [tools.outlook, tools.teams, tools.zoom, tools.meet] },
    { id: 'reports', title: 'Reports Sent', tag: 'Excel / Canva', plane: 'lead', icon: 'report', ...box(1, 1), step: 4, about: 'A clean profit and loss and balance sheet land in the client inbox each month, with a one-page summary laid out in Canva.', tools: [tools.excel, tools.canva] },
    { id: 'analysis', title: 'Data Analyzed', tag: 'Excel / Claude', plane: 'lead', icon: 'analysis', ...box(2, 1), step: 4, about: 'I work through the numbers in Excel, with Claude to speed up the analysis, and flag the trends: where the money went and what the client can spend next.', tools: [tools.excel, tools.claude] },
    { id: 'filed', title: 'VAT Filed', tag: 'On time', plane: 'lead', icon: 'filed', ...box(4, 1), step: 4, about: 'The return is filed on time, in line with Revenue requirements.' },
  ] satisfies FlowNode[],
  links: [
    { from: 'receipt', to: 'capture', style: 'solid' },
    { from: 'capture', to: 'code', style: 'solid' },
    { from: 'code', to: 'feed', style: 'solid' },
    { from: 'feed', to: 'match', style: 'solid' },
    { from: 'match', to: 'reconcile', style: 'solid' },
    { from: 'match', to: 'code', style: 'dashed', label: 'Unmatched: recoded' },
    { from: 'reconcile', to: 'close', style: 'dashed' },
    { from: 'reconcile', to: 'vat', style: 'dashed' },
    { from: 'reconcile', to: 'query', style: 'dashed' },
    { from: 'close', to: 'reports', style: 'solid' },
    { from: 'reports', to: 'analysis', style: 'solid' },
    { from: 'vat', to: 'filed', style: 'solid' },
  ] satisfies FlowLink[],
}
