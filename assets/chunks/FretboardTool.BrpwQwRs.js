import{_ as F,u as I,b as N,d as U,c as p,f as o,g as i,h as s,k as v,D as V,l as n,F as u,j as d,m,ah as b,z as D,A as M}from"./framework.B7TlvOs3.js";import{N as w,b5 as k,e as T,w as $,aB as j,b6 as q,b7 as A,b8 as E}from"./theme.B-lyZe0u.js";const _=x=>(D("data-v-81bfb780"),x=x(),M(),x),O={class:"flex flex-col"},G={class:"flex flex-wrap items-center m-auto"},H={class:"flex items-center px-4"},L=_(()=>s("div",{class:"text-xl"},"Instrument",-1)),P=["value"],J={class:"flex items-center px-4"},K=_(()=>s("div",{class:"text-xl"},"Scale length",-1)),Q=_(()=>s("div",{class:"text-xl"},"mm",-1)),R={class:"flex items-center px-4"},W=_(()=>s("div",{class:"text-xl"},"Frets",-1)),X={class:"flex flex-wrap"},Y=["viewBox"],Z=["x"],ee=["x1","x2"],te=["y1","y2","x2"],se=["x"],ne=["cx","cy"],le=["cx","cy"],oe=["cx","cy"],ie=["y1","y2","x2"],re=["y"],ae=["x","y"],ce=["onClick"],ue=["cx","fill"],de=["x"],me=["onClick"],xe=["cy","cx","fill"],fe=["x","y"],he={__name:"FretboardTool",props:{instruments:{type:Object,default:()=>{}}},setup(x){const C=x,t=I("instrument-calc",{l:430,frets:27,title:"Ukulele",tuning:["C4","G4","E4","A4"]}),S=N([]);function y(a,l,e){T(a),S[e]=a}U(()=>t.value.title,a=>{const l=C.instruments[a];t.value.l=l.l,t.value.frets=l.frets,t.value.tuning=l.tuning});const z=p(()=>[3,5,7,9,12,15,17,19,21].filter(a=>a<t.value.frets)),B=p(()=>[12,24].filter(a=>a<t.value.frets)),c=p(()=>{let a=[];for(let l=1;l<t.value.frets;l++)a.push(1-Math.pow(.9438743,l));return a});function g(a,l){return $(j(q(A(a,E(l))))).toHex()}return(a,l)=>(o(),i("div",O,[s("div",G,[s("div",H,[L,v(s("select",{class:"bg-transparent text-xl w-10rem m-2 p-2","onUpdate:modelValue":l[0]||(l[0]=e=>n(t).title=e)},[(o(!0),i(u,null,d(x.instruments,(e,r)=>(o(),i("option",{key:r,value:r},m(r),9,P))),128))],512),[[V,n(t).title]])]),s("div",J,[K,v(s("input",{class:"bg-transparent text-2xl w-5rem m-2 p-2","onUpdate:modelValue":l[1]||(l[1]=e=>n(t).l=e),type:"number",inputmode:"numeric",pattern:"[0-9]*"},null,512),[[b,n(t).l]]),Q]),s("div",R,[W,v(s("input",{class:"bg-transparent text-2xl w-4rem m-2 p-2","onUpdate:modelValue":l[2]||(l[2]=e=>n(t).frets=e),type:"number",inputmode:"numeric",pattern:"[0-9]*"},null,512),[[b,n(t).frets]])])]),s("div",X,[(o(),i("svg",{class:"flex-1 max-h-3xl w-full strings",id:"fretboard",version:"1.1",baseProfile:"full",viewBox:`0 -60 ${n(t).tuning.length*40+100} 1100`,xmlns:"http://www.w3.org/2000/svg"},[s("text",{style:{"user-select":"none",transition:"all 300ms ease"},fill:"currentColor","font-family":"Commissioner, sans-serif","font-size":"16px","font-weight":"bold","text-anchor":"middle","dominant-baseline":"middle",x:(n(t).tuning.length*40+65)/2,y:-40},m(n(t).title),9,Z),(o(!0),i(u,null,d(n(t).tuning,(e,r)=>(o(),i("line",{class:"string",key:e,stroke:"currentColor","stroke-width":"1","stroke-linecap":"round",y1:0,x1:40*r+50,y2:1e3,x2:40*r+50},null,8,ee))),128)),(o(),i(u,null,d([0,1e3],e=>s("line",{class:"end",key:e,stroke:"currentColor","stroke-width":"2","stroke-linecap":"round",y1:e,x1:10,y2:e,x2:n(t).tuning.length*40+55},null,8,te)),64)),s("text",{style:{"user-select":"none",transition:"all 300ms ease"},fill:"currentColor","font-family":"Commissioner, sans-serif","font-size":"10px","font-weight":"normal","text-anchor":"left","dominant-baseline":"middle",x:n(t).tuning.length*40+20,y:990},m(n(t).l)+" mm",9,se),(o(!0),i(u,null,d(z.value,e=>(o(),i("circle",{class:"inlay",key:e,fill:"currentColor",cx:(n(t).tuning.length*40+60)/2,cy:c.value[e-1]*1e3-(c.value[e-1]*1e3-c.value[e-2]*1e3)/2,r:4},null,8,ne))),128)),(o(!0),i(u,null,d(B.value,e=>(o(),i("g",{key:e},[s("circle",{class:"inlay",fill:"currentColor",cx:(n(t).tuning.length*40+60)/2-5,cy:c.value[e-1]*1e3-(c.value[e-1]*1e3-c.value[e-2]*1e3)/2,r:4},null,8,le),s("circle",{class:"inlay",fill:"currentColor",cx:(n(t).tuning.length*40+60)/2+5,cy:c.value[e-1]*1e3-(c.value[e-1]*1e3-c.value[e-2]*1e3)/2,r:4},null,8,oe)]))),128)),(o(!0),i(u,null,d(c.value,(e,r)=>(o(),i("g",{class:"fret",key:e},[s("line",{stroke:"gray","stroke-width":"1","stroke-linecap":"round",y1:e*1e3,x1:20,y2:e*1e3,x2:n(t).tuning.length*40+40},null,8,ie),s("text",{style:{"user-select":"none",transition:"all 300ms ease"},fill:"currentColor","font-family":"Commissioner, sans-serif","font-size":"10px","font-weight":"normal","text-anchor":"middle","dominant-baseline":"middle",x:24,y:e*1e3-8},m(r+1),9,re),s("text",{style:{"user-select":"none",transition:"all 300ms ease"},fill:"currentColor","font-family":"Commissioner, sans-serif","font-size":"10px","font-weight":"normal","text-anchor":"left","dominant-baseline":"middle",x:n(t).tuning.length*40+30,y:e*1e3-8},m((e*n(t).l).toFixed(2))+" mm",9,ae)]))),128)),(o(!0),i(u,null,d(n(t).tuning,(e,r)=>(o(),i("g",{class:"note",key:e},[s("g",{onClick:f=>y(e,0,r)},[s("circle",{cy:-12,cx:r*40+50,r:12,fill:g(e,0)},null,8,ue),s("text",{style:{"user-select":"none",transition:"all 300ms ease"},fill:"white","font-family":"Commissioner, sans-serif","font-size":"10px","font-weight":"bold","text-anchor":"middle","dominant-baseline":"middle",x:r*40+50,y:-11},m(e),9,de)],8,ce),(o(!0),i(u,null,d(c.value,(f,h)=>(o(),i("g",{class:"note",key:f,onClick:_e=>y(n(w).transpose(e,n(k).fromSemitones(h+1)),h,r)},[s("circle",{cy:f*1e3-12,cx:r*40+50,r:12,fill:g(e,h+1)},null,8,xe),s("text",{style:{"user-select":"none",transition:"all 300ms ease"},fill:"white","font-family":"Commissioner, sans-serif","font-size":"10px","font-weight":"bold","text-anchor":"middle","dominant-baseline":"middle",x:r*40+50,y:f*1e3-11},m(n(w).transpose(e,n(k).fromSemitones(h+1))),9,fe)],8,me))),128))]))),128))],8,Y))])]))}},ye=F(he,[["__scopeId","data-v-81bfb780"]]);export{ye as default};