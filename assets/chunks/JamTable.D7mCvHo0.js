import{_ as C}from"./JamDate.D6N1xjty.js";import{w as $,M as x,b1 as b,g as t,n as S,i as j,aW as B,S as D,_ as z,b5 as J}from"./theme.4FwZXZE5.js";import{e as T,f as c,g as r,F as y,j as w,p as h,l as e,h as s,m as i,n as F,r as k,am as M,x as N,R as a,A as V,k as W,v as A,aj as E,$ as L}from"./framework.D4K5LW16.js";import{_ as O}from"./ChromaCode.yEYJJ0VS.js";const R={class:"flex flex gap-1"},q=["onClick"],G={class:"text-md opacity-80"},H={__name:"JamChroma",setup(g){return T(),(_,n)=>(c(),r("div",R,[(c(!0),r(y,null,w(e(t).chroma,(l,o)=>(c(),r("div",{class:"flex-1 text-black rounded cursor-pointer relative flex items-center flex-col gap-2 justify-between overflow-hidden",key:o,style:h({color:e($)(e(x)(o,l,"#fff","#000")).isDark()?"white":"black",backgroundColor:e(x)(o,l,"#fffa","#000a"),opacity:e(b)[(o+e(t).tonic)%12]?1:l==1?.9:.3}),onClick:d=>e(t).tonic=(o+e(t).tonic)%12},[s("div",{class:"pt-2 font-bold text-center text-xl",style:h({fontWeight:l==1?"bold":"normal"})},i(e(S)[(o+e(t).tonic)%12]),5),s("div",{class:F(["p-2 mx-auto opacity-0 rounded-full transition",{"opacity-80":e(b)[(o+e(t).tonic)%12]}]),style:{backgroundColor:"currentColor"}},null,2),s("div",G,i(e(j)[o]),1),s("div",{class:"p-6px w-full opacity-80",style:h({backgroundColor:e(x)(o,0,"#fff8","#0008")})},null,4)],12,q))),128))]))}},I={class:"flex gap-4 items-center"},K={class:"p-0 text-2xl font-bold flex items-center gap-4"},P={class:"w-60 text-lg tabular-nums font-mono"},Q=["onClick"],U={class:"p-0 text-xl"},X={__name:"JamScale",setup(g){const _=k();M(_,()=>{n.value=!1});const n=k(!1);return(l,o)=>{var p,u,f,v;const d=O;return c(),r("div",I,[s("div",{class:"w-full flex gap-4 cursor-pointer bg-dark-900 bg-opacity-40 p-2 rounded-xl items-center",onClick:o[0]||(o[0]=m=>n.value=!n.value)},[s("div",K,i((u=(p=e(t))==null?void 0:p.note)==null?void 0:u.name)+" "+i((v=(f=e(t))==null?void 0:f.set)==null?void 0:v.name),1),o[1]||(o[1]=s("div",{class:"flex-1"},null,-1)),o[2]||(o[2]=s("div",{class:"text-lg i-la-angle-down"},null,-1))]),s("div",P,i(e(B)[0]),1),N(l.$slots,"default"),a(E,{name:"fade"},{default:V(()=>[W(s("div",{class:"flex flex-col max-h-40vh overflow-scroll absolute bg-light-100 dark-bg-dark-100 rounded-xl overscroll-contain scroll-smooth snap-y snap-proximity z-100",ref_key:"menu",ref:_},[(c(!0),r(y,null,w(e(D).all(),m=>(c(),r("div",{class:"text-md flex-auto flex items-center gap-2 cursor-pointer hover-bg-light-400 hover-bg-opacity-10 p-2",key:m,onClick:oe=>{e(t).chroma=m.chroma,n.value=!1}},[s("div",U,i(m.name),1),o[3]||(o[3]=s("div",{class:"flex-1"},null,-1)),a(d,{chroma:m.chroma,cols:12},null,8,["chroma"])],8,Q))),128))],512),[[A,n.value]])]),_:1})])}}},Y={class:"bg-light-900 dark-bg-dark-800",id:"screen"},Z={class:"flex p-4 gap-4 items-center flex-wrap w-full"},ee={class:"flex p-4 gap-4 items-center w-full"},ne={__name:"JamTable",setup(g){return(_,n)=>{const l=L("gpu-shader"),o=z,d=X,p=H,u=J,f=C;return c(),r("div",Y,[s("div",{class:"flex gap-6 p-4 justify-between relative items-stretch flex-col min-h-full",style:h({backgroundColor:`hsla(${30*e(t).tonic}, 80%, 50%, 0.1)`})},[s("div",Z,[a(l,{class:"w-60 h-60"}),a(o,{class:"flex-1 max-h-60 transform -scale-y-100 -scale-x-100",chroma:e(t).chroma,pitch:e(t).tonic},null,8,["chroma","pitch"])]),a(d),a(p,{class:"flex-auto"}),s("div",ee,[a(o,{class:"flex-1 max-h-60",chroma:e(t).chroma,pitch:e(t).tonic},null,8,["chroma","pitch"]),a(u,{class:"w-60 op-70",letters:!1,chroma:!0})]),a(f)],4)])}}};export{ne as default};