import{aZ as I,R as K,n as G,g as U,b6 as L,b7 as W,b8 as Z,a7 as J,e as Q,aF as X,c as y,K as _,au as Y,al as tt}from"./theme.BwIdyTJj.js";import{q as et,v as ot,b as E,u as c,c as h,h as at,w as st,o as nt,d as x,k as rt,M as it,x as u,y as p,A as l,F as M,B as S,H as $,E as b,G as N,z as B,S as O,C as d,P as w,O as lt,au as ut,I as T}from"./framework.BR0mAPCP.js";const pt={class:"flex flex-col"},dt=["id","onMousedown","onMouseenter"],mt={class:"info p-2 flex flex-wrap items-center justify-center mx-2 gap-4"},vt={class:"flex flex-wrap items-center justify-center bg-light-900 p-4 rounded-2xl dark-bg-dark-800 gap-2",style:{flex:"5 1 300px"}},ft=["value"],ct={class:"is-group flex flex-wrap p-2"},bt={class:"is-group flex items-center"},gt={class:"is-group flex items-center"},yt={__name:"StepSequencer",setup(xt){const{isDark:q}=ot(),R=I(),z=K(),e=E({started:!1,playing:!1,hover:!1,mounted:!1,current:0,octave:c("seq-octave",3),bpm:c("seq-bpm",120),steps:c("seq-steps",16),type:c("seq-type","up"),probability:c("seq-prob",1),humanize:c("seq-human",!1),interval:c("seq-interval","8n"),note:h(()=>G[U.tonic]),range:h(()=>L(e.note+e.octave+" "+U.set.name)(e.note+e.octave,e.note+(e.octave+2)).map(o=>W(o)).reverse()),midi:h(()=>e.range.map(o=>Z(o))),pitches:h(()=>e.midi.map(o=>(o+3)%12)),progress:0}),A=["up","down","upDown","downUp","alternateUp","alternateDown","random","randomWalk","randomOnce"],n=E([]),g=E([]);let m=[];at(" ",o=>{o.preventDefault(),e.playing=!e.playing}),st(()=>{e.range.forEach((o,t)=>{n[t]=n[t]||[],n[t].length=e.steps,n.length=e.range.length,Array.apply(null,n[t]).forEach((s,r)=>{n[t][r]={row:t,cell:r,note:o,active:(s==null?void 0:s.active)||!1}})})}),nt(()=>{e.mounted=!0,C()}),x(()=>e.steps,()=>{e.mounted&&C()},{immediate:!0});function C(){m.forEach(o=>{o.stop(0),o.dispose()}),m=[],n.forEach((o,t)=>{m[t]=new J((f,s)=>{R.schedule(()=>{g[t]=s==null?void 0:s.cell,s!=null&&s.active&&Q(s==null?void 0:s.note)},f)},n[t],e.type).start(0),m[t].interval=e.interval})}let D;function P(o,t,f,s){!e.hover&&!f||!f&&D==s.target.id||(D=s.target.id,n[o][t].active?n[o][t].active=!1:n[o][t].active=!0)}function F(){n.forEach((o,t)=>{o.forEach((f,s)=>n[t][s].active=!1)})}x(()=>e.playing,o=>{o?(m.forEach(t=>{t.start(0)}),z.start(),e.started||(X(),e.started=!0)):(m.forEach(t=>{t.stop()}),z.stop())}),x(()=>e.type,o=>{m.forEach(t=>{t.pattern=o})},{immediate:!0}),x(()=>e.probability,o=>{m.forEach(t=>{t.probability=o})},{immediate:!0}),x(()=>e.humanize,o=>{m.forEach(t=>{t.humanize=o})},{immediate:!0});function H(){e.playing=!1,C()}rt(()=>{m.forEach(o=>{o.stop(0),o.dispose()})});function j(o,t){return o.active?y(e.pitches[t]):o.cell==g[t]?q.value?"#eee7":"#3337":"#4444"}return(o,t)=>{const f=Y,s=tt,r=it("tooltip");return u(),p("div",pt,[l("div",{class:"rows sticky top-2 h-96svh",onMousedown:t[0]||(t[0]=a=>e.hover=!0),onMouseleave:t[1]||(t[1]=O(a=>e.hover=!1,["self"])),onMouseup:t[2]||(t[2]=a=>e.hover=!1)},[(u(!0),p(M,null,S(n,(a,i)=>(u(),p("div",{class:"row",key:a},[l("div",{class:"title m-1 rounded-md shadow",style:$({color:b(y)(e.pitches[i]),backgroundColor:e.range[i].length>2?"#0005":"#aaa5"})},N(e.range[i]),5),(u(!0),p(M,null,S(a,(v,k)=>(u(),p("div",{class:B(["cell",{active:v==null?void 0:v.active,current:v.cell==g[i]}]),id:`c${i}-${k}`,key:v,style:$({color:b(y)(e.pitches[i]),borderColor:j(v,i),backgroundColor:v.cell==g[i]?v.active?b(y)(e.pitches[i],3):b(q)?"#0005":"#fff5":"transparent",marginRight:k%4==3?"12px":"1px"}),onMousedown:O(V=>P(i,k,!0,V),["prevent"]),onMouseenter:V=>P(i,k,!1,V)},[l("div",{class:"dot",style:$({backgroundColor:v.active?b(y)(e.pitches[i]):v.cell==g[i]?"currentColor":"#4448"})},null,4)],46,dt))),128))]))),128))],32),l("div",mt,[d(w(f,{style:{flex:"1 1 100px"}},null,512),[[r,"Select root note and scale",void 0,{top:!0}]]),l("div",vt,[d((u(),p("select",{"onUpdate:modelValue":t[3]||(t[3]=a=>e.type=a)},[(u(),p(M,null,S(A,a=>l("option",{key:a,value:a},N(a),9,ft)),64))])),[[lt,e.type],[r,"Pattern type",void 0,{top:!0}]]),l("div",ct,[d(w(s,{modelValue:e.octave,"onUpdate:modelValue":t[4]||(t[4]=a=>e.octave=a),max:4,min:2,fixed:0,param:"OCTAVE"},null,8,["modelValue"]),[[r,"Octave",void 0,{top:!0}]]),d(w(s,{modelValue:e.steps,"onUpdate:modelValue":t[5]||(t[5]=a=>e.steps=a),max:32,min:4,step:1,fixed:0,param:"steps"},null,8,["modelValue"]),[[r,"Number of steps",void 0,{top:!0}]]),d(w(s,{modelValue:e.probability,"onUpdate:modelValue":t[6]||(t[6]=a=>e.probability=a),max:1,min:0,step:.01,fixed:2,param:"prob"},null,8,["modelValue"]),[[r,"Probability",void 0,{top:!0}]]),d(w(s,{modelValue:b(_).bpm,"onUpdate:modelValue":t[7]||(t[7]=a=>b(_).bpm=a),step:1,max:400,min:10,fixed:0,param:"BPM"},null,8,["modelValue"]),[[r,"Set tempo",void 0,{top:!0}]])]),l("div",bt,[d((u(),p("button",{class:B(["text-button",{active:e.humanize}]),onClick:t[8]||(t[8]=a=>e.humanize=!e.humanize)},t[13]||(t[13]=[ut("HMN")]),2)),[[r,"Humanize rhythm",void 0,{bottom:!0}]]),d((u(),p("button",{class:"text-button",onClick:t[9]||(t[9]=a=>F())},t[14]||(t[14]=[l("div",{class:"i-la-trash-alt"},null,-1)]))),[[r,"Clear pattern",void 0,{bottom:!0}]])]),l("div",gt,[e.playing?T("",!0):d((u(),p("button",{key:0,class:"text-button",onClick:t[10]||(t[10]=a=>e.playing=!0)},t[15]||(t[15]=[l("div",{class:"i-la-play"},null,-1)]))),[[r,"Play",void 0,{bottom:!0}]]),e.playing?d((u(),p("button",{key:1,class:"text-button",onClick:t[11]||(t[11]=a=>e.playing=!1)},t[16]||(t[16]=[l("div",{class:"i-la-pause"},null,-1)]))),[[r,"Pause",void 0,{bottom:!0}]]):T("",!0),d((u(),p("button",{class:"text-button",onClick:t[12]||(t[12]=a=>H())},t[17]||(t[17]=[l("div",{class:"i-la-stop"},null,-1)]))),[[r,"Stop",void 0,{bottom:!0}]])])])])])}}},ht=et(yt,[["__scopeId","data-v-469737b0"]]);export{ht as default};