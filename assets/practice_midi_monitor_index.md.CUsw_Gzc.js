import{c as S,T as C,ae as D,af as T,ag as j,ah as B,ai as O}from"./chunks/theme.B-lyZe0u.js";import{_ as M,U,k as P,f as s,g as u,h as m,m as g,p as k,r as N,Z as z,l as _,c as A,F as x,j as $,B as w,z as V,A as F,V as I,C as Z,a2 as E}from"./chunks/framework.B7TlvOs3.js";const J={class:"cc"},L={class:"px-1 text-center flex-1"},R={__name:"MidiMonitorCc",props:{cc:{type:Object,default:()=>{}}},emits:["update"],setup(t,{emit:v}){const d=t,a=v;let o=0;function h({movement:[i],dragging:l}){let n=i/2-o;o=i/2,l||(o=0);let e=Math.round(d.cc.raw+n);e>127&&(e=127),e<0&&(e=0),a("update",e)}return(i,l)=>{var e,p;const n=U("drag");return P((s(),u("div",J,[m("div",L,g((e=t.cc)==null?void 0:e.number),1),m("div",{class:"absolute h-full z-10 bg-gray-500 top-0 bg-opacity-40 self-start",style:k({width:((p=t.cc)==null?void 0:p.value)*100+"%"})},null,4)])),[[n,h]])}}},q=M(R,[["__scopeId","data-v-54180c31"]]),G={class:"font-bold"},H={class:"text-sm"},K={__name:"MidiMonitorNote",props:{note:{type:Object,default:()=>{}},active:Boolean},emits:["play","stop","update:active"],setup(t,{emit:v}){const d=t,a=v,o=N(!1);function h(){o.value=!0,a("update:active",!0),a("play")}function i(n=!1){o.value&&(o.value=!1,n||a("update:active",!1),a("stop"))}function l(){d.active&&!o.value&&(o.value=!0,a("update:active",!0),a("play"))}return(n,e)=>{var p,c,f;return s(),u("div",{class:"note",onMousedown:e[0]||(e[0]=r=>h()),onMouseup:e[1]||(e[1]=r=>i()),onMouseleave:e[2]||(e[2]=r=>i(!0)),onTouchstart:e[3]||(e[3]=z(r=>h(),["prevent"])),onTouchend:e[4]||(e[4]=r=>i()),onMousemove:e[5]||(e[5]=r=>l()),onTouchmove:e[6]||(e[6]=r=>l()),style:k({backgroundColor:_(S)(t.note.pitch,t.note.octA-1,t.note.velocity)})},[m("div",G,g((p=t.note)==null?void 0:p._name)+g((c=t.note)==null?void 0:c._accidental),1),m("div",H,g((f=t.note)==null?void 0:f.number),1)],36)}}},Q=M(K,[["__scopeId","data-v-431ac63e"]]),W=t=>(V("data-v-c07ef9ca"),t=t(),F(),t),X={class:"flex flex-col gap-4 items-start"},Y={class:"flex w-full h-full"},ee={class:"header absolute w-full text-center"},te=W(()=>m("div",{class:"p-6"},null,-1)),ne={class:"flex w-full"},oe={__name:"MidiMonitor",setup(t){const v=N(!1),{midi:d,midiAttack:a,midiRelease:o,setCC:h}=C(),i=A(()=>{const l={};for(let n in d.channels){const e=Object.keys(d.channels[n].activeNotes).map(p=>D(p,{sharps:!0}));l[n]=e.length>2?T(e):[]}return l});return(l,n)=>{const e=Q,p=q;return s(),u("div",X,[m("div",{class:"fullscreen-container w-full",id:"screen",onMouseleave:n[1]||(n[1]=c=>v.value=!1)},[m("div",Y,[(s(!0),u(x,null,$(_(d).channels,(c,f)=>{var r;return s(),u("div",{class:"flex flex-col flex-1 text-center relative",key:c.num},[m("div",ee,g(((r=i.value[f])==null?void 0:r[0])||Object.keys(c.activeNotes).map(y=>_(j).midiToNoteName(y,{sharps:!0})).join(" ")||c.num),1),te,(s(!0),u(x,null,$(_(B)(c.notes),y=>(s(),w(e,{key:y.number,active:v.value,"onUpdate:active":n[0]||(n[0]=b=>v.value=b),note:y,onPlay:b=>_(a)(y),onStop:b=>_(o)(y)},null,8,["active","note","onPlay","onStop"]))),128))])}),128))]),m("div",ne,[(s(!0),u(x,null,$(_(d).channels,c=>(s(),u("div",{class:"flex flex-col flex-1 text-center",key:c.num},[(s(!0),u(x,null,$(c.cc,f=>(s(),w(p,{key:f,cc:f,onUpdate:r=>_(h)(f,r)},null,8,["cc","onUpdate"]))),128))]))),128))])],32)])}}},se=M(oe,[["__scopeId","data-v-c07ef9ca"]]),re=JSON.parse(`{"title":"MIDI Monitor","description":"See everything that's happening on your MIDI-bus right in the browser","frontmatter":{"title":"MIDI Monitor","description":"See everything that's happening on your MIDI-bus right in the browser","layout":"app","cover":"monitor.png","date":"2022-06-12T00:00:00.000Z"},"headers":[],"relativePath":"practice/midi/monitor/index.md","filePath":"practice/midi/monitor/index.md","lastUpdated":1725283166000}`),ae={name:"practice/midi/monitor/index.md"};function ie(t,v,d,a,o,h){const i=se,l=O,n=E("client-only");return s(),u("div",null,[I(n,null,{default:Z(()=>[I(i),I(l,{"to-channel":!1})]),_:1})])}const ue=M(ae,[["render",ie]]);export{re as __pageData,ue as default};