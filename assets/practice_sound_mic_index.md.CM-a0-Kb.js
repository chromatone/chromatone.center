import{_ as g}from"./chunks/AnalysisFFT.CNZQRaiO.js";import{_ as y}from"./chunks/AnalysisScope.BA5Ss-Un.js";import{H as x,ay as r,aq as h}from"./chunks/theme.BRAeJ4NP.js";import{u as d}from"./chunks/useElementary.FSDwvDTC.js";import{s as S,d as p,f as u,g as _,h as O,m as $,l as t,n as C,R as i,_ as M,A,$ as U}from"./chunks/framework.BH4RfCYQ.js";const e=S({isOpen:!1,stream:null,streamSource:null,gain:x(1,0,10),async open(){const{audio:n}=d();navigator.mediaDevices&&navigator.mediaDevices.getUserMedia&&(e.stream=await navigator.mediaDevices.getUserMedia({audio:{echoCancellation:!1,noiseSuppression:!1}}),e.streamSource=n.ctx.createMediaStreamSource(e.stream),e.streamSource.connect(n.node))},close(){e.streamSource.disconnect()}});function b(){const{audio:n,render:a}=d();return p(e,()=>{const s=r.mul(r.const({key:"mic:gain",value:e.gain.value}),r.in({key:"mic:in",channel:0}));n.layers.mic={signal:e.isOpen?[r.scope({name:"mic",size:512},s),s]:[0,0]},n.started=!1,a("mic")}),p(()=>e.isOpen,s=>{s?e.open():setTimeout(()=>{e.close()},400)}),e}const k={class:"is-group flex items-center"},D={__name:"InputMic",setup(n){const a=b();return(s,o)=>{const l=h,m=y;return u(),_("div",k,[O("button",{class:C(["text-button",{"text-red-500":t(a).isOpen}]),onClick:o[0]||(o[0]=c=>t(a).isOpen=!t(a).isOpen)},$(t(a).isOpen?"Close":"Open")+" mic",3),i(l,{param:"GAIN",modelValue:t(a).gain.value,"onUpdate:modelValue":o[1]||(o[1]=c=>t(a).gain.value=c),min:0,max:10,step:.1},null,8,["modelValue"]),i(m,{name:"mic"})])}}},z=JSON.parse('{"title":"Microphone audio analysis","description":"Use any mic or audio input device and see some valuable data extracted from it","frontmatter":{"title":"Microphone audio analysis","description":"Use any mic or audio input device and see some valuable data extracted from it","date":"2019-11-03T00:00:00.000Z","cover":"mic-app.png","layout":"app"},"headers":[],"relativePath":"practice/sound/mic/index.md","filePath":"practice/sound/mic/index.md","lastUpdated":1725939455000}'),V={name:"practice/sound/mic/index.md"};function w(n,a,s,o,l,m){const c=D,f=g,v=U("client-only");return u(),_("div",null,[i(v,null,{default:A(()=>[i(c,{class:"m-2"}),i(f,{class:"m-2"})]),_:1})])}const E=M(V,[["render",w]]);export{z as __pageData,E as default};