(() => {
  'use strict';
  const bank = window.MUSCLE_QUESTIONS;
  const $ = id => document.getElementById(id);
  if (!Array.isArray(bank) || !bank.length) { $('quiz').hidden = true; $('load-error').hidden = false; return; }
  const focusLabels = {name:'Muscle name',action:'Function',origin:'Origin',insertion:'Insertion'};
  let session = [], position = 0, choices = [], responses = [], answered = false, mode = 'practice';
  const shuffle = list => { const a = [...list]; for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];} return a; };
  const filteredBank = () => bank.filter(q => ['region','focus','priority'].every(key => $(key).value === 'all' || q[key] === $(key).value));
  function start(list = filteredBank(), review = false) {
    mode = review ? 'review' : 'practice';
    session = shuffle(list).slice(0,review ? list.length : 20); position = 0; responses = []; answered = false;
    $('summary').hidden=true; $('empty').hidden=!!session.length; $('quiz').hidden=!session.length;
    if (session.length) renderQuestion();
  }
  function renderQuestion() {
    const q=session[position]; if(!q)return;
    answered=false; choices=shuffle(q.options.map((text,index)=>({text,index})));
    $('question').textContent=q.prompt;
    $('question-focus').textContent=focusLabels[q.focus]; $('question-region').textContent=q.region;
    $('progress-text').textContent=`${mode==='review'?'Review':'Question'} ${position+1} / ${session.length}`;
    $('score-text').textContent=`${responses.filter(r=>r.correct).length} correct`;
    document.querySelector('.progress').setAttribute('aria-valuemax',session.length);
    updateProgress(position);
    $('feedback').hidden=true; $('feedback').replaceChildren(); $('feedback').className='feedback'; $('next').hidden=true;
    $('options').replaceChildren();
    choices.forEach((choice,i)=>{
      const button=document.createElement('button'); button.type='button'; button.className='option';
      const letter=document.createElement('span'); letter.className='option-letter'; letter.textContent=String.fromCharCode(65+i);letter.setAttribute('aria-hidden','true');
      const text=document.createElement('span');text.className='option-text';text.textContent=choice.text;
      button.append(letter,text); button.addEventListener('click',()=>answer(i)); $('options').append(button);
    });
    $('references').replaceChildren();
    const ref=document.createElement('button');ref.type='button';ref.className='reference';
    ref.textContent=`Vol. ${q.source.volume} · ${q.source.pages.length>1?'pp.':'p.'} ${q.source.pages.join(', ')}`;
    ref.setAttribute('aria-label',`Open PDF reference: volume ${q.source.volume}, printed pages ${q.source.pages.join(', ')}`);
    ref.addEventListener('click',()=>openSource(q)); $('references').append(ref);
    (q.externalSources||[]).forEach(source=>{const link=document.createElement('a');link.className='reference';link.href=source.url;link.target='_blank';link.rel='noopener noreferrer';link.textContent=source.label.split(' · ')[0];link.title=source.label;link.setAttribute('aria-label',`Open external reference: ${source.label}`);$('references').append(link);});
  }
  function updateProgress(value){ $('progress-fill').style.width=`${value/session.length*100}%`;document.querySelector('.progress').setAttribute('aria-valuenow',value); }
  function answer(displayIndex){
    if($('quiz').hidden || answered || !Number.isInteger(displayIndex) || displayIndex<0 || displayIndex>=5)return false;
    answered=true; const q=session[position], correct=choices[displayIndex].index===q.answer;
    responses.push({id:q.id,correct});
    [...$('options').children].forEach((b,i)=>{
      b.disabled=true;
      const isCorrect=choices[i].index===q.answer;
      b.classList.add(isCorrect?'correct':i===displayIndex?'incorrect':'muted');
      if(isCorrect || i===displayIndex){const s=document.createElement('span');s.className='option-state';s.textContent=isCorrect?'Correct':'Your choice';b.append(s);}
    });
    const label=document.createElement('strong');label.textContent=correct?'Correct.':'Not quite.';
    const detail=document.createElement('span');detail.textContent=q.note;
    $('feedback').append(label,detail);$('feedback').hidden=false;$('feedback').classList.toggle('wrong',!correct);
    if(q.correction){const c=document.createElement('div');c.className='correction';c.textContent='Source correction: '+q.correction.text+' ';const a=document.createElement('a');a.href=q.correction.url;a.target='_blank';a.rel='noopener noreferrer';a.textContent='Anatomy reference';c.append(a);$('feedback').append(c);}
    $('score-text').textContent=`${responses.filter(r=>r.correct).length} correct`;updateProgress(position+1);
    $('next').textContent=position===session.length-1?'Finish session':'Next question';$('next').hidden=false;
    return {correct,answer:q.options[q.answer],reference:q.source};
  }
  function next(){ if($('quiz').hidden || !answered)return false; if(position+1<session.length){position++;renderQuestion();$('options').firstElementChild?.focus();}else finish();return true; }
  function finish(){
    $('quiz').hidden=true;$('summary').hidden=false;$('summary').replaceChildren();
    const correct=responses.filter(r=>r.correct).length, missed=session.filter(q=>responses.some(r=>r.id===q.id&&!r.correct));
    const h=document.createElement('h1');h.id='summary-title';h.textContent=mode==='review'?'Review complete':'Session complete';
    const score=document.createElement('p');score.className='summary-score';score.textContent=correct+' ';const den=document.createElement('small');den.textContent='/ '+session.length;score.append(den);
    const caption=document.createElement('p');caption.className='summary-caption';caption.textContent='Correct answers';
    const actions=document.createElement('div');actions.className='summary-actions';
    if(missed.length){const review=document.createElement('button');review.className='primary';review.textContent=`Retry ${missed.length} missed`;review.addEventListener('click',()=>start(missed,true));actions.append(review);}
    const restart=document.createElement('button');restart.className=missed.length?'secondary':'primary';restart.textContent='New session';restart.addEventListener('click',()=>start());actions.append(restart);
    $('summary').append(h,score,caption,actions);h.setAttribute('tabindex','-1');h.focus();
  }
  function openSource(q){
    $('source-title').textContent=`B13 Gross Anatomy · Vol. ${q.source.volume}`;
    $('source-subtitle').textContent=`B13大體解剖學vol.${q.source.volume}.pdf`;
    $('source-pages').replaceChildren();
    q.source.pages.forEach(page=>{
      const pdfPage=page+(q.source.volume===5?5:4);
      const fig=document.createElement('figure');fig.className='source-page';
      const cap=document.createElement('figcaption');const label=document.createElement('span');label.textContent=`Printed p. ${page} · PDF page ${pdfPage}`;
      cap.append(label);fig.append(cap);$('source-pages').append(fig);
    });
    $('source-correction').hidden=!q.correction;
    $('source-correction').textContent=q.correction?'Source correction: '+q.correction.text:'';
    $('source-dialog').showModal();
  }
  ['region','focus','priority'].forEach(id=>$(id).addEventListener('change',()=>start()));
  $('next').addEventListener('click',next);$('close-source').addEventListener('click',()=>$('source-dialog').close());
  $('source-dialog').addEventListener('click',e=>{if(e.target===$('source-dialog')){const r=$('source-dialog').getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)$('source-dialog').close();}});
  document.addEventListener('keydown',e=>{if($('source-dialog').open||['SELECT','INPUT','TEXTAREA','BUTTON','A'].includes(e.target.tagName))return;if(/^[1-5]$/.test(e.key)){e.preventDefault();answer(Number(e.key)-1);}else if(e.key==='Enter'&&answered&&!$('quiz').hidden){e.preventDefault();next();}});
  $('bank-count').textContent=`${bank.length} questions`;
  start();
  const context=document.modelContext;
  if(context?.registerTool){
    const lifecycle=new AbortController();
    const readState=()=>{
      const score=responses.filter(r=>r.correct).length;
      if($('quiz').hidden)return {status:session.length?'complete':'empty',correct:score,total:session.length};
      const q=session[position];
      return {status:answered?'answered':'awaiting_answer',questionId:q.id,position:position+1,total:session.length,correct:score,focus:focusLabels[q.focus],region:q.region,prompt:q.prompt,options:choices.map((c,i)=>({letter:String.fromCharCode(65+i),text:c.text})),reference:q.source,...(answered?{answer:q.options[q.answer],feedback:q.note}:{})};
    };
    const validate=(input,keys)=>{
      if(!input || typeof input!=='object' || Array.isArray(input) || Object.keys(input).some(k=>!keys.includes(k)))throw new Error('Invalid input.');
      if(keys.includes('questionId') && (input.questionId!==session[position]?.id || $('quiz').hidden))throw new Error('This question is no longer active. Read the current question first.');
    };
    const toolDefinitions=[
      {name:'read_current_question',title:'Read muscle question',description:'Read the visible question, five answer choices, progress, and PDF reference. Correct answers appear only after submission.',inputSchema:{type:'object',properties:{},additionalProperties:false},annotations:{readOnlyHint:true,untrustedContentHint:false},execute(input){validate(input,[]);return readState();}},
      {name:'submit_muscle_answer',title:'Submit muscle answer',description:'Submit one letter A–E for the current question. Locks the answer and updates the visible feedback and score.',inputSchema:{type:'object',properties:{questionId:{type:'string'},letter:{type:'string',enum:['A','B','C','D','E']}},required:['questionId','letter'],additionalProperties:false},annotations:{readOnlyHint:false,untrustedContentHint:false},execute(input){validate(input,['questionId','letter']);if(typeof input.letter!=='string'||! /^[A-E]$/.test(input.letter))throw new Error('Choose a letter from A to E.');if(!answer(input.letter.charCodeAt(0)-65))throw new Error('This question has already been answered.');return readState();}},
      {name:'advance_muscle_question',title:'Next muscle question',description:'After an answer, advance to the next question or finish the current session and show its score.',inputSchema:{type:'object',properties:{questionId:{type:'string'}},required:['questionId'],additionalProperties:false},annotations:{readOnlyHint:false,untrustedContentHint:false},execute(input){validate(input,['questionId']);if(!next())throw new Error('Answer the current question before advancing.');return readState();}}
    ];
    for(const tool of toolDefinitions){try{Promise.resolve(context.registerTool(tool,{signal:lifecycle.signal})).catch(()=>{});}catch{}}
    window.addEventListener('pagehide',()=>lifecycle.abort(),{once:true});
  }
})();
