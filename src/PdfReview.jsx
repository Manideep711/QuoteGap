import React,{useState} from 'react';
import {pdfFields} from './pdf.js';
import {parseRows} from './engine.js';
export default function PdfReview({documents,onApprove,onBack,busy}){
 const [docs,setDocs]=useState(documents),[active,setActive]=useState(0),[error,setError]=useState('');const doc=docs[active];
 function change(rows){setDocs(old=>old.map((d,i)=>i===active?{...d,rows,checked:false}:d));setError('');}
 function approve(){try{const parsed=docs.map(d=>{if(!d.checked)throw Error(`Confirm you checked ${d.name}.`);return parseRows(d.rows,d.name,d.type);});onApprove(parsed);}catch(e){setError(e.message);}}
 return <><div className="eyebrow">CHECK BEFORE COMPARING</div><h2>Review PDF extraction.</h2><p>Open your original PDF beside this screen. Verify all items, specifications, quantities, rates and exclusions. Extracted rows are suggestions, not verified facts.</p>
 <div className="pdf-tabs">{docs.map((d,i)=><button type="button" className={'button '+(i===active?'primary':'secondary')} key={i} onClick={()=>setActive(i)}>{d.checked?'✓ ':''}{d.name}</button>)}</div>
 <p className="format-note">{doc.warning}</p><details open={!doc.rows.length}><summary>Extracted source text · {doc.name}</summary><pre className="pdf-source">{doc.text}</pre></details>
 {!doc.rows.length&&<p role="status">No supported table header found. Add rows below using the source text, or go back and use CSV/XLSX.</p>}
 <p>Values are editable. Rate means price per unit, not line total. Add any rows the extraction missed; remove headings and totals.</p>
 <div className="pdf-table"><table><thead><tr>{pdfFields.filter(f=>doc.type==='quote'||f!=='Rate').map(f=><th key={f}>{f}</th>)}<th>Remove</th></tr></thead><tbody>{doc.rows.map((row,i)=><tr key={i}>{pdfFields.filter(f=>doc.type==='quote'||f!=='Rate').map(f=><td key={f}>{f==='Included'?<select aria-label={`Row ${i+1} ${f}`} value={row[f]||'Yes'} onChange={e=>change(doc.rows.map((r,j)=>j===i?{...r,[f]:e.target.value}:r))}><option>Yes</option><option>No</option></select>:<input aria-label={`Row ${i+1} ${f}`} value={row[f]??''} onChange={e=>change(doc.rows.map((r,j)=>j===i?{...r,[f]:e.target.value}:r))}/>}</td>)}<td><button type="button" aria-label={`Remove row ${i+1}`} onClick={()=>change(doc.rows.filter((_,j)=>j!==i))}>Remove</button></td></tr>)}</tbody></table></div>
 <button type="button" className="button secondary" disabled={doc.rows.length>=500} onClick={()=>change([...doc.rows,Object.fromEntries(pdfFields.map(f=>[f,f==='Included'?'Yes':'']))])}>Add item</button>
 <label className="processing-choice"><input type="checkbox" checked={!!doc.checked} onChange={e=>setDocs(old=>old.map((d,i)=>i===active?{...d,checked:e.target.checked}:d))}/>I checked every page of this PDF and corrected the extracted rows.</label>
 {error&&<div role="alert" className="error-message">{error}</div>}<div className="pdf-tabs"><button className="button secondary" disabled={busy} onClick={onBack}>Back to files</button><button className="button primary" disabled={busy||docs.some(d=>!d.checked)} onClick={approve}>{busy?'Comparing…':'Use reviewed rows & compare'}</button></div><p className="privacy-note">Text-based PDFs only · 20 pages · 5 MB · 500 items per file. Source row numbers in reports refer to the reviewed table; extraction notes retain original page and text-line references where available.</p></>;
}
