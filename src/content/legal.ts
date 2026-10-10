import { site } from './site'

export type LegalSection = { heading: string; paragraphs: string[] }

export type LegalDoc = {
  title: string
  updated: string
  intro: string
  sections: LegalSection[]
}

/**
 * What this site actually stores and loads. Keep in sync with src/lib/storage.ts: today that is the theme
 * and the sidebar state in localStorage, no analytics, no cookies, and fonts served from the site itself.
 * Plain-language pages for a personal portfolio, not legal advice: have them checked before relying on them.
 */
export const privacyPolicy: LegalDoc = {
  title: 'Privacy Policy',
  updated: 'October 9, 2026',
  intro: `This policy covers the portfolio website of ${site.name}, trading as ${site.brand}.`,
  sections: [
    {
      heading: 'What this site collects',
      paragraphs: [
        'Nothing that identifies you. There is no account and no advertising or tracking cookie. The contact form sends nothing to this site: it opens your own mail app with your message laid out, and you choose whether to send it.',
        'If you email me, your message lives in my inbox and nowhere else. I keep it while we are working together and delete it on request.',
      ],
    },
    {
      heading: 'Client and sample data',
      paragraphs: [
        'No client books are published here. The sample projects and the Showcase use a fictional company, Corrib Cycles Ltd, with made-up customers, suppliers and figures.',
        'The process guides show screenshots from guides I wrote for clients, with every client, customer and supplier name and email covered. Feedback from my managers is credited by first name and title only.',
      ],
    },
    {
      heading: 'What your browser stores',
      paragraphs: [
        'Two small settings are saved in your own browser: your light or dark theme, and whether the sidebar is collapsed. They never leave your device and you can clear them any time from your browser settings.',
      ],
    },
    {
      heading: 'Analytics',
      paragraphs: [
        'No analytics runs today. If I add privacy-friendly page-view analytics later, it will only load after you agree to it, and this page will name the provider.',
      ],
    },
    {
      heading: 'Hosting and third parties',
      paragraphs: [
        'Like every website, the server that hosts this site keeps standard access logs (IP address, page requested, time) for security and troubleshooting.',
        'The fonts, images and scripts are served from this site itself, so viewing a page does not contact anyone else. Links to LinkedIn, OnlineJobsPH and other sites take you to services with their own privacy policies.',
      ],
    },
    {
      heading: 'Your rights',
      paragraphs: [`You can ask what I hold about you, or ask me to delete it. Email ${site.email} with the subject "Privacy request".`],
    },
    {
      heading: 'Changes',
      paragraphs: ['If this policy changes, the date at the top changes with it.'],
    },
  ],
}

export const termsOfService: LegalDoc = {
  title: 'Terms of Service',
  updated: 'October 9, 2026',
  intro: `These terms cover your use of this portfolio site, run by ${site.name}, trading as ${site.brand}.`,
  sections: [
    {
      heading: 'Using this site',
      paragraphs: [
        'You can browse, read and open every sample here for free. The sample projects and the Showcase are illustrations: the company, the customers, the suppliers and every figure in them are made up.',
      ],
    },
    {
      heading: 'Not accounting or tax advice',
      paragraphs: [
        'This site shows how I work. The sample VAT return, the process guides and everything else here are examples, not accounting, tax or legal advice for your business. Rules and rates change, so check your own position before acting on anything you read here.',
      ],
    },
    {
      heading: 'Working together',
      paragraphs: [
        'Nothing on this site is a binding offer. Client work starts with a conversation about what you need, often with a small trial task such as reconciling one month of transactions, then a written agreement on scope and price. Only a signed agreement creates a contract.',
      ],
    },
    {
      heading: 'Intellectual property',
      paragraphs: [
        'The site copy, the sample projects, the process guides and my own work belong to me. The site is built on a licensed portfolio template.',
        'Third-party names and logos, such as Xero, QuickBooks, Dext and Microsoft, belong to their owners. They are shown to name the tools I work with, not to claim an endorsement or partnership. Certificates are shown as issued to me.',
      ],
    },
    {
      heading: 'No warranties',
      paragraphs: ['The site is provided as is. I work to keep it accurate and online, but I cannot promise it is error-free or always available.'],
    },
    {
      heading: 'External links',
      paragraphs: ['Links to other sites are for convenience. I am not responsible for their content or their privacy practices.'],
    },
    {
      heading: 'Governing law',
      paragraphs: ['These terms are governed by the laws of the Republic of the Philippines.'],
    },
    {
      heading: 'Contact',
      paragraphs: [`Questions about these terms: ${site.email}.`],
    },
  ],
}
