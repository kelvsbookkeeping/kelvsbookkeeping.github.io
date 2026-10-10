import type { ToolMark } from './schema'
import { tools } from './tools'

export const workPage = {
  eyebrow: 'Work',
  title: 'Sample projects you can open.',
  lede: 'Client books are confidential, so these are sample projects built on a fictional company.',
}

/**
 * The sample projects. Client books cannot be shown, so each project is worked on one fictional Irish
 * company, Corrib Cycles Ltd, for March and April 2026. The pages people open (public/demos/samples/)
 * and their covers are built by scripts/sample-projects/build.mjs from scripts/sample-projects/data.mjs:
 * change a figure there and re-run it, then update the figures quoted in `result` below to match.
 */
export const sampleNotice = {
  label: 'Sample',
  /** The company the samples are worked on, and the longer flag on the case study. */
  company: 'Corrib Cycles Ltd',
  flag: 'Sample · fictional data',
  text: 'Corrib Cycles Ltd is a fictional company with invented figures. Client books are confidential, so this shows how I work without showing anyone’s data.',
}

export type SampleProject = {
  id: string
  title: string
  /** One quiet line under the title. */
  line: string
  /** The sheet's intro and meta description (keep under ~160 chars). */
  description: string
  brief: string
  did: string[]
  result: string
  tools: ToolMark[]
  /** The sample page it opens. */
  href: string
  /** The title on the sample screen's window bar: the tool, then the screen. */
  window: string
  /** The date or period the work covers, for the line under the title. */
  when: string
}

export const sampleProjects: SampleProject[] = [
  {
    id: 'bank-reconciliation',
    window: 'Xero · Bank reconciliation',
    when: '30 April 2026',
    title: 'Bank Reconciliation',
    line: 'A month of bank lines, matched to the cent.',
    description: 'Sample project: an April bank reconciliation for a fictional Irish bike shop, reconciled to a zero difference.',
    brief: 'The shop’s current account had 42 statement lines for April, and the bank balance did not agree with the books.',
    did: [
      'Matched 39 lines to their sales invoices and bills.',
      'Looked into the 3 that did not match: a customer who paid the same invoice twice, a bank fee with no bill, and a lodgement made on the last day of the month.',
      'Raised a refund for the double payment and posted the bank fee.',
      'Listed the lodgement and one unpresented payment as timing differences on the reconciliation statement.',
    ],
    result: 'The bank statement balance of €18,462.35 reconciles to the ledger balance of €22,017.05 with a difference of €0.00, and nothing left unreconciled.',
    tools: [tools.xero, tools.excel],
    href: '/demos/samples/bank-reconciliation.html',
  },
  {
    id: 'posting',
    window: 'Xero · Bills and sales invoices',
    when: 'March to April 2026',
    title: 'Bills & Sales Invoices',
    line: 'Sixteen documents, each on the right account and VAT rate.',
    description: 'Sample project: two months of bills and sales invoices posted for a fictional Irish bike shop, each coded to an account and VAT rate.',
    brief: 'Two months of paperwork needed posting: 7 sales invoices and 9 supplier bills, with a mix of Irish VAT rates and two EU transactions.',
    did: [
      'Captured each document and coded it to the right account.',
      'Applied 23% to bike sales and 13.5% to repairs and servicing.',
      'Zero-rated the sale of goods to a VAT-registered customer in Denmark after checking their VAT number.',
      'Treated the German supplier bill as an EU acquisition under the reverse charge.',
      'Left the VAT on a client lunch unclaimed, because VAT on food and drink cannot be reclaimed.',
      'Coded the new workshop lift to fixed assets instead of expenses.',
    ],
    result: '16 documents posted: €11,410.00 of sales and €6,820.00 of purchases before VAT, ready for the VAT return with no recoding needed.',
    tools: [tools.xero, tools.dext, tools.hubdoc],
    href: '/demos/samples/posting.html',
  },
  {
    id: 'vat-return',
    window: 'Xero · VAT return',
    when: 'March to April 2026',
    title: 'Irish VAT3 Return',
    line: 'A two-month VAT3 with a workpaper behind every box.',
    description: 'Sample project: an Irish VAT3 return for March and April for a fictional bike shop, with a supporting workpaper behind every figure.',
    brief: 'The shop files a VAT3 every two months. The March and April return needed preparing from the posted invoices and bills.',
    did: [
      'Built T1 from sales at 23% and 13.5%, plus the VAT self-accounted on the German purchase.',
      'Built T2 from the reclaimable VAT on each supplier bill, leaving out the client lunch.',
      'Reported the Danish sale in E1 and the German purchase in E2.',
      'Agreed T1 and T2 to the VAT control account before filing.',
    ],
    result: 'T1 €2,306.60 less T2 €1,200.60 gives VAT payable (T3) of €1,106.00, with E1 €1,200.00 and E2 €1,000.00, each figure traced to a workpaper line.',
    tools: [tools.xero, tools.excel],
    href: '/demos/samples/vat-return.html',
  },
  {
    id: 'aged-payables',
    window: 'Xero · Aged payables',
    when: '30 April 2026',
    title: 'Aged Payables Review',
    line: 'Who is owed what, how old it is, and what to pay next.',
    description: 'Sample project: an aged payables review for a fictional Irish bike shop, with a duplicate bill and an unallocated credit note found and fixed.',
    brief: 'Before the April payment run, the owner wanted to know exactly what the shop owed its suppliers and which bills were overdue.',
    did: [
      'Ran the aged payables report at 30 April and checked every balance back to its bill.',
      'Found a broadband bill entered twice and removed the duplicate.',
      'Found an unallocated supplier credit note and applied it against the bill it belonged to.',
      'Put a disputed bill, 112 days old, on hold until the supplier issues a credit.',
      'Agreed the total to the creditors control account and proposed the payment run.',
    ],
    result: 'Payables came down from €4,886.80 to a correct €4,616.20, with €2,107.00 proposed for payment and €369.00 held as disputed.',
    tools: [tools.xero, tools.excel],
    href: '/demos/samples/aged-payables.html',
  },
  {
    id: 'month-end-close',
    window: 'Xero · Month-end close',
    when: 'April 2026',
    title: 'Month-End Close Support',
    line: 'Eight checks and four journals to close April.',
    description: 'Sample project: an April month-end close for a fictional Irish bike shop, with a close checklist and the accrual, prepayment and depreciation journals.',
    brief: 'April needed closing so the owner could trust the month’s figures: every balance checked, the adjustments posted, and the period locked.',
    did: [
      'Worked through an eight-step close checklist, from the bank reconciliation to the VAT control account.',
      'Accrued April electricity that had not been billed yet.',
      'Released the April share of prepaid insurance and of the rent paid in March.',
      'Ran April depreciation from the fixed asset register.',
      'Locked the period once every balance agreed.',
    ],
    result: '8 of 8 close tasks done and 4 journals posted totalling €1,421.67, with the period locked on 6 May 2026.',
    tools: [tools.xero, tools.excel],
    href: '/demos/samples/month-end-close.html',
  },
  {
    id: 'fixed-assets',
    window: 'Xero · Fixed assets',
    when: 'April 2026',
    title: 'Fixed Asset Register',
    line: 'A new asset added to the register and depreciated.',
    description: 'Sample project: adding a new workshop lift to the fixed asset register for a fictional Irish bike shop and running the month’s depreciation.',
    brief: 'The shop bought a hydraulic workshop lift in April. It needed adding to the fixed asset register so its cost is spread over its useful life.',
    did: [
      'Coded the supplier bill to the fixed asset account instead of an expense.',
      'Created the asset in the register at €1,600.00, the price before VAT, since the €368.00 of VAT is reclaimed.',
      'Set straight-line depreciation at 20% a year from the purchase date, then registered the asset.',
      'Ran April depreciation for all four assets and checked the register back to the ledger.',
    ],
    result: 'The register holds 4 assets costing €23,200.00 with a book value of €17,843.33, and April depreciation of €391.67 is posted.',
    tools: [tools.xero],
    href: '/demos/samples/fixed-assets.html',
  },
]

/** The number on the sidebar's Work entry. */
export const workCount = sampleProjects.length
