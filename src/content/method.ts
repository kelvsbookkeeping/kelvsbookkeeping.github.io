import type { MethodStep } from './schema'

/** The Bookkeeper Method: the five steps a month of books goes through, in order. It names the steps of the Home
 *  workflow diagram, and the Showcase walks the same five (content/showcase.ts). */
export const method = {
  eyebrow: 'The Bookkeeper Method',
  title: 'Receive. Post. Import. Reconcile. Close.',
  summary: 'Documents received and posted, the bank imported and reconciled, the month closed on time.',
  steps: [
    { name: 'Receive', body: 'Invoices, bills and receipts come in and are captured the day they arrive.', inputs: ['Invoices', 'Bills', 'Receipts'] },
    { name: 'Post', body: 'Each document is coded to the right account and VAT rate.', inputs: ['Accounts', 'VAT rates'] },
    { name: 'Import', body: 'Bank and card transactions are brought in, and the balances checked.', inputs: ['Bank accounts', 'Cards'] },
    { name: 'Reconcile', body: 'Every line is matched, so the books agree with the bank.', inputs: ['Bank lines', 'Supplier statements'] },
    { name: 'Close', body: 'The month is closed, VAT is ready, and the reports land in your inbox.', inputs: ['Month-end close', 'VAT return', 'Monthly reports'] },
  ] satisfies MethodStep[],
}
