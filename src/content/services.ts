import type { Service } from './schema'

export const servicesPage = {
  eyebrow: 'Services',
  title: 'Every service, itemized like a ledger.',
  lede: 'Every service, itemized like a ledger.',
}

/**
 * The Home Services section: a ledger page with one ruled line per service. The display line is the
 * thin + bold pair below; `columns` are the ledger's column headings and `total` its closing line.
 */
export const servicesSection = {
  eyebrow: servicesPage.eyebrow,
  titleThin: 'Chart of',
  titleBold: 'Services.',
  lede: servicesPage.lede,
  columns: { code: 'Code', service: 'Service', detail: 'What it covers', tools: 'Tools' },
  total: { label: 'Total', unit: 'services', note: 'One bookkeeper' },
}

/** One line of the ledger each. `code` is the account-style number shown in the first column. */
export const services: Service[] = [
  {
    id: 'bookkeeping',
    code: '1000',
    title: 'Bookkeeping & Data Entry',
    summary: 'Invoices, bills and receipts coded to the right account and VAT rate, kept current every week.',
    tools: ['Xero', 'QuickBooks Online'],
  },
  {
    id: 'capture',
    code: '1100',
    title: 'Receipt & Invoice Capture',
    summary: 'Paperwork captured the day it arrives, with the source document attached to every entry.',
    tools: ['Dext', 'Hubdoc', 'Outlook'],
  },
  {
    id: 'reconciliation',
    code: '2000',
    title: 'Bank Reconciliation',
    summary: 'Every bank and card account matched line by line, so the books agree with the bank.',
    tools: ['Xero', 'QuickBooks Online'],
  },
  {
    id: 'vat',
    code: '3000',
    title: 'VAT Returns',
    summary: 'Irish VAT returns prepared and filed on time, with a supporting workpaper behind every figure.',
    tools: ['Xero', 'Excel'],
  },
  {
    id: 'month-end',
    code: '4000',
    title: 'Month-End Close',
    summary: 'Accruals, prepayments and control accounts checked, then the month closed on schedule.',
    tools: ['Xero', 'QuickBooks Online', 'Excel'],
  },
  {
    id: 'reporting',
    code: '5000',
    title: 'Reports & Data Analysis',
    summary: 'A clear profit and loss and balance sheet each month, with the trends behind the numbers explained.',
    tools: ['Excel', 'Canva', 'Claude'],
  },
  {
    id: 'catch-up',
    code: '6000',
    title: 'Catch-Up & Clean-Up',
    summary: 'Books that have fallen behind or gone messy brought up to date, corrected and reconciled.',
    tools: ['Xero', 'QuickBooks Online', 'Excel'],
  },
]
