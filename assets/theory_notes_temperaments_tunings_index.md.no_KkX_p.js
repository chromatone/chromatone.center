import{v as r,x as l,z as s,E as k,c as x,r as C,b as P,F as m,A as p,L as g,D as z,W as N,q as A,a1 as j}from"./chunks/framework.BG7tPuiF.js";import{w as q,n as B,h as _,b as L,p as $,c as M,e as O,at as b}from"./chunks/theme.C_pcXyVd.js";const E=["id","d","transform"],F={fill:"currentColor","font-size":"24px"},S=["xlink:href","startOffset"],D={__name:"TuningText",props:{size:{type:Number,default:24},text:{type:String,default:"Circle text"},w:{type:Number,default:1e3},r:{type:Number,default:450},offset:{type:Number,default:3}},setup(e){return(n,i)=>(r(),l("g",null,[s("defs",null,[s("path",{id:`myTextPath${e.r}`,d:`M ${e.r},0 A ${e.r},${e.r} 0 0 1 -${e.r},0 A ${e.r},${e.r} 0 0 1 ${e.r},0`,transform:`translate(${e.w/2},${e.w/2}), rotate(-90)`,fill:"none",stroke:"darkblue","stroke-width":"2"},null,8,E)]),s("text",F,[s("textPath",{"xlink:href":`#myTextPath${e.r}`,startOffset:`${e.offset}%`},k(e.text),9,S)])]))}},H=["opacity"],V=["stroke","x1","y1","x2","y2"],W=["cx","cy","fill"],J=["cx","cy","fill"],R=["x","y","innerHTML"],U=["x","y"],Y={__name:"TuningNote",props:{r:{type:Number,default:10},w:{type:Number,default:10},note:{type:Object,default:()=>{}},inner:{type:Number,default:150},level:{type:Number,default:3}},setup(e){const n=e,i=x(()=>q(B(n.note.pitch,n.level)).toHex()),d=C(!1);function h(){d.value=!d.value,d.value?L($(n.note.pitch)):M($(n.note.pitch))}const o=x(()=>_(n.note.pitch,12,n.r,n.w)),c=x(()=>_(n.note.pitch,12,n.inner,n.w));return(w,y)=>(r(),l("g",{class:"tet",style:{cursor:"pointer",transition:"all 200ms ease-in-out"},opacity:d.value?1:.75,onClick:y[0]||(y[0]=t=>h())},[s("line",{stroke:i.value,"stroke-width":2,x1:o.value.x,y1:o.value.y,x2:c.value.x,y2:c.value.y},null,8,V),s("circle",{class:"note",style:{"transform-box":"fill-box","transform-origin":"center center"},cx:o.value.x,cy:o.value.y,r:"36",fill:i.value},null,8,W),s("circle",{class:"note",style:{"transform-box":"fill-box","transform-origin":"center center"},cx:c.value.x,cy:c.value.y,r:"4",fill:i.value},null,8,J),s("text",{style:{"user-select":"none",transition:"all 300ms ease"},fill:"white","font-family":"Commissioner, sans-serif","font-size":"26px","font-weight":"bold","text-anchor":"middle","dominant-baseline":"middle",x:o.value.x,y:o.value.y,innerHTML:e.note.name},null,8,R),s("text",{style:{"user-select":"none",transition:"all 300ms ease"},fill:"currentColor","font-family":"Commissioner, sans-serif","font-size":"15px","font-weight":"normal","text-anchor":"middle","dominant-baseline":"middle",x:o.value.x,y:o.value.y+22},k((e.note.pitch*100).toFixed()),9,U)],8,H))}},Z={class:"w-full",id:"tuning-circle",version:"1.1",baseProfile:"full",viewBox:"0 -50 1000 1100",xmlns:"http://www.w3.org/2000/svg"},G=["r"],I={__name:"TuningCircle",setup(e){const n=[...O].map((t,v)=>({name:t,pitch:v})),i=[250,350,450,150],d={"12TET equal temperament":490,"5-limit just intonation":390,"Pythagorean tuning":290},h=P({middleA:440}),o={"1/1":1,"16/15":16/15,"9/8":9/8,"6/5":6/5,"5/4":5/4,"4/3":4/3,"45/32":45/32,"3/2":3/2,"8/5":8/5,"5/3":5/3,"9/5":9/5,"15/8":15/8},c=x(()=>Object.entries(o).map(t=>({pitch:b(t[1]*h.middleA),name:t[0]}))),w=[{two:0,three:0,inv:!1},{two:8,three:5,inv:!1},{two:3,three:2,inv:!0},{two:5,three:3,inv:!1},{two:6,three:4,inv:!0},{two:2,three:1,inv:!1},{two:9,three:6,inv:!0},{two:1,three:1,inv:!0},{two:7,three:4,inv:!1},{two:4,three:3,inv:!0},{two:4,three:2,inv:!1},{two:7,three:5,inv:!0}],y=x(()=>w.map((t,v)=>{if(v==0)return{pitch:0,name:"1/1"};let f=Math.pow(2,t.two)/Math.pow(3,t.three);return t.inv&&(f=1/f),{pitch:b(f*h.middleA),name:t.inv?`<tspan>3</tspan><tspan dy="-16" font-size="16px">${t.three}</tspan><tspan dy="16" dx="-5px">/2</tspan><tspan dy="-16" font-size="20px">${t.two}</tpsan>`:`<tspan>2</tspan><tspan dy="-16" font-size="20px">${t.two}</tspan><tspan dy="16" dx="-5px">/3</tspan><tspan dy="-16" font-size="20px">${t.three}</tspan>`}}));return(t,v)=>{const f=Y,T=D;return r(),l("svg",Z,[(r(),l(m,null,p(i,a=>s("circle",{key:a,cx:500,cy:500,r:a,stroke:"gray",fill:"none"},null,8,G)),64)),(r(!0),l(m,null,p(z(n),(a,u)=>(r(),g(f,{key:u,r:i[2],w:1e3,note:a},null,8,["r","note"]))),128)),(r(!0),l(m,null,p(c.value,(a,u)=>(r(),g(f,{key:u,r:i[1],w:1e3,level:2,note:a},null,8,["r","note"]))),128)),(r(!0),l(m,null,p(y.value,(a,u)=>(r(),g(f,{key:u,r:i[0],w:1e3,level:1,note:a},null,8,["r","note"]))),128)),(r(),l(m,null,p(d,(a,u)=>N(T,{key:u,r:a,text:u,offset:0},null,8,["r","text"])),64))])}}},K="/assets/et-limits.iNklbetL.svg",oe=JSON.parse('{"title":"Tunings comparison","description":"Ways to juxtapose and compare different tuning methods side by side","frontmatter":{"title":"Tunings comparison","description":"Ways to juxtapose and compare different tuning methods side by side","date":"2021-08-05T00:00:00.000Z","cover":"tuning-circle.svg"},"headers":[],"relativePath":"theory/notes/temperaments/tunings/index.md","filePath":"theory/notes/temperaments/tunings/index.md","lastUpdated":1719395822000}'),Q={name:"theory/notes/temperaments/tunings/index.md"},X=s("img",{src:K},null,-1),ee=s("h2",{id:"circle-of-tunings",tabindex:"-1"},[j("Circle of tunings "),s("a",{class:"header-anchor",href:"#circle-of-tunings","aria-label":'Permalink to "Circle of tunings"'},"​")],-1),te=s("p",null,"See and hear the slight differences between Pythagorean tunings, Just intonation and 12-TET. Click on the circle to start the note. Click again to stop it. You can hear the beatings between the same notes in various tunings and also hear the quality of the intervals in each of them.",-1);function ne(e,n,i,d,h,o){const c=I;return r(),l("div",null,[X,ee,te,N(c)])}const ie=A(Q,[["render",ne]]);export{oe as __pageData,ie as default};