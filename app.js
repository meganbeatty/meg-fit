'use strict';
const PLAN = {
 PULL: { subtitle: 'Back + Rear Delts + Biceps · 55–65 min', exercises: [
 ['lat_pulldown','Lat pulldown','3 × 8–12'],['chest_supported_db_row','Chest-supported dumbbell row','3 × 8–12','db'],['single_arm_cable_lat_pulldown','Single-arm cable lat pulldown','2 × 10–15','optional'],['reverse_pec_deck','Reverse pec deck','3 × 12–20'],['cable_lateral_raise','Cable lateral raise','3 × 12–20'],['cable_bicep_curl','Cable biceps curl','2 × 10–15'],['hanging_knee_raise','Hanging knee/leg raise','3 × 8–15','bodyweight']] },
 PUSH: { subtitle: 'Shoulders + Chest + Triceps · 45–55 min', exercises: [
 ['db_shoulder_press','Seated dumbbell shoulder press','3 × 6–10','db'],['incline_db_chest_press','Incline dumbbell chest press','3 × 8–12','db'],['cable_lateral_raise','Cable lateral raise','4 × 12–20'],['cable_tricep_pushdown','Rope triceps pushdown','2 × 10–15'],['cable_crunch','Cable crunch','3 × 10–15']] },
 LEGS: { subtitle: 'Glutes + Hamstrings + Quad Maintenance · 50–65 min', exercises: [
 ['hip_thrust','Barbell hip thrust','3 × 6–10'],['rdl_dbs','Romanian deadlift (DBs)','3 × 8–10','db'],['bulgarian_split_squat','Bulgarian split squat (DBs)','2 × 8–10 per leg','db'],['seated_hamstring_curl','Seated hamstring curl','2 × 10–15'],['leg_press','Leg press','2 × 10–15'],['hip_abduction','Hip abduction machine','2 × 15–25']] }
};
const CURRENT = Object.fromEntries(Object.values(PLAN).flatMap(p=>p.exercises).map(e=>[e[0],e]));
const STATE_KEY='megfit_v5';
const emptyState=()=>({version:5,drafts:{},sessions:[],pilates:Array(25).fill(false),pilatesEvents:[],pilatesActive:{}});
function lsGet(k,d=null){try{const v=localStorage.getItem(k);return v===null?d:JSON.parse(v);}catch{return d;}}
function lsSet(k,v){try{localStorage.setItem(k,JSON.stringify(v));}catch{showToast('Could not save. Storage may be full. Export a backup before closing.');throw new Error('Storage write failed');}}
function state(){const s=lsGet(STATE_KEY,emptyState());return {...s,pilatesEvents:s.pilatesEvents||[],pilatesActive:s.pilatesActive||{}};}
function escHtml(s){return String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
function showToast(s){document.querySelector('.toast')?.remove();const el=document.createElement('div');el.className='toast';el.role='status';el.textContent=s;document.body.append(el);setTimeout(()=>el.remove(),4000);}
function latest(id){const rows=state().sessions.flatMap(s=>s.exercises.filter(e=>e.id===id).map(e=>({...e,date:s.completedAt}))).sort((a,b)=>a.date.localeCompare(b.date));return rows.at(-1)||lsGet('weight_'+id,{weight:'',updatedAt:''});}
function draft(key){const s=state();return s.drafts[key]||{id:crypto.randomUUID(),startedAt:new Date().toISOString(),checks:[],weights:Object.fromEntries(PLAN[key].exercises.map(e=>[e[0],latest(e[0]).weight??'']))};}
function ensureDraft(key){const s=state();if(!s.drafts[key]){s.drafts[key]=draft(key);lsSet(STATE_KEY,s);}return s.drafts[key];}
function saveWeight(key,id,value){const s=state();s.drafts[key] ||= draft(key);s.drafts[key].weights[id]=value;lsSet(STATE_KEY,s);}
function toggleExercise(key,id){const s=state();s.drafts[key] ||= draft(key);const d=s.drafts[key];d.checks=d.checks.includes(id)?d.checks.filter(x=>x!==id):[...d.checks,id];lsSet(STATE_KEY,s);const b=document.querySelector(`[data-check="${key}:${id}"]`);b?.setAttribute('aria-pressed',d.checks.includes(id));b?.classList.toggle('checked',d.checks.includes(id));if(b)b.textContent=d.checks.includes(id)?'✓':'';document.getElementById('count-'+key).textContent=`${d.checks.length}/${PLAN[key].exercises.length}`;}
function finishSession(key){const s=state(),d=s.drafts[key];if(!d||PLAN[key].exercises.some(e=>e[3]!=='optional'&&!d.checks.includes(e[0])))return showToast('Check off each required exercise first. The optional exercise may be skipped.');
 const exercises=PLAN[key].exercises.filter(e=>d.checks.includes(e[0])).map(e=>({id:e[0],weight:d.weights[e[0]]===''?null:Number(d.weights[e[0]]),unit:e[3]==='db'?'lb per dumbbell':'lb'}));
 if(exercises.some(e=>e.weight!==null&&(!Number.isFinite(e.weight)||e.weight<0)))return showToast('Enter valid, nonnegative weights.');
 if(!s.sessions.some(x=>x.id===d.id))s.sessions.push({id:d.id,workout:key,startedAt:d.startedAt,completedAt:new Date().toISOString(),localDate:todayStr(),exercises});delete s.drafts[key];lsSet(STATE_KEY,s);renderToday();showToast(key+' saved. Your next session is ready.');}
let activeTab='today',proteinInput='',chatBusy=false;
function header(title,sub){return `<div class="page-header"><h1>${title}</h1><div class="sub">${sub}</div></div>`;}
function switchTab(tab){document.querySelectorAll('.tab-panel,.nav-btn').forEach(e=>e.classList.remove('active'));document.getElementById('tab-'+tab).classList.add('active');document.getElementById('nav-'+tab).classList.add('active');activeTab=tab;({today:renderToday,log:renderLog,pilates:renderPilates,activity:renderActivity,ai:renderChat})[tab]();}
function renderToday(){const opens=[...document.querySelectorAll('.workout[open]')].map(e=>e.dataset.key);document.getElementById('today-content').innerHTML=header("Meg's Fit",'Your pace. Your next session.')+Object.entries(PLAN).map(([k,p])=>{const d=draft(k);return `<div class="section"><details class="card workout" data-key="${k}" ${opens.includes(k)?'open':''}><summary><strong>${k}</strong><span id="count-${k}" class="count">${d.checks.length}/${p.exercises.length}</span><small>${p.subtitle}</small></summary><div class="card-body"><p class="muted">Warm up with an easy walk or row and dynamic movement.</p>${p.exercises.map(e=>`<div class="exercise-item"><button class="ex-check ${d.checks.includes(e[0])?'checked':''}" data-check="${k}:${e[0]}" aria-label="Complete ${escHtml(e[1])}" aria-pressed="${d.checks.includes(e[0])}" onclick="toggleExercise('${k}','${e[0]}')">${d.checks.includes(e[0])?'✓':''}</button><div class="ex-info"><div class="ex-name">${e[1]}</div><div class="ex-sets">${e[2]}${e[3]==='optional'?' · Optional':''}</div>${k==='PUSH'&&e[3]==='db'?'<div class="ex-note">Neutral grip · only if comfortable</div>':''}</div><label class="weight-label"><span>${e[3]==='bodyweight'?'Added lb':e[3]==='db'?'lb / DB':'lb'}</span><input type="number" min="0" step="any" inputmode="decimal" aria-label="${escHtml(e[1])} weight in ${e[3]==='db'?'pounds per dumbbell':'pounds'}" placeholder="${e[3]==='bodyweight'?'Bodyweight':'—'}" value="${escHtml(d.weights[e[0]]??'')}" oninput="saveWeight('${k}','${e[0]}',this.value)"></label></div>`).join('')}<p class="muted guidance">Finish most sets with 1–3 reps in reserve. Reach the top of the rep range with good form across sets, then add a little weight. Rest 2–3 min on compounds; 60–90 sec on accessories.</p><button class="btn-primary" onclick="finishSession('${k}')">Finish ${k} session</button></div></details></div>`}).join('')+renderProteinSection(todayStr())+renderNotesSection(todayStr());attachProteinHandlers(todayStr());attachNotesHandler(todayStr());document.querySelectorAll('.workout').forEach(el=>el.addEventListener('toggle',()=>{if(el.open)ensureDraft(el.dataset.key);}));}
function dated(v){return v?new Date(v.length===10?v+'T12:00:00':v).toLocaleDateString(): 'Date not recorded';}
function weightText(v,e){return v===null||v===''||v===undefined?(e?.[3]==='bodyweight'?'Bodyweight':'Weight not recorded'):`${escHtml(v)} lb${e?.[3]==='db'?' / DB':''}`;}
function history(id){const old=lsGet('wt_history',{})[id]||[];const recent=state().sessions.flatMap(s=>s.exercises.filter(e=>e.id===id).map(e=>({weight:e.weight,date:s.completedAt,workout:s.workout})));return `<p class="muted">${old.length?'Legacy weekly records (not individual sessions)':'No legacy weekly history'}</p>`+old.map(h=>`<p>Week ${escHtml(h.wk)} · ${escHtml(h.weight)} lb${h.date?' · recorded '+dated(h.date):''}</p>`).join('')+recent.map(h=>`<p>${dated(h.date)} · ${h.workout} · ${weightText(h.weight,CURRENT[id])}</p>`).join('');}
function logRow(id,e){const l=latest(id);return `<details class="history-row"><summary>${escHtml(e?.[1]||LEGACY_NAMES[id]||id.replaceAll('_',' '))}<small>${weightText(l.weight,e)} · ${dated(l.date||l.updatedAt)}</small></summary><div class="card-body">${history(id)}</div></details>`;}
function renderLog(){const seen=new Set();let html=header('Log','Strength history & daily protein')+renderProteinCalendar();for(const [k,p]of Object.entries(PLAN)){html+=`<div class="section card"><div class="card-header"><h2>${k}</h2></div>`+p.exercises.filter(e=>{if(seen.has(e[0]))return false;seen.add(e[0]);return true;}).map(e=>logRow(e[0],e)).join('')+'</div>';}
 const ids=new Set([...Object.keys(localStorage).filter(k=>k.startsWith('weight_')).map(k=>k.slice(7)),...Object.keys(lsGet('wt_history',{}))]);html+=`<div class="section card"><details><summary>Previous-program lifts & history</summary>${[...ids].filter(id=>!CURRENT[id]).map(id=>logRow(id)).join('')||'<p class="card-body muted">No previous lifts on this device.</p>'}</details></div>`;document.getElementById('log-content').innerHTML=html;}
// Protein calendar reads existing daily records; no history is migrated or rewritten.
let proteinYear = new Date().getFullYear();
function proteinBand(total) {
  if (total === null) return 'unlogged';
  return total >= 120 ? 'high' : total >= 100 ? 'good' : total >= 80 ? 'mid' : 'low';
}
function proteinDay(date) {
  const entry = lsGet('protein_' + date);
  return entry && Number.isFinite(entry.total) && entry.total >= 0 ? entry.total : null;
}
function inspectProteinDay(date) {
  const total = proteinDay(date);
  document.getElementById('protein-day-detail').textContent = `${dated(date)} · ${total === null ? 'No protein logged' : total + 'g protein'}`;
}
function changeProteinYear(year) {
  proteinYear = Number(year);
  renderLog();
}
function renderProteinCalendar() {
  const today = todayStr();
  const years = [...new Set([2026, 2027, Number(today.slice(0,4)), Number(today.slice(0,4))+1, proteinYear, ...Object.keys(localStorage).filter(k => /^protein_\d{4}-\d{2}-\d{2}$/.test(k)).map(k => Number(k.slice(8,12)))])].sort((a,b) => b-a);
  const bands = [['high','120g+'],['good','100–119g'],['mid','80–99g'],['low','Under 80g'],['unlogged','Not logged']];
  let rows = '';
  for (let month = proteinYear === 2026 ? 10 : 0; month < 12; month++) {
    const days = new Date(proteinYear, month + 1, 0).getDate();
    const name = new Date(proteinYear, month, 1).toLocaleString(undefined, {month:'short'});
    rows += `<tr><th scope="row">${name}</th>`;
    for (let day = 1; day <= 31; day++) {
      const date = `${proteinYear}-${String(month+1).padStart(2,'0')}-${String(day).padStart(2,'0')}`;
      const future = date > today;
      if (day > days || future) { rows += '<td class="protein-unavailable" aria-label="' + (day > days ? 'Not a calendar day' : date + ': future day') + '"></td>'; continue; }
      const total = proteinDay(date);
      const label = `${date}: ${total === null ? 'not logged' : total + 'g protein'}`;
      rows += `<td><button class="protein-cell protein-${proteinBand(total)}${date===today?' protein-current':''}" aria-label="${label}" title="${label}" onclick="inspectProteinDay('${date}')">${total===null?'·':''}</button></td>`;
    }
    rows += '</tr>';
  }
  return `<section class="section card protein-calendar"><div class="card-header"><h2>Protein consistency</h2><select aria-label="Protein calendar year" onchange="changeProteinYear(this.value)">${years.map(y=>`<option ${y===proteinYear?'selected':''}>${y}</option>`).join('')}</select></div><div class="card-body"><div class="protein-legend">${bands.map(([band,label])=>`<span><i class="protein-${band}"></i>${label}</span>`).join('')}</div><p class="muted">Months down, days across. Swipe to see later days; tap a square for the total.</p><div class="protein-grid-scroll" role="region" aria-label="Daily protein calendar, scroll horizontally for all days" tabindex="0"><table class="protein-grid"><caption class="sr-only">Daily protein totals for ${proteinYear}. Future and nonexistent days are blank.</caption><thead><tr><th scope="col">Month</th>${Array.from({length:31},(_,i)=>`<th scope="col">${i+1}</th>`).join('')}</tr></thead><tbody>${rows}</tbody></table></div><p id="protein-day-detail" class="muted" aria-live="polite">Unlogged days are separate from days below 80g. Blank spaces are future or nonexistent days.</p></div></section>`;
}
function setPilates(i,checked){
 const s=state();
 if(checked && !s.pilates[i]){
   const event={id:crypto.randomUUID(),day:i+1,completedAt:new Date().toISOString(),localDate:todayStr()};
   s.pilatesEvents.push(event);s.pilatesActive[i]=event.id;
 }else if(!checked && s.pilates[i]){
   const event=s.pilatesEvents.find(e=>e.id===s.pilatesActive[i]);
   if(event)event.undoneAt=new Date().toISOString();
   delete s.pilatesActive[i];
 }
 s.pilates[i]=checked;lsSet(STATE_KEY,s);renderPilates();
}
function resetPilates(){if(!confirm('Uncheck all 25 days and start again? Completed activity history will be kept.'))return;const s=state();s.pilates=Array(25).fill(false);s.pilatesActive={};lsSet(STATE_KEY,s);renderPilates();}
function videoLink(i){return `https://www.youtube.com/watch?v=${PILATES[i].id}&list=PLefYzZnhersa1QOGBTcBj44GjqEd9wqyZ`;}
function videoTitle(v){return v.title.replace(/^25 DAY PILATES CHALLENGE\s*\|?\s*DAY \d+\s*\|\s*/i,'');}
function renderPilates(){const s=state(),done=s.pilates.filter(Boolean).length,next=s.pilates.findIndex(x=>!x);document.getElementById('pilates-content').innerHTML=header('Pilates','PILATES BY IZZY · 25 days, at your pace')+`<div class="section card"><div class="card-body"><h2>${next<0?'All 25 days complete!':'Next Up · Day '+(next+1)}</h2><p class="muted">${done}/25 complete · check or uncheck anytime</p>${next<0?'':`<a class="video-link" href="${videoLink(next)}" target="_blank" rel="noopener noreferrer">${escHtml(videoTitle(PILATES[next]))} ↗</a>`}</div></div><div class="section card">${PILATES.map((v,i)=>`<div class="pilates-row"><label class="pilates-check"><input type="checkbox" aria-label="Day ${i+1} complete" ${s.pilates[i]?'checked':''} onchange="setPilates(${i},this.checked)"></label><a href="${videoLink(i)}" target="_blank" rel="noopener noreferrer"><strong>Day ${i+1}</strong><small>${escHtml(videoTitle(v))}</small></a></div>`).join('')}</div><div class="section"><button class="btn-secondary" onclick="resetPilates()">Uncheck all & start again</button></div>`;}
// Monday-based weeks use local calendar dates, not UTC day boundaries.
let activityOffset=0;
function localDateOf(timestamp){
 const d=new Date(timestamp);
 return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
}
function shiftDate(date,days){const d=new Date(date+'T12:00:00');d.setDate(d.getDate()+days);return localDateOf(d);}
function mondayOf(date){const d=new Date(date+'T12:00:00');return shiftDate(date,-((d.getDay()+6)%7));}
function activityEntries(){
 const s=state();
 return [...s.sessions.map(x=>({id:x.id,type:x.workout,date:x.localDate||localDateOf(x.completedAt),label:x.workout})),...s.pilatesEvents.filter(x=>!x.undoneAt).map(x=>({id:x.id,type:'Pilates',date:x.localDate||localDateOf(x.completedAt),label:'Pilates · Day '+x.day}))];
}
function weekEntries(start){const end=shiftDate(start,7);return activityEntries().filter(x=>x.date>=start&&x.date<end);}
function pilatesActivityBand(n){return n===0?'zero':n<=3?'building':n===4?'close':'target';}
function moveActivity(offset){activityOffset=Math.max(0,activityOffset+offset);renderActivity();}
function renderActivity(){
 const current=mondayOf(todayStr());
 const types=['PULL','PUSH','LEGS','Pilates'];
 let rows='';
 for(let i=0;i<12;i++){
   const start=shiftDate(current,-7*(activityOffset+i));const entries=weekEntries(start);
   rows+=`<tr><th scope="row">${new Date(start+'T12:00:00').toLocaleDateString(undefined,{month:'short',day:'numeric'})}<small>${start.slice(0,4)}${start===current?' · now':''}</small></th>`+types.map(type=>{
     const n=entries.filter(e=>e.type===type).length;
     return type==='Pilates'
       ? `<td><span class="activity-cell activity-quantity pilates-${pilatesActivityBand(n)}" role="img" aria-label="Week of ${start}, Pilates: ${n} sessions; target 5 to 6">${n}</span></td>`
       : `<td><span class="activity-cell activity-lift"><input type="checkbox" disabled ${n>0?'checked':''} aria-label="Week of ${start}, ${type}: ${n>0?'completed':'not completed'}"></span></td>`;
   }).join('')+'</tr>';
 }
 const unknown=state().pilates.filter((done,i)=>done&&!state().pilatesActive[i]).length;
 document.getElementById('activity-content').innerHTML=header('Activity','Your week-by-week consistency')+`<section class="section card"><div class="card-body"><h2>Your weekly rhythm</h2><p class="muted">1 Pull · 1 Push · 1 Legs · 5–6 Pilates<br>Weeks start Monday</p><div class="activity-controls"><button onclick="moveActivity(12)">← Earlier</button><button onclick="moveActivity(-12)" ${activityOffset===0?'disabled':''}>Later →</button></div><table class="activity-grid"><thead><tr><th scope="col">Week of</th>${types.map(t=>`<th scope="col">${t==='Pilates'?t:t[0]+t.slice(1).toLowerCase()}</th>`).join('')}</tr></thead><tbody>${rows}</tbody></table><p class="muted">Lift checkmarks fill automatically when you finish a session. The Pilates box shows your weekly total.</p></div></section><section class="section card"><div class="card-body activity-notes"><h2>Your completed workouts</h2><p class="muted">Lift sessions appear when you finish them. Pilates appears when you check a day done. Undo removes that completion; “Uncheck all” keeps history for your next pass.</p>${unknown?`<p class="muted">${unknown} previously checked Pilates day(s) have no recorded date and aren’t assigned to a week.</p>`:''}<p class="muted">Legacy lifting checkmarks are not counted as dated sessions.</p></div></section>`;
}
function mergePilatesEvents(a,b){
 const entries=new Map();
 for(const event of [...a,...b]){const old=entries.get(event.id);entries.set(event.id,{...event,...(old?.undoneAt?{undoneAt:old.undoneAt}:{})});}
 return [...entries.values()];
}
function backupKey(k){return /^(weight_|checks_|protein_|notes_)/.test(k)||['wt_history','chat_history','loaded_programs','exercise_overrides','applied_patches',STATE_KEY].includes(k);}
function stripSecrets(value){if(Array.isArray(value))return value.map(stripSecrets);if(value&&typeof value==='object')return Object.fromEntries(Object.entries(value).filter(([k])=>!/(api.?key|token|secret|password|credential)/i.test(k)).map(([k,v])=>[k,stripSecrets(v)]));if(typeof value==='string')return value.replace(/sk-ant-[\w-]+/g,'[redacted]');return value;}
function backupData(){return stripSecrets({_version:5,_exported:new Date().toISOString(),...Object.fromEntries(Object.keys(localStorage).filter(backupKey).map(k=>[k,lsGet(k)]))});}
async function exportData(){const blob=new Blob([JSON.stringify(backupData(),null,2)],{type:'application/json'});const url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download='meg-fit-backup-'+todayStr()+'.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),60000);}
function validateState(s){if(!s||s.version!==5||!Array.isArray(s.sessions)||!Array.isArray(s.pilates)||s.pilates.length!==25||!s.pilates.every(x=>typeof x==='boolean')||!s.drafts||typeof s.drafts!=='object')throw Error('Invalid workout backup');
 if(s.pilatesEvents!==undefined&&(!Array.isArray(s.pilatesEvents)||!s.pilatesEvents.every(e=>e&&typeof e.id==='string'&&Number.isInteger(e.day)&&e.day>=1&&e.day<=25&&Number.isFinite(Date.parse(e.completedAt))&&(!e.localDate||/^\d{4}-\d{2}-\d{2}$/.test(e.localDate))&&(!e.undoneAt||Number.isFinite(Date.parse(e.undoneAt))))))throw Error('Invalid Pilates activity');
 if(s.pilatesActive!==undefined&&(!s.pilatesActive||typeof s.pilatesActive!=='object'||Array.isArray(s.pilatesActive)||!Object.entries(s.pilatesActive).every(([day,id])=>Number.isInteger(Number(day))&&Number(day)>=0&&Number(day)<25&&typeof id==='string')))throw Error('Invalid Pilates checklist history');
 for(const x of s.sessions){if(typeof x.id!=='string'||!PLAN[x.workout]||!Number.isFinite(Date.parse(x.completedAt))||!Array.isArray(x.exercises))throw Error('Invalid session');for(const e of x.exercises)if(!CURRENT[e.id]||(e.weight!==null&&(typeof e.weight!=='number'||!Number.isFinite(e.weight)||e.weight<0)))throw Error('Invalid session weight');}
 for(const [k,d]of Object.entries(s.drafts)){if(!PLAN[k]||typeof d.id!=='string'||!Array.isArray(d.checks)||!d.checks.every(id=>PLAN[k].exercises.some(e=>e[0]===id))||!d.weights||typeof d.weights!=='object')throw Error('Invalid unfinished workout');}
}
function unique(a,b){return [...new Map([...a,...b].map(x=>[JSON.stringify(x),x])).values()];}
function prepareRestore(data){if(!data||typeof data!=='object'||Array.isArray(data)||![2,5].includes(data._version))throw Error('Choose a Meg’s Fit backup (version 2 or 5).');const writes={};for(const [k,v]of Object.entries(data)){if(!backupKey(k))continue;if(k===STATE_KEY){validateState(v);const current=state();const sessions=new Map(v.sessions.map(x=>[x.id,x]));current.sessions.forEach(x=>sessions.set(x.id,x));writes[k]={version:5,pilatesEvents:mergePilatesEvents(v.pilatesEvents||[],current.pilatesEvents),pilatesActive:{...(v.pilatesActive||{}),...current.pilatesActive},sessions:[...sessions.values()].sort((a,b)=>a.completedAt.localeCompare(b.completedAt)),drafts:{...v.drafts,...current.drafts},pilates:current.pilates.map((x,i)=>x||v.pilates[i])};for(const [day,id] of Object.entries(writes[k].pilatesActive)){if(writes[k].pilatesEvents.some(e=>e.id===id&&e.undoneAt)){writes[k].pilates[day]=false;delete writes[k].pilatesActive[day];}}for(const [key,d]of Object.entries(writes[k].drafts))if(sessions.has(d.id))delete writes[k].drafts[key];continue;}
 if(k.startsWith('weight_')&&(!v||typeof v!=='object'||!['string','number'].includes(typeof v.weight)))throw Error('Invalid legacy weight');
 if(k==='chat_history'&&!v?.every?.(m=>m&&['user','assistant'].includes(m.role)&&typeof m.content==='string'))throw Error('Invalid chat history');
 if(k==='wt_history'&&(!v||typeof v!=='object'||Array.isArray(v)||!Object.values(v).every(Array.isArray)))throw Error('Invalid legacy history');
 if((k==='chat_history'||k==='loaded_programs'||k==='applied_patches'||k.startsWith('checks_'))&&!Array.isArray(v))throw Error('Invalid list in backup');
 if(k.startsWith('protein_')&&(!v||!Number.isFinite(v.total)||!Array.isArray(v.entries)||!v.entries.every(e=>Number.isFinite(e.amount)&&Number.isFinite(e.ts))))throw Error('Invalid protein data');
 if(k.startsWith('notes_')&&typeof v!=='string')throw Error('Invalid notes');
 const old=lsGet(k);if(old===null)writes[k]=stripSecrets(v);else if(k==='wt_history'){writes[k]={...old};for(const [id,rows]of Object.entries(v))writes[k][id]=unique(old[id]||[],rows);}else if(k==='chat_history'||k==='loaded_programs'||k==='applied_patches'||k.startsWith('checks_'))writes[k]=unique(old,v);else if(k.startsWith('protein_')){const entries=unique(old.entries,v.entries);writes[k]={...old,entries,total:entries.reduce((n,e)=>n+e.amount,0)};}else if(k.startsWith('notes_')&&v&&!old.includes(v))writes[k]=old+'\n\n[Restored note]\n'+v;
 // Existing legacy weights, overrides and conflicting preferences remain unchanged.
 }if(!Object.keys(writes).length)throw Error('No supported data found in backup.');return writes;}
async function importData(){try{const f=document.getElementById('backup-file').files[0];const text=f?await f.text():document.getElementById('import-area').value;const writes=prepareRestore(JSON.parse(text));if(!confirm('Merge this backup? Existing weights and unfinished workouts win conflicts. Sessions merge without duplicates; Pilates checkmarks combine. API keys are ignored.'))return;
 const previous=Object.fromEntries(Object.keys(writes).map(k=>[k,localStorage.getItem(k)]));try{for(const [k,v]of Object.entries(writes))localStorage.setItem(k,JSON.stringify(v));}catch(e){for(const [k,v]of Object.entries(previous))v===null?localStorage.removeItem(k):localStorage.setItem(k,v);throw Error('Restore could not fit in storage; previous data restored.');}closeSettings();switchTab(activeTab);showToast('Backup merged. Existing data preserved.');}catch(e){showToast('Restore failed: '+e.message);}}
function getChatHistory(){return lsGet('chat_history',[]);}
function saveChatHistory(msgs){lsSet('chat_history',msgs);}
function renderChat(){document.getElementById('chat-messages').innerHTML=getChatHistory().map(m=>`<div class="msg ${m.role==='user'?'user':'assistant'}"><div class="msg-bubble">${escHtml(m.content).replaceAll('\n','<br>')}</div></div>`).join('')||'<p class="card-body muted">Ask about your training, weights, or Pilates. Add your Anthropic API key to get started.</p>';}
function buildSystemPrompt(){return `You are Meg’s concise training assistant. Meg weighs 130 lb and wants defined shoulders, back and abs while maintaining glute/leg development. Use this exact flexible PULL/PUSH/LEGS program, with no fixed dates, phases or forced sequence: ${JSON.stringify(PLAN)}. Weights are pounds; dumbbell weights are per dumbbell. Most sets 1–3 reps in reserve; add a little weight after reaching the top of the range across good-form sets. Rest 2–3 min compounds, 60–90 sec accessories. Historical right-wrist ganglion cyst: neutral grips; avoid push-ups, flat bench, dips and loaded wrist extension. Neutral-grip incline DB press only if comfortable; suggest a comfortable neutral-grip machine alternative or clinician guidance for symptoms. Never assume the wrist issue resolved. Do not suggest peptide protocols or dosages. Do not generate program-json or program-patch; the app no longer applies them. Pilates is one reusable 25-day PILATES BY IZZY checklist; no rounds or deadlines. Progress: ${JSON.stringify(state())}. Current latest weights: ${JSON.stringify(Object.fromEntries(Object.keys(CURRENT).map(id=>[id,latest(id)])))}. Legacy weekly records, not exact workout sessions: ${JSON.stringify(lsGet('wt_history',{}))}. Today’s protein: ${JSON.stringify(lsGet('protein_'+todayStr(),{total:0}))}. Treat historical chat as context, not the current program.`;}
function todayStr() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
}

function fmtDate(dateStr) {
  const d = new Date(dateStr + 'T12:00:00');
  const days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
  const months = ['January','February','March','April','May','June','July','August','September','October','November','December'];
  return `${days[d.getDay()]}, ${months[d.getMonth()]} ${d.getDate()}`;
}

function fmtTime(ts) {
  const d = new Date(ts);
  let h = d.getHours(), m = d.getMinutes();
  const ampm = h >= 12 ? 'pm' : 'am';
  h = h % 12 || 12;
  return `${h}:${String(m).padStart(2,'0')}${ampm}`;
}


function renderProteinSection(date) {
  const data = lsGet(`protein_${date}`, { total: 0, entries: [] });
  const pct = Math.min(100, Math.round((data.total / 130) * 100));
  const entries = [...data.entries].reverse().map(e =>
    `<div class="protein-entry"><span>${e.amount}g</span><span class="ent-time">${fmtTime(e.ts)}</span></div>`
  ).join('');

  return `
    <div class="section">
      <div class="card">
        <div class="card-header"><span class="icon">🥩</span><h2>Protein</h2><span class="badge" id="protein-badge">${pct}%</span></div>
        <div class="protein-display">
          <div class="protein-total" id="protein-total">${data.total}<span>g / 130g</span></div>
          <div class="protein-label">daily target · 130-145g</div>
        </div>
        <div class="progress-bar"><div class="progress-fill" id="protein-bar" style="width:${pct}%"></div></div>
        ${data.entries.length ? `<div class="protein-entries" id="protein-entries">${entries}</div>` : '<div id="protein-entries"></div>'}
        <div class="protein-input-area">
          <div class="protein-preview ${proteinInput ? '' : 'empty'}" id="protein-preview">${proteinInput || '0'}</div>
          <div class="numpad">
            <button class="numpad-btn" onclick="numTap('7')">7</button>
            <button class="numpad-btn" onclick="numTap('8')">8</button>
            <button class="numpad-btn" onclick="numTap('9')">9</button>
            <button class="numpad-btn" onclick="numTap('4')">4</button>
            <button class="numpad-btn" onclick="numTap('5')">5</button>
            <button class="numpad-btn" onclick="numTap('6')">6</button>
            <button class="numpad-btn" onclick="numTap('1')">1</button>
            <button class="numpad-btn" onclick="numTap('2')">2</button>
            <button class="numpad-btn" onclick="numTap('3')">3</button>
            <button class="numpad-btn del-btn" onclick="numTap('del')">⌫</button>
            <button class="numpad-btn" onclick="numTap('0')">0</button>
            <button class="numpad-btn add-btn" onclick="numTap('add')">Add</button>
          </div>
        </div>
      </div>
    </div>
  `;
}

function attachProteinHandlers(date) {
  // Handled via global numTap function, date captured via closure trick
  window._proteinDate = date;
}

function numTap(val) {
  const date = window._proteinDate || todayStr();
  if (val === 'del') {
    proteinInput = proteinInput.slice(0, -1);
  } else if (val === 'add') {
    const amt = parseInt(proteinInput, 10);
    if (amt > 0) {
      const data = lsGet(`protein_${date}`, { total: 0, entries: [] });
      data.total += amt;
      data.entries.push({ amount: amt, ts: Date.now() });
      lsSet(`protein_${date}`, data);
      proteinInput = '';
      // Update UI without full re-render
      const pct = Math.min(100, Math.round((data.total / 130) * 100));
      const totalEl = document.getElementById('protein-total');
      const barEl = document.getElementById('protein-bar');
      const entriesEl = document.getElementById('protein-entries');
      if (totalEl) totalEl.innerHTML = `${data.total}<span>g / 130g</span>`;
      if (barEl) barEl.style.width = pct + '%';
      document.getElementById('protein-badge').textContent = pct + '%';
      if (entriesEl) {
        const entries = [...data.entries].reverse().map(e =>
          `<div class="protein-entry"><span>${e.amount}g</span><span class="ent-time">${fmtTime(e.ts)}</span></div>`
        ).join('');
        entriesEl.innerHTML = entries;
      }
    } else {
      proteinInput = '';
    }
  } else {
    if (proteinInput.length >= 4) return;
    proteinInput += val;
  }
  const preview = document.getElementById('protein-preview');
  if (preview) {
    preview.textContent = proteinInput || '0';
    preview.classList.toggle('empty', !proteinInput);
  }
}

// ── NOTES ────────────────────────────────────

function renderNotesSection(date) {
  const saved = lsGet(`notes_${date}`, '');
  return `
    <div class="section" style="margin-bottom:8px">
      <div class="card">
        <div class="card-header"><span class="icon">📝</span><h2>Notes</h2></div>
        <div class="card-body">
          <textarea class="notes-textarea" id="notes-area" placeholder="Notes for today…" rows="3">${escHtml(saved)}</textarea>
        </div>
      </div>
    </div>
  `;
}

function attachNotesHandler(date) {
  const ta = document.getElementById('notes-area');
  if (!ta) return;
  ta.addEventListener('input', () => lsSet(`notes_${date}`, ta.value));
}


function autoGrow(el) {
  el.style.height = 'auto';
  el.style.height = Math.min(el.scrollHeight, 100) + 'px';
  const sendBtn = document.getElementById('chat-send-btn');
  if (sendBtn) sendBtn.disabled = !el.value.trim();
}

function chatKeydown(e) {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    sendChat();
  }
}

async function sendChat() {
  const input = document.getElementById('chat-input');
  const text = input.value.trim();
  if (!text || chatBusy) return;

  const apiKey = lsGet('anthropic_api_key', null);
  if (!apiKey) {
    openSettings();
    return;
  }

  chatBusy = true;
  const msgs = getChatHistory();
  msgs.push({ role: 'user', content: text, ts: Date.now() });
  saveChatHistory(msgs);

  input.value = '';
  input.style.height = 'auto';
  document.getElementById('chat-send-btn').disabled = true;

  renderChat();
  const chatEl = document.getElementById('chat-messages');

  // Show typing indicator
  const typingEl = document.createElement('div');
  typingEl.className = 'msg assistant';
  typingEl.id = 'typing';
  typingEl.innerHTML = `<div class="msg-bubble" style="padding:8px 14px">
    <div class="typing-indicator">
      <div class="typing-dot"></div><div class="typing-dot"></div><div class="typing-dot"></div>
    </div>
  </div>`;
  chatEl.appendChild(typingEl);
  chatEl.scrollTo(0, chatEl.scrollHeight);

  try {
    const apiMsgs = msgs.slice(-30).map(m => ({ role: m.role === 'user' ? 'user' : 'assistant', content: m.content }));

    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
        'anthropic-dangerous-direct-browser-access': 'true',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-6',
        max_tokens: 1024,
        system: buildSystemPrompt(),
        messages: apiMsgs,
      }),
    });

    const data = await res.json();
    typingEl.remove();

    if (data.error) throw new Error('AI request failed. Check your key, balance and connection.');

    if (!res.ok) throw new Error('AI request failed (' + res.status + '). Check your key and try again.');
    const reply = data.content.filter(c=>c.type==='text').map(c=>c.text).join('\n');
    msgs.push({ role: 'assistant', content: reply, ts: Date.now() });
    saveChatHistory(msgs);
    renderChat();
    chatEl.scrollTo(0, chatEl.scrollHeight);
  } catch (err) {
    typingEl.remove();
    const errEl = document.createElement('div');
    errEl.className = 'msg assistant';
    errEl.innerHTML = `<div class="msg-bubble" style="color:#ef4444">Error: ${escHtml(err.message)}</div>`;
    chatEl.appendChild(errEl);
    chatEl.scrollTo(0, chatEl.scrollHeight);
  } finally { chatBusy = false; autoGrow(input); }
}

// ═══════════════════════════════════════════════
// SETTINGS
// ═══════════════════════════════════════════════

function openSettings() {
  const overlay = document.getElementById('settings-overlay');
  const input = document.getElementById('api-key-input');
  const saved = lsGet('anthropic_api_key', '');
  input.value = saved;
  overlay.classList.remove('hidden');
  setTimeout(() => input.focus(), 100);
}

function closeSettings() {
  document.getElementById('settings-overlay').classList.add('hidden');
}

function saveApiKey() {
  const val = document.getElementById('api-key-input').value.trim();
  if (val) {
    lsSet('anthropic_api_key', val);
    closeSettings();
  }
}

document.getElementById('settings-overlay').addEventListener('click', (e) => {
  if (e.target === document.getElementById('settings-overlay')) closeSettings();
});

if('serviceWorker' in navigator)window.addEventListener('load',()=>navigator.serviceWorker.register('./sw.js').then(r=>r.update()).catch(()=>{}));
let currentDate=todayStr();document.addEventListener('visibilitychange',()=>{if(!document.hidden&&currentDate!==todayStr()){currentDate=todayStr();proteinInput='';if(activeTab==='today')renderToday();}});
renderToday();
