import{G as m,b as p,r as _,w as d,c as h,f as s,g as o,h as l,q as v,F as g,j as w,a4 as k}from"./framework.B7TlvOs3.js";const x={version:"1.1",baseProfile:"full",viewBox:"0 0 100 70",xmlns:"http://www.w3.org/2000/svg"},y=["transform"],C=l("circle",{cx:"0",cy:"35",r:"4.5",fill:"currentColor"},null,-1),B={key:0,fill:"gray",points:"-2,32 3,35 -2,38"},b=l("rect",{x:"0",y:"0",width:"100",height:"70",stroke:"currentColor",fill:"none","stroke-width":"2",rx:"2"},null,-1),F={__name:"SoundVibrations",setup(V){const{timestamp:a,resume:i,pause:u}=m({offset:-Date.now(),controls:!0}),n=p([]),t=_(!1);d(()=>{t.value?i():u()});for(let e=1;e<25;e++){const r={cx:h(()=>Math.cos(a.value/1e3-e)*3.5+10),r:e*4};n.push(r)}return(e,r)=>(s(),o("svg",x,[l("g",{class:"cursor-pointer",transform:`translate(${n[0].cx},0)`,onClick:r[0]||(r[0]=c=>t.value=!t.value)},[C,t.value?v("",!0):(s(),o("polygon",B))],8,y),(s(!0),o(g,null,w(n,(c,f)=>(s(),o("circle",k({key:f,ref_for:!0},c,{cy:"35","stroke-width":"0.5","stroke-linecap":"round",stroke:"currentColor",fill:"none"}),null,16))),128)),b]))}};export{F as default};