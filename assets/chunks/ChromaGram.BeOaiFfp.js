import{ax as E,r as I,H as M,aq as T}from"./theme.B-lyZe0u.js";import{_ as D}from"./ControlStart.pSxYfY8v.js";import{ao as N,b as F,c as x,u,o as U,d as q,U as z,f,g as p,h as s,B as H,C as O,ae as W,q as g,m as j,k as A,l as v,V as C,M as G}from"./framework.B7TlvOs3.js";const P={class:"flex flex-col items-center w-full relative"},J={class:"flex flex-col justify-center items-center relative bg-light-600 dark-bg-dark-700",id:"screen"},K={key:0,class:"i-la-arrow-up"},L={key:1,class:"i-la-arrow-left"},Q=s("div",{class:"i-la-trash-alt"},null,-1),X=[Q],Y={class:"absolute top-4 left-4 text-xl text-white"},Z=["width","height"],ee={class:"flex items-center gap-2 p-2 flex-wrap absolute bottom-4 right-4"},te={class:"is-group flex flex-wrap gap-2"},le={__name:"ChromaGram",setup(oe){const{width:d,height:c}=N(),{init:y,tuner:b}=E();let h,t,i,m;const e=F({initiated:!1,width:d,height:c,speed:x(()=>Math.floor(e.speedCount/100)),direction:u("chromagram-direction",0),notes:x(()=>I(b.chroma,-3)),speedCount:M(u("chromagram-speed",100),100,1200),pow:u("chromagram-pow",3),offset:u("chromagram-offset",0)});U(()=>{h=document.getElementById("spectrogram"),t=h.getContext("2d"),i=document.createElement("canvas"),m=i.getContext("2d"),i.width=e.width,i.height=e.height,t.fillStyle="#333",t.fillRect(0,0,e.width,e.height)}),q([d,c],()=>{i&&(i.width=d.value,i.height=c.value)});function S(a){e.speedCount+=a.delta[0]-a.delta[1]}function V(){e.initiated||(e.initiated=!0,y(),G(k))}function k(){e.direction==1?R():$()}function R(){m.drawImage(h,0,0,e.width,e.height),t.fillStyle="#33333399",t.fillRect(0,0,e.width,e.speed),t.translate(0,-e.speed),t.drawImage(i,0,0,e.width,e.height),e.notes.forEach((a,o)=>{let l=o*e.width/12;t.fillStyle=w(o,a,.5),t.fillRect(l,e.height-e.speed,e.width/12,e.speed)}),t.setTransform(1,0,0,1,0,0)}function $(){m.drawImage(h,0,0,e.width,e.height),t.fillStyle="#33333399",t.fillRect(e.width-e.speed,0,e.speed,e.height),e.notes.forEach((a,o)=>{let l=(o+1)*e.height/12;t.fillStyle=w(o,a,.5),t.fillRect(e.width-e.speed,e.height-l,e.width,e.height/12)}),t.translate(-e.speed,0),t.drawImage(i,0,0,e.width,e.height),t.setTransform(1,0,0,1,0,0)}function w(a=0,o=1,l=1){let r=Math.pow(o+e.offset,e.pow);return`hsla(${a*30}, ${r*100}%, ${r*60}%, ${l})`}function _(){t.fillStyle="#333",t.fillRect(0,0,e.width,e.height)}return(a,o)=>{const l=D,r=T,B=z("drag");return f(),p("div",P,[s("div",J,[e.initiated?g("",!0):(f(),H(l,{key:0,class:"absolute",onClick:o[0]||(o[0]=n=>V())},{default:O(()=>[W("Start")]),_:1})),s("button",{class:"absolute bottom-4 left-4 text-xl text-white",onClick:o[1]||(o[1]=n=>{e.direction?e.direction=0:e.direction=1,_()})},[e.direction==1?(f(),p("div",K)):g("",!0),e.direction==0?(f(),p("div",L)):g("",!0)]),s("button",{class:"absolute top-4 right-4 text-xl select-none cursor-pointer",onMousedown:o[2]||(o[2]=n=>_())},X,32),s("div",Y,"x"+j(e.speed),1),A(s("canvas",{class:"w-full cursor-pointer",id:"spectrogram",width:v(d),height:v(c)},null,8,Z),[[B,S]])]),s("div",ee,[s("div",te,[C(r,{modelValue:e.pow,"onUpdate:modelValue":o[3]||(o[3]=n=>e.pow=n),min:1,max:10,step:1,fixed:0,param:"POW"},null,8,["modelValue"]),C(r,{modelValue:e.offset,"onUpdate:modelValue":o[4]||(o[4]=n=>e.offset=n),min:-.25,max:.25,step:1e-4,param:"OFFSET",fixed:2},null,8,["modelValue"])])])])}}};export{le as default};