import{B as N,r as y,g as B,a as k,b as v,d as S,n as w,C as W}from"./theme.BwIdyTJj.js";import{q as $,Q as I,v as M,R as A,b as D,c as l,x as o,y as r,A as i,G as u,E as _,F as h,B as m,z as j,I as C,H as E}from"./framework.BR0mAPCP.js";const F={key:0,class:"flex gap-1 p-2 text-lg"},V={class:"font-bold"},q=["onClick"],G=["viewBox"],H={id:"fretboard"},L=["x2"],P=["x1","y1","y2"],Q=["cy","cx"],R={id:"strings"},T=["transform"],J=["y2"],K=["transform"],O=["opacity","r","fill"],U=["opacity"],X={__name:"ChordTab",props:I({title:{type:Boolean,default:!0},chroma:{type:String,default:"100000000000"},pitch:{type:Number,default:0},chordNotes:{type:Array,default:[]}},{instrument:{default:"guitar"},instrumentModifiers:{}}),emits:["update:instrument"],setup(d){const{isDark:b}=M(),s=d,f=A(d,"instrument"),g={guitar:[7,0,5,10,2,7],ukulele:[10,3,7,0]},z=[3,5,7,10,12,15,17,19,21],t=D({strings:l(()=>g[f.value]),height:l(()=>(t.strings.length-1)*t.noteSize),width:l(()=>t.fretNum*t.fretWidth),isInChord:l(()=>N(s.chordNotes)),chroma:l(()=>y(s.chroma.split(""),-s.pitch)),scale:l(()=>y(B.chroma.split(""),-s.pitch)),title:l(()=>{var p,n;return(p=k(s.chroma))!=null&&p.empty?(n=v(s.chroma))!=null&&n.empty?"":v(s.chroma):k(s.chroma).aliases[0]}),noteSize:40,fretWidth:50,fretNum:7,color:l(()=>S(y(s.chroma.split(""),-s.pitch).join(""),s.pitch,.3,b.value?4:12))});return(p,n)=>(o(),r("div",{class:"flex flex-col justify-center rounded-3xl py-2",style:E({backgroundColor:t.color.lch})},[d.title?(o(),r("div",F,[i("div",V,u(_(w)[d.pitch])+u(t.title),1),n[0]||(n[0]=i("div",{class:"flex-1"},null,-1)),(o(),r(h,null,m(g,(e,a)=>i("div",{class:j(["p-0 capitalize active-op-100 transition",{[a==f.value?"op-100":"op-40"]:!0}]),onClick:x=>f.value=a},u(a),11,q)),64))])):C("",!0),(o(),r("svg",{class:"max-h-3xl w-full my-2",id:"fretboard",version:"1.1",baseProfile:"full",viewBox:`-50 -50 ${t.height+100} ${t.width+60}`,xmlns:"http://www.w3.org/2000/svg","font-family":"Commissioner, sans-serif","font-size":"20px","text-anchor":"middle","dominant-baseline":"middle"},[i("g",H,[i("line",{stroke:"currentColor","stroke-width":"10",x1:"0",x2:t.height},null,8,L),(o(!0),r(h,null,m(t.fretNum,e=>(o(),r("g",{class:"fret",key:e},[i("line",{x1:t.height,y1:e*t.fretWidth,y2:e*t.fretWidth,stroke:"currentColor","stroke-width":"2",opacity:"0.5"},null,8,P),z.find(a=>a==e)?(o(),r("circle",{key:0,class:"inlay",cy:(e-.5)*t.fretWidth,cx:t.height/2,r:"5",opacity:"0.8",fill:"currentColor"},null,8,Q)):C("",!0)]))),128))]),i("g",R,[(o(!0),r(h,null,m(t.strings,(e,a)=>(o(),r("g",{class:"string",key:e,transform:`translate(${a*t.noteSize} 0)`},[i("line",{y2:t.width,"stroke-width":"4",stroke:"currentColor",opacity:"0.5"},null,8,J),(o(!0),r(h,null,m(t.fretNum+1,(x,c)=>(o(),r("g",{class:"note",key:x,transform:`translate(0 ${(c-.5)*t.fretWidth})`},[i("circle",{opacity:t.chroma[(c+e)%12]==1?1:0,r:t.noteSize/2-4,fill:_(W)(e+c,2)},null,8,O),i("text",{y:"2",opacity:t.chroma[(c+e)%12]==1?1:0,fill:"white","font-size":"18","font-weight":"bold"},u(_(w)[(c+e)%12]),9,U)],8,K))),128))],8,T))),128))])],8,G))],4))}},tt=$(X,[["__scopeId","data-v-22c600ee"]]);export{tt as _};