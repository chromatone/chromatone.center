import{e as i,s as L,a as P,o as A,_ as B,B as r,C as u,E as a,af as m,J as n,L as O,u as M,F as x,G as g,K as F}from"./framework.B_b_ZswS.js";import{bd as R,be as j,g as z,F as I,bi as T,Y as U,e as Y}from"./theme.oPgoCdSG.js";const G={class:"flex flex-col gap-4 p-2"},J={class:"text-2xl flex gap-2"},K={key:0,class:"p-0"},H={class:"flex is-group"},Q={class:"op-50 text-sm font-mono"},X={class:"text-2xl"},Z={class:"flex gap-2"},ee={class:"text-xl"},te={class:"flex gap-2 is-group p-2"},se={class:"op-50"},oe={class:"flex flex-wrap gap-2 is-group p-2"},ae={class:"op-30"},ne={class:"op-50"},ie={__name:"Words",setup(le){const h=["e","i","a","o","u","y"],k=["b","c","d","f","g","h","j","k","l","m","n","p","q","r","s","t","v","w","x","y","z"],y=i(()=>R([-7,8]).map(j(z.full.name))),c=L([]),b=P(!1),v=I(0,0,()=>c.value.length),_=i(()=>c.value[v.value]),q=i(()=>W(_.value)),p=i(()=>S(h)),E=i(()=>h.toSorted((o,e)=>p.value[o]>=p.value[e]?-1:1)),f=i(()=>S(k)),N=i(()=>k.toSorted((o,e)=>f.value[o]>=f.value[e]?-1:1)),V=i(()=>{const o=T();let e=y.value.map((s,t)=>({time:t/4,duration:"32n",note:s})),l=new U((s,t)=>{o.schedule(()=>{Y(t.note,t.duration)},s)},e).start("0");return l.loop=!0,l.loopStart=0,l.loopEnd="4m",l});A(async()=>{let{default:o}=await B(async()=>{const{default:e}=await import("./index.FVA3GufJ.js");return{default:e}},[]);c.value=o,b.value=!0,w()});function w(){v.value=Math.floor(Math.random()*c.value.length)}function S(o){const e={};o.forEach(s=>e[s]=0),c.value.forEach(s=>{for(let t of s)t in e&&e[t]++});let l=Object.values(e).reduce((s,t)=>s+t,0);for(let s in e)e[s]=e[s]/l;return e}function W(o){if(!o)return[];const e=/(?<consonant>[^aeiouy]?)(?<vowel>[aeiouy]*)/g;return Array.from(o.matchAll(e)).reduce((s,t)=>{const d=t.groups.consonant,C=t.groups.vowel;return(d||C)&&s.push([d||"",C||""]),s},[])}const $=speechSynthesis.getVoices();function D(){const o=new SpeechSynthesisUtterance(_.value);o.voice=$[0],speechSynthesis.speak(o)}return(o,e)=>{var l,s;return r(),u("div",G,[a("div",J,[m("WORDS "+n(V.value),1),b.value?O("",!0):(r(),u("div",K,"Loading..."))]),a("div",H,[a("button",{class:"text-button",onClick:e[0]||(e[0]=t=>v.value--)},"Prev"),a("button",{class:"text-button",onClick:e[1]||(e[1]=t=>w())},"Pick random"),a("button",{class:"text-button",onClick:e[2]||(e[2]=t=>D())},"SAY"),a("button",{class:"text-button",onClick:e[3]||(e[3]=t=>v.value++)},"Next")]),a("div",Q,n(M(v))+"/"+n((l=c.value)==null?void 0:l.length),1),a("div",X,n(_.value),1),a("div",Z,[(r(!0),u(x,null,g(q.value,t=>(r(),u("div",{class:"p-0 flex gap-2px",key:t},[(r(!0),u(x,null,g(t,d=>(r(),u("div",{class:"p-0",key:d},n(d),1))),128))]))),128))]),e[4]||(e[4]=a("hr",null,null,-1)),a("div",ee,"Letter frequencies in all "+n((s=c.value)==null?void 0:s.length)+" words",1),a("div",te,[(r(!0),u(x,null,g(E.value,t=>(r(),u("div",{class:"bg-light-100 dark-bg-dark-200 p-1 text-md",key:t,style:F({flex:`${p.value[t]}`})},[m(n(t.toUpperCase())+" ",1),a("div",se,n((p.value[t]*100).toFixed())+"%",1)],4))),128))]),a("div",oe,[(r(!0),u(x,null,g(N.value,(t,d)=>(r(),u("div",{class:"p-1 bg-light-100 dark-bg-dark-200",key:t,style:F({flex:`${(f.value[t]*1e3).toFixed(1)}`})},[m(n(t)+" ",1),a("div",ae,n(y.value[d]),1),a("div",ne,n((f.value[t]*100).toFixed(1))+"%",1)],4))),128))])])}}};export{ie as default};