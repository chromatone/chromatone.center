import{x as O,n as S,aW as A,H as $,d as L,c as y}from"./theme.B-lyZe0u.js";import{_ as W,G as X,u as h,d as q,N as G,r as H,w as K,c as d,U as T,f as a,g as i,h as o,F as N,j,n as U,l as s,p as V,m as x,k as Z,z as J,A as Q}from"./framework.B7TlvOs3.js";const R=v=>(J("data-v-f2c41d54"),v=v(),Q(),v),Y={class:"flex flex-col items-center fullscreen-container rounded-3xl",id:"screen"},ee={class:"flex flex-wrap mt-6"},te=["onClick"],oe={class:"p-4 flex flex-wrap items-center"},se={class:"is-group flex"},le={key:0,class:"i-la-pause"},ne={key:1,class:"i-la-play"},re={key:0,class:"i-la-volume-up"},ae={key:1,class:"i-la-volume-off"},ie={id:"chord-form",version:"1.1",baseProfile:"full",viewBox:"0 0 1260 800",xmlns:"http://www.w3.org/2000/svg"},ce={class:"zoom"},ue={y:"760",fill:"currentColor",x:"12"},de=["y1"],fe={class:"speed"},ve={y:"780",x:"12",fill:"currentColor"},me=["x1"],_e=R(()=>o("line",{x1:"0",x2:"1200",y1:"400",y2:"400",stroke:"gray","stroke-width":"1"},null,-1)),pe=["stroke","points"],he=["transform","fill"],ke=["stroke","points"],ye=["transform","fill"],xe=1200,f=600,we={__name:"ChromaForm",setup(v){const w=[];for(let e=0;e<13;e++)w[e]=Math.pow(2,e/12);const g=xe/f,{timestamp:z,pause:D,resume:I}=X({controls:!0,offset:Date.now(),immediate:!1}),c=h("chord-moving",!0);q(c,e=>{e?I():D()}),G(" ",e=>{e.preventDefault(),c.value=!c.value});const l=h("chord-notes-obj",{}),m=H(!1);K(()=>{if(m.value)for(let e in l.value){let t=e<3?3:4;O(S[e]+t)}else A()});const _=$(h("chord-zoom",400),75,1e3),p=$(h("chord-speed",100),10,400);function M(e){l.value[e]?delete l.value[e]:l.value[e]=!0}function B(e){e.tap&&(c.value=!c.value),p.value+=e.delta[0],_.value-=e.delta[1]}function k(e,t){return Math.sin((t+z.value*p.value/1e3)*(Math.PI*2*w[e])/_.value)}const E=d(()=>{let e="000000000000",t=e.split("");for(let n in l.value)t[Number(n)]="1";return e=t.join(""),e}),F=d(()=>{let e={};for(let t in l.value){e[t]=[];for(let n=0;n<f;n++)e[t].push(`${n*g},${k(Number(t),n)*100+400}`)}return e}),C=d(()=>{let e=[];for(let t=0;t<f;t++){e[t]=0;for(let n in l.value){let u=Number(n);e[t]+=k(u,t)}}return e}),P=d(()=>C.value.map((e,t)=>`${t*g},${e*100+400}`).join(" ")),b=d(()=>L(E.value,Object.keys(l.value)[0]));return(e,t)=>{const n=T("drag");return a(),i("div",Y,[o("div",ee,[(a(!0),i(N,null,j(s(S),(u,r)=>(a(),i("div",{class:U(["note",{active:s(l)[r]}]),key:u,style:V({backgroundColor:s(l)[r]?s(y)(r):u.length==2?"#333":"#aaa"}),onClick:ge=>M(r)},x(u),15,te))),128))]),o("div",oe,[o("div",se,[o("button",{onClick:t[0]||(t[0]=u=>c.value=!s(c))},[s(c)?(a(),i("div",le)):(a(),i("div",ne))]),o("button",{onClick:t[1]||(t[1]=u=>m.value=!m.value)},[m.value?(a(),i("div",ae)):(a(),i("div",re))])])]),Z((a(),i("svg",ie,[o("g",ce,[o("text",ue,"ZOOM X"+x(s(_)/100),1),o("line",{y1:800-s(_)/1e3*800,y2:"800",transform:"translate(4 0)","stroke-linecap":"round",stroke:"currentColor","stroke-opacity":"0.5","stroke-width":"8"},null,8,de)]),o("g",fe,[o("text",ve,"SPEED X"+x(s(p)/100),1),o("line",{x1:s(p)/400*1260,x2:"0",transform:"translate(0 795)","stroke-linecap":"round",stroke:"currentColor","stroke-opacity":"0.5","stroke-width":"12"},null,8,me)]),_e,(a(!0),i(N,null,j(s(l),(u,r)=>(a(),i("g",{key:r},[o("polyline",{stroke:s(y)(r),points:F.value[r],"stroke-width":"2",fill:"none"},null,8,pe),o("circle",{cx:1200,cy:400,transform:`translate(0,${k(r,f-1)*100})`,r:"6",fill:s(y)(r)},null,8,he)]))),128)),o("polyline",{stroke:b.value.hsl,points:P.value,"stroke-width":"12",fill:"none"},null,8,ke),o("circle",{cx:1200,cy:400,transform:`translate(0,${C.value[f-1]*100})`,r:"12",fill:b.value.hsl},null,8,ye)])),[[n,B]])])}}},Se=W(we,[["__scopeId","data-v-f2c41d54"]]);export{Se as default};