import{d as P,g as n,a as j,r as H,n as $,l as J,c as k,m as f,S,o as R,e as L,q as K,t as W,v as Z,x as Q,y as X,u as Y,z as M,_ as ee}from"./chunks/theme.oPgoCdSG.js";import{z as D,e as y,a as te,B as m,C as u,F as E,G as T,H as oe,I as se,E as d,u as e,K as A,J as v,U as ae,L as ne,n as re,R as B,i as le,D as V,W as ie,a0 as ce}from"./chunks/framework.B_b_ZswS.js";const me={class:"max-h-3xl w-full transition-all duration-400 ease-in-out",version:"1.1",baseProfile:"full",viewBox:"0 0 100 100",xmlns:"http://www.w3.org/2000/svg",style:{"user-select":"none"}},ue=["stroke","opacity","x1","y1","x2","y2"],de=["opacity","onClick"],fe=["cx","cy","opacity","fill"],pe=["fill","x","y"],he=["fill","stroke"],ye=["fill"],ve=["fill"],xe=["fill"],_e=["stroke","x1","y1","x2","y2"],Ce={__name:"ChromaCompassCircle",props:{chroma:{type:String,default:"100101000110"},scaleChroma:{type:String,default:"100011010001"}},emits:["update:chroma","clearScale"],setup(p,{emit:i}){const h=p,z=i,x=y(()=>P(h.chroma,n.tonic)),b=y(()=>j(h.chroma)),c=y(()=>{let o=H(h.scaleChroma.split(""),-n.tonic),s=[],t=0,r=0;return o.forEach((C,g)=>{var G;g>0&&C=="1"&&(t++,s[t]=[((G=s[t-1])==null?void 0:G[1])||0,g],r=g)}),s.length>0&&s.push([r,0]),s}),l=te(!1);function w(o){let s=(24+Number(o)-n.tonic)%12;if(l.value){n.tonic=Number(o),l.value=!1,F();return}if(U(o,h.chroma[s]=="1"?1:0),Number(o)!=n.tonic){let t=h.chroma+"";t[s]=="0"?t=I(t,s,1):t=I(t,s,0),z("update:chroma",t)}else l.value?(n.tonic=s,l.value=!1):l.value=!0}function I(o,s,t){return o.substring(0,s)+t+o.substring(s+1)}function a(o){return R(h.chroma,n.tonic,o)}function N(o){return a(o%12)?k(o%12):$[o].length!=2?"hsla(0,0%,90%,1)":"hsla(0,0%,10%,1)"}function U(o=0,s=0){n.tonic>0&&o<n.tonic&&(o=o+12),o=o+12*s,L(o+57)}const _=y(()=>{let o=H(h.chroma,-n.tonic),t=$.map((r,C)=>{let g=4;return C+9<n.tonic&&(g=5),r+g}).filter((r,C)=>{if(o[C]=="1")return!0});return J(t)});function F(){_.value.forEach(o=>{K(o)}),re(()=>{_.value.forEach((o,s)=>{setTimeout(()=>{L(o)},200)})})}function q(){_.value.forEach(o=>{W(o)}),Z(_.value)}function O(){_.value.forEach(o=>{Q(o)}),X(_.value)}return(o,s)=>(m(),u("svg",me,[(m(!0),u(E,null,T(p.chroma.split(""),(t,r)=>(m(),u("g",{key:r},[oe(d("line",{class:"line",stroke:e(k)(e(n).tonic+r),"stroke-linecap":"round","stroke-width":"10",style:{"mix-blend-mode":"multiply"},opacity:t?.5:0,x1:e(f)(e(n).tonic).x,y1:e(f)(e(n).tonic).y,x2:e(f)(e(n).tonic+r).x,y2:e(f)(e(n).tonic+r).y},null,8,ue),[[se,t=="1"]])]))),128)),(m(!0),u(E,null,T(p.chroma.split(""),(t,r)=>(m(),u("g",{class:"around",key:r,style:{cursor:"pointer"},opacity:a(r)?1:.3,onClick:C=>w(r)},[d("circle",{class:"note",style:A([{"transform-box":"fill-box","transform-origin":"center center"},{transform:`scale(${e(n).tonic==r?2.6:a(r)?1.62:1}`}]),cx:e(f)(r).x,cy:e(f)(r).y,r:"5",opacity:e(n).tonic==r&&l.value?.5:1,fill:N(r)},null,12,fe),d("text",{fill:e($)[r].length==2?"hsla(0,0%,0%,0.8)":"hsla(0,0%,100%,0.9)","font-family":"Commissioner, sans-serif","font-size":"4px","text-anchor":"middle","dominant-baseline":"middle",x:e(f)(r).x,y:e(f)(r).y+.5},v(e($)[r]),9,pe)],8,de))),128)),d("g",{class:"cursor-pointer",onMousedown:s[0]||(s[0]=t=>q()),onTouchstart:s[1]||(s[1]=ae(t=>q(),["prevent","stop"])),onTouchend:s[2]||(s[2]=t=>O()),onTouchcancel:s[3]||(s[3]=t=>O()),onMouseup:s[4]||(s[4]=t=>O()),onMouseleave:s[5]||(s[5]=t=>O())},[d("circle",{cx:50,cy:49,r:12,"stroke-width":2,"stroke-opacity":.6,fill:x.value.lch,stroke:x.value.hsl},null,8,he),d("text",{fill:e(k)(e(n).tonic),x:"50",y:"50","font-weight":"bold","font-size":"8px","font-family":"Commissioner, sans-serif","text-anchor":"middle","dominant-baseline":"middle"},v(e($)[e(n).tonic])+v(b.value.empty?"":b.value.aliases[0]),9,ye)],32),d("text",{fill:e(k)(e(n).tonic),x:"50",y:"58","font-weight":"normal","font-size":"4px","font-family":"Commissioner, sans-serif","text-anchor":"middle","dominant-baseline":"middle"},v(e(S).get(p.chroma).empty?"":e(S).get(p.chroma).name),9,ve),e(S).get(p.scaleChroma).empty?ne("",!0):(m(),u("text",{key:0,fill:e(k)(e(n).tonic),x:"50",y:"63","font-weight":"normal","font-size":"3px","font-family":"Commissioner, sans-serif","text-anchor":"middle","dominant-baseline":"middle",onClick:s[6]||(s[6]=t=>o.$emit("clearScale"))},v(e(S).get(p.scaleChroma).empty?"":e(S).get(p.scaleChroma).name)+" ×",9,xe)),(m(!0),u(E,null,T(c.value,(t,r)=>(m(),u("line",{class:"line",key:r,stroke:e(k)(t==null?void 0:t[1]),"stroke-linecap":"round","stroke-width":"0.5",x1:e(f)(t==null?void 0:t[0],12,30).x,y1:e(f)(t==null?void 0:t[0],12,30).y,x2:e(f)(t==null?void 0:t[1],12,30).x,y2:e(f)(t==null?void 0:t[1],12,30).y,opacity:"0.5"},null,8,_e))),128))]))}},ge=D(Ce,[["__scopeId","data-v-f53fcbb8"]]),ke={class:"fullscreen-container rounded-3xl",id:"screen"},$e={class:"relative w-full m-auto"},be={class:"max-w-60ch m-auto flex flex-col items-center"},we={class:"flex flex-col p-2"},Ne={class:"flex flex-wrap mx-auto justify-center"},Se=["onClick"],Ee={class:"flex flex-wrap justify-center"},Te=["onClick"],ze={__name:"ChromaCompass",setup(p){const i=Y("chroma-chroma",M()[0].chroma),h=["Intervals","Triads","Tetrads","Pentads","Hexads","Heptads"],z=y(()=>{let c=[];for(let l=0;l<6;l++)c[l]=M().filter(w=>w.intervals.length===l+2);return c});y(()=>j(i.value));const x=y(()=>i.value.split("").reduce((c,l)=>Number(c)+Number(l))),b=y(()=>M().filter(c=>c.intervals.length===x.value));return(c,l)=>{const w=ge,I=ee;return m(),u("div",ke,[d("div",$e,[B(w,{id:"chroma-compass",chroma:e(i),"onUpdate:chroma":l[0]||(l[0]=a=>le(i)?i.value=a:null),"scale-chroma":c.scaleChroma,onClearScale:l[1]||(l[1]=a=>c.clearScale())},null,8,["chroma","scale-chroma"])]),d("div",be,[B(I,{class:"m-auto",pitch:e(n).tonic,"onUpdate:pitch":l[2]||(l[2]=a=>e(n).tonic=a),chroma:e(i)},null,8,["pitch","chroma"]),d("div",we,[d("div",Ne,[(m(),u(E,null,T(h,(a,N)=>d("div",{class:V(["chord-group",{active:N+2==x.value}]),key:a,onClick:U=>i.value=z.value[N][0].chroma},v(a),11,Se)),64))]),d("div",Ee,[(m(!0),u(E,null,T(b.value,a=>(m(),u("div",{class:V(["chord",{active:(a==null?void 0:a.chroma)==e(i)}]),key:a==null?void 0:a.aliases[0],style:A({color:(a==null?void 0:a.chroma)==e(i)?"white":e(P)(a.chroma,e(n).tonic).hsl,backgroundColor:(a==null?void 0:a.chroma)==e(i)?e(P)(a.chroma,e(n).tonic).hsl:""}),onClick:N=>i.value=a.chroma},v(e($)[e(n).tonic]+(a==null?void 0:a.aliases[0])),15,Te))),128))])])])])}}},Ie=D(ze,[["__scopeId","data-v-23de7539"]]),De=JSON.parse('{"title":"Compass","description":"Explore any combination of 12 tone equal temperament pitches","frontmatter":{"title":"Compass","description":"Explore any combination of 12 tone equal temperament pitches","cover":"compass.svg","date":"2021-04-20T00:00:00.000Z","layout":"app"},"headers":[],"relativePath":"practice/chroma/compass/index.md","filePath":"practice/chroma/compass/index.md","lastUpdated":1736779474000}'),Oe={name:"practice/chroma/compass/index.md"};function Be(p,i,h,z,x,b){const c=Ie,l=ce("client-only");return m(),u("div",null,[B(l,null,{default:ie(()=>[B(c)]),_:1})])}const Ue=D(Oe,[["render",Be]]);export{De as __pageData,Ue as default};