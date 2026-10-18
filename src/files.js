import Papa from 'papaparse';
import {parseRows} from './engine.js';
export async function readSheet(file,type){
 if(file.size>5*1024*1024)throw Error(`${file.name}: maximum file size is 5 MB.`);
 let rows;
 if(/\.csv$/i.test(file.name)){const parsed=Papa.parse(await file.text(),{header:true,skipEmptyLines:false,transformHeader:h=>h.trim()});const realErrors=parsed.errors.filter(e=>!parsed.data[e.row]||Object.values(parsed.data[e.row]).some(v=>String(v??'').trim()!==''));if(realErrors.length)throw Error(`${file.name}: CSV could not be parsed (${realErrors[0].message}).`);if(Object.keys(parsed.meta.renamedHeaders??{}).length)throw Error('Column names must be unique.');rows=parsed.data.map((row,i)=>({...row,__sourceRow:i+2})).filter(row=>Object.entries(row).some(([k,v])=>k!=='__sourceRow'&&String(v??'').trim()!==''));}
 else if(/\.xlsx$/i.test(file.name)){const {default:ExcelJS}=await import('exceljs');const workbook=new ExcelJS.Workbook();await workbook.xlsx.load(await file.arrayBuffer());const sheet=workbook.worksheets[0];if(!sheet)throw Error('No worksheet found.');if(sheet.rowCount>501||sheet.columnCount>30)throw Error('Use at most 500 rows and 30 columns.');const cell=v=>{if(v==null)return '';if(typeof v==='object'){if(v.formula||v.sharedFormula)throw Error('Formula cells are not supported. Paste calculated values before uploading.');if(v.richText)return v.richText.map(t=>t.text).join('');if(v.text)return v.text;return String(v);}return v;};const headers=Array.from(sheet.getRow(1).values.slice(1),v=>String(cell(v)).trim());if(headers.some(h=>!h)||new Set(headers).size!==headers.length)throw Error('Column names must be non-empty and unique.');rows=[];sheet.eachRow((row,n)=>{if(n===1)return;const values=Array.from(row.values.slice(1),cell);if(values.every(v=>v===''))return;rows.push({...Object.fromEntries(headers.map((h,i)=>[h,values[i]??''])),__sourceRow:n});});}
 else throw Error('Please upload a .csv or .xlsx file. PDF support requires the PDF review flow.');
 return parseRows(rows,file.name,type);
}
export function download(name,content,type='text/csv;charset=utf-8'){const blob=new Blob([content],{type});const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);}
export function template(){download('quotegap-template.csv',Papa.unparse([{Code:'K01',Item:'Base cabinets',Specification:'18mm BWP plywood',Quantity:80,Unit:'sq ft',Rate:1500,Included:'Yes',Notes:''},{Code:'K02',Item:'Installation',Specification:'Labour and fitting',Quantity:1,Unit:'job',Rate:22000,Included:'Yes',Notes:''}]));}
const safe=v=>typeof v==='string'&&/^[=+\-@\t\r]/.test(v)?`'${v}`:v;
export function reportRows(project,results){
 return results.flatMap(r=>[
  ...r.rows.map(row=>({Vendor:r.vendor,Scope_code:row.scope.code,Scope:row.scope.item,Required:row.scope.specification,Scope_quantity:row.scope.quantity,Scope_unit:row.scope.unit,Scope_source:project.scope.name,Scope_row:row.scope.sourceRow,Quoted_code:row.quote?.code??'',Quoted_item:row.quote?.item??'',Quoted_specification:row.quote?.specification??'',Quoted_quantity:row.quote?.quantity??'',Quoted_unit:row.quote?.unit??'',Rate:row.quote?.rate??'',Included:row.quote?(row.quote.included?'Yes':'No'):'',Match:row.quote?(row.confirmed?'Confirmed':'Needs review'):'Missing',Findings:row.issues.map(i=>i.label).join('; ')||'No differences detected',Details:row.issues.map(i=>i.detail).join(' | '),Notes:row.quote?.notes??'',Source:row.quote?r.vendor:'',Quote_row:row.quote?.sourceRow??'',Quoted_subtotal:r.total,Subtotal_incomplete:r.partial?'Yes':'No'})),
  ...r.extras.map(q=>({Vendor:r.vendor,Scope_code:'',Scope:'Outside mapped scope',Required:'',Scope_quantity:'',Scope_unit:'',Scope_source:project.scope.name,Scope_row:'',Quoted_code:q.code,Quoted_item:q.item,Quoted_specification:q.specification,Quoted_quantity:q.quantity,Quoted_unit:q.unit,Rate:q.rate,Included:q.included?'Yes':'No',Match:'Unmapped extra',Findings:'Outside mapped scope',Details:'This row is not assigned to a scope item. Included amounts remain in the quoted subtotal.',Notes:q.notes,Source:r.vendor,Quote_row:q.sourceRow,Quoted_subtotal:r.total,Subtotal_incomplete:r.partial?'Yes':'No'}))
 ]);
}
export function reportCsv(project,results){
 return '\uFEFF'+Papa.unparse(reportRows(project,results).map(row=>Object.fromEntries(Object.entries(row).map(([k,v])=>[k,safe(v)]))));
}
export function exportReport(project,results){download((project.name||'QuoteGap')+'-comparison.csv',reportCsv(project,results));}
