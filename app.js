// Mis Finanzas - lógica de la app
const CATS=["Vivienda","Servicios","Comida","Transporte","Salud","Educación","Entretenimiento","Ropa","Suscripciones","Deudas","Ahorro","Otros"];
const INCATS=["Salario extra","Freelance","Ventas","Bonificación","Intereses","Otros"];
/* [id, nombre, nombre corto para la barra inferior]. En el celular solo las 4 primeras van a la vista; el resto, en "Más". */
const TABS=[["resumen","Resumen"],["movimientos","Movimientos"],["presupuestos","Presupuestos"],["metas","Metas de ahorro","Metas"],["fijos","Pagos fijos"],["deudas","Deudas"],["historial","Historial"],["logros","Rachas y logros","Logros"]];
const MORE=["fijos","deudas","historial","logros"];
const ICONS={
  resumen:'<path d="M4 11l8-7 8 7v8a1 1 0 0 1-1 1h-4v-6H9v6H5a1 1 0 0 1-1-1z"/>',
  movimientos:'<path d="M7 4v14m0 0l-3-3m3 3l3-3M17 20V6m0 0l-3 3m3-3l3 3"/>',
  presupuestos:'<path d="M21 12A9 9 0 1 1 12 3"/><path d="M12 3v9h9"/>',
  metas:'<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1"/>',
  fijos:'<rect x="4" y="5" width="16" height="15" rx="2"/><path d="M4 10h16M9 3v4M15 3v4"/>',
  deudas:'<rect x="3" y="6" width="18" height="13" rx="2"/><path d="M3 10h18M7 15h4"/>',
  historial:'<path d="M5 20V10M12 20V4M19 20v-7"/>',
  mas:'<circle cx="5" cy="12" r="1.4"/><circle cx="12" cy="12" r="1.4"/><circle cx="19" cy="12" r="1.4"/>',
  rail:'<path d="M15 6l-6 6 6 6"/>',
  flame:'<path d="M8.500 14.500A2.500 2.500 0 0 0 11 12c0-1.380-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.500 2 4.900 4 6.500 2 1.600 3 3.500 3 5.500a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.500 2.500 0 0 0 2.500 2.500z"/>',
  star:'<path d="M12 3.500l2.600 5.400 5.900.8-4.300 4.200 1 5.900L12 16.900 6.800 19.800l1-5.900-4.300-4.200 5.900-.8z"/>',
  check:'<path d="M5 12.500l4.500 4.500L19 7.500"/>',
  coin:'<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="4.500"/>',
  plane:'<path d="M17.800 19.200L16 11l3.500-3.500C21 6 21.500 4 21 3c-1-.5-3 0-4.500 1.500L13 8 4.800 6.200c-.5-.1-.9.1-1.100.5l-.3.5c-.2.5-.1 1 .3 1.300L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.500 5.300c.3.4.8.5 1.300.3l.5-.2c.4-.3.6-.7.5-1.200z"/>',
  home:'<path d="M3 11l9-8 9 8v9a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z"/>',
  car:'<path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.700-1.500-1.900C18.700 10.600 16 10 16 10s-1.300-1.400-2.200-2.300c-.5-.4-1.100-.7-1.800-.7H5c-.6 0-1.100.4-1.400.9l-1.400 2.900A3.700 3.700 0 0 0 2 12v4c0 .6.4 1 1 1h2"/><circle cx="7" cy="17" r="2"/><path d="M9 17h6"/><circle cx="17" cy="17" r="2"/>',
  book:'<path d="M4 19.500A2.500 2.500 0 0 1 6.500 17H20"/><path d="M6.500 2H20v20H6.500A2.500 2.500 0 0 1 4 19.500v-15A2.500 2.500 0 0 1 6.500 2z"/>',
  phone:'<rect x="6" y="2" width="12" height="20" rx="3"/><path d="M11 18h2"/>',
  shield:'<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>',
  gift:'<path d="M20 12v10H4V12"/><path d="M2 7h20v5H2z"/><path d="M12 22V7"/><path d="M12 7H7.500a2.500 2.500 0 0 1 0-5C11 2 12 7 12 7z"/><path d="M12 7h4.500a2.500 2.500 0 0 0 0-5C13 2 12 7 12 7z"/>',
  heart:'<path d="M19 14c1.490-1.460 3-3.210 3-5.500A5.500 5.500 0 0 0 16.500 3c-1.760 0-3 .5-4.500 2-1.500-1.500-2.740-2-4.500-2A5.500 5.500 0 0 0 2 8.500c0 2.300 1.500 4.050 3 5.500l7 7z"/>',
  up:'<path d="M12 19V5m0 0l-6 6m6-6l6 6"/>',
  down:'<path d="M12 5v14m0 0l-6-6m6 6l6-6"/>',
  plus:'<path d="M12 5v14M5 12h14"/>'
};
/* menú lateral de computadora: expandido o contraído (solo íconos); se recuerda en este dispositivo */
try{if(localStorage.getItem("fin.rail")==="1")document.documentElement.classList.add("rail");}catch(e){}
ICONS.logros=ICONS.flame;
/* íconos y colores que se pueden elegir para cada meta de ahorro */
const GOAL_ICONS=["metas","plane","home","car","book","phone","shield","gift","heart"];
const GOAL_COLORS=["#2f5bea","#1e8e5a","#d6336c","#d97706","#7a5cfa","#0e8f9c"];
const svg=k=>`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICONS[k]}</svg>`;
let sb=null, uid=null, ready=false, offline=false, pending=0;
let cfg=defCfg(), months={};
const today=new Date();
let cur=mk(today), tab="resumen", movTipo="gasto", pendingRender=false;
try{const t=localStorage.getItem("fin.tab"); if(t&&TABS.some(x=>x[0]===t)) tab=t; if(localStorage.getItem("fin.mov")==="ingreso") movTipo="ingreso";}catch(e){}

function defCfg(){return {salario:0,fijos:[],presupuestos:{},metas:[],deudas:[],perfil:{nombre:"",apodo:"",telefono:"",nacimiento:"",ciudad:"",foto:"",omitido:false},apariencia:{tema:"auto",paleta:"azul",acento:""},categorias:{gasto:[],ingreso:[],ocultas:[]},widgets:{orden:[]},logros:{vistos:[],libres:[],init:false}};}
function mk(d){return d.getFullYear()+"-"+String(d.getMonth()+1).padStart(2,"0");}
function shift(k,n){const [y,m]=k.split("-").map(Number);return mk(new Date(y,m-1+n,1));}
function mName(k,short){const [y,m]=k.split("-").map(Number);return new Date(y,m-1,1).toLocaleDateString("es-CO",short?{month:"short"}:{month:"long",year:"numeric"});}
const money=n=>new Intl.NumberFormat("es-CO",{style:"currency",currency:"COP",maximumFractionDigits:0}).format(Math.round(n||0));
const esc=s=>String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const uidv=()=>Date.now().toString(36)+Math.random().toString(36).slice(2,7);
const sum=a=>a.reduce((s,x)=>s+(+x||0),0);
const num=v=>{const n=parseFloat(String(v).replace(/[^\d.,-]/g,"").replace(/\./g,"").replace(",","."));return isFinite(n)?n:0;};
function month(k){const m=months[k];return m?{movs:m.movs||[],pagados:m.pagados||{},salario:m.salario,fijosTotal:m.fijosTotal,salarioMes:m.salarioMes}:{movs:[],pagados:{}};}

function totals(k){
  const m=month(k), live=k===mk(today)||k>mk(today)||m.salario===undefined;
  const salario=(m.salarioMes!=null)?(+m.salarioMes||0):live?(+cfg.salario||0):(+m.salario||0);
  const fijos=live?sum(cfg.fijos.map(f=>f.monto)):(+m.fijosTotal||0);
  const extra=sum(m.movs.filter(x=>x.tipo==="ingreso").map(x=>x.monto));
  const gastos=sum(m.movs.filter(x=>x.tipo==="gasto").map(x=>x.monto));
  const ahorro=sum(m.movs.filter(x=>x.tipo==="ahorro").map(x=>x.monto));
  const ingresos=salario+extra, egresos=fijos+gastos+ahorro;
  return {salario,extra,ingresos,fijos,gastos,ahorro,egresos,disp:ingresos-egresos};
}
function spentByCat(k){
  const m=month(k), o={};
  cfg.fijos.forEach(f=>{o[f.cat]=(o[f.cat]||0)+(+f.monto||0);});
  m.movs.filter(x=>x.tipo!=="ingreso").forEach(x=>{o[x.cat]=(o[x.cat]||0)+(+x.monto||0);});
  return o;
}

/* ---------- persistencia (Supabase) ---------- */
const TABLE="finanzas_docs";
const queues={};
function write(docId,data){
  if(!sb||!uid){toast("Inicia sesión para guardar.");return Promise.resolve();}
  const owner=uid;pending++;
  const p=(queues[docId]||Promise.resolve()).then(async()=>{
    const {error}=await sb.from(TABLE).upsert({user_id:owner,doc_id:docId,data,updated_at:new Date().toISOString()});
    if(error)throw error;
  }).catch(()=>toast("No se pudo guardar el cambio. Revisa tu conexión e inténtalo de nuevo.")).finally(()=>{pending--;});
  queues[docId]=p;return p;
}
function saveCfg(){const p=write("config",JSON.parse(JSON.stringify(cfg)));setTimeout(checkLogros,0);return p;}
function saveMonth(k){
  const m=month(k);
  const body={movs:m.movs,pagados:m.pagados,salario:+cfg.salario||0,fijosTotal:sum(cfg.fijos.map(f=>f.monto))};
  if(m.salarioMes!=null)body.salarioMes=m.salarioMes;
  if(k<mk(today)&&months[k]&&months[k].salario!==undefined){body.salario=months[k].salario;body.fijosTotal=months[k].fijosTotal;}
  months[k]=body;
  const p=write("m-"+k,JSON.parse(JSON.stringify(body)));setTimeout(checkLogros,0);
  return p;
}
async function loadAll(){
  const who=uid;
  const {data,error}=await sb.from(TABLE).select("doc_id,data");
  if(who!==uid)return;
  if(error){offline=true;render();return;}
  const c=defCfg(), ms={};
  (data||[]).forEach(r=>{if(r.doc_id==="config")Object.assign(c,cleanCfg(r.data||{}));else if(/^m-\d{4}-\d{2}$/.test(r.doc_id))ms[r.doc_id.slice(2)]=cleanMonth(r.data||{});});
  cfg=c;months=ms;offline=false;ready=true;applyLook();render();maybeWelcome();loadPending();checkLogros();
}

/* ---------- validación de datos leídos ---------- */
const safeId=v=>/^[a-z0-9]{1,40}$/i.test(String(v??""))?String(v):uidv();
const n0=v=>{v=+v;return isFinite(v)?v:0;};
const str=(v,max=120)=>String(v??"").slice(0,max);
const arr=v=>Array.isArray(v)?v:[];
function cleanPerfil(p){
  p=p&&typeof p==="object"?p:{};
  const foto=typeof p.foto==="string"&&p.foto.length<=60000&&/^data:image\/jpeg;base64,[A-Za-z0-9+\/=]+$/.test(p.foto)?p.foto:"";
  return {nombre:str(p.nombre,60),apodo:str(p.apodo,30),telefono:str(p.telefono,20),
    nacimiento:/^\d{4}-\d{2}-\d{2}$/.test(p.nacimiento)?p.nacimiento:"",ciudad:str(p.ciudad,60),foto,omitido:p.omitido===true};
}
function cleanApariencia(a){
  a=a&&typeof a==="object"?a:{};
  const hex=/^#[0-9a-f]{6}$/i.test(a.acento)?a.acento.toLowerCase():"";
  const paleta=PALETAS.some(p=>p[0]===a.paleta)?a.paleta:(a.paleta==="personal"&&hex?"personal":"azul");
  return {tema:["auto","claro","oscuro"].includes(a.tema)?a.tema:"auto",paleta,acento:hex};
}
/* categorías propias: nombres únicos (sin repetir las de base), hasta 30 por tipo; "ocultas" solo afecta a los formularios */
function cleanCategorias(c){
  c=c&&typeof c==="object"?c:{};
  const seen=new Set([...CATS,...INCATS].map(s=>s.toLowerCase()));
  const clean=a=>{const out=[];arr(a).forEach(v=>{const n=String(v??"").replace(/[\u0000-\u001f<>]/g,"").replace(/\s+/g," ").trim().slice(0,30);
    if(n.length>=2&&!seen.has(n.toLowerCase())&&out.length<30){seen.add(n.toLowerCase());out.push(n);}});return out;};
  const gasto=clean(c.gasto),ingreso=clean(c.ingreso),all=new Set([...CATS,...INCATS,...gasto,...ingreso]);
  const ocultas=arr(c.ocultas).map(v=>String(v??"")).filter((v,i,a)=>all.has(v)&&v!=="Otros"&&v!=="Ahorro"&&a.indexOf(v)===i).slice(0,80);
  return {gasto,ingreso,ocultas};
}
function cleanLogros(l){
  l=l&&typeof l==="object"?l:{};
  return {vistos:arr(l.vistos).map(v=>String(v??"")).filter((id,i,a)=>LOGROS.some(x=>x[0]===id)&&a.indexOf(id)===i),
    libres:arr(l.libres).map(v=>String(v??"")).filter(s=>/^\d{4}-\d{2}-\d{2}$/.test(s)).slice(-120),init:l.init===true};
}
function cleanCfg(c){
  const categorias=cleanCategorias(c.categorias);
  const pres={};Object.entries(c.presupuestos&&typeof c.presupuestos==="object"?c.presupuestos:{}).forEach(([k,v])=>{if(CATS.includes(k)||categorias.gasto.includes(k))pres[k]=n0(v);});
  return {salario:n0(c.salario),presupuestos:pres,perfil:cleanPerfil(c.perfil),apariencia:cleanApariencia(c.apariencia),categorias,
    widgets:{orden:arr(c.widgets&&c.widgets.orden).map(v=>String(v??"")).filter((id,i,a)=>BLOCK_DEFAULT.includes(id)&&a.indexOf(id)===i)},
    logros:cleanLogros(c.logros),
    fijos:arr(c.fijos).map(f=>({id:safeId(f.id),nombre:str(f.nombre),monto:n0(f.monto),cat:str(f.cat,40),dia:Math.min(31,Math.max(0,parseInt(f.dia)||0))||null})),
    metas:arr(c.metas).map(g=>({id:safeId(g.id),nombre:str(g.nombre),objetivo:n0(g.objetivo),ahorrado:n0(g.ahorrado),fecha:/^\d{4}-\d{2}$/.test(g.fecha)?g.fecha:"",
      icono:GOAL_ICONS.includes(g.icono)?g.icono:"metas",color:GOAL_COLORS.includes(g.color)?g.color:"",redondeo:[500,1000,5000].includes(+g.redondeo)?+g.redondeo:0})),
    deudas:arr(c.deudas).map(d=>({id:safeId(d.id),nombre:str(d.nombre),saldo:n0(d.saldo),inicial:n0(d.inicial),cuota:n0(d.cuota),tasa:str(d.tasa,10)}))};
}
function cleanMonth(m){
  const o={movs:arr(m.movs).map(x=>{const r={id:safeId(x.id),tipo:["gasto","ingreso","ahorro"].includes(x.tipo)?x.tipo:"gasto",monto:n0(x.monto),cat:str(x.cat,40),desc:str(x.desc),fecha:/^\d{4}-\d{2}-\d{2}$/.test(x.fecha)?x.fecha:""};
      if(x.metaId)r.metaId=safeId(x.metaId);if(x.deudaId)r.deudaId=safeId(x.deudaId);if(x.esp===true&&r.tipo==="gasto")r.esp=true;if(x.red===true&&r.tipo==="ahorro")r.red=true;return r;}),pagados:{}};
  Object.keys(m.pagados&&typeof m.pagados==="object"?m.pagados:{}).forEach(k=>{if(/^[a-z0-9]{1,40}$/i.test(k))o.pagados[k]=true;});
  if(m.salario!=null)o.salario=n0(m.salario);if(m.fijosTotal!=null)o.fijosTotal=n0(m.fijosTotal);if(m.salarioMes!=null)o.salarioMes=n0(m.salarioMes);
  return o;
}

/* ---------- render ---------- */
function renderTabs(){
  const cur_=id=>id===tab?' aria-current="page"':"";
  const railOn=document.documentElement.classList.contains("rail");
  document.getElementById("tabs").innerHTML=`<div class="side-brand" aria-hidden="true"><span class="sb-full">Mis Finanzas</span><span class="sb-mini">MF</span></div>`
    +TABS.map(([id,l,s])=>`<button class="tab" type="button" data-act="tab" data-id="${id}" data-grp="${MORE.includes(id)?"more":"main"}" title="${l}" aria-label="${l}"${cur_(id)}>${svg(id)}<span class="lb-long">${l}</span><span class="lb-short">${s||l}</span>${id==="resumen"&&pend.length?`<i class="badge" aria-hidden="true"></i>`:""}</button>`).join("")
    +`<button class="tab more-btn" type="button" data-act="more" aria-haspopup="dialog"${MORE.includes(tab)?' aria-current="page"':""}>${svg("mas")}<span class="lb-short">Más</span></button>`
    +`<button class="tab collapse-btn" type="button" data-act="rail" aria-pressed="${railOn}" aria-label="${railOn?"Expandir menú":"Contraer menú"}" title="${railOn?"Expandir menú":"Contraer menú"}">${svg("rail")}<span class="lb-long">Contraer menú</span></button>`;
  const ml=mName(cur);document.getElementById("monthLabel").textContent=ml.charAt(0).toUpperCase()+ml.slice(1);
  document.querySelector('[data-act="today"]').classList.toggle("show",cur!==mk(today));
}
function render(){
  if(drag)return;
  if(editing&&tab!=="resumen")cleanupEdit();
  updateTop();
  const a=document.activeElement;
  if(a&&document.getElementById("app").contains(a)&&/INPUT|SELECT/.test(a.tagName)&&a.type!=="checkbox"){pendingRender=true;return;}
  pendingRender=false;renderTabs();
  const app=document.getElementById("app");
  if(offline){app.innerHTML=`<div class="notice">No se pudieron cargar tus datos. Revisa tu conexión a internet y vuelve a abrir la app.</div>`;return;}
  if(!ready){app.innerHTML=`<div class="empty">Cargando tus datos...</div>`;return;}
  app.innerHTML=({resumen:vResumen,movimientos:vMov,fijos:vFijos,presupuestos:vPres,metas:vMetas,deudas:vDeudas,historial:vHist,logros:vLogros})[tab]();
  if(editing)applyEditOrder();
}

/* cifra grande con el símbolo $ más chico y apagado (solo para los widgets) */
const moneyFmt=new Intl.NumberFormat("es-CO",{style:"currency",currency:"COP",maximumFractionDigits:0});
function moneyBig(n){
  return moneyFmt.formatToParts(Math.round(n||0)).map(p=>p.type==="currency"?`<span class="cur">${esc(p.value)}</span>`:p.type==="literal"?"":esc(p.value)).join("");
}
/* los cuatro widgets del Resumen, cada uno por separado para poder reordenarlos */
function kpiCards(k){
  const t=totals(k);
  const pct=t.ingresos?Math.round((t.ahorro/t.ingresos)*100):0;
  return {
    ing:`<div class="kpi"><span class="lbl">Ingresos del mes</span><span class="val">${moneyBig(t.ingresos)}</span><span class="note">Salario ${money(t.salario)} + otros ${money(t.extra)}</span></div>`,
    egr:`<div class="kpi"><span class="lbl">Egresos</span><span class="val">${moneyBig(t.egresos)}</span><span class="note">Fijos ${money(t.fijos)} · variables ${money(t.gastos)}</span></div>`,
    aho:`<div class="kpi"><span class="lbl">Ahorrado</span><span class="val">${moneyBig(t.ahorro)}</span><span class="note">${pct}% de tus ingresos</span></div>`,
    disp:`<div class="kpi ${t.disp<0?"neg":"hero"}"><span class="lbl">Disponible</span><span class="val">${moneyBig(t.disp)}</span><span class="note">${t.disp<0?"Gastas más de lo que ganas este mes":"Lo que te queda para el resto del mes"}</span></div>`
  };
}

/* listas de categorías para los formularios: las de base + las propias, sin las ocultas */
function visibleCats(base,extra){const h=new Set(cfg.categorias.ocultas);return [...base,...extra].filter(c=>!h.has(c));}
function gastoCats(){return visibleCats(CATS.filter(c=>c!=="Ahorro"),cfg.categorias.gasto);}
function ingresoCats(){return visibleCats(INCATS,cfg.categorias.ingreso);}
/* en Presupuestos también salen las ocultas que tengan gasto este mes o un límite, para no perder ese dato */
function presCats(sp){
  const base=gastoCats(),all=[...CATS.filter(c=>c!=="Ahorro"),...cfg.categorias.gasto];
  return [...base,...all.filter(c=>!base.includes(c)&&((sp[c]||0)>0||(+cfg.presupuestos[c]||0)>0))];
}

function movForm(){
  const cats=movTipo==="ingreso"?ingresoCats():gastoCats();
  const def=cur===mk(today)?ymd(new Date()):cur+"-01";
  return `<form class="row" data-form="mov">
    <label class="f">Monto (COP)<input id="mv-monto" name="monto" inputmode="numeric" placeholder="45000" required></label>
    <label class="f">Categoría<select id="mv-cat" name="cat">${cats.map(c=>`<option>${esc(c)}</option>`).join("")}</select></label>
    <label class="f wide">Descripción<input id="mv-desc" name="desc" placeholder="${movTipo==="gasto"?"Almuerzo, Uber, mercado...":"Proyecto freelance, venta..."}"></label>
    <label class="f">Fecha<input id="mv-fecha" name="fecha" type="date" value="${def}"></label>
    ${movTipo==="ingreso"?"":`<label class="check esp"><input type="checkbox" name="esp" value="1"><span>Salida o imprevisto <small class="sub">(no cuenta contra tu ritmo de hoy)</small></span></label>`}
    <button class="btn">${movTipo==="ingreso"?"Agregar ingreso":"Agregar gasto"}</button>
  </form>`;
}

/* ---------- pagos de Apple Pay detectados (bandeja) ---------- */
let pend=[],autoToken="",tieneClave=false;
const pad2=n=>String(n).padStart(2,"0");
const ymd=d=>d.getFullYear()+"-"+pad2(d.getMonth()+1)+"-"+pad2(d.getDate());
function cleanPend(r){
  if(!r||!/^[0-9a-f-]{36}$/i.test(String(r.id)))return null;
  const m=+r.monto;if(!isFinite(m)||m<=0)return null;
  const d=new Date(r.creado);
  return {id:String(r.id),monto:m,comercio:str(r.comercio,120),tarjeta:str(r.tarjeta,60),creado:isFinite(d)?d:new Date()};
}
async function loadPending(){
  if(!sb||!uid)return;const who=uid;
  const {data,error}=await sb.from("pagos_pendientes").select("id,monto,comercio,tarjeta,creado").order("creado",{ascending:false}).limit(50);
  if(who!==uid)return;
  pend=error?[]:arr(data).map(cleanPend).filter(Boolean);
  render();
}
const catKey=c=>String(c||"").toLowerCase().slice(0,60);
function lastCatFor(c){try{return (JSON.parse(localStorage.getItem("fin.apayCat")||"{}"))[catKey(c)]||"";}catch(e){return "";}}
function rememberCat(c,cat){
  try{const m=JSON.parse(localStorage.getItem("fin.apayCat")||"{}");m[catKey(c)]=cat;
    const ks=Object.keys(m);if(ks.length>60)delete m[ks[0]];localStorage.setItem("fin.apayCat",JSON.stringify(m));}catch(e){}
}
function dropPend(id){
  pend=pend.filter(x=>x.id!==id);render();
  sb.from("pagos_pendientes").delete().eq("id",id).then(({error})=>{if(error)toast("Quedó registrado, pero no se pudo quitar de la bandeja. Descártalo de nuevo.");});
}
function pendHTML(){
  if(!pend.length)return "";
  const cats=gastoCats(),fmt=d=>d.toLocaleDateString("es-CO",{day:"numeric",month:"short"}).replace(".","");
  return `<section class="panel remind"><div class="split"><div><h2>Pagos detectados</h2><p class="sub">Llegaron desde Apple Pay. Elige la categoría y confírmalos.</p></div><span class="chip warn">${pend.length}</span></div>
    <ul class="list pend">${pend.slice(0,5).map(p=>{
      const last=lastCatFor(p.comercio),sel=cats.includes(last)?last:(cats.includes("Otros")?"Otros":cats[0]);
      const val=Number.isInteger(p.monto)?p.monto:String(p.monto).replace(".",",");
      return `<li><div class="li-main"><b>${esc(p.comercio||"Pago con Apple Pay")}</b><small>${esc(fmt(p.creado))}${p.tarjeta?" · "+esc(p.tarjeta):""}</small></div>
      <form class="row" data-form="apay" data-id="${p.id}"><label class="f">Monto (COP)<input name="monto" inputmode="numeric" value="${esc(val)}" required></label>
        <label class="f">Categoría<select name="cat">${cats.map(c=>`<option${c===sel?" selected":""}>${esc(c)}</option>`).join("")}</select></label>
        <label class="check esp"><input type="checkbox" name="esp" value="1"><span>Salida o imprevisto</span></label>
        <button class="btn sm">Registrar</button><button type="button" class="icon" data-act="apayDel" data-id="${p.id}">Descartar</button></form></li>`;}).join("")}</ul>
    ${pend.length>5?`<p class="sub">y ${pend.length-5} más. Se muestran de a cinco.</p>`:""}</section>`;
}

/* pagos fijos por atender: vencidos sin pagar y los que vencen en los próximos 3 días (solo el mes actual) */
function remindersHTML(){
  if(cur!==mk(today))return "";
  const m=month(cur),d=today.getDate(),last=new Date(today.getFullYear(),today.getMonth()+1,0).getDate();
  const due=cfg.fijos.filter(f=>f.dia&&!m.pagados[f.id]).map(f=>({f,n:Math.min(f.dia,last)-d})).filter(x=>x.n<=3).sort((a,b)=>a.n-b.n);
  if(!due.length)return "";
  const txt=n=>n<0?"Venció hace "+(-n)+(n===-1?" día":" días"):n===0?"Vence hoy":n===1?"Vence mañana":"Vence en "+n+" días";
  const show=due.slice(0,5);
  return `<section class="panel remind"><div class="split"><h2>Pagos por atender</h2><span class="chip ${due.some(x=>x.n<0)?"bad":"warn"}">${due.length}</span></div>
    <ul class="list">${show.map(({f,n})=>`<li><label class="check li-main"><input type="checkbox" data-act="pagar" data-id="${f.id}"><span><b>${esc(f.nombre)}</b><small>${txt(n)} · día ${f.dia}</small></span></label><span class="num">${money(f.monto)}</span><span class="chip ${n<0?"bad":"warn"}">${n<0?"Vencido":n===0?"Hoy":"Pronto"}</span></li>`).join("")}</ul>
    ${due.length>show.length?`<p class="sub">y ${due.length-show.length} más en la pestaña Pagos fijos.</p>`:""}</section>`;
}

/* bloques del Resumen que se pueden reordenar: tamaño (f completo, m completo en celular, s mitad, h mitad en computadora) y orden de fábrica */
const BLOCK_SIZE={pend:"f",remind:"f",mes:"f",disp:"m",rit:"h",ing:"s",egr:"s",aho:"m",reg:"h",fijos:"h",gastos:"h",salmes:"h",salbase:"h"};
const BLOCK_DEFAULT=["pend","remind","mes","disp","rit","ing","egr","aho","reg","fijos","gastos","salmes","salbase"];
/* en el modo edición cada bloque se reduce a una ficha liviana (ícono y nombre): moverla es mucho más fluido que mover el panel completo */
const BLOCK_CHIP={mes:["Tu mes en cifras","historial"],pend:["Pagos detectados","movimientos"],remind:["Pagos por atender","fijos"],disp:["Disponible","resumen"],rit:["Ritmo del día","presupuestos"],ing:["Ingresos","up"],egr:["Egresos","down"],aho:["Ahorrado","metas"],
  reg:["Registrar","plus"],fijos:["Pagos fijos","fijos"],gastos:["En qué se va tu dinero","presupuestos"],salmes:["Salario del mes","deudas"],salbase:["Salario base","deudas"]};
function blockOrder(){
  const order=arr(cfg.widgets&&cfg.widgets.orden).filter((id,i,a)=>BLOCK_DEFAULT.includes(id)&&a.indexOf(id)===i);
  /* los bloques nuevos que aún no están en tu orden guardado entran junto a su vecino de fábrica, no al final */
  BLOCK_DEFAULT.forEach((id,i)=>{
    if(order.includes(id))return;
    const prev=BLOCK_DEFAULT.slice(0,i).reverse().find(x=>order.includes(x));
    order.splice(prev?order.indexOf(prev)+1:0,0,id);
  });
  return order;
}

/* Ritmo del día: cuánto puedes gastar hoy si repartes lo que te queda entre los días que faltan */
function ritHTML(){
  if(cur!==mk(today))return "";
  const t=totals(cur),m=month(cur),now=new Date();
  const dim=new Date(now.getFullYear(),now.getMonth()+1,0).getDate(),day=now.getDate(),left=dim-day+1;
  /* los gastos marcados como "salida o imprevisto" bajan tu disponible (el dinero sí salió) y se reparten entre los días que quedan,
     pero no cuentan contra el ritmo de hoy ni pintan el anillo de rojo */
  const hoy=ymd(now),gastosHoy=m.movs.filter(x=>x.tipo==="gasto"&&x.fecha===hoy);
  const gastoHoy=sum(gastosHoy.filter(x=>!x.esp).map(x=>x.monto)),espHoy=sum(gastosHoy.filter(x=>x.esp).map(x=>x.monto));
  const allowance=(t.disp+gastoHoy)/left,rest=allowance-gastoHoy;
  /* ritmo del mes: lo que has gastado (sin salidas) frente a lo que "te tocaba" gastar hasta hoy */
  const espMes=sum(m.movs.filter(x=>x.tipo==="gasto"&&x.esp).map(x=>x.monto));
  const varBudget=t.ingresos-t.fijos-t.ahorro-espMes,ideal=varBudget>0?varBudget*day/dim:0,real=t.gastos-espMes;
  const frac=allowance>0?Math.max(0,gastoHoy/allowance):0,state=t.disp+gastoHoy<=0||frac>1?"over":frac>=.85?"warn":"ok";
  let msg="";
  if(t.disp+gastoHoy<=0)msg="Este mes ya no te queda margen. Cada gasto nuevo lo pasa de tu presupuesto.";
  else if(frac>1)msg="Hoy ya gastaste más de lo que te tocaba. Mañana se reparte lo que queda.";
  else if(espHoy>0)msg=`Hoy hubo una salida o imprevisto de ${money(espHoy)}. Lo repartimos entre los días que quedan.`;
  else if(ideal>0){
    const diff=Math.round((real-ideal)/ideal*100);
    msg=Math.abs(diff)<=5?"Vas justo en tu ritmo. Así se hace.":diff<-50?"Vas muy tranquilo este mes: te sobra margen.":diff<0?`Vas ${-diff} % por debajo de tu ritmo. ¡Muy bien!`:`Vas ${diff} % por encima de tu ritmo. Ve con calma unos días.`;
  }
  const C=2*Math.PI*42,dash=Math.min(1,frac)*C;
  return `<div class="kpi rit"><div class="rit-wrap">
    <svg class="ring" viewBox="0 0 100 100" aria-hidden="true"><circle class="r-bg" cx="50" cy="50" r="42"/><circle class="r-fg ${state}" cx="50" cy="50" r="42" stroke-dasharray="${dash.toFixed(1)} ${C.toFixed(1)}" transform="rotate(-90 50 50)"/><text x="50" y="58" text-anchor="middle">${Math.round(Math.min(frac,9.99)*100)}%</text></svg>
    <div class="rit-text"><span class="lbl">Hoy puedes gastar</span><span class="val">${moneyBig(Math.max(0,rest))}</span><span class="note">Quedan ${left} ${left===1?"día":"días"} del mes, contando hoy</span></div></div>
    ${msg?`<p class="sub rit-msg ${state}">${msg}</p>`:""}</div>`;
}
function vResumen(){
  const t=totals(cur), m=month(cur), sp=spentByCat(cur), k=kpiCards(cur);
  const pendF=cfg.fijos.filter(f=>!m.pagados[f.id]);
  const noSal=!(+cfg.salario);
  const cats=Object.entries(sp).filter(([,v])=>v>0).sort((a,b)=>b[1]-a[1]);
  const max=Math.max(1,...cats.map(c=>c[1]));
  const B={
    pend:pendHTML,
    remind:remindersHTML,
    mes:mesBanner,
    disp:()=>k.disp, rit:ritHTML, ing:()=>k.ing, egr:()=>k.egr, aho:()=>k.aho,
    reg:()=>`<section class="panel"><div><h2>Registrar</h2><p class="sub">Anota un movimiento de ${mName(cur)}.</p></div>
      <div class="quickrow"><button type="button" class="qbtn q-gasto" data-act="goMov" data-id="gasto">Registrar gasto</button><button type="button" class="qbtn q-ingreso" data-act="goMov" data-id="ingreso">Registrar ingreso</button></div></section>`,
    fijos:()=>`<section class="panel"><div class="split"><h2>Pagos fijos</h2><span class="chip ${pendF.length?"warn":"good"}">${cfg.fijos.length?(pendF.length?pendF.length+" pendientes":"Todos pagados"):"Sin pagos fijos"}</span></div>
      ${cfg.fijos.length?`<ul class="list">${cfg.fijos.slice().sort((a,b)=>(a.dia||99)-(b.dia||99)).map(f=>fijoCheck(f,m)).join("")}</ul>`:`<div class="empty">Agrega tus pagos mensuales en la pestaña Pagos fijos.</div>`}
    </section>`,
    gastos:()=>`<section class="panel"><div><h2>En qué se va tu dinero</h2><p class="sub">Fijos, gastos variables y ahorro por categoría.</p></div>
      ${cats.length?cats.map(([c,v])=>{const lim=+cfg.presupuestos[c]||0;const st=lim?(v>lim?"bad":v>lim*.85?"warn":"good"):"";
        return `<div class="budget"><div class="hd"><span>${esc(c)}</span><span class="num">${money(v)}${lim?` <small class="sub">/ ${money(lim)}</small>`:""}</span></div><div class="bar ${st}"><i style="width:${Math.min(100,(lim?v/lim:v/max)*100)}%"></i></div></div>`;}).join(""):`<div class="empty">Aún no hay gastos este mes.</div>`}
    </section>`,
    salmes:()=>noSal?"":`<section class="panel"><div class="split"><div><h2>Salario de ${mName(cur)}</h2><p class="sub">${m.salarioMes!=null?"Este mes tiene un salario distinto al base.":"Este mes usa tu salario base. Cámbialo si ese mes recibiste otro valor."}</p></div>${m.salarioMes!=null?`<span class="chip warn">Ajustado</span>`:""}</div>
      <form class="row" data-form="salarioMes"><label class="f">Salario recibido (COP)<input id="salmes" name="salario" inputmode="numeric" value="${t.salario||""}" required></label><button class="btn">Guardar</button>${m.salarioMes!=null?`<button type="button" class="btn ghost" data-act="resetSalMes">Usar salario base</button>`:""}</form></section>`,
    salbase:()=>noSal?"":`<section class="panel"><div><h2>Salario base</h2><p class="sub">Se aplica a todos los meses que no tengan un salario ajustado.</p></div>${salForm()}</section>`
  };
  const top=noSal?`<section class="panel"><div><h2>Empieza por tu salario</h2><p class="sub">Escribe cuánto recibes al mes. Después agrega tus pagos fijos (arriendo, celular, internet, transporte).</p></div>${salForm()}</section>`:"";
  return top+`<div class="blocks" id="blocks">${blockOrder().map(id=>{const h=B[id]();const [nm,ic]=BLOCK_CHIP[id];
    return h?`<div class="blk blk-${BLOCK_SIZE[id]}" data-blk="${id}">${h}<div class="blk-chip" aria-hidden="true">${svg(ic)}<span>${nm}</span></div></div>`:"";}).join("")}</div>`;
}
function salForm(){return `<form class="row" data-form="salario"><label class="f">Salario neto mensual (COP)<input id="sal" name="salario" inputmode="numeric" value="${+cfg.salario||""}" placeholder="2500000" required></label><button class="btn">Guardar salario</button></form>`;}
function fijoCheck(f,m){const p=!!m.pagados[f.id];return `<li><label class="check li-main"><input type="checkbox" data-act="pagar" data-id="${f.id}" ${p?"checked":""}><span><b>${esc(f.nombre)}</b><small>${esc(f.cat)}${f.dia?" · día "+f.dia:""}</small></span></label><span class="num">${money(f.monto)}</span><span class="chip ${p?"good":"warn"}">${p?"Pagado":"Pendiente"}</span></li>`;}

/* Movimientos: un selector grande separa Gastos de Ingresos; cada modo tiene su color, su total, su formulario y su lista */
function vMov(){
  const m=month(cur),t=totals(cur),ing=movTipo==="ingreso";
  const movs=m.movs.filter(x=>ing?x.tipo==="ingreso":x.tipo!=="ingreso").sort((a,b)=>(b.fecha||"").localeCompare(a.fecha||""));
  const total=ing?t.ingresos:t.gastos+t.ahorro;
  const note=ing?`Salario ${money(t.salario)} + extras ${money(t.extra)}`:`Variables ${money(t.gastos)}${t.ahorro?` · aportes a metas ${money(t.ahorro)}`:""} · los pagos fijos están en su pestaña`;
  const salRow=ing&&t.salario>0?`<li><div class="li-main"><b>Salario</b><small>${m.salarioMes!=null?"Ajustado para este mes":"Salario base"}</small></div><span class="num in">+${money(t.salario)}</span><span class="chip">Fijo</span></li>`:"";
  const rows=movs.map(x=>`<li><div class="li-main"><b>${esc(x.desc||x.cat)}</b><small>${esc(x.cat)} · ${esc(x.fecha||"")}${x.tipo==="ahorro"?" · aporte a meta":""}${x.esp?" · salida o imprevisto":""}</small></div><span class="num ${ing?"in":"out"}">${ing?"+":"-"}${money(x.monto)}</span><button class="icon" data-act="delMov" data-id="${x.id}">Borrar</button></li>`).join("");
  return `<div class="modeseg" role="group" aria-label="Tipo de movimiento">
    <button type="button" class="m-gasto" data-act="tipo" data-id="gasto" aria-pressed="${!ing}">Gastos</button>
    <button type="button" class="m-ingreso" data-act="tipo" data-id="ingreso" aria-pressed="${ing}">Ingresos</button>
  </div>
  <section class="mov-hero ${ing?"in":"out"}"><span class="lbl">${ing?"Ingresos":"Gastos"} de ${mName(cur)}</span><span class="val">${moneyBig(total)}</span><span class="note">${note}</span></section>
  <section class="panel"><div><h2>${ing?"Registrar ingreso":"Registrar gasto"}</h2>${ing?`<p class="sub">Ingresos extra al salario: freelance, ventas, bonificaciones.</p>`:""}</div>${movForm()}</section>
  <section class="panel"><div class="split"><h2>${ing?"Ingresos":"Gastos"} de ${mName(cur)}</h2><span class="status">${movs.length+(salRow?1:0)} registros</span></div>
  ${rows||salRow?`<ul class="list">${salRow}${rows}</ul>`:`<div class="empty">${ing?"Aún no hay ingresos en este mes.":"No hay gastos en este mes."} Registra el primero con el formulario de arriba.</div>`}
  </section>`;
}

function vFijos(){
  const m=month(cur);const tot=sum(cfg.fijos.map(f=>f.monto));const t=totals(cur);
  return `<section class="panel"><div class="split"><div><h2>Pagos fijos mensuales</h2><p class="sub">Lo que pagas todos los meses. Se descuenta automáticamente de tu disponible.</p></div><div class="num">${money(tot)}${t.ingresos?` <span class="chip">${Math.round(tot/t.ingresos*100)}% del ingreso</span>`:""}</div></div>
  <form class="row" data-form="fijo">
    <label class="f wide">Nombre<input id="fj-nombre" name="nombre" placeholder="Arriendo, celular, gimnasio..." required></label>
    <label class="f">Monto (COP)<input id="fj-monto" name="monto" inputmode="numeric" placeholder="120000" required></label>
    <label class="f">Categoría<select id="fj-cat" name="cat">${gastoCats().map(c=>`<option>${esc(c)}</option>`).join("")}</select></label>
    <label class="f">Día de pago<input id="fj-dia" name="dia" type="number" min="1" max="31" placeholder="5"></label>
    <button class="btn">Agregar</button>
  </form>
  ${cfg.fijos.length?`<ul class="list">${cfg.fijos.slice().sort((a,b)=>(a.dia||99)-(b.dia||99)).map(f=>{const p=!!m.pagados[f.id];return `<li><label class="check li-main"><input type="checkbox" data-act="pagar" data-id="${f.id}" ${p?"checked":""}><span><b>${esc(f.nombre)}</b><small>${esc(f.cat)}${f.dia?" · día "+f.dia:""} · ${p?"pagado en "+mName(cur,true):"pendiente"}</small></span></label><span class="num">${money(f.monto)}</span><button class="icon" data-act="delFijo" data-id="${f.id}">Quitar</button></li>`;}).join("")}</ul>`:`<div class="empty">Todavía no tienes pagos fijos. Agrega arriendo, servicios, plan de celular, suscripciones o cuotas.</div>`}
  </section>`;
}

function vPres(){
  const sp=spentByCat(cur);const totLim=sum(Object.values(cfg.presupuestos));
  return `<section class="panel"><div class="split"><div><h2>Presupuesto por categoría</h2><p class="sub">Pon un límite mensual a cada categoría. Incluye pagos fijos y gastos variables de ${mName(cur)}.</p></div><span class="num">Límite total ${money(totLim)}</span></div>
  <div><button type="button" class="btn ghost sm" data-act="openCats">Administrar categorías</button></div>
  <div>${presCats(sp).map(c=>{const v=sp[c]||0, lim=+cfg.presupuestos[c]||0;const st=lim?(v>lim?"bad":v>lim*.85?"warn":"good"):"";
    return `<div class="budget"><div class="hd"><span><b>${esc(c)}</b>${lim?`<span class="chip ${st}">${v>lim?"Excedido por "+money(v-lim):v>lim*.85?"Cerca del límite":"Restan "+money(lim-v)}</span>`:""}</span>
    <span style="display:flex;gap:8px;align-items:center"><span class="num">${money(v)}</span><input id="pr-${esc(c)}" data-pres="${esc(c)}" inputmode="numeric" placeholder="Límite" value="${lim||""}" aria-label="Límite para ${esc(c)}"></span></div>
    ${lim?`<div class="bar ${st}"><i style="width:${Math.min(100,v/lim*100)}%"></i></div>`:""}</div>`;}).join("")}</div>
  <p class="sub">El límite se guarda al salir del campo.</p></section>`;
}

function vMetas(){
  const tot=sum(cfg.metas.map(x=>x.ahorrado));
  return `<section class="panel"><div class="split"><div><h2>Metas de ahorro</h2><p class="sub">Cada aporte se registra como ahorro del mes y se descuenta de tu disponible.</p></div><span class="num">Total ahorrado ${money(tot)}</span></div>
  <form class="row" data-form="meta">
    <label class="f wide">Meta<input id="mt-nombre" name="nombre" placeholder="Fondo de emergencia, viaje, portátil..." required></label>
    <label class="f">Objetivo (COP)<input id="mt-obj" name="objetivo" inputmode="numeric" placeholder="5000000" required></label>
    <label class="f">Fecha límite<input id="mt-fecha" name="fecha" type="month"></label>
    <button class="btn">Crear meta</button>
  </form></section>
  ${cfg.metas.length?`<div class="grid2">${cfg.metas.map(g=>{const p=g.objetivo?Math.min(100,g.ahorrado/g.objetivo*100):0;const falta=Math.max(0,g.objetivo-g.ahorrado);
    let ritmo="";if(g.fecha&&falta>0){const [y,mm]=g.fecha.split("-").map(Number);const n=(y-today.getFullYear())*12+(mm-1-today.getMonth())+1;ritmo=n>0?`Necesitas ${money(falta/n)} al mes para llegar en ${mName(g.fecha)}.`:"La fecha límite ya pasó.";}
    const eta=metaEta(g),C=2*Math.PI*42;
    const etaTxt=eta.done?"¡Meta cumplida!":eta.none?"Haz tu primer aporte y te calculo cuándo llegas.":`Con tu ritmo (${money(eta.avg)} al mes) llegas en ${mName(eta.eta)}.`+(g.fecha?(eta.eta<=g.fecha?" ¡A tiempo!":""):"");
    const redMes=sum((month(cur).movs||[]).filter(x=>x.red&&x.metaId===g.id).map(x=>x.monto));
    const ics=GOAL_ICONS.map(ic=>`<button type="button" class="mic${g.icono===ic?" on":""}" data-act="metaIcon" data-id="${g.id}:${ic}" aria-label="Ícono ${ic}" aria-pressed="${g.icono===ic}">${svg(ic)}</button>`).join("");
    const cols=[["",""],...GOAL_COLORS.map(c=>[c,c])].map(([c],i)=>`<button type="button" class="msw${(g.color||"")===c?" on":""}" data-act="metaColor" data-id="${g.id}:${i}" style="background:${c||"var(--accent)"}" aria-label="Color ${i+1}" aria-pressed="${(g.color||"")===c}"></button>`).join("");
    return `<section class="panel meta" style="${g.color?`--mc:${g.color};`:""}">
    <div class="meta-top"><div class="ringbox"><svg class="ring big" viewBox="0 0 100 100" aria-hidden="true"><circle class="r-bg" cx="50" cy="50" r="42"/><circle class="r-fg mfg" cx="50" cy="50" r="42" stroke-dasharray="${(p/100*C).toFixed(1)} ${C.toFixed(1)}" transform="rotate(-90 50 50)"/></svg><span class="meta-ic">${svg(g.icono||"metas")}</span></div>
      <div class="meta-info"><div class="split"><h2>${esc(g.nombre)}</h2>${p>=100?`<span class="chip good">Cumplida</span>`:`<span class="chip">${Math.round(p)}%</span>`}</div><span class="num meta-amt">${money(g.ahorrado)}</span><span class="sub">de ${money(g.objetivo)}</span></div></div>
    <p class="sub meta-eta">${etaTxt}</p>
    ${ritmo?`<p class="sub">${ritmo}</p>`:""}
    ${g.redondeo?`<p class="sub">Redondeo de este mes: <b class="num">+${money(redMes)}</b></p>`:""}
    <form class="row" data-form="aporte" data-id="${g.id}"><label class="f">Aporte (COP)<input id="ap-${g.id}" name="monto" inputmode="numeric" placeholder="100000" required></label><button class="btn ghost">Aportar</button><button type="button" class="icon" data-act="delMeta" data-id="${g.id}">Eliminar</button></form>
    <details class="mp" data-id="${g.id}"${metaOpen.has(g.id)?" open":""}><summary>Personalizar</summary><div class="mp-body">
      <div class="mp-row"><span class="sub">Ícono</span><div class="mp-icons">${ics}</div></div>
      <div class="mp-row"><span class="sub">Color</span><div class="mp-colors">${cols}</div></div>
      <label class="check esp"><input type="checkbox" data-act="metaRed" data-id="${g.id}"${g.redondeo?" checked":""}><span>Redondear mis gastos y ahorrar el cambio aquí <small class="sub">(al siguiente múltiplo de $ 1.000; solo una meta a la vez)</small></span></label>
    </div></details></section>`;}).join("")}</div>`:`<div class="empty">Crea tu primera meta. Un buen inicio es un fondo de emergencia de 3 a 6 meses de gastos.</div>`}`;
}
let metaOpen=new Set();
document.addEventListener("toggle",e=>{const d=e.target;if(d&&d.classList&&d.classList.contains("mp")){if(d.open)metaOpen.add(d.dataset.id);else metaOpen.delete(d.dataset.id);}},true);
/* cuándo llegas a la meta: según el promedio de tus aportes de los últimos 3 meses (desde tu primer aporte) */
function metaEta(g){
  const falta=Math.max(0,g.objetivo-g.ahorrado);if(falta<=0)return {done:true};
  const cm=mk(today),ap={};
  for(const k in months)for(const x of (months[k].movs||[]))if(x.tipo==="ahorro"&&x.metaId===g.id)ap[k]=(ap[k]||0)+x.monto;
  const ks=Object.keys(ap).sort();if(!ks.length)return {none:true};
  const ventana=[0,1,2].map(i=>shift(cm,-i)).filter(k=>k>=ks[0]);
  const avg=sum(ventana.map(k=>ap[k]||0))/Math.max(1,ventana.length);
  if(!(avg>0))return {none:true};
  return {avg,eta:shift(cm,Math.max(1,Math.ceil(falta/avg)))};
}
/* redondeo: al registrar un gasto, el cambio hasta el siguiente múltiplo se aparta en la meta que lo tenga activado */
function aplicarRedondeo(v,desc,fecha){
  const g=cfg.metas.find(x=>x.redondeo>0);
  if(!g||(g.objetivo>0&&g.ahorrado>=g.objetivo))return null;
  const diff=Math.round(Math.ceil(v/g.redondeo)*g.redondeo-v);
  if(!(diff>=1)||diff>=g.redondeo)return null;
  g.ahorrado+=diff;saveCfg();
  addMov(fecha.slice(0,7),{id:uidv(),tipo:"ahorro",monto:diff,cat:"Ahorro",desc:"Redondeo: "+(desc||"gasto"),fecha,metaId:g.id,red:true});
  return {diff,nombre:g.nombre};
}

function vDeudas(){
  const tot=sum(cfg.deudas.map(d=>d.saldo)), cuotas=sum(cfg.deudas.map(d=>d.cuota));
  return `<section class="panel"><div class="split"><div><h2>Deudas y tarjetas</h2><p class="sub">Registra cada abono para que el saldo baje. El abono cuenta como gasto en la categoría Deudas.</p></div><div class="num">Saldo total ${money(tot)}</div></div>
  <form class="row" data-form="deuda">
    <label class="f wide">Nombre<input id="dd-nombre" name="nombre" placeholder="Tarjeta de crédito, crédito educativo..." required></label>
    <label class="f">Saldo actual<input id="dd-saldo" name="saldo" inputmode="numeric" placeholder="1500000" required></label>
    <label class="f">Cuota mensual<input id="dd-cuota" name="cuota" inputmode="numeric" placeholder="150000"></label>
    <label class="f">Tasa mensual %<input id="dd-tasa" name="tasa" inputmode="decimal" placeholder="2,1"></label>
    <button class="btn">Agregar</button>
  </form></section>
  ${cfg.deudas.length?`<div class="grid2">${cfg.deudas.map(d=>{const p=d.inicial?Math.min(100,(1-d.saldo/d.inicial)*100):0;const meses=d.cuota>0?Math.ceil(d.saldo/d.cuota):null;
    return `<section class="panel"><div class="split"><h2>${esc(d.nombre)}</h2>${d.saldo<=0?`<span class="chip good">Pagada</span>`:d.tasa?`<span class="chip warn">${esc(d.tasa)}% mensual</span>`:""}</div>
    <div class="split"><span class="num">${money(d.saldo)}</span><span class="sub">pendiente de ${money(d.inicial)}</span></div>
    <div class="bar good"><i style="width:${p}%"></i></div>
    <p class="sub">${d.cuota?`Cuota ${money(d.cuota)}${meses&&d.saldo>0?` · unos ${meses} ${meses===1?"mes":"meses"} para terminar sin contar intereses`:""}`:"Sin cuota definida"}</p>
    <form class="row" data-form="abono" data-id="${d.id}"><label class="f">Abono (COP)<input id="ab-${d.id}" name="monto" inputmode="numeric" placeholder="${d.cuota||""}" required></label><button class="btn ghost">Registrar abono</button><button type="button" class="icon" data-act="delDeuda" data-id="${d.id}">Eliminar</button></form></section>`;}).join("")}</div>
  ${cuotas?`<p class="sub">Tus cuotas suman ${money(cuotas)} al mes.</p>`:""}`:`<div class="empty">Sin deudas registradas. Si tienes tarjeta o crédito, agrégalo para ver cuánto te falta.</div>`}`;
}

function vHist(){
  const ks=[];for(let i=5;i>=0;i--)ks.push(shift(cur,-i));
  const ts=ks.map(totals);const max=Math.max(1,...ts.map(t=>Math.max(t.ingresos,t.egresos)));
  return `<section class="panel"><div class="split"><div><h2>Últimos 6 meses</h2><p class="sub">Ingresos frente a egresos hasta ${mName(cur)}.</p></div><div class="legend"><span>Ingresos</span><span class="o">Egresos</span></div></div>
  <div class="row-actions start"><button type="button" class="btn sm" data-act="openStory" data-id="${cur}">Tu mes en cifras</button><button type="button" class="btn ghost sm" data-act="openExport">Exportar mis datos</button></div>
  <div class="chart">${ts.map((t,i)=>`<div class="col" title="${mName(ks[i])}"><i class="ci" style="height:${t.ingresos/max*100}%"></i><i class="co" style="height:${t.egresos/max*100}%"></i></div>`).join("")}</div>
  <div class="xl">${ks.map(k=>`<span>${mName(k,true)}</span>`).join("")}</div>
  <div class="tbl"><table><thead><tr><th>Mes</th><th>Ingresos</th><th>Egresos</th><th>Ahorro</th><th>Balance</th></tr></thead><tbody>
  ${ks.slice().reverse().map(k=>{const t=totals(k);const has=months[k]||k===mk(today);return `<tr><td>${mName(k)}</td><td class="num">${has?money(t.ingresos):"-"}</td><td class="num">${has?money(t.egresos):"-"}</td><td class="num">${has?money(t.ahorro):"-"}</td><td class="num ${t.disp<0?"":"in"}" style="${t.disp<0?"color:var(--bad)":""}">${has?money(t.disp):"-"}</td></tr>`;}).join("")}
  </tbody></table></div>
  <p class="sub">Los meses sin registros aparecen con guion.</p></section>`;
}

/* ---------- rachas y logros ---------- */
const dayNum=s=>{const [y,m,d]=String(s).split("-").map(Number);return Math.round(Date.UTC(y,m-1,d)/86400000);};
const LOGROS=[
  ["primero","Primer paso","Registra tu primer movimiento","star",c=>c.total>=1],
  ["r7","Una semana","7 días seguidos registrando","flame",c=>c.best>=7],
  ["r30","Un mes entero","30 días seguidos registrando","flame",c=>c.best>=30],
  ["c100","Constante","100 movimientos registrados","historial",c=>c.total>=100],
  ["meta","Meta cumplida","Completa una meta de ahorro","metas",c=>c.metaOk],
  ["verde","Mes en verde","Cierra un mes con disponible positivo","check",c=>c.verde],
  ["ah10","Ahorrador","Ahorra el 10 % de tus ingresos en un mes","coin",c=>c.ah10],
  ["deuda","Libre de una deuda","Paga una deuda por completo","deudas",c=>c.deudaOk]
];
/* días con movimientos (más los días que marcas como "no gasté nada"); la racha son los días seguidos que terminan hoy o ayer */
function rachaInfo(){
  const libres=(cfg.logros&&cfg.logros.libres)||[],s=new Set(libres.map(dayNum)),t=dayNum(ymd(new Date()));
  let total=0;
  for(const k in months)for(const x of (months[k].movs||[])){total++;if(x.fecha)s.add(dayNum(x.fecha));}
  let streak=0,d=s.has(t)?t:(s.has(t-1)?t-1:null);
  if(d!==null)while(s.has(d)){streak++;d--;}
  let best=0,run=0,prev=null;
  for(const n of [...s].filter(n=>n<=t).sort((a,b)=>a-b)){run=(prev!==null&&n===prev+1)?run+1:1;best=Math.max(best,run);prev=n;}
  return {streak,best,total,hoy:s.has(t),days:[6,5,4,3,2,1,0].map(i=>({on:s.has(t-i),l:["D","L","M","M","J","V","S"][new Date((t-i)*86400000).getUTCDay()]}))};
}
function logroCtx(){
  const r=rachaInfo(),cm=mk(today);
  let verde=false,ah10=false;
  for(const k in months){
    const m=months[k];if(!m||!(m.movs||[]).length)continue;
    const t=totals(k);
    if(k<cm&&(m.movs||[]).length>=5&&t.ingresos>0&&t.disp>=0)verde=true;
    if(t.ingresos>0&&t.ahorro/t.ingresos>=0.1)ah10=true;
  }
  return {best:r.best,total:r.total,verde,ah10,
    metaOk:cfg.metas.some(g=>g.objetivo>0&&g.ahorrado>=g.objetivo),deudaOk:cfg.deudas.some(d=>d.inicial>0&&d.saldo<=0)};
}
let achvTimer,logroBusy=false;
function checkLogros(){
  if(!ready||logroBusy||!cfg.logros)return;
  logroBusy=true;
  try{
    const c=logroCtx(),on=LOGROS.filter(l=>l[4](c)),seen=new Set(cfg.logros.vistos),nuevos=on.filter(l=>!seen.has(l[0]));
    if(!cfg.logros.init){cfg.logros={...cfg.logros,init:true,vistos:on.map(l=>l[0])};saveCfg();return;}   /* la primera vez no se celebra lo que ya tenías */
    if(!nuevos.length)return;
    cfg.logros={...cfg.logros,vistos:[...seen,...nuevos.map(l=>l[0])]};saveCfg();
    celebrate(nuevos);
  }finally{logroBusy=false;}
}
function celebrate(list){
  const [,nm,desc,ic]=list[0],el=document.getElementById("achv");
  document.getElementById("achvIc").innerHTML=svg(ic);
  document.getElementById("achvT").textContent="Nuevo logro: "+nm+(list.length>1?` (+${list.length-1} más)`:"");
  document.getElementById("achvD").textContent=desc;
  el.hidden=false;void el.offsetWidth;el.classList.add("show");
  clearTimeout(achvTimer);achvTimer=setTimeout(()=>{el.classList.remove("show");setTimeout(()=>{el.hidden=true;},400);},4500);
  if(!matchMedia("(prefers-reduced-motion:reduce)").matches)coinRain();
}
function coinRain(){
  const box=document.getElementById("coins");box.innerHTML="";
  for(let i=0;i<18;i++){
    const c=document.createElement("i");c.className="coin";
    c.style.cssText=`--x:${Math.round(Math.random()*96)}%;--d:${(1.5+Math.random()*1.2).toFixed(2)}s;--t:${(Math.random()*.6).toFixed(2)}s;--r:${Math.round(180+Math.random()*360)}deg`;
    box.appendChild(c);
  }
  box.hidden=false;setTimeout(()=>{box.hidden=true;box.innerHTML="";},3300);
}
function racHTML(){
  const r=rachaInfo(),c=logroCtx(),on=LOGROS.filter(l=>l[4](c)).map(l=>l[0]);
  const msg=r.streak===0?"Registra un movimiento hoy para empezar tu racha.":!r.hoy?"Registra algo hoy para mantener tu racha.":r.streak>=7?"¡Vas muy bien! Sigue así.":"Hoy ya cuenta. Mañana, un día más.";
  return `<div class="kpi rac">
    <div class="rac-head"><span class="rac-flame${r.streak?" lit":""}">${svg("flame")}</span><div class="rac-num"><span class="val">${r.streak} <small>${r.streak===1?"día":"días"}</small></span><span class="note">de racha · tu mejor: ${r.best}</span></div></div>
    <div class="rac-days" aria-hidden="true">${r.days.map(d=>`<span class="rd${d.on?" on":""}">${d.l}</span>`).join("")}</div>
    <p class="sub">${msg}</p>
    ${r.hoy?"":`<button type="button" class="btn ghost sm" data-act="diaLibre">Hoy no gasté nada</button>`}
    <div class="rac-bdgs">${LOGROS.map(l=>`<button type="button" class="bdg${on.includes(l[0])?" on":""}" data-act="bdg" data-id="${l[0]}" aria-label="${esc(l[1])}${on.includes(l[0])?"":" (bloqueado)"}"><span class="bi">${svg(l[3])}</span><span class="bn">${esc(l[1])}</span></button>`).join("")}</div>
    <span class="note">${on.length} de ${LOGROS.length} logros</span></div>`;
}

/* ---------- Tu mes en cifras: historias animadas que se pueden compartir como imagen ---------- */
const capital=s=>s.charAt(0).toUpperCase()+s.slice(1);
function mesResumen(k){
  const m=month(k),t=totals(k),movs=m.movs||[],gastos=movs.filter(x=>x.tipo==="gasto");
  const mayor=gastos.slice().sort((a,b)=>b.monto-a.monto)[0]||null;
  const porCat={};gastos.forEach(x=>{porCat[x.cat]=(porCat[x.cat]||0)+x.monto;});
  const topCat=Object.entries(porCat).sort((a,b)=>b[1]-a[1])[0]||null,totalGastos=sum(gastos.map(x=>x.monto));
  const dias=[...new Set(movs.map(x=>x.fecha).filter(f=>f&&f.startsWith(k)))].map(dayNum).sort((a,b)=>a-b);
  let mejor=0,run=0,prev=null;for(const n of dias){run=(prev!==null&&n===prev+1)?run+1:1;mejor=Math.max(mejor,run);prev=n;}
  return {k,t,mayor,topCat,totalGastos,dias:dias.length,mejor,pctAhorro:t.ingresos?Math.round(t.ahorro/t.ingresos*100):0,
    pctGasto:t.ingresos?Math.round(t.egresos/t.ingresos*100):0,pctTop:topCat&&totalGastos?Math.round(topCat[1]/totalGastos*100):0,hay:movs.length>0||t.ingresos>0};
}
let story=null;
const reduced=()=>matchMedia("(prefers-reduced-motion:reduce)").matches;
function openStory(k){
  if(!/^20\d\d-(0[1-9]|1[0-2])$/.test(k||""))return;
  const r=mesResumen(k);if(!r.hay)return toast("Ese mes todavía no tiene movimientos.");
  story={r,i:0,hide:false,slides:[]};document.getElementById("storyHide").checked=false;
  buildSlides();
  document.documentElement.classList.add("noscroll");
  ["topbar","appView","tabs"].forEach(id=>{document.getElementById(id).inert=true;});
  document.getElementById("story").hidden=false;renderStory();
}
function closeStory(){
  if(!story)return;story=null;
  document.getElementById("story").hidden=true;document.documentElement.classList.remove("noscroll");
  ["topbar","appView","tabs"].forEach(id=>{document.getElementById(id).inert=false;});
}
function buildSlides(){
  const s=story,r=s.r,t=r.t,h=s.hide,a=n=>h?`<span class="cur">•••</span>`:`<span class="cnt" data-to="${Math.round(n)}">${moneyBig(n)}</span>`;
  const L=[];
  L.push(`<div class="s-k">Tu mes en cifras</div><div class="s-big">${esc(capital(mName(r.k)))}</div><div class="s-sub">Un repaso rápido de cómo te fue.</div>`);
  L.push(h?`<div class="s-k">Lo que entró y lo que salió</div><div class="s-big">${r.pctGasto}<small>%</small></div><div class="s-sub">Gastaste el ${r.pctGasto} % de lo que entró este mes.</div>`
    :`<div class="s-k">Entraron</div><div class="s-big">${a(t.ingresos)}</div><div class="s-k">Salieron</div><div class="s-big">${a(t.egresos)}</div>`);
  L.push(t.ahorro>0?`<div class="s-k">Ahorraste</div><div class="s-big">${h?`${r.pctAhorro}<small>%</small>`:a(t.ahorro)}</div><div class="s-sub">${r.pctAhorro} % de tus ingresos${r.pctAhorro>=10?". ¡Bien hecho!":"."}</div>`
    :`<div class="s-k">Ahorro</div><div class="s-big">Este mes no hubo</div><div class="s-sub">El próximo puede ser el tuyo.</div>`);
  if(r.mayor)L.push(`<div class="s-k">Tu mayor gasto</div><div class="s-big">${h?esc(r.mayor.desc||r.mayor.cat):a(r.mayor.monto)}</div><div class="s-sub">${h?esc(r.mayor.cat):esc((r.mayor.desc||"Sin descripción")+" · "+r.mayor.cat)}</div>`);
  if(r.topCat)L.push(`<div class="s-k">Tu categoría estrella</div><div class="s-big">${esc(r.topCat[0])}</div><div class="s-sub">${r.pctTop} % de tus gastos${h?".":" · "+moneyFmt.format(Math.round(r.topCat[1]))}</div>`);
  if(r.dias)L.push(`<div class="s-k">Constancia</div><div class="s-big">${r.dias} <small>${r.dias===1?"día":"días"}</small></div><div class="s-sub">con movimientos registrados. Tu mejor racha del mes: ${r.mejor} ${r.mejor===1?"día":"días"}.</div>`);
  L.push(`<div class="s-k">En resumen</div><div class="s-card"><b>${esc(capital(mName(r.k)))}</b>
    <span>${t.ahorro>0?(h?`Ahorré el ${r.pctAhorro} % de mis ingresos`:`Ahorré ${moneyFmt.format(Math.round(t.ahorro))}`):"Sin ahorro este mes"}</span>
    <span>${h?`Gasté el ${r.pctGasto} % de lo que entró`:`Entró ${moneyFmt.format(Math.round(t.ingresos))}, salió ${moneyFmt.format(Math.round(t.egresos))}`}</span>
    ${r.topCat?`<span>Categoría estrella: ${esc(r.topCat[0])}</span>`:""}
    ${r.dias?`<span>${r.dias} días registrando · racha de ${r.mejor}</span>`:""}</div><div class="s-sub">Toca Compartir imagen para guardarla o enviarla.</div>`);
  s.slides=L;
}
function renderStory(){
  const s=story;if(!s)return;
  const last=s.i===s.slides.length-1;
  document.getElementById("storyBars").innerHTML=s.slides.map((_,j)=>`<i class="${j<s.i||(j===s.i&&last)?"done":j===s.i?"on":""}"></i>`).join("");
  const el=document.getElementById("storySlide");el.innerHTML=s.slides[s.i];el.classList.toggle("last",last);
  document.getElementById("storyShare").hidden=!last;
  if(!reduced())animateCounts();
}
function animateCounts(){
  document.querySelectorAll("#storySlide .cnt").forEach(el=>{
    const to=+el.dataset.to,t0=performance.now(),dur=900;el.innerHTML=moneyBig(0);
    const step=now=>{const p=Math.min(1,(now-t0)/dur),e=1-Math.pow(1-p,3);el.innerHTML=moneyBig(to*e);if(p<1&&story)requestAnimationFrame(step);};
    requestAnimationFrame(step);
  });
}
function storyGo(d){
  const s=story;if(!s)return;
  const n=s.i+d;if(n<0)return;if(n>=s.slides.length)return;
  s.i=n;renderStory();
}
document.addEventListener("animationend",e=>{if(story&&e.animationName==="storyBar")storyGo(1);},true);
/* toque en la mitad izquierda: atrás; derecha: adelante; mantener presionado: pausa */
let storyPress=null;
document.addEventListener("pointerdown",e=>{
  const z=e.target.closest&&e.target.closest(".story-tap");if(!z||!story)return;
  storyPress={t:performance.now(),dir:z.dataset.dir==="l"?-1:1,x:e.clientX,y:e.clientY};document.getElementById("story").classList.add("paused");
});
const storyEnd=e=>{
  if(!storyPress)return;const p=storyPress;storyPress=null;
  document.getElementById("story").classList.remove("paused");
  if(e.type==="pointerup"&&performance.now()-p.t<350&&Math.hypot(e.clientX-p.x,e.clientY-p.y)<12)storyGo(p.dir);
};
document.addEventListener("pointerup",storyEnd);document.addEventListener("pointercancel",storyEnd);
document.getElementById("storyHide").addEventListener("change",e=>{if(!story)return;story.hide=e.target.checked;buildSlides();renderStory();});
/* imagen para compartir (1080 x 1350) con el resumen del mes */
async function shareStory(){
  const s=story;if(!s)return;
  const r=s.r,t=r.t,h=s.hide,W=1080,H=1350,c=document.createElement("canvas");c.width=W;c.height=H;
  const g=c.getContext("2d"),cs=getComputedStyle(document.documentElement);
  const acc=cs.getPropertyValue("--accent").trim()||"#2f5bea",ink=cs.getPropertyValue("--accent-ink").trim()||"#ffffff";
  g.fillStyle=acc;g.fillRect(0,0,W,H);
  const gr=g.createLinearGradient(0,0,W*.7,H*.5);gr.addColorStop(0,"rgba(255,255,255,.24)");gr.addColorStop(1,"rgba(255,255,255,0)");g.fillStyle=gr;g.fillRect(0,0,W,H);
  const font=(w,px)=>`${w} ${px}px ui-rounded,-apple-system,"SF Pro Rounded","Segoe UI",system-ui,sans-serif`;
  const fit=(txt,w,px,maxW)=>{let p=px;g.font=font(w,p);while(g.measureText(txt).width>maxW&&p>24){p-=4;g.font=font(w,p);}return p;};
  g.fillStyle=ink;g.textBaseline="alphabetic";
  g.globalAlpha=.8;g.font=font(600,44);g.fillText("Mi mes en cifras",80,150);g.globalAlpha=1;
  const title=capital(mName(r.k));fit(title,700,120,W-160);g.fillText(title,80,300);
  const rows=[
    ["Ahorro",t.ahorro>0?(h?`${r.pctAhorro} % de mis ingresos`:moneyFmt.format(Math.round(t.ahorro))):"Este mes no hubo"],
    [h?"Gasté":"Entró y salió",h?`${r.pctGasto} % de lo que entró`:`${moneyFmt.format(Math.round(t.ingresos))}  /  ${moneyFmt.format(Math.round(t.egresos))}`],
    ["Categoría estrella",r.topCat?`${r.topCat[0]} · ${r.pctTop} %`:"—"],
    ["Constancia",r.dias?`${r.dias} días · racha de ${r.mejor}`:"—"]
  ];
  let y=470;
  rows.forEach(([lab,val])=>{
    g.globalAlpha=.78;g.font=font(600,40);g.fillText(lab,80,y);g.globalAlpha=1;
    fit(val,700,84,W-160);g.fillText(val,80,y+96);y+=190;
  });
  g.globalAlpha=.8;g.font=font(600,40);g.fillText("Mis Finanzas",80,H-80);g.globalAlpha=1;
  const blob=await new Promise(res=>c.toBlob(res,"image/png"));
  if(!blob)return toast("No se pudo crear la imagen.");
  shareBlob("mi-mes-"+r.k+".png","image/png",blob);
}
function mesBanner(){
  if(cur!==mk(today)||today.getDate()>7)return "";
  const prev=shift(mk(today),-1),r=mesResumen(prev);if(!r.hay)return "";
  return `<section class="panel mesbanner"><div><h2>Tu ${esc(mName(prev))} en cifras</h2><p class="sub">Un repaso animado de cómo te fue. Lo puedes compartir como imagen.</p></div>
    <div><button type="button" class="btn" data-act="openStory" data-id="${prev}">Verlo ahora</button></div></section>`;
}

/* ventana propia de rachas y logros */
function vLogros(){
  const c=logroCtx(),on=LOGROS.filter(l=>l[4](c)).map(l=>l[0]);
  return `${racHTML()}
  <section class="panel"><div class="split"><div><h2>Todos los logros</h2><p class="sub">Se ganan solos mientras usas la app.</p></div><span class="chip ${on.length===LOGROS.length?"good":""}">${on.length} de ${LOGROS.length}</span></div>
    <ul class="list">${LOGROS.map(l=>{const got=on.includes(l[0]);return `<li><div class="li-main"><b>${esc(l[1])}</b><small>${esc(l[2])}</small></div><span class="chip ${got?"good":""}">${got?"Logrado":"Pendiente"}</span></li>`;}).join("")}</ul></section>`;
}

/* ---------- Resumen: modo edición (mantener presionado y arrastrar los bloques) ---------- */
const HOLD_MS=500;
let editing=false,press=null,drag=null,swallow=false;
const blocksEl=()=>document.getElementById("blocks");
function applyEditOrder(){
  const b=blocksEl();if(!b)return;
  [...b.children].forEach((c,i)=>{c.style.order=i;c.style.setProperty("--wd",(-((i*37)%150)/1000)+"s");});
}
function enterEdit(){
  if(editing||!blocksEl())return;
  editing=true;swallow=true;setTimeout(()=>{swallow=false;},450);
  document.documentElement.classList.add("editmode");
  document.getElementById("app").classList.add("editing");document.getElementById("editBar").hidden=false;
  applyEditOrder();
  window.scrollTo(0,0);   /* las fichas caben en una pantalla */
}
function cleanupEdit(){
  editing=false;press=null;
  if(drag){cancelAnimationFrame(drag.raf);drag=null;}
  document.documentElement.classList.remove("editmode");
  document.getElementById("app").classList.remove("editing");document.getElementById("editBar").hidden=true;
}
function exitEdit(){if(!editing)return;cleanupEdit();render();}
function saveOrder(){
  const b=blocksEl();if(!b)return;
  cfg.widgets={orden:[...b.children].sort((x,y)=>+x.style.order-+y.style.order).map(c=>c.dataset.blk)};
  saveCfg();
}
/* Para que se sienta fluido: el movimiento del dedo solo guarda la posición y UNA vez por fotograma
   se mueve el bloque y se revisa si hay que cambiar de lugar, usando posiciones medidas de antemano. */
function applyDrag(){
  const d=drag;
  d.el.style.transform=`translate3d(${d.px-d.sx+d.ox}px,${d.py-d.sy+d.oy+(window.scrollY-d.sy0)}px,0) scale(1.03)`;
}
function measureDrag(){
  const d=drag,b=blocksEl();if(!d||!b)return;
  d.rects=new Map();
  for(const c of b.children){
    if(c===d.el)continue;
    const r=c.getBoundingClientRect();
    d.rects.set(c,{l:r.left,t:r.top+window.scrollY,w:r.width,h:r.height});
  }
}
function checkSwap(){
  const d=drag,b=blocksEl();if(!d||!b||!d.rects)return;
  const x=d.px,y=d.py+window.scrollY;
  let target=null;
  for(const [c,r] of d.rects){
    const mx=r.w*.25,my=r.h*.25;
    if(x>r.l+mx&&x<r.l+r.w-mx&&y>r.t+my&&y<r.t+r.h-my){target=c;break;}
  }
  if(!target)return;
  const order=[...b.children].sort((p,q)=>+p.style.order-+q.style.order),from=order.indexOf(d.el),to=order.indexOf(target);
  if(from===to||from<0||to<0)return;
  const before=new Map(order.map(c=>[c,c.getBoundingClientRect()]));
  order.splice(from,1);order.splice(to,0,d.el);
  order.forEach((c,i)=>{c.style.order=i;});
  const r0=before.get(d.el),r1=d.el.getBoundingClientRect();
  d.ox+=r0.left-r1.left;d.oy+=r0.top-r1.top;applyDrag();
  order.forEach(c=>{
    if(c===d.el)return;
    const a=before.get(c),n=c.getBoundingClientRect(),dx=a.left-n.left,dy=a.top-n.top;
    if(dx||dy)c.animate([{transform:`translate3d(${dx}px,${dy}px,0) scale(.985)`},{transform:"translate3d(0,0,0) scale(.985)"}],{duration:220,easing:"cubic-bezier(0.23, 1, 0.32, 1)"});
  });
  measureDrag();
}
function dragTick(){
  const d=drag;if(!d)return;
  const y=d.py,edge=110;let dy=0;
  if(y<edge)dy=-Math.min(20,(edge-y)/4+4);else if(y>window.innerHeight-edge-60)dy=Math.min(20,(y-(window.innerHeight-edge-60))/4+4);
  if(dy)window.scrollBy(0,dy);
  if(d.dirty||dy){d.dirty=false;applyDrag();checkSwap();}
  d.raf=requestAnimationFrame(dragTick);
}
function beginDrag(blk,e,center){
  if(drag)return;
  drag={el:blk,id:e.pointerId,sx:e.clientX,sy:e.clientY,px:e.clientX,py:e.clientY,ox:0,oy:0,sy0:window.scrollY,dirty:true};
  /* al entrar a editar los bloques se encogen: la ficha levantada se coloca justo debajo del dedo */
  if(center){const r=blk.getBoundingClientRect();drag.ox=e.clientX-(r.left+r.width/2);drag.oy=e.clientY-(r.top+r.height/2);}
  blk.classList.add("dragging");measureDrag();drag.raf=requestAnimationFrame(dragTick);
}
function endDrag(){
  const d=drag;if(!d)return;
  cancelAnimationFrame(d.raf);drag=null;
  const from=d.el.style.transform;
  d.el.style.transform="";d.el.classList.remove("dragging");
  d.el.animate([{transform:from},{transform:"none"}],{duration:200,easing:"cubic-bezier(0.23, 1, 0.32, 1)"});
  saveOrder();
}
document.addEventListener("pointerdown",e=>{
  if(tab!=="resumen"||(e.pointerType==="mouse"&&e.button!==0))return;
  const blk=e.target.closest&&e.target.closest("#blocks .blk");if(!blk)return;
  if(editing){beginDrag(blk,e);return;}
  if(e.target.closest("input,select,textarea"))return;
  const p=press={blk,x:e.clientX,y:e.clientY,id:e.pointerId};
  p.t=setTimeout(()=>{if(press!==p)return;press=null;enterEdit();beginDrag(blk,{clientX:p.x,clientY:p.y,pointerId:p.id},true);},HOLD_MS);
});
document.addEventListener("pointermove",e=>{
  if(press){
    if(Math.hypot(e.clientX-press.x,e.clientY-press.y)>10){clearTimeout(press.t);press=null;}
    else{press.x=e.clientX;press.y=e.clientY;}
  }
  if(drag&&e.pointerId===drag.id){drag.px=e.clientX;drag.py=e.clientY;drag.dirty=true;}
});
const endPress=e=>{
  if(press){clearTimeout(press.t);press=null;}
  if(drag&&e.pointerId===drag.id)endDrag();
};
document.addEventListener("pointerup",endPress);
document.addEventListener("pointercancel",endPress);
/* mientras se arrastra no debe desplazarse la página, y mantener presionado no debe seleccionar texto ni abrir menús */
document.addEventListener("touchmove",e=>{if(drag&&e.cancelable)e.preventDefault();},{passive:false});
document.addEventListener("contextmenu",e=>{if((press||editing)&&e.target.closest&&e.target.closest("#blocks"))e.preventDefault();});
document.addEventListener("selectstart",e=>{if((press||editing)&&e.target.closest&&e.target.closest("#blocks"))e.preventDefault();});
document.addEventListener("click",e=>{
  if(swallow||(editing&&e.target.closest&&e.target.closest("#blocks"))){e.preventDefault();e.stopPropagation();}
},true);

/* al cambiar de sección, el contenido nuevo entra desvaneciendo y desplazándose apenas desde el lado hacia el que te mueves */
function playTab(cls){const a=document.getElementById("app");a.classList.remove("go-r","go-l");void a.offsetWidth;a.classList.add(cls);}

/* ---------- acciones ---------- */
let armed=null;
function confirmClick(btn){if(armed===btn){armed=null;return true;}if(armed){armed.classList.remove("armed");armed.textContent=armed.dataset.lbl;}armed=btn;btn.dataset.lbl=btn.textContent;btn.textContent="Confirmar";btn.classList.add("armed");setTimeout(()=>{if(armed===btn){btn.classList.remove("armed");btn.textContent=btn.dataset.lbl;armed=null;}},3500);return false;}

document.addEventListener("click",e=>{
  const b=e.target.closest("[data-act]");if(!b)return;const id=b.dataset.id;
  switch(b.dataset.act){
    case "logout":sb&&sb.auth.signOut();break;
    case "openProfile":openProfile(b);break;
    case "closeProfile":closeLayer($("profileSheet"));break;
    case "pickFoto":$("fotoInput").click();break;
    case "quitarFoto":cfg.perfil.foto="";saveCfg();updateProfPhotoUI();updateTop();toast("Foto quitada");break;
    case "cropCancel":cancelCrop();break;
    case "cropOk":cropDone();break;
    case "catToggle":toggleCat(id);break;
    case "catDel":delCat(id);break;
    case "expCsv":exportCsv();break;
    case "expJson":exportJson();break;
    case "tema":setLook({tema:id});break;
    case "paleta":setLook({paleta:id});break;
    case "resetLook":cfg.apariencia={tema:"auto",paleta:"azul",acento:""};applyLook();saveCfg();toast("Colores restablecidos");break;
    case "skipWelcome":cfg.perfil.omitido=true;saveCfg();closeLayer($("welcome"));break;
    case "tab":{
      if(!TABS.some(x=>x[0]===id))break;
      const from=TABS.findIndex(x=>x[0]===tab),to=TABS.findIndex(x=>x[0]===id),changed=id!==tab;
      tab=id;try{localStorage.setItem("fin.tab",tab)}catch(_){ }closeLayer($("moreSheet"));
      if(document.activeElement&&document.activeElement.blur)document.activeElement.blur();
      render();window.scrollTo(0,0);
      if(changed)playTab(to>from?"go-r":"go-l");
      break;}
    case "more":openMore(b);break;
    case "diaLibre":{const h=ymd(new Date());cfg.logros={...cfg.logros,libres:[...cfg.logros.libres.filter(x=>x!==h),h].slice(-120)};saveCfg();render();toast("Día registrado. Tu racha sigue.");break;}
    case "bdg":{const l=LOGROS.find(x=>x[0]===id);if(l){const got=cfg.logros.vistos.includes(l[0]);toast(l[1]+": "+l[2]+(got?"":" (aún no lo logras)"));}break;}
    case "metaIcon":case "metaColor":{
      const [gid,val]=String(id||"").split(":"),g=cfg.metas.find(x=>x.id===gid);if(!g)break;
      if(b.dataset.act==="metaIcon"){if(GOAL_ICONS.includes(val))g.icono=val;}
      else{const i=+val;g.color=i>0&&GOAL_COLORS[i-1]?GOAL_COLORS[i-1]:"";}
      saveCfg();render();break;}
    case "metaRed":{
      const g=cfg.metas.find(x=>x.id===id);if(!g)break;
      const on=!(g.redondeo>0);cfg.metas.forEach(x=>{x.redondeo=0;});if(on)g.redondeo=1000;
      saveCfg();render();toast(on?"Redondeo activado en "+g.nombre:"Redondeo desactivado");break;}
    case "openStory":openStory(id);break;
    case "storyClose":closeStory();break;
    case "storyShare":shareStory();break;
    case "editDone":exitEdit();break;
    case "editReset":cfg.widgets={orden:[]};saveCfg();cleanupEdit();render();enterEdit();toast("Orden original restablecido");break;
    case "rail":{const de=document.documentElement;de.classList.add("railanim");setTimeout(()=>de.classList.remove("railanim"),300);const on=de.classList.toggle("rail");try{localStorage.setItem("fin.rail",on?"1":"0")}catch(_){ }renderTabs();const nb=document.querySelector(".collapse-btn");if(nb)nb.focus({preventScroll:true});break;}
    case "closeLayer":{const el=$(id||"x");if(el&&el.classList.contains("layer"))closeLayer(el);break;}
    case "openCats":renderCatList();openLayer($("catSheet"),b);break;
    case "openExport":fillExportRange();openLayer($("expSheet"),b);break;
    case "apayDel":dropPend(id);break;
    case "openAuto":openAuto();break;
    case "autoBack":closeAuto();break;
    case "autoGen":if(tieneClave&&!confirmClick(b))return;autoGen();break;
    case "autoTest":autoTest();break;
    case "copy":copyText(id);break;
    case "openPass":openPass();break;
    case "passBack":closePass();break;
    case "eye":toggleEye(b);break;
    case "prevMonth":closeMonthPop();if(cur>"2000-01"){cur=shift(cur,-1);render();}break;
    case "nextMonth":closeMonthPop();if(cur<"2099-12"){cur=shift(cur,1);render();}break;
    case "today":closeMonthPop();cur=mk(today);render();break;
    case "monthPicker":if(popOpen)closeMonthPop(true);else openMonthPop();break;
    case "pickMonth":if(/^20\d\d-(0[1-9]|1[0-2])$/.test(id))cur=id;closeMonthPop(true);render();break;
    case "yearPrev":pickYear=Math.max(2000,pickYear-1);renderMonthPop();break;
    case "yearNext":pickYear=Math.min(2099,pickYear+1);renderMonthPop();break;
    case "tipo":movTipo=id==="ingreso"?"ingreso":"gasto";try{localStorage.setItem("fin.mov",movTipo)}catch(_){ }
      if(document.activeElement&&document.activeElement.blur)document.activeElement.blur();render();break;
    case "goMov":{
      movTipo=id==="ingreso"?"ingreso":"gasto";tab="movimientos";
      try{localStorage.setItem("fin.mov",movTipo);localStorage.setItem("fin.tab",tab)}catch(_){ }
      render();window.scrollTo(0,0);playTab("go-r");
      setTimeout(()=>{const i=document.getElementById("mv-monto");if(i)i.focus({preventScroll:true});},60);break;}
    case "pagar":{const m=month(cur);m.pagados={...m.pagados};if(b.checked)m.pagados[id]=true;else delete m.pagados[id];months[cur]={...months[cur],...m};saveMonth(cur);render();break;}
    case "delMov":{if(!confirmClick(b))return;const m=month(cur);const x=m.movs.find(v=>v.id===id);if(!x)return;
      if(x.metaId){const g=cfg.metas.find(g=>g.id===x.metaId);if(g){g.ahorrado=Math.max(0,g.ahorrado-x.monto);saveCfg();}}
      if(x.deudaId){const d=cfg.deudas.find(d=>d.id===x.deudaId);if(d){d.saldo+=x.monto;saveCfg();}}
      months[cur]={...months[cur],movs:m.movs.filter(v=>v.id!==id),pagados:m.pagados};saveMonth(cur);render();toast("Movimiento borrado");break;}
    case "resetSalMes":{const m=month(cur);const n={...months[cur]};delete n.salarioMes;months[cur]=n;saveMonth(cur);render();toast("Ahora usa el salario base");break;}
    case "delFijo":if(!confirmClick(b))return;cfg.fijos=cfg.fijos.filter(f=>f.id!==id);saveCfg();render();toast("Pago fijo quitado");break;
    case "delMeta":if(!confirmClick(b))return;cfg.metas=cfg.metas.filter(f=>f.id!==id);saveCfg();render();toast("Meta eliminada");break;
    case "delDeuda":if(!confirmClick(b))return;cfg.deudas=cfg.deudas.filter(f=>f.id!==id);saveCfg();render();toast("Deuda eliminada");break;
  }
});

function addMov(k,mov){const m=month(k);months[k]={...months[k],movs:[...m.movs,mov],pagados:m.pagados};return saveMonth(k);}

document.addEventListener("submit",e=>{
  const f=e.target.closest("form[data-form]");if(!f)return;e.preventDefault();
  const fd=Object.fromEntries(new FormData(f));const id=f.dataset.id;
  switch(f.dataset.form){
    case "apay":{
      const p=pend.find(x=>x.id===id);if(!p)return;
      const v=num(fd.monto);if(v<=0)return toast("Escribe un monto mayor a cero.");
      const cat=gastoCats().includes(fd.cat)?fd.cat:"Otros";
      let fecha=ymd(p.creado);if(!/^20\d\d-\d\d-\d\d$/.test(fecha))fecha=cur+"-01";
      rememberCat(p.comercio,cat);
      const mv={id:uidv(),tipo:"gasto",monto:v,cat,desc:p.comercio||"Pago con Apple Pay",fecha};if(fd.esp==="1")mv.esp=true;
      addMov(fecha.slice(0,7),mv);
      const rd=aplicarRedondeo(v,mv.desc,fecha);
      dropPend(id);toast("Gasto registrado"+(rd?` · ${money(rd.diff)} al ahorro de ${rd.nombre}`:""));return;}
    case "cat":{addCat(fd.nombre,fd.tipo);f.reset();return;}
    case "pass":changePassword(f,fd);return;
    case "perfil":{const p=cfg.perfil,lim={nombre:60,apodo:30,telefono:20,nacimiento:10,ciudad:60};
      Object.keys(lim).forEach(k=>{p[k]=str(String(fd[k]||"").trim(),lim[k]);});
      if(!/^\d{4}-\d{2}-\d{2}$/.test(p.nacimiento))p.nacimiento="";
      saveCfg();updateTop();toast("Perfil guardado");return;}
    case "bienvenida":{const n=str(String(fd.nombre||"").trim(),60);if(!n)return toast("Escribe tu nombre o toca Ahora no.");
      cfg.perfil.nombre=n;saveCfg();updateTop();closeLayer($("welcome"));toast("Encantado, "+firstName());return;}
    case "salario":{const v=num(fd.salario);if(v<=0)return toast("Escribe un salario mayor a cero.");cfg.salario=v;saveCfg();toast("Salario base guardado");break;}
    case "salarioMes":{const v=num(fd.salario);if(v<0)return toast("Escribe un salario válido.");const m=month(cur);months[cur]={...months[cur],movs:m.movs,pagados:m.pagados,salarioMes:v};saveMonth(cur);toast("Salario de "+mName(cur)+" guardado");break;}
    case "mov":{const v=num(fd.monto);if(v<=0)return toast("Escribe un monto mayor a cero.");const fecha=fd.fecha||cur+"-01";const k=fecha.slice(0,7);
      const mv={id:uidv(),tipo:movTipo,monto:v,cat:fd.cat,desc:(fd.desc||"").trim(),fecha};if(movTipo==="gasto"&&fd.esp==="1")mv.esp=true;
      addMov(k,mv);if(k!==cur)cur=k;
      const rd=movTipo==="gasto"?aplicarRedondeo(v,mv.desc,fecha):null;
      toast((movTipo==="gasto"?"Gasto registrado":"Ingreso registrado")+(rd?` · ${money(rd.diff)} al ahorro de ${rd.nombre}`:""));break;}
    case "fijo":{const v=num(fd.monto);if(v<=0)return toast("Escribe un monto mayor a cero.");cfg.fijos=[...cfg.fijos,{id:uidv(),nombre:fd.nombre.trim(),monto:v,cat:fd.cat,dia:parseInt(fd.dia)||null}];saveCfg();toast("Pago fijo agregado");break;}
    case "meta":{const v=num(fd.objetivo);if(v<=0)return toast("Escribe un objetivo mayor a cero.");cfg.metas=[...cfg.metas,{id:uidv(),nombre:fd.nombre.trim(),objetivo:v,ahorrado:0,fecha:fd.fecha||"",icono:"metas",color:"",redondeo:0}];saveCfg();toast("Meta creada");break;}
    case "aporte":{const v=num(fd.monto);if(v<=0)return toast("Escribe un aporte mayor a cero.");const g=cfg.metas.find(g=>g.id===id);if(!g)return;g.ahorrado+=v;saveCfg();
      addMov(cur,{id:uidv(),tipo:"ahorro",monto:v,cat:"Ahorro",desc:"Aporte: "+g.nombre,fecha:cur===mk(today)?ymd(new Date()):cur+"-01",metaId:g.id});toast("Aporte registrado");break;}
    case "deuda":{const v=num(fd.saldo);if(v<=0)return toast("Escribe un saldo mayor a cero.");cfg.deudas=[...cfg.deudas,{id:uidv(),nombre:fd.nombre.trim(),saldo:v,inicial:v,cuota:num(fd.cuota),tasa:(fd.tasa||"").trim()}];saveCfg();toast("Deuda agregada");break;}
    case "abono":{const v=num(fd.monto);if(v<=0)return toast("Escribe un abono mayor a cero.");const d=cfg.deudas.find(d=>d.id===id);if(!d)return;d.saldo=Math.max(0,d.saldo-v);saveCfg();
      addMov(cur,{id:uidv(),tipo:"gasto",monto:v,cat:"Deudas",desc:"Abono: "+d.nombre,fecha:cur===mk(today)?ymd(new Date()):cur+"-01",deudaId:d.id});toast("Abono registrado");break;}
  }
  f.reset();document.activeElement&&document.activeElement.blur();render();
});

document.addEventListener("change",e=>{
  const el=e.target;if(!el.dataset.pres)return;const v=num(el.value);
  const p={...cfg.presupuestos};if(v>0)p[el.dataset.pres]=v;else delete p[el.dataset.pres];cfg.presupuestos=p;saveCfg();toast("Límite guardado");
});
document.addEventListener("focusout",()=>{setTimeout(()=>{if(pendingRender)render();},0);});

let tt;function toast(msg){const t=document.getElementById("toast");t.textContent=msg;t.hidden=false;clearTimeout(tt);tt=setTimeout(()=>t.hidden=true,2600);}

/* ---------- cuenta ---------- */
let authMode="login";
const $=id=>document.getElementById(id);
function authMsg(text,ok){const m=$("authMsg");m.textContent=text||"";m.className="msg "+(ok?"ok":"err");m.hidden=!text;}
function setAuthMode(mode){
  authMode=mode;authMsg("");
  const t={login:["Inicia sesión para ver tus ingresos y gastos.","Iniciar sesión","No tengo cuenta, quiero registrarme"],
    signup:["Crea tu cuenta. Tus datos solo los ves tú.","Crear cuenta","Ya tengo cuenta, iniciar sesión"],
    forgot:["Te enviamos un enlace a tu correo para crear una contraseña nueva.","Enviar enlace","Volver a iniciar sesión"],
    reset:["Escribe tu contraseña nueva.","Guardar contraseña","Volver a iniciar sesión"]}[mode];
  $("authSub").textContent=t[0];$("authBtn").textContent=t[1];$("authSwitch").textContent=t[2];
  $("emailRow").hidden=mode==="reset";$("passRow").hidden=mode==="forgot";$("authForgot").hidden=mode!=="login";
  $("authPass").autocomplete=mode==="login"?"current-password":"new-password";
}
$("authSwitch").addEventListener("click",()=>setAuthMode(authMode==="login"?"signup":"login"));
$("authForgot").addEventListener("click",()=>setAuthMode("forgot"));
$("authForm").addEventListener("submit",async e=>{
  e.preventDefault();e.stopPropagation();
  if(!sb)return;
  const email=$("authEmail").value.trim(), pass=$("authPass").value;
  if(authMode!=="reset"&&!/^\S+@\S+\.\S+$/.test(email))return authMsg("Escribe un correo válido.");
  if(authMode!=="forgot"&&pass.length<6)return authMsg("La contraseña debe tener al menos 6 caracteres.");
  const btn=$("authBtn");btn.disabled=true;authMsg("");
  try{
    if(authMode==="login"){
      const {error}=await sb.auth.signInWithPassword({email,password:pass});
      if(error)authMsg(/confirm/i.test(error.message)?"Primero confirma tu correo con el enlace que te enviamos.":"Correo o contraseña incorrectos.");
    }else if(authMode==="signup"){
      const {data,error}=await sb.auth.signUp({email,password:pass,options:{emailRedirectTo:location.origin}});
      if(error)authMsg(/registered|exists/i.test(error.message)?"Ese correo ya tiene cuenta. Inicia sesión.":"No se pudo crear la cuenta: "+error.message);
      else if(!data.session){setAuthMode("login");authMsg("Cuenta creada. Revisa tu correo y abre el enlace de confirmación para entrar.",true);}
    }else if(authMode==="forgot"){
      const {error}=await sb.auth.resetPasswordForEmail(email,{redirectTo:location.origin});
      if(error)authMsg("No se pudo enviar el correo. Inténtalo de nuevo en unos minutos.");
      else{setAuthMode("login");authMsg("Si el correo tiene cuenta, te llegó un enlace para cambiar la contraseña.",true);}
    }else if(authMode==="reset"){
      const {error}=await sb.auth.updateUser({password:pass});
      if(error)authMsg("No se pudo cambiar la contraseña: "+error.message);
      else{toast("Contraseña actualizada");showApp();}
    }
  }finally{btn.disabled=false;}
});

function showAuth(){ $("topbar").hidden=true;$("tabs").hidden=true;$("appView").hidden=true;$("authView").hidden=false;document.documentElement.classList.remove("inapp"); }
function showApp(){ $("authView").hidden=true;$("topbar").hidden=false;$("tabs").hidden=false;$("appView").hidden=false;document.documentElement.classList.add("inapp"); }
function setSession(session){
  if(session&&session.user){
    if(authMode==="reset")return;
    userMail=session.user.email||"";$("userEmail").textContent=userMail;
    if(uid!==session.user.id){uid=session.user.id;ready=false;cfg=defCfg();months={};pend=[];showApp();render();loadAll();}
    else showApp();
  }else{
    uid=null;ready=false;cfg=defCfg();months={};pend=[];autoToken="";userMail="";resetLayers();
    $("authPass").value="";setAuthMode("login");showAuth();
    if(notice){authMsg(notice,true);notice="";}
  }
}

/* ---------- seguridad: la sesión se cierra al cerrar la ventana y tras 10 minutos sin actividad ---------- */
const IDLE_MS=10*60*1000,WARN_MS=9*60*1000;
let lastActive=Date.now(),warned=false,notice="";
try{const t=+sessionStorage.getItem("fin.last");if(t>0)lastActive=t;}catch(e){}
function touchActive(){
  const n=Date.now();if(n-lastActive<1000)return;
  lastActive=n;warned=false;try{sessionStorage.setItem("fin.last",String(n));}catch(e){}
}
["pointerdown","keydown","touchstart","wheel","scroll"].forEach(ev=>window.addEventListener(ev,touchActive,{passive:true,capture:true}));
function idleExpired(){return Date.now()-lastActive>IDLE_MS;}
function idleCheck(){
  if(!uid||!sb)return;
  const idle=Date.now()-lastActive;
  if(idle>IDLE_MS){notice="Por seguridad cerramos tu sesión tras 10 minutos sin actividad. Inicia sesión de nuevo.";sb.auth.signOut();return;}
  if(idle>WARN_MS&&!warned){warned=true;toast("Tu sesión se cerrará pronto por inactividad.");}
}
setInterval(idleCheck,15000);

/* ---------- perfil: saludo, avatar y hoja ---------- */
let userMail="",topKey="";
const PROF_FIELDS=["nombre","apodo","telefono","nacimiento","ciudad"];
function emailName(){
  const p=(userMail.split("@")[0]||"").split(/[._+\-]/)[0].replace(/[^\p{L}]/gu,"");
  return p?p.charAt(0).toUpperCase()+p.slice(1).toLowerCase():"";
}
function firstName(){
  const p=cfg.perfil||{};
  return (p.apodo||"").trim()||(p.nombre||"").trim().split(/\s+/)[0]||emailName();
}
function greeting(){
  const h=new Date().getHours(),n=firstName();
  const s=h>=5&&h<12?"Buenos días":h>=12&&h<19?"Buenas tardes":"Buenas noches";
  return n?s+", "+n:s;
}
function initials(){
  const w=(((cfg.perfil||{}).nombre||"").trim()||firstName()).split(/\s+/).filter(Boolean);
  if(!w.length)return "?";
  return ([...w[0]][0]+(w.length>1?[...w[1]][0]:"")).toUpperCase();
}
function hue(s){let h=0;for(const c of s)h=(h*31+c.codePointAt(0))%360;return h;}
function paintAvatar(el){
  const p=cfg.perfil||{};
  if(p.foto){el.innerHTML=`<img src="${esc(p.foto)}" alt="">`;el.style.background="var(--sunk)";}
  else{el.textContent=initials();el.style.background=`hsl(${hue(p.nombre||p.apodo||userMail)} 52% 40%)`;}
}
function updateTop(){
  const p=cfg.perfil||{},g=greeting();
  const key=[g,initials(),(p.foto||"").length,(p.foto||"").slice(-24),p.nombre,userMail].join("|");
  if(key===topKey)return;
  topKey=key;$("greeting").textContent=g;paintAvatar($("topAvatar"));paintAvatar($("profAvatar"));
}

/* capas (hoja de perfil y bienvenida): entran y salen con transición */
const layerTimers=new WeakMap();let layerOpener=null;
function openLayer(el,opener){
  clearTimeout(layerTimers.get(el));layerOpener=opener||null;
  el.hidden=false;void el.offsetWidth;el.classList.add("open");
  document.documentElement.classList.add("noscroll");$("topbar").inert=true;$("appView").inert=true;$("tabs").inert=true;
  const f=el.querySelector("[data-autofocus]");if(f)f.focus({preventScroll:true});
}
function closeLayer(el){
  if(el.hidden||!el.classList.contains("open"))return;
  el.classList.remove("open");
  layerTimers.set(el,setTimeout(()=>{el.hidden=true;},300));
  document.documentElement.classList.remove("noscroll");$("topbar").inert=false;$("appView").inert=false;$("tabs").inert=false;
  if(layerOpener&&layerOpener.focus)layerOpener.focus({preventScroll:true});layerOpener=null;
}
function resetLayers(){
  document.querySelectorAll(".layer").forEach(el=>{clearTimeout(layerTimers.get(el));el.classList.remove("open");el.hidden=true;});
  document.documentElement.classList.remove("noscroll");$("topbar").inert=false;$("appView").inert=false;$("tabs").inert=false;
  crop.img=null;$("cropBox").hidden=true;$("passBox").hidden=true;$("autoBox").hidden=true;$("profMain").hidden=false;
}
/* selector de meses: cuadrícula de 12 meses que sale de la píldora */
let pickYear=0,popOpen=false;
function renderMonthPop(){
  const nowK=mk(today),cap=s=>s.charAt(0).toUpperCase()+s.slice(1);
  $("pickYearLabel").textContent=pickYear;
  document.querySelector('#monthPop [data-act="yearPrev"]').disabled=pickYear<=2000;
  document.querySelector('#monthPop [data-act="yearNext"]').disabled=pickYear>=2099;
  $("monthGrid").innerHTML=Array.from({length:12},(_,i)=>{
    const k=pickYear+"-"+String(i+1).padStart(2,"0"),has=months[k]&&months[k].movs&&months[k].movs.length;
    return `<button type="button" class="mcell${k===nowK?" now":""}${k===cur?" on":""}" data-act="pickMonth" data-id="${k}" aria-pressed="${k===cur}">${cap(mName(k,true).replace(".","").slice(0,3))}${has?`<i class="dot" aria-hidden="true"></i>`:""}</button>`;
  }).join("");
}
function openMonthPop(){
  pickYear=+cur.slice(0,4);renderMonthPop();
  $("monthPop").hidden=false;$("monthLabel").setAttribute("aria-expanded","true");popOpen=true;
  const on=$("monthGrid").querySelector(".on");if(on)on.focus({preventScroll:true});
}
function closeMonthPop(focusBack){
  if(!popOpen)return;
  popOpen=false;$("monthPop").hidden=true;$("monthLabel").setAttribute("aria-expanded","false");
  if(focusBack)$("monthLabel").focus({preventScroll:true});
}
document.addEventListener("click",e=>{if(popOpen&&!e.target.closest(".month-pill"))closeMonthPop();},true);

document.addEventListener("keydown",e=>{
  if(e.key!=="Escape")return;
  if(story){closeStory();return;}
  if(editing){exitEdit();return;}
  if(popOpen){closeMonthPop(true);return;}
  if(!$("cropBox").hidden){cancelCrop();return;}
  if(!$("passBox").hidden){closePass();return;}
  if(!$("autoBox").hidden){closeAuto();return;}
  const sheet=document.querySelector(".layer.open:not(.center)");
  if(sheet)closeLayer(sheet);
  else if($("welcome").classList.contains("open")){cfg.perfil.omitido=true;saveCfg();closeLayer($("welcome"));}
});

function updateProfPhotoUI(){
  paintAvatar($("profAvatar"));
  $("quitarFotoBtn").hidden=!cfg.perfil.foto;
  $("pickFotoBtn").textContent=cfg.perfil.foto?"Cambiar foto":"Subir foto";
}
function openProfile(opener){
  if(!ready){toast("Espera a que carguen tus datos.");return;}
  const f=$("profForm");
  PROF_FIELDS.forEach(k=>{f.elements[k].value=cfg.perfil[k]||"";});
  f.elements.nacimiento.max=new Date().toISOString().slice(0,10);
  $("cropBox").hidden=true;$("passBox").hidden=true;$("autoBox").hidden=true;$("profMain").hidden=false;updateProfPhotoUI();
  openLayer($("profileSheet"),opener);refreshAuto();
}
function maybeWelcome(){
  const p=cfg.perfil;
  if(p.nombre||p.omitido||!$("welcome").hidden||!$("profileSheet").hidden)return;
  openLayer($("welcome"),null);
}

/* cerrar la hoja arrastrándola hacia abajo (solo en pantallas angostas) */
document.querySelectorAll(".layer:not(.center)").forEach(layer=>{
  const sheet=layer.querySelector(".sheet"),head=layer.querySelector(".sheet-head");
  let d=null;
  head.addEventListener("pointerdown",e=>{
    if(!matchMedia("(max-width:699px)").matches||e.target.closest("button"))return;
    d={id:e.pointerId,y:e.clientY,t:performance.now(),dy:0};head.setPointerCapture(e.pointerId);sheet.style.transition="none";
  });
  head.addEventListener("pointermove",e=>{
    if(!d||e.pointerId!==d.id)return;
    const dy=e.clientY-d.y;d.dy=dy>0?dy:dy/6;sheet.style.transform=`translateY(${d.dy}px)`;
  });
  const end=e=>{
    if(!d||e.pointerId!==d.id)return;
    const v=d.dy/Math.max(1,performance.now()-d.t),shut=d.dy>sheet.offsetHeight*0.35||(d.dy>40&&v>0.11);
    d=null;sheet.style.transition="";sheet.style.transform="";
    if(shut)closeLayer(layer);
  };
  head.addEventListener("pointerup",end);head.addEventListener("pointercancel",end);
});

/* foto: se elige, se encuadra dentro de un círculo y se guarda reducida (256 px) */
const crop={img:null,w:0,h:0,base:1,zoom:1,x:0,y:0,vp:260};
function paintCrop(){
  const s=crop.base*crop.zoom,mx=Math.max(0,(crop.w*s-crop.vp)/2),my=Math.max(0,(crop.h*s-crop.vp)/2);
  crop.x=Math.min(mx,Math.max(-mx,crop.x));crop.y=Math.min(my,Math.max(-my,crop.y));
  const el=$("cropImg");el.style.width=crop.w*s+"px";el.style.height=crop.h*s+"px";
  el.style.transform=`translate(-50%,-50%) translate(${crop.x}px,${crop.y}px)`;
}
function startCrop(img){
  crop.img=img;crop.w=img.naturalWidth;crop.h=img.naturalHeight;
  $("profMain").hidden=true;$("cropBox").hidden=false;
  crop.vp=$("cropVp").clientWidth||260;crop.base=Math.max(crop.vp/crop.w,crop.vp/crop.h);
  crop.zoom=1;crop.x=0;crop.y=0;$("cropZoom").value=1;$("cropImg").src=img.src;paintCrop();
}
function cancelCrop(){crop.img=null;$("cropImg").removeAttribute("src");$("cropBox").hidden=true;$("profMain").hidden=false;}
function cropDone(){
  if(!crop.img)return;
  const OUT=256,k=OUT/crop.vp,s=crop.base*crop.zoom;
  const c=document.createElement("canvas");c.width=c.height=OUT;
  const g=c.getContext("2d");g.fillStyle="#fff";g.fillRect(0,0,OUT,OUT);g.imageSmoothingQuality="high";
  g.drawImage(crop.img,(crop.vp/2+crop.x-crop.w*s/2)*k,(crop.vp/2+crop.y-crop.h*s/2)*k,crop.w*s*k,crop.h*s*k);
  let q=.85,url=c.toDataURL("image/jpeg",q);
  while(url.length>60000&&q>.4){q-=.1;url=c.toDataURL("image/jpeg",q);}
  if(url.length>60000)return toast("La foto es muy pesada. Prueba con otra.");
  cfg.perfil.foto=url;saveCfg();cancelCrop();updateProfPhotoUI();updateTop();toast("Foto guardada");
}
$("fotoInput").addEventListener("change",e=>{
  const f=e.target.files&&e.target.files[0];e.target.value="";
  if(!f)return;
  if(!/^image\/(jpeg|png|webp)$/.test(f.type))return toast("Usa una imagen JPG, PNG o WebP.");
  if(f.size>10*1024*1024)return toast("La imagen pesa más de 10 MB.");
  const r=new FileReader();
  r.onload=()=>{const img=new Image();img.onload=()=>startCrop(img);img.onerror=()=>toast("No se pudo leer la imagen.");img.src=r.result;};
  r.onerror=()=>toast("No se pudo leer la imagen.");
  r.readAsDataURL(f);
});
(function(){
  const vp=$("cropVp");let d=null;
  vp.addEventListener("pointerdown",e=>{d={id:e.pointerId,sx:e.clientX,sy:e.clientY,x:crop.x,y:crop.y};vp.setPointerCapture(e.pointerId);});
  vp.addEventListener("pointermove",e=>{if(!d||e.pointerId!==d.id)return;crop.x=d.x+e.clientX-d.sx;crop.y=d.y+e.clientY-d.sy;paintCrop();});
  const end=e=>{if(d&&e.pointerId===d.id)d=null;};
  vp.addEventListener("pointerup",end);vp.addEventListener("pointercancel",end);
  vp.addEventListener("wheel",e=>{e.preventDefault();crop.zoom=Math.min(3,Math.max(1,crop.zoom-e.deltaY*0.002));$("cropZoom").value=crop.zoom;paintCrop();},{passive:false});
  $("cropZoom").addEventListener("input",e=>{crop.zoom=+e.target.value;paintCrop();});
})();

/* ---------- apariencia: tema y color de la app ---------- */
const PALETAS=[["azul","Azul","#2f5bea"],["violeta","Violeta","#7a5cfa"],["rosa","Rosa","#d6336c"],["coral","Coral","#e5584b"],
  ["naranja","Naranja","#d97706"],["verde","Verde","#1e8e5a"],["turquesa","Turquesa","#0e8f9c"],["grafito","Grafito","#3b4252"]];
const hexRgb=h=>[1,3,5].map(i=>parseInt(h.slice(i,i+2),16));
const rgbHex=a=>"#"+a.map(v=>Math.round(Math.max(0,Math.min(255,v))).toString(16).padStart(2,"0")).join("");
function lum(hex){const [r,g,b]=hexRgb(hex).map(v=>{v/=255;return v<=.03928?v/12.92:Math.pow((v+.055)/1.055,2.4);});return .2126*r+.7152*g+.0722*b;}
const ratio=(a,b)=>{const x=lum(a),y=lum(b);return (Math.max(x,y)+.05)/(Math.min(x,y)+.05);};
function toHsl(hex){
  const [r,g,b]=hexRgb(hex).map(v=>v/255),mx=Math.max(r,g,b),mn=Math.min(r,g,b),l=(mx+mn)/2,d=mx-mn;
  let h=0,s=0;
  if(d){s=d/(1-Math.abs(2*l-1));h=mx===r?(g-b)/d+(g<b?6:0):mx===g?(b-r)/d+2:(r-g)/d+4;h*=60;}
  return [h,s,l];
}
function fromHsl(h,s,l){
  const c=(1-Math.abs(2*l-1))*s,x=c*(1-Math.abs((h/60)%2-1)),m=l-c/2;
  const [r,g,b]=h<60?[c,x,0]:h<120?[x,c,0]:h<180?[0,c,x]:h<240?[0,x,c]:h<300?[x,0,c]:[c,0,x];
  return rgbHex([r+m,g+m,b+m].map(v=>v*255));
}
const mixHex=(a,b,t)=>{const A=hexRgb(a),B=hexRgb(b);return rgbHex(A.map((v,i)=>v*(1-t)+B[i]*t));};
/* aclara u oscurece el color hasta que se lea sobre el fondo (relación de contraste mínima) */
function fixContrast(hex,bg,min,dir){
  const [h,s,l0]=toHsl(hex);let l=l0,c=hex,n=0;
  while(ratio(c,bg)<min&&n++<50){l=Math.max(0,Math.min(1,l+dir*.02));c=fromHsl(h,s,l);}
  return c;
}
const bestInk=hex=>ratio(hex,"#ffffff")>=ratio(hex,"#0b1230")?"#ffffff":"#0b1230";
function deriveLook(hex){
  const [h,s,l]=toHsl(hex),dk=fromHsl(h,s,Math.max(l,.66));
  return {light:{accent:hex,ink:bestInk(hex),soft:mixHex(hex,"#ffffff",.88),fg:fixContrast(hex,"#ffffff",4.5,-1)},
    dark:{accent:dk,ink:bestInk(dk),soft:mixHex(dk,"#1c1f28",.78),fg:fixContrast(dk,"#1c1f28",4.5,1)}};
}
function lookHex(a){return a.paleta==="personal"?a.acento:(PALETAS.find(p=>p[0]===a.paleta)||PALETAS[0])[2];}
function lookCss(a){
  if(a.paleta==="azul")return "";
  const d=deriveLook(lookHex(a)),v=t=>`--accent:${t.accent};--accent-ink:${t.ink};--accent-soft:${t.soft};--accent-fg:${t.fg};`;
  return `:root{${v(d.light)}}@media (prefers-color-scheme: dark){:root:not([data-theme="light"]){${v(d.dark)}}}:root[data-theme="light"]{${v(d.light)}}:root[data-theme="dark"]{${v(d.dark)}}`;
}
function applyTheme(t){
  const r=document.documentElement;
  if(t==="claro")r.dataset.theme="light";else if(t==="oscuro")r.dataset.theme="dark";else delete r.dataset.theme;
  const col=t==="claro"?"#ffffff":t==="oscuro"?"#1c1f28":null;
  document.querySelectorAll('meta[name="theme-color"]').forEach(m=>{if(!m.dataset.def)m.dataset.def=m.content;m.content=col||m.dataset.def;});
}
function syncLookUI(){
  const a=cfg.apariencia;
  document.querySelectorAll('[data-act="tema"]').forEach(b=>b.setAttribute("aria-pressed",String(b.dataset.id===a.tema)));
  document.querySelectorAll('[data-act="paleta"]').forEach(b=>{const on=b.dataset.id===a.paleta;b.setAttribute("aria-pressed",String(on));b.classList.toggle("on",on);});
  const cu=$("swCustom"),on=a.paleta==="personal";
  cu.classList.toggle("on",on);cu.style.background=on?a.acento:"";if(a.acento)$("acentoInput").value=a.acento;
  let adj=false;
  if(a.paleta!=="azul"){const d=deriveLook(lookHex(a));adj=d.light.fg!==d.light.accent||d.dark.fg!==d.dark.accent;}
  $("lookNote").hidden=!adj;
}
function applyLook(){
  const a=cfg.apariencia;
  applyTheme(a.tema);
  let el=document.getElementById("lookStyle");
  if(!el){el=document.createElement("style");el.id="lookStyle";document.head.appendChild(el);}
  el.textContent=lookCss(a);
  syncLookUI();
  try{localStorage.setItem("fin.look",JSON.stringify(a));}catch(_){}
}
function setLook(patch){Object.assign(cfg.apariencia,patch);applyLook();saveCfg();}
(function(){
  $("swatches").innerHTML=PALETAS.map(([id,n,c])=>`<button type="button" class="sw" data-act="paleta" data-id="${id}" style="background:${c}" aria-label="${n}" aria-pressed="false"></button>`).join("")
    +`<label class="sw custom" id="swCustom" title="Otro color"><input type="color" id="acentoInput" aria-label="Elegir otro color" value="#2f5bea"></label>`;
  const ci=$("acentoInput");
  ci.addEventListener("input",()=>{Object.assign(cfg.apariencia,{paleta:"personal",acento:ci.value.toLowerCase()});applyLook();});
  ci.addEventListener("change",()=>{saveCfg();});
  try{const s=localStorage.getItem("fin.look");if(s)cfg.apariencia=cleanApariencia(JSON.parse(s));}catch(_){}
  applyLook();
})();

/* ---------- perfil: categorías, exportar y contraseña ---------- */
function renderCatList(){
  const h=new Set(cfg.categorias.ocultas);
  const row=(n,propia)=>{
    const off=h.has(n),fijo=n==="Otros";
    return `<div class="catrow${off?" off":""}"><span class="nm">${esc(n)}${propia?` <small>propia</small>`:""}</span>`
      +(fijo?"":`<button type="button" class="icon" data-act="catToggle" data-id="${esc(n)}">${off?"Mostrar":"Ocultar"}</button>`)
      +(propia?`<button type="button" class="icon" data-act="catDel" data-id="${esc(n)}">Quitar</button>`:"")+`</div>`;
  };
  const grupo=(t,base,extra)=>`<div class="catgroup"><h4>${t}</h4>${base.map(n=>row(n,false)).join("")}${extra.map(n=>row(n,true)).join("")}</div>`;
  $("catList").innerHTML=grupo("Gastos",CATS.filter(c=>c!=="Ahorro"),cfg.categorias.gasto)+grupo("Ingresos extra",INCATS.filter(c=>c!=="Otros"),cfg.categorias.ingreso);
}
function catsChanged(){saveCfg();renderCatList();render();}
function toggleCat(n){
  if(n==="Otros"||n==="Ahorro")return;
  const all=[...CATS,...INCATS,...cfg.categorias.gasto,...cfg.categorias.ingreso];
  if(!all.includes(n))return;
  const o=cfg.categorias.ocultas;
  cfg.categorias.ocultas=o.includes(n)?o.filter(x=>x!==n):[...o,n];
  catsChanged();
}
function delCat(n){
  const c=cfg.categorias;
  if(!c.gasto.includes(n)&&!c.ingreso.includes(n))return;
  c.gasto=c.gasto.filter(x=>x!==n);c.ingreso=c.ingreso.filter(x=>x!==n);c.ocultas=c.ocultas.filter(x=>x!==n);
  const p={...cfg.presupuestos};delete p[n];cfg.presupuestos=p;
  catsChanged();toast("Categoría quitada");
}
function addCat(nombre,tipo){
  const n=String(nombre??"").replace(/[\u0000-\u001f<>]/g,"").replace(/\s+/g," ").trim().slice(0,30);
  if(n.length<2)return toast("Escribe un nombre de al menos 2 letras.");
  const t=tipo==="ingreso"?"ingreso":"gasto",c=cfg.categorias;
  if([...CATS,...INCATS,...c.gasto,...c.ingreso].some(x=>x.toLowerCase()===n.toLowerCase()))return toast("Ya existe una categoría con ese nombre.");
  if(c[t].length>=30)return toast("Llegaste al máximo de 30 categorías propias.");
  c[t]=[...c[t],n];catsChanged();toast("Categoría agregada");
}

/* exportar: CSV para Excel en español (separador ; y BOM) y respaldo completo en JSON */
function fillExportRange(){
  const ys=[...new Set(Object.keys(months).filter(k=>months[k].movs&&months[k].movs.length).map(k=>k.slice(0,4)))].sort().reverse();
  $("expRange").innerHTML=`<option value="todo">Todo el historial</option>`+ys.map(y=>`<option value="${y}">Año ${y}</option>`).join("");
}
function csvCell(v){
  let s=String(v??"");
  if(/^[=+\-@\t\r]/.test(s))s="'"+s;
  return /[;"\n\r]/.test(s)?'"'+s.replace(/"/g,'""')+'"':s;
}
async function saveFile(name,mime,text){return shareBlob(name,mime,new Blob([text],{type:mime+";charset=utf-8"}));}
async function shareBlob(name,mime,blob){
  if(matchMedia("(pointer:coarse)").matches){
    try{
      const file=new File([blob],name,{type:mime});
      if(navigator.canShare&&navigator.canShare({files:[file]})){await navigator.share({files:[file],title:name});return;}
    }catch(e){if(e&&e.name==="AbortError")return;}
  }
  const url=URL.createObjectURL(blob),a=document.createElement("a");
  a.href=url;a.download=name;document.body.appendChild(a);a.click();a.remove();
  setTimeout(()=>URL.revokeObjectURL(url),4000);
}
function exportCsv(){
  const r=$("expRange").value,tipos={gasto:"Gasto",ingreso:"Ingreso",ahorro:"Ahorro"};
  const rows=[];
  Object.keys(months).sort().filter(k=>r==="todo"||k.startsWith(r+"-")).forEach(k=>{
    (months[k].movs||[]).slice().sort((a,b)=>(a.fecha||"").localeCompare(b.fecha||"")).forEach(x=>{
      rows.push([x.fecha||k+"-01",tipos[x.tipo]||x.tipo,x.cat,x.desc,String(x.monto).replace(".",",")].map(csvCell).join(";"));
    });
  });
  if(!rows.length)return toast("No hay movimientos para exportar.");
  saveFile("mis-finanzas-"+r+".csv","text/csv","﻿"+["Fecha;Tipo;Categoría;Descripción;Monto (COP)",...rows].join("\r\n")+"\r\n");
}
function exportJson(){
  const data={app:"mis-finanzas",version:1,exportado:new Date().toISOString(),config:cfg,meses:months};
  saveFile("mis-finanzas-respaldo-"+new Date().toISOString().slice(0,10)+".json","application/json",JSON.stringify(data,null,2));
}

/* pantalla "Cambiar contraseña" dentro del perfil: ojito, medidor de fortaleza y requisitos que se marcan */
const EYE='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/></svg>';
document.querySelectorAll(".eye").forEach(b=>{b.innerHTML=EYE;});
function pwScore(p){
  if(!p)return 0;
  let s=0;if(p.length>=8)s++;if(p.length>=12)s++;
  if(/[A-Za-z]/.test(p)&&/\d/.test(p))s++;
  if(/[^A-Za-z0-9]/.test(p)||(/[a-z]/.test(p)&&/[A-Z]/.test(p)))s++;
  return Math.min(4,s);
}
function pwOk(){
  const p1=$("p1").value,p2=$("p2").value;
  return {len:p1.length>=8,mix:/[A-Za-z]/.test(p1)&&/\d/.test(p1),same:p1.length>0&&p1===p2};
}
function updatePass(){
  const p1=$("p1").value,ok=pwOk(),sc=pwScore(p1);
  document.querySelector("#passForm .meter").dataset.s=sc;
  $("pwLabel").textContent=p1?"Seguridad: "+["muy débil","débil","aceptable","buena","fuerte"][sc]:"Escribe una contraseña";
  document.querySelectorAll("#pwReqs li").forEach(li=>li.classList.toggle("ok",ok[li.dataset.req]));
  $("passSave").disabled=!(ok.len&&ok.mix&&ok.same);
}
function toggleEye(b){
  const inp=$(b.dataset.id),show=inp.type==="password";
  inp.type=show?"text":"password";b.setAttribute("aria-pressed",String(show));b.setAttribute("aria-label",show?"Ocultar contraseña":"Mostrar contraseña");
}
function resetPassForm(){
  $("passForm").reset();
  document.querySelectorAll("#passForm .eye").forEach(b=>{$(b.dataset.id).type="password";b.setAttribute("aria-pressed","false");b.setAttribute("aria-label","Mostrar contraseña");});
  updatePass();
}
function openPass(){resetPassForm();$("profMain").hidden=true;$("passBox").hidden=false;$("p1").focus({preventScroll:true});}
function closePass(){resetPassForm();$("passBox").hidden=true;$("profMain").hidden=false;}
$("p1").addEventListener("input",updatePass);$("p2").addEventListener("input",updatePass);
async function changePassword(f,fd){
  const ok=pwOk();
  if(!(ok.len&&ok.mix&&ok.same))return toast("Revisa los requisitos de la contraseña.");
  if(!sb)return;
  const btn=$("passSave");btn.disabled=true;
  try{
    const {error}=await sb.auth.updateUser({password:String(fd.p1)});
    if(error){toast(/different|same/i.test(error.message)?"Usa una contraseña distinta a la actual.":"No se pudo cambiar la contraseña. Inténtalo de nuevo.");}
    else{closePass();toast("Contraseña actualizada");}
  }finally{updatePass();}
}

/* pantalla "Pagos automáticos" (Apple Pay con Atajos) dentro del perfil */
const hex=u8=>[...u8].map(b=>b.toString(16).padStart(2,"0")).join("");
async function refreshAuto(){
  if(!sb||!uid)return;
  const {data,error}=await sb.from("atajo_tokens").select("user_id").limit(1);
  const falta=!!error;
  $("autoWarn").hidden=!falta;
  tieneClave=!falta&&arr(data).length>0;
  $("autoGen").textContent=tieneClave?"Generar una clave nueva":"Generar clave";
  $("autoGen").disabled=falta;
  $("autoStatus").textContent=falta?"Falta un paso en Supabase":tieneClave?"Configurado. Toca para ver cómo se conecta":"Detecta tus pagos y regístralos con un toque";
}
function openAuto(){
  const conf=window.FINANZAS_CONFIG||{};
  $("urlVal").textContent=(conf.supabaseUrl||"")+"/rest/v1/rpc/registrar_pago_atajo";
  $("pubVal").textContent=conf.supabaseAnonKey||"";
  autoToken="";$("keyBox").hidden=true;$("autoTest").hidden=true;
  $("profMain").hidden=true;$("autoBox").hidden=false;
  refreshAuto();
}
function closeAuto(){autoToken="";$("keyVal").textContent="";$("autoBox").hidden=true;$("profMain").hidden=false;refreshAuto();}
async function autoGen(){
  if(!sb||!uid)return;
  const tok=hex(crypto.getRandomValues(new Uint8Array(32)));
  const hash=hex(new Uint8Array(await crypto.subtle.digest("SHA-256",new TextEncoder().encode(tok))));
  const {error}=await sb.from("atajo_tokens").upsert({user_id:uid,token_hash:hash});
  if(error){$("autoWarn").hidden=false;return toast("No se pudo crear la clave. Revisa que ejecutaste el script de Supabase.");}
  autoToken=tok;tieneClave=true;
  $("keyVal").textContent=tok;$("keyBox").hidden=false;$("autoTest").hidden=false;
  $("autoGen").textContent="Generar una clave nueva";
  toast("Clave creada. Cópiala ahora: no se vuelve a mostrar.");
}
async function autoTest(){
  if(!autoToken)return;
  const {data,error}=await sb.rpc("registrar_pago_atajo",{p_token:autoToken,p_monto:"12.345",p_comercio:"Prueba de Mis Finanzas",p_tarjeta:"Apple Pay"});
  if(error||!data||!data.ok)return toast("La prueba falló. Revisa que ejecutaste el script de Supabase.");
  toast("Pago de prueba enviado. Míralo en el Resumen.");loadPending();
}
function copyText(id){
  if(!["keyVal","urlVal","pubVal"].includes(id))return;
  const t=$(id).textContent;if(!t)return;
  (navigator.clipboard?navigator.clipboard.writeText(t):Promise.reject()).then(()=>toast("Copiado"),()=>toast("No se pudo copiar. Mantén presionado el texto para copiarlo."));
}

/* "Más secciones" (celular): pagos fijos, deudas e historial */
function openMore(opener){
  const m=month(cur),pend=cfg.fijos.filter(f=>!m.pagados[f.id]).length,saldo=sum(cfg.deudas.map(d=>d.saldo));
  const rows=[["fijos","Pagos fijos",cfg.fijos.length?(pend?pend+(pend===1?" pendiente":" pendientes")+" este mes":"Todos pagados"):"Sin pagos fijos"],
    ["deudas","Deudas",cfg.deudas.length?"Saldo total "+money(saldo):"Sin deudas"],["historial","Historial","Últimos 6 meses y exportar"],
    ["logros","Rachas y logros",rachaInfo().streak+(rachaInfo().streak===1?" día":" días")+" de racha"]];
  $("moreList").innerHTML=rows.map(([id,n,s])=>`<button type="button" class="morerow" data-act="tab" data-id="${id}">${svg(id)}<span class="nm">${n}<small>${esc(s)}</small></span><span class="chev" aria-hidden="true">&rsaquo;</span></button>`).join("");
  openLayer($("moreSheet"),opener);
}

/* ---------- arranque ---------- */
renderTabs();
(async()=>{
  const conf=window.FINANZAS_CONFIG||{};
  if(!window.supabase||!conf.supabaseUrl||/TU-PROYECTO/.test(conf.supabaseUrl)){
    showAuth();authMsg("Falta configurar la conexión a Supabase en el archivo config.js.");$("authForm").hidden=true;$("authSwitch").hidden=true;$("authForgot").hidden=true;return;
  }
  /* la sesión vive en sessionStorage: desaparece al cerrar la ventana o la app. Si no estuviera disponible, queda solo en memoria. */
  const authStore=(()=>{
    try{const s=window.sessionStorage;s.setItem("fin.t","1");s.removeItem("fin.t");return s;}
    catch(e){const m={};return {getItem:k=>(k in m?m[k]:null),setItem:(k,v)=>{m[k]=String(v);},removeItem:k=>{delete m[k];}};}
  })();
  try{Object.keys(localStorage).filter(k=>/^sb-.*-(auth-token|code-verifier)/.test(k)).forEach(k=>localStorage.removeItem(k));}catch(e){}
  sb=window.supabase.createClient(conf.supabaseUrl,conf.supabaseAnonKey,{auth:{storage:authStore,persistSession:true,autoRefreshToken:true,detectSessionInUrl:true}});
  sb.auth.onAuthStateChange((event,session)=>{
    if(event==="PASSWORD_RECOVERY"){showAuth();setAuthMode("reset");return;}
    setTimeout(()=>{setSession(session);if(session&&session.user)idleCheck();},0);
  });
  const {data}=await sb.auth.getSession();
  setSession(data.session);
})();

/* sincronizar al volver a la app (otro dispositivo pudo cambiar datos) */
document.addEventListener("visibilitychange",()=>{
  if(document.visibilityState!=="visible")return;
  idleCheck();if(idleExpired())return;
  if(uid&&ready&&pending===0)loadAll();
});

/* instalable como app */
if("serviceWorker" in navigator){window.addEventListener("load",()=>navigator.serviceWorker.register("/sw.js").catch(()=>{}));}
