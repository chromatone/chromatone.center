import{Z as I,a_ as N,aL as M,aG as R,a$ as V,c as D,n as B,b8 as O,aH as E,g as H,l as L}from"./theme.DvVY4vau.js";import{b as z,u as f,c as m,_ as w,f as c,g as d,l as s,h as i,q as v,p as x,m as h,K,d as _,P as U,k as y,v as S,R as u,n as q,H as j,r as G,F as $,j as T,z as P,A as Q,am as W,ag as Y}from"./framework.BX1Y-ISu.js";const t=z({show:{letters:f("table-letters",!0),bpm:f("table-bpm",!0),hz:f("table-hz",!0),len:f("table-len",!0)},stopped:!0,middleA:f("table-middleA",440),tuning:"equal",octave:{range:{bottom:f("table-bottom",1),top:f("table-top",4)},limit:{bottom:-6,top:8},list:m(()=>{let o=[];for(let a=t.octave.range.top;a>=t.octave.range.bottom;a--)o.push(a);return o}),inc:J,dec:Z}});function Z(o){let a=o?"top":"bottom",e=o?"bottom":"top";o&&t.octave.range[a]<=t.octave.range[e]||!o&&t.octave.range[a]<=t.octave.limit[a]||t.octave.range[a]--}function J(o){let a=o?"top":"bottom",e=o?"bottom":"top";o&&t.octave.range[a]>=t.octave.limit[a]||!o&&t.octave.range[a]>=t.octave.range[e]||t.octave.range[a]++}const X={class:"flex text-2xl text-center cursor-pointer w-full"},ee={__name:"PitchTableShift",props:{top:Boolean},setup(o){return(a,e)=>(c(),d("div",X,[s(t).octave.range.bottom!=s(t).octave.limit.bottom?(c(),d("div",{key:0,class:"btn bg-gray-300 dark-bg-gray-900",onClick:e[0]||(e[0]=p=>s(t).octave.dec(o.top))},e[2]||(e[2]=[i("div",{class:"i-la-minus"},null,-1)]))):v("",!0),s(t).octave.range.top!=s(t).octave.limit.top?(c(),d("div",{key:1,class:"btn bg-gray-50 dark-bg-gray-500",onClick:e[1]||(e[1]=p=>s(t).octave.inc(o.top))},e[3]||(e[3]=[i("div",{class:"i-la-plus"},null,-1)]))):v("",!0)]))}},A=w(ee,[["__scopeId","data-v-d639d554"]]),te={class:"button"},se={class:"uppercase mr-1"},oe={__name:"PitchTableSwitch",props:{label:{type:String,default:""},state:{type:Boolean,default:!1}},setup(o){return(a,e)=>(c(),d("div",te,[i("div",{class:"indicator mr-2",style:x({color:o.state?"#fff":"#333"})},"●",4),i("div",se,h(o.label),1)]))}},b=w(oe,[["__scopeId","data-v-59035f98"]]);function ae(o,a){const{channel:e}=I("table"),p=new N(0,-1/0).connect(e),l=new M({oscillator:{type:"sawtooth"},envelope:{attack:.5},filterEnvelope:{attack:.05}}).connect(p),n=z({vol:0,pan:50,started:!1,active:m(()=>n.vol>0),freq:m(()=>{let r=R(o,a,t.middleA);return l.oscillator.frequency.value=r,r})});return K(()=>{l.triggerRelease(),l.dispose()}),_(()=>n.vol,r=>{p.volume.targetRampTo(V(r*.4/100),"16n")}),_(()=>n.pan,r=>{let g=(r-50)/100*2;p.pan.targetRampTo(g,"16n")}),_(()=>t.stopped,r=>{r&&(n.vol=0,n.pan=50)}),_(()=>n.active,r=>{r?(t.stopped&&(t.stopped=!1),l.triggerAttack(n.freq)):l.triggerRelease()}),n}const le={key:0,class:"flex flex-col text-xs p-1"},ne={key:0,class:"text-xl font-bold"},re={key:1,class:"flex"},ie={key:2,class:"flex"},ce={key:3,class:"flex"},de={__name:"PitchTableCellInfo",props:{name:{type:String,default:"A"},hz:{type:Number,default:440},octave:{default:3,type:Number}},setup(o){const a=o,e=m(()=>a.hz*60),p=m(()=>340/a.hz);function l(n){let r;return n>1e6?r=(n/1e6).toFixed(2)+" M":n>1e3?r=(n/1e3).toFixed(2)+" k":r=n.toFixed(2)+" ",r}return(n,r)=>s(t).show.len||s(t).show.hz||s(t).show.bpm||s(t).show.letters?(c(),d("div",le,[s(t).show.letters?(c(),d("div",ne,h(o.name)+h(o.octave),1)):v("",!0),s(t).show.hz?(c(),d("div",re,h(l(o.hz))+"hz",1)):v("",!0),s(t).show.len?(c(),d("div",ie,h(p.value.toFixed(2))+" m",1)):v("",!0),s(t).show.bpm?(c(),d("div",ce,h(l(e.value))+"BPM",1)):v("",!0)])):v("",!0)}},pe=["drag-options"],ue={class:"absolute w-full h-full top-0 left-0 bottom-0"},ve={class:"absolute h-full top-0 left-0 right-0 text-center"},fe={__name:"PitchTableCell",props:{pitch:{type:Number,default:0},octave:{default:3,type:Number}},setup(o){const a=o,e=ae(a.pitch,a.octave),p=z({filterTaps:!0,preventWindowScrollY:!0,delay:0,eventOptions:{passive:!1}}),l=g=>{O.state=="suspended"&&E();let{movement:[C,k],tap:F}=g;F?e.active?(e.vol=0,e.pan=50):e.vol=50:(e.vol+=-k/20,e.vol>100&&(e.vol=100),e.vol<0&&(e.vol=0),e.pan+=C/20,e.pan>100&&(e.pan=100),e.pan<0&&(e.pan=0))},n=m(()=>D(a.pitch,a.octave)),r=m(()=>Math.abs(a.octave+2)*8>40?"hsla(0,0%,0%,"+(e.active?"1":"0.8")+")":"hsla(0,0%,100%,"+(e.active?"1":"0.8")+")");return(g,C)=>{const k=U("drag");return y((c(),d("div",{class:q(["cell",{active:s(e).active}]),"drag-options":p,style:x({backgroundColor:n.value,color:r.value})},[y(i("div",ue,[i("div",{class:"volume",style:x({height:s(e).vol+"%"})},null,4)],512),[[S,s(e).vol>0]]),y(i("div",ve,[i("div",{class:"pan absolute bg-gray-100 h-full m-auto",style:x({left:s(e).pan+"%"})},null,4)],512),[[S,s(e).pan!=50]]),u(de,{name:s(B)[o.pitch],hz:s(e).freq,octave:o.octave},null,8,["name","hz","octave"])],14,pe)),[[k,l]])}}},me=w(fe,[["__scopeId","data-v-f9872ed5"]]),he={class:"fullscreen-container",id:"screen"},be={class:"flex flex-wrap"},ge={class:"flex flex-col p-2",style:{flex:"10 1 6rem"}},_e={class:"flex-auto flex flex-wrap rounded-xl dark-bg-dark-700 shadow items-center p-2 gap-2 relative"},xe={class:"flex px-2 rounded-lg items-center bg-light-300 dark-bg-dark-800"},ye={__name:"PitchTable",setup(o){return j("Enter",a=>{a.preventDefault(),t.stopped=!t.stopped}),G(),(a,e)=>{const p=L;return c(),d($,null,[i("div",he,[u(A,{top:!0}),(c(!0),d($,null,T(s(t).octave.list,l=>(c(),d("div",{class:"flex w-full",key:l},[(c(!0),d($,null,T(s(B),(n,r)=>(c(),P(me,{key:n,class:q({dim:!s(H).isIn(n)}),pitch:r,octave:l},null,8,["class","pitch","octave"]))),128))]))),128)),u(A)]),i("div",be,[u(p,{class:"mb-4 flex-auto",style:{flex:"1 1 2rem"}}),i("div",ge,[i("div",_e,[u(b,{label:"letters",state:s(t).show.letters,onClick:e[0]||(e[0]=l=>s(t).show.letters=!s(t).show.letters)},null,8,["state"]),u(b,{label:"FREQ",state:s(t).show.hz,onClick:e[1]||(e[1]=l=>s(t).show.hz=!s(t).show.hz)},null,8,["state"]),u(b,{label:"Length",state:s(t).show.len,onClick:e[2]||(e[2]=l=>s(t).show.len=!s(t).show.len)},null,8,["state"]),u(b,{label:"BPM",state:s(t).show.bpm,onClick:e[3]||(e[3]=l=>s(t).show.bpm=!s(t).show.bpm)},null,8,["state"])]),u(W,{name:"fade"},{default:Q(()=>[s(t).stopped?v("",!0):(c(),P(b,{key:0,class:"my-4",label:"STOP",state:s(t).stopped,onClick:e[4]||(e[4]=l=>s(t).stopped=!s(t).stopped)},null,8,["state"]))]),_:1}),i("div",xe,[e[6]||(e[6]=i("div",{class:"p-1 pr-2 font-bold"},"A",-1)),y(i("input",{class:"mx-1 p-2 max-w-26 dark-bg-dark-800","onUpdate:modelValue":e[5]||(e[5]=l=>s(t).middleA=l),type:"number"},null,512),[[Y,s(t).middleA]]),e[7]||(e[7]=i("div",{class:"p-1"},"Hz",-1))])])])],64)}}},$e=w(ye,[["__scopeId","data-v-224898d5"]]);export{$e as default};