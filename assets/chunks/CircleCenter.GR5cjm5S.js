import{L as h,f as o,g as n,h as r,_ as w,e as C,c as L,b as M,U as f,k as d,l as s,m as B,V as l}from"./framework.B7TlvOs3.js";import{_ as D}from"./SvgRing.D_AsrGJl.js";import{V as z}from"./theme.B-lyZe0u.js";const V={style:{"vertical-align":"middle"},viewBox:"0 0 32 32",width:"1.2em",height:"1.2em"},H=r("path",{fill:"currentColor",d:"m26.281 4.281l-22 22L5.72 27.72l22-22z"},null,-1),N=[H];function S(u,c){return o(),n("svg",V,[...N])}const A=h({name:"la-slash",render:S}),E={style:{"vertical-align":"middle"},viewBox:"0 0 32 32",width:"1.2em",height:"1.2em"},F=r("path",{fill:"currentColor",d:"M7.219 5.781L5.78 7.22L14.563 16L5.78 24.781l1.44 1.439L16 17.437l8.781 8.782l1.438-1.438L17.437 16l8.782-8.781L24.78 5.78L16 14.563z"},null,-1),I=[F];function P(u,c){return o(),n("svg",E,[...I])}const R=h({name:"la-times",render:P}),T={style:{"vertical-align":"middle"},viewBox:"0 0 32 32",width:"1.2em",height:"1.2em"},U=r("path",{fill:"currentColor",d:"M5 15v2h22v-2z"},null,-1),j=[U];function q(u,c){return o(),n("svg",T,[...j])}const G=h({name:"la-minus",render:q}),J={style:{"vertical-align":"middle"},viewBox:"0 0 32 32",width:"1.2em",height:"1.2em"},K=r("path",{fill:"currentColor",d:"M15 5v10H5v2h10v10h2V17h10v-2H17V5z"},null,-1),O=[K];function Q(u,c){return o(),n("svg",J,[...O])}const W=h({name:"la-plus",render:Q}),X={class:"center",style:{"touch-action":"none"},"text-anchor":"middle"},Y=["stroke","r","fill"],Z={class:"bpm",fill:"currentColor","font-family":"Commissioner, sans-serif","font-weight":"bold","font-size":"42px",x:0,y:12},tt={class:"controls cursor-pointer","font-size":"30"},et={__name:"CircleCenter",setup(u){const{isDark:c}=C(),a=L(()=>c.value?"#333":"#eee"),t=z(),i=M({radius:120,thick:60});function g(v){t.bpm+=(v.delta[0]-v.delta[1])/4}return(v,e)=>{const m=D,x=W,k=G,y=R,$=A,b=f("drag"),_=f("tooltip");return o(),n("g",X,[d((o(),n("g",{class:"bpm cursor-pointer",onDblclick:e[0]||(e[0]=p=>s(t).bpm=120)},[r("circle",{class:"transition-all duration-100 ease-out","stroke-width":"6",stroke:s(t).blink?s(t).color:"transparent",cx:"0",cy:"0",opacity:"0.6",r:i.radius/2,fill:a.value},null,8,Y),r("text",Z,B(s(t).bpm.toFixed()),1)],32)),[[b,g],[_,"Drag to change BPM",void 0,{bottom:!0}]]),r("g",tt,[d((o(),n("g",{class:"arc plus",onMousedown:e[1]||(e[1]=p=>s(t).set(1))},[l(m,{cx:0,cy:0,from:45,to:135,fill:a.value,op:.7,radius:i.radius,thickness:i.thick},null,8,["fill","radius","thickness"]),l(x,{x:"65",y:"-15"})],32)),[[_,"Add 1",void 0,{right:!0}]]),d((o(),n("g",{class:"arc minus",onMousedown:e[2]||(e[2]=p=>s(t).set(-1))},[l(m,{cx:0,cy:0,from:225,to:315,fill:a.value,op:.7,radius:i.radius,thickness:i.thick},null,8,["fill","radius","thickness"]),l(k,{x:"-102",y:"-15"})],32)),[[_,"Subtract 1",void 0,{left:!0}]]),d((o(),n("g",{class:"arc multiply",onMousedown:e[3]||(e[3]=p=>s(t).set(s(t).bpm))},[l(m,{cx:0,cy:0,from:315,to:405,fill:a.value,op:.7,radius:i.radius,thickness:i.thick},null,8,["fill","radius","thickness"]),l(y,{x:"-18",y:"-104"})],32)),[[_,"Multiply by 2",void 0,{top:!0}]]),d((o(),n("g",{class:"arc multiply",onMousedown:e[4]||(e[4]=p=>s(t).set(-s(t).bpm/2))},[l(m,{cx:0,cy:0,from:135,to:225,fill:a.value,op:.7,radius:i.radius,thickness:i.thick},null,8,["fill","radius","thickness"]),l($,{x:"-18",y:"65"})],32)),[[_,"Divide by 2",void 0,{bottom:!0}]])])])}}},it=w(et,[["__scopeId","data-v-9d15a779"]]);export{it as C,R as _};