import {norm} from '../src/engine.js';
export function validateProject(body){
 if(!body||!Array.isArray(body.quotes)||body.quotes.length<1||body.quotes.length>3)throw Error('Provide one scope and 1–3 quotations.');
 const documents=[body.scope,...body.quotes];const docIds=new Set();
 for(const [index,doc] of documents.entries()){
  if(!doc||typeof doc.id!=='string'||!doc.id||docIds.has(doc.id)||typeof doc.name!=='string'||!doc.name||doc.name.length>200)throw Error('Each document needs a unique ID and name (up to 200 characters).');docIds.add(doc.id);
  if(!Array.isArray(doc.items)||!doc.items.length||doc.items.length>500)throw Error('Each document must contain 1–500 items.');
  const ids=new Set(),codes=new Set();for(const item of doc.items){
   if(!item||typeof item.id!=='string'||!item.id||ids.has(item.id))throw Error('Item IDs must be unique within each document.');ids.add(item.id);
   for(const field of ['code','item','specification','unit','notes'])if(typeof item[field]!=='string'||item[field].length>2000)throw Error('Invalid item text field.');
   if(!item.item.trim()||!item.unit.trim()||!Number.isFinite(item.quantity)||item.quantity<0||item.quantity>1e9||!Number.isInteger(item.sourceRow)||item.sourceRow<2)throw Error('Invalid item quantity, description, unit or source row.');
   if(item.code){if(codes.has(norm(item.code)))throw Error('Duplicate item code.');codes.add(norm(item.code));}
   if(index>0&&(typeof item.included!=='boolean'||(item.rate!==null&&(!Number.isFinite(item.rate)||item.rate<0||item.rate>1e9))))throw Error('Invalid quotation rate or inclusion.');
  }
 }return body;
}
