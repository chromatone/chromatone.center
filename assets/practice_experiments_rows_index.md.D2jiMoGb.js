import{V as N,R as P,W as S,X as F,Y as V,e as M,Z as E}from"./chunks/theme.oPgoCdSG.js";import{r as f,e as w,w as O,B as r,C as a,E as e,J as l,u as s,F as C,G as I,af as W,z as q,R as T,W as z,a0 as J}from"./chunks/framework.B_b_ZswS.js";const Z={class:"flex flex-col"},G={class:"text-2xl"},L={class:"flex flex-wrap"},Q={key:0,class:"i-la-circle"},U={key:1,class:"i-mdi-checkbox-blank-circle"},X={key:0,class:"i-la-play"},Y={key:1,class:"i-la-pause"},j={class:"p-1"},A={class:"p-1"},H={class:"flex flex-col"},K=["viewBox"],tt=["width","height"],et=["x1","x2","y2"],st=["transform"],it=["y2"],nt={y:"3",x:"1","font-size":"2"},ot={class:"flex text-xs p-4"},lt={class:"grid grid-cols-3 text-xs gap-2"},rt={__name:"MidiRows",setup(D){const _=N(),{midi:v,clock:y}=P(),{seq:h,meter:d,steps:m,progress:k}=S(null,1,"row"),u=F(),n=f({width:100,height:30,progress:w(()=>n.width*k.value),recording:!1}),g=w(()=>d.over*_.PPQ*4/d.under),p=w(()=>u.ticks%g.value),R=new V((o,t)=>{M(t.midi)}).set({loop:!0,loopEnd:"800i",loopStart:0,playbackRate:1,probability:1}).start(0),x=f({}),b=f([]),{track:$,midiFile:ut}=B();O(()=>v.note,o=>{if(M(o.midi),!(!n.recording||!u.playing))if(o.velocity>0)x[o.number]=p.value;else{const t=x==null?void 0:x[o.number],c=p.value;let i;c>t?i=c-t:i=g.value-t+c,b.push({ticks:p.value,midi:o.number,channel:o.channel,start:t,stop:c,duration:i}),R.add({time:p.value+"i",midi:o.number,duration:i})}});function B(){const o=new E.Midi;o.name="Chromatone recording";const t=o.addTrack();return{midiFile:o,track:t}}return(o,t)=>{var c;return r(),a("div",Z,[e("div",G,"MIDI ROWS "+l(p.value)+"/"+l(g.value),1),e("div",L,[e("button",{onClick:t[0]||(t[0]=i=>n.recording=!n.recording)},[n.recording?(r(),a("div",U)):(r(),a("div",Q))]),e("button",{onClick:t[1]||(t[1]=i=>s(u).playing=!s(u).playing)},[s(u).playing?(r(),a("div",Y)):(r(),a("div",X))]),e("button",{onClick:t[2]||(t[2]=i=>s(u).stopped=Date.now())},t[8]||(t[8]=[e("div",{class:"i-la-stop"},null,-1)])),e("button",{onClick:t[3]||(t[3]=i=>s($).notes=[])},t[9]||(t[9]=[e("div",{class:"i-la-trash-alt"},null,-1)])),e("button",{onClick:t[4]||(t[4]=i=>s(d).over++)},t[10]||(t[10]=[e("div",{class:"i-la-plus"},null,-1)])),e("div",j,l(s(d).over),1),e("button",{onClick:t[5]||(t[5]=i=>s(d).over--)},t[11]||(t[11]=[e("div",{class:"i-la-minus"},null,-1)])),t[14]||(t[14]=e("div",{class:"p-1"},"/",-1)),e("button",{onClick:t[6]||(t[6]=i=>s(d).under++)},t[12]||(t[12]=[e("div",{class:"i-la-plus"},null,-1)])),e("div",A,l(s(d).under),1),e("button",{onClick:t[7]||(t[7]=i=>s(d).under--)},t[13]||(t[13]=[e("div",{class:"i-la-minus"},null,-1)]))]),e("div",H,[(r(),a("svg",{viewBox:`0 0 ${n.width} ${n.height}`},[e("rect",{width:n.width,height:n.height,fill:"#999"},null,8,tt),(r(!0),a(C,null,I((c=s(v))==null?void 0:c.channels,i=>(r(),a("g",{class:"channel",key:i}))),128)),e("line",{x1:n.progress,x2:n.progress,y1:0,y2:n.height,stroke:"black"},null,8,et),(r(!0),a(C,null,I(s(m),i=>(r(),a("g",{key:i,transform:`translate(${n.width*i[0].split("-")[0]/s(m).length})`},[e("line",{y2:n.height,stroke:"black","stroke-width":"0.1"},null,8,it),e("text",nt,l(Number(i[0].split("-")[0])+1),1)],8,st))),128))],8,K))]),e("div",ot,l(b),1),e("div",lt,[e("pre",null,l(s(h)),1),e("pre",null,l(s(u)),1),e("pre",null,[t[15]||(t[15]=W()),e("p",null," "+l(s($)),1),e("p",null,l(s(y)),1),e("p",null,l(s(v).note),1)])])])}}},vt=JSON.parse('{"title":"MIDI Rows","description":"Measurewise MIDI recorder","frontmatter":{"title":"MIDI Rows","description":"Measurewise MIDI recorder","date":"2020-02-02T00:00:00.000Z","layout":"app"},"headers":[],"relativePath":"practice/experiments/rows/index.md","filePath":"practice/experiments/rows/index.md","lastUpdated":1736779474000}'),at={name:"practice/experiments/rows/index.md"};function dt(D,_,v,y,h,d){const m=rt,k=J("client-only");return r(),a("div",null,[T(k,null,{default:z(()=>[T(m)]),_:1})])}const mt=q(at,[["render",dt]]);export{vt as __pageData,mt as default};