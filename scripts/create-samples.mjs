import {mkdir,writeFile} from 'node:fs/promises';
import Papa from 'papaparse';
import ExcelJS from 'exceljs';
import {sampleProject} from '../src/sample.js';
const project=sampleProject();await mkdir('public/examples',{recursive:true});
for(const [index,doc] of [project.scope,...project.quotes].entries()){
 const rows=doc.items.map(i=>({Code:i.code,Item:i.item,Specification:i.specification,Quantity:i.quantity,Unit:i.unit,...(doc.type==='quote'?{Rate:i.rate,Included:i.included?'Yes':'No',Notes:i.notes}:{})}));
 const name=index===0?'approved-scope':`vendor-${index}`;
 await writeFile(`public/examples/${name}.csv`,Papa.unparse(rows));
 const workbook=new ExcelJS.Workbook();const sheet=workbook.addWorksheet('Kitchen');sheet.columns=Object.keys(rows[0]).map(key=>({header:key,key,width:24}));rows.forEach(row=>sheet.addRow(row));await workbook.xlsx.writeFile(`public/examples/${name}.xlsx`);
}
await writeFile('public/examples/invalid-quotation.csv','Item,Quantity,Unit,Rate\nCabinets,not-a-number,sq ft,1000');
console.log('Created CSV/XLSX example project and an invalid-file fixture.');
