import{q as x,v as c,x as p,z as r,G as w,E as f,b as S,u as h,c as m,D as o,H as _,Q as E,d as y,V as M,B as k,C,W as v,y as P,J as A,K as B,O,r as V,F as z,A as T,L as I,M as F,ak as R,$ as H,a4 as K}from"./chunks/framework.BG7tPuiF.js";import{au as L,az as U,aF as G,p as J,aA as Q,n as W,e as q,aG as Y,K as Z,g as j,_ as X}from"./chunks/theme.C_pcXyVd.js";const ee={class:"button"},te={class:"uppercase mr-1"},oe={__name:"PitchTableSwitch",props:{label:{type:String,default:""},state:{type:Boolean,default:!1}},setup(a){return(s,t)=>(c(),p("div",ee,[r("div",{class:"indicator mr-2",style:w({color:a.state?"#fff":"#333"})},"●",4),r("div",te,f(a.label),1)]))}},ae=x(oe,[["__scopeId","data-v-72378355"]]),e=S({show:{letters:h("table-letters",!0),bpm:h("table-bpm",!0),hz:h("table-hz",!0),len:h("table-len",!0)},stopped:!0,middleA:h("table-middleA",440),tuning:"equal",octave:{range:{bottom:h("table-bottom",1),top:h("table-top",4)},limit:{bottom:-6,top:8},list:m(()=>{let a=[];for(let s=e.octave.range.top;s>=e.octave.range.bottom;s--)a.push(s);return a}),inc:le,dec:se}});function se(a){let s=a?"top":"bottom",t=a?"bottom":"top";a&&e.octave.range[s]<=e.octave.range[t]||!a&&e.octave.range[s]<=e.octave.limit[s]||e.octave.range[s]--}function le(a){let s=a?"top":"bottom",t=a?"bottom":"top";a&&e.octave.range[s]>=e.octave.limit[s]||!a&&e.octave.range[s]>=e.octave.range[t]||e.octave.range[s]++}const ne={key:0,class:"flex flex-col text-xs p-1"},ce={key:0,class:"text-xl font-bold"},ie={key:1,class:"flex"},re={key:2,class:"flex"},pe={key:3,class:"flex"},de={__name:"PitchTableCellInfo",props:{name:{type:String,default:"A"},hz:{type:Number,default:440},octave:{default:3,type:Number}},setup(a){const s=a,t=m(()=>s.hz*60),d=m(()=>340/s.hz);function u(n){let l;return n>1e6?l=(n/1e6).toFixed(2)+" M":n>1e3?l=(n/1e3).toFixed(2)+" k":l=n.toFixed(2)+" ",l}return(n,l)=>o(e).show.len||o(e).show.hz||o(e).show.bpm||o(e).show.letters?(c(),p("div",ne,[o(e).show.letters?(c(),p("div",ce,f(a.name)+f(a.octave),1)):_("",!0),o(e).show.hz?(c(),p("div",ie,f(u(a.hz))+"hz",1)):_("",!0),o(e).show.len?(c(),p("div",re,f(d.value.toFixed(2))+" m",1)):_("",!0),o(e).show.bpm?(c(),p("div",pe,f(u(t.value))+"BPM",1)):_("",!0)])):_("",!0)}};function ue(a,s){const{channel:t}=L("table"),d=new U(0,-1/0).connect(t),u=new G({oscillator:{type:"sawtooth"},envelope:{attack:.5},filterEnvelope:{attack:.05}}).connect(d),n=S({vol:0,pan:50,started:!1,active:m(()=>n.vol>0),freq:m(()=>{let l=J(a,s,e.middleA);return u.oscillator.frequency.value=l,l})});return E(()=>{u.triggerRelease(),u.dispose()}),y(()=>n.vol,l=>{d.volume.targetRampTo(Q(l*.4/100),"16n")}),y(()=>n.pan,l=>{let i=(l-50)/100*2;d.pan.targetRampTo(i,"16n")}),y(()=>e.stopped,l=>{l&&(n.vol=0,n.pan=50)}),y(()=>n.active,l=>{l?(e.stopped&&(e.stopped=!1),u.triggerAttack(n.freq)):u.triggerRelease()}),n}const ve=["drag-options"],_e={class:"absolute w-full h-full top-0 left-0 bottom-0"},he={class:"absolute h-full top-0 left-0 right-0 text-center"},me={__name:"PitchTableCell",props:{pitch:{type:Number,default:0},octave:{default:3,type:Number}},setup(a){const s=a,t=ue(s.pitch,s.octave),d=S({filterTaps:!0,preventWindowScrollY:!0,delay:0,eventOptions:{passive:!1}}),u=i=>{Y.state=="suspended"&&Z();let{movement:[b,g],tap:$}=i;$?t.active?(t.vol=0,t.pan=50):t.vol=50:(t.vol+=-g/20,t.vol>100&&(t.vol=100),t.vol<0&&(t.vol=0),t.pan+=b/20,t.pan>100&&(t.pan=100),t.pan<0&&(t.pan=0))},n=m(()=>W(s.pitch,s.octave)),l=m(()=>Math.abs(s.octave+2)*8>40?"hsla(0,0%,0%,"+(t.active?"1":"0.8")+")":"hsla(0,0%,100%,"+(t.active?"1":"0.8")+")");return(i,b)=>{const g=de,$=M("drag");return k((c(),p("div",{class:P(["cell",{active:o(t).active}]),"drag-options":d,style:w({backgroundColor:n.value,color:l.value})},[k(r("div",_e,[r("div",{class:"volume",style:w({height:o(t).vol+"%"})},null,4)],512),[[C,o(t).vol>0]]),k(r("div",he,[r("div",{class:"pan absolute bg-gray-100 h-full m-auto",style:w({left:o(t).pan+"%"})},null,4)],512),[[C,o(t).pan!=50]]),v(g,{name:o(q)[a.pitch],hz:o(t).freq,octave:a.octave},null,8,["name","hz","octave"])],14,ve)),[[$,u]])}}},fe=x(me,[["__scopeId","data-v-75b02e55"]]),N=a=>(A("data-v-7b6e39ea"),a=a(),B(),a),be={class:"flex text-2xl text-center cursor-pointer w-full"},ge=N(()=>r("div",{class:"i-la-minus"},null,-1)),xe=[ge],ye=N(()=>r("div",{class:"i-la-plus"},null,-1)),we=[ye],ke={__name:"PitchTableShift",props:{top:Boolean},setup(a){return(s,t)=>(c(),p("div",be,[o(e).octave.range.bottom!=o(e).octave.limit.bottom?(c(),p("div",{key:0,class:"btn bg-gray-300 dark-bg-gray-900",onClick:t[0]||(t[0]=d=>o(e).octave.dec(a.top))},xe)):_("",!0),o(e).octave.range.top!=o(e).octave.limit.top?(c(),p("div",{key:1,class:"btn bg-gray-50 dark-bg-gray-500",onClick:t[1]||(t[1]=d=>o(e).octave.inc(a.top))},we)):_("",!0)]))}},$e=x(ke,[["__scopeId","data-v-7b6e39ea"]]),D=a=>(A("data-v-5d35e128"),a=a(),B(),a),ze={class:"fullscreen-container",id:"screen"},Se={class:"flex flex-wrap"},Ce={class:"flex flex-col p-2",style:{flex:"10 1 6rem"}},Te={class:"flex-auto flex flex-wrap rounded-xl dark-bg-dark-700 shadow items-center p-2 gap-2 relative"},Ie={class:"flex px-2 rounded-lg items-center bg-light-300 dark-bg-dark-800"},Pe=D(()=>r("div",{class:"p-1 pr-2 font-bold"},"A",-1)),Ae=D(()=>r("div",{class:"p-1"},"Hz",-1)),Be={__name:"PitchTable",setup(a){return O("Enter",s=>{s.preventDefault(),e.stopped=!e.stopped}),V(),(s,t)=>{const d=$e,u=fe,n=X,l=ae;return c(),p(z,null,[r("div",ze,[v(d,{top:!0}),(c(!0),p(z,null,T(o(e).octave.list,i=>(c(),p("div",{class:"flex w-full",key:i},[(c(!0),p(z,null,T(o(q),(b,g)=>(c(),I(u,{key:b,class:P({dim:!o(j).isIn(b)}),pitch:g,octave:i},null,8,["class","pitch","octave"]))),128))]))),128)),v(d)]),r("div",Se,[v(n,{class:"mb-4 flex-auto",style:{flex:"1 1 2rem"}}),r("div",Ce,[r("div",Te,[v(l,{label:"letters",state:o(e).show.letters,onClick:t[0]||(t[0]=i=>o(e).show.letters=!o(e).show.letters)},null,8,["state"]),v(l,{label:"FREQ",state:o(e).show.hz,onClick:t[1]||(t[1]=i=>o(e).show.hz=!o(e).show.hz)},null,8,["state"]),v(l,{label:"Length",state:o(e).show.len,onClick:t[2]||(t[2]=i=>o(e).show.len=!o(e).show.len)},null,8,["state"]),v(l,{label:"BPM",state:o(e).show.bpm,onClick:t[3]||(t[3]=i=>o(e).show.bpm=!o(e).show.bpm)},null,8,["state"])]),v(R,{name:"fade"},{default:F(()=>[o(e).stopped?_("",!0):(c(),I(l,{key:0,class:"my-4",label:"STOP",state:o(e).stopped,onClick:t[4]||(t[4]=i=>o(e).stopped=!o(e).stopped)},null,8,["state"]))]),_:1}),r("div",Ie,[Pe,k(r("input",{class:"mx-1 p-2 max-w-26 dark-bg-dark-800","onUpdate:modelValue":t[5]||(t[5]=i=>o(e).middleA=i),type:"number"},null,512),[[H,o(e).middleA]]),Ae])])])],64)}}},Fe=x(Be,[["__scopeId","data-v-5d35e128"]]),Me=JSON.parse('{"title":"Table","description":"Every possible note in a huge expandable table","frontmatter":{"title":"Table","description":"Every possible note in a huge expandable table","layout":"app","cover":"table.png","date":"2022-06-02T00:00:00.000Z"},"headers":[],"relativePath":"practice/pitch/table/index.md","filePath":"practice/pitch/table/index.md","lastUpdated":1719395822000}'),qe={name:"practice/pitch/table/index.md"};function Ne(a,s,t,d,u,n){const l=Fe,i=K("client-only");return c(),p("div",null,[v(i,null,{default:F(()=>[v(l)]),_:1})])}const Oe=x(qe,[["render",Ne]]);export{Me as __pageData,Oe as default};