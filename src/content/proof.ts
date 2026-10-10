import type { ClientAccount, Image, Quote, VideoTestimonial } from './schema'

export const proofPage = {
  eyebrow: 'Proof',
  titleThin: 'Results you',
  titleBold: 'can check.',
  bands: { certificates: 'Certifications and Recognition', quotes: 'From my managers', guides: 'Process guides', clients: 'Client accounts' },
  lede: 'The certificates behind the software I use every day, what my managers have written about my work, guides I wrote for clients, and the roles I have held.',
  /** The line under the Process guides label. */
  guidesNote: 'Step-by-step guides I wrote to help clients do a task themselves. The screenshots are from the original guides, with every client, customer and supplier name covered.',
  /** The link on each certificate. */
  open: 'Open the certificate',
  /** The link on a certificate that has a public award page to check it against. */
  verify: 'Verify the award',
}

/** A certificate or award, shown as a badge (the issuer's `logo`, or a medal without one). It opens `verify`,
 *  the issuer's public award page, when there is one, and the full-size certificate otherwise. */
export type Certificate = { id: string; title: string; issuer: string; date: string; image?: Image; full?: string; logo?: string; verify?: string }

const certificate = (file: string, alt: string, width: number, height: number): Pick<Certificate, 'image' | 'full'> => ({
  image: { src: `/images/certificates/${file}-700.webp`, alt, width, height },
  full: `/images/certificates/${file}.webp`,
})

export const certificates: Certificate[] = [
  {
    id: 'xero',
    title: 'Xero Certified Professional, Level 2',
    issuer: 'Xero',
    date: 'Certified 30 September 2025',
    logo: '/images/tools/xero.svg',
    ...certificate('cert-xero', 'Xero Certified Professional Level 2 certificate awarded to Kelvin Dienzo', 700, 990),
  },
  {
    id: 'xero-migration',
    title: 'Xero Migration Specialist',
    issuer: 'Xero',
    date: 'Completed 5 June 2026',
    logo: '/images/tools/xero.svg',
    verify: 'https://learning.central.xero.com/student/award/EwWCXV4A1mi8pSwDrErH7zV7',
  },
  {
    id: 'quickbooks',
    title: 'QuickBooks Online Accountant Certification (ProAdvisor)',
    issuer: 'Intuit QuickBooks',
    date: 'Dated 23 July 2020',
    logo: '/images/tools/quickbooks.webp',
    ...certificate('cert-quickbooks', 'QuickBooks Online Accountant Certification awarded to Kelvin Dienzo', 700, 540),
  },
  {
    id: 'practicum',
    title: 'Best in Practicum',
    issuer: 'Global Reciprocal Colleges',
    date: 'Awarded 16 May 2016',
    ...certificate('cert-practicum', 'Best in Practicum award from Global Reciprocal Colleges to Kelvin L. Dienzo, Bachelor of Science in Accountancy', 700, 541),
  },
]

/**
 * The roles held, newest first, shown as the client accounts ledger: `label` is the employer and the
 * years, `role` the title, `work` what the job covered, `tags` the kind of work.
 */
export const clientAccounts: ClientAccount[] = [
  {
    label: 'AMQ Outsourcing Services Philippines Inc. · 2020 to now',
    role: 'Senior Accounts Assistant',
    work: 'Bookkeeping, VAT reporting and VAT3 returns for 20+ VAT and non-VAT Irish companies, plus year-end reconciliations, workpapers and tax calculations.',
    tags: ['Bookkeeping', 'VAT3 returns', 'Reconciliations', 'Xero', 'QuickBooks'],
  },
  {
    label: 'Accenture Inc. · 2016 to 2020',
    role: 'General Accounting New Associate',
    work: 'End-to-end fixed asset accounting for 100 to 500 assets across several countries: additions, disposals, transfers and trade-ins. Wrote five approved procedures used to train new joiners.',
    tags: ['Fixed assets', 'Procedures', 'SAP', 'Oracle'],
  },
  {
    label: 'Avega Bros. Integrated Shipping Corporation · 2016',
    role: 'Accounting Staff',
    work: 'Cheque voucher processing and 50+ accounts payable accounts, keeping supplier payments on time.',
    tags: ['Accounts payable', 'Cheque vouchers'],
  },
]

/** Client video clips. None yet: add entries here and the page's structured data lists them. */
export const videoTestimonials: VideoTestimonial[] = []

/**
 * Written feedback, in the managers' own words, credited by first name and title only (Kelvin's choice).
 * The first is two sentences from the "Manager Overall Comments" of the 2024 annual performance review
 * (not consecutive in the original); the second joins two LinkedIn kudos, from Dec 2021 and Dec 2022.
 */
export const communityQuotes: Quote[] = [
  {
    name: 'Serena, CPA, CTA',
    context: 'Annual performance review',
    date: 'Dec 6, 2024',
    text: 'He took on the role of managing all VAT returns for our clients and works in a timely and organised fashion each period to ensure filings are completed on time. His strong work ethic and willingness to learn has been visible throughout the year.',
  },
  {
    name: 'Laidelyn, CPA, ACCA',
    context: 'LinkedIn 2021 and 2022',
    date: 'Dec 9, 2022',
    text: 'I am continually impressed by the results you produce! Keep up the great work! #GreatJob',
  },
]

/** A screenshot from the original guide (public/images/guides/), with every name, email and search term covered. */
const shot = (file: string, alt: string, width: number, height: number): Image => ({ src: `/images/guides/${file}.webp`, alt, width, height })

/** One step of a guide: what to do, and the screen it is done on when the original guide showed one. */
export type GuideStep = { text: string; shot?: Image }
/** A how-to written for clients: when to use it, the steps (one or more methods), and a closing check. */
export type ProcessGuide = { id: string; title: string; tool: string; when: string; methods: { name?: string; steps: GuideStep[] }[]; check: string }

export const processGuides: ProcessGuide[] = [
  {
    id: 'credit-note',
    title: 'Applying a credit note to a customer invoice',
    tool: 'QuickBooks Online',
    when: 'A customer has an unpaid invoice and a credit note (credit memo) waiting to be used against it.',
    methods: [
      {
        name: 'Method 1: from the invoice',
        steps: [
          { text: 'Find the invoice you want to apply the credit note to and select Receive payment.', shot: shot('credit-note-1', 'A sales list with a credit note and an invoice; Receive payment is highlighted on the invoice row', 1122, 96) },
          { text: 'In the Receive Payment window, check the customer shown is the right one.', shot: shot('credit-note-2', 'The Receive Payment window with the customer field highlighted', 771, 162) },
          { text: 'The outstanding invoices are listed first, with the available credit notes under them. Tick the invoice and the credit note to set one against the other, then select Save and close.', shot: shot('credit-note-3', 'Outstanding Transactions with the invoice ticked, Credits with the credit note ticked, and Save and close highlighted', 1428, 666) },
        ],
      },
      {
        name: 'Method 2: from the + New menu',
        steps: [
          { text: 'Select + New and, under Customers, choose Receive payment.', shot: shot('credit-note-4', 'The + New menu with Receive payment highlighted under Customers', 426, 358) },
          { text: 'Choose the customer, then tick the invoice and the credit note exactly as in Method 1.' },
          { text: 'Select Save and close.' },
        ],
      },
    ],
    check: 'Open the invoice again: its balance should be lower by the amount of the credit note.',
  },
  {
    id: 'one-payment-two-invoices',
    title: 'Reconciling one customer payment that covers two invoices',
    tool: 'Xero',
    when: 'A customer pays two invoices with a single bank transfer, so the bank line matches neither invoice on its own.',
    methods: [
      {
        steps: [
          { text: 'On the Reconcile tab, find the payment and select Find & Match at the top right of the transaction line.', shot: shot('customer-payment-1', 'A received bank line on the Reconcile tab with Find & Match highlighted', 1152, 190) },
          { text: 'Search by the customer’s name or by the amount, then select Go.', shot: shot('customer-payment-2', 'The Find & Match screen with the search boxes and Go highlighted', 1137, 448) },
          { text: 'Xero lists that customer’s unpaid invoices. Tick both invoices the payment covers, check their total equals the payment, then select OK and Reconcile.', shot: shot('customer-payment-3', 'Two invoices ticked in the list, showing 2 transactions selected, with OK highlighted', 1177, 530) },
        ],
      },
    ],
    check: 'Both invoices should now show as paid, and the bank line should have left the Reconcile tab.',
  },
  {
    id: 'two-payments-one-bill',
    title: 'Reconciling two payments to a supplier against one bill',
    tool: 'Xero',
    when: 'A supplier bill is paid in two instalments, so each bank line is smaller than the bill.',
    methods: [
      {
        steps: [
          { text: 'On the Reconcile tab, find the first payment to the supplier and select Find & Match at the top right of the transaction line.', shot: shot('supplier-payment-1', 'A spent bank line on the Reconcile tab with Find & Match highlighted', 1160, 191) },
          { text: 'Search by the supplier’s name or by the amount, then select Go.', shot: shot('supplier-payment-2', 'The Find & Match screen with the search boxes and Go highlighted', 1142, 492) },
          { text: 'Xero lists that supplier’s unpaid bills. Tick the bill the payment relates to, then select Split.', shot: shot('supplier-payment-3', 'The bill ticked in the list, with Split shown on its row', 1137, 377) },
          { text: 'In the window that opens, select Split again. Xero marks the bill as part paid.', shot: shot('supplier-payment-4', 'The Split transaction window showing the balance, the part payment and the remaining amount, with Split highlighted', 595, 297) },
          { text: 'Back on the previous screen, the part payment and the balance still owing are shown. Select OK and Reconcile.', shot: shot('supplier-payment-5', 'The part payment matched, the remaining balance on a new row, and OK highlighted', 1160, 431) },
          { text: 'Repeat steps 1 to 5 for the second payment.' },
        ],
      },
    ],
    check: 'After the second payment the bill should show as paid in full, with nothing left owing.',
  },
]
