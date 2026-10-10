import type { Image, ToolMark } from './schema'
import { sampleShots } from './sample-shots'
import { tools } from './tools'

/**
 * Showcase: one sample month of bookkeeping, followed from the first document to the month-end reports.
 * It is the same fictional company and the same figures as the sample projects in content/work.ts
 * (scripts/sample-projects/data.mjs), so a step can link to the project that shows its screen. Change a
 * figure there and update the ones quoted here to match.
 */
export const showcasePage = {
  eyebrow: 'Showcase',
  titleThin: 'One month of books,',
  titleBold: 'start to finish.',
  lede: 'A sample month for Corrib Cycles Ltd, a fictional Irish bike shop, followed from the first receipt to the month-end reports. Five steps, each with its screen, what I do, and what comes out.',
  notice: 'Sample case. The company and every figure are fictional, because client books are confidential.',
  stepsTitle: 'The Bookkeeper Method',
  labels: { out: 'What comes out', sample: 'See the sample', screen: 'Sample screen. Scroll to see all of it.' },
}

/** Number + unit: the month in four figures, each one taken from the steps below. */
export const showcaseStats: [string, string][] = [
  ['16', 'documents posted'],
  ['42', 'bank lines reconciled'],
  ['€0.00', 'left unreconciled'],
  ['8 of 8', 'month-end checks done'],
]

export type CaseStep = {
  id: string
  /** The one-word name in the list, and the fuller title under the screen. */
  name: string
  title: string
  /** What the step is and what I do in it: one short paragraph. */
  body: string
  /** The outcome, in one sentence with its figures. */
  out: string
  tools: ToolMark[]
  /** The sample screen in the window: its address-bar label and the full-length capture. */
  address: string
  screen: Image
  /** The sample projects that go deeper on this step (chapter ids from content/work.ts). */
  samples: { id: string; label: string }[]
}

/** A full-length sample screen (public/images/covers/sample-<id>-full.webp, built by scripts/sample-projects/build.mjs). */
const screen = (id: string, alt: string): Image => ({ src: `/images/covers/sample-${id}-full.webp`, alt, ...sampleShots[id]! })

export const caseSteps: CaseStep[] = [
  {
    id: 'receive',
    name: 'Receive',
    title: 'Receive the client’s documents',
    body: 'Sales invoices, supplier bills and receipts arrive by email and upload through the month, along with the bank statement. I collect them in one place, check each one is complete (date, supplier, amount and VAT), and send the client one short list of anything missing.',
    out: '7 sales invoices and 9 supplier bills, complete and ready to post.',
    tools: [tools.outlook, tools.dext, tools.hubdoc],
    address: 'corrib cycles / documents',
    screen: screen('documents-received', 'Documents received: the sample inbox, fictional data'),
    samples: [],
  },
  {
    id: 'post',
    name: 'Post',
    title: 'Post them into Xero',
    body: 'Each document is coded to the right account and VAT rate: 23% on bike sales, 13.5% on repairs and servicing. The sale to a VAT-registered customer in Denmark is zero-rated, the German supplier bill is treated as an EU acquisition, the VAT on a client lunch is left unclaimed, and the new workshop lift goes to fixed assets instead of expenses.',
    out: '€11,410.00 of sales and €6,820.00 of purchases posted before VAT, with no recoding needed later.',
    tools: [tools.xero, tools.dext],
    address: 'corrib cycles / bills and invoices',
    screen: screen('posting', 'Bills and sales invoices posted: the sample screen, fictional data'),
    samples: [{ id: 'posting', label: 'Bills & Sales Invoices' }],
  },
  {
    id: 'import',
    name: 'Import',
    title: 'Import the bank statement',
    body: 'The April statement for the shop’s current account comes into Xero through the bank feed. Before a single line is matched, I check the opening and closing balances against the bank’s own statement, and that no line came in twice or went missing.',
    out: '42 statement lines imported, with a closing balance of €18,462.35 that agrees to the bank.',
    tools: [tools.xero],
    address: 'corrib cycles / bank import',
    screen: screen('bank-import', 'Bank statement imported: the sample screen, fictional data'),
    samples: [],
  },
  {
    id: 'reconcile',
    name: 'Reconcile',
    title: 'Reconcile the bank and review what is owed',
    body: '39 of the 42 lines match their invoices and bills. I look into the 3 that do not: a customer who paid twice, a bank fee, and a lodgement on the last day. Then I review the aged payables and receivables, removing a bill entered twice, applying an unallocated credit note, and putting a disputed bill on hold.',
    out: 'The bank reconciles to the ledger at €22,017.05 with a difference of €0.00, and payables are corrected from €4,886.80 to €4,616.20.',
    tools: [tools.xero, tools.excel],
    address: 'corrib cycles / bank reconciliation',
    screen: screen('bank-reconciliation', 'Bank reconciliation: the sample screen, fictional data'),
    samples: [
      { id: 'bank-reconciliation', label: 'Bank Reconciliation' },
      { id: 'aged-payables', label: 'Aged Payables Review' },
    ],
  },
  {
    id: 'close',
    name: 'Close',
    title: 'Close the month and report',
    body: 'The new workshop lift is added to the fixed asset register and April depreciation is run. I post the month-end journals (an accrual, two prepayment releases and depreciation), agree the VAT control account to the VAT3, and lock the period. The owner gets the profit and loss, the balance sheet and the aged lists.',
    out: '8 of 8 close checks done, 4 journals totalling €1,421.67, VAT payable of €1,106.00 agreed, and the period locked on 6 May 2026.',
    tools: [tools.xero, tools.excel],
    address: 'corrib cycles / month-end close',
    screen: screen('month-end-close', 'Month-end close: the sample checklist and journals, fictional data'),
    samples: [
      { id: 'month-end-close', label: 'Month-End Close Support' },
      { id: 'fixed-assets', label: 'Fixed Asset Register' },
      { id: 'vat-return', label: 'Irish VAT3 Return' },
    ],
  },
]

/* ---------- The film: The Bookkeeper Method as a short looping animation (features/showcase/CaseFilm.tsx) ---------- */

/** A scene's words: the step's name, a two-line headline and one sentence. Its animation is in `visuals` under the same id. */
export type FilmScene = { id: 'receive' | 'post' | 'import' | 'reconcile' | 'close'; eyebrow: string; thin: string; bold: string; sub: string }

/**
 * The opening (the promise, then the steps as a flow), one scene per step, and the closing line. The
 * figures in `visuals` are the same ones as the steps above.
 */
export const caseFilm = {
  caption: 'The Bookkeeper Method',
  opening: {
    eyebrow: 'The Bookkeeper Method',
    lines: ['Clean books.', 'On-time VAT.'],
    /** The last line of the promise, with its final word set apart. */
    trust: { before: 'Numbers you can', word: 'TRUST.' },
  },
  closing: { thin: 'Simple steps for', bold: 'accurate books.', caption: 'Simple steps for accurate books' },
  scenes: [
    { id: 'receive', eyebrow: 'Receive', thin: 'Your documents,', bold: 'in one place.', sub: 'Invoices, bills and receipts captured the day they arrive.' },
    { id: 'post', eyebrow: 'Post', thin: 'Every document,', bold: 'coded right.', sub: 'The right account and the right VAT rate, first time.' },
    { id: 'import', eyebrow: 'Import', thin: 'The bank statement,', bold: 'brought in.', sub: 'Balances checked against the bank before a line is matched.' },
    { id: 'reconcile', eyebrow: 'Reconcile', thin: 'Books and bank,', bold: 'to the cent.', sub: 'Every line matched, and the odd ones explained.' },
    { id: 'close', eyebrow: 'Close', thin: 'Month closed,', bold: 'reports sent.', sub: 'Journals posted, VAT agreed, the period locked.' },
  ] satisfies FilmScene[],
  visuals: {
    /** Documents float into the inbox one by one, stack, and each gets a check. */
    receive: {
      title: 'April inbox',
      sub: 'Corrib Cycles Ltd',
      docs: [
        { name: 'Invoice INV-1041', amount: '2,214.00' },
        { name: 'Receipt, The Quay Kitchen', amount: '113.50' },
        { name: 'Bill BILL-0311', amount: '2,337.00' },
        { name: 'April bank statement', amount: '42 lines' },
      ],
      foot: { label: 'Ready to post', value: '16 documents' },
    },
    /** A transaction drops into the ledger, is labelled, the cursor clicks Post, the ledger rows appear. */
    post: {
      title: 'Post to the ledger',
      sub: 'Xero',
      txn: { name: 'INV-1041 Brennan & Hayes', amount: '€2,214.00', labels: ['4000 Sales - Bikes', 'VAT 23%'] },
      button: 'Post',
      rows: [
        { label: 'Dr  Accounts receivable', value: '2,214.00' },
        { label: 'Cr  4000 Sales - Bikes', value: '1,800.00' },
        { label: 'Cr  VAT on sales', value: '414.00' },
      ],
      foot: { label: 'Status', value: 'Posted' },
    },
    /** Files travel along an arrow into the accounting software and come out as transaction rows. */
    import: {
      title: 'Bank import',
      sub: 'April statement',
      files: ['CSV', 'Excel', 'Statement'],
      target: 'Xero',
      rows: [
        { label: '03 Apr  Brennan Hayes Sol', value: '+ 2,214.00' },
        { label: '08 Apr  Wicklow Bike Dist', value: '- 2,337.00' },
        { label: '24 Apr  Glenview Cycling Club', value: '+ 2,043.00' },
      ],
      foot: { label: '42 lines, closing balance', value: '€18,462.35' },
    },
    /** Bank and ledger side by side: matches connect, one difference is flagged and then resolved. */
    reconcile: {
      title: 'Bank reconciliation',
      sub: '30 April 2026',
      columns: ['Bank', 'Ledger'],
      rows: [
        { bank: '2,214.00', ledger: 'INV-1041' },
        { bank: '2,337.00', ledger: 'BILL-0311' },
        { bank: '476.70', ledger: 'Refund raised', flag: 'Paid twice' },
        { bank: '12.50', ledger: 'Bank charges' },
      ] as { bank: string; ledger: string; flag?: string }[],
      foot: { label: 'Difference', value: '€0.00' },
    },
    /** The checklist completes, the period-end report appears, and a large check seals it. */
    close: {
      title: 'Month-end close',
      sub: 'April 2026',
      checks: ['Journals posted', 'VAT agreed to VAT3', 'Ledger reviewed', 'Reports sent'],
      report: { title: 'Period-end report', sub: 'April 2026', bars: [46, 72, 58, 90] },
      seal: 'Period Closed',
    },
  },
}
