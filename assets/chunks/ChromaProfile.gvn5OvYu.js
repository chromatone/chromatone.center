import{_ as J}from"./ChromaRow.Cinu4cN9.js";import{_ as K}from"./ChromaCode.DahetQ3e.js";import{D as Q,E as X,r as Y,g as y,d as L,p as j,s as S,c as Z,a as A,b as V,F as ee,G as q,n as te,_ as oe}from"./theme.BwIdyTJj.js";import{_ as ae}from"./ChromaCircle.CBLm2fF1.js";import{_ as ne}from"./AbcRender.CSkedfSu.js";import{q as R,v as se,r as $,u as G,av as le,g as re,w as ie,c as i,x as h,y as w,E as s,S as ce,A as f,G as k,F as ue,B as me,b as fe,P as b,I as T,T as de,H as he}from"./framework.BR0mAPCP.js";const ve=["viewBox"],pe=["transform"],ge=["fill"],ye={class:"select-none",opacity:"0.7","font-size":"80",y:"25",x:"50",fill:"currentColor"},we=["stroke","points"],$e=["stroke","points"],z=4e3,F=300,E=2e3,xe={__name:"ChromaProfileWaveform",props:{chroma:{type:String,default:"100010001000"},mix:{type:Boolean,default:!1}},setup(o){const{isDark:B}=se(),c=[];for(let t=0;t<13;t++)c[t]=Math.pow(2,t/12);const C=o,x=z/E,r=$(!1),v=$(0),p=$(0),l=$(2e3),a=$(),u=$(1e3),m=Q(G("waveform-speed",1e3),0,l);X(t=>{const e=t.delta[0]-t.delta[1];m.value+=e},{domTarget:a});const M=le(p,{duration:u,transition:[.87,-.04,.69,1.13],onFinished:()=>{p.value==0&&D()}}),{resume:N,pause:D}=re(()=>{v.value+=M.value},{immediate:!1});ie(()=>{r.value?(N(),p.value>0&&(u.value=10),p.value=m.value):(p.value=0,u.value=1e3)});const _=i(()=>{let t=[],e=Y(C.chroma.split(""),-y.tonic);for(let n=0;n<12;n++)e[n]==1?t[n]=!0:delete t[n];return t}),g=G("chord-zoom",400);function I(t,e){return Math.sin((e+v.value)*(Math.PI*2*c[t])/g.value)}const W=i(()=>{let t={};for(let e in _.value){t[e]=[];for(let n=0;n<E;n++)t[e].push(`${n*x},${I(Number(e),n)*100+F/2}`)}return t}),H=i(()=>{let t=[];for(let e=0;e<E;e++){t[e]=0;for(let n in _.value){let d=Number(n);t[e]+=I(d,e)}}return t}),O=i(()=>H.value.map((t,e)=>`${e*x},${t*30+F/2}`).join(" ")),U=i(()=>L(C.chroma,y.tonic));return(t,e)=>{var n;return h(),w("div",{class:"waveform",ref_key:"waveContainer",ref:a},[(h(),w("svg",{class:"min-h-4em w-full cursor-pointer",version:"1.1",baseProfile:"full",viewBox:`0 0 ${z} ${F}`,xmlns:"http://www.w3.org/2000/svg",onMousedown:e[0]||(e[0]=d=>{s(j)(o.chroma),r.value=!0}),onTouchstart:e[1]||(e[1]=ce(d=>{s(j)(o.chroma),r.value=!0},["prevent","stop"])),onTouchend:e[2]||(e[2]=d=>{s(S)(o.chroma),r.value=!1}),onTouchcancel:e[3]||(e[3]=d=>{s(S)(o.chroma),r.value=!1}),onMouseup:e[4]||(e[4]=d=>{s(S)(o.chroma),r.value=!1}),onMouseleave:e[5]||(e[5]=d=>{s(S)(o.chroma),r.value=!1})},[f("g",{transform:`translate(${s(m)/l.value*z} 10)`},[f("circle",{r:"40",fill:U.value.hsl},null,8,ge),f("text",ye,k(s(m)*60)+" px/sec",1)],8,pe),e[6]||(e[6]=f("line",{x1:"0",x2:"1200",y1:"400",y2:"400",stroke:"gray","stroke-width":"1"},null,-1)),(h(!0),w(ue,null,me(_.value,(d,P)=>(h(),w("g",{key:P},[f("polyline",{stroke:s(Z)(P,s(B)?8:2),points:W.value[P],"stroke-width":"4",fill:"none",opacity:"0.9"},null,8,we)]))),128)),f("polyline",{stroke:(n=U.value)==null?void 0:n.hsl,points:O.value,"stroke-width":"24",fill:"none"},null,8,$e)],40,ve))],512)}}},_e=R(xe,[["__scopeId","data-v-b7d07ef8"]]),be={class:"flex w-full relative px-4"},ke=["href"],Ce={class:"text-2xl font-bold capitalize mb-2"},Se={class:"flex items-center mx-2 w-full gap-4 flex-wrap"},Be={key:1,class:"p-4"},Me={__name:"ChromaProfile",props:{title:{type:String,default:null},chroma:{type:String,default:"1001000100000"},abc:{type:String,default:null},link:{type:String,default:null},description:{type:String,default:""},editable:{type:Boolean,default:!1}},emits:["update:chroma"],setup(o,{emit:B}){const c=o,C=B;fe({chord:i(()=>A(c.chroma)),scale:i(()=>V(c.chroma))});const x=i(()=>A(c.chroma)),r=i(()=>V(c.chroma)),v=i(()=>ee(c.chroma));i(()=>{let l=[];if(!v.value)return[];for(let a=1;a<v.value.length;a++)l[a-1]=q(v.value[a])-q(v.value[a-1]);return l});function p(l){console.log(l,c.chroma,y.tonic);let a=c.chroma;const u=(12-y.tonic+l)%12;if(console.log(u),u==0)return;let m=a.split("");m[u]=m[u]=="0"?"1":"0",C("update:chroma",m.join(""))}return(l,a)=>{const u=_e,m=ne,M=ae,N=oe,D=K,_=J;return h(),w("div",{class:"profile",style:he({borderColor:s(L)(o.chroma,s(y).tonic).hsl})},[b(u,{chroma:o.chroma},null,8,["chroma"]),f("div",be,[o.link?(h(),w("a",{key:0,class:"p-2 absolute top-8px right-2em",href:o.link,target:"_blank"},a[3]||(a[3]=[f("div",{class:"i-la-wikipedia-w"},null,-1)]),8,ke)):T("",!0),f("div",Ce,k(s(te)[s(y).tonic])+" "+k(x.value.aliases[0]||x.value.name||r.value.name||o.title)+" "+k(r.value.aliases[0]?`(${r.value.aliases[0]})`:""),1)]),o.abc?(h(),de(m,{key:0,abc:o.abc},null,8,["abc"])):T("",!0),f("div",Se,[b(M,{style:{flex:"1 0 120px"},chroma:o.chroma},null,8,["chroma"]),b(N,{style:{flex:"1 0 200px"},chroma:o.chroma,"onUpdate:chroma":a[0]||(a[0]=g=>l.$emit("update:chroma",g)),pitch:s(y).tonic,title:!1,"onUpdate:pitch":p,playAll:!0},null,8,["chroma","pitch"]),b(D,{style:{flex:"1 0 120px"},chroma:o.chroma,"onUpdate:chroma":a[1]||(a[1]=g=>l.$emit("update:chroma",g))},null,8,["chroma"])]),b(_,{class:"mx-2 mb-2",chroma:o.chroma,"onUpdate:chroma":a[2]||(a[2]=g=>l.$emit("update:chroma",g)),editable:o.editable},null,8,["chroma","editable"]),o.description?(h(),w("div",Be,k(o.description),1)):T("",!0)],4)}}},Ee=R(Me,[["__scopeId","data-v-2f5ff41a"]]);export{Ee as _};