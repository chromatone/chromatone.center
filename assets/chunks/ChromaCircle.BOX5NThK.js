import{_ as z,r as B,c as m,f as r,g as i,h as u,l as e,F as w,j as k,q as b,m as d,n as D,U as S}from"./framework.BX1Y-ISu.js";import{g as C,r as q,a as T,b as F,d as H,q as v,w as h,c as f,n as y,p as $,s as g,e as P}from"./theme.DvVY4vau.js";const V={class:"select-none",version:"1.1",baseProfile:"full",viewBox:"-10 -10 20 20",xmlns:"http://www.w3.org/2000/svg",style:{"touch-action":"none"},"font-family":"Commissioner, sans-serif","text-anchor":"middle","dominant-baseline":"middle"},j=["fill"],A=["x1","y1","stroke"],E=["transform","onMousedown"],I=["r","fill"],L=["fill"],O=["fill"],U=["fill"],G=["fill"],J={__name:"ChromaCircle",props:{pitch:{type:Number,default:null},chroma:{type:String,default:"1001000100101"},type:{type:String,default:""},tonic:{type:Number,default:0}},setup(t){const n=B(!1),c=t,o=m(()=>c.pitch===0||c.pitch?c.pitch:C.tonic),x=m(()=>q(c.chroma.split(""),-o.value)),M=m(()=>T(c.chroma));m(()=>F(c.chroma).name);function N(p){P(y[p]+3,.5,200),C.tonic=p}return(p,a)=>(r(),i("svg",V,[u("circle",{cx:"0",cy:"0",r:"8",opacity:"0.5",fill:e(H)(t.chroma,o.value).hsl},null,8,j),(r(!0),i(w,null,k(x.value,(s,l)=>(r(),i("g",{key:l},[s=="1"?(r(),i("line",{key:0,x1:e(v)(l,12,6.5,0).x,y1:e(v)(l,12,6.5,0).y,x2:"0",y2:"0","stroke-linecap":"square","stroke-width":"3.92",stroke:s=="1"?e(h)(e(f)(l,3)).toHex():"none"},null,8,A)):b("",!0)]))),128)),(r(!0),i(w,null,k(x.value,(s,l)=>(r(),i("g",{class:"cursor-pointer",key:l,transform:`translate(${e(v)(l,12,8,0).x}, ${e(v)(l,12,8,0).y})`,onMousedown:K=>N(l)},[u("circle",{x:"0",y:"0",r:s=="1"?2:1,fill:e(h)(s=="1"?e(f)(l):e(y)[l].length!=2?"hsl(0,0%,85%)":"hsl(0,0%,60%)").toHex()},null,8,I),s=="1"?(r(),i("text",{key:0,y:"0.3","font-size":"2px","font-weight":"bold",fill:e(h)(e(f)(l)).isDark()?"white":"black"},d(e(y)[l]),9,L)):b("",!0)],40,E))),128)),u("g",{class:D(["center cursor-pointer",{pressed:n.value}]),onMousedown:a[0]||(a[0]=s=>{e($)(t.chroma,o.value),n.value=!0}),onTouchstart:a[1]||(a[1]=S(s=>{e($)(t.chroma,o.value),n.value=!0},["prevent","stop"])),onTouchend:a[2]||(a[2]=s=>{e(g)(t.chroma,o.value),n.value=!1}),onTouchcancel:a[3]||(a[3]=s=>{e(g)(t.chroma,o.value),n.value=!1}),onMouseup:a[4]||(a[4]=s=>{e(g)(t.chroma,o.value),n.value=!1}),onMouseleave:a[5]||(a[5]=s=>{e(g)(t.chroma,o.value),n.value=!1})},[u("circle",{cx:"0",cy:"0",r:"5",fill:t.pitch===!1?"none":e(f)(o.value,3)},null,8,O),u("text",{y:"0.3","font-size":"2px","font-weight":"bold",fill:e(h)(e(f)(o.value)).isDark()?"white":"black"},d(t.pitch===!1?"":typeof t.pitch=="string"?t.pitch:e(y)[o.value])+d(M.value.aliases[0]),9,U),u("text",{y:"3","font-size":"1.8px","font-weight":"normal",fill:e(h)(e(f)(o.value)).isDark()?"white":"black"},d(t.type),9,G)],34)]))}},W=z(J,[["__scopeId","data-v-7bc2d82d"]]);export{W as _};