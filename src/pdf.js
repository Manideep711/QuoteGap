// Conservative positional table extraction. Unrecognized layouts stay visible for manual entry.
export const pdfFields=['Code','Item','Specification','Quantity','Unit','Rate','Included','Notes'];
const headers={code:'Code',item:'Item',description:'Item',specification:'Specification',material:'Specification',quantity:'Quantity',qty:'Quantity',unit:'Unit',uom:'Unit',rate:'Rate','unit rate':'Rate',included:'Included',notes:'Notes',remarks:'Notes',amount:'Ignore',total:'Ignore'};
export function extractPage(items,page,type){
 const lines=[];
 for(const item of items.filter(i=>i.str?.trim()).sort((a,b)=>b.transform[5]-a.transform[5]||a.transform[4]-b.transform[4])){
  let line=lines.find(l=>Math.abs(l.y-item.transform[5])<3);
  if(!line){line={y:item.transform[5],cells:[]};lines.push(line);}line.cells.push({text:item.str.trim(),x:item.transform[4]});
 }
 let columns=null;const rows=[];
 const text=lines.map((line,index)=>{
  line.cells.sort((a,b)=>a.x-b.x);
  const candidate=line.cells.map(c=>({...c,field:headers[c.text.toLowerCase()]}));
  if(['Item','Quantity','Unit',...(type==='quote'?['Rate']:[])].every(f=>candidate.some(c=>c.field===f))){columns=candidate.filter(c=>c.field);return line.cells.map(c=>c.text).join(' | ');}
  if(columns){const row=Object.fromEntries(pdfFields.map(f=>[f,'']));
   for(const cell of line.cells){const col=columns.reduce((best,c)=>Math.abs(c.x-cell.x)<Math.abs(best.x-cell.x)?c:best,columns[0]);if(col.field!=='Ignore')row[col.field]+=(row[col.field]?' ':'')+cell.text;}
   if(row.Item&&row.Quantity&&row.Unit&&!/^(subtotal|total|gst|tax|discount)\b/i.test(row.Item)){row.Included||='Yes';row.Notes=`PDF page ${page}, text line ${index+1}${row.Notes?'; '+row.Notes:''}`;rows.push(row);}
  }
  return line.cells.map(c=>c.text).join(' | ');
 }).join('\n');return {rows,text};
}
export async function readPdf(file,type){
 if(file.size>5*1024*1024)throw Error(`${file.name}: maximum file size is 5 MB.`);
 const pdfjs=await import('pdfjs-dist');
 const {default:worker}=await import('pdfjs-dist/build/pdf.worker.min.mjs?url');
 pdfjs.GlobalWorkerOptions.workerSrc=worker;
 let task,doc;
 try{
  task=pdfjs.getDocument({data:new Uint8Array(await file.arrayBuffer()),isEvalSupported:false});doc=await task.promise;
  if(doc.numPages>20)throw Error('Use a PDF with at most 20 pages.');
  const rows=[],pages=[];let emptyPages=0;
  for(let p=1;p<=doc.numPages;p++){const page=await doc.getPage(p);const content=await page.getTextContent();const result=extractPage(content.items,p,type);if(!result.text.trim())emptyPages++;rows.push(...result.rows);pages.push(`PAGE ${p}\n${result.text}`);page.cleanup();}
  if(emptyPages===doc.numPages)throw Error('No selectable text found. Scanned PDFs and photos need OCR, which is not supported. Upload CSV/XLSX or a text-based PDF.');
  if(rows.length>500)throw Error('PDF contains more than 500 candidate items. Split the document.');
  return {name:file.name,type,rows,text:pages.join('\n\n'),warning:emptyPages?`${emptyPages} page(s) had no selectable text. Their contents were not extracted.`:'Check every page: wrapped rows, merged columns, currency formatting and exclusions can be misread. No tax or amount reconciliation is performed.'};
 }catch(error){if(error.name==='PasswordException')throw Error('Password-protected PDFs are not supported. Upload an unlocked copy.');throw error;}finally{await task?.destroy();}
}
