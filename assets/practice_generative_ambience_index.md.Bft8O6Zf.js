import{H as V,Y as te,Z as j,$ as I,a0 as Y,a1 as E,a2 as L,a3 as ne,n as R,a4 as ae,a5 as se,a6 as oe,a7 as re,a8 as le}from"./chunks/theme.DvVY4vau.js";import{r as N,b as G,u as S,G as ie,d as w,c as A,P as K,f as p,g as m,h as c,m as F,R as x,l as f,V as Z,k as T,p as z,_ as B,F as U,j as Q,n as H,o as J,K as ce,z as ue,a1 as de,A as pe,au as me,$ as ve}from"./chunks/framework.BX1Y-ISu.js";import{c as fe}from"./chunks/simplex-noise.CZbXB3Em.js";import{p as k}from"./chunks/paper-full.Bjc5wYmi.js";const X=fe(),q=N(0),ee=G({}),M=V(S("ambient-noise-zoom",100),50,500);ie(()=>{q.value+=1});function xe({title:i="simplex",size:o=1,minSpeed:e=.001,maxSpeed:t=1e4}={}){const r=N(0),n=V(S(i+"-radius",Math.random()*250*o),1,250),a=V(S(i,Math.random()*1e3),e,t);w(q,()=>r.value+=a.value/1e4);const u=A(()=>ge(n.value,r.value)),g=A(()=>X(u.value.x/M.value,u.value.y/M.value));return ee[i]=G({polar:u,radius:n,speed:a,random:g}),{random:g,polar:u,progress:r,count:q,speed:a,radius:n}}function ge(i=1,o=0){let e=(o-90)*Math.PI/180;return{x:i*Math.cos(e),y:i*Math.sin(e)}}function W(){return W=Object.assign||function(i){for(var o=1;o<arguments.length;o++){var e=arguments[o];for(var t in e)Object.prototype.hasOwnProperty.call(e,t)&&(i[t]=e[t])}return i},W.apply(this,arguments)}var O=["","K","M","B"],_e={digits:1,uppercase:!0},be=function(i,o){if(o===void 0&&(o={}),isNaN(i))return 0;var e=Math.abs(i);if(e<1e3)return Number(i);for(var t=W({},_e,o),r=t.digits,n=t.uppercase,a=[0,1].includes(Math.sign(i))?1:-1,u=0,g="",_=0;_<=O.length;_++){var d=Math.pow(1e3,_);e>=d&&(u=e/d,g=n?O[_]:O[_].toLowerCase())}return""+(u-Math.floor(u)<=0||r===0?Math.floor(u*a):parseFloat(u*a).toFixed(r))+g};const ye={class:"flex-1 bg-light-400 dark-bg-dark-400 shadow relative w-full cursor-pointer min-w-25 rounded-lg select-none overflow-hidden"},he={class:"flex flex-col p-1 gap-0"},we={class:"px-1 pb-1"},ke={class:"flex gap-2 p-1"},$e={class:"flex relative border-t-1 border-current"},Ne={class:"flex-1 h-6 cursor-pointer","drag-options":{preventWindowScrollY:!0}},Se={class:"flex-1 h-6 cursor-pointer","drag-options":{preventWindowScrollY:!0}},h={__name:"clampedNoise",props:{instrument:{type:String,default:"inst"},title:{type:String,default:"random-value"},minSpeed:{type:Number,default:.001},maxSpeed:{type:Number,default:1e4},min:{type:Number,default:0},max:{type:Number,default:1},radius:{type:Number,default:1},precision:{type:Number,default:2}},emits:["random"],setup(i,{emit:o}){const e=i,t=o,r=A(()=>`ambient-${e.instrument}-${e.title}`),n=V(S(r.value+"-min",0),0,1),a=V(S(r.value+"-max",1),0,1);w([n,a],()=>{n.value>a.value&&(a.value=n.value),a.value<n.value&&(n.value=a.value)});const{random:u,speed:g,radius:_}=xe({title:r.value,size:e.radius}),d=A(()=>(u.value/2+.5)*(a.value-n.value)+n.value),b=A(()=>d.value*(e.max-e.min)+e.min);w(b,s=>t("random",s));function y(s){const l=(s.delta[0]-s.delta[1])/1e3;n.value+=l}function v(s){const l=(s.delta[0]-s.delta[1])/1e3;a.value+=l}return(s,l)=>{const C=te,P=K("drag");return p(),m("div",ye,[c("div",he,[c("div",we,F(i.title),1),c("div",ke,[x(C,{class:"flex-1",modelValue:f(_),"onUpdate:modelValue":l[0]||(l[0]=D=>Z(_)?_.value=D:null),max:250,min:10,param:"Radius",fixed:0},null,8,["modelValue"]),x(C,{class:"flex-1",modelValue:f(g),"onUpdate:modelValue":l[1]||(l[1]=D=>Z(g)?g.value=D:null),max:i.maxSpeed,min:i.minSpeed,param:"Speed",step:1,fixed:0},null,8,["modelValue","max","min"])])]),c("div",$e,[T(c("div",Ne,null,512),[[P,y]]),T(c("div",Se,null,512),[[P,v]]),c("div",{class:"absolute left-0 top-0 text-right border-r-4 pr-2 pointer-events-none border-current",style:z({width:(b.value-e.min)/(e.max-e.min)*100+"%"})},F(f(be)(b.value.toFixed(e.precision))),5),T((p(),m("div",{class:"absolute bg-dark-700 bg-opacity-20 border-r-2 border-current py-2 h-full flex items-center cursor-pointer",style:z({width:f(n)*100+"%"})},l[2]||(l[2]=[c("div",{class:"h-2px bg-dark-100 dark-bg-light-100 flex-1"},null,-1)]),4)),[[P,y]]),T((p(),m("div",{class:"absolute bg-light-100 bg-opacity-20 border-l-2 border-current py-2 right-0 h-full h-full flex items-center cursor-pointer",style:z({width:(1-f(a))*100+"%"}),"drag-options":{preventWindowScrollY:!0}},l[3]||(l[3]=[c("div",{class:"h-2px bg-dark-100 dark-bg-light-100 flex-1"},null,-1)]),4)),[[P,v]])])])}}},Re={class:"flex flex-col gap-4"},Ce={class:"flex items-center flex-wrap"},Me={key:0,class:"i-la-play"},Pe={key:1,class:"i-la-pause"},Te={class:"flex flex-wrap gap-2"},Ae=["onClick"],Ve={class:"flex flex-wrap gap-4"},Fe={__name:"drone",setup(i){const o=S("ambient-synth-options",{oscillator:{type:"sawtooth"},envelope:{attack:1,decay:.1,sustain:.9,release:6},volume:1,harmonicity:2}),e=N(!1),t=N(0),r=N(1),{channel:n}=j("ambient-drone"),a=new I(o.value.volume).connect(n),u=new Y({type:"lowpass",frequency:1500,Q:0}).connect(a),g=new E(4).connect(u),_=new L(0).connect(g),d=new ne(o.value).connect(_),b=S("ambient-synth-note",0);return w(e,y=>{y?(d.triggerAttack(R[t.value]+r.value),b.value=t.value):d.triggerRelease()}),w(t,y=>{d.frequency.rampTo(R[y]+r.value,1)}),(y,v)=>(p(),m("div",Re,[c("div",Ce,[v[4]||(v[4]=c("div",{class:"font-bold"},"Bass",-1)),c("button",{class:"p-2",onClick:v[0]||(v[0]=s=>e.value=!e.value)},[e.value?(p(),m("div",Pe)):(p(),m("div",Me))]),c("div",Te,[(p(!0),m(U,null,Q(f(R),(s,l)=>(p(),m("button",{class:H(["p-1 text-xs",{active:l==t.value}]),key:s,onClick:C=>t.value=l},F(s),11,Ae))),128))])]),c("div",Ve,[x(h,{title:"Low pass",instrument:"FM",min:50,max:1e4,onRandom:v[1]||(v[1]=s=>f(u).frequency.rampTo(s))}),x(h,{title:"Pan",instrument:"FM",min:-1,onRandom:v[2]||(v[2]=s=>f(_).pan.rampTo(s))}),x(h,{title:"Volume",instrument:"FM",onRandom:v[3]||(v[3]=s=>f(a).gain.rampTo(s))})])]))}},ze=B(Fe,[["__scopeId","data-v-0ba7764c"]]),Be={class:"flex flex-col gap-4"},De={class:"flex items-center"},Oe={key:0,class:"i-la-play"},qe={key:1,class:"i-la-pause"},We={class:"flex flex-wrap gap-4"},je={__name:"noise",setup(i){const o=S("ambient-options",{noise:{type:"brown"},envelope:{attack:1,decay:.1,sustain:.9,release:6},volume:1}),e=N(!1),{channel:t}=j("ambient-noise"),r=new I(o.value.volume).connect(t),n=new Y({type:"lowpass",frequency:1500,Q:0}).connect(r),a=new ae(4).connect(n),u=new L(0).connect(a),g=new se(o.value).connect(u);return w(e,_=>{_?g.triggerAttack():g.triggerRelease()}),(_,d)=>(p(),m("div",Be,[c("div",De,[d[5]||(d[5]=c("div",{class:"font-bold"},"NOISE",-1)),c("button",{class:"p-2",onClick:d[0]||(d[0]=b=>e.value=!e.value)},[e.value?(p(),m("div",qe)):(p(),m("div",Oe))])]),c("div",We,[x(h,{title:"Bit crusher",instrument:"Noise",min:2,max:8,onRandom:d[1]||(d[1]=b=>f(a).bits.rampTo(b))}),x(h,{title:"Low pass",instrument:"Noise",min:50,max:1e4,onRandom:d[2]||(d[2]=b=>f(n).frequency.rampTo(b))}),x(h,{title:"Pan",instrument:"Noise",min:-1,max:1,onRandom:d[3]||(d[3]=b=>f(u).pan.rampTo(b))}),x(h,{title:"Volume",instrument:"Noise",onRandom:d[4]||(d[4]=b=>f(r).gain.rampTo(b))})])]))}},Ie=B(je,[["__scopeId","data-v-2f3315bb"]]),Ye={class:"flex flex-col gap-4"},Le={class:"flex items-center flex-wrap"},Ue={key:0,class:"i-la-play"},Qe={key:1,class:"i-la-pause"},Ze={class:"flex flex-wrap gap-2"},Ee=["onClick"],Ge={class:"flex flex-wrap gap-4"},Ke={__name:"arp",setup(i){const o=S("ambient-arp-options",{attackNoise:2,volume:20,resonance:20}),e=N(!1),t=N(0),r=N(4),{channel:n}=j("ambient-arp"),a=new I(o.value.volume).connect(n),u=new Y({type:"lowpass",frequency:1500,Q:0}).connect(a),g=new E(6).connect(u),_=new oe({delayTime:"4t",feedback:.6}).connect(g),d=new L(0).connect(_),b=new re({attackNoise:2,resonance:.85,volume:10}).connect(d),y=new le({callback(v,s){b.triggerAttackRelease(s+r.value,"8n",v)},values:[R[t.value],R[(t.value+7)%12]],pattern:"random",interval:"8n",humanize:!0});return w(t,v=>{y.values=[R[v],R[(v+7)%12]]}),w(e,v=>{v?y.start(0):y.stop()}),(v,s)=>(p(),m("div",Ye,[c("div",Le,[s[6]||(s[6]=c("div",{class:"font-bold"},"Pluck",-1)),c("button",{class:"p-2",onClick:s[0]||(s[0]=l=>e.value=!e.value)},[e.value?(p(),m("div",Qe)):(p(),m("div",Ue))]),c("div",Ze,[(p(!0),m(U,null,Q(f(R),(l,C)=>(p(),m("button",{class:H(["p-1 text-xs",{active:C==t.value}]),key:l,onClick:P=>t.value=C},F(l),11,Ee))),128))])]),c("div",Ge,[x(h,{title:"Octave",instrument:"Arp",min:2,max:6,onRandom:s[1]||(s[1]=l=>r.value=Math.round(l))}),x(h,{title:"Probability",instrument:"Arp",onRandom:s[2]||(s[2]=l=>f(y).probability=l)}),x(h,{title:"Low pass",instrument:"Arp",min:50,max:1e4,onRandom:s[3]||(s[3]=l=>f(u).frequency.rampTo(l))}),x(h,{title:"Pan",instrument:"Arp",min:-1,onRandom:s[4]||(s[4]=l=>f(d).pan.rampTo(l))}),x(h,{title:"Volume",instrument:"Arp",onRandom:s[5]||(s[5]=l=>f(a).gain.rampTo(l))})])]))}},He=B(Ke,[["__scopeId","data-v-c2bf82ce"]]),Je={__name:"paper-circle",props:{polar:{type:Object,default:()=>{}},radius:{type:Number,default:0},random:{type:Number,default:0}},setup(i){const o=i;return J(()=>{const e=new k.Shape.Circle({x:0,y:0},5),t=new k.Shape.Circle({x:+k.view.size.width/2,y:+k.view.size.height/2},o.radius);t.strokeWidth=2,w(()=>o.polar,r=>{var n,a,u,g;e.position.x=r.x+((a=(n=k.view)==null?void 0:n.size)==null?void 0:a.width)/2,e.position.y=r.y+((g=(u=k.view)==null?void 0:u.size)==null?void 0:g.width)/2}),w(()=>o.radius,r=>t.radius=r),w(()=>o.random,r=>{let n=new k.Color(r);e.fillColor=n,t.strokeColor=n,e.radius=2+5*(r+1)})}),(e,t)=>(p(),m("span"))}},Xe={class:"relative mx-6 flex"},et={class:"absolute -left-2 text-xs"},$=512,tt={__name:"simplexPaper",setup(i){const o=N();J(()=>{k.setup(o.value),k.view.draw();const t=new k.Raster;t.position.x=$/2,t.position.y=$/2,t.width=$,t.height=$,w(M,r=>{for(let n=0;n<$;n++)for(let a=0;a<$;a++)t.setPixel(n,a,`hsl(0,0%,${(X((n-$/2)/r,(a-$/2)/r)+1)*50}%)`)},{immediate:!0})}),ce(()=>{k.project.clear()});function e(t){M.value-=t.delta[1]/10}return(t,r)=>{const n=K("drag");return p(),m("div",Xe,[c("div",{class:"absolute px-1 dark-bg-light-100 bg-dark-100 bg-opacity-20 dark-bg-opacity-20 -left-4 bottom-0 rounded-xl",style:z({height:f(M)/5+"%"})},[c("div",et,F(f(M).toFixed()),1)],4),T((p(),m("canvas",{class:"rounded-xl cursor-pointer flex-auto max-w-full",ref_key:"canvas",ref:o,width:$,height:$,"drag-options":{preventWindowScrollY:!0}},[(p(!0),m(U,null,Q(f(ee),a=>(p(),ue(Je,de({key:a,ref_for:!0},a),null,16))),128))])),[[n,e]])])}}},nt={class:"flex flex-wrap gap-6 items-stretch"},at={__name:"ambience",setup(i){return(o,e)=>(p(),m("div",nt,[x(tt),x(Ie,{class:"p-2 rounded-xl w-full shadow-xl bg-light-800 dark-bg-dark-200",style:{flex:"1 1 320px"}}),x(ze,{class:"p-2 rounded-xl w-full shadow-xl bg-light-800 dark-bg-dark-200",style:{flex:"1 1 320px"}}),x(He,{class:"p-2 rounded-xl w-full shadow-xl bg-light-800 dark-bg-dark-200",style:{flex:"1 1 320px"}})]))}},st=B(at,[["__scopeId","data-v-3a388877"]]),ut=JSON.parse('{"title":"Ambient drone box","description":"A generative instrument for creating meditative sound landscapes","frontmatter":{"title":"Ambient drone box","description":"A generative instrument for creating meditative sound landscapes","date":"2022-04-28T00:00:00.000Z","cover":"ambience.png","layout":"app"},"headers":[],"relativePath":"practice/generative/ambience/index.md","filePath":"practice/generative/ambience/index.md","lastUpdated":1725520089000}'),ot={name:"practice/generative/ambience/index.md"},dt=Object.assign(ot,{setup(i){return(o,e)=>{const t=ve("client-only");return p(),m("div",null,[x(t,null,{default:pe(()=>[x(st)]),_:1}),e[0]||(e[0]=c("h3",{id:"work-in-progress",tabindex:"-1"},[me("Work in progress "),c("a",{class:"header-anchor",href:"#work-in-progress","aria-label":'Permalink to "Work in progress"'},"​")],-1))])}}});export{ut as __pageData,dt as default};