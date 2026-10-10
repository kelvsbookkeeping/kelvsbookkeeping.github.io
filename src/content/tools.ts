import type { ToolMark } from './schema'

const mark = (name: string, file: string, mono?: true): ToolMark => ({ name, logo: `/images/tools/${file}`, mono })

/**
 * Every tool the site can show. Pages reference these, never a raw path. All marks sit on a transparent
 * ground (public/images/tools/): the .webp ones were cut from the logo files supplied for this site, Xero
 * and Claude are the brands' marks from Simple Icons. A black one-colour logo takes a third argument,
 * `true`, so it is inverted on dark grounds.
 */
export const tools = {
  xero: mark('Xero', 'xero.svg'),
  quickbooks: mark('QuickBooks Online', 'quickbooks.webp'),
  dext: mark('Dext', 'dext.webp'),
  hubdoc: mark('Hubdoc', 'hubdoc.webp'),
  microsoft365: mark('Microsoft 365', 'microsoft-365.webp'),
  outlook: mark('Outlook', 'outlook.webp'),
  excel: mark('Microsoft Excel', 'excel.webp'),
  zoom: mark('Zoom', 'zoom.webp'),
  teams: mark('Microsoft Teams', 'teams.webp'),
  meet: mark('Google Meet', 'google-meet.webp'),
  canva: mark('Canva', 'canva.webp'),
  claude: mark('Claude', 'claude.svg'),
  sap: mark('SAP', 'sap.webp'),
  oracle: mark('Oracle Application', 'oracle.webp'),
} satisfies Record<string, ToolMark>

/** The daily drivers, in the order you want them shown. */
export const dailyTools: ToolMark[] = [
  tools.xero,
  tools.quickbooks,
  tools.dext,
  tools.hubdoc,
  tools.microsoft365,
  tools.outlook,
  tools.excel,
  tools.zoom,
  tools.teams,
  tools.meet,
  tools.canva,
  tools.claude,
]

/** Systems known at a basic level: shown apart from the daily drivers, never as a main skill. */
export const basicTools: ToolMark[] = [tools.sap, tools.oracle]
