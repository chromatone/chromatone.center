import{_ as U}from"./chunks/ControlChoose.Dk1n_Vp4.js";import{a$ as _,M as q}from"./chunks/theme.C_pcXyVd.js";import{q as x,v as V,x as h,z as m,E as A,X as p,y as P,J as L,K as E,W as n,D as e,al as S,F as $,A as c,M as C,as as O,a4 as B}from"./chunks/framework.BG7tPuiF.js";const N=f=>(L("data-v-ada6e431"),f=f(),E(),f),F=N(()=>m("div",{class:"toggler"},null,-1)),I=[F],D={__name:"ControlPush",props:{modelValue:{type:Boolean,default:!1},title:{type:String,default:"BTN"}},emits:["update:modelValue"],setup(f,{emit:r}){const a=r;function s(d){a("update:modelValue",d)}return(d,l)=>(V(),h("div",{class:P(["btn",{active:f.modelValue}]),onMousedown:l[6]||(l[6]=p(u=>s(!0),["self"])),onMouseup:l[7]||(l[7]=p(u=>s(!1),["self"])),onTouchstart:l[8]||(l[8]=p(u=>s(!0),["self"])),onTouchend:l[9]||(l[9]=p(u=>s(!0),["self"])),onTouchcancel:l[10]||(l[10]=p(u=>s(!1),["self"]))},[m("div",{class:"mb-5",onMousedown:l[0]||(l[0]=p(u=>s(!0),["self"])),onMouseup:l[1]||(l[1]=p(u=>s(!1),["self"])),onTouchstart:l[2]||(l[2]=p(u=>s(!0),["self"])),onTouchend:l[3]||(l[3]=p(u=>s(!0),["self"])),onTouchcancel:l[4]||(l[4]=p(u=>s(!1),["self"]))},A(f.title),33),m("div",{class:"toggle",onClickCapture:l[5]||(l[5]=p(u=>s(!f.modelValue),["stop"]))},I,32)],34))}},R=x(D,[["__scopeId","data-v-ada6e431"]]),Y={class:"flex flex-wrap gap-4 m-4"},H={class:"row is-group gap-2 select-none"},W={class:"is-group flex flex-wrap p-1"},M={class:"w-8rem border-1 rounded-lg m-1",version:"1.1",baseProfile:"full",viewBox:"0 0 32 10",xmlns:"http://www.w3.org/2000/svg"},z=["x1","x2","y1","title"],Q={class:"row is-group gap-2"},j={class:"flex flex-wrap gap-2"},J={class:"flex flex-wrap gap-2"},K={class:"row is-group gap-2"},X={class:"row is-group gap-2"},Z={__name:"SynthNoise",setup(f){const{options:r,filterOptions:a,pannerOptions:s,crusherOptions:d,active:l,fftData:u,fftFreq:v,types:T,filterTypes:k,filterLFOTypes:b}=_();return(ne,t)=>{const g=R,i=q,w=U;return V(),h("div",Y,[m("div",H,[n(g,{modelValue:e(l),"onUpdate:modelValue":t[0]||(t[0]=o=>S(l)?l.value=o:null),title:"NOISE"},null,8,["modelValue"]),n(i,{modelValue:e(r).volume,"onUpdate:modelValue":t[1]||(t[1]=o=>e(r).volume=o),min:0,max:1,step:.01,param:"DRY"},null,8,["modelValue"]),n(w,{modelValue:e(r).noise.type,"onUpdate:modelValue":t[2]||(t[2]=o=>e(r).noise.type=o),variants:e(T)},null,8,["modelValue","variants"]),m("div",W,[n(i,{modelValue:e(r).envelope.attack,"onUpdate:modelValue":t[3]||(t[3]=o=>e(r).envelope.attack=o),min:.005,max:4,step:.01,param:"ATT"},null,8,["modelValue"]),n(i,{modelValue:e(r).envelope.decay,"onUpdate:modelValue":t[4]||(t[4]=o=>e(r).envelope.decay=o),min:.005,max:6,step:.01,param:"DEC"},null,8,["modelValue"]),n(i,{modelValue:e(r).envelope.sustain,"onUpdate:modelValue":t[5]||(t[5]=o=>e(r).envelope.sustain=o),min:.005,max:1,step:.01,param:"SUS"},null,8,["modelValue"]),n(i,{modelValue:e(r).envelope.release,"onUpdate:modelValue":t[6]||(t[6]=o=>e(r).envelope.release=o),min:.005,max:10,step:.01,param:"REL"},null,8,["modelValue"])]),(V(),h("svg",M,[(V(!0),h($,null,c(e(v),(o,y)=>(V(),h("line",{key:o,"stroke-width":"1",stroke:"gray",x1:y,x2:y,y2:10,y1:10-e(u)[y]*50,title:e(v)[y]},null,8,z))),128))]))]),m("div",Q,[m("div",j,[n(g,{modelValue:e(a).on,"onUpdate:modelValue":t[7]||(t[7]=o=>e(a).on=o),title:"FILTER"},null,8,["modelValue"]),n(i,{modelValue:e(a).volume,"onUpdate:modelValue":t[8]||(t[8]=o=>e(a).volume=o),param:"VOL",min:0,max:1,step:.01,fixed:1},null,8,["modelValue"]),n(i,{modelValue:e(a).baseFrequency,"onUpdate:modelValue":t[9]||(t[9]=o=>e(a).baseFrequency=o),param:"FREQ",min:10,max:999,step:1,fixed:0,unit:"hz"},null,8,["modelValue"]),n(i,{modelValue:e(a).octaves,"onUpdate:modelValue":t[10]||(t[10]=o=>e(a).octaves=o),param:"OCT",min:.1,max:7,step:.1,fixed:1},null,8,["modelValue"]),n(i,{modelValue:e(a).filter.Q,"onUpdate:modelValue":t[11]||(t[11]=o=>e(a).filter.Q=o),param:"Q",min:.1,max:20,step:.1,fixed:1},null,8,["modelValue"]),n(i,{modelValue:e(a).wet,"onUpdate:modelValue":t[12]||(t[12]=o=>e(a).wet=o),param:"WET",min:0,max:1,step:.1,fixed:1,unit:""},null,8,["modelValue"]),n(w,{modelValue:e(a).filter.type,"onUpdate:modelValue":t[13]||(t[13]=o=>e(a).filter.type=o),variants:e(k)},null,8,["modelValue","variants"])]),m("div",J,[n(g,{modelValue:e(a).play,"onUpdate:modelValue":t[14]||(t[14]=o=>e(a).play=o),title:"PLAY"},null,8,["modelValue"]),n(i,{modelValue:e(a).frequency,"onUpdate:modelValue":t[15]||(t[15]=o=>e(a).frequency=o),param:"LFO",min:.01,max:4,step:.01,fixed:2,unit:"hz"},null,8,["modelValue"]),n(i,{modelValue:e(a).depth,"onUpdate:modelValue":t[16]||(t[16]=o=>e(a).depth=o),param:"DPTH",min:0,max:1,step:.1,fixed:1,unit:""},null,8,["modelValue"]),n(w,{modelValue:e(a).type,"onUpdate:modelValue":t[17]||(t[17]=o=>e(a).type=o),variants:e(b)},null,8,["modelValue","variants"])])]),m("div",K,[n(g,{modelValue:e(d).on,"onUpdate:modelValue":t[18]||(t[18]=o=>e(d).on=o),title:"BITCRUSHER"},null,8,["modelValue"]),n(i,{modelValue:e(d).volume,"onUpdate:modelValue":t[19]||(t[19]=o=>e(d).volume=o),param:"VOL",min:.01,max:1,step:.01,fixed:1},null,8,["modelValue"]),n(i,{modelValue:e(d).bits,"onUpdate:modelValue":t[20]||(t[20]=o=>e(d).bits=o),param:"BITS",min:1,max:16,step:.01,fixed:2},null,8,["modelValue"]),n(i,{modelValue:e(d).wet,"onUpdate:modelValue":t[21]||(t[21]=o=>e(d).wet=o),param:"WET",min:0,max:1,step:.1,fixed:1,unit:""},null,8,["modelValue"])]),m("div",X,[n(g,{modelValue:e(s).on,"onUpdate:modelValue":t[22]||(t[22]=o=>e(s).on=o),title:"PAN"},null,8,["modelValue"]),n(g,{modelValue:e(s).play,"onUpdate:modelValue":t[23]||(t[23]=o=>e(s).play=o),title:"PLAY"},null,8,["modelValue"]),n(i,{modelValue:e(s).volume,"onUpdate:modelValue":t[24]||(t[24]=o=>e(s).volume=o),param:"VOL",min:.01,max:1,step:.01,fixed:1},null,8,["modelValue"]),n(i,{modelValue:e(s).frequency,"onUpdate:modelValue":t[25]||(t[25]=o=>e(s).frequency=o),param:"LFO",min:.01,max:4,step:.01,fixed:2,unit:"hz"},null,8,["modelValue"]),n(i,{modelValue:e(s).depth,"onUpdate:modelValue":t[26]||(t[26]=o=>e(s).depth=o),param:"DPTH",min:0,max:1,step:.1,fixed:1,unit:""},null,8,["modelValue"]),n(i,{modelValue:e(s).wet,"onUpdate:modelValue":t[27]||(t[27]=o=>e(s).wet=o),param:"WET",min:0,max:1,step:.1,fixed:1,unit:""},null,8,["modelValue"])])])}}},G=x(Z,[["__scopeId","data-v-ecd15833"]]),ie=JSON.parse('{"title":"Noise lab","description":"As white light is the combination of all colors, the white noise is the combination of all possible notes","frontmatter":{"title":"Noise lab","description":"As white light is the combination of all colors, the white noise is the combination of all possible notes","layout":"app","date":"2021-06-22T00:00:00.000Z","cover":"noise.jpg"},"headers":[],"relativePath":"practice/synth/noise/index.md","filePath":"practice/synth/noise/index.md","lastUpdated":1719395822000}'),ee={name:"practice/synth/noise/index.md"},oe=O("",3);function te(f,r,a,s,d,l){const u=G,v=B("client-only");return V(),h("div",null,[n(v,null,{default:C(()=>[n(u)]),_:1}),oe])}const re=x(ee,[["render",te]]);export{ie as __pageData,re as default};