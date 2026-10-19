// Mis Finanzas - lógica de la app
const CATS=["Vivienda","Servicios","Comida","Transporte","Salud","Educación","Entretenimiento","Ropa","Suscripciones","Deudas","Ahorro","Otros"];
const INCATS=["Salario extra","Freelance","Ventas","Bonificación","Intereses","Otros"];
const TABS=[["resumen","Resumen"],["movimientos","Movimientos"],["fijos","Pagos fijos"],["presupuestos","Presupuestos"],["metas","Metas de ahorro"],["deudas","Deudas"],["historial","Historial"]];
let sb=null, uid=null, ready=false, offline=false, pending=0;
let cfg=defCfg(), months={};
const today=new Date();
let cur=mk(today), tab="resumen", movTipo="gasto", pendingRender=false;
try{const t=localStorage.getItem("fin.tab"); if(t&&TABS.some(x=>x[0]===t)) tab=t;}catch(e){}

function defCfg(){return {salario:0,fijos:[],presupuestos:{},metas:[],deudas:[],perfil:{nombre:"",apodo:"",telefono:"",nacimiento:"",ciudad:"",foto:"",omitido:false},apariencia:{tema:"auto",paleta:"azul",acento:""}};}
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
function saveCfg(){return write("config",JSON.parse(JSON.stringify(cfg)));}
function saveMonth(k){
  const m=month(k);
  const body={movs:m.movs,pagados:m.pagados,salario:+cfg.salario||0,fijosTotal:sum(cfg.fijos.map(f=>f.monto))};
  if(m.salarioMes!=null)body.salarioMes=m.salarioMes;
  if(k<mk(today)&&months[k]&&months[k].salario!==undefined){body.salario=months[k].salario;body.fijosTotal=months[k].fijosTotal;}
  months[k]=body;
  return write("m-"+k,JSON.parse(JSON.stringify(body)));
}
async function loadAll(){
  const who=uid;
  const {data,error}=await sb.from(TABLE).select("doc_id,data");
  if(who!==uid)return;
  if(error){offline=true;render();return;}
  const c=defCfg(), ms={};
  (data||[]).forEach(r=>{if(r.doc_id==="config")Object.assign(c,cleanCfg(r.data||{}));else if(/^m-\d{4}-\d{2}$/.test(r.doc_id))ms[r.doc_id.slice(2)]=cleanMonth(r.data||{});});
  cfg=c;months=ms;offline=false;ready=true;applyLook();render();maybeWelcome();
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
function cleanCfg(c){
  const pres={};Object.entries(c.presupuestos&&typeof c.presupuestos==="object"?c.presupuestos:{}).forEach(([k,v])=>{if(CATS.includes(k))pres[k]=n0(v);});
  return {salario:n0(c.salario),presupuestos:pres,perfil:cleanPerfil(c.perfil),apariencia:cleanApariencia(c.apariencia),
    fijos:arr(c.fijos).map(f=>({id:safeId(f.id),nombre:str(f.nombre),monto:n0(f.monto),cat:str(f.cat,40),dia:Math.min(31,Math.max(0,parseInt(f.dia)||0))||null})),
    metas:arr(c.metas).map(g=>({id:safeId(g.id),nombre:str(g.nombre),objetivo:n0(g.objetivo),ahorrado:n0(g.ahorrado),fecha:/^\d{4}-\d{2}$/.test(g.fecha)?g.fecha:""})),
    deudas:arr(c.deudas).map(d=>({id:safeId(d.id),nombre:str(d.nombre),saldo:n0(d.saldo),inicial:n0(d.inicial),cuota:n0(d.cuota),tasa:str(d.tasa,10)}))};
}
function cleanMonth(m){
  const o={movs:arr(m.movs).map(x=>{const r={id:safeId(x.id),tipo:["gasto","ingreso","ahorro"].includes(x.tipo)?x.tipo:"gasto",monto:n0(x.monto),cat:str(x.cat,40),desc:str(x.desc),fecha:/^\d{4}-\d{2}-\d{2}$/.test(x.fecha)?x.fecha:""};
      if(x.metaId)r.metaId=safeId(x.metaId);if(x.deudaId)r.deudaId=safeId(x.deudaId);return r;}),pagados:{}};
  Object.keys(m.pagados&&typeof m.pagados==="object"?m.pagados:{}).forEach(k=>{if(/^[a-z0-9]{1,40}$/i.test(k))o.pagados[k]=true;});
  if(m.salario!=null)o.salario=n0(m.salario);if(m.fijosTotal!=null)o.fijosTotal=n0(m.fijosTotal);if(m.salarioMes!=null)o.salarioMes=n0(m.salarioMes);
  return o;
}

/* ---------- render ---------- */
function renderTabs(){
  document.getElementById("tabs").innerHTML=TABS.map(([id,l])=>`<button class="tab" role="tab" aria-selected="${id===tab}" data-act="tab" data-id="${id}">${l}</button>`).join("");
  const ml=mName(cur);document.getElementById("monthLabel").textContent=ml.charAt(0).toUpperCase()+ml.slice(1);
}
function render(){
  updateTop();
  const a=document.activeElement;
  if(a&&document.getElementById("app").contains(a)&&/INPUT|SELECT/.test(a.tagName)&&a.type!=="checkbox"){pendingRender=true;return;}
  pendingRender=false;renderTabs();
  const app=document.getElementById("app");
  if(offline){app.innerHTML=`<div class="notice">No se pudieron cargar tus datos. Revisa tu conexión a internet y vuelve a abrir la app.</div>`;return;}
  if(!ready){app.innerHTML=`<div class="empty">Cargando tus datos...</div>`;return;}
  app.innerHTML=({resumen:vResumen,movimientos:vMov,fijos:vFijos,presupuestos:vPres,metas:vMetas,deudas:vDeudas,historial:vHist})[tab]();
}

function kpis(k){
  const t=totals(k);
  const pct=t.ingresos?Math.round((t.ahorro/t.ingresos)*100):0;
  return `<section class="kpis">
    <div class="kpi"><span class="lbl">Ingresos del mes</span><span class="val">${money(t.ingresos)}</span><span class="note">Salario ${money(t.salario)} + otros ${money(t.extra)}</span></div>
    <div class="kpi"><span class="lbl">Egresos</span><span class="val">${money(t.egresos)}</span><span class="note">Fijos ${money(t.fijos)} · variables ${money(t.gastos)}</span></div>
    <div class="kpi"><span class="lbl">Ahorrado</span><span class="val">${money(t.ahorro)}</span><span class="note">${pct}% de tus ingresos</span></div>
    <div class="kpi ${t.disp<0?"neg":"hero"}"><span class="lbl">Disponible</span><span class="val">${money(t.disp)}</span><span class="note">${t.disp<0?"Gastas más de lo que ganas este mes":"Lo que te queda para el resto del mes"}</span></div>
  </section>`;
}

function movForm(){
  const cats=movTipo==="ingreso"?INCATS:CATS.filter(c=>c!=="Ahorro");
  const def=cur===mk(today)?today.toISOString().slice(0,10):cur+"-01";
  return `<form class="row" data-form="mov">
    <div class="seg" role="group" aria-label="Tipo">
      <button type="button" data-act="tipo" data-id="gasto" aria-pressed="${movTipo==="gasto"}">Gasto</button>
      <button type="button" data-act="tipo" data-id="ingreso" aria-pressed="${movTipo==="ingreso"}">Ingreso extra</button>
    </div>
    <label class="f">Monto (COP)<input id="mv-monto" name="monto" inputmode="numeric" placeholder="45000" required></label>
    <label class="f">Categoría<select id="mv-cat" name="cat">${cats.map(c=>`<option>${c}</option>`).join("")}</select></label>
    <label class="f wide">Descripción<input id="mv-desc" name="desc" placeholder="${movTipo==="gasto"?"Almuerzo, Uber, mercado...":"Proyecto freelance, venta..."}"></label>
    <label class="f">Fecha<input id="mv-fecha" name="fecha" type="date" value="${def}"></label>
    <button class="btn">Agregar</button>
  </form>`;
}

function vResumen(){
  const t=totals(cur), m=month(cur), sp=spentByCat(cur);
  const pend=cfg.fijos.filter(f=>!m.pagados[f.id]);
  const noSal=!(+cfg.salario);
  const cats=Object.entries(sp).filter(([,v])=>v>0).sort((a,b)=>b[1]-a[1]);
  const max=Math.max(1,...cats.map(c=>c[1]));
  return `${noSal?`<section class="panel"><div><h2>Empieza por tu salario</h2><p class="sub">Escribe cuánto recibes al mes. Después agrega tus pagos fijos (arriendo, celular, internet, transporte).</p></div>${salForm()}</section>`:""}
  ${kpis(cur)}
  <section class="panel"><div><h2>Registrar movimiento</h2><p class="sub">Cada gasto o ingreso extra que tengas en ${mName(cur)}.</p></div>${movForm()}</section>
  <div class="grid2">
    <section class="panel"><div class="split"><h2>Pagos fijos</h2><span class="chip ${pend.length?"warn":"good"}">${cfg.fijos.length?(pend.length?pend.length+" pendientes":"Todos pagados"):"Sin pagos fijos"}</span></div>
      ${cfg.fijos.length?`<ul class="list">${cfg.fijos.slice().sort((a,b)=>(a.dia||99)-(b.dia||99)).map(f=>fijoCheck(f,m)).join("")}</ul>`:`<div class="empty">Agrega tus pagos mensuales en la pestaña Pagos fijos.</div>`}
    </section>
    <section class="panel"><div><h2>En qué se va tu dinero</h2><p class="sub">Fijos, gastos variables y ahorro por categoría.</p></div>
      ${cats.length?cats.map(([c,v])=>{const lim=+cfg.presupuestos[c]||0;const st=lim?(v>lim?"bad":v>lim*.85?"warn":"good"):"";
        return `<div class="budget"><div class="hd"><span>${esc(c)}</span><span class="num">${money(v)}${lim?` <small class="sub">/ ${money(lim)}</small>`:""}</span></div><div class="bar ${st}"><i style="width:${Math.min(100,(lim?v/lim:v/max)*100)}%"></i></div></div>`;}).join(""):`<div class="empty">Aún no hay gastos este mes.</div>`}
    </section>
  </div>
  ${noSal?"":`<div class="grid2"><section class="panel"><div class="split"><div><h2>Salario de ${mName(cur)}</h2><p class="sub">${m.salarioMes!=null?"Este mes tiene un salario distinto al base.":"Este mes usa tu salario base. Cámbialo si ese mes recibiste otro valor."}</p></div>${m.salarioMes!=null?`<span class="chip warn">Ajustado</span>`:""}</div>
    <form class="row" data-form="salarioMes"><label class="f">Salario recibido (COP)<input id="salmes" name="salario" inputmode="numeric" value="${t.salario||""}" required></label><button class="btn">Guardar</button>${m.salarioMes!=null?`<button type="button" class="btn ghost" data-act="resetSalMes">Usar salario base</button>`:""}</form></section>
  <section class="panel"><div><h2>Salario base</h2><p class="sub">Se aplica a todos los meses que no tengan un salario ajustado.</p></div>${salForm()}</section></div>`}`;
}
function salForm(){return `<form class="row" data-form="salario"><label class="f">Salario neto mensual (COP)<input id="sal" name="salario" inputmode="numeric" value="${+cfg.salario||""}" placeholder="2500000" required></label><button class="btn">Guardar salario</button></form>`;}
function fijoCheck(f,m){const p=!!m.pagados[f.id];return `<li><label class="check li-main"><input type="checkbox" data-act="pagar" data-id="${f.id}" ${p?"checked":""}><span><b>${esc(f.nombre)}</b><small>${esc(f.cat)}${f.dia?" · día "+f.dia:""}</small></span></label><span class="num">${money(f.monto)}</span><span class="chip ${p?"good":"warn"}">${p?"Pagado":"Pendiente"}</span></li>`;}

function vMov(){
  const m=month(cur);const movs=m.movs.slice().sort((a,b)=>(b.fecha||"").localeCompare(a.fecha||""));
  return `${kpis(cur)}
  <section class="panel"><div><h2>Registrar movimiento</h2></div>${movForm()}</section>
  <section class="panel"><div class="split"><h2>Movimientos de ${mName(cur)}</h2><span class="status">${movs.length} registros</span></div>
  ${movs.length?`<ul class="list">${movs.map(x=>`<li><div class="li-main"><b>${esc(x.desc||x.cat)}</b><small>${esc(x.cat)} · ${esc(x.fecha||"")}${x.tipo==="ahorro"?" · aporte a meta":""}</small></div><span class="num ${x.tipo==="ingreso"?"in":"out"}">${x.tipo==="ingreso"?"+":"-"}${money(x.monto)}</span><button class="icon" data-act="delMov" data-id="${x.id}">Borrar</button></li>`).join("")}</ul>`:`<div class="empty">No hay movimientos en este mes. Registra el primero con el formulario de arriba.</div>`}
  </section>`;
}

function vFijos(){
  const m=month(cur);const tot=sum(cfg.fijos.map(f=>f.monto));const t=totals(cur);
  return `<section class="panel"><div class="split"><div><h2>Pagos fijos mensuales</h2><p class="sub">Lo que pagas todos los meses. Se descuenta automáticamente de tu disponible.</p></div><div class="num">${money(tot)}${t.ingresos?` <span class="chip">${Math.round(tot/t.ingresos*100)}% del ingreso</span>`:""}</div></div>
  <form class="row" data-form="fijo">
    <label class="f wide">Nombre<input id="fj-nombre" name="nombre" placeholder="Arriendo, celular, gimnasio..." required></label>
    <label class="f">Monto (COP)<input id="fj-monto" name="monto" inputmode="numeric" placeholder="120000" required></label>
    <label class="f">Categoría<select id="fj-cat" name="cat">${CATS.filter(c=>c!=="Ahorro").map(c=>`<option>${c}</option>`).join("")}</select></label>
    <label class="f">Día de pago<input id="fj-dia" name="dia" type="number" min="1" max="31" placeholder="5"></label>
    <button class="btn">Agregar</button>
  </form>
  ${cfg.fijos.length?`<ul class="list">${cfg.fijos.slice().sort((a,b)=>(a.dia||99)-(b.dia||99)).map(f=>{const p=!!m.pagados[f.id];return `<li><label class="check li-main"><input type="checkbox" data-act="pagar" data-id="${f.id}" ${p?"checked":""}><span><b>${esc(f.nombre)}</b><small>${esc(f.cat)}${f.dia?" · día "+f.dia:""} · ${p?"pagado en "+mName(cur,true):"pendiente"}</small></span></label><span class="num">${money(f.monto)}</span><button class="icon" data-act="delFijo" data-id="${f.id}">Quitar</button></li>`;}).join("")}</ul>`:`<div class="empty">Todavía no tienes pagos fijos. Agrega arriendo, servicios, plan de celular, suscripciones o cuotas.</div>`}
  </section>`;
}

function vPres(){
  const sp=spentByCat(cur);const totLim=sum(Object.values(cfg.presupuestos));
  return `<section class="panel"><div class="split"><div><h2>Presupuesto por categoría</h2><p class="sub">Pon un límite mensual a cada categoría. Incluye pagos fijos y gastos variables de ${mName(cur)}.</p></div><span class="num">Límite total ${money(totLim)}</span></div>
  <div>${CATS.filter(c=>c!=="Ahorro").map(c=>{const v=sp[c]||0, lim=+cfg.presupuestos[c]||0;const st=lim?(v>lim?"bad":v>lim*.85?"warn":"good"):"";
    return `<div class="budget"><div class="hd"><span><b>${c}</b> ${lim?`<span class="chip ${st}">${v>lim?"Excedido por "+money(v-lim):v>lim*.85?"Cerca del límite":"Restan "+money(lim-v)}</span>`:""}</span>
    <span style="display:flex;gap:8px;align-items:center"><span class="num">${money(v)}</span><input id="pr-${c}" data-pres="${c}" inputmode="numeric" placeholder="Límite" value="${lim||""}" aria-label="Límite para ${c}"></span></div>
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
    return `<section class="panel"><div class="split"><h2>${esc(g.nombre)}</h2><span class="chip ${p>=100?"good":""}">${Math.round(p)}%</span></div>
    <div class="bar good"><i style="width:${p}%"></i></div>
    <div class="split"><span class="num">${money(g.ahorrado)}</span><span class="sub">de ${money(g.objetivo)}</span></div>
    ${ritmo?`<p class="sub">${ritmo}</p>`:""}
    <form class="row" data-form="aporte" data-id="${g.id}"><label class="f">Aporte (COP)<input id="ap-${g.id}" name="monto" inputmode="numeric" placeholder="100000" required></label><button class="btn ghost">Aportar</button><button type="button" class="icon" data-act="delMeta" data-id="${g.id}">Eliminar</button></form></section>`;}).join("")}</div>`:`<div class="empty">Crea tu primera meta. Un buen inicio es un fondo de emergencia de 3 a 6 meses de gastos.</div>`}`;
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
  <div class="chart">${ts.map((t,i)=>`<div class="col" title="${mName(ks[i])}"><i class="ci" style="height:${t.ingresos/max*100}%"></i><i class="co" style="height:${t.egresos/max*100}%"></i></div>`).join("")}</div>
  <div class="xl">${ks.map(k=>`<span>${mName(k,true)}</span>`).join("")}</div>
  <div class="tbl"><table><thead><tr><th>Mes</th><th>Ingresos</th><th>Egresos</th><th>Ahorro</th><th>Balance</th></tr></thead><tbody>
  ${ks.slice().reverse().map(k=>{const t=totals(k);const has=months[k]||k===mk(today);return `<tr><td>${mName(k)}</td><td class="num">${has?money(t.ingresos):"-"}</td><td class="num">${has?money(t.egresos):"-"}</td><td class="num">${has?money(t.ahorro):"-"}</td><td class="num ${t.disp<0?"":"in"}" style="${t.disp<0?"color:var(--bad)":""}">${has?money(t.disp):"-"}</td></tr>`;}).join("")}
  </tbody></table></div>
  <p class="sub">Los meses sin registros aparecen con guion.</p></section>`;
}

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
    case "tema":setLook({tema:id});break;
    case "paleta":setLook({paleta:id});break;
    case "resetLook":cfg.apariencia={tema:"auto",paleta:"azul",acento:""};applyLook();saveCfg();toast("Colores restablecidos");break;
    case "skipWelcome":cfg.perfil.omitido=true;saveCfg();closeLayer($("welcome"));break;
    case "tab":tab=id;try{localStorage.setItem("fin.tab",tab)}catch(_){ }render();window.scrollTo(0,0);break;
    case "prevMonth":cur=shift(cur,-1);render();break;
    case "nextMonth":cur=shift(cur,1);render();break;
    case "tipo":movTipo=id;render();break;
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
    case "perfil":{const p=cfg.perfil,lim={nombre:60,apodo:30,telefono:20,nacimiento:10,ciudad:60};
      Object.keys(lim).forEach(k=>{p[k]=str(String(fd[k]||"").trim(),lim[k]);});
      if(!/^\d{4}-\d{2}-\d{2}$/.test(p.nacimiento))p.nacimiento="";
      saveCfg();updateTop();toast("Perfil guardado");return;}
    case "bienvenida":{const n=str(String(fd.nombre||"").trim(),60);if(!n)return toast("Escribe tu nombre o toca Ahora no.");
      cfg.perfil.nombre=n;saveCfg();updateTop();closeLayer($("welcome"));toast("Encantado, "+firstName());return;}
    case "salario":{const v=num(fd.salario);if(v<=0)return toast("Escribe un salario mayor a cero.");cfg.salario=v;saveCfg();toast("Salario base guardado");break;}
    case "salarioMes":{const v=num(fd.salario);if(v<0)return toast("Escribe un salario válido.");const m=month(cur);months[cur]={...months[cur],movs:m.movs,pagados:m.pagados,salarioMes:v};saveMonth(cur);toast("Salario de "+mName(cur)+" guardado");break;}
    case "mov":{const v=num(fd.monto);if(v<=0)return toast("Escribe un monto mayor a cero.");const fecha=fd.fecha||cur+"-01";const k=fecha.slice(0,7);
      addMov(k,{id:uidv(),tipo:movTipo,monto:v,cat:fd.cat,desc:(fd.desc||"").trim(),fecha});if(k!==cur)cur=k;toast(movTipo==="gasto"?"Gasto registrado":"Ingreso registrado");break;}
    case "fijo":{const v=num(fd.monto);if(v<=0)return toast("Escribe un monto mayor a cero.");cfg.fijos=[...cfg.fijos,{id:uidv(),nombre:fd.nombre.trim(),monto:v,cat:fd.cat,dia:parseInt(fd.dia)||null}];saveCfg();toast("Pago fijo agregado");break;}
    case "meta":{const v=num(fd.objetivo);if(v<=0)return toast("Escribe un objetivo mayor a cero.");cfg.metas=[...cfg.metas,{id:uidv(),nombre:fd.nombre.trim(),objetivo:v,ahorrado:0,fecha:fd.fecha||""}];saveCfg();toast("Meta creada");break;}
    case "aporte":{const v=num(fd.monto);if(v<=0)return toast("Escribe un aporte mayor a cero.");const g=cfg.metas.find(g=>g.id===id);if(!g)return;g.ahorrado+=v;saveCfg();
      addMov(cur,{id:uidv(),tipo:"ahorro",monto:v,cat:"Ahorro",desc:"Aporte: "+g.nombre,fecha:cur===mk(today)?today.toISOString().slice(0,10):cur+"-01",metaId:g.id});toast("Aporte registrado");break;}
    case "deuda":{const v=num(fd.saldo);if(v<=0)return toast("Escribe un saldo mayor a cero.");cfg.deudas=[...cfg.deudas,{id:uidv(),nombre:fd.nombre.trim(),saldo:v,inicial:v,cuota:num(fd.cuota),tasa:(fd.tasa||"").trim()}];saveCfg();toast("Deuda agregada");break;}
    case "abono":{const v=num(fd.monto);if(v<=0)return toast("Escribe un abono mayor a cero.");const d=cfg.deudas.find(d=>d.id===id);if(!d)return;d.saldo=Math.max(0,d.saldo-v);saveCfg();
      addMov(cur,{id:uidv(),tipo:"gasto",monto:v,cat:"Deudas",desc:"Abono: "+d.nombre,fecha:cur===mk(today)?today.toISOString().slice(0,10):cur+"-01",deudaId:d.id});toast("Abono registrado");break;}
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

function showAuth(){ $("topbar").hidden=true;$("appView").hidden=true;$("authView").hidden=false; }
function showApp(){ $("authView").hidden=true;$("topbar").hidden=false;$("appView").hidden=false; }
function setSession(session){
  if(session&&session.user){
    if(authMode==="reset")return;
    userMail=session.user.email||"";$("userEmail").textContent=userMail;
    if(uid!==session.user.id){uid=session.user.id;ready=false;cfg=defCfg();months={};showApp();render();loadAll();}
    else showApp();
  }else{
    uid=null;ready=false;cfg=defCfg();months={};userMail="";resetLayers();
    $("authPass").value="";setAuthMode("login");showAuth();
  }
}

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
  document.documentElement.classList.add("noscroll");$("topbar").inert=true;$("appView").inert=true;
  const f=el.querySelector("[data-autofocus]");if(f)f.focus({preventScroll:true});
}
function closeLayer(el){
  if(el.hidden||!el.classList.contains("open"))return;
  el.classList.remove("open");
  layerTimers.set(el,setTimeout(()=>{el.hidden=true;},300));
  document.documentElement.classList.remove("noscroll");$("topbar").inert=false;$("appView").inert=false;
  if(layerOpener&&layerOpener.focus)layerOpener.focus({preventScroll:true});layerOpener=null;
}
function resetLayers(){
  ["profileSheet","welcome"].forEach(id=>{const el=$(id);clearTimeout(layerTimers.get(el));el.classList.remove("open");el.hidden=true;});
  document.documentElement.classList.remove("noscroll");$("topbar").inert=false;$("appView").inert=false;
  crop.img=null;$("cropBox").hidden=true;$("profMain").hidden=false;
}
document.addEventListener("keydown",e=>{
  if(e.key!=="Escape")return;
  if(!$("cropBox").hidden){cancelCrop();return;}
  if($("profileSheet").classList.contains("open"))closeLayer($("profileSheet"));
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
  $("cropBox").hidden=true;$("profMain").hidden=false;updateProfPhotoUI();
  openLayer($("profileSheet"),opener);
}
function maybeWelcome(){
  const p=cfg.perfil;
  if(p.nombre||p.omitido||!$("welcome").hidden||!$("profileSheet").hidden)return;
  openLayer($("welcome"),null);
}

/* cerrar la hoja arrastrándola hacia abajo (solo en pantallas angostas) */
(function(){
  const layer=$("profileSheet"),sheet=layer.querySelector(".sheet"),head=layer.querySelector(".sheet-head");
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
})();

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

/* ---------- arranque ---------- */
renderTabs();
(async()=>{
  const conf=window.FINANZAS_CONFIG||{};
  if(!window.supabase||!conf.supabaseUrl||/TU-PROYECTO/.test(conf.supabaseUrl)){
    showAuth();authMsg("Falta configurar la conexión a Supabase en el archivo config.js.");$("authForm").hidden=true;$("authSwitch").hidden=true;$("authForgot").hidden=true;return;
  }
  sb=window.supabase.createClient(conf.supabaseUrl,conf.supabaseAnonKey);
  sb.auth.onAuthStateChange((event,session)=>{
    if(event==="PASSWORD_RECOVERY"){showAuth();setAuthMode("reset");return;}
    setTimeout(()=>setSession(session),0);
  });
  const {data}=await sb.auth.getSession();
  setSession(data.session);
})();

/* sincronizar al volver a la app (otro dispositivo pudo cambiar datos) */
document.addEventListener("visibilitychange",()=>{
  if(document.visibilityState==="visible"&&uid&&ready&&pending===0)loadAll();
});

/* instalable como app */
if("serviceWorker" in navigator){window.addEventListener("load",()=>navigator.serviceWorker.register("/sw.js").catch(()=>{}));}
