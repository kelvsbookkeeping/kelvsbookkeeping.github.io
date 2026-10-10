import type { Faq } from './schema'

/** The questions people ask before they write. Pages pick the ones that answer their own objection. */
export const faqs = {
  vatReturns: {
    question: 'Do you prepare and file VAT returns?',
    answer: 'Yes. I help prepare and file VAT returns for my VAT clients in line with their Revenue requirements, with a supporting workpaper for every return.',
  },
  software: {
    question: 'Which accounting software do you use?',
    answer: 'Mainly Xero (Level 2 certified) and QuickBooks Online (ProAdvisor), with Dext and Hubdoc for document capture. I have also worked with SAP and Oracle.',
  },
  location: {
    question: 'Where are you based?',
    answer: 'I am based in Caloocan City, Philippines, and work remotely with clients in Ireland and other countries.',
  },
} satisfies Record<string, Faq>

export const allFaqs: Faq[] = Object.values(faqs)
