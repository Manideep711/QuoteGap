export const money = value => value == null ? 'Not provided' : new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 0,maximumFractionDigits: 2 }).format(value);
export const norm = v => String(v ?? '').trim().toLowerCase().replace(/\s+/g, ' ');
const aliases = { item: ['item','description','item description','name'], code: ['code','item code','sku'], specification: ['specification','specifications','spec','material'], quantity: ['quantity','qty'], unit: ['unit','uom'], rate: ['rate','unit rate','price'], included: ['included','inclusion'], notes: ['notes','remarks','exclusions'] };
const num = (v, field, row, optional = false) => { if (v == null || String(v).trim() === '') { if (optional) return null; throw Error(`Row ${row}: ${field} is required.`); } const n = Number(String(v).replace(/[₹,\s]/g,'')); if (!Number.isFinite(n) || n < 0 || n>1e9) throw Error(`Row ${row}: ${field} must be a non-negative number no greater than 1,000,000,000.`); return n; };
export function parseRows(raw, name, type) {
  if (!raw.length) throw Error(`${name}: the sheet is empty.`);
  if (raw.length > 500) throw Error(`${name}: use at most 500 line items.`);
  const headers = Object.keys(raw[0]); const map = Object.fromEntries(Object.entries(aliases).map(([key, values]) => [key,headers.find(h=>values.includes(norm(h)))]));
  for (const field of ['item','quantity','unit']) if (!map[field]) throw Error(`${name}: missing ${field} column. Download the template for the supported format.`);
  if (type === 'quote' && !map.rate) throw Error(`${name}: missing rate column.`);
  const codes = new Set(); const items = raw.map((row,index) => { const get = k => map[k] ? String(row[map[k]] ?? '').trim() : ''; const sourceRow=row.__sourceRow??index+2; const code=get('code'); if(code && codes.has(norm(code))) throw Error(`${name}: duplicate code ${code} at row ${sourceRow}. Give each line a unique code.`); if(code) codes.add(norm(code)); if(!get('item')) throw Error(`${name}: row ${sourceRow} needs an item description.`); if(!get('unit')) throw Error(`${name}: row ${sourceRow} needs a unit.`); const inclusion = norm(get('included')); if(inclusion && !['yes','no','included','excluded','true','false'].includes(inclusion)) throw Error(`${name}: row ${sourceRow}: Included must be Yes or No.`);
    return { id: `${type}-${index}`, code, item:get('item'), specification:get('specification'), quantity:num(get('quantity'),'quantity',sourceRow), unit:get('unit'), rate:type==='quote'?num(get('rate'),'rate',sourceRow,true):null, included:!['no','excluded','false'].includes(inclusion), notes:get('notes'), sourceRow };
  }); return { id:crypto.randomUUID(),name,type,items };
}
export function suggest(scope, quote) {
 const used = new Set(); return scope.items.map(s => { let index = quote.items.findIndex((q,i)=>!used.has(i)&&s.code&&norm(q.code)===norm(s.code)); let confirmed = index >= 0; if(index<0) { index=quote.items.findIndex((q,i)=>!used.has(i)&&norm(q.item)===norm(s.item)); } if(index<0) { const words = new Set(norm(s.item).split(/\W+/).filter(w=>w.length>2)); let best=0.4; quote.items.forEach((q,i)=>{ if(used.has(i))return; const tokens=new Set(norm(q.item).split(/\W+/).filter(w=>w.length>2)); const score=[...words].filter(w=>tokens.has(w)).length/Math.max(words.size,tokens.size,1); if(score>best) {best=score;index=i;} }); } if(index>=0)used.add(index); return {scopeId:s.id,quoteIndex:index>=0?index:null,confirmed}; });
}
export function inspect(s,q,confirmed) {
 if(!q) return [{kind:'missing',label:'Missing from quote',detail:'No quotation line is mapped to this scope item.'}];
 const issues=[]; if(!confirmed)issues.push({kind:'review',label:'Match needs review',detail:'Confirm that these two rows describe the same work.'});
 if(!q.included)issues.push({kind:'missing',label:'Excluded',detail:'The vendor explicitly excluded this line.'});
 if(norm(s.item)!==norm(q.item))issues.push({kind:'spec',label:'Description differs',detail:`Scope: ${s.item}. Quote: ${q.item}.`});
 if(s.specification && norm(s.specification)!==norm(q.specification))issues.push({kind:'spec',label:q.specification?'Specification differs':'Specification unspecified',detail:`Required: ${s.specification}. Quoted: ${q.specification||'not specified'}.`});
 if(norm(s.unit)!==norm(q.unit))issues.push({kind:'quantity',label:'Unit differs',detail:`${s.unit} required; ${q.unit} quoted. No automatic unit conversion.`});
 if(s.quantity!==q.quantity)issues.push({kind:'quantity',label:'Quantity differs',detail:`${s.quantity} required; ${q.quantity} quoted.`});
 if(q.included && q.rate==null)issues.push({kind:'review',label:'Rate missing',detail:'The quoted subtotal is incomplete.'});
 return issues;
}
export function evaluate(scope, quote, mappings) {
 const rows=scope.items.map(s=>{const m=mappings.find(m=>m.scopeId===s.id)??{quoteIndex:null,confirmed:false}; const q=m.quoteIndex==null?null:quote.items[m.quoteIndex];return {scope:s,quote:q??null,confirmed:m.confirmed,issues:inspect(s,q,m.confirmed)};});
 const used = new Set(mappings.filter(m=>m.quoteIndex!=null).map(m=>m.quoteIndex)); const extras=quote.items.filter((_,i)=>!used.has(i));
 const total=quote.items.reduce((sum,q)=>sum+(q.included&&q.rate!=null?q.quantity*q.rate:0),0);
 return { vendor:quote.name,total,partial:quote.items.some(q=>q.included&&q.rate==null),rows,extras,issues:rows.flatMap(row=>row.issues.map(issue=>({...issue,scope:row.scope,quote:row.quote}))),unconfirmed:rows.filter(r=>r.quote&&!r.confirmed).length };
}
