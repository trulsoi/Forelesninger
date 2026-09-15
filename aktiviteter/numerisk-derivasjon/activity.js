/* INGA1002: all positions and velocities derive from the same selected model. */
"use strict";
(() => {
  if (new URLSearchParams(location.search).has("embed")) document.body.classList.add("embedded");
  if (!window.JXG) { document.getElementById("load-error").hidden = false; return; }
  const el = id => document.getElementById(id);
  const state = { t:1, h:0.2, method:"forward", model:"quadratic", tangent:true };
  const s = t => state.model === "quadratic" ? 5*t*t : t*t*t;
  const v = t => state.model === "quadratic" ? 10*t : 3*t*t;
  const endpoints = () => state.method === "forward" ? [state.t,state.t+state.h]
    : state.method === "backward" ? [state.t-state.h,state.t] : [state.t-state.h,state.t+state.h];
  const slope = () => { const [a,b]=endpoints(); return (s(b)-s(a))/(b-a); };
  const fmt = (n,d=2) => n.toLocaleString("nb-NO",{minimumFractionDigits:d,maximumFractionDigits:d});
  const board = JXG.JSXGraph.initBoard("position-board", {
    boundingbox:[-0.28,50,3.3,-6], axis:false, showCopyright:false, showNavigation:false,
    pan:{enabled:false}, zoom:{enabled:false,wheel:false}, keepaspectratio:false,
    keyboard:{enabled:false}, resize:{enabled:true}, renderer:"svg"
  });
  const label = {fontSize:15, strokeColor:"#3c3836", fixed:true, highlight:false};
  board.create("axis",[[0,0],[1,0]],{name:"",strokeColor:"#7c6f64",ticks:{drawLabels:true,label:{fontSize:12},minorTicks:0,ticksDistance:0.5}});
  board.create("axis",[[0,0],[0,1]],{name:"",strokeColor:"#7c6f64",ticks:{drawLabels:true,label:{fontSize:12},minorTicks:0}});
  board.create("text",[2.73,-3.7,"Tid t (s)"],label);
  const yLabel=board.create("text",[0.1,47,"Posisjon s (m)"],label);
  board.create("functiongraph",[s,0,3],{strokeColor:"#458588",strokeWidth:3,highlight:false});
  const pointAttrs={size:4,strokeWidth:2,fixed:true,highlight:false,label:{fontSize:15,offset:[-8,16]}};
  const a=board.create("point",[()=>endpoints()[0],()=>s(endpoints()[0])],{...pointAttrs,name:"A",fillColor:"#458588",strokeColor:"#458588"});
  const b=board.create("point",[()=>endpoints()[1],()=>s(endpoints()[1])],{...pointAttrs,name:"B",fillColor:"#d79921",strokeColor:"#d79921"});
  board.create("line",[a,b],{strokeColor:"#d79921",strokeWidth:3,highlight:false});
  board.create("functiongraph",[x=>s(state.t)+v(state.t)*(x-state.t),0,3],{strokeColor:"#79740e",strokeWidth:3,dash:2,visible:()=>state.tangent,highlight:false});
  board.create("point",[()=>state.t,()=>s(state.t)],{...pointAttrs,name:"",size:3,fillColor:"#3c3836",strokeColor:"#3c3836"});
  for (const [p,color] of [[a,"#458588"],[b,"#d79921"]]) {
    board.create("segment",[[()=>p.X(),0],p],{strokeColor:color,strokeWidth:1,dash:2,highlight:false});
  }
  let frame=null, last=0;
  function update() {
    state.t=Number(el("time").value); state.h=Number(el("step").value);
    el("time-value").textContent=fmt(state.t)+" s";
    el("step-value").textContent=fmt(state.h)+" s";
    const [ta,tb]=endpoints(), estimate=slope(), exact=v(state.t), error=Math.abs(estimate-exact);
    el("formula").textContent=state.method==="central" ? "[s(t + h) − s(t − h)] / (2h)" : state.method==="forward" ? "[s(t + h) − s(t)] / h" : "[s(t) − s(t − h)] / h";
    el("interval").textContent=`A: ${fmt(ta)} s → B: ${fmt(tb)} s · Δt = ${fmt(tb-ta)} s`;
    el("approx").textContent=fmt(estimate,3)+" m/s";
    el("exact").textContent=fmt(exact,3)+" m/s";
    el("error").textContent=fmt(error,4)+" m/s";
    el("exact-row").hidden=el("error-row").hidden=!state.tangent;
    el("insight").textContent=state.method==="central"
      ? state.model==="quadratic" ? "Her er senterdifferansen eksakt: det gjelder andregradsfunksjoner. Hele tidsintervallet er 2h."
        : "For t³ har også senterdifferansen en feil. Reduser h og se hvor raskt feilen minker. Hele tidsintervallet er 2h."
      : "Sekanten bruker to målinger. Tangenten viser hastigheten akkurat ved t. Hold t fast mens du undersøker h.";
    el("position-readout").textContent=`t = ${fmt(state.t)} s · s = ${fmt(s(state.t))} m`;
    const end=s(3), roadX=p=>42+690*p/end;
    el("road-end").textContent=fmt(end,0)+" m";
    el("car").setAttribute("transform",`translate(${roadX(s(state.t))} 49)`);
    el("road-a").setAttribute("transform",`translate(${roadX(s(ta))} 0)`);
    el("road-b").setAttribute("transform",`translate(${roadX(s(tb))} 0)`);
    board.update();
  }
  function stop() {
    if(frame!==null) cancelAnimationFrame(frame);
    frame=null; last=0;
    el("play").textContent="Spill bevegelsen"; el("play").setAttribute("aria-pressed","false");
  }
  // Accumulate sub-slider increments: rounding each animation frame would stall at high refresh rates.
  let playbackTime=1;
  function animate(now) {
    if(last) playbackTime+=(now-last)*0.00022;
    last=now;
    el("time").value=Math.min(2.5,playbackTime).toFixed(2); update();
    if(playbackTime>=2.5) { stop(); return; }
    frame=requestAnimationFrame(animate);
  }
  el("play").addEventListener("click",()=>{
    if(frame!==null) { stop(); return; }
    if(Number(el("time").value)>=2.5) el("time").value=0.5;
    playbackTime=Number(el("time").value); last=0;
    el("play").textContent="Pause";el("play").setAttribute("aria-pressed","true");
    frame=requestAnimationFrame(animate);
  });
  for(const id of ["time","step"]) el(id).addEventListener("input",()=>{stop();update();});
  for(const button of document.querySelectorAll("[data-method]")) button.addEventListener("click",()=>{
    state.method=button.dataset.method;
    for(const other of document.querySelectorAll("[data-method]")) other.setAttribute("aria-pressed",String(other===button));
    update();
  });
  el("model").addEventListener("change",()=>{
    state.model=el("model").value;
    board.setBoundingBox(state.model==="quadratic"?[-0.28,50,3.3,-6]:[-0.28,31,3.3,-3.8]);
    yLabel.setPosition(JXG.COORDS_BY_USER,[0.1,state.model==="quadratic"?47:29]); update();
  });
  el("show-tangent").addEventListener("change",()=>{state.tangent=el("show-tangent").checked;update();});
  el("reset").addEventListener("click",()=>{
    stop();el("time").value=1;el("step").value=0.2;el("model").value="quadratic";
    el("model").dispatchEvent(new Event("change"));
    document.querySelector('[data-method="forward"]').click();
    el("show-tangent").checked=true;state.tangent=true;update();
  });
  document.addEventListener("visibilitychange",()=>{if(document.hidden)stop();});
  // Stop an offscreen iframe when the presenter moves to another slide.
  new IntersectionObserver(entries=>{if(!entries[0].isIntersecting)stop();}).observe(document.body);
  window.addEventListener("message",event=>{if(event.source===window.parent && event.data==="pause-derivative-demo")stop();});
  update();
})();
