import{c as f,i as x,n as _,g as b,e as k}from"./theme.4FwZXZE5.js";import{c as a,P as C,k as N,f as c,g as i,au as A,m as B,p as S,F as v,j as h,z as q}from"./framework.D4K5LW16.js";const w={__name:"ChromaCodeCell",props:{index:{type:Number,required:!0},tonic:{type:Number,required:!0},isActive:{type:Boolean,required:!0}},emits:["toggle"],setup(s,{emit:d}){const e=s,n=a(()=>e.isActive?f((e.tonic+e.index)%12):"101101011010"[e.index]==="1"?"hsla(0,0%,100%,0.5)":"hsla(0,0%,10%,0.5)"),l=a(()=>e.isActive?1:.4),u=a(()=>x[e.index%12]),m=a(()=>_[(e.tonic+e.index)%12]);return(t,o)=>{const r=C("tooltip");return N((c(),i("div",{class:"flex flex-col items-center justify-center rounded text-md p-1 select-none cursor-pointer",onPointerdown:o[0]||(o[0]=p=>t.$emit("toggle",s.index)),style:S({flex:"1 1 50px",backgroundColor:n.value,opacity:l.value})},[A(B(u.value),1)],36)),[[r,m.value]])}}},D={class:"flex flex-col gap-1 bg-dark-200 bg-opacity-30 dark-bg-light-900 dark-bg-opacity-40 p-2 rounded-lg"},z={__name:"ChromaCode",props:{chroma:{type:String,default:"101101011010"},pitch:{type:Number,default:null},cols:{type:Number,default:4}},emits:["update:chroma"],setup(s,{emit:d}){const e=s,n=d,l=a(()=>e.pitch??b.tonic),u=a(()=>{const t=e.chroma.split("").map(Number);return Array.from({length:Math.ceil(12/e.cols)},(o,r)=>t.slice(r*e.cols,(r+1)*e.cols))}),m=t=>{k(t+l.value+57);const o=e.chroma.slice(0,t)+(e.chroma[t]==="1"?"0":"1")+e.chroma.slice(t+1);n("update:chroma",o)};return(t,o)=>(c(),i("div",D,[(c(!0),i(v,null,h(u.value,(r,p)=>(c(),i("div",{class:"flex gap-1",key:p},[(c(!0),i(v,null,h(r,(y,g)=>(c(),q(w,{key:g,index:p*s.cols+g,tonic:l.value,isActive:y===1,onToggle:m},null,8,["index","tonic","isActive"]))),128))]))),128))]))}};export{z as _};