import{_ as P,r as g,M as A,c as E,d as N,f as I,g as b,h as r,F,j as T,p as S,m as B,n as j,l as k,q as R,k as D,B as W,ag as q,V as X}from"./framework.BH4RfCYQ.js";import{H as Y,g as $,n as w,ak as G,x as J,z as K}from"./theme.BRAeJ4NP.js";function Q(i,s,a){i/=255,s/=255,a/=255;const o=Math.max(i,s,a),c=Math.min(i,s,a);let n,u,m=(o+c)/2;if(o===c)n=u=0;else{const d=o-c;switch(u=m>.5?d/(2-o-c):d/(o+c),o){case i:n=(s-a)/d+(s<a?6:0);break;case s:n=(a-i)/d+2;break;case a:n=(i-s)/d+4;break}n/=6}return[n,u,m]}function Z(i,s=5){const a=new Map;for(let n=0;n<i.length;n+=4){const u=i[n],m=i[n+1],d=i[n+2],[h,y,p]=Q(u,m,d),C=ee(h);if(C!==-1){const v=C;a.has(v)||a.set(v,{count:0,s:0,l:0});const _=a.get(v);_.count++,_.s+=y,_.l+=p}}const o=Array.from(a.entries()).sort((n,u)=>u[1].count-n[1].count).slice(0,s).map(([n,{count:u,s:m,l:d}])=>({hueIndex:n,s:m/u,l:d/u,percent:u/(i.length/4)*100})),c=o.reduce((n,u)=>n+u.percent,0);return o.map(n=>({...n,percent:n.percent/c*100}))}function ee(i){const s=i*360;for(let a=0;a<12;a++){const o=a*30,c=(o-15+360)%360,n=(o+15)%360;if(c>n){if(s>=c||s<n)return a}else if(s>=c&&s<n)return a}return-1}const te={class:"container mx-auto"},ne={key:0,class:"relative w-90vw h-90vh overflow-hidden"},ae={class:"text-xs font-bold text-white text-shadow p-1"},le={class:"p-4 flex flex-wrap gap-2"},se={class:"m-0"},oe={class:"m-0"},re={class:"m-0"},ie={class:"ml-2"},ue={__name:"PixelSort",setup(i){const s=g(null),a=g("horizontal"),o=g(null),{elementX:c,elementY:n,isOutside:u,elementHeight:m,elementWidth:d}=A(o),h=Y(g(5),1,7),y=g([]),p=g(20);function C(t,e=1){return[...t.slice(e,t.length),...t.slice(0,e)]}const v=E(()=>{if(!$.value||!$.value.chroma)return[1,1,1,1,1,1,1,1,1,1,1,1];const t=$.value.chroma.split("").map(Number);return C(t,-w.indexOf($.value.tonic||"C"))});function _(t,e){const l=w.indexOf(t);if(v.value.map((V,O)=>V?w[O]:null).filter(Boolean),v.value[l])return`${t}${e}`;let f=l,x=l;for(;!v.value[f]&&!v.value[x];){if(f=(f-1+12)%12,x=(x+1)%12,v.value[f])return`${w[f]}${e}`;if(v.value[x])return`${w[x]}${e}`}return`${t}${e}`}function H(t){const e=t.target.files[0];e&&(s.value=URL.createObjectURL(e))}function L(t,e,l,f){return(f==="horizontal"?t.getImageData(0,l*t.canvas.height-p.value/2,t.canvas.width,p.value):t.getImageData(e*t.canvas.width-p.value/2,0,p.value,t.canvas.height)).data}function U(t,e,l){return`hsl(${t*30%360}, ${e*100}%, ${l*100}%)`}function M(t,e){const l=w[t],f=Math.floor(e*3)-1+3+G.offset;return _(l,f)}N([c,n],()=>{if(u.value||!o.value)return;const t=o.value.getContext("2d"),e=L(t,c.value/d.value,n.value/m.value,a.value);y.value=Z(e,h.value)}),N(s,async()=>{if(s.value){const t=new Image;t.src=s.value,await t.decode();const e=o.value;e.getContext("2d").drawImage(t,0,0,e.width,e.height)}});function z(t){const e=y.value.map(l=>M(l.hueIndex,l.l));J(e),setTimeout(()=>{K(e)},200)}return(t,e)=>(I(),b("div",te,[s.value?(I(),b("div",ne,[r("canvas",{class:"w-full h-full max-w-screen max-h-full",ref_key:"canvasElement",ref:o,width:"1200",height:"1200"},null,512),r("div",{class:j(["absolute flex",{"w-full h-5":a.value==="horizontal","h-full w-5 flex-col":a.value==="vertical"}]),onMousedown:z,onTouchstart:z,style:S(a.value==="horizontal"?`top: ${Math.max(0,k(n)-p.value/2)}px`:"left: 0px")},[(I(!0),b(F,null,T(y.value,l=>(I(),b("div",{class:"relative flex items-center justify-center",key:l.hueIndex,style:S({flex:`1 1 ${l.percent}%`,backgroundColor:U(l.hueIndex,l.s,l.l)})},[r("span",ae,B(M(l.hueIndex,l.l)),1)],4))),128))],38)])):R("",!0),r("div",le,[r("div",se,[e[2]||(e[2]=r("label",{class:"cursor-pointer bg-blue-500 hover-bg-blue-600 text-white font-bold py-2 px-4 rounded",for:"fileInput"},"Load Image",-1)),r("input",{class:"hidden",id:"fileInput",type:"file",accept:"image/*",onChange:H},null,32)]),r("div",oe,[e[4]||(e[4]=r("label",{class:"mr-2"},"Scan direction:",-1)),D(r("select",{"onUpdate:modelValue":e[0]||(e[0]=l=>a.value=l)},e[3]||(e[3]=[r("option",{value:"horizontal"},"Horizontal",-1),r("option",{value:"vertical"},"Vertical",-1)]),512),[[W,a.value]])]),r("div",re,[e[5]||(e[5]=r("label",{class:"mr-2"},"Color count:",-1)),D(r("input",{type:"range","onUpdate:modelValue":e[1]||(e[1]=l=>X(h)?h.value=l:null),min:"1",max:"7",step:"1"},null,512),[[q,k(h)]]),r("span",ie,B(k(h)),1)])])]))}},ve=P(ue,[["__scopeId","data-v-315c49bd"]]);export{ve as default};