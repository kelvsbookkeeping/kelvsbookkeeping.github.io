// The fictional books behind the three sample projects in the Work section. Every figure on the sample
// pages is computed from these lists, so the bank reconciliation, the postings and the VAT3 always agree.
// Corrib Cycles Ltd is invented: no real company, customer or supplier is described.

export const company = { name: 'Corrib Cycles Ltd', place: 'Galway, Ireland', period: 'March - April 2026', periodEnd: '30 April 2026' }

/** VAT treatments. `rate` is the Irish VAT rate applied; `kind` drives the VAT3 boxes. */
export const VAT = {
  standard: { label: '23%', rate: 0.23, kind: 'domestic' },
  reduced: { label: '13.5%', rate: 0.135, kind: 'domestic' },
  none: { label: 'No VAT', rate: 0, kind: 'domestic' },
  euGoodsOut: { label: '0% EU goods', rate: 0, kind: 'euGoodsOut' },
  euGoodsIn: { label: 'EU acquisition 23%', rate: 0.23, kind: 'euGoodsIn' },
  blocked: { label: '13.5% not reclaimed', rate: 0.135, kind: 'blocked' },
}

export const sales = [
  { ref: 'INV-1041', date: '04 Mar', contact: 'Brennan & Hayes Solicitors', what: 'Cycle-to-work bikes x 2', account: '4000 Sales - Bikes', vat: 'standard', net: 1800 },
  { ref: 'INV-1042', date: '11 Mar', contact: 'Dunmore Hotel', what: 'Guest bike fleet x 4', account: '4000 Sales - Bikes', vat: 'standard', net: 2400 },
  { ref: 'INV-1043', date: '19 Mar', contact: 'Atlantic Surf School', what: 'Fleet servicing', account: '4010 Sales - Servicing', vat: 'reduced', net: 640 },
  { ref: 'INV-1044', date: '26 Mar', contact: 'Kilbride Couriers', what: 'Cargo bikes x 2', account: '4000 Sales - Bikes', vat: 'standard', net: 3150 },
  { ref: 'INV-1045', date: '02 Apr', contact: 'Riverbank Cafe', what: 'Delivery bike repairs', account: '4010 Sales - Servicing', vat: 'reduced', net: 420 },
  { ref: 'INV-1046', date: '09 Apr', contact: 'Glenview Cycling Club', what: 'Wheel builds and servicing', account: '4010 Sales - Servicing', vat: 'reduced', net: 1800 },
  { ref: 'INV-1047', date: '16 Apr', contact: 'Nordlys Cykler ApS (Denmark)', what: 'Bikes shipped to Denmark', account: '4020 Sales - EU', vat: 'euGoodsOut', net: 1200, note: 'Customer VAT number checked' },
]

export const bills = [
  { ref: 'BILL-0311', date: '06 Mar', contact: 'Wicklow Bike Distributors', what: 'Bike stock', account: '5000 Cost of sales', vat: 'standard', net: 1900 },
  { ref: 'BILL-0312', date: '10 Mar', contact: 'Quay Street Properties', what: 'Shop rent, March and April', account: '6100 Rent', vat: 'none', net: 1500, note: 'Landlord not charging VAT' },
  { ref: 'BILL-0313', date: '14 Mar', contact: 'Fahrradteile Keller GmbH (Germany)', what: 'Parts and components', account: '5000 Cost of sales', vat: 'euGoodsIn', net: 1000, note: 'Reverse charge' },
  { ref: 'BILL-0314', date: '21 Mar', contact: 'Westlink Broadband', what: 'Broadband and phone', account: '6200 Telephone', vat: 'standard', net: 120 },
  { ref: 'BILL-0315', date: '03 Apr', contact: 'Tillpoint Software', what: 'Till software subscription', account: '6400 Software', vat: 'standard', net: 140 },
  { ref: 'BILL-0316', date: '15 Apr', contact: 'Westside Service Station', what: 'Diesel for the van', account: '6500 Motor - fuel', vat: 'standard', net: 200 },
  { ref: 'BILL-0317', date: '22 Apr', contact: 'The Quay Kitchen', what: 'Client lunch', account: '6600 Entertainment', vat: 'blocked', net: 100, note: 'VAT on food and drink not reclaimed' },
  { ref: 'BILL-0318', date: '28 Apr', contact: 'Shannon Couriers', what: 'Deliveries to customers', account: '6300 Delivery', vat: 'standard', net: 260 },
  { ref: 'BILL-0319', date: '20 Apr', contact: 'Atlantic Workshop Supplies', what: 'Hydraulic workshop bike lift', account: '1500 Fixed assets - Equipment', vat: 'standard', net: 1600, note: 'Capital item: added to the asset register' },
]

const cents = (n) => Math.round(n * 100)
export const vatOf = (line) => cents(line.net * VAT[line.vat].rate) / 100
/** What the customer pays or the supplier is paid. A reverse-charge bill is paid net: the VAT is self-accounted. */
export const grossOf = (line) => (VAT[line.vat].kind === 'euGoodsIn' ? line.net : cents(line.net + vatOf(line)) / 100)
export const sum = (list, f) => cents(list.reduce((t, x) => t + f(x), 0)) / 100
const byRef = (list, ref) => list.find((x) => x.ref === ref)

/** The VAT3 for the period, built from the postings. */
export function vat3() {
  const salesVat = sum(sales, vatOf)
  const acquisitions = bills.filter((b) => VAT[b.vat].kind === 'euGoodsIn')
  const selfAccounted = sum(acquisitions, vatOf)
  const reclaimable = sum(bills.filter((b) => VAT[b.vat].kind === 'domestic'), vatOf)
  const T1 = cents(salesVat + selfAccounted) / 100
  const T2 = cents(reclaimable + selfAccounted) / 100
  const net = cents(T1 - T2) / 100
  return {
    salesVat,
    selfAccounted,
    reclaimable,
    blocked: sum(bills.filter((b) => VAT[b.vat].kind === 'blocked'), vatOf),
    T1,
    T2,
    T3: net > 0 ? net : 0,
    T4: net < 0 ? -net : 0,
    E1: sum(sales.filter((s) => VAT[s.vat].kind === 'euGoodsOut'), (s) => s.net),
    E2: sum(acquisitions, (b) => b.net),
    ES1: 0,
    ES2: 0,
    PA1: 0,
  }
}

/** The bank statement for April and how each line was dealt with. Amounts come from the postings. */
export function bank() {
  const g = (list, ref) => grossOf(byRef(list, ref))
  const lines = [
    { date: '03 Apr', what: 'BRENNAN HAYES SOL', in: g(sales, 'INV-1041'), match: 'INV-1041', status: 'Matched' },
    { date: '07 Apr', what: 'DUNMORE HOTEL LTD', in: g(sales, 'INV-1042'), match: 'INV-1042', status: 'Matched' },
    { date: '08 Apr', what: 'WICKLOW BIKE DIST', out: g(bills, 'BILL-0311'), match: 'BILL-0311', status: 'Matched' },
    { date: '10 Apr', what: 'ATLANTIC SURF SCH', in: g(sales, 'INV-1043'), match: 'INV-1043', status: 'Matched' },
    { date: '14 Apr', what: 'RIVERBANK CAFE', in: g(sales, 'INV-1045'), match: 'INV-1045', status: 'Matched' },
    { date: '15 Apr', what: 'RIVERBANK CAFE', in: g(sales, 'INV-1045'), match: 'Paid twice: refund raised', status: 'Flagged' },
    { date: '17 Apr', what: 'WESTLINK BROADBAND DD', out: g(bills, 'BILL-0314'), match: 'BILL-0314', status: 'Matched' },
    { date: '24 Apr', what: 'GLENVIEW CYCLING CLUB', in: g(sales, 'INV-1046'), match: 'INV-1046', status: 'Matched' },
    { date: '30 Apr', what: 'ACCOUNT MAINTENANCE FEE', out: 12.5, match: '6700 Bank charges', status: 'Created' },
  ]
  const statementBalance = 18462.35
  // The whole April statement (42 lines), of which `lines` shows nine: what came in and went out, and so where it opened.
  const statementIn = 14206.45
  const statementOut = 9318.9
  const opening = cents(statementBalance - statementIn + statementOut) / 100
  const lodgements = [{ what: `Kilbride Couriers, ${byRef(sales, 'INV-1044').ref}, lodged 30 Apr`, amount: g(sales, 'INV-1044') }]
  const unpresented = [{ what: `Shannon Couriers, ${byRef(bills, 'BILL-0318').ref}, paid 29 Apr`, amount: g(bills, 'BILL-0318') }]
  const adjusted = cents(statementBalance + sum(lodgements, (x) => x.amount) - sum(unpresented, (x) => x.amount)) / 100
  return { lines, statementBalance, statementIn, statementOut, opening, lodgements, unpresented, adjusted, ledgerBalance: adjusted, counts: { total: 42, matched: 39, checked: 3, open: 0 } }
}

export const money = (n) => n.toLocaleString('en-IE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

/** Fixed asset register at the period end. Straight line, a full month in the month of purchase. */
export function assets() {
  const lift = bills.find((b) => b.ref === 'BILL-0319')
  const list = [
    { no: 'FA-0003', name: 'Delivery van', type: 'Motor vehicles', bought: '01 Jan 2025', cost: 18000, rate: 0.2, months: 16 },
    { no: 'FA-0005', name: 'Till and point-of-sale system', type: 'Office equipment', bought: '01 Jul 2025', cost: 1200, rate: 0.25, months: 10 },
    { no: 'FA-0006', name: 'Workshop tool set', type: 'Workshop equipment', bought: '01 Oct 2025', cost: 2400, rate: 0.2, months: 7 },
    { no: 'FA-0007', name: 'Hydraulic workshop bike lift', type: 'Workshop equipment', bought: '20 Apr 2026', cost: lift.net, rate: 0.2, months: 1, added: true },
  ].map((a) => {
    const monthly = cents((a.cost * a.rate) / 12) / 100
    const accumulated = cents(monthly * a.months) / 100
    return { ...a, monthly, accumulated, nbv: cents(a.cost - accumulated) / 100 }
  })
  return {
    list,
    added: list.find((a) => a.added),
    bill: lift,
    cost: sum(list, (a) => a.cost),
    accumulated: sum(list, (a) => a.accumulated),
    nbv: sum(list, (a) => a.nbv),
    monthCharge: sum(list, (a) => a.monthly),
  }
}

/** Aged payables at the period end, after the review. Days are counted from the bill date to 30 April 2026. */
export function payables() {
  const g = (ref) => grossOf(bills.find((b) => b.ref === ref))
  const creditNote = 123
  const duplicate = g('BILL-0314')
  const rows = [
    { supplier: 'Atlantic Workshop Supplies', ref: 'BILL-0319', date: '20 Apr', days: 10, amount: g('BILL-0319'), finding: 'Not yet due', tone: 'mute' },
    { supplier: 'Tillpoint Software', ref: 'BILL-0315', date: '03 Apr', days: 27, amount: g('BILL-0315'), finding: 'Not yet due', tone: 'mute' },
    { supplier: 'Fahrradteile Keller GmbH', ref: 'BILL-0313', date: '14 Mar', days: 47, amount: g('BILL-0313'), finding: 'Overdue: in the next payment run', tone: 'new' },
    { supplier: 'Wicklow Bike Distributors', ref: 'BILL-0298', date: '12 Feb', days: 77, amount: cents(1230 - creditNote) / 100, finding: `Credit note CN-0044 (${money(creditNote)}) applied`, tone: 'ok' },
    { supplier: 'Galway Signs', ref: 'BILL-0271', date: '08 Jan', days: 112, amount: 369, finding: 'Disputed: on hold, credit requested', tone: 'warn' },
  ].map((r) => ({ ...r, bucket: r.days <= 30 ? 0 : r.days <= 60 ? 1 : r.days <= 90 ? 2 : 3 }))
  const total = sum(rows, (r) => r.amount)
  const run = rows.filter((r) => ['BILL-0313', 'BILL-0298'].includes(r.ref))
  return {
    rows,
    buckets: [0, 1, 2, 3].map((b) => sum(rows.filter((r) => r.bucket === b), (r) => r.amount)),
    total,
    creditNote,
    duplicate,
    before: cents(total + creditNote + duplicate) / 100,
    paymentRun: sum(run, (r) => r.amount),
  }
}

/** The April month-end close: each task, what it was checked against, and the journals posted. */
export function monthEnd() {
  const a = assets()
  const p = payables()
  const b = bank()
  const v = vat3()
  const unpaidSale = sales.find((s) => s.ref === 'INV-1047')
  const journals = [
    { ref: 'MJ-0412', what: 'Accrue April electricity, not yet billed', dr: '6800 Light and heat', cr: '2100 Accruals', amount: 180 },
    { ref: 'MJ-0413', what: 'Release April share of prepaid insurance', dr: '6900 Insurance', cr: '1300 Prepayments', amount: 100 },
    { ref: 'MJ-0414', what: 'Release April share of rent paid in March', dr: '6100 Rent', cr: '1300 Prepayments', amount: 750 },
    { ref: 'MJ-0415', what: 'April depreciation per the asset register', dr: '6950 Depreciation', cr: '1510 Accumulated depreciation', amount: a.monthCharge },
  ]
  const tasks = [
    { task: 'Bank account reconciled', check: `Difference ${money(b.adjusted - b.ledgerBalance)}`, value: b.ledgerBalance },
    { task: 'Sales invoices and bills posted and reviewed', check: `${sales.length} invoices, ${bills.length} bills`, value: null },
    { task: 'Aged payables agreed to the creditors control account', check: 'Agrees', value: p.total },
    { task: 'Aged receivables reviewed', check: `1 invoice open (${unpaidSale.ref}); refund due for a double payment`, value: grossOf(unpaidSale) },
    { task: 'Accruals and prepayments posted', check: '3 journals', value: sum(journals.slice(0, 3), (j) => j.amount) },
    { task: 'Fixed asset register updated and depreciation run', check: '1 addition; register agrees to the ledger', value: a.nbv },
    { task: 'VAT control account agreed to the VAT3', check: 'T3 payable', value: v.T3 },
    { task: 'Period locked and reports sent', check: 'Locked 06 May 2026', value: null },
  ]
  return { tasks, journals, journalTotal: sum(journals, (j) => j.amount) }
}
