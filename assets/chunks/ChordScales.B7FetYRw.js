import{ac as B,r as N,A as j,g as c,c as D,n as h,i as L,d as w}from"./theme.B-lyZe0u.js";import{e as z,c as d,f as n,g as i,F as p,j as _,p as x,l as o,h as m,ae as A,m as u}from"./framework.B7TlvOs3.js";const E={class:"flex gap-1"},F={class:"z-10 sticky top-0 font-bold px-2 flex items-center"},V=m("div",{class:"flex-1"},null,-1),$={class:"text-sm"},M=["onClick"],H={__name:"ChordScales",emits:["chord"],setup(T,{emit:v}){const{isDark:C}=z(),k=v,y=d(()=>B().map(t=>{const s=[0,...t.chroma.split("").map((e,l)=>e==1?l:!1).filter(Boolean)];let r={};return s.forEach(e=>r[e]=g(N(t.chroma.split(""),e).join(""))),{...t,degrees:s,degreeChords:r}}));function b(t="101010010100",s="100010010000"){let r=t.split(""),e=s.split("");if(e.reduce((a,S)=>Number(S)+Number(a))<3)return!1;for(let a=0;a<12;a++)if(e[a]==1&&r[a]!=1)return!1;return!0}function g(t="101010010100"){return j().filter(s=>b(t,s.chroma))}const f=d(()=>y.value.find(t=>t.chroma==c.chroma));return(t,s)=>{var r;return n(),i("div",E,[(n(!0),i(p,null,_((r=f.value)==null?void 0:r.degrees,e=>(n(),i("div",{class:"flex flex-col border-2 gap-1 relative max-h-120 overflow-y-scroll overflow-x-hidden overscroll-none rounded",style:x([{flex:"1 1 200px"},{borderColor:o(D)((e+o(c).tonic)%12,2)}]),key:e},[m("div",F,[A(u(o(h)[(e+o(c).tonic)%12]),1),V,m("div",$,u(o(L)[e]),1)]),(n(!0),i(p,null,_(f.value.degreeChords[e],l=>(n(),i("button",{class:"p-1 text-sm flex flex-col justify-center",style:x([{"scroll-snap-align":"center"},{backgroundColor:o(w)(l.chroma,(e+o(c).tonic)%12,.2,o(C)?4:14).lch}]),onClick:a=>k("chord",{chroma:l.chroma,degree:e}),key:l},u(o(h)[(e+o(c).tonic)%12])+u(l.aliases[0]),13,M))),128))],4))),128))])}}};export{H as _};