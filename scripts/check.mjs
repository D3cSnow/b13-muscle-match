import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';
const scope={window:{}};
for(const file of ['review-config.js','questions.js','exam-questions.js','skeletal-questions.js','cardiovascular-questions.js']){
  vm.runInNewContext(readFileSync(new URL(`../dist/${file}`,import.meta.url),'utf8'),scope);
}
const {MUSCLE_QUESTIONS:core,MUSCLE_EXAM_QUESTIONS:exam,SKELETAL_QUESTIONS:skeletal,CARDIOVASCULAR_QUESTIONS:cardiovascular,REVIEW_SOURCES:documents,REVIEW_SYSTEMS:systems}=scope.window;
assert.ok(core.length>=310,'Preserve the original core bank.');
assert.ok(exam.length>=200,'At least 200 exam-style questions are required.');
assert.ok(skeletal.length>=300,'At least 300 skeletal questions are required.');
assert.ok(cardiovascular.length>=300,'At least 300 cardiovascular questions are required.');
const bank=[...core,...exam,...skeletal,...cardiovascular];
const ids=new Set(),prompts=new Set(),regions=new Set(),focuses=new Set(),publishers=new Set();
const normalize=text=>text.toLowerCase().replace(/[^a-z0-9]/g,'');
const reviewedHosts=['openstax.org','www.elsevier.com','booksite.elsevier.com','pmc.ncbi.nlm.nih.gov','downloads.lww.com','homepage.ntu.edu.tw','anat.lf1.cuni.cz','e-learn.anatomy.uzh.ch'];
for(const q of bank){
  assert.ok(!ids.has(q.id),`Duplicate ID: ${q.id}`);ids.add(q.id);
  const normalized=normalize(q.prompt);
  assert.ok(!prompts.has(normalized),`Duplicate prompt: ${q.id}`);prompts.add(normalized);
  assert.equal(q.options.length,5,q.id);assert.equal(new Set(q.options.map(normalize)).size,5,q.id);
  assert.ok(q.options.every(o=>typeof o==='string'&&o.trim()),q.id);
  assert.ok(Number.isInteger(q.answer)&&q.answer>=0&&q.answer<5,q.id);
  assert.ok((q.muscle||q.topic)&&q.prompt&&q.note,q.id);
  const system=q.system||'muscular';
  assert.ok(Object.hasOwn(systems,system),q.id);
  assert.ok(systems[system].regions.includes(q.region),`Invalid region: ${q.id}`);regions.add(q.region);
  assert.ok(Object.hasOwn(systems[system].focuses,q.focus),`Invalid focus: ${q.id}`);focuses.add(q.focus);
  if(q.focusTags){assert.ok(q.focusTags.includes(q.focus),q.id);assert.equal(new Set(q.focusTags).size,q.focusTags.length,q.id);assert.ok(q.focusTags.every(f=>Object.hasOwn(systems[system].focuses,f)),q.id);}
  assert.ok(['essential','important','standard'].includes(q.priority),q.id);
  if(system==='muscular'){
    assert.ok([5,6].includes(q.source.volume),q.id);
    const doc=documents[`vol${q.source.volume}`];
    assert.ok(q.source.pages.length&&q.source.pages.every(p=>Number.isInteger(p)&&p>=1&&p<=doc.pageCount-doc.printedOffset),q.id);
  }else{
    assert.equal(q.category,'lecture',q.id);
    assert.ok(q.sources?.length,`Missing PDF source: ${q.id}`);
    const allowed=system==='skeletal'?['vol1','vol2','vol3','vol4']:['cv1','cv2','cv3'];
    for(const source of q.sources){
      assert.ok(allowed.includes(source.document),`Wrong lecture: ${q.id}`);
      assert.ok(source.pages.length&&source.pages.every(p=>Number.isInteger(p)&&p>=1&&p<=documents[source.document].pageCount),`Invalid PDF page: ${q.id}`);
      assert.equal(new Set(source.pages).size,source.pages.length,q.id);
    }
    assert.ok(['recall','pairing','comparison','relationship','application','exception','combination'].includes(q.pattern),`Invalid pattern: ${q.id}`);
    assert.ok(q.note.split(/\s+/).length<=60,`Keep feedback concise: ${q.id}`);
    if(q.pattern==='combination')assert.equal((q.prompt.match(/\n\d[.)]\s/g)||[]).length,3,`Three numbered statements required: ${q.id}`);
  }
  assert.ok(q.externalSources?.length,`Missing external reference: ${q.id}`);
  for(const source of q.externalSources){
    const url=new URL(source.url);assert.equal(url.protocol,'https:',q.id);assert.ok(source.label,q.id);publishers.add(url.hostname);
    const brownCourse=url.hostname==='sites.google.com'&&url.pathname.startsWith('/brown.edu/ims-i-anatomy-lab/');
    assert.ok(url.hostname.endsWith('.edu')||reviewedHosts.includes(url.hostname)||brownCourse,`Unexpected source: ${q.id} ${url.hostname}`);
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
for(const [name,questions] of [['skeletal',skeletal],['cardiovascular',cardiovascular]]){
  assert.ok(questions.every(q=>q.system===name),`Wrong system in ${name} bank`);
  assert.equal(new Set(questions.map(q=>q.region)).size,systems[name].regions.length,`Region coverage: ${name}`);
  assert.equal(new Set(questions.map(q=>q.focus)).size,Object.keys(systems[name].focuses).length,`Focus coverage: ${name}`);
}
const referenced=new Set([...skeletal,...cardiovascular].flatMap(q=>q.sources.map(s=>s.document)));
for(const id of ['vol1','vol2','vol3','vol4','cv1','cv2','cv3'])assert.ok(referenced.has(id),`Lecture missing from bank: ${id}`);
console.log(`${core.length} muscular core + ${exam.length} muscular exam-style + ${skeletal.length} skeletal + ${cardiovascular.length} cardiovascular = ${bank.length} questions. Five choices, unique IDs/prompts, metadata, PDF page ranges, external sources, and historical style references checked.`);
