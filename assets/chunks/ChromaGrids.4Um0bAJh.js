import{z as U,r as I,e as D,m as O,O as E,H as F,B as c,C as g,E as e,K as V,M as j,J as C,w as A,F as b,G as $,u as t,I as H,R as y,W as M,V as L,A as P,D as B,a9 as T}from"./framework.B_b_ZswS.js";import{F as W,g as N,c as S,M as q,ah as J,bu as R,n as Y,u as z,aK as G,bv as Q}from"./theme.oPgoCdSG.js";const X={class:"knob","drag-options":{preventWindowScrollY:!0}},Z={class:"flex items-center"},_={class:"text-lg font-bold"},tt={__name:"ControlChange",props:{max:{type:Number,default:100},min:{type:Number,default:0},modelValue:{type:Number,default:50},step:{type:Number,default:1},param:{type:String,default:"param"},unit:{type:String,default:""},fixed:{type:Number,default:0},ratio:{type:Number,default:1}},emits:["update:modelValue"],setup(l,{emit:w}){const n=l,s=w,a=I({active:!1,internal:0,initial:0,external:D(()=>h(a.internal))});function o(d){const{delta:[r,f],dragging:v,shiftKey:p}=d;a.active=v;let k=n.ratio;a.internal-=f/k,a.internal+=r/k,a.internal>100&&(a.internal=100),a.internal<0&&(a.internal=0),s("update:modelValue",a.external)}function u(d=1){let r=n.step/(n.max-n.min);a.internal+=100*r*d,a.internal>100&&(a.internal=100),a.internal<0&&(a.internal=0),s("update:modelValue",a.external)}O(()=>{a.internal=m(n.modelValue)});function i(){a.internal=a.initial,s("update:modelValue",a.external)}function m(d){return x(d,n.min,n.max,0,100,n.step)}function h(d){return x(d,0,100,n.min,n.max,n.step)}function x(d,r=0,f=100,v=0,p=100,k=1){p=parseFloat(p),v=parseFloat(v),f=parseFloat(f),r=parseFloat(r);let K=(d-r)*(p-v)/(f-r)+v;return Math.round(K/k)*k}return(d,r)=>{const f=E("drag");return F((c(),g("div",X,[e("div",{class:"level",style:V({width:a.internal+"%"})},null,4),e("div",Z,[e("div",{class:"pl-1 absolute",onMousedown:r[0]||(r[0]=v=>u(-1))},r[3]||(r[3]=[e("div",{class:"i-la-minus"},null,-1)]),32),e("div",{class:"px-1 flex-1 text-center",onDblclick:r[1]||(r[1]=v=>i())},[j(d.$slots,"default",{},()=>[e("div",_,C(l.modelValue.toFixed(l.fixed))+C(l.unit),1)],!0)],32),e("div",{class:"pr-1 absolute right-0",onMousedown:r[2]||(r[2]=v=>u(1))},r[4]||(r[4]=[e("div",{class:"i-la-plus"},null,-1)]),32)])])),[[f,o]])}}},et=U(tt,[["__scopeId","data-v-81a66231"]]),lt=["transform"],ot=["transform"],st=["x","width","height","fill","onMousedown"],nt=["x1","x2","stroke-width","stroke"],it=["transform"],at=["width","height"],rt=["transform"],dt=["data-pos","height","width"],ut=["x","font-size"],mt={__name:"ChromaGridsColumn",props:{step:{type:Array,default:()=>{}},pos:{type:Number,default:0},width:{type:Number,default:100},height:{type:Number,default:500},footer:{type:Number,default:60},color:{type:String,default:"gray"},active:{type:Boolean,default:!1}},emits:["subdivide"],setup(l,{emit:w}){const n=l,s=w,a=W(0,20,160),o=D(()=>Math.floor(a.value/20));A(o,(h,x)=>{if(h==x)return;let d=[...n.step];if(h<d.length)d.length=h;else for(let r=d.length;r<h;r++)d.push({});s("subdivide",d.map(r=>({...r,sub:h})))});function u(h){a.value+=h.delta[0]-h.delta[1]}const i=D(()=>(N.set.chroma+N.set.chroma+1).split(""));function m(h){let x=Object.entries(h).map(d=>{if(d[0]!="sub"&&d[1])return q(Number(d[0])+N.tonic+69,"midi").toNote()}).filter(d=>d!=null);return J(x)[0]||x[0]}return(h,x)=>{const d=E("drag");return c(),g("g",{class:"col",transform:`translate(${l.pos*l.width} 0)`},[(c(),g(b,null,$(25,(r,f)=>e("g",{class:"cell",key:f,transform:`translate(0 ${l.height-r*l.height/25})`},[(c(!0),g(b,null,$(l.step,(v,p)=>(c(),g("g",{class:"sub",key:v},[e("rect",{class:"transition-all duration-200 ease-out","stroke-width":"0",x:p*l.width/l.step.length+1,width:l.width/l.step.length-2,height:l.height/25-2,rx:"4",fill:t(S)(r+t(N).tonic-1,3,i.value[f]==1?1:.1,v[f]?1:.1),onMousedown:k=>v[f]=!v[f]},null,40,st),e("line",{class:"line pointer-events-none transition-all duration-200 ease-out",x1:p*l.width/l.step.length,x2:(p+1)*l.width/l.step.length,y1:10,y2:10,"stroke-width":v[f]?4:6,"stroke-opacity":"0.1",stroke:v[f]?"black":t(S)(r+t(N).tonic-1,3,i.value[f]==1?1:.1,v[f]?1:.5)},null,8,nt)]))),128))],8,ot)),64)),F(e("g",{class:"subs",transform:`translate(0 ${l.height})`},[F(e("rect",{width:l.width,height:l.footer,fill:"transparent"},null,8,at),[[d,u]]),(c(!0),g(b,null,$(l.step,(r,f)=>(c(),g("g",{class:"pointer-events-none",key:r,transform:`translate(${f*l.width/l.step.length} 0)`},[e("rect",{"data-pos":l.pos,height:l.footer,stroke:"currentColor",fill:"#5552",width:l.width/l.step.length},null,8,dt),e("text",{class:"font-bold",x:l.width/l.step.length/2,y:40,"font-size":20*(1-.15*(l.step.length-1)),fill:"currentColor","text-anchor":"middle","dominant-baseline":"cental"},C(m(r)),9,ut)],8,rt))),128))],8,it),[[H,l.active]])],8,lt)}}},ft=U(mt,[["__scopeId","data-v-e64dff66"]]),ct={class:"is-group flex p-1 mx-1 items-center"},ht={class:"is-group flex p-1 m-1"},vt={class:"is-group p-1 flex mx-1"},gt=["viewBox","opacity"],xt={id:"grid-mask"},pt=["width","height"],wt={class:"all","clip-path":"url(#grid-mask)"},yt={class:"grid"},bt=["stroke","width","height"],$t=["y2","stroke-width","stroke","transform"],kt=["transform","stroke"],Vt=["transform"],Ct=["y2","stroke"],Nt={__name:"ChromaGridsGrid",props:{order:{type:Number,default:0},color:{type:String,default:"currentColor"},active:{type:Boolean,default:!0}},emits:["del"],setup(l){const w=l,n=I({width:1e3,height:720,footer:60}),s=R(w.order);return(a,o)=>{const u=et;return c(),g("div",{class:"flex flex-col shadow-xl rounded-3xl overflow-hidden border-4",style:V({zIndex:l.active?100:1,opacity:l.active?1:.25,borderColor:l.color})},[e("div",{class:"flex flex-wrap p-2",style:V({opacity:l.active?1:0,backgroundColor:l.color,pointerEvents:l.active?"auto":"none"})},[e("div",ct,[y(u,{class:"w-5em",modelValue:t(s).metre.over,"onUpdate:modelValue":o[0]||(o[0]=i=>t(s).metre.over=i),step:1,min:1,max:48,param:""},null,8,["modelValue"]),o[11]||(o[11]=e("div",{class:"p-2 text-xl"},"/",-1)),y(u,{class:"w-5em",modelValue:t(s).metre.under,"onUpdate:modelValue":o[1]||(o[1]=i=>t(s).metre.under=i),step:1,min:1,max:16,param:""},null,8,["modelValue"])]),e("div",ht,[e("button",{class:"text-button",onClick:o[2]||(o[2]=i=>t(s).rotate(-1))},o[12]||(o[12]=[e("div",{class:"i-la-angle-left"},null,-1)])),e("button",{class:"text-button",onClick:o[3]||(o[3]=i=>t(s).rotate())},o[13]||(o[13]=[e("div",{class:"i-la-angle-right"},null,-1)]))]),e("div",{class:"is-group p-1 flex mx-1 transition-all duration-300 ease",style:V({borderColor:t(S)(t(s).pitch,t(s).octave)})},[y(u,{class:"w-5em",modelValue:t(s).octave,"onUpdate:modelValue":o[4]||(o[4]=i=>t(s).octave=i),step:1,min:0,max:7,ratio:4},{default:M(()=>[e("div",{class:"font-bold transition-all duration-300 ease",style:V({color:t(S)(t(s).pitch,t(s).octave)})},C(t(Y)[t(s).pitch])+C(t(s).octave),5)]),_:1},8,["modelValue"])],4),e("div",vt,[y(u,{class:"w-5em",modelValue:t(s).probability,"onUpdate:modelValue":o[5]||(o[5]=i=>t(s).probability=i),step:.01,min:0,max:1,fixed:2},{default:M(()=>o[14]||(o[14]=[e("div",{class:"i-la-dice text-xl"},null,-1)])),_:1},8,["modelValue"]),y(u,{class:"w-4em",modelValue:t(s).pan,"onUpdate:modelValue":o[6]||(o[6]=i=>t(s).pan=i),step:.01,min:-1,max:1,fixed:1,ratio:2},{default:M(()=>o[15]||(o[15]=[e("div",{class:"i-mdi-pan-horizontal"},null,-1)])),_:1},8,["modelValue"]),y(u,{class:"w-4em",modelValue:t(s).volume,"onUpdate:modelValue":o[7]||(o[7]=i=>t(s).volume=i),step:.01,min:0,max:1,fixed:1,ratio:2,onDblclick:o[8]||(o[8]=i=>t(s).volume>0?t(s).volume=0:t(s).volume=.75)},{default:M(()=>o[16]||(o[16]=[e("div",{class:"i-la-volume-up"},null,-1)])),_:1},8,["modelValue"])]),o[19]||(o[19]=e("div",{class:"flex-1"},null,-1)),e("button",{class:"text-button",onMousedown:o[9]||(o[9]=i=>t(s).clear())},o[17]||(o[17]=[e("div",{class:"i-la-trash-alt"},null,-1)]),32),e("button",{class:"text-button",onMousedown:o[10]||(o[10]=i=>a.$emit("del"))},o[18]||(o[18]=[e("div",{class:"i-la-times"},null,-1)]),32)],4),(c(),g("svg",{class:"w-full cursor-pointer",ref:"svg",version:"1.1",baseProfile:"full",viewBox:`0 0 ${n.width} ${n.height+n.footer}`,xmlns:"http://www.w3.org/2000/svg",style:{"user-select":"none","touch-action":"none"},opacity:t(s).volume},[e("clipPath",xt,[e("rect",{x:0,y:-10,width:n.width,height:n.height+n.footer+10,rx:10},null,8,pt)]),e("g",wt,[e("g",yt,[e("rect",{ref:"area",stroke:l.color,"stroke-width":10,fill:"transparent",rx:"10",width:n.width,height:n.height},null,8,bt),(c(!0),g(b,null,$(t(s).metre.over,i=>(c(),g("line",{key:i,y2:n.height,"stroke-width":i%t(s).metre.under==0?8:i%4==0?4:l.active?1:0,stroke:l.color,transform:`translate(${i*n.width/t(s).metre.over} 0)`},null,8,$t))),128)),e("line",{x2:"1000",transform:`translate(0 ${n.height/2})`,"stroke-width":"4",stroke:t(S)(t(s).pitch)},null,8,kt)]),(c(!0),g(b,null,$(t(s).steps,(i,m)=>(c(),L(ft,{key:m,step:i,pos:m,color:l.color,width:n.width/t(s).steps.length,height:n.height,footer:n.footer,active:l.active,onSubdivide:h=>t(s).steps[m]=h},null,8,["step","pos","color","width","height","footer","active","onSubdivide"]))),128)),e("g",{class:"progress",transform:`translate(${n.width*t(s).progress} 0)`},[e("line",{y1:"0",y2:n.height,"stroke-width":"4",stroke:l.color},null,8,Ct)],8,Vt)])],8,gt))],4)}}},Mt={class:"flex flex-col items-center rounded-3xl fullscreen-container p-2",id:"screen"},St={class:"flex flex-wrap mt-4 w-full justify-start px-6"},Dt=["onMousedown"],Ft={class:"px-4 py-2"},Bt={class:"flex flex-col mb-4 mx-4 w-full relative"},Ut={__name:"ChromaGrids",setup(l){const{isDark:w}=P(),n=z("pitch-bars",[1]);function s(){n.value.push(Math.ceil(Math.random()*100)),a.value=n.value.length-1}const a=z("pitch-bars-active",0);return(o,u)=>(c(),g("div",Mt,[e("div",St,[(c(!0),g(b,null,$(t(n),(i,m)=>(c(),g("button",{class:B(["px-2 rounded-t-xl mx-2px transition-all duration-300 ease flex items-center",{active:t(a)==m}]),key:i,style:V({backgroundColor:t(G)(m,t(n).length,t(a)==m?1:.3)}),onMousedown:h=>a.value=m},[e("div",Ft,C(m),1)],46,Dt))),128)),e("button",{class:"text-button",onClick:u[0]||(u[0]=i=>s())},u[2]||(u[2]=[e("div",{class:"i-la-plus"},null,-1)])),u[4]||(u[4]=e("div",{class:"flex-1"},null,-1)),e("button",{class:"text-button flex items-center",onClick:u[1]||(u[1]=i=>t(Q)())},u[3]||(u[3]=[e("div",{class:"i-la-file-download"},null,-1)]))]),e("div",Bt,[y(T,{name:"fade"},{default:M(()=>[(c(!0),g(b,null,$(t(n),(i,m)=>(c(),L(Nt,{class:B(["w-full",{absolute:m>0}]),key:i,order:m,active:t(a)==m,color:t(G)(m,t(n).length,t(w)?.3:1),onDel:h=>{t(n).splice(m,1),a.value=t(n).length-1}},null,8,["class","order","active","color","onDel"]))),128))]),_:1})])]))}};export{Ut as default};