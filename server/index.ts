import express from 'express';
import {rateLimit} from 'express-rate-limit';
import {Render} from '@renderinc/sdk';
import {timingSafeEqual} from 'node:crypto';
import {resolve} from 'node:path';
import {validateProject} from './validate.js';
import {suggest} from '../src/engine.js';
const app=express();
app.set('trust proxy',1);
app.use(express.json({limit:'2mb'}));
app.get('/api/health',(_req,res)=>res.json({ok:true,mode:process.env.RENDER_API_KEY&&process.env.RENDER_TASK_SLUG?'render':'local'}));
app.use('/api/compare',rateLimit({windowMs:60000,limit:5,standardHeaders:'draft-8',legacyHeaders:false}));
app.post('/api/compare',async(req,res)=>{
 if(process.env.API_ACCESS_TOKEN){const supplied=Buffer.from(req.headers.authorization??'');const expected=Buffer.from(`Bearer ${process.env.API_ACCESS_TOKEN}`);if(supplied.length!==expected.length||!timingSafeEqual(supplied,expected)){res.status(401).json({error:'A valid service access token is required.'});return;}}
 let input;try{input=validateProject(req.body);}catch(error){res.status(400).json({error:(error as Error).message});return;}
 if(!process.env.RENDER_API_KEY||!process.env.RENDER_TASK_SLUG){res.json({mode:'local',matches:Object.fromEntries(input.quotes.map((q:any)=>[q.id,suggest(input.scope,q)]))});return;}
 // Paid workflow execution is opt-in and requires a private pilot token. Never bundle this token into the frontend.
 if(!process.env.API_ACCESS_TOKEN){res.status(503).json({error:'Configure API_ACCESS_TOKEN before enabling paid workflow execution.'});return;}
 const render=new Render();let runId:string|undefined;const controller=new AbortController();const timer=setTimeout(()=>controller.abort(),240000);
 try{const run=await render.workflows.startTask(process.env.RENDER_TASK_SLUG,[input],controller.signal);runId=run.taskRunId;const result=await run.get();if(result.status!=='completed'||!result.results?.length)throw Error('Comparison workflow failed. Retry the request.');res.json({...result.results[0],mode:'render',runId});}
 catch(error){if(runId)await render.workflows.cancelTaskRun(runId).catch(()=>{});console.error('Workflow processing failed:',(error as Error).name);res.status(502).json({error:'The workflow could not complete. Please try again.'});}
 finally{clearTimeout(timer);}
});
app.use(express.static(resolve('dist')));
app.use((error:any,_req:any,res:any,_next:any)=>res.status(error.status??500).json({error:error.type==='entity.too.large'?'Request exceeds the 2 MB limit.':'Unable to process the request.'}));
const port=Number(process.env.PORT??3001);
if(process.env.NODE_ENV==='production'&&process.env.RENDER_API_KEY&&process.env.RENDER_TASK_SLUG&&!process.env.API_ACCESS_TOKEN)throw Error('API_ACCESS_TOKEN is required for a production Render pilot.');
app.listen(port,'0.0.0.0',()=>console.log(`QuoteGap API listening on ${port}`));
