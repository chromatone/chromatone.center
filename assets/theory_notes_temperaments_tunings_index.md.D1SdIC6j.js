import{H as q,aI as A,Z as M,aJ as S,a1 as j,a6 as B,aK as L,aL as F,an as H,aM as O,w as V,c as D,q as $,aH as k,n as E,aA as C}from"./chunks/theme.B-lyZe0u.js";import{b as g,u as T,a9 as J,c as y,r as R,f as o,g as c,h as r,m as N,F as h,j as p,B as w,l as W,V as P,_ as I,ae as Z}from"./chunks/framework.B7TlvOs3.js";const K=["+0","@8n","@16n","@32n"],e={state:g({midi:T("synth-midi",!0),initiated:!1,mute:!1,quantize:J(K,{initialValue:"+0"}),volume:q(1,0,2)}),delayParams:g({feedback:.3,wet:.3}),params:g({maxPolyphony:50,oscillator:{type:T("synth-osc","sawtooth8")},volume:-20,envelope:{attack:.01,decay:.1,sustain:.6,release:1},filterEnvelope:{attack:.001,decay:.7,sustain:.5,release:1,baseFrequency:60,octaves:5}}),poly:null,widener:null,delay:null,reverb:null,pan:null,compressor:null};function z(){if(A(),e!=null&&e.poly)return;const{channel:t}=M("synth");e.widener=new S(.7).connect(t),e.reverb=new j(3).connect(e.widener),e.delay=new B({delayTime:"16n",feedback:.3,wet:.3,maxDelay:"1m"}).connect(e.widener),e.pan=new L({frequency:"4n",depth:.4}).connect(e.reverb).connect(e.delay).connect(e.widener),e.compressor=new F().connect(e.pan),e.poly=new H(O,e.params).connect(e.compressor),e.pan.start()}function U(t,n){if(!e.poly||e.state.mute)return z();e.poly.triggerAttack(t,e.state.quantize.state,n)}function Y(t){if(!e.poly||e.state.mute)return z();e.poly.triggerRelease(t,e.state.quantize.state)}const G=["opacity"],Q=["stroke","x1","y1","x2","y2"],X=["cx","cy","fill"],ee=["cx","cy","fill"],te=["x","y","innerHTML"],ne=["x","y"],b={__name:"TuningNote",props:{r:{type:Number,default:10},w:{type:Number,default:10},note:{type:Object,default:()=>{}},inner:{type:Number,default:150},level:{type:Number,default:3}},setup(t){const n=t,l=y(()=>V(D(n.note.pitch,n.level)).toHex()),f=R(!1);function m(){f.value=!f.value,f.value?U(k(n.note.pitch)):Y(k(n.note.pitch))}const i=y(()=>$(n.note.pitch,12,n.r,n.w)),u=y(()=>$(n.note.pitch,12,n.inner,n.w));return(_,x)=>(o(),c("g",{class:"tet",style:{cursor:"pointer",transition:"all 200ms ease-in-out"},opacity:f.value?1:.75,onClick:x[0]||(x[0]=a=>m())},[r("line",{stroke:l.value,"stroke-width":2,x1:i.value.x,y1:i.value.y,x2:u.value.x,y2:u.value.y},null,8,Q),r("circle",{class:"note",style:{"transform-box":"fill-box","transform-origin":"center center"},cx:i.value.x,cy:i.value.y,r:"36",fill:l.value},null,8,X),r("circle",{class:"note",style:{"transform-box":"fill-box","transform-origin":"center center"},cx:u.value.x,cy:u.value.y,r:"4",fill:l.value},null,8,ee),r("text",{style:{"user-select":"none",transition:"all 300ms ease"},fill:"white","font-family":"Commissioner, sans-serif","font-size":"26px","font-weight":"bold","text-anchor":"middle","dominant-baseline":"middle",x:i.value.x,y:i.value.y,innerHTML:t.note.name},null,8,te),r("text",{style:{"user-select":"none",transition:"all 300ms ease"},fill:"currentColor","font-family":"Commissioner, sans-serif","font-size":"15px","font-weight":"normal","text-anchor":"middle","dominant-baseline":"middle",x:i.value.x,y:i.value.y+22},N((t.note.pitch*100).toFixed()),9,ne)],8,G))}},ae=["id","d","transform"],se={fill:"currentColor","font-size":"24px"},re=["xlink:href","startOffset"],oe={__name:"TuningText",props:{size:{type:Number,default:24},text:{type:String,default:"Circle text"},w:{type:Number,default:1e3},r:{type:Number,default:450},offset:{type:Number,default:3}},setup(t){return(n,l)=>(o(),c("g",null,[r("defs",null,[r("path",{id:`myTextPath${t.r}`,d:`M ${t.r},0 A ${t.r},${t.r} 0 0 1 -${t.r},0 A ${t.r},${t.r} 0 0 1 ${t.r},0`,transform:`translate(${t.w/2},${t.w/2}), rotate(-90)`,fill:"none",stroke:"darkblue","stroke-width":"2"},null,8,ae)]),r("text",se,[r("textPath",{"xlink:href":`#myTextPath${t.r}`,startOffset:`${t.offset}%`},N(t.text),9,re)])]))}},ie={class:"w-full",id:"tuning-circle",version:"1.1",baseProfile:"full",viewBox:"0 -50 1000 1100",xmlns:"http://www.w3.org/2000/svg"},le=["r"],ce={__name:"TuningCircle",setup(t){const n=[...E].map((a,v)=>({name:a,pitch:v})),l=[250,350,450,150],f={"12TET equal temperament":490,"5-limit just intonation":390,"Pythagorean tuning":290},m=g({middleA:440}),i={"1/1":1,"16/15":16/15,"9/8":9/8,"6/5":6/5,"5/4":5/4,"4/3":4/3,"45/32":45/32,"3/2":3/2,"8/5":8/5,"5/3":5/3,"9/5":9/5,"15/8":15/8},u=y(()=>Object.entries(i).map(a=>({pitch:C(a[1]*m.middleA),name:a[0]}))),_=[{two:0,three:0,inv:!1},{two:8,three:5,inv:!1},{two:3,three:2,inv:!0},{two:5,three:3,inv:!1},{two:6,three:4,inv:!0},{two:2,three:1,inv:!1},{two:9,three:6,inv:!0},{two:1,three:1,inv:!0},{two:7,three:4,inv:!1},{two:4,three:3,inv:!0},{two:4,three:2,inv:!1},{two:7,three:5,inv:!0}],x=y(()=>_.map((a,v)=>{if(v==0)return{pitch:0,name:"1/1"};let s=Math.pow(2,a.two)/Math.pow(3,a.three);return a.inv&&(s=1/s),{pitch:C(s*m.middleA),name:a.inv?`<tspan>3</tspan><tspan dy="-16" font-size="16px">${a.three}</tspan><tspan dy="16" dx="-5px">/2</tspan><tspan dy="-16" font-size="20px">${a.two}</tpsan>`:`<tspan>2</tspan><tspan dy="-16" font-size="20px">${a.two}</tspan><tspan dy="16" dx="-5px">/3</tspan><tspan dy="-16" font-size="20px">${a.three}</tspan>`}}));return(a,v)=>(o(),c("svg",ie,[(o(),c(h,null,p(l,s=>r("circle",{key:s,cx:500,cy:500,r:s,stroke:"gray",fill:"none"},null,8,le)),64)),(o(!0),c(h,null,p(W(n),(s,d)=>(o(),w(b,{key:d,r:l[2],w:1e3,note:s},null,8,["r","note"]))),128)),(o(!0),c(h,null,p(u.value,(s,d)=>(o(),w(b,{key:d,r:l[1],w:1e3,level:2,note:s},null,8,["r","note"]))),128)),(o(!0),c(h,null,p(x.value,(s,d)=>(o(),w(b,{key:d,r:l[0],w:1e3,level:1,note:s},null,8,["r","note"]))),128)),(o(),c(h,null,p(f,(s,d)=>P(oe,{key:d,r:s,text:d,offset:0},null,8,["r","text"])),64))]))}},ue="/assets/et-limits.iNklbetL.svg",ve=JSON.parse('{"title":"Tunings comparison","description":"Ways to juxtapose and compare different tuning methods side by side","frontmatter":{"title":"Tunings comparison","description":"Ways to juxtapose and compare different tuning methods side by side","date":"2021-08-05T00:00:00.000Z","cover":"tuning-circle.svg"},"headers":[],"relativePath":"theory/notes/temperaments/tunings/index.md","filePath":"theory/notes/temperaments/tunings/index.md","lastUpdated":1725283166000}'),de={name:"theory/notes/temperaments/tunings/index.md"},fe=r("img",{src:ue},null,-1),me=r("h2",{id:"circle-of-tunings",tabindex:"-1"},[Z("Circle of tunings "),r("a",{class:"header-anchor",href:"#circle-of-tunings","aria-label":'Permalink to "Circle of tunings"'},"​")],-1),he=r("p",null,"See and hear the slight differences between Pythagorean tunings, Just intonation and 12-TET. Click on the circle to start the note. Click again to stop it. You can hear the beatings between the same notes in various tunings and also hear the quality of the intervals in each of them.",-1);function pe(t,n,l,f,m,i){const u=ce;return o(),c("div",null,[fe,me,he,P(u)])}const ge=I(de,[["render",pe]]);export{ve as __pageData,ge as default};