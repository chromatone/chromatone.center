import{r as f,N as b,b1 as I,b as $,c as B,u as m,d as R,o as q,U as A,f as u,g as p,h as a,k as U,B as N,q as O,m as z,V as k,J as T}from"./framework.B7TlvOs3.js";import{b9 as j,H as F,ba as L,bb as G,aA as H,aq as J}from"./theme.B-lyZe0u.js";import{_ as K}from"./ControlStart.pSxYfY8v.js";const Q={class:"flex flex-col justify-center"},W=["width","height"],X={class:"absolute top-4 left-4 text-xl select-none"},Y={key:0,class:"i-la-play"},Z={key:1,class:"i-la-pause"},ee={key:0,class:"i-la-arrow-left"},te={key:1,class:"i-la-arrow-down"},oe=a("div",{class:"i-la-trash-alt"},null,-1),se=[oe],ae={class:"absolute w-full bottom-2 flex items-center gap-2 px-2 flex-wrap"},ne={class:"is-group flex flex-wrap gap-2 flex-0 p-2 op-20 hover-op-80 transition"},le=a("div",{class:"flex-1"},null,-1),ie={class:"scale-75 max-h-60 overflow-clip relative text-white op-20 hover-op-80 transition"},re=a("div",{class:"absolute p-2 opacity-70 touch-none select-none text-md"},"Right click here to enter Picture-In-Picture mode",-1),he={__name:"PitchSpectrogram",setup(ce){const C=f(),h=f(),v=f(),{mic:S,input:M}=j(),i=f(!1);b(" ",o=>{i.value=!i.value,o.preventDefault()}),b("Enter",o=>{g(),o.preventDefault()});let c,n,r,_;function g(){n.fillStyle="#000",n.fillRect(0,0,e.width,e.height)}const{width:w,height:x}=I(v),e=$({initiated:!1,width:w,height:x,speed:B(()=>Math.floor(e.speedCount/100)),speedCount:F(100,100,500),vertical:m("spectrogram-vertical",!1),pow:m("spectrogram-power",1),offset:m("spectrogram-offset",0)});function V(o){o.tap&&(i.value=!i.value),e.speedCount-=o.delta[0]/2}R([w,x],([o,t])=>{c&&r&&(c.width=o,c.height=t,r.width=o,r.height=t)}),q(()=>{L(),c=document.getElementById("spectrogram"),n=c.getContext("2d"),r=document.createElement("canvas"),_=r.getContext("2d"),r.width=e.width,r.height=e.height,n.fillStyle="#000",n.fillRect(0,0,e.width,e.height);const o=c.captureStream();h.value.srcObject=o,h.value.play().then(()=>{var t,s;return(s=(t=h.value)==null?void 0:t.requestPictureInPicture)==null?void 0:s.call(t)}).catch(t=>console.error(t))});let y;function E(){navigator.mediaDevices.getUserMedia({audio:!0,video:!1}).then(async()=>{const{AudioMotionAnalyzer:o}=await T(async()=>{const{AudioMotionAnalyzer:t}=await import("./audioMotion-analyzer.7XoESQPH.js");return{AudioMotionAnalyzer:t}},[]);y=new o(null,{mode:1,connectSpeakers:!1,volume:0,useCanvas:!1,source:G.meter,onCanvasDraw(t){if(i.value)return;_.drawImage(c,0,0,e.width,e.height);let s=t.getBars();for(let l=0;l<s.length;l++)n.fillStyle=P((s[l].freqLo+s[l].freqHi)/2,s[l].value[0]),e.vertical?n.fillRect(l*(e.width/s.length),0,e.width/s.length,e.speed):n.fillRect(e.width-e.speed,e.height-(l+1)*(e.height/s.length),e.speed,e.height/s.length);e.vertical?n.translate(0,e.speed):n.translate(-e.speed,0),n.drawImage(r,0,0,e.width,e.height),n.setTransform(1,0,0,1,0,0)}}),e.initiated=!0,S.open=!0,y.connectInput(M)}).catch(o=>{console.log("mic denied",o)})}function P(o,t){let s=Math.pow(t+e.offset,e.pow);return`hsl(${H(o)*30}, ${s*100}%, ${s*70}%)`}return(o,t)=>{const s=K,l=J,D=A("drag");return u(),p("div",Q,[a("div",{class:"fullscreen-container text-white w-full min-h-100svh",id:"screen",ref_key:"container",ref:v},[U(a("canvas",{class:"cursor-pointer",id:"spectrogram",ref_key:"canvasElement",ref:C,width:e.width,height:e.height},null,8,W),[[D,V]]),e.initiated?O("",!0):(u(),N(s,{key:0,class:"absolute",onClick:t[0]||(t[0]=d=>E())})),a("div",X,"x"+z(e.speed),1),a("button",{class:"absolute bottom-4 left-4 text-xl select-none cursor-pointer",onMousedown:t[1]||(t[1]=d=>i.value=!i.value)},[i.value?(u(),p("div",Y)):(u(),p("div",Z))],32),a("button",{class:"absolute bottom-4 right-4 text-xl select-none cursor-pointer",onMousedown:t[2]||(t[2]=d=>e.vertical=!e.vertical)},[e.vertical?(u(),p("div",te)):(u(),p("div",ee))],32),a("button",{class:"absolute top-4 right-4 text-xl select-none cursor-pointer",onMousedown:t[3]||(t[3]=d=>g())},se,32)],512),a("div",ae,[a("div",ne,[k(l,{modelValue:e.pow,"onUpdate:modelValue":t[4]||(t[4]=d=>e.pow=d),min:1,max:10,step:1,fixed:0,param:"POW"},null,8,["modelValue"]),k(l,{modelValue:e.offset,"onUpdate:modelValue":t[5]||(t[5]=d=>e.offset=d),min:-.5,max:.5,step:1e-4,param:"OFFSET",fixed:2},null,8,["modelValue"])]),le,a("div",ie,[re,a("video",{class:"max-h-50",ref_key:"video",ref:h},null,512)])])])}}};export{he as default};