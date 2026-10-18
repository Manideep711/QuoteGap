import test from 'node:test';
import assert from 'node:assert/strict';
import {extractPage} from '../src/pdf.js';
import {parseRows} from '../src/engine.js';
const cell=(str,x,y)=>({str,transform:[1,0,0,1,x,y]});
test('extracts positional PDF table and preserves page evidence, ignoring line amount',()=>{
 const items=[['Code',0],['Item',50],['Quantity',250],['Unit',320],['Rate',380],['Amount',450]].map(([s,x])=>cell(s,x,700));
 items.push(...[['K01',0],['Cabinets',50],['80',250],['sq ft',320],['1,450',380],['116000',450]].map(([s,x])=>cell(s,x,680)));
 const result=extractPage(items,2,'quote');assert.equal(result.rows.length,1);assert.equal(result.rows[0].Rate,'1,450');assert.match(result.rows[0].Notes,/PDF page 2/);assert.equal(parseRows(result.rows,'q.pdf','quote').items[0].rate,1450);
});
test('does not invent rows from unrecognized PDF prose',()=>{const result=extractPage([cell('Installation is extra. Total 15000',10,600)],1,'quote');assert.deepEqual(result.rows,[]);assert.match(result.text,/Installation is extra/);});
test('scope PDF needs no rate and repeated headers do not become rows',()=>{const header=[cell('Item',0,700),cell('Qty',150,700),cell('Unit',200,700)];const result=extractPage([...header,cell('Handles',0,680),cell('20',150,680),cell('nos',200,680),...header.map(c=>({...c,transform:[1,0,0,1,c.transform[4],650]}))],1,'scope');assert.equal(result.rows.length,1);assert.equal(parseRows(result.rows,'scope.pdf','scope').items[0].quantity,20);});
