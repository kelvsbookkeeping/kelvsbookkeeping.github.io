// Builds the sample-project pages (public/demos/samples/*.html) from data.mjs, then photographs
// each one for the Work section: a 1800x1125 cover plus 480 / 640 / 960 copies.
// Usage: node scripts/sample-projects/build.mjs          (needs Chrome; no dev server)
import { mkdirSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { chromium } from 'playwright'
import { VAT, assets, bank, bills, company, grossOf, money, monthEnd, payables, sales, sum, vat3, vatOf } from './data.mjs'

const root = join(dirname(fileURLToPath(import.meta.url)), '..', '..')
const pub = join(root, 'public')
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;')
const eur = (n) => (n === undefined || n === null ? '' : money(n))

const css = `
*{box-sizing:border-box}
html{font-family:Inter,"Segoe UI",system-ui,-apple-system,Arial,sans-serif;font-size:14px;color:#0e1b2a;background:#eef3f7}
body{margin:0}
.bar{display:flex;align-items:center;gap:14px;height:56px;padding:0 28px;background:#163a50;color:#fff}
.bar svg{width:20px;height:23px}
.bar b{font-weight:700;letter-spacing:-.01em}
.bar span{opacity:.72}
.bar .org{margin-left:auto;opacity:1;font-weight:600}
.flag{display:flex;gap:10px;align-items:center;padding:9px 28px;background:#fff6d6;border-bottom:1px solid #ecd98a;color:#5c4a00;font-size:12.5px}
.flag b{letter-spacing:.08em;text-transform:uppercase;font-size:11px}
main{max-width:1200px;margin:0 auto;padding:24px 28px 40px}
h1{margin:0 0 4px;font-size:25px;letter-spacing:-.02em}
.sub{margin:0 0 20px;color:#52657a}
.grid{display:grid;gap:16px}
.g2{grid-template-columns:minmax(0,4fr) minmax(0,8fr)}
.card{background:#fff;border:1px solid #d5dfe8;border-radius:12px;overflow:hidden}
.card h2{margin:0;padding:13px 18px;border-bottom:1px solid #e3eaf1;font-size:13px;letter-spacing:.07em;text-transform:uppercase;color:#52657a}
table{width:100%;border-collapse:collapse}
th,td{padding:9px 10px;text-align:left;border-bottom:1px solid #edf1f5;white-space:nowrap;font-size:13px}
td small{display:block;margin-top:3px}
th{font-size:11px;letter-spacing:.07em;text-transform:uppercase;color:#6a7b8e;font-weight:600;background:#f8fafc}
td.w{white-space:normal}
.n{text-align:right;font-variant-numeric:tabular-nums}
tr.total td{border-top:2px solid #0e1b2a;border-bottom:0;font-weight:700;background:#f8fafc}
tr.double td{border-top:3px double #0e1b2a;border-bottom:0;font-weight:700}
.chip{display:inline-block;padding:2px 9px;border-radius:999px;font-size:11.5px;font-weight:600}
.ok{background:#e3f5e6;color:#17662a}.new{background:#e2eefb;color:#1b4f86}.warn{background:#ffe9d6;color:#9a4b00}.mute{background:#eef1f5;color:#52657a}
.rows{padding:6px 18px 14px}
.rows p{display:flex;justify-content:space-between;gap:16px;margin:0;padding:9px 0;border-bottom:1px solid #edf1f5}
.rows p.s{color:#52657a;font-size:13px;padding-left:14px}
.rows p.t{border-bottom:0;border-top:2px solid #0e1b2a;font-weight:700}
.rows p.d{border:0;border-top:3px double #0e1b2a;font-weight:700}
.good{color:#17662a}
.stats{display:grid;grid-template-columns:repeat(4,1fr);gap:12px;margin-bottom:16px}
.stat{background:#fff;border:1px solid #d5dfe8;border-radius:12px;padding:13px 16px}
.stat b{display:block;font-size:24px;letter-spacing:-.02em}
.stat span{color:#52657a;font-size:12.5px}
.boxes{display:grid;grid-template-columns:repeat(4,1fr);gap:12px;padding:16px 18px}
.box{border:1px solid #d5dfe8;border-radius:10px;padding:11px 14px}
.box i{font-style:normal;font-weight:700;color:#1b4f86;font-size:12px;letter-spacing:.06em}
.box b{display:block;margin-top:3px;font-size:21px;font-variant-numeric:tabular-nums}
.box span{color:#52657a;font-size:12px}
.box.key{background:#163a50;border-color:#163a50;color:#fff}.box.key i,.box.key span{color:#bfd6e4}
.small{grid-template-columns:repeat(5,1fr);padding-top:0}
.small .box b{font-size:16px}
ul.checks{margin:0;padding:10px 18px 16px;list-style:none}
ul.checks li{display:flex;gap:10px;padding:7px 0;border-bottom:1px solid #edf1f5}
ul.checks li::before{content:"✓";color:#17662a;font-weight:700}
.foot{margin-top:18px;color:#6a7b8e;font-size:12px}
.form{display:grid;grid-template-columns:1fr 1fr;gap:0 24px;padding:8px 18px 16px}
.form p{display:flex;justify-content:space-between;gap:12px;margin:0;padding:9px 0;border-bottom:1px solid #edf1f5}
.form p span:first-child{color:#52657a}
.form p span:last-child{font-weight:600;text-align:right}
.steps{display:flex;gap:8px;padding:14px 18px;border-bottom:1px solid #e3eaf1}
.steps span{padding:5px 12px;border-radius:999px;background:#eef1f5;color:#52657a;font-size:12px;font-weight:600}
.steps span.on{background:#163a50;color:#fff}
tr.hl td{background:#eaf6ec}
.done{color:#17662a;font-weight:700}
html.shot .bar,html.shot .flag,html.shot .foot{display:none}
html.shot main{padding:20px 22px 22px}
@media(max-width:860px){.g2,.stats,.boxes,.small,.form{grid-template-columns:1fr 1fr}.form{grid-template-columns:1fr}.g2{grid-template-columns:1fr}main{padding:18px 14px 32px}.card{overflow-x:auto}.bar{padding:0 14px}.bar span:not(.org){display:none}.flag{padding:9px 14px}}
`

const check = `<svg viewBox="0 0 52 60" aria-hidden="true"><polyline points="6,32 20,52" fill="none" stroke="#13B5EA" stroke-width="13" stroke-linecap="round"/><polyline points="20,52 47,7" fill="none" stroke="#2CA01C" stroke-width="13" stroke-linecap="round"/></svg>`

const page = (title, sub, body) => `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex">
<title>${esc(title)} | Sample project | ${esc(company.name)}</title>
<style>${css}</style>
</head>
<body>
<header class="bar">${check}<b>KelvsBookkeeping</b><span>Sample ledger</span><span class="org">${esc(company.name)}</span></header>
<p class="flag"><b>Sample project</b> ${esc(company.name)} is a fictional company. Every customer, supplier and figure on this page is invented to show how the work is done. No client data is shown.</p>
<main>
<h1>${esc(title)}</h1>
<p class="sub">${esc(sub)}</p>
${body}
<p class="foot">Prepared by Kelvin Dienzo as a portfolio sample. Not a real set of books and not tax advice.</p>
</main>
</body>
</html>
`

const chipFor = { Matched: 'ok', Created: 'new', Flagged: 'warn' }

function bankPage() {
  const b = bank()
  const stats = [
    [b.counts.total, 'statement lines in April'],
    [b.counts.matched, 'matched to invoices and bills'],
    [b.counts.checked, 'looked into by hand'],
    [b.counts.open, 'left unreconciled'],
  ]
  const lines = b.lines.map((l) => `<tr><td>${l.date}</td><td>${esc(l.what)}</td><td class="n">${eur(l.out)}</td><td class="n">${eur(l.in)}</td><td>${esc(l.match)}</td><td><span class="chip ${chipFor[l.status]}">${l.status}</span></td></tr>`).join('')
  const row = (label, amount, cls = '') => `<p class="${cls}"><span>${esc(label)}</span><span class="n">${eur(amount)}</span></p>`
  return page('Bank reconciliation', `Current account, month ended ${company.periodEnd}`, `
<div class="stats">${stats.map(([n, t]) => `<div class="stat"><b>${n}</b><span>${t}</span></div>`).join('')}</div>
<div class="grid g2">
  <section class="card"><h2>Reconciliation statement</h2><div class="rows">
    ${row('Balance per bank statement', b.statementBalance)}
    ${row('Add: lodgements not yet on the statement', sum(b.lodgements, (x) => x.amount))}
    ${b.lodgements.map((x) => row(x.what, x.amount, 's')).join('')}
    ${row('Less: payments not yet presented', -sum(b.unpresented, (x) => x.amount))}
    ${b.unpresented.map((x) => row(x.what, -x.amount, 's')).join('')}
    ${row('Adjusted bank balance', b.adjusted, 't')}
    ${row('Balance per the ledger', b.ledgerBalance)}
    <p class="d"><span>Difference</span><span class="n good">${eur(b.adjusted - b.ledgerBalance)} ✓</span></p>
  </div></section>
  <section class="card"><h2>Statement lines (9 of ${b.counts.total} shown)</h2>
    <table><thead><tr><th>Date</th><th>Bank description</th><th class="n">Money out</th><th class="n">Money in</th><th>Matched to</th><th>Status</th></tr></thead><tbody>${lines}</tbody></table>
  </section>
</div>`)
}

function postingPage() {
  const note = (l) => (l.note ? `<small><span class="chip ${VAT[l.vat].kind === 'blocked' ? 'warn' : 'mute'}">${esc(l.note)}</span></small>` : '')
  const table = (list) => `<table><thead><tr><th>Ref</th><th>Date</th><th>Contact</th><th>Description</th><th>Account</th><th>VAT rate</th><th class="n">Net</th><th class="n">VAT</th><th class="n">Total</th></tr></thead><tbody>
${list.map((l) => `<tr><td>${l.ref}</td><td>${l.date}</td><td>${esc(l.contact)}</td><td>${esc(l.what)}${note(l)}</td><td>${esc(l.account)}</td><td>${VAT[l.vat].label}</td><td class="n">${eur(l.net)}</td><td class="n">${eur(vatOf(l))}</td><td class="n">${eur(grossOf(l))}</td></tr>`).join('')}
<tr class="total"><td colspan="6">${list.length} documents</td><td class="n">${eur(sum(list, (l) => l.net))}</td><td class="n">${eur(sum(list, vatOf))}</td><td class="n">${eur(sum(list, grossOf))}</td></tr></tbody></table>`
  return page('Bills and sales invoices posted', `${company.period}: every document coded to an account and a VAT rate`, `
<div class="grid">
  <section class="card"><h2>Sales invoices</h2>${table(sales)}</section>
  <section class="card"><h2>Bills</h2>${table(bills)}</section>
</div>`)
}

function vatPage() {
  const v = vat3()
  const box = (code, label, amount, cls = '') => `<div class="box ${cls}"><i>${code}</i><b>${eur(amount)}</b><span>${label}</span></div>`
  const rate = (key, list) => list.filter((l) => l.vat === key)
  const out = ['standard', 'reduced'].map((k) => `<tr><td>Sales at ${VAT[k].label}</td><td class="n">${eur(sum(rate(k, sales), (l) => l.net))}</td><td class="n">${eur(sum(rate(k, sales), vatOf))}</td></tr>`).join('')
  const input = bills.filter((b) => VAT[b.vat].kind === 'domestic' && vatOf(b) > 0).map((b) => `<tr><td>${esc(b.contact)}</td><td class="n">${eur(b.net)}</td><td class="n">${eur(vatOf(b))}</td></tr>`).join('')
  return page('VAT3 return and workpaper', `Irish VAT, two-month period ${company.period}`, `
<div class="grid">
  <section class="card"><h2>VAT3 figures</h2>
    <div class="boxes">${box('T1', 'VAT on sales', v.T1)}${box('T2', 'VAT on purchases', v.T2)}${box('T3', 'VAT payable', v.T3, 'key')}${box('T4', 'VAT repayable', v.T4)}</div>
    <div class="boxes small">${box('E1', 'EU supplies of goods', v.E1)}${box('E2', 'EU acquisitions of goods', v.E2)}${box('ES1', 'EU supplies of services', v.ES1)}${box('ES2', 'EU acquisitions of services', v.ES2)}${box('PA1', 'Postponed accounting', v.PA1)}</div>
  </section>
  <div class="grid g2" style="grid-template-columns:1fr 1fr">
    <section class="card"><h2>Workpaper: T1, VAT on sales</h2>
      <table><thead><tr><th>Source</th><th class="n">Net</th><th class="n">VAT</th></tr></thead><tbody>${out}
      <tr><td>EU acquisition, self-accounted at 23%</td><td class="n">${eur(v.E2)}</td><td class="n">${eur(v.selfAccounted)}</td></tr>
      <tr><td>EU supply of goods, zero-rated</td><td class="n">${eur(v.E1)}</td><td class="n">${eur(0)}</td></tr>
      <tr class="double"><td>T1</td><td></td><td class="n">${eur(v.T1)}</td></tr></tbody></table>
    </section>
    <section class="card"><h2>Workpaper: T2, VAT on purchases</h2>
      <table><thead><tr><th>Source</th><th class="n">Net</th><th class="n">VAT</th></tr></thead><tbody>${input}
      <tr><td>EU acquisition, reclaimed at 23%</td><td class="n">${eur(v.E2)}</td><td class="n">${eur(v.selfAccounted)}</td></tr>
      <tr class="double"><td>T2</td><td></td><td class="n">${eur(v.T2)}</td></tr></tbody></table>
    </section>
  </div>
  <section class="card"><h2>Checks before filing</h2><ul class="checks">
    <li>T1 and T2 agree to the VAT control account in the ledger for the period.</li>
    <li>Client lunch: ${eur(v.blocked)} of VAT on food and drink left out of T2, as it cannot be reclaimed.</li>
    <li>German supplier bill: VAT self-accounted in T1 and reclaimed in T2, value reported in E2.</li>
    <li>Danish customer: VAT number checked, sale zero-rated and reported in E1.</li>
    <li>Rent carries no VAT, so nothing is claimed on it.</li>
  </ul></section>
</div>`)
}

function payablesPage() {
  const p = payables()
  const heads = ['Current (0-30)', '31-60 days', '61-90 days', 'Over 90 days']
  const rows = p.rows.map((r) => `<tr><td>${esc(r.supplier)}</td><td>${r.ref}</td><td>${r.date}</td><td class="n">${r.days}</td>${[0, 1, 2, 3].map((b) => `<td class="n">${r.bucket === b ? eur(r.amount) : ''}</td>`).join('')}<td class="n">${eur(r.amount)}</td><td><span class="chip ${r.tone}">${esc(r.finding)}</span></td></tr>`).join('')
  const stats = [
    [eur(p.before), 'owed per the report before the review'],
    [eur(p.total), 'owed after the review'],
    [eur(p.paymentRun), 'proposed for the next payment run'],
    [eur(p.rows.find((r) => r.tone === 'warn').amount), 'on hold as disputed'],
  ]
  return page('Aged payables review', `Supplier balances at ${company.periodEnd}`, `
<div class="stats">${stats.map(([n, t]) => `<div class="stat"><b>${n}</b><span>${t}</span></div>`).join('')}</div>
<div class="grid">
  <section class="card"><h2>Aged payables after review</h2>
    <table><thead><tr><th>Supplier</th><th>Bill</th><th>Dated</th><th class="n">Days</th>${heads.map((h) => `<th class="n">${h}</th>`).join('')}<th class="n">Total</th><th>Review note</th></tr></thead><tbody>${rows}
    <tr class="double"><td colspan="4">Total owed to suppliers</td>${p.buckets.map((b) => `<td class="n">${eur(b)}</td>`).join('')}<td class="n">${eur(p.total)}</td><td></td></tr></tbody></table>
  </section>
  <section class="card"><h2>What the review found</h2><ul class="checks">
    <li>A Westlink Broadband bill had been entered twice. The duplicate of ${eur(p.duplicate)} was removed.</li>
    <li>Credit note CN-0044 from Wicklow Bike Distributors for ${eur(p.creditNote)} was sitting unallocated. It is now applied against BILL-0298.</li>
    <li>Galway Signs is 112 days old because the goods were returned. It is on hold until the supplier issues a credit.</li>
    <li>The total of ${eur(p.total)} agrees to the creditors control account in the ledger.</li>
  </ul></section>
</div>`)
}

function monthEndPage() {
  const m = monthEnd()
  const tasks = m.tasks.map((t, i) => `<tr><td class="n">${i + 1}</td><td>${esc(t.task)}</td><td>${esc(t.check)}</td><td class="n">${eur(t.value)}</td><td class="done">✓ Done</td></tr>`).join('')
  const journals = m.journals.map((j) => `<tr><td>${j.ref}</td><td>${esc(j.what)}</td><td>${esc(j.dr)}</td><td>${esc(j.cr)}</td><td class="n">${eur(j.amount)}</td></tr>`).join('')
  const stats = [[`${m.tasks.length} of ${m.tasks.length}`, 'close tasks complete'], [m.journals.length, 'month-end journals posted'], [eur(m.journalTotal), 'total of the journals'], ['06 May', 'period locked']]
  return page('Month-end close', `April 2026 close checklist and journals`, `
<div class="stats">${stats.map(([n, t]) => `<div class="stat"><b>${n}</b><span>${t}</span></div>`).join('')}</div>
<div class="grid">
  <section class="card"><h2>Close checklist</h2>
    <table><thead><tr><th class="n">#</th><th>Task</th><th>Checked against</th><th class="n">Balance</th><th>Status</th></tr></thead><tbody>${tasks}</tbody></table>
  </section>
  <section class="card"><h2>Month-end journals</h2>
    <table><thead><tr><th>Journal</th><th>Narration</th><th>Debit</th><th>Credit</th><th class="n">Amount</th></tr></thead><tbody>${journals}
    <tr class="double"><td colspan="4">Total</td><td class="n">${eur(m.journalTotal)}</td></tr></tbody></table>
  </section>
</div>`)
}

function assetsPage() {
  const a = assets()
  const n = a.added
  const field = (label, value) => `<p><span>${label}</span><span>${esc(value)}</span></p>`
  const rows = a.list.map((x) => `<tr class="${x.added ? 'hl' : ''}"><td>${x.no}</td><td>${esc(x.name)}${x.added ? '<small><span class="chip ok">Added this month</span></small>' : ''}</td><td>${esc(x.type)}</td><td>${x.bought}</td><td class="n">${eur(x.cost)}</td><td class="n">${Math.round(x.rate * 100)}%</td><td class="n">${eur(x.monthly)}</td><td class="n">${eur(x.accumulated)}</td><td class="n">${eur(x.nbv)}</td></tr>`).join('')
  return page('Fixed asset register', `Adding a new asset and running April depreciation`, `
<div class="grid">
  <section class="card"><h2>New asset: ${n.no}</h2>
    <div class="steps"><span>Draft</span><span class="on">Registered</span><span>Sold or disposed</span></div>
    <div class="form">
      ${field('Asset name', n.name)}${field('Asset number', n.no)}
      ${field('Purchase date', n.bought)}${field('Purchase price, before VAT', eur(n.cost))}
      ${field('Bought from', `${a.bill.contact}, ${a.bill.ref}`)}${field('VAT on the bill, reclaimed in the VAT3', eur(vatOf(a.bill)))}
      ${field('Asset type', n.type)}${field('Asset account', a.bill.account)}
      ${field('Depreciation method', 'Straight line')}${field('Rate', `${Math.round(n.rate * 100)}% a year (5-year life)`)}
      ${field('Depreciation start date', n.bought)}${field('Averaging method', 'Full month')}
      ${field('Residual value', eur(0))}${field('Depreciation each month', eur(n.monthly))}
    </div>
  </section>
  <section class="card"><h2>Register at ${company.periodEnd}</h2>
    <table><thead><tr><th>No.</th><th>Asset</th><th>Type</th><th>Bought</th><th class="n">Cost</th><th class="n">Rate</th><th class="n">Monthly</th><th class="n">Accumulated</th><th class="n">Book value</th></tr></thead><tbody>${rows}
    <tr class="double"><td colspan="4">${a.list.length} assets</td><td class="n">${eur(a.cost)}</td><td></td><td class="n">${eur(a.monthCharge)}</td><td class="n">${eur(a.accumulated)}</td><td class="n">${eur(a.nbv)}</td></tr></tbody></table>
  </section>
  <section class="card"><h2>Checks</h2><ul class="checks">
    <li>The bill was coded to the fixed asset account, not to an expense, so the cost is spread over 5 years.</li>
    <li>The asset is registered at ${eur(n.cost)} before VAT, because the ${eur(vatOf(a.bill))} of VAT is reclaimed.</li>
    <li>April depreciation of ${eur(a.monthCharge)} posted: debit 6950 Depreciation, credit 1510 Accumulated depreciation.</li>
    <li>Register cost of ${eur(a.cost)} and book value of ${eur(a.nbv)} agree to the fixed asset accounts in the ledger.</li>
  </ul></section>
</div>`)
}

function receivedPage() {
  const how = (i) => (i % 3 === 0 ? 'Uploaded' : 'Emailed')
  const docs = [
    ...sales.map((d) => ({ ...d, kind: 'Sales invoice', how: 'From the till system' })),
    ...bills.map((d, i) => ({ ...d, kind: 'Supplier bill', how: how(i) })),
  ]
  const rows = docs.map((d) => `<tr><td>${d.ref}</td><td>${d.kind}</td><td>${esc(d.contact)}</td><td>${d.date}</td><td>${d.how}</td><td class="n">${eur(grossOf(d))}</td><td><span class="chip ok">Captured</span></td></tr>`).join('')
  const stats = [[docs.length, 'documents received'], [docs.length, 'captured with the file attached'], [0, 'missing or unreadable'], [1, 'bank statement received']]
  return page('Documents received', `${company.period}: everything the client sent, checked in`, `
<div class="stats">${stats.map(([n, t]) => `<div class="stat"><b>${n}</b><span>${t}</span></div>`).join('')}</div>
<div class="grid">
  <section class="card"><h2>Inbox</h2>
    <table><thead><tr><th>Ref</th><th>Type</th><th>From</th><th>Dated</th><th>How it arrived</th><th class="n">Amount</th><th>Status</th></tr></thead><tbody>${rows}
    <tr><td>STMT-04</td><td>Bank statement</td><td>Current account, April</td><td>30 Apr</td><td>Bank feed</td><td class="n"></td><td><span class="chip new">Received</span></td></tr>
    <tr class="total"><td colspan="5">${docs.length} documents ready to post</td><td class="n">${eur(sum(docs, grossOf))}</td><td></td></tr></tbody></table>
  </section>
</div>`)
}

function importPage() {
  const b = bank()
  const lines = b.lines.map((l) => `<tr><td>${l.date}</td><td>${esc(l.what)}</td><td class="n">${eur(l.out)}</td><td class="n">${eur(l.in)}</td><td><span class="chip mute">Imported</span></td></tr>`).join('')
  const row = (label, amount, cls = '') => `<p class="${cls}"><span>${esc(label)}</span><span class="n">${eur(amount)}</span></p>`
  const stats = [[b.counts.total, 'statement lines imported'], [0, 'duplicate lines'], [0, 'gaps in the dates'], [eur(b.statementBalance), 'closing balance']]
  return page('Bank statement imported', `Current account, April 2026: checked before a single line is matched`, `
<div class="stats">${stats.map(([n, t]) => `<div class="stat"><b>${n}</b><span>${t}</span></div>`).join('')}</div>
<div class="grid g2">
  <section class="card"><h2>Balance check</h2><div class="rows">
    ${row('Opening balance, 1 April', b.opening)}
    ${row('Add: money in', b.statementIn)}
    ${row('Less: money out', -b.statementOut)}
    ${row('Closing balance, 30 April', b.statementBalance, 't')}
    ${row('Closing balance on the bank statement', b.statementBalance)}
    <p class="d"><span>Difference</span><span class="n good">${eur(0)} ✓</span></p>
  </div></section>
  <section class="card"><h2>Imported lines (9 of ${b.counts.total} shown)</h2>
    <table><thead><tr><th>Date</th><th>Bank description</th><th class="n">Money out</th><th class="n">Money in</th><th>Status</th></tr></thead><tbody>${lines}</tbody></table>
  </section>
</div>`)
}

const pages = [
  { id: 'bank-reconciliation', html: bankPage() },
  { id: 'posting', html: postingPage() },
  { id: 'vat-return', html: vatPage() },
  { id: 'aged-payables', html: payablesPage() },
  { id: 'month-end-close', html: monthEndPage() },
  { id: 'fixed-assets', html: assetsPage() },
  // Screens for the Showcase walk only (no Work project of their own).
  { id: 'documents-received', html: receivedPage() },
  { id: 'bank-import', html: importPage() },
]

mkdirSync(join(pub, 'demos/samples'), { recursive: true })
for (const p of pages) writeFileSync(join(pub, 'demos/samples', `${p.id}.html`), p.html)
console.log('VAT3', JSON.stringify(vat3()))
const b = bank()
console.log('bank', b.statementBalance, '->', b.adjusted, 'ledger', b.ledgerBalance)

// Screens for the Work section, taken without the page's own top bar and notice (the site frames them in a
// window that says so): a cover, the top 1200 x 750 at 1.5x = 1800 x 1125 with 480 / 640 / 960 copies, and the
// whole page at 1000 wide (1500px) for the case study. Their sizes go to src/content/sample-shots.ts.
const sizes = {}
const browser = await chromium.launch({ channel: 'chrome' })
try {
  const tab = await browser.newPage({ viewport: { width: 1200, height: 750 }, deviceScaleFactor: 1.5 })
  for (const p of pages) {
    await tab.setViewportSize({ width: 1200, height: 750 })
    await tab.goto(pathToFileURL(join(pub, 'demos/samples', `${p.id}.html`)).href)
    await tab.evaluate(() => document.documentElement.classList.add('shot'))
    const png = (await tab.screenshot()).toString('base64')
    const copies = await tab.evaluate(async (b64) => {
      const img = new Image()
      img.src = `data:image/png;base64,${b64}`
      await img.decode()
      const out = {}
      for (const w of [1800, 960, 640, 480]) {
        const cv = document.createElement('canvas')
        cv.width = w
        cv.height = Math.round((img.naturalHeight * w) / img.naturalWidth)
        const g = cv.getContext('2d')
        g.imageSmoothingQuality = 'high'
        g.drawImage(img, 0, 0, cv.width, cv.height)
        out[w] = cv.toDataURL('image/webp', 0.9)
      }
      return out
    }, png)
    for (const [w, url] of Object.entries(copies)) {
      const dir = w === '1800' ? join(pub, 'images/covers') : join(pub, 'images/covers', w)
      mkdirSync(dir, { recursive: true })
      writeFileSync(join(dir, `sample-${p.id}.webp`), Buffer.from(url.split(',')[1], 'base64'))
    }
    await tab.setViewportSize({ width: 1000, height: 700 })
    const full = (await tab.screenshot({ fullPage: true })).toString('base64')
    const shot = await tab.evaluate(async (b64) => {
      const img = new Image()
      img.src = `data:image/png;base64,${b64}`
      await img.decode()
      const cv = document.createElement('canvas')
      cv.width = img.naturalWidth
      cv.height = img.naturalHeight
      cv.getContext('2d').drawImage(img, 0, 0)
      return { url: cv.toDataURL('image/webp', 0.9), width: cv.width, height: cv.height }
    }, full)
    writeFileSync(join(pub, 'images/covers', `sample-${p.id}-full.webp`), Buffer.from(shot.url.split(',')[1], 'base64'))
    sizes[p.id] = { width: shot.width, height: shot.height }
    console.log('wrote', p.id)
  }
} finally {
  await browser.close()
}
writeFileSync(
  join(root, 'src/content/sample-shots.ts'),
  `/** Sizes of the full-length sample screens (public/images/covers/sample-<id>-full.webp). Written by scripts/sample-projects/build.mjs. */
export const sampleShots: Record<string, { width: number; height: number }> = ${JSON.stringify(sizes, null, 2).replace(/"/g, "'")}
`,
)
