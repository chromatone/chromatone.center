import{T as O,c as H,ap as q,ai as A}from"./chunks/theme.DvVY4vau.js";import{_ as P,c as E,f as o,g as a,h as t,m as n,p,q as z,F as T,j as V,k as J,v as L,n as U,l as f,z as Z,R as _,A as G,$ as K}from"./chunks/framework.BX1Y-ISu.js";const Q={class:"p-4 shadow-lg rounded-2xl bg-light-900 dark-bg-dark-300 relative border-2 shadow-lg",style:{flex:"1 1 200px"}},W={class:"flex justify-between"},X={class:"flex-col"},Y={class:"text-md"},tt={class:"text-2xl font-bold"},et={class:"flex-col text-xs font-mono flex gap-2 text-center"},nt={key:1,class:"display"},it={class:"display"},st={class:"flex flex-wrap gap-3 mt-4 items-center"},ot=["onClick"],at={class:"text-sm"},lt={__name:"MidiRouterInput",props:{input:{type:Object,default:()=>{}},iid:{type:[Number,String],default:0}},setup(e){const l=e,{midi:r}=O(),d=E(()=>{var c,i,s;return((i=(c=l.input)==null?void 0:c.note)==null?void 0:i.velocity)>0?H((s=l.input.note)==null?void 0:s.pitch,null,1,.4):"#7773"});return(c,i)=>{var s,u,m,x,h,g,y,b,k,w,C,$,M,I,D,B,N,R;return o(),a("div",Q,[t("div",W,[t("div",X,[t("div",Y,n(e.input.manufacturer),1),t("div",tt,n(e.input.name),1)]),t("div",et,[e.input.note?(o(),a("div",{key:0,class:"display",style:p({backgroundColor:d.value})},[t("div",{class:"indicator",style:p({transform:`scale(${(u=(s=e.input)==null?void 0:s.note)==null?void 0:u.attack},1)`})},null,4),t("i",null,"CH"+n((x=(m=e.input)==null?void 0:m.note)==null?void 0:x.channel),1),t("div",{class:"px-1 rounded-sm",style:p({backgroundColor:d.value})},n((g=(h=e.input)==null?void 0:h.note)==null?void 0:g.identifier),5),t("i",null,n((b=(y=e.input)==null?void 0:y.note)==null?void 0:b.number),1)],4)):z("",!0),e.input.cc?(o(),a("div",nt,[t("div",{class:"indicator",style:p({transform:`scale(${(w=(k=e.input)==null?void 0:k.cc)==null?void 0:w.value},1)`})},null,4),t("i",null,"CH"+n(($=(C=e.input)==null?void 0:C.cc)==null?void 0:$.channel),1),t("i",null,"CC"+n((I=(M=e.input)==null?void 0:M.cc)==null?void 0:I.number),1),t("i",null,n((B=(D=e.input)==null?void 0:D.cc)==null?void 0:B.raw),1)])):z("",!0),t("div",it,[i[0]||(i[0]=t("div",{class:"indicator"},null,-1)),t("i",null,n(Math.floor((N=e.input)==null?void 0:N.bpm))+" BPM",1),t("i",null,n(Math.floor(((R=e.input)==null?void 0:R.clock)/1e3))+"s",1)])])]),t("div",st,[i[1]||(i[1]=t("div",{class:"text-xs"},"TO",-1)),(o(!0),a(T,null,V(f(r).outputs,(S,v)=>{var j,F;return J((o(),a("button",{class:U(["px-2 shadow-sm rounded-xl bg-light-200 dark-bg-dark-500 cursor-pointer border-2 border-transparent select-none",{active:(F=(j=f(r).forwards)==null?void 0:j[e.iid])==null?void 0:F[v]}]),key:v,onClick:ft=>f(q)(e.iid,v)},[t("div",at,n(S.name),1)],10,ot)),[[L,e.input.name!=S.name]])}),128))])])}}},ct=P(lt,[["__scopeId","data-v-b16982e1"]]),rt={class:"flex flex-wrap gap-4 justify-center p-4"},dt={__name:"MidiRouter",setup(e){const{midi:l}=O();return(r,d)=>{const c=ct;return o(),a("div",rt,[(o(!0),a(T,null,V(f(l).inputs,(i,s)=>(o(),Z(c,{key:s,input:i,iid:s},null,8,["input","iid"]))),128))])}}},xt=JSON.parse('{"title":"MIDI Router","description":"Forward all MIDI messages from one device to another","frontmatter":{"title":"MIDI Router","description":"Forward all MIDI messages from one device to another","layout":"app","cover":"midi-router.png","date":"2022-06-08T00:00:00.000Z"},"headers":[],"relativePath":"practice/midi/router/index.md","filePath":"practice/midi/router/index.md","lastUpdated":1725520089000}'),ut={name:"practice/midi/router/index.md"},mt={id:"screen"};function pt(e,l,r,d,c,i){const s=dt,u=A,m=K("client-only");return o(),a("div",null,[_(m,null,{default:G(()=>[t("div",mt,[_(s,{class:"mb-20"}),_(u,{class:"mb-4"})])]),_:1}),l[0]||(l[0]=t("p",null,"Click on the desired output under the input you want to send signals from.",-1))])}const ht=P(ut,[["render",pt]]);export{xt as __pageData,ht as default};