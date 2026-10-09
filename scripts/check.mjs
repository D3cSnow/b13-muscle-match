import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';
const scope={window:{}};
vm.runInNewContext(readFileSync(new URL('../dist/questions.js',import.meta.url),'utf8'),scope);
vm.runInNewContext(readFileSync(new URL('../dist/exam-questions.js',import.meta.url),'utf8'),scope);
const core=scope.window.MUSCLE_QUESTIONS,exam=scope.window.MUSCLE_EXAM_QUESTIONS;
assert.ok(core.length>=310,'Preserve the original core bank.');
assert.ok(exam.length>=200,'At least 200 exam-style questions are required.');
const bank=[...core,...exam];
const ids=new Set(),prompts=new Set(),regions=new Set(),focuses=new Set(),publishers=new Set();
for(const q of bank){
  assert.ok(!ids.has(q.id),`Duplicate ID: ${q.id}`);ids.add(q.id);
  const normalized=q.prompt.toLowerCase().replace(/[^a-z0-9]/g,'');
  assert.ok(!prompts.has(normalized),`Duplicate prompt: ${q.id}`);prompts.add(normalized);
  assert.equal(q.options.length,5,q.id);assert.equal(new Set(q.options).size,5,q.id);
  assert.ok(Number.isInteger(q.answer)&&q.answer>=0&&q.answer<5,q.id);
  assert.ok(q.muscle&&q.prompt&&q.note,q.id);
  assert.ok(['Head & neck','Trunk','Shoulder & arm','Forearm & hand','Hip & thigh','Leg & foot'].includes(q.region),q.id);regions.add(q.region);
  assert.ok(['name','action','origin','insertion','innervation','integration'].includes(q.focus),q.id);focuses.add(q.focus);
  if(q.focusTags){assert.ok(q.focusTags.includes(q.focus),q.id);assert.equal(new Set(q.focusTags).size,q.focusTags.length,q.id);assert.ok(q.focusTags.every(f=>['name','action','origin','insertion','innervation','integration'].includes(f)),q.id);}
  assert.ok(['essential','important','standard'].includes(q.priority),q.id);
  assert.ok([5,6].includes(q.source.volume),q.id);
  assert.ok(q.source.pages.length&&q.source.pages.every(p=>Number.isInteger(p)&&p>=1&&p<=(q.source.volume===5?76:73)),q.id);
  assert.ok(q.externalSources?.length,`Missing external reference: ${q.id}`);
  for(const source of q.externalSources){
    const url=new URL(source.url);assert.equal(url.protocol,'https:',q.id);assert.ok(source.label,q.id);publishers.add(url.hostname);
    assert.ok(url.hostname.endsWith('.edu')||['www.elsevier.com','pmc.ncbi.nlm.nih.gov','downloads.lww.com'].includes(url.hostname),`Unexpected source: ${q.id}`);
  }
  if(q.correction){assert.ok(q.correction.text&&new URL(q.correction.url).protocol==='https:',q.id);}
}
for(const q of exam){
  assert.equal(q.category,'exam',q.id);
  assert.ok(['exception','pairing','comparison','application','combination','relationship'].includes(q.pattern),q.id);
  assert.equal(q.styleSource?.book,'exam',q.id);
  assert.ok(q.styleSource.pdfPages.length&&q.styleSource.pdfPages.every(p=>Number.isInteger(p)&&p>=5&&p<=155),q.id);
  assert.ok(q.styleSource.answerPdfPages.length&&q.styleSource.answerPdfPages.every(p=>Number.isInteger(p)&&p>=6&&p<=236),q.id);
  if(q.pattern==='combination')assert.ok((q.prompt.match(/\n\d[.)]\s/g)||[]).length>=2,`Numbered statements required: ${q.id}`);
}
assert.equal(regions.size,6);assert.equal(focuses.size,6);
console.log(`${core.length} core + ${exam.length} exam-style questions; five choices each; PDF pages, external references, and style evidence validated.`);
