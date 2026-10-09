import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';
const scope={window:{}};
vm.runInNewContext(readFileSync(new URL('../dist/questions.js',import.meta.url),'utf8'),scope);
const bank=scope.window.MUSCLE_QUESTIONS;
assert.ok(bank.length>=300,'At least 300 questions are required.');
const ids=new Set(),prompts=new Set(),regions=new Set(),focuses=new Set(),publishers=new Set();
for(const q of bank){
  assert.ok(!ids.has(q.id),`Duplicate ID: ${q.id}`);ids.add(q.id);
  assert.ok(!prompts.has(q.prompt),`Duplicate prompt: ${q.id}`);prompts.add(q.prompt);
  assert.equal(q.options.length,5,q.id);assert.equal(new Set(q.options).size,5,q.id);
  assert.ok(Number.isInteger(q.answer)&&q.answer>=0&&q.answer<5,q.id);
  assert.ok(q.muscle&&q.prompt&&q.note,q.id);
  assert.ok(['Head & neck','Trunk','Shoulder & arm','Forearm & hand','Hip & thigh','Leg & foot'].includes(q.region),q.id);regions.add(q.region);
  assert.ok(['name','action','origin','insertion'].includes(q.focus),q.id);focuses.add(q.focus);
  assert.ok(['essential','important','standard'].includes(q.priority),q.id);
  assert.ok([5,6].includes(q.source.volume),q.id);
  assert.ok(q.source.pages.length&&q.source.pages.every(p=>Number.isInteger(p)&&p>=1&&p<=(q.source.volume===5?76:73)),q.id);
  assert.ok(q.externalSources?.length,`Missing external reference: ${q.id}`);
  for(const source of q.externalSources){
    const url=new URL(source.url);assert.equal(url.protocol,'https:',q.id);assert.ok(source.label,q.id);publishers.add(url.hostname);
    assert.ok(url.hostname.endsWith('.edu')||['www.elsevier.com','pmc.ncbi.nlm.nih.gov'].includes(url.hostname),`Unexpected source: ${q.id}`);
  }
  if(q.correction){assert.ok(q.correction.text&&new URL(q.correction.url).protocol==='https:',q.id);}
}
assert.equal(regions.size,6);assert.equal(focuses.size,4);
console.log(`${bank.length} valid five-choice questions; all have PDF pages and external references; ${publishers.size} source domains.`);
