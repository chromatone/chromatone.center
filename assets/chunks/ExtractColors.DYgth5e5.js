import{aq as ht}from"./theme.4FwZXZE5.js";import{ae as dt,f as p,g as f,h as l,R as _t,l as _,V as gt,q as R,F as P,j as T,p as N,m as G,r as k,u as q,aT as mt,c as pt,d as ft,ad as bt,aU as vt}from"./framework.D4K5LW16.js";class A{constructor(t,e,n,a=t<<16|e<<8|n){this._count=1,this.__saturation=-1,this.__hue=-1,this.__lightness=-1,this.__intensity=-1,this._red=t,this._green=e,this._blue=n,this._hex=a}static distance(t,e){return(Math.abs(e._red-t._red)+Math.abs(e._green-t._green)+Math.abs(e._blue-t._blue))/(3*255)}clone(){const t=new A(this._red,this._green,this._blue,this._hex);return t._count=this._count,t}updateHSL(){const t=this._red/255,e=this._green/255,n=this._blue/255,a=Math.max(t,e,n),o=Math.min(t,e,n);if(this.__lightness=(a+o)/2,a===o)this.__hue=0,this.__saturation=0,this.__intensity=0;else{const r=a-o;switch(this.__saturation=this.__lightness>.5?r/(2-a-o):r/(a+o),this.__intensity=this.__saturation*((.5-Math.abs(.5-this.__lightness))*2),a){case t:this.__hue=((e-n)/r+(e<n?6:0))/6;break;case e:this.__hue=((n-t)/r+2)/6;break;case n:this.__hue=((t-e)/r+4)/6;break}}}get _hue(){return this.__hue===-1&&this.updateHSL(),this.__hue}get _saturation(){return this.__saturation===-1&&this.updateHSL(),this.__saturation}get _lightness(){return this.__lightness===-1&&this.updateHSL(),this.__lightness}get _intensity(){return this.__intensity===-1&&this.updateHSL(),this.__intensity}}const I=(s,t)=>Math.abs(s-t),xt=(s,t)=>Math.min(I(s,t),I((s+.5)%1,(t+.5)%1));class wt{constructor(){this.colors=[],this._average=null}addColor(t){this.colors.push(t),this._average=null}isSamePalette(t,e,n,a){for(const o of this.colors)if(!(xt(o._hue,t._hue)<e&&I(o._saturation,t._saturation)<n&&I(o._lightness,t._lightness)<a))return!1;return!0}get average(){if(!this._average){const{r:t,g:e,b:n}=this.colors.reduce((o,r)=>(o.r+=r._red,o.g+=r._green,o.b+=r._blue,o),{r:0,g:0,b:0}),a=this.colors.reduce((o,r)=>o+r._count,0);this._average=new A(Math.round(t/this.colors.length),Math.round(e/this.colors.length),Math.round(n/this.colors.length)),this._average._count=a}return this._average}}class yt{constructor(t,e,n){this._groups=[],this._hue=t,this._saturation=e,this._lightness=n}addColor(t){const e=this._groups.find(n=>n.isSamePalette(t,this._hue,this._saturation,this._lightness));if(e)e.addColor(t);else{const n=new wt;n.addColor(t),this._groups.push(n)}}getGroups(){return this._groups.map(t=>t.average)}}const Ct=(s,t,e,n,a)=>{const o=new yt(e,n,a);s.forEach(c=>o.addColor(c));const r=o.getGroups();return r.sort((c,g)=>{const u=(g._intensity+.1)*(.9-g._count/t),m=(c._intensity+.1)*(.9-c._count/t);return u-m}),r},Mt=(s,t)=>({hex:`#${"0".repeat(6-s._hex.toString(16).length)}${s._hex.toString(16)}`,red:s._red,green:s._green,blue:s._blue,area:s._count/t,hue:s._hue,saturation:s._saturation,lightness:s._lightness,intensity:s._intensity}),Dt=64e3,Et=.22,Lt=1/12,Ut=1/5,St=1/5,$=({pixels:s=Dt,distance:t=Et,colorValidator:e=(c,g,u,m)=>(m??255)>250,hueDistance:n=Lt,saturationDistance:a=St,lightnessDistance:o=Ut,crossOrigin:r=null}={})=>[Math.max(s,1),Math.min(Math.max(t,0),1),e,Math.min(Math.max(n,0),1),Math.min(Math.max(a,0),1),Math.min(Math.max(o,0),1),r];class At{constructor(){this._count=0,this._children={}}addColor(t,e,n,a){return this._count++,this._children[t]?this._children[t]._count++:this._children[t]=new A(e,n,a,t),this._children[t]}getList(){return Object.keys(this._children).map(t=>this._children[t])}createMainColor(){const n=this.getList().reduce((a,o)=>a._count>=o._count?a:o).clone();return n._count=this._count,n}}class Rt{constructor(){this._count=0,this._children={}}getList(){return Object.keys(this._children).map(t=>this._children[t])}addColor(t,e,n){const a=t<<16|e<<8|n,o=(t>>4&15)<<8|(e>>4&15)<<4|n>>4&15;return this._count++,this.getLeafGroup(o).addColor(a,t,e,n)}getLeafGroup(t){return this._children[t]||(this._children[t]=new At),this._children[t]}getColors(t){const e=this.getList().map(a=>a.createMainColor());e.sort((a,o)=>o._count-a._count);const n=[];for(;e.length;){const a=e.shift();e.filter(o=>A.distance(a,o)<t).forEach(o=>{a._count+=o._count;const r=e.findIndex(c=>c===o);e.splice(r,1)}),n.push(a)}return n}}const B=({data:s,width:t,height:e},n,a,o)=>{const r=new Rt,c=t&&e&&Math.floor(t*e/n)||1;let g=0;for(let u=0;u<s.length;u+=4*c){const m=s[u],b=s[u+1],L=s[u+2],v=s[u+3];o(m,b,L,v)?r.addColor(m,b,L):g++}return{colors:r.getColors(a),count:r._count+g}},V=()=>typeof window<"u",z=(s,t,e,n,a)=>Ct(s,t,e,n,a).map(r=>Mt(r,t)),kt=(s,t)=>{const e=s.width*s.height,n=e<t?s.width:Math.round(s.width*Math.sqrt(t/e)),a=e<t?s.height:Math.round(s.height*Math.sqrt(t/e)),o=document.createElement("canvas");o.width=n,o.height=a;const r=o.getContext("2d");return r.drawImage(s,0,0,s.width,s.height,0,0,n,a),r.getImageData(0,0,n,a)},X=(s,t={})=>{const[e,n,a,o,r,c]=$(t),{colors:g,count:u}=B(s,e,n,a);return z(g,u,o,r,c)},J=async(s,t={})=>{if(!V())return[];const[e,n,a,o,r,c,g]=$(t);return s.crossOrigin=g,new Promise(u=>{const m=b=>{const L=kt(b,e),{colors:v,count:F}=B(L,e,n,a);u(z(v,F,o,r,c))};if(s.complete)m(s);else{const b=()=>{s.removeEventListener("load",b),m(s)};s.addEventListener("load",b)}})},It=async(s,t={})=>{if(!V())return[];const e=new Image;return e.src=s,J(e,t)},Ft=(s,t)=>{if(V()){if(s instanceof Image)return J(s,t);if(s instanceof ImageData||s instanceof Object&&s.data)return new Promise(e=>{e(X(s,t))});if(typeof s=="string")return It(s,t)}else return new Promise(e=>{e(X(s,t))});throw new Error("Can not analyse picture")},Pt={class:"container mx-auto p-4"},Tt={class:"mb-4 flex items-center flex-wrap gap-4"},Gt={key:0,class:"mt-4"},Vt=["src"],Ot={key:1,class:"mt-4"},Ht={key:2,class:"mt-4"},jt={class:"flex flex-wrap gap-4"},Nt={class:"absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 group-hover-opacity-100 transition-opacity"},qt=["onClick"],Xt={class:"bg-white bg-opacity-75 p-1 text-xs"},$t={class:"mt-8"},Bt={class:"flex gap-2 mb-4"},zt=["disabled"],Jt=["disabled"],Kt={class:"flex flex-wrap"},Qt={class:"flex items-center gap-4 h-32"},Wt=["src"],Yt={class:"flex flex-wrap gap-1 z-10"},Zt={class:"text-sm text-gray-500"},ne={__name:"ExtractColors",setup(s){const t=(d=7)=>{const i=k(null),M=k([]),h=k([]),x=k(!1),y=q("color-extracts",d),D=q("color-palettes",[]),{history:tt,undo:et,redo:st,canUndo:nt,canRedo:ot}=mt(D,{deep:!0,debounce:1e3}),at=async(w,C=32)=>new Promise(S=>{const H=new FileReader;H.onload=ct=>{const E=new Image;E.onload=()=>{const U=document.createElement("canvas"),ut=U.getContext("2d"),j=C/Math.max(E.width,E.height);U.width=Math.min(C,E.width*j),U.height=Math.min(C,E.height*j),ut.drawImage(E,0,0,U.width,U.height),S(U.toDataURL("image/jpeg",.7))},E.src=ct.target.result},H.readAsDataURL(w)}),rt=async w=>{if(!w)return;x.value=!0,i.value=URL.createObjectURL(w);const C=await at(w);try{h.value=await Ft(i.value,{pixels:64e3,distance:.12,saturationDistance:.2,lightnessDistance:.2,hueDistance:.1}),O();const S={colors:M.value,timestamp:Date.now(),amount:y.value,thumbnail:C};D.value.unshift(S)}catch(S){console.error("Error extracting colors:",S)}finally{x.value=!1}},O=()=>{M.value=h.value.slice(0,y.value)},it=vt(()=>{var C;O();const w={colors:M.value,timestamp:Date.now(),amount:y.value,thumbnail:(C=D.value[0])==null?void 0:C.thumbnail};D.value.unshift(w)},300),lt=pt(()=>M.value.map(w=>({backgroundColor:w.hex})));return ft(y,()=>{h.value.length>0&&it()}),{imageUrl:i,colors:M,isLoading:x,extractColorsFromImage:rt,colorStyles:lt,storedPalettes:D,history:tt,undo:et,redo:st,canUndo:nt,canRedo:ot,amount:y}},{imageUrl:e,colors:n,isLoading:a,extractColorsFromImage:o,colorStyles:r,storedPalettes:c,history:g,undo:u,redo:m,canUndo:b,canRedo:L,amount:v}=t(),F=d=>{const i=d.target.files[0];i&&o(i)};function K(){c.value=[]}const{copy:Q,copied:te}=dt(),W=d=>bt(d).value,Y=()=>{if(u(),c.value.length>0){const d=c.value[0];n.value=d.colors,v.value=d.amount}},Z=()=>{if(m(),c.value.length>0){const d=c.value[0];n.value=d.colors,v.value=d.amount}};return(d,i)=>{const M=ht;return p(),f("div",Pt,[l("div",Tt,[i[1]||(i[1]=l("label",{class:"block mb-2",for:"imageUpload"},"Upload an image",-1)),l("input",{class:"hidden",id:"imageUpload",type:"file",accept:"image/*",onChange:F},null,32),i[2]||(i[2]=l("label",{class:"bg-blue-500 hover-bg-blue-600 text-white font-bold py-2 px-4 rounded cursor-pointer",for:"imageUpload"},"Select Image",-1)),i[3]||(i[3]=l("div",{class:"mt-4 space-y-4"},null,-1)),_t(M,{modelValue:_(v),"onUpdate:modelValue":i[0]||(i[0]=h=>gt(v)?v.value=h:null),min:2,max:12,step:1,param:"COLORS",fixed:0},null,8,["modelValue"])]),_(e)?(p(),f("div",Gt,[l("img",{class:"max-w-100 h-auto rounded shadow-lg",src:_(e),alt:"Uploaded image"},null,8,Vt)])):R("",!0),_(a)?(p(),f("div",Ot,i[4]||(i[4]=[l("p",{class:"text-gray-600"},"Extracting colors...",-1)]))):R("",!0),_(n).length?(p(),f("div",Ht,[i[5]||(i[5]=l("h2",{class:"text-xl font-bold mb-2"},"Extracted Colors",-1)),l("div",jt,[(p(!0),f(P,null,T(_(r),(h,x)=>(p(),f("div",{class:"w-24 h-24 rounded shadow-md relative group",key:x,style:N(h)},[l("div",Nt,[l("button",{class:"text-white bg-gray-800 px-2 py-1 rounded",onClick:y=>_(Q)(_(n)[x].hex)},"Copy HEX",8,qt)]),l("div",Xt,G(_(n)[x].hex),1)],4))),128))])])):R("",!0),l("div",$t,[i[6]||(i[6]=l("h2",{class:"text-xl font-bold mb-2"},"Color Palette History",-1)),l("div",Bt,[l("button",{class:"bg-blue-500 hover-bg-blue-600 text-white font-bold py-1 px-3 rounded",disabled:!_(b),onClick:Y},"Undo",8,zt),l("button",{class:"bg-blue-500 hover-bg-blue-600 text-white font-bold py-1 px-3 rounded",disabled:!_(L),onClick:Z},"Redo",8,Jt),l("button",{class:"bg-red-500 hover-bg-blue-600 text-white font-bold py-1 px-3 rounded",onClick:K},"Clear")]),l("div",Kt,[(p(!0),f(P,null,T(_(c),(h,x)=>(p(),f("div",{class:"flex flex-col gap-2",key:x},[l("div",Qt,[h.thumbnail?(p(),f("img",{key:0,class:"max-w-16 max-h-16 blur-2px object-cover rounded",src:h.thumbnail,alt:"Palette thumbnail"},null,8,Wt)):R("",!0),l("div",Yt,[(p(!0),f(P,null,T(h.colors,(y,D)=>(p(),f("div",{class:"p-4 rounded shadow-sm",key:D,style:N({backgroundColor:y.hex})},null,4))),128))])]),l("div",Zt,G(W(h.timestamp))+" - Amount: "+G(h.amount),1)]))),128))])])])}}};export{ne as default};