import{R as D,T as N,U as R,V as F,W as B,e as w,F as y,X as P}from"./chunks/theme.B-lyZe0u.js";import{b as v,c as x,d as S,f as a,g as c,h as e,m as r,l as s,F as b,j as $,ae as V,_ as q,V as M,C as O,a2 as E}from"./chunks/framework.B7TlvOs3.js";const U={class:"flex flex-col"},W={class:"text-2xl"},j={class:"flex flex-wrap"},z={key:0,class:"i-la-circle"},J={key:1,class:"i-mdi-checkbox-blank-circle"},L={key:0,class:"i-la-play"},Q={key:1,class:"i-la-pause"},X=e("div",{class:"i-la-stop"},null,-1),Z=[X],A=e("div",{class:"i-la-trash-alt"},null,-1),G=[A],H=e("div",{class:"i-la-plus"},null,-1),K=[H],Y={class:"p-1"},ee=e("div",{class:"i-la-minus"},null,-1),te=[ee],se=e("div",{class:"p-1"},"/",-1),oe=e("div",{class:"i-la-plus"},null,-1),ie=[oe],ne={class:"p-1"},le=e("div",{class:"i-la-minus"},null,-1),re=[le],ae={class:"flex flex-col"},ce=["viewBox"],de=["width","height"],ue=["x1","x2","y2"],pe=["transform"],_e=["y2"],me={y:"3",x:"1","font-size":"2"},he={class:"flex text-xs p-4"},ve={class:"grid grid-cols-3 text-xs gap-2"},xe={__name:"MidiRows",setup(C){const g=D(),{midi:_}=N(),{seq:n}=R(null,1,"row"),d=F(),i=v({width:100,height:30,progress:x(()=>i.width*n.progress),recording:!1}),m=x(()=>n.meter.over*g.PPQ*4/n.meter.under),u=x(()=>d.ticks%m.value),I=new B((l,t)=>{console.log(t),w(y(t.midi,"midi").toNote())}).set({loop:!0,loopEnd:"800i",loopStart:0,playbackRate:1,probability:1}).start(0),h=v({}),k=v([]),{track:f,midiFile:fe}=T();S(()=>_.note,l=>{if(w(y(l.midi,"midi").toNote()),!(!i.recording||!d.playing))if(l.velocity>0)h[l.number]=u.value;else{const t=h==null?void 0:h[l.number],p=u.value;let o;p>t?o=p-t:o=m.value-t+p,k.push({ticks:u.value,midi:l.number,channel:l.channel,start:t,stop:p,duration:o}),I.add({time:u.value+"i",midi:l.number,duration:o})}});function T(){const l=new P.Midi;l.name="Chromatone recording";const t=l.addTrack();return{midiFile:l,track:t}}return(l,t)=>{var p;return a(),c("div",U,[e("div",W,"MIDI ROWS "+r(u.value)+"/"+r(m.value),1),e("div",j,[e("button",{onClick:t[0]||(t[0]=o=>i.recording=!i.recording)},[i.recording?(a(),c("div",J)):(a(),c("div",z))]),e("button",{onClick:t[1]||(t[1]=o=>s(d).playing=!s(d).playing)},[s(d).playing?(a(),c("div",Q)):(a(),c("div",L))]),e("button",{onClick:t[2]||(t[2]=o=>s(d).stopped=Date.now())},Z),e("button",{onClick:t[3]||(t[3]=o=>s(f).notes=[])},G),e("button",{onClick:t[4]||(t[4]=o=>s(n).meter.over++)},K),e("div",Y,r(s(n).meter.over),1),e("button",{onClick:t[5]||(t[5]=o=>s(n).meter.over--)},te),se,e("button",{onClick:t[6]||(t[6]=o=>s(n).meter.under++)},ie),e("div",ne,r(s(n).meter.under),1),e("button",{onClick:t[7]||(t[7]=o=>s(n).meter.under--)},re)]),e("div",ae,[(a(),c("svg",{viewBox:`0 0 ${i.width} ${i.height}`},[e("rect",{width:i.width,height:i.height,fill:"#999"},null,8,de),(a(!0),c(b,null,$((p=s(_))==null?void 0:p.channels,o=>(a(),c("g",{class:"channel",key:o}))),128)),e("line",{x1:i.progress,x2:i.progress,y1:0,y2:i.height,stroke:"black"},null,8,ue),(a(!0),c(b,null,$(s(n).steps,o=>(a(),c("g",{key:o,transform:`translate(${i.width*o[0].split("-")[0]/s(n).steps.length})`},[e("line",{y2:i.height,stroke:"black","stroke-width":"0.1"},null,8,_e),e("text",me,r(Number(o[0].split("-")[0])+1),1)],8,pe))),128))],8,ce))]),e("div",he,r(k),1),e("div",ve,[e("pre",null,r(s(n)),1),e("pre",null,r(s(d)),1),e("pre",null,[V(),e("p",null," "+r(s(f)),1),e("p",null,r(s(_).clock),1),e("p",null,r(s(_).note),1)])])])}}},be=JSON.parse('{"title":"MIDI Rows","description":"Measurewise MIDI recorder","frontmatter":{"title":"MIDI Rows","description":"Measurewise MIDI recorder","date":"2020-02-02T00:00:00.000Z","layout":"app"},"headers":[],"relativePath":"practice/experiments/rows/index.md","filePath":"practice/experiments/rows/index.md","lastUpdated":1725283166000}'),ge={name:"practice/experiments/rows/index.md"};function ke(C,g,_,n,d,i){const m=xe,u=E("client-only");return a(),c("div",null,[M(u,null,{default:O(()=>[M(m)]),_:1})])}const $e=q(ge,[["render",ke]]);export{be as __pageData,$e as default};