import{H as V,Y as ae,Z as W,$ as j,a0 as Y,a1 as H,a2 as L,a3 as se,n as C,a4 as oe,a5 as re,a6 as ie,a7 as le,a8 as ce}from"./chunks/theme.B-lyZe0u.js";import{r as N,b as J,u as S,M as de,d as w,c as A,U as K,f as u,g as m,h as l,m as F,V as f,l as v,$ as G,k as T,p as z,_ as I,F as U,j as Q,n as X,z as Z,A as E,o as ee,P as ue,B as pe,a4 as me,C as ve,ae as fe,a2 as _e}from"./chunks/framework.B7TlvOs3.js";import{c as xe}from"./chunks/simplex-noise.CZbXB3Em.js";import{p as k}from"./chunks/paper-full.0c6cc3xS.js";const te=xe(),O=N(0),ne=J({}),R=V(S("ambient-noise-zoom",100),50,500);de(()=>{O.value+=1});function ge({title:n="simplex",size:r=1,minSpeed:e=.001,maxSpeed:t=1e4}={}){const i=N(0),a=V(S(n+"-radius",Math.random()*250*r),1,250),s=V(S(n,Math.random()*1e3),e,t);w(O,()=>i.value+=s.value/1e4);const d=A(()=>be(a.value,i.value)),_=A(()=>te(d.value.x/R.value,d.value.y/R.value));return ne[n]=J({polar:d,radius:a,speed:s,random:_}),{random:_,polar:d,progress:i,count:O,speed:s,radius:a}}function be(n=1,r=0){let e=(r-90)*Math.PI/180;return{x:n*Math.cos(e),y:n*Math.sin(e)}}function q(){return q=Object.assign||function(n){for(var r=1;r<arguments.length;r++){var e=arguments[r];for(var t in e)Object.prototype.hasOwnProperty.call(e,t)&&(n[t]=e[t])}return n},q.apply(this,arguments)}var D=["","K","M","B"],he={digits:1,uppercase:!0},ye=function(n,r){if(r===void 0&&(r={}),isNaN(n))return 0;var e=Math.abs(n);if(e<1e3)return Number(n);for(var t=q({},he,r),i=t.digits,a=t.uppercase,s=[0,1].includes(Math.sign(n))?1:-1,d=0,_="",g=0;g<=D.length;g++){var p=Math.pow(1e3,g);e>=p&&(d=e/p,_=a?D[g]:D[g].toLowerCase())}return""+(d-Math.floor(d)<=0||i===0?Math.floor(d*s):parseFloat(d*s).toFixed(i))+_};const we={class:"flex-1 bg-light-400 dark-bg-dark-400 shadow relative w-full cursor-pointer min-w-25 rounded-lg select-none overflow-hidden"},ke={class:"flex flex-col p-1 gap-0"},$e={class:"px-1 pb-1"},Ne={class:"flex gap-2 p-1"},Se={class:"flex relative border-t-1 border-current"},Ce={class:"flex-1 h-6 cursor-pointer","drag-options":{preventWindowScrollY:!0}},Me={class:"flex-1 h-6 cursor-pointer","drag-options":{preventWindowScrollY:!0}},Re=l("div",{class:"h-2px bg-dark-100 dark-bg-light-100 flex-1"},null,-1),Pe=[Re],Te=l("div",{class:"h-2px bg-dark-100 dark-bg-light-100 flex-1"},null,-1),Ae=[Te],y={__name:"clampedNoise",props:{instrument:{type:String,default:"inst"},title:{type:String,default:"random-value"},minSpeed:{type:Number,default:.001},maxSpeed:{type:Number,default:1e4},min:{type:Number,default:0},max:{type:Number,default:1},radius:{type:Number,default:1},precision:{type:Number,default:2}},emits:["random"],setup(n,{emit:r}){const e=n,t=r,i=A(()=>`ambient-${e.instrument}-${e.title}`),a=V(S(i.value+"-min",0),0,1),s=V(S(i.value+"-max",1),0,1);w([a,s],()=>{a.value>s.value&&(s.value=a.value),s.value<a.value&&(a.value=s.value)});const{random:d,speed:_,radius:g}=ge({title:i.value,size:e.radius}),p=A(()=>(d.value/2+.5)*(s.value-a.value)+a.value),b=A(()=>p.value*(e.max-e.min)+e.min);w(b,o=>t("random",o));function h(o){const c=(o.delta[0]-o.delta[1])/1e3;a.value+=c}function x(o){const c=(o.delta[0]-o.delta[1])/1e3;s.value+=c}return(o,c)=>{const M=ae,P=K("drag");return u(),m("div",we,[l("div",ke,[l("div",$e,F(n.title),1),l("div",Ne,[f(M,{class:"flex-1",modelValue:v(g),"onUpdate:modelValue":c[0]||(c[0]=B=>G(g)?g.value=B:null),max:250,min:10,param:"Radius",fixed:0},null,8,["modelValue"]),f(M,{class:"flex-1",modelValue:v(_),"onUpdate:modelValue":c[1]||(c[1]=B=>G(_)?_.value=B:null),max:n.maxSpeed,min:n.minSpeed,param:"Speed",step:1,fixed:0},null,8,["modelValue","max","min"])])]),l("div",Se,[T(l("div",Ce,null,512),[[P,h]]),T(l("div",Me,null,512),[[P,x]]),l("div",{class:"absolute left-0 top-0 text-right border-r-4 pr-2 pointer-events-none border-current",style:z({width:(b.value-e.min)/(e.max-e.min)*100+"%"})},F(v(ye)(b.value.toFixed(e.precision))),5),T((u(),m("div",{class:"absolute bg-dark-700 bg-opacity-20 border-r-2 border-current py-2 h-full flex items-center cursor-pointer",style:z({width:v(a)*100+"%"})},Pe,4)),[[P,h]]),T((u(),m("div",{class:"absolute bg-light-100 bg-opacity-20 border-l-2 border-current py-2 right-0 h-full h-full flex items-center cursor-pointer",style:z({width:(1-v(s))*100+"%"}),"drag-options":{preventWindowScrollY:!0}},Ae,4)),[[P,x]])])])}}},Ve=n=>(Z("data-v-0ba7764c"),n=n(),E(),n),Fe={class:"flex flex-col gap-4"},ze={class:"flex items-center flex-wrap"},Ie=Ve(()=>l("div",{class:"font-bold"},"Bass",-1)),Be={key:0,class:"i-la-play"},De={key:1,class:"i-la-pause"},Oe={class:"flex flex-wrap gap-2"},qe=["onClick"],We={class:"flex flex-wrap gap-4"},je={__name:"drone",setup(n){const r=S("ambient-synth-options",{oscillator:{type:"sawtooth"},envelope:{attack:1,decay:.1,sustain:.9,release:6},volume:1,harmonicity:2}),e=N(!1),t=N(0),i=N(1),{channel:a}=W("ambient-drone"),s=new j(r.value.volume).connect(a),d=new Y({type:"lowpass",frequency:1500,Q:0}).connect(s),_=new H(4).connect(d),g=new L(0).connect(_),p=new se(r.value).connect(g),b=S("ambient-synth-note",0);return w(e,h=>{h?(p.triggerAttack(C[t.value]+i.value),b.value=t.value):p.triggerRelease()}),w(t,h=>{p.frequency.rampTo(C[h]+i.value,1)}),(h,x)=>(u(),m("div",Fe,[l("div",ze,[Ie,l("button",{class:"p-2",onClick:x[0]||(x[0]=o=>e.value=!e.value)},[e.value?(u(),m("div",De)):(u(),m("div",Be))]),l("div",Oe,[(u(!0),m(U,null,Q(v(C),(o,c)=>(u(),m("button",{class:X(["p-1 text-xs",{active:c==t.value}]),key:o,onClick:M=>t.value=c},F(o),11,qe))),128))])]),l("div",We,[f(y,{title:"Low pass",instrument:"FM",min:50,max:1e4,onRandom:x[1]||(x[1]=o=>v(d).frequency.rampTo(o))}),f(y,{title:"Pan",instrument:"FM",min:-1,onRandom:x[2]||(x[2]=o=>v(g).pan.rampTo(o))}),f(y,{title:"Volume",instrument:"FM",onRandom:x[3]||(x[3]=o=>v(s).gain.rampTo(o))})])]))}},Ye=I(je,[["__scopeId","data-v-0ba7764c"]]),Le=n=>(Z("data-v-2f3315bb"),n=n(),E(),n),Ue={class:"flex flex-col gap-4"},Qe={class:"flex items-center"},Ze=Le(()=>l("div",{class:"font-bold"},"NOISE",-1)),Ee={key:0,class:"i-la-play"},Ge={key:1,class:"i-la-pause"},He={class:"flex flex-wrap gap-4"},Je={__name:"noise",setup(n){const r=S("ambient-options",{noise:{type:"brown"},envelope:{attack:1,decay:.1,sustain:.9,release:6},volume:1}),e=N(!1),{channel:t}=W("ambient-noise"),i=new j(r.value.volume).connect(t),a=new Y({type:"lowpass",frequency:1500,Q:0}).connect(i),s=new oe(4).connect(a),d=new L(0).connect(s),_=new re(r.value).connect(d);return w(e,g=>{g?_.triggerAttack():_.triggerRelease()}),(g,p)=>(u(),m("div",Ue,[l("div",Qe,[Ze,l("button",{class:"p-2",onClick:p[0]||(p[0]=b=>e.value=!e.value)},[e.value?(u(),m("div",Ge)):(u(),m("div",Ee))])]),l("div",He,[f(y,{title:"Bit crusher",instrument:"Noise",min:2,max:8,onRandom:p[1]||(p[1]=b=>v(s).bits.rampTo(b))}),f(y,{title:"Low pass",instrument:"Noise",min:50,max:1e4,onRandom:p[2]||(p[2]=b=>v(a).frequency.rampTo(b))}),f(y,{title:"Pan",instrument:"Noise",min:-1,max:1,onRandom:p[3]||(p[3]=b=>v(d).pan.rampTo(b))}),f(y,{title:"Volume",instrument:"Noise",onRandom:p[4]||(p[4]=b=>v(i).gain.rampTo(b))})])]))}},Ke=I(Je,[["__scopeId","data-v-2f3315bb"]]),Xe=n=>(Z("data-v-c2bf82ce"),n=n(),E(),n),et={class:"flex flex-col gap-4"},tt={class:"flex items-center flex-wrap"},nt=Xe(()=>l("div",{class:"font-bold"},"Pluck",-1)),at={key:0,class:"i-la-play"},st={key:1,class:"i-la-pause"},ot={class:"flex flex-wrap gap-2"},rt=["onClick"],it={class:"flex flex-wrap gap-4"},lt={__name:"arp",setup(n){const r=S("ambient-arp-options",{attackNoise:2,volume:20,resonance:20}),e=N(!1),t=N(0),i=N(4),{channel:a}=W("ambient-arp"),s=new j(r.value.volume).connect(a),d=new Y({type:"lowpass",frequency:1500,Q:0}).connect(s),_=new H(6).connect(d),g=new ie({delayTime:"4t",feedback:.6}).connect(_),p=new L(0).connect(g),b=new le({attackNoise:2,resonance:.85,volume:10}).connect(p),h=new ce({callback(x,o){b.triggerAttackRelease(o+i.value,"8n",x)},values:[C[t.value],C[(t.value+7)%12]],pattern:"random",interval:"8n",humanize:!0});return w(t,x=>{h.values=[C[x],C[(x+7)%12]]}),w(e,x=>{x?h.start(0):h.stop()}),(x,o)=>(u(),m("div",et,[l("div",tt,[nt,l("button",{class:"p-2",onClick:o[0]||(o[0]=c=>e.value=!e.value)},[e.value?(u(),m("div",st)):(u(),m("div",at))]),l("div",ot,[(u(!0),m(U,null,Q(v(C),(c,M)=>(u(),m("button",{class:X(["p-1 text-xs",{active:M==t.value}]),key:c,onClick:P=>t.value=M},F(c),11,rt))),128))])]),l("div",it,[f(y,{title:"Octave",instrument:"Arp",min:2,max:6,onRandom:o[1]||(o[1]=c=>i.value=Math.round(c))}),f(y,{title:"Probability",instrument:"Arp",onRandom:o[2]||(o[2]=c=>v(h).probability=c)}),f(y,{title:"Low pass",instrument:"Arp",min:50,max:1e4,onRandom:o[3]||(o[3]=c=>v(d).frequency.rampTo(c))}),f(y,{title:"Pan",instrument:"Arp",min:-1,onRandom:o[4]||(o[4]=c=>v(p).pan.rampTo(c))}),f(y,{title:"Volume",instrument:"Arp",onRandom:o[5]||(o[5]=c=>v(s).gain.rampTo(c))})])]))}},ct=I(lt,[["__scopeId","data-v-c2bf82ce"]]),dt={__name:"paper-circle",props:{polar:{type:Object,default:()=>{}},radius:{type:Number,default:0},random:{type:Number,default:0}},setup(n){const r=n;return ee(()=>{const e=new k.Shape.Circle({x:0,y:0},5),t=new k.Shape.Circle({x:+k.view.size.width/2,y:+k.view.size.height/2},r.radius);t.strokeWidth=2,w(()=>r.polar,i=>{var a,s,d,_;e.position.x=i.x+((s=(a=k.view)==null?void 0:a.size)==null?void 0:s.width)/2,e.position.y=i.y+((_=(d=k.view)==null?void 0:d.size)==null?void 0:_.width)/2}),w(()=>r.radius,i=>t.radius=i),w(()=>r.random,i=>{let a=new k.Color(i);e.fillColor=a,t.strokeColor=a,e.radius=2+5*(i+1)})}),(e,t)=>(u(),m("span"))}},ut={class:"relative mx-6 flex"},pt={class:"absolute -left-2 text-xs"},$=512,mt={__name:"simplexPaper",setup(n){const r=N();ee(()=>{k.setup(r.value),k.view.draw();const t=new k.Raster;t.position.x=$/2,t.position.y=$/2,t.width=$,t.height=$,w(R,i=>{for(let a=0;a<$;a++)for(let s=0;s<$;s++)t.setPixel(a,s,`hsl(0,0%,${(te((a-$/2)/i,(s-$/2)/i)+1)*50}%)`)},{immediate:!0})}),ue(()=>{k.project.clear()});function e(t){R.value-=t.delta[1]/10}return(t,i)=>{const a=K("drag");return u(),m("div",ut,[l("div",{class:"absolute px-1 dark-bg-light-100 bg-dark-100 bg-opacity-20 dark-bg-opacity-20 -left-4 bottom-0 rounded-xl",style:z({height:v(R)/5+"%"})},[l("div",pt,F(v(R).toFixed()),1)],4),T((u(),m("canvas",{class:"rounded-xl cursor-pointer flex-auto max-w-full",ref_key:"canvas",ref:r,width:$,height:$,"drag-options":{preventWindowScrollY:!0}},[(u(!0),m(U,null,Q(v(ne),s=>(u(),pe(dt,me({key:s,ref_for:!0},s),null,16))),128))])),[[a,e]])])}}},vt={class:"flex flex-wrap gap-6 items-stretch"},ft={__name:"ambience",setup(n){return(r,e)=>(u(),m("div",vt,[f(mt),f(Ke,{class:"p-2 rounded-xl w-full shadow-xl bg-light-800 dark-bg-dark-200",style:{flex:"1 1 320px"}}),f(Ye,{class:"p-2 rounded-xl w-full shadow-xl bg-light-800 dark-bg-dark-200",style:{flex:"1 1 320px"}}),f(ct,{class:"p-2 rounded-xl w-full shadow-xl bg-light-800 dark-bg-dark-200",style:{flex:"1 1 320px"}})]))}},_t=I(ft,[["__scopeId","data-v-3a388877"]]),xt=l("h3",{id:"work-in-progress",tabindex:"-1"},[fe("Work in progress "),l("a",{class:"header-anchor",href:"#work-in-progress","aria-label":'Permalink to "Work in progress"'},"​")],-1),kt=JSON.parse('{"title":"Ambient drone box","description":"A generative instrument for creating meditative sound landscapes","frontmatter":{"title":"Ambient drone box","description":"A generative instrument for creating meditative sound landscapes","date":"2022-04-28T00:00:00.000Z","cover":"ambience.png","layout":"app"},"headers":[],"relativePath":"practice/generative/ambience/index.md","filePath":"practice/generative/ambience/index.md","lastUpdated":1725283166000}'),gt={name:"practice/generative/ambience/index.md"},$t=Object.assign(gt,{setup(n){return(r,e)=>{const t=_e("client-only");return u(),m("div",null,[f(t,null,{default:ve(()=>[f(_t)]),_:1}),xt])}}});export{kt as __pageData,$t as default};