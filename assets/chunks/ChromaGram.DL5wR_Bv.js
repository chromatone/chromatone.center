import{ax as I,r as B,H as T,aq as D}from"./theme.4FwZXZE5.js";import{_ as M}from"./ControlStart.DT6nH-0j.js";import{an as N,b as z,c as _,u,o as F,d as q,P as A,f,g as p,h as s,z as G,A as H,au as O,q as g,m as P,k as U,l as v,R as y,G as W}from"./framework.D4K5LW16.js";const j={class:"flex flex-col items-center w-full relative"},J={class:"flex flex-col justify-center items-center relative bg-light-600 dark-bg-dark-700",id:"screen"},K={key:0,class:"i-la-arrow-up"},L={key:1,class:"i-la-arrow-left"},Q={class:"absolute top-4 left-4 text-xl text-white"},X=["width","height"],Y={class:"flex items-center gap-2 p-2 flex-wrap absolute bottom-4 right-4"},Z={class:"is-group flex flex-wrap gap-2"},at={__name:"ChromaGram",setup(tt){const{width:d,height:c}=N(),{init:C,tuner:b}=I();let h,o,i,m;const t=z({initiated:!1,width:d,height:c,speed:_(()=>Math.floor(t.speedCount/100)),direction:u("chromagram-direction",0),notes:_(()=>B(b.chroma,-3)),speedCount:T(u("chromagram-speed",100),100,1200),pow:u("chromagram-pow",3),offset:u("chromagram-offset",0)});F(()=>{h=document.getElementById("spectrogram"),o=h.getContext("2d"),i=document.createElement("canvas"),m=i.getContext("2d"),i.width=t.width,i.height=t.height,o.fillStyle="#333",o.fillRect(0,0,t.width,t.height)}),q([d,c],()=>{i&&(i.width=d.value,i.height=c.value)});function S(a){t.speedCount+=a.delta[0]-a.delta[1]}function k(){t.initiated||(t.initiated=!0,C(),W(V))}function V(){t.direction==1?R():$()}function R(){m.drawImage(h,0,0,t.width,t.height),o.fillStyle="#33333399",o.fillRect(0,0,t.width,t.speed),o.translate(0,-t.speed),o.drawImage(i,0,0,t.width,t.height),t.notes.forEach((a,e)=>{let l=e*t.width/12;o.fillStyle=w(e,a,.5),o.fillRect(l,t.height-t.speed,t.width/12,t.speed)}),o.setTransform(1,0,0,1,0,0)}function $(){m.drawImage(h,0,0,t.width,t.height),o.fillStyle="#33333399",o.fillRect(t.width-t.speed,0,t.speed,t.height),t.notes.forEach((a,e)=>{let l=(e+1)*t.height/12;o.fillStyle=w(e,a,.5),o.fillRect(t.width-t.speed,t.height-l,t.width,t.height/12)}),o.translate(-t.speed,0),o.drawImage(i,0,0,t.width,t.height),o.setTransform(1,0,0,1,0,0)}function w(a=0,e=1,l=1){let r=Math.pow(e+t.offset,t.pow);return`hsla(${a*30}, ${r*100}%, ${r*60}%, ${l})`}function x(){o.fillStyle="#333",o.fillRect(0,0,t.width,t.height)}return(a,e)=>{const l=M,r=D,E=A("drag");return f(),p("div",j,[s("div",J,[t.initiated?g("",!0):(f(),G(l,{key:0,class:"absolute",onClick:e[0]||(e[0]=n=>k())},{default:H(()=>e[5]||(e[5]=[O("Start")])),_:1})),s("button",{class:"absolute bottom-4 left-4 text-xl text-white",onClick:e[1]||(e[1]=n=>{t.direction?t.direction=0:t.direction=1,x()})},[t.direction==1?(f(),p("div",K)):g("",!0),t.direction==0?(f(),p("div",L)):g("",!0)]),s("button",{class:"absolute top-4 right-4 text-xl select-none cursor-pointer",onMousedown:e[2]||(e[2]=n=>x())},e[6]||(e[6]=[s("div",{class:"i-la-trash-alt"},null,-1)]),32),s("div",Q,"x"+P(t.speed),1),U(s("canvas",{class:"w-full cursor-pointer",id:"spectrogram",width:v(d),height:v(c)},null,8,X),[[E,S]])]),s("div",Y,[s("div",Z,[y(r,{modelValue:t.pow,"onUpdate:modelValue":e[3]||(e[3]=n=>t.pow=n),min:1,max:10,step:1,fixed:0,param:"POW"},null,8,["modelValue"]),y(r,{modelValue:t.offset,"onUpdate:modelValue":e[4]||(e[4]=n=>t.offset=n),min:-.25,max:.25,step:1e-4,param:"OFFSET",fixed:2},null,8,["modelValue"])])])])}}};export{at as default};