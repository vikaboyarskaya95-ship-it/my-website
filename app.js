'use strict';

const app = document.getElementById('app');

const COLORS = [
  {key:'red', name:'КРАСНЫЙ', hex:'#ef4d3e'},
  {key:'blue', name:'СИНИЙ', hex:'#3479d8'},
  {key:'green', name:'ЗЕЛЁНЫЙ', hex:'#6f9b45'},
  {key:'yellow', name:'ЖЁЛТЫЙ', hex:'#e4a829'},
  {key:'purple', name:'ФИОЛЕТОВЫЙ', hex:'#7f73bf'},
  {key:'orange', name:'ОРАНЖЕВЫЙ', hex:'#ea7a2a'}
];
const SHAPES = [
  {key:'circle', name:'КРУГ'},
  {key:'square', name:'КВАДРАТ'},
  {key:'triangle', name:'ТРЕУГОЛЬНИК'},
  {key:'diamond', name:'РОМБ'},
  {key:'star', name:'ЗВЕЗДА'}
];
const CUBE_COLORS = ['#7f73bf','#7f9851','#3b73c9','#e9ae35','#ef6b57','#8cc5b0'];
const ARROWS = {up:'↑',right:'→',down:'↓',left:'←'};
const DIRS = {up:[-1,0],right:[0,1],down:[1,0],left:[0,-1]};
const OPP = {up:'down',down:'up',left:'right',right:'left'};
const ROUTE = {
  view:'home', taskId:null, level:1, started:false, paused:false,
  startMs:0, pauseMs:0, elapsedMs:0, timer:null, errors:0, completed:0, runtime:null
};

const tasks = [
  {id:1,title:'Таблица Шульте',short:'Числовой маршрут',skills:['концентрация','скорость','внимание'],desc:'Находите числа по порядку. Таблица каждый раз перемешивается.',goal:'Тренирует концентрацию внимания, скорость зрительного поиска и устойчивость к отвлекающим элементам.',brief:'Нажимайте числа по порядку. Чем выше уровень, тем больше поле и больше визуальных помех.',make:makeNumberRoute},
  {id:2,title:'Струп-тест',short:'Цвет или слово',skills:['самоконтроль','реакция','переключение'],desc:'Выбирайте цвет или значение слова по правилу уровня.',goal:'Развивает тормозной контроль: мозгу нужно подавить автоматическое чтение слова.',brief:'Смотрите на слово. На 3 уровне рамка меняет правило ответа.',make:makeStroop},
  {id:3,title:'Поиск по правилу',short:'Найди нужные карточки',skills:['внимание','анализ','самоконтроль'],desc:'Выбирайте только те карточки, которые подходят под правило: цвет, форма, размер, стрелка или число.',goal:'Тренирует зрительное сканирование, удержание инструкции и контроль импульсивного выбора.',brief:'Нажмите «Старт», внимательно прочитайте правило и выберите все подходящие карточки. Лишние клики считаются ошибками.',make:makeRuleSearch},
  {id:4,title:'Кубики по памяти',short:'Запомни комбинацию',skills:['память','кубики','сравнение'],desc:'Запомните цветную комбинацию кубиков, затем найдите её среди похожих вариантов.',goal:'Развивает зрительную память, точность сравнения и внимание к расположению цветов.',brief:'После старта образец появится ненадолго и исчезнет. Выберите точное совпадение среди ловушек.',make:makeCubeMemory},
  {id:5,title:'Повтори ряд',short:'Цветовая память',skills:['память','последовательность','внимание'],desc:'Запомните последовательность миганий и повторите её.',goal:'Развивает рабочую память, удержание последовательности и самоконтроль.',brief:'Нажмите «Старт»: кнопки покажут ряд, затем повторите его.',make:makeSequence},
  {id:6,title:'Найди пару',short:'Память на фигуры',skills:['память','образы','концентрация'],desc:'Фигуры открываются только после старта, затем закрываются — пары нужно искать по памяти.',goal:'Тренирует зрительную память и способность удерживать расположение объектов.',brief:'Нажмите «Старт», изучите открытые карточки, дождитесь скрытия и открывайте пары.',make:makeMemoryPairs},
  {id:7,title:'Матрица закономерностей',short:'Найди пропуск',skills:['логика','анализ','правила'],desc:'Определите недостающий элемент в матрице по цвету, форме и направлению.',goal:'Развивает анализ закономерностей, удержание нескольких признаков и гибкость мышления.',brief:'Изучите матрицу и выберите элемент, который должен стоять на месте вопроса.',make:makeMatrixPattern},
  {id:8,title:'Цепочки закономерностей',short:'Продолжи ряд',skills:['логика','прогнозирование','память'],desc:'Заполняйте пропуски в сложных цвето-фигурных последовательностях.',goal:'Развивает анализ закономерностей, прогнозирование и зрительную память.',brief:'Нажмите пустое место, затем выберите подходящий элемент из банка. На сложном уровне есть ловушки.',make:makePatterns},
  {id:9,title:'Фрагмент в поле',short:'Кубики в деталях',skills:['зрительный анализ','память','сравнение'],desc:'Найдите маленький фрагмент внутри большого поля из кубиков.',goal:'Тренирует внимание к деталям, зрительную память и точное сравнение образцов.',brief:'Изучите фрагмент и нажмите на верхний левый кубик такого же фрагмента в большом поле. На сложном уровне образец скрывается.',make:makeFindFragment},
  {id:10,title:'Зеркало и поворот',short:'Не перепутай',skills:['пространство','анализ','самоконтроль'],desc:'Определяйте зеркальные варианты и отличайте их от поворотов и похожих ловушек.',goal:'Развивает пространственное мышление и мысленное преобразование образов.',brief:'Выбирайте именно зеркальное отражение. Поворот не считается правильным.',make:makeMirror},
  {id:11,title:'Поворот кубиков',short:'Цветовой конструктор',skills:['пространство','кубики','анализ'],desc:'Выберите вариант, где фигура повернута, но не отражена зеркально.',goal:'Развивает мысленный поворот объекта и внимание к положению цветов.',brief:'Зеркальные ловушки похожи, но неправильны.',make:makeCubeRotate},
  {id:12,title:'Быстрое решение',short:'Правило меняется',skills:['реакция','переключение','внимание'],desc:'Отвечайте по сложному правилу: число, цвет, форма, рамка и символ имеют значение.',goal:'Тренирует скорость принятия решения и гибкость мышления.',brief:'Читайте правило уровня. На 3 уровне символы меняют критерий ответа.',make:makeFastDecision},
  {id:13,title:'Найди образец',short:'Поиск среди похожих',skills:['внимание','память','сравнение'],desc:'Запомните образец и найдите карточку, которая совпадает по нужным признакам.',goal:'Развивает избирательное внимание и способность удерживать несколько условий одновременно.',brief:'Нажмите «Старт», изучите образец и выберите подходящую карточку. На сложном уровне образец скрывается.',make:makeTargetMatch},
  {id:14,title:'Собери кубики',short:'Повтори образец',skills:['зрительная память','пространство','точность'],desc:'Перенесите цветные кубики в пустую сетку так, чтобы повторить образец.',goal:'Развивает зрительное копирование, пространственное планирование и точность.',brief:'Выберите цвет в палитре и заполните сетку. На сложном уровне образец скрывается.',make:makeBuildCubes},
  {id:15,title:'Финальный микс',short:'Комплексная тренировка',skills:['внимание','память','реакция','логика'],desc:'Итоговая серия: цвет, форма, поиск по правилу, кубики, зеркало и закономерности.',goal:'Объединяет навыки: внимание, реакцию, память, анализ и переключение правил.',brief:'Следите за правилом каждого раунда. Тип задания меняется, поэтому важно не отвечать автоматически.',make:makeFinalMix}
]

function icon(id){ const t=document.getElementById(id); return t?t.innerHTML:''; }
function rand(n){ return Math.floor(Math.random()*n); }
function shuffle(arr){ const a=[...arr]; for(let i=a.length-1;i>0;i--){ const j=rand(i+1); [a[i],a[j]]=[a[j],a[i]];} return a; }
function pick(arr){ return arr[rand(arr.length)]; }
function fmt(ms){ const sec=Math.floor(ms/1000); return `${String(Math.floor(sec/60)).padStart(2,'0')}:${String(sec%60).padStart(2,'0')}`; }
function colorByKey(key){ return COLORS.find(c=>c.key===key) || COLORS[0]; }
function shapeByKey(key){ return SHAPES.find(s=>s.key===key) || SHAPES[0]; }
function shapeHTML(shapeKey, colorKey, extra=''){ const c=colorByKey(colorKey).hex; return `<span class="shape ${shapeKey} ${extra}" style="${shapeKey==='triangle'?'color:'+c:'background:'+c}"></span>`; }
function cubeCell(colorIndex){ if(colorIndex===null) return `<span class="cube empty"></span>`; return `<span class="cube" style="background:${CUBE_COLORS[colorIndex%CUBE_COLORS.length]}"></span>`; }
function cubeGrid(pattern, label=''){ const size=pattern.length; return `<div class="cube-grid" style="--size:${size}" aria-label="${label}">${pattern.flat().map(cubeCell).join('')}</div>`; }
function rotatePattern(p){ const n=p.length; return Array.from({length:n},(_,r)=>Array.from({length:n},(_,c)=>p[n-1-c][r])); }
function mirrorPattern(p){ return p.map(row=>[...row].reverse()); }
function samePattern(a,b){ return JSON.stringify(a)===JSON.stringify(b); }
function makePattern(size=3, blocks=5){
  const p=Array.from({length:size},()=>Array.from({length:size},()=>null));
  let cells=[]; let r=Math.floor(size/2), c=Math.floor(size/2); p[r][c]=rand(6); cells.push([r,c]);
  while(cells.length<blocks){
    const [cr,cc]=pick(cells); const dirs=shuffle([[1,0],[-1,0],[0,1],[0,-1]]);
    for(const [dr,dc] of dirs){ const nr=cr+dr,nc=cc+dc; if(nr>=0&&nr<size&&nc>=0&&nc<size&&p[nr][nc]===null){ p[nr][nc]=rand(6); cells.push([nr,nc]); break; }}
    if(cells.length < blocks && cells.length >= size*size) break;
  }
  return p;
}
function mutatePattern(p){ const q=p.map(r=>[...r]); const filled=[]; q.forEach((row,r)=>row.forEach((v,c)=>{if(v!==null)filled.push([r,c])})); if(filled.length){ const [r,c]=pick(filled); q[r][c]=(q[r][c]+1+rand(5))%6; } return q; }

function getProgress(){ try{return JSON.parse(localStorage.getItem('neuroProgressV9')||'{}')}catch{return {}} }
function setProgress(p){ localStorage.setItem('neuroProgressV9', JSON.stringify(p)); }
function markComplete(taskId, level, result){ const p=getProgress(); const key=`${taskId}-${level}`; const prev=p[key]; if(!prev || result.score > prev.score || result.errors < prev.errors){ p[key]=result; setProgress(p); } }

function setRoute(view, taskId=null, level=ROUTE.level||1){
  stopTimer(); Object.assign(ROUTE,{view,taskId,level,started:false,paused:false,elapsedMs:0,errors:0,completed:0,runtime:null});
  location.hash = view==='task' ? `task-${taskId}` : view;
  render();
}
window.addEventListener('hashchange',()=>{
  const h=location.hash.replace('#','');
  if(h.startsWith('task-')){ const id=Number(h.split('-')[1]); if(tasks.find(t=>t.id===id)){ setRoute('task',id,ROUTE.level||1); return; } }
  if(['home','tasks','progress'].includes(h)) setRoute(h);
  else if(h==='about') setRoute('home');
});

document.body.addEventListener('click',(e)=>{
  const route=e.target.closest('[data-route]');
  if(route){ e.preventDefault(); setRoute(route.dataset.route); return; }
  const open=e.target.closest('[data-open-task]');
  if(open){ setRoute('task', Number(open.dataset.openTask), 1); return; }
});

function updateActiveNav(){
  document.querySelectorAll('.main-nav a').forEach(a=>a.classList.toggle('active', a.dataset.route===ROUTE.view || (ROUTE.view==='task' && a.dataset.route==='tasks')));
}
function render(){ updateActiveNav(); app.innerHTML=''; if(ROUTE.view==='home') renderHome(); if(ROUTE.view==='tasks') renderTasks(); if(ROUTE.view==='progress') renderProgress(); if(ROUTE.view==='task') renderTask(); app.focus({preventScroll:true}); }

function renderHome(){
  app.innerHTML = `<section class="hero simple-hero" id="home">
    <div class="hero-copy">
      <span class="eyebrow">кабинет нейропедагога и медицинского логопеда</span>
      <h1>Интерактивный <span class="green">нейро</span><span class="purple">тренажёр</span></h1>
      <p class="lead">Подходит для <b>детей от 7 лет</b>, подростков и взрослых. Можно заниматься всей семьёй!</p>
      <p class="lead small-lead">15 заданий по 3 уровня сложности для тренировки внимания, памяти, реакции, пространственного мышления и гибкости мышления. Без регистрации, без личных кабинетов, без камеры и микрофона.</p>
      <div class="hero-actions"><button class="btn primary" data-route="tasks">Начать тренировку</button></div>
    </div>
  </section>`;
}
function benefit(iconId,text){return `<div class="benefit"><span class="circle">${icon(iconId)}</span><b>${text}</b></div>`}

function renderAbout(){
  app.innerHTML = `<section class="section"><div class="page-title"><h1>О <span class="green">тренажёре</span></h1><p>Цифровая версия построена как набор интерактивных упражнений: клик, касание, выбор ответа, поиск пары, кубики, закономерности и задания на внимание. Прогресс сохраняется только в браузере пользователя.</p></div>
  <div class="progress-panel">
    <div class="benefits">
      ${benefit('iconEye','зрительное внимание')}${benefit('iconPuzzle','рабочая память')}${benefit('iconTarget','скорость реакции')}${benefit('iconPuzzle','логика и правила')}${benefit('iconLeaf','мягкая тренировка')}
    </div>
    <div class="info-grid" style="display:grid;grid-template-columns:repeat(3,1fr);gap:18px;margin-top:22px">
      <div class="mini-card"><h3>Без регистрации</h3><p>Никаких личных кабинетов. Пользователь просто открывает ссылку и начинает тренировку.</p></div>
      <div class="mini-card"><h3>Без камеры</h3><p>Сайт не проверяет реальные жесты, голос, хлопки или движения. Только безопасный цифровой интерактив.</p></div>
      <div class="mini-card"><h3>3 уровня</h3><p>Каждое задание имеет стартовый, тренировочный и сложный уровень с помехами и сменой правил.</p></div>
    </div>
  </div></section>`;
}
function renderTasks(){
  app.innerHTML = `<section class="section"><div class="page-title"><h1>15 <span class="green">заданий</span></h1><p>Выберите упражнение. Внутри каждого задания доступны 3 уровня сложности, таймер, ошибки и результат.</p></div><div class="cards-grid">${tasks.map(taskCard).join('')}</div></section>`;
}
function taskCard(t){return `<article class="task-card"><span class="num">${t.id}</span><h3>${t.title}</h3><p>${t.desc}</p><div class="tag-row">${t.skills.map(s=>`<span class="tag">${s}</span>`).join('')}</div><button class="btn small green open-btn" data-open-task="${t.id}">Открыть</button></article>`;}
function renderProgress(){
  const p=getProgress(); const keys=Object.keys(p); const doneTasks=new Set(keys.map(k=>Number(k.split('-')[0])));
  const best=keys.length?Math.round(keys.reduce((a,k)=>a+(p[k].score||0),0)/keys.length):0;
  app.innerHTML=`<section class="section"><div class="page-title"><h1>Ваш <span class="green">прогресс</span></h1><p>Прогресс сохраняется локально в этом браузере. Если очистить данные браузера или открыть сайт на другом устройстве, история не перенесётся.</p></div>
    <div class="progress-panel"><div class="progress-grid"><div class="stat-box"><strong>${doneTasks.size}</strong><span>заданий открыто</span></div><div class="stat-box"><strong>${keys.length}</strong><span>уровней пройдено</span></div><div class="stat-box"><strong>${best}%</strong><span>средний результат</span></div></div><div class="completed-list">${tasks.map(t=>`<div class="done-pill ${doneTasks.has(t.id)?'done':''}">${t.id}. ${t.short}</div>`).join('')}</div><button class="btn ghost" style="margin-top:22px" onclick="localStorage.removeItem('neuroProgressV9'); location.reload()">Очистить прогресс</button></div></section>`;
}

function renderTask(){
  const t=tasks.find(x=>x.id===ROUTE.taskId); if(!t){setRoute('tasks');return;}
  app.innerHTML=`<section class="task-view"><div class="task-head"><div class="task-title"><span class="eyebrow">задание ${t.id}</span><h1>${t.title}</h1></div><div class="task-meta">${t.skills.map(s=>`<span class="skill-chip">${s}</span>`).join('')}</div></div>
  <div class="activity-shell"><aside class="side-panel"><div class="mini-card instruction"><h3>Как заниматься?</h3><p>${t.brief}</p><ul><li>Выберите уровень.</li><li>Нажмите «Старт».</li><li>Старайтесь работать быстро, но без ошибок.</li></ul></div><div class="mini-card"><h3>Для чего нужно?</h3><p>${t.goal}</p></div></aside>
  <section class="exercise-card"><div class="exercise-toolbar"><div class="level-tabs">${[1,2,3].map(l=>`<button class="level-tab ${ROUTE.level===l?'active':''}" data-level="${l}">Уровень ${l}</button>`).join('')}</div><div class="timer-strip"><span class="timer-badge">⏱ <span id="timerText">00:00</span></span><span class="error-badge">Ошибки: <span id="errorText">0</span></span></div><div class="toolbar-actions"><button class="btn small primary" id="startBtn">Старт</button><button class="btn small ghost" id="restartBtn">Заново</button><button class="btn small green" id="checkBtn">Проверить</button><button class="btn small ghost" data-route="tasks">К списку</button></div></div><div class="board" id="board"></div></section></div></section>`;
  document.querySelectorAll('[data-level]').forEach(btn=>btn.addEventListener('click',()=>{ ROUTE.level=Number(btn.dataset.level); stopTimer(); ROUTE.started=false; ROUTE.errors=0; renderTask(); }));
  document.getElementById('startBtn').addEventListener('click',startCurrent);
  document.getElementById('restartBtn').addEventListener('click',()=>{ stopTimer(); ROUTE.started=false; ROUTE.errors=0; renderTask(); });
  document.getElementById('checkBtn').addEventListener('click',()=>{ if(ROUTE.runtime && ROUTE.runtime.check) ROUTE.runtime.check(); });
  ROUTE.runtime=t.make(ROUTE.level, document.getElementById('board'));
  setCheckVisible(!!ROUTE.runtime.check);
}
function setCheckVisible(visible){ const b=document.getElementById('checkBtn'); if(b) b.style.display=visible?'inline-flex':'none'; }
function startCurrent(){ if(ROUTE.started && !ROUTE.paused) return; ROUTE.started=true; ROUTE.paused=false; ROUTE.errors=0; updateErrors(); startTimer(); if(ROUTE.runtime && ROUTE.runtime.start) ROUTE.runtime.start(); }
function startTimer(){ stopTimer(); ROUTE.startMs=Date.now()-ROUTE.elapsedMs; ROUTE.timer=setInterval(()=>{ ROUTE.elapsedMs=Date.now()-ROUTE.startMs; const el=document.getElementById('timerText'); if(el) el.textContent=fmt(ROUTE.elapsedMs);},250); }
function stopTimer(){ if(ROUTE.timer){clearInterval(ROUTE.timer); ROUTE.timer=null;} }
function updateErrors(){ const el=document.getElementById('errorText'); if(el) el.textContent=ROUTE.errors; }
function addError(el){ ROUTE.errors++; updateErrors(); if(el){ el.classList.add('shake'); setTimeout(()=>el.classList.remove('shake'),300); } }
function feedback(msg,bad=false){ const f=document.getElementById('feedback'); if(f){ f.textContent=msg; f.classList.toggle('bad',bad); } }
function finishTask(extra={}){ stopTimer(); const maxErr=extra.maxErr||8; const score=Math.max(1, Math.round(100 - ROUTE.errors*7 - Math.floor(ROUTE.elapsedMs/1000)*0.2)); const result={score,errors:ROUTE.errors,time:ROUTE.elapsedMs,level:ROUTE.level,at:new Date().toISOString(),...extra}; markComplete(ROUTE.taskId, ROUTE.level, result); document.body.insertAdjacentHTML('beforeend',`<div class="result-modal" role="dialog" aria-modal="true"><div class="result-card"><h2>Отлично!</h2><p>Уровень завершён. Можно повторить или перейти к списку заданий.</p><div class="result-stats"><div><b>${score}%</b><span>результат</span></div><div><b>${fmt(ROUTE.elapsedMs)}</b><span>время</span></div><div><b>${ROUTE.errors}</b><span>ошибки</span></div></div><button class="btn primary" onclick="document.querySelector('.result-modal').remove(); setRoute('tasks')">К заданиям</button> <button class="btn ghost" onclick="document.querySelector('.result-modal').remove(); renderTask()">Повторить</button></div></div>`); }
function needStart(){ if(!ROUTE.started){ feedback('Сначала нажмите «Старт».', true); return true; } return false; }

// 1. Number route
function makeNumberRoute(level, board){
  const cols=level===1?4:level===2?5:6; const total=cols*cols; let next=1; const nums=shuffle([...Array(total)].map((_,i)=>i+1));
  board.innerHTML=`<h2 class="board-title">Таблица Шульте</h2><p class="board-subtitle">Найдите числа от 1 до ${total} по порядку.</p><div class="grid num-grid" style="--cols:${cols}">${nums.map(n=>`<button class="num-cell ${level===3&&n%5===0?'decoy':''}" data-num="${n}">${n}</button>`).join('')}</div><div class="feedback" id="feedback"></div>`;
  board.onclick=e=>{ const btn=e.target.closest('[data-num]'); if(!btn || needStart()) return; const n=Number(btn.dataset.num); if(n===next){ btn.classList.add('done'); btn.disabled=true; next++; feedback(`Верно. Следующее число: ${next<=total?next:'готово!'}`); if(next>total) finishTask(); } else addError(btn), feedback('Проверьте порядок чисел.', true); };
  return {start(){ next=1; feedback('Начинайте с числа 1.'); }};
}

// 2. Stroop
function makeStroop(level, board){
  let current=null, round=0, rounds=level===1?10:level===2?14:18;
  board.innerHTML=`<h2 class="board-title">Цвет или слово?</h2><p class="board-subtitle">Названия цветов не выходят за рамки: кнопки адаптируются по ширине.</p><div class="rounds" id="roundText">Раунд 0/${rounds}</div><div id="stroopBox"></div><div class="answer-grid">${COLORS.map(c=>`<button class="answer-btn" data-color="${c.key}">${c.name}</button>`).join('')}</div><div class="feedback" id="feedback"></div>`;
  function next(){
    if(round>=rounds){ finishTask(); return; } round++; document.getElementById('roundText').textContent=`Раунд ${round}/${rounds}`;
    const word=pick(COLORS); let ink=pick(COLORS); if(level>1){ while(ink.key===word.key) ink=pick(COLORS); }
    const framed=level===3 && Math.random()<.45; current={word:word.key, ink:ink.key, framed, correct:(level===3&&framed)?word.key:ink.key};
    document.getElementById('stroopBox').innerHTML=`<div class="stroop-word ${framed?'framed':''}" style="color:${ink.hex}">${word.name}</div><p class="board-subtitle">${level===3?(framed?'В рамке: выберите ЗНАЧЕНИЕ слова':'Без рамки: выберите ЦВЕТ написания'):'Выберите цвет написания'}</p>`;
  }
  board.onclick=e=>{ const btn=e.target.closest('[data-color]'); if(!btn || needStart()) return; if(btn.dataset.color===current.correct){ feedback('Верно!'); next(); } else { addError(btn); feedback('Не торопитесь: проверьте правило.', true); }};
  return {start(){ round=0; next(); }};
}

// 3. Rule search
function makeRuleSearch(level, board){
  const count=level===1?16:level===2?20:24;
  const cols=level===1?4:level===2?5:6;
  let items=[], selected=new Set(), targets=new Set(), ruleText='';
  function makeItem(){return {shape:pick(SHAPES.slice(0,5)).key,color:pick(COLORS.slice(0,6)).key,size:Math.random()<.5?'small':'large',arrow:pick(Object.keys(ARROWS)),num:rand(18)+1};}
  function itemHTML(it){
    return `<span class="search-token ${it.size}">${shapeHTML(it.shape,it.color,'shape-token')}<b>${level>1?ARROWS[it.arrow]:''}</b><em>${level>2?it.num:''}</em></span>`;
  }
  function setup(){
    selected=new Set(); items=Array.from({length:count},makeItem);
    const targetColor=pick(COLORS.slice(0,6)).key;
    const targetShape=pick(SHAPES.slice(0,5)).key;
    const targetArrow=pick(Object.keys(ARROWS));
    const targetEven=Math.random()<.5;
    let test;
    if(level===1){
      ruleText=`Выберите все карточки: ${colorByKey(targetColor).name.toLowerCase()} + ${shapeByKey(targetShape).name.toLowerCase()}.`;
      test=x=>x.color===targetColor && x.shape===targetShape;
      for(let i=0;i<4;i++) items[i]={...makeItem(), color:targetColor, shape:targetShape};
    } else if(level===2){
      ruleText=`Выберите все карточки: ${colorByKey(targetColor).name.toLowerCase()} + ${shapeByKey(targetShape).name.toLowerCase()} + стрелка ${ARROWS[targetArrow]}.`;
      test=x=>x.color===targetColor && x.shape===targetShape && x.arrow===targetArrow;
      for(let i=0;i<4;i++) items[i]={...makeItem(), color:targetColor, shape:targetShape, arrow:targetArrow};
    } else {
      ruleText=`Выберите карточки: ${shapeByKey(targetShape).name.toLowerCase()} с числом ${targetEven?'чётным':'нечётным'} И стрелкой ${ARROWS[targetArrow]}. Цвет не важен.`;
      test=x=>x.shape===targetShape && (x.num%2===0)===targetEven && x.arrow===targetArrow;
      for(let i=0;i<5;i++) items[i]={...makeItem(), shape:targetShape, arrow:targetArrow, num:(targetEven?2:1)+2*rand(8)};
    }
    items=shuffle(items);
    targets=new Set(items.map((it,i)=>test(it)?i:null).filter(x=>x!==null));
    if(targets.size===0){items[0]={...items[0], color:targetColor, shape:targetShape, arrow:targetArrow, num:targetEven?2:1}; targets.add(0);}
  }
  setup();
  board.innerHTML=`<h2 class="board-title">Поиск по правилу</h2><p class="board-subtitle">${ruleText}</p><div class="notice purple">Найдите все подходящие карточки. Количество правильных ответов заранее не указано.</div><div class="search-grid" style="--cols:${cols}">${items.map((it,i)=>`<button class="search-card" data-i="${i}">${itemHTML(it)}</button>`).join('')}</div><div class="feedback" id="feedback"></div>`;
  board.onclick=e=>{
    const card=e.target.closest('[data-i]'); if(!card || needStart()) return;
    const i=Number(card.dataset.i);
    if(selected.has(i)){ selected.delete(i); card.classList.remove('selected'); }
    else { selected.add(i); card.classList.add('selected'); }
  };
  return {start(){ feedback('Выберите все карточки по правилу и нажмите «Проверить».'); }, check(){ if(needStart()) return; let wrong=0; for(const i of selected){ if(!targets.has(i)) wrong++; } for(const i of targets){ if(!selected.has(i)) wrong++; } if(wrong===0) finishTask({found:targets.size}); else { ROUTE.errors+=wrong; updateErrors(); feedback(`Есть ошибки: ${wrong}. Проверьте каждое условие правила.`, true); } }};
}

// 4. Cube memory
function makeCubeMemory(level, board){
  const rounds=level===1?4:level===2?5:6; let round=0, target=null, options=[];
  function makeRound(){
    const size=level===1?3:level===2?4:4;
    const blocks=level===1?5:level===2?7:10;
    target=makePattern(size,blocks);
    options=[target, mutatePattern(target), rotatePattern(target), mirrorPattern(target), mutatePattern(mirrorPattern(target)), mutatePattern(rotatePattern(target))];
    options=shuffle(options).slice(0,level===1?3:level===2?4:5);
    if(!options.some(o=>samePattern(o,target))) options[0]=target;
    options=shuffle(options);
    round++;
    board.innerHTML=`<h2 class="board-title">Кубики по памяти</h2><p class="board-subtitle">Раунд ${round}/${rounds}. Запомните образец, затем выберите точное совпадение.</p><div class="cube-target" id="memoryCubeTarget">${cubeGrid(target,'образец')}</div><div class="options-row">${options.map((p,i)=>`<button class="option-card" data-cube-opt="${i}">${cubeGrid(p,'вариант')}</button>`).join('')}</div><div class="feedback" id="feedback"></div>`;
    const sec=level===1?7:level===2?5:4;
    feedback(`Изучайте образец: ${sec} сек.`);
    setTimeout(()=>{ const el=document.getElementById('memoryCubeTarget'); if(el) el.innerHTML='<div class="notice">Образец скрыт. Выбирайте по памяти.</div>'; }, sec*1000);
  }
  board.innerHTML=`<h2 class="board-title">Кубики по памяти</h2><p class="board-subtitle">Нажмите «Старт», чтобы увидеть образец.</p><div class="notice purple">Образец появится на несколько секунд и исчезнет.</div><div class="feedback" id="feedback"></div>`;
  board.onclick=e=>{ const opt=e.target.closest('[data-cube-opt]'); if(!opt || needStart()) return; if(samePattern(options[Number(opt.dataset.cubeOpt)],target)){ if(round>=rounds) finishTask(); else setTimeout(makeRound,350); } else { addError(opt); feedback('Похоже, но не совпадает. Проверьте цвета и расположение.', true); } };
  return {start(){ round=0; makeRound(); }};
}

// 5. Sequence
function makeSequence(level, board){
  const len=level===1?4:level===2?6:8; const colors=COLORS.slice(0,4); let seq=[], input=[], showing=false;
  board.innerHTML=`<h2 class="board-title">Повтори последовательность</h2><p class="board-subtitle">Запомните ряд миганий и повторите его.</p><div class="sequence-pad">${colors.map(c=>`<button class="seq-btn" data-seq="${c.key}" style="background:${c.hex}"></button>`).join('')}</div><div class="feedback" id="feedback"></div>`;
  function showSeq(i=0){ if(i>=seq.length){ showing=false; feedback('Теперь повторите последовательность.'); return; } const btn=board.querySelector(`[data-seq="${seq[i]}"]`); btn.classList.add('flash'); setTimeout(()=>{ btn.classList.remove('flash'); setTimeout(()=>showSeq(i+1),260);},520); }
  board.onclick=e=>{ const b=e.target.closest('[data-seq]'); if(!b || needStart() || showing) return; input.push(b.dataset.seq); const pos=input.length-1; if(input[pos]!==seq[pos]){ addError(b); feedback('Последовательность нарушена. Начните повтор заново.', true); input=[]; return; } if(input.length===seq.length){ feedback('Последовательность повторена верно!'); finishTask(); }};
  return {start(){ seq=Array.from({length:len},()=>pick(colors).key); input=[]; showing=true; feedback('Смотрите внимательно.'); showSeq(); }};
}

// 6. Memory pairs
function makeMemoryPairs(level, board){
  const pairs=level===1?4:level===2?6:9; const cols=level===1?4:level===2?4:6; let first=null, locked=true, matched=0, shown=false;
  const base=[]; for(let i=0;i<pairs;i++){ const s=SHAPES[i%SHAPES.length].key, c=COLORS[i%COLORS.length].key; base.push({key:`${s}-${c}`,html:shapeHTML(s,c)}); }
  const cards=shuffle([...base,...base].map((x,i)=>({...x,id:i})));
  board.innerHTML=`<h2 class="board-title">Найди пару по памяти</h2><p class="board-subtitle">Карточки появятся только после старта, затем закроются.</p><div class="notice purple" id="pairNotice">Нажмите «Старт», чтобы увидеть фигуры.</div><div class="memory-grid" style="--cols:${cols}">${cards.map((c,i)=>`<button class="memory-card hidden" data-i="${i}" data-key="${c.key}">${c.html}</button>`).join('')}</div><div class="feedback" id="feedback"></div>`;
  function reveal(){ shown=true; locked=true; document.querySelectorAll('.memory-card').forEach(c=>c.classList.remove('hidden')); }
  function hide(){ locked=false; document.querySelectorAll('.memory-card:not(.matched)').forEach(c=>c.classList.add('hidden')); document.getElementById('pairNotice').textContent='Карточки скрыты. Найдите пары по памяти.'; feedback('Открывайте две карточки.'); }
  board.onclick=e=>{ const card=e.target.closest('.memory-card'); if(!card || needStart() || locked || card.classList.contains('matched') || !card.classList.contains('hidden')) return; card.classList.remove('hidden'); if(!first){ first=card; return; } locked=true; if(first.dataset.key===card.dataset.key){ first.classList.add('matched'); card.classList.add('matched'); matched++; first=null; locked=false; feedback(`Пара найдена: ${matched}/${pairs}`); if(matched===pairs) finishTask(); } else { setTimeout(()=>{ first.classList.add('hidden'); card.classList.add('hidden'); first=null; locked=false; addError(card); feedback('Не пара. Вспоминайте расположение.', true); },700); }};
  return {start(){ first=null; matched=0; locked=true; shown=false; document.querySelectorAll('.memory-card').forEach(c=>{c.classList.remove('matched'); c.classList.add('hidden');}); const sec=level===1?7:level===2?6:5; document.getElementById('pairNotice').textContent=`Изучайте открытые карточки: ${sec} сек.`; reveal(); setTimeout(hide,sec*1000); }};
}

// 7. Matrix pattern
function makeMatrixPattern(level, board){
  const rounds=level===1?3:level===2?4:5; let round=0, correct, options=[];
  function tokenHTML(item){ return `<span class="matrix-token ${item.size||''}">${shapeHTML(item.shape,item.color,'shape-token')}<b>${item.arrow?ARROWS[item.arrow]:''}</b></span>`; }
  function gen(){
    const shapes=shuffle(SHAPES.slice(0,4)).map(x=>x.key); const colors=shuffle(COLORS.slice(0,5)).map(x=>x.key); const dirs=shuffle(Object.keys(ARROWS));
    const matrix=[];
    for(let r=0;r<3;r++){
      const row=[];
      for(let c=0;c<3;c++){
        row.push({shape:shapes[(r+c)%shapes.length], color:colors[(r*2+c)%colors.length], arrow: level===1?null:dirs[(r+c)%dirs.length], size: level===3?((r+c)%2?'small':'large'):''});
      }
      matrix.push(row);
    }
    correct=matrix[2][2]; matrix[2][2]=null;
    options=[correct,{...correct,color:pick(COLORS.filter(c=>c.key!==correct.color)).key},{...correct,shape:pick(SHAPES.filter(s=>s.key!==correct.shape)).key}];
    if(level>1) options.push({...correct,arrow:OPP[correct.arrow]||pick(Object.keys(ARROWS))});
    if(level>2) options.push({...correct,size:correct.size==='small'?'large':'small'});
    options=shuffle(options);
    board.innerHTML=`<h2 class="board-title">Матрица закономерностей</h2><p class="board-subtitle">Раунд ${round}/${rounds}. Найдите недостающий элемент в правом нижнем углу.</p><div class="matrix-grid">${matrix.flat().map((it,i)=>`<div class="matrix-cell ${it?'':'blank'}">${it?tokenHTML(it):'?'}</div>`).join('')}</div><div class="options-row">${options.map((o,i)=>`<button class="option-card" data-opt="${i}">${tokenHTML(o)}</button>`).join('')}</div><div class="feedback" id="feedback"></div>`;
  }
  function next(){ round++; gen(); }
  next();
  board.onclick=e=>{ const o=e.target.closest('[data-opt]'); if(!o || needStart()) return; const val=options[Number(o.dataset.opt)]; const ok=val.shape===correct.shape && val.color===correct.color && (level===1 || val.arrow===correct.arrow) && (level<3 || val.size===correct.size); if(ok){ if(round>=rounds) finishTask(); else { feedback('Верно. Следующая матрица.'); setTimeout(next,450); } } else { addError(o); feedback('Проверьте закономерность по строкам и столбцам.', true); }};
  return {start(){ round=0; next(); feedback('Смотрите на изменение признаков в строках и столбцах.'); }};
}

// 8. Patterns
function makePatterns(level, board){
  let activeBlank=null; const rows=[]; const blanks=[];
  function token(item, cls='shape-token'){ return `<span class="pattern-token ${item.size||''}">${shapeHTML(item.shape,item.color,cls)}${item.arrow?`<b>${ARROWS[item.arrow]}</b>`:''}</span>`; }
  function makeRows(){
    const count=level===1?2:level===2?3:4;
    for(let r=0;r<count;r++){
      const a={shape:SHAPES[(r)%4].key,color:COLORS[(r)%5].key,arrow:'right',size:'large'};
      const b={shape:SHAPES[(r+1)%4].key,color:COLORS[(r+2)%5].key,arrow:'down',size:'small'};
      const c={shape:SHAPES[(r+2)%4].key,color:COLORS[(r+3)%5].key,arrow:'left',size:'large'};
      const d={shape:SHAPES[(r+3)%4].key,color:COLORS[(r+4)%5].key,arrow:'up',size:'small'};
      let seq;
      if(level===1) seq=[a,b,a,b,a,b];
      else if(level===2) seq=[a,b,c,a,b,c,a,b,c];
      else seq=[a,b,a,c,d,b,a,b,a,c,d,b];
      const blankCount=level===1?1:level===2?2:3; const positions=shuffle([...Array(seq.length).keys()].slice(2,seq.length-1)).slice(0,blankCount);
      rows.push({seq,positions}); positions.forEach(pos=>blanks.push({row:r,pos,answer:seq[pos],filled:null}));
    }
  }
  makeRows();
  const unique=[...new Map(rows.flatMap(row=>row.seq).map(x=>[`${x.shape}-${x.color}-${x.arrow}-${x.size}`,x])).values()];
  const decoys=Array.from({length:level===3?5:3},()=>({shape:pick(SHAPES).key,color:pick(COLORS).key,arrow:pick(Object.keys(ARROWS)),size:Math.random()<.5?'small':'large'}));
  const bank=shuffle([...unique,...decoys]).slice(0, level===1?6:level===2?9:12);
  board.innerHTML=`<h2 class="board-title">Продолжи закономерность</h2><p class="board-subtitle">Заполните пропуски. На сложном уровне учитывайте форму, цвет, размер и стрелку.</p>${rows.map((row,ri)=>`<div class="pattern-row">${row.seq.map((item,pos)=> row.positions.includes(pos)?`<button class="blank-slot" data-blank="${ri}-${pos}">?</button>`:`<span class="choice">${token(item)}</span>`).join('')}</div>`).join('')}<div class="choice-bank">${bank.map((x,i)=>`<button class="choice" data-choice="${i}" data-shape="${x.shape}" data-color="${x.color}" data-arrow="${x.arrow||''}" data-size="${x.size||''}">${token(x)}</button>`).join('')}</div><div class="feedback" id="feedback"></div>`;
  board.onclick=e=>{ const b=e.target.closest('[data-blank]'); if(b){ if(needStart()) return; activeBlank=b; document.querySelectorAll('.blank-slot').forEach(x=>x.classList.remove('selected')); b.classList.add('selected'); return; } const ch=e.target.closest('[data-choice]'); if(ch){ if(needStart()||!activeBlank){ feedback('Сначала выберите пустую клетку.', true); return; } const item={shape:ch.dataset.shape,color:ch.dataset.color,arrow:ch.dataset.arrow,size:ch.dataset.size}; activeBlank.innerHTML=token(item); activeBlank.classList.add('filled'); const [ri,pos]=activeBlank.dataset.blank.split('-').map(Number); const bl=blanks.find(x=>x.row===ri&&x.pos===pos); bl.filled=item; activeBlank=null; }};
  return {start(){ feedback('Заполните все пропуски и нажмите «Проверить».'); }, check(){ if(needStart()) return; const wrong=blanks.filter(b=>!b.filled || b.filled.shape!==b.answer.shape || b.filled.color!==b.answer.color || (level===3 && (b.filled.arrow!==b.answer.arrow || b.filled.size!==b.answer.size))).length; if(wrong===0) finishTask(); else { ROUTE.errors+=wrong; updateErrors(); feedback(`Есть ошибки: ${wrong}. Перепроверьте закономерность.`, true); } }};
}

// 9. Find fragment
function makeFindFragment(level, board){
  const rounds=level===1?4:level===2?5:6;
  const big=level===1?4:level===2?5:6;
  const frag=level===3?3:2;
  let round=0, grid=[], target=[], pos={r:0,c:0};
  function fullGrid(n){return Array.from({length:n},()=>Array.from({length:n},()=>rand(CUBE_COLORS.length)));}
  function crop(g,r,c,size){return Array.from({length:size},(_,rr)=>Array.from({length:size},(_,cc)=>g[r+rr][c+cc]));}
  function renderGrid(g){
    return `<div class="fragment-grid" style="--size:${g.length}">${g.flat().map((v,i)=>`<button class="fragment-cell" data-r="${Math.floor(i/g.length)}" data-c="${i%g.length}">${cubeCell(v)}</button>`).join('')}</div>`;
  }
  function next(){
    round++;
    grid=fullGrid(big);
    pos={r:rand(big-frag+1), c:rand(big-frag+1)};
    target=crop(grid,pos.r,pos.c,frag);
    board.innerHTML=`<h2 class="board-title">Фрагмент в поле</h2><p class="board-subtitle">Раунд ${round}/${rounds}. Найдите этот фрагмент в большом поле и нажмите его верхний левый кубик.</p><div class="fragment-layout"><div><h3>Фрагмент</h3><div class="cube-target" id="fragmentTarget">${cubeGrid(target,'фрагмент')}</div></div><div><h3>Большое поле</h3>${renderGrid(grid)}</div></div><div class="feedback" id="feedback"></div>`;
    if(level===2){ feedback('Сравнивайте фрагмент с полем. Варианты похожи.'); }
    if(level===3){ feedback('Изучайте фрагмент: через 5 секунд он скроется.'); setTimeout(()=>{ const el=document.getElementById('fragmentTarget'); if(el) el.innerHTML='<div class="notice">Фрагмент скрыт.</div>'; },5000); }
  }
  board.innerHTML=`<h2 class="board-title">Фрагмент в поле</h2><p class="board-subtitle">Нажмите «Старт», чтобы получить фрагмент и большое поле.</p><div class="notice purple">Задача проверяет точность зрительного поиска.</div><div class="feedback" id="feedback"></div>`;
  board.onclick=e=>{
    const cell=e.target.closest('.fragment-cell'); if(!cell || needStart()) return;
    const r=Number(cell.dataset.r), c=Number(cell.dataset.c);
    if(r===pos.r && c===pos.c){ cell.classList.add('selected'); if(round>=rounds) finishTask(); else { feedback('Верно. Следующий фрагмент.'); setTimeout(next,450); } }
    else { addError(cell); feedback('Это не верхний левый кубик нужного фрагмента.', true); }
  };
  return {start(){ round=0; next(); }};
}

// 10. Mirror
function makeMirror(level, board){
  let target, mirror, options, round=0; const rounds=level===1?4:level===2?6:8;
  function newRound(){
    const size=level===1?3:level===2?4:4; target=makePattern(size, level===1?4:level===2?6:8); mirror=mirrorPattern(target);
    options=[mirror, rotatePattern(target), rotatePattern(rotatePattern(target)), mutatePattern(mirror), rotatePattern(mirror)];
    if(level===3) options.push(mutatePattern(rotatePattern(target)));
    options=shuffle(options);
    board.innerHTML=`<h2 class="board-title">Зеркало или поворот?</h2><p class="board-subtitle">Раунд ${round}/${rounds}. Выберите именно зеркальное отражение. Повороты — ловушки.</p><div class="cube-target" id="mirrorTarget">${cubeGrid(target,'образец')}</div><div class="options-row">${options.map((p,i)=>`<button class="option-card" data-opt="${i}">${cubeGrid(p,'вариант')}</button>`).join('')}</div><div class="feedback" id="feedback"></div>`;
    if(level===3){ setTimeout(()=>{ const el=document.getElementById('mirrorTarget'); if(el) el.innerHTML='<div class="notice">Образец скрыт. Вспомните зеркало.</div>'; },4000); }
  }
  function next(){ round++; newRound(); }
  next();
  board.onclick=e=>{ const o=e.target.closest('[data-opt]'); if(!o || needStart()) return; if(samePattern(options[Number(o.dataset.opt)], mirror)){ if(round>=rounds) finishTask(); else { feedback('Верно. Следующий раунд.'); setTimeout(next,450); } } else { addError(o); feedback('Это поворот или изменённая фигура, а нужно зеркало.', true); }};
  return {start(){ round=0; next(); feedback('Сравните левую и правую стороны образца.'); }};
}

// 11. Cube rotate
function makeCubeRotate(level, board){
  let target, correct, options, correctIndex;
  function setup(){
    const size=level===1?3:level===2?4:4; target=makePattern(size, level===1?4:level===2?7:8); correct=rotatePattern(target); options=[correct, mirrorPattern(target), rotatePattern(mirrorPattern(target)), mutatePattern(correct)]; if(level===3) options.push(rotatePattern(rotatePattern(target))); options=shuffle(options); correctIndex=options.findIndex(o=>samePattern(o,correct));
    board.innerHTML=`<h2 class="board-title">Поворот кубиков</h2><p class="board-subtitle">Найдите фигуру, повернутую на 90°. Зеркало не подходит.</p><div class="cube-target">${cubeGrid(target,'образец')}</div><div class="options-row">${options.map((p,i)=>`<button class="option-card" data-opt="${i}">${cubeGrid(p,'вариант')}</button>`).join('')}</div><div class="feedback" id="feedback"></div>`;
  }
  setup();
  board.onclick=e=>{ const o=e.target.closest('[data-opt]'); if(!o || needStart()) return; if(samePattern(options[Number(o.dataset.opt)], correct)){ feedback('Это правильный поворот.'); finishTask(); } else { addError(o); feedback('Это зеркало или изменённая фигура. Ищите поворот.', true); }};
  return {start(){ feedback('Сравните форму и цвета после мысленного поворота.'); }};
}

// 12. Fast decision
function makeFastDecision(level, board){
  const rounds=level===1?14:level===2?18:24; let round=0, current;
  function makeCard(){
    const number=1+rand(24), shape=pick(SHAPES).key, color=pick(COLORS).key, framed=Math.random()<.5, star=Math.random()<.35, dot=Math.random()<.3;
    let criterion;
    if(level===1) criterion=number<10?'shape':'color';
    else if(level===2) criterion=framed?'color':(number%2===0?'shape':'color');
    else { criterion=number%2===0?'shape':'color'; if(star) criterion=criterion==='shape'?'color':'shape'; if(dot) criterion='shape'; if(framed && number>=12) criterion='color'; }
    current={number,shape,color,framed,star,dot,criterion,correct:criterion==='shape'?shape:color};
  }
  function renderCard(){ makeCard(); round++; const rule=level===1?'Число < 10 — ФОРМА, число ≥ 10 — ЦВЕТ':level===2?'Рамка — ЦВЕТ. Без рамки: чётное — ФОРМА, нечётное — ЦВЕТ':'Чётное — ФОРМА, нечётное — ЦВЕТ. ★ меняет правило, • всегда ФОРМА, рамка + число ≥12 = ЦВЕТ.';
    board.innerHTML=`<h2 class="board-title">Быстрое решение</h2><p class="board-subtitle">${rule}</p><div class="rounds">Раунд ${round}/${rounds}</div><div class="card-cell ${current.framed?'selected':''}" style="width:240px;height:180px">${current.star?'<b style="position:absolute;right:14px;top:10px;color:var(--gold);font-size:30px">★</b>':''}${current.dot?'<b style="position:absolute;right:52px;top:10px;color:var(--purple);font-size:30px">•</b>':''}<span class="mini-num" style="font-size:24px">${current.number}</span>${shapeHTML(current.shape,current.color)}</div><div class="answer-grid compact-answers">${[...SHAPES.map(s=>({key:s.key,name:s.name})),...COLORS.map(c=>({key:c.key,name:c.name}))].map(a=>`<button class="answer-btn" data-answer="${a.key}">${a.name}</button>`).join('')}</div><div class="feedback" id="feedback"></div>`; }
  renderCard();
  board.onclick=e=>{ const ans=e.target.closest('[data-answer]'); if(!ans || needStart()) return; if(ans.dataset.answer===current.correct){ if(round>=rounds) finishTask(); else renderCard(); } else { addError(ans); feedback(`Критерий сейчас: ${current.criterion==='shape'?'форма':'цвет'}.`, true); }};
  return {start(){ round=0; renderCard(); feedback('Отвечайте быстро, но сначала проверьте правило.'); }};
}

// 13. Target match
function makeTargetMatch(level, board){
  const rounds=level===1?4:level===2?5:6; let round=0, target, options=[];
  function makeItem(){return {shape:pick(SHAPES).key,color:pick(COLORS).key,arrow:pick(Object.keys(ARROWS)),size:Math.random()<.5?'small':'large',num:1+rand(20)};}
  function token(it){return `<span class="match-token ${it.size}">${shapeHTML(it.shape,it.color,'shape-token')}<b>${level>1?ARROWS[it.arrow]:''}</b><em>${level>2?it.num:''}</em></span>`;}
  function same(a,b){ return a.shape===b.shape && a.color===b.color && (level===1 || a.arrow===b.arrow) && (level<3 || (a.size===b.size && (a.num%2)===(b.num%2))); }
  function next(){
    round++; target=makeItem();
    options=[target,{...target,color:pick(COLORS.filter(c=>c.key!==target.color)).key},{...target,shape:pick(SHAPES.filter(x=>x.key!==target.shape)).key},{...target,arrow:OPP[target.arrow]},{...target,size:target.size==='small'?'large':'small'},{...target,num:target.num+1}];
    while(options.length<(level===1?9:level===2?12:16)) options.push(makeItem());
    options=shuffle(options);
    if(!options.some(o=>same(o,target))) options[0]=target;
    options=shuffle(options);
    const rule=level===1?'Ищем точное совпадение по форме и цвету.':level===2?'Ищем совпадение по форме, цвету и направлению стрелки.':`Ищем форму + цвет + стрелку + размер. Число должно быть той же чётности: ${target.num%2===0?'чётное':'нечётное'}.`;
    board.innerHTML=`<h2 class="board-title">Найди образец</h2><p class="board-subtitle">Раунд ${round}/${rounds}. ${rule}</p><div class="cube-target" id="matchTarget">${token(target)}</div><div class="match-grid" style="--cols:${level===1?3:level===2?4:4}">${options.map((it,i)=>`<button class="match-card" data-match="${i}">${token(it)}</button>`).join('')}</div><div class="feedback" id="feedback"></div>`;
    if(level===3){ feedback('Изучайте образец: через 4 секунды он скроется.'); setTimeout(()=>{ const el=document.getElementById('matchTarget'); if(el) el.innerHTML='<div class="notice">Образец скрыт.</div>'; },4000); }
  }
  board.innerHTML=`<h2 class="board-title">Найди образец</h2><p class="board-subtitle">Нажмите «Старт», чтобы увидеть образец и поле выбора.</p><div class="notice purple">Это замена сортировки: только поиск, выбор и автоматическая проверка.</div><div class="feedback" id="feedback"></div>`;
  board.onclick=e=>{ const card=e.target.closest('[data-match]'); if(!card || needStart()) return; if(same(options[Number(card.dataset.match)],target)){ if(round>=rounds) finishTask(); else { feedback('Верно. Следующий образец.'); setTimeout(next,450); } } else { addError(card); feedback('Похоже, но не совпадает с правилом этого уровня.', true); } };
  return {start(){ round=0; next(); }};
}

// 14. Build cubes
function makeBuildCubes(level, board){
  const size=level===1?3:level===2?4:4, blocks=level===1?4:level===2?7:9; let target=makePattern(size,blocks), selectedColor=0, user=Array.from({length:size},()=>Array.from({length:size},()=>null));
  function render(){
    board.innerHTML=`<h2 class="board-title">Собери кубики</h2><p class="board-subtitle">Повторите образец в пустой сетке. Выберите цвет и нажимайте клетки.</p><div class="build-area"><div><h3>Образец</h3><div class="cube-target" id="buildTarget">${cubeGrid(target,'образец')}</div></div><div><h3>Ваша сетка</h3><div class="build-grid" style="--size:${size}">${user.flat().map((v,i)=>`<button class="build-cell" data-i="${i}">${cubeCell(v)}</button>`).join('')}</div></div></div><div class="palette">${CUBE_COLORS.map((c,i)=>`<button class="palette-color ${i===selectedColor?'selected':''}" data-color-index="${i}" style="background:${c}"></button>`).join('')}<button class="btn small ghost" data-erase="1">Ластик</button></div><div class="feedback" id="feedback"></div>`;
    if(level===3 && ROUTE.started){ setTimeout(()=>{ const el=document.getElementById('buildTarget'); if(el) el.innerHTML='<div class="notice">Образец скрыт.</div>'; },5500); }
  }
  render();
  board.onclick=e=>{
    const pal=e.target.closest('[data-color-index]'); if(pal){ selectedColor=Number(pal.dataset.colorIndex); document.querySelectorAll('.palette-color').forEach(x=>x.classList.remove('selected')); pal.classList.add('selected'); return; }
    if(e.target.closest('[data-erase]')){ selectedColor=null; document.querySelectorAll('.palette-color').forEach(x=>x.classList.remove('selected')); return; }
    const cell=e.target.closest('[data-i]'); if(cell){ if(needStart()) return; const i=Number(cell.dataset.i), r=Math.floor(i/size), c=i%size; user[r][c]=selectedColor; cell.innerHTML=cubeCell(selectedColor); }
  };
  return {start(){ user=Array.from({length:size},()=>Array.from({length:size},()=>null)); render(); feedback(level===3?'Изучите образец: он скоро скроется.':'Соберите такую же комбинацию.'); }, check(){ if(needStart()) return; const wrong=user.flat().filter((v,i)=>v!==target.flat()[i]).length; if(wrong===0) finishTask(); else { ROUTE.errors+=wrong; updateErrors(); feedback(`Отличается клеток: ${wrong}. Исправьте и проверьте снова.`, true); } }};
}

// 15. Final mix
function makeFinalMix(level, board){
  const rounds=level===1?12:level===2?16:20; let round=0, current;
  function answerButtons(list){ return `<div class="answer-grid compact-answers">${list.map(a=>`<button class="answer-btn" data-answer="${a.key}">${a.name}</button>`).join('')}</div>`; }
  function token(item){ return `<span class="matrix-token ${item.size||''}">${shapeHTML(item.shape,item.color,'shape-token')}<b>${item.arrow?ARROWS[item.arrow]:''}</b></span>`; }
  function next(){
    round++;
    const pool=level===1?['stroop','shape','compare','pattern']:level===2?['stroop','shape','compare','pattern','mirror','target']:['stroop','shape','compare','pattern','mirror','target','cube'];
    const type=pick(pool);
    if(type==='stroop'){
      const word=pick(COLORS), ink=pick(COLORS), framed=level>1 && Math.random()<.45;
      current={correct:framed?word.key:ink.key, rule:framed?'Рамка: выберите ЗНАЧЕНИЕ слова.':'Без рамки: выберите ЦВЕТ написания.', html:`<div class="stroop-word ${framed?'framed':''}" style="color:${ink.hex};font-size:54px">${word.name}</div>`, buttons:COLORS.map(c=>({key:c.key,name:c.name}))};
    }
    if(type==='shape'){
      const shape=pick(SHAPES).key, color=pick(COLORS).key, num=1+rand(20), star=level===3 && Math.random()<.5;
      const criterion=star?'color':(num%2===0?'shape':'color');
      current={correct:criterion==='shape'?shape:color, rule:`${num%2===0?'Чётное число: выберите ФОРМУ.':'Нечётное число: выберите ЦВЕТ.'}${star?' ★ меняет ответ на ЦВЕТ.':''}`, html:`<div class="card-cell" style="width:190px;height:145px">${star?'<b style="position:absolute;right:15px;top:8px;color:var(--gold);font-size:28px">★</b>':''}<span class="mini-num">${num}</span>${shapeHTML(shape,color)}</div>`, buttons:[...SHAPES.map(s=>({key:s.key,name:s.name})),...COLORS.map(c=>({key:c.key,name:c.name}))]};
    }
    if(type==='compare'){
      const a=rand(18)+2,b=rand(18)+2, op=pick(['>','<','+']);
      let html, ok;
      if(op==='+'){ const sum=a+b, shown=sum+(Math.random()<.5?0:pick([-2,-1,1,2])); ok=sum===shown; html=`${a} + ${b} = ${shown}`; }
      else { ok=op==='>'?a>b:a<b; html=`${a} ${op} ${b}`; }
      current={correct:ok?'yes':'no', rule:'Оцените выражение: верно или нет?', html:`<div class="stroop-word" style="font-size:52px;color:var(--navy)">${html}</div>`, buttons:[{key:'yes',name:'ДА'},{key:'no',name:'НЕТ'}]};
    }
    if(type==='pattern'){
      const a={shape:'circle',color:'purple'}, b={shape:'square',color:'green'}, c={shape:'triangle',color:'blue'};
      const seq=level===1?[a,b,a,b,a]:level===2?[a,b,c,a,b,c,a]:[a,b,a,c,a,b,a,c,a];
      const answer=level===1?b:level===2?b:b;
      const opts=shuffle([answer,{shape:'diamond',color:'purple'},{shape:'star',color:'green'},{shape:answer.shape,color:'red'}]);
      current={correct:String(opts.findIndex(o=>o.shape===answer.shape&&o.color===answer.color)), rule:'Продолжите закономерность.', html:`<div class="pattern-row">${seq.map(x=>`<span class="choice">${token(x)}</span>`).join('')}<span class="blank-slot filled">?</span></div><div class="options-row">${opts.map((o,i)=>`<button class="option-card mini-option" data-answer="${i}">${token(o)}</button>`).join('')}</div>`, buttons:null};
    }
    if(type==='mirror'){
      const t=makePattern(level===3?4:3, level===3?7:5), mir=mirrorPattern(t); const opts=shuffle([mir,rotatePattern(t),mutatePattern(mir),rotatePattern(mir)]);
      current={correct:String(opts.findIndex(o=>samePattern(o,mir))), rule:'Выберите зеркальное отражение образца.', html:`<div class="cube-target">${cubeGrid(t,'образец')}</div><div class="options-row">${opts.map((p,i)=>`<button class="option-card mini-option" data-answer="${i}">${cubeGrid(p,'вариант')}</button>`).join('')}</div>`, buttons:null};
    }
    if(type==='target'){
      const target={shape:pick(SHAPES).key,color:pick(COLORS).key,arrow:pick(Object.keys(ARROWS))};
      const opts=shuffle([target,{...target,color:pick(COLORS.filter(c=>c.key!==target.color)).key},{...target,shape:pick(SHAPES.filter(s=>s.key!==target.shape)).key},{...target,arrow:OPP[target.arrow]}]);
      current={correct:String(opts.findIndex(o=>o.shape===target.shape&&o.color===target.color&&o.arrow===target.arrow)), rule:'Найдите точное совпадение по форме, цвету и стрелке.', html:`<div class="cube-target">${token(target)}</div><div class="options-row">${opts.map((o,i)=>`<button class="option-card mini-option" data-answer="${i}">${token(o)}</button>`).join('')}</div>`, buttons:null};
    }
    if(type==='cube'){
      const t=makePattern(3,5), opts=shuffle([t,mutatePattern(t),mirrorPattern(t),rotatePattern(t)]);
      current={correct:String(opts.findIndex(o=>samePattern(o,t))), rule:'Найдите точное совпадение с кубиками. Поворот и зеркало не подходят.', html:`<div class="cube-target">${cubeGrid(t,'образец')}</div><div class="options-row">${opts.map((p,i)=>`<button class="option-card mini-option" data-answer="${i}">${cubeGrid(p,'вариант')}</button>`).join('')}</div>`, buttons:null};
    }
    board.innerHTML=`<h2 class="board-title">Финальный микс</h2><p class="board-subtitle">${current.rule}</p><div class="rounds">Раунд ${round}/${rounds}</div>${current.html}${current.buttons?answerButtons(current.buttons):''}<div class="feedback" id="feedback"></div>`;
  }
  board.innerHTML=`<h2 class="board-title">Финальный микс</h2><p class="board-subtitle">Нажмите «Старт». Вас ждёт серия разных правил: цвет, форма, кубики, зеркало, закономерности и сравнение.</p><div class="notice purple">Задание стало более разнообразным и ближе к итоговой тренировке.</div><div class="feedback" id="feedback"></div>`;
  board.onclick=e=>{ const ans=e.target.closest('[data-answer]'); if(!ans || needStart()) return; if(ans.dataset.answer===current.correct){ if(round>=rounds) finishTask(); else next(); } else { addError(ans); feedback('Проверьте текущее правило: оно меняется от раунда к раунду.', true); } };
  return {start(){ round=0; next(); feedback('Читайте правило каждого раунда перед ответом.'); }};
}

// init
(function init(){
  const h=location.hash.replace('#','');
  if(h.startsWith('task-')){ const id=Number(h.split('-')[1]); if(tasks.find(t=>t.id===id)){ ROUTE.view='task'; ROUTE.taskId=id; render(); return; } }
  if(['tasks','progress'].includes(h)) ROUTE.view=h;
  render();
})();
