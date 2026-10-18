import { task, type TaskContext } from '@renderinc/sdk/workflows';
import { suggest, evaluate } from '../src/engine.js';
import { validateProject } from './validate.js';
export const compareVendor = task({ name:'compare-vendor',timeoutSeconds:120,retry:{maxRetries:1,waitDurationMs:1000}}, async (_ctx:TaskContext,scope:any,quote:any)=>{
 validateProject({scope,quotes:[quote]});
 const mappings=suggest(scope,quote);
 const report=evaluate(scope,quote,mappings);
 return {vendorId:quote.id,mappings,findings:report.issues.length,subtotal:report.total};
});
export const compareProject = task({name:'compare-project',timeoutSeconds:300,retry:{maxRetries:0}},async (ctx:TaskContext,input:any)=>{
 validateProject(input);
 const vendors=await Promise.all(input.quotes.map((quote:any)=>ctx.run(compareVendor,input.scope,quote)));
 return {matches:Object.fromEntries(vendors.map((v:any)=>[v.vendorId,v.mappings])),summary:vendors.map(({vendorId,findings,subtotal}:any)=>({vendorId,findings,subtotal}))};
});
