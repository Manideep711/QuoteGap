import {validateProject} from '../server/validate.js';

export function projectFile(project,matches,demo=false){
 return JSON.stringify({format:'quotegap-project',version:1,project,matches,demo},null,2);
}

export function restoreProject(text){
 if(text.length>2*1024*1024)throw Error('Saved projects must be smaller than 2 MB.');
 let data;try{data=JSON.parse(text);}catch{throw Error('This file is not valid project JSON.');}
 if(!data||data.format!=='quotegap-project'||data.version!==1)throw Error('Choose a QuoteGap project file saved with the Save project button.');
 validateProject(data.project);
 if(typeof data.project.name!=='string'||!data.project.name.trim()||data.project.name.length>100)throw Error('The saved project has an invalid name.');
 const matches={};
 for(const quote of data.project.quotes){
  const entries=data.matches?.[quote.id];
  if(!Array.isArray(entries)||entries.length!==data.project.scope.items.length)throw Error('Saved item matches are incomplete.');
  const used=new Set();
  matches[quote.id]=data.project.scope.items.map(scope=>{
   const candidates=entries.filter(m=>m&&m.scopeId===scope.id);
   if(candidates.length!==1)throw Error('Saved scope matches must be unique.');
   const mapping=candidates[0],index=mapping.quoteIndex;
   if(typeof mapping.confirmed!=='boolean'||(index!==null&&(!Number.isInteger(index)||index<0||index>=quote.items.length||used.has(index))))throw Error('Saved quotation matches are invalid or reused.');
   if(index!==null)used.add(index);
   return {scopeId:scope.id,quoteIndex:index,confirmed:mapping.confirmed};
  });
 }
 return {project:data.project,matches,demo:data.demo===true};
}
