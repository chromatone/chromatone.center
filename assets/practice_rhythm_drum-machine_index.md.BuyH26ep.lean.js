import{H as x,ay as n,aq as b}from"./chunks/theme.BRAeJ4NP.js";import{b as $,u as k,c as v,d as S,_ as g,f as m,g as d,h as l,R as c,l as s,m as h,F as f,j as _,n as q,A as w,au as V,$ as M}from"./chunks/framework.BH4RfCYQ.js";import{k as A,c as C,h as T}from"./chunks/useDrums.wR2Ccug3.js";import{u as E}from"./chunks/useElementary.FSDwvDTC.js";import{_ as D}from"./chunks/AnalysisScope.BA5Ss-Un.js";function U(){const o=$({mute:!1,playing:!1,reset:0,volume:x(k("seq:volume",.7),0,1),bpm:k("seq:bpm",120),interval:v(()=>6e4/o.bpm),tracks:{hhat:Array(16).fill(1),clap:Array(16).fill(0),kick:Array(16).fill(0)},hit:{hhat:0,clap:0,kick:0},train:v(()=>n.train({key:"seq:train"},n.sm(n.const({key:"seq:freq",value:o.playing?o.bpm/15:0}))))});return S(o,e=>{const{audio:p,render:t}=E(),r=n.const({key:"seq:reset",value:0}),a=n.mul(n.const({key:"seq:volume",value:o.volume}),n.scope({name:"drums",size:512},n.add(A(30,.254,.05,.4,4,n.or(n.const({key:"hit:kick",value:o.hit.kick}),n.seq2({key:"seq:kick",seq:[...e.tracks.kick]},o.train,r))),C(800,.005,.204,n.or(n.const({key:"hit:clap",value:o.hit.clap}),n.seq2({key:"seq:clap",seq:[...e.tracks.clap]},o.train,r))),T(317,12e3,.005,.1,n.or(n.const({key:"hit:hhat",value:o.hit.hhat}),n.seq2({key:"seq:hh",seq:[...e.tracks.hhat]},o.train,r))))));p.layers.seq={signal:[a,a]},p.started=!1,t("sequencer")}),{sequencer:o}}const P={class:"flex flex-col gap-2 is-group p-2 bg-light-200 dark-bg-dark-200 shadow rounded gap-4"},z={class:"is-group flex flex-wrap"},N={class:"flex flex-col gap-2"},O=["onMousedown","onMouseup"],B=["onClick"],R={__name:"DrumsSequencer",setup(o){const{sequencer:e}=U();return(p,t)=>{const r=b;return m(),d("div",P,[l("div",z,[c(r,{param:"BPM",min:20,max:500,step:1,modelValue:s(e).bpm,"onUpdate:modelValue":t[0]||(t[0]=a=>s(e).bpm=a)},null,8,["modelValue"]),l("button",{class:"text-button",onClick:t[1]||(t[1]=a=>s(e).playing=!s(e).playing)},h(s(e).playing?"PAUSE":"PLAY"),1),l("button",{class:"text-button",onClick:t[2]||(t[2]=a=>s(e).mute=!s(e).mute)},h(s(e).mute?"UNMUTE":"MUTE"),1),l("button",{class:"text-button",onMousedown:t[3]||(t[3]=a=>s(e).reset=1),onMouseup:t[4]||(t[4]=a=>s(e).reset=0),onTouchstart:t[5]||(t[5]=a=>s(e).reset=1),onTouchend:t[6]||(t[6]=a=>s(e).reset=0)},"RESET",32),c(r,{param:"Vol",min:0,max:1,step:.001,modelValue:s(e).volume,"onUpdate:modelValue":t[7]||(t[7]=a=>s(e).volume=a)},null,8,["modelValue"]),c(D,{class:"max-h-30",style:{flex:"1 1 200px"},name:"drums"})]),l("div",N,[(m(!0),d(f,null,_(s(e).tracks,(a,i)=>(m(),d("div",{class:"flex items-center gap-1",key:i},[l("div",{class:q(["step",{active:s(e).hit[i]}]),onMousedown:u=>s(e).hit[i]=1,onMouseup:u=>s(e).hit[i]=0},h(i),43,O),(m(!0),d(f,null,_(a,(u,y)=>(m(),d("div",{class:q(["step",{active:u==1}]),key:y,onClick:W=>a[y]=u==1?0:1},null,10,B))),128))]))),128))])])}}},j=g(R,[["__scopeId","data-v-573ad572"]]),G=JSON.parse('{"title":"Drum machine","description":"Simple drum sequencer with synthesized sounds","frontmatter":{"title":"Drum machine","description":"Simple drum sequencer with synthesized sounds","date":"2019-11-02T00:00:00.000Z","layout":"app"},"headers":[],"relativePath":"practice/rhythm/drum-machine/index.md","filePath":"practice/rhythm/drum-machine/index.md","lastUpdated":1725939455000}'),F={name:"practice/rhythm/drum-machine/index.md"};function L(o,e,p,t,r,a){const i=j,u=M("client-only");return m(),d("div",null,[c(u,null,{default:w(()=>[c(i,{class:"m-2"})]),_:1}),e[0]||(e[0]=l("p",null,"Very basic drum machine made with Elementary.js. All sounds are synthesized by low level sound engine commands and run in independent Web Audio and WASM threads, ensuring high quality and no glitches in the sound.",-1)),e[1]||(e[1]=l("h2",{id:"todo",tabindex:"-1"},[V("TODO "),l("a",{class:"header-anchor",href:"#todo","aria-label":'Permalink to "TODO"'},"​")],-1)),e[2]||(e[2]=l("ul",null,[l("li",null,"sync with musical transport")],-1))])}const K=g(F,[["render",L]]);export{G as __pageData,K as default};