import{x as O,n as b,aW as H,H as $,d as I,c as k}from"./theme.CSn6VkK-.js";import{_ as L,D as W,u as p,d as X,H as q,r as A,w as K,c as d,P as T,f as a,g as i,h as o,F as D,j,n as V,l as s,p as Z,m as y,k as G}from"./framework.BH4RfCYQ.js";const J={class:"flex flex-col items-center fullscreen-container rounded-3xl",id:"screen"},Q={class:"flex flex-wrap mt-6"},R=["onClick"],U={class:"p-4 flex flex-wrap items-center"},Y={class:"is-group flex"},ee={key:0,class:"i-la-pause"},te={key:1,class:"i-la-play"},oe={key:0,class:"i-la-volume-up"},se={key:1,class:"i-la-volume-off"},le={id:"chord-form",version:"1.1",baseProfile:"full",viewBox:"0 0 1260 800",xmlns:"http://www.w3.org/2000/svg"},ne={class:"zoom"},re={y:"760",fill:"currentColor",x:"12"},ae=["y1"],ie={class:"speed"},ce={y:"780",x:"12",fill:"currentColor"},ue=["x1"],de=["stroke","points"],fe=["transform","fill"],ve=["stroke","points"],me=["transform","fill"],_e=1200,f=600,pe={__name:"ChromaForm",setup(he){const x=[];for(let e=0;e<13;e++)x[e]=Math.pow(2,e/12);const w=_e/f,{timestamp:N,pause:S,resume:z}=W({controls:!0,offset:Date.now(),immediate:!1}),c=p("chord-moving",!0);X(c,e=>{e?z():S()}),q(" ",e=>{e.preventDefault(),c.value=!c.value});const l=p("chord-notes-obj",{}),v=A(!1);K(()=>{if(v.value)for(let e in l.value){let t=e<3?3:4;O(b[e]+t)}else H()});const m=$(p("chord-zoom",400),75,1e3),_=$(p("chord-speed",100),10,400);function M(e){l.value[e]?delete l.value[e]:l.value[e]=!0}function P(e){e.tap&&(c.value=!c.value),_.value+=e.delta[0],m.value-=e.delta[1]}function h(e,t){return Math.sin((t+N.value*_.value/1e3)*(Math.PI*2*x[e])/m.value)}const B=d(()=>{let e="000000000000",t=e.split("");for(let n in l.value)t[Number(n)]="1";return e=t.join(""),e}),E=d(()=>{let e={};for(let t in l.value){e[t]=[];for(let n=0;n<f;n++)e[t].push(`${n*w},${h(Number(t),n)*100+400}`)}return e}),g=d(()=>{let e=[];for(let t=0;t<f;t++){e[t]=0;for(let n in l.value){let u=Number(n);e[t]+=h(u,t)}}return e}),F=d(()=>g.value.map((e,t)=>`${t*w},${e*100+400}`).join(" ")),C=d(()=>I(B.value,Object.keys(l.value)[0]));return(e,t)=>{const n=T("drag");return a(),i("div",J,[o("div",Q,[(a(!0),i(D,null,j(s(b),(u,r)=>(a(),i("div",{class:V(["note",{active:s(l)[r]}]),key:u,style:Z({backgroundColor:s(l)[r]?s(k)(r):u.length==2?"#333":"#aaa"}),onClick:ke=>M(r)},y(u),15,R))),128))]),o("div",U,[o("div",Y,[o("button",{onClick:t[0]||(t[0]=u=>c.value=!s(c))},[s(c)?(a(),i("div",ee)):(a(),i("div",te))]),o("button",{onClick:t[1]||(t[1]=u=>v.value=!v.value)},[v.value?(a(),i("div",se)):(a(),i("div",oe))])])]),G((a(),i("svg",le,[o("g",ne,[o("text",re,"ZOOM X"+y(s(m)/100),1),o("line",{y1:800-s(m)/1e3*800,y2:"800",transform:"translate(4 0)","stroke-linecap":"round",stroke:"currentColor","stroke-opacity":"0.5","stroke-width":"8"},null,8,ae)]),o("g",ie,[o("text",ce,"SPEED X"+y(s(_)/100),1),o("line",{x1:s(_)/400*1260,x2:"0",transform:"translate(0 795)","stroke-linecap":"round",stroke:"currentColor","stroke-opacity":"0.5","stroke-width":"12"},null,8,ue)]),t[2]||(t[2]=o("line",{x1:"0",x2:"1200",y1:"400",y2:"400",stroke:"gray","stroke-width":"1"},null,-1)),(a(!0),i(D,null,j(s(l),(u,r)=>(a(),i("g",{key:r},[o("polyline",{stroke:s(k)(r),points:E.value[r],"stroke-width":"2",fill:"none"},null,8,de),o("circle",{cx:1200,cy:400,transform:`translate(0,${h(r,f-1)*100})`,r:"6",fill:s(k)(r)},null,8,fe)]))),128)),o("polyline",{stroke:C.value.hsl,points:F.value,"stroke-width":"12",fill:"none"},null,8,ve),o("circle",{cx:1200,cy:400,transform:`translate(0,${g.value[f-1]*100})`,r:"12",fill:C.value.hsl},null,8,me)])),[[n,P]])])}}},we=L(pe,[["__scopeId","data-v-f2c41d54"]]);export{we as default};