import{_ as W}from"./SvgRing.BSEsrEnu.js";import{_ as E,aq as A,aP as D,u as B,b as O,P as G,f as a,g as i,h as l,m as M,l as e,k as j,F as w,j as b,R as $,U as H,q as T,p as P}from"./framework.BH4RfCYQ.js";import{n as J,r as Q,ak as X,aR as Y,c as f,aS as R,q as p,w as Z,x as q,z as ee,j as te,aT as se,aU as oe,aV as ne,aW as re}from"./theme.BRAeJ4NP.js";const ae={class:"fullscreen-container select-none touch-manipulation h-full max-h-screen",id:"screen"},ie={class:"text-xs fixed top-0 right-0"},ce={class:"w-full",id:"fifths",style:{flex:"1 1 auto","touch-action":"none","user-select":"none","-webkit-user-select":"none","-webkit-touch-callout":"none"},version:"1.1",baseProfile:"full",viewBox:"0 0 100 100",xmlns:"http://www.w3.org/2000/svg","font-family":"Commissioner, sans-serif"},le={fill:"currentColor",transform:"translate(50,50)","font-size":"3px","text-anchor":"middle","dominant-baseline":"middle","font-weight":"bold"},me=["font-weight"],he=["stroke-width"],de=["font-weight"],ue=["stroke-width"],fe={class:"rings"},pe=["onMouseenter","onMousedown","onTouchstart","onMouseleave","onMouseup","onTouchend","onTouchcancel"],ve=["cx","cy","fill","onClick"],ye=["onMousedown","onTouchstart","onMouseleave","onMouseenter","onMouseup","onTouchend","onTouchcancel"],_e=["cx","cy","fill"],xe=["fill","x","y"],ge=["fill"],ke=["fill"],Me=["x","y"],we={__name:"ChordFifths",setup(be){A("Shift",r=>{o.seventh=!o.seventh}),D("Shift",r=>{o.seventh=!o.seventh}),A("Alt",r=>{o.main=!o.main}),D("Alt",r=>{o.main=!o.main});const I=[0,7,2,9,4,11,6,1,8,3,10,5],S=J.map((r,m)=>({name:r,pitch:m})),V=I.map(r=>S[r]),z=Q(I,-3).map(r=>S[r]),U={minor:V,major:z},c=B("tonic",0),C=B("scale-type","major"),o=O({seventh:!1,main:!0,pressed:!1}),K={minor:[["VI","III","VII"],["iv","i","v"]],major:[["IV","I","V"],["ii","vi","iii"]]},L={minor:[0,3,7,12],major:[0,4,7,12],minor7:[0,3,7,10],major7:[0,4,7,11]};function v(r){return r=="minor"?1:0}function N(r){return r=="minor"?o.seventh?"m7":"m":o.seventh?"M7":""}function F(r,m="major",d){const k=N(m),_=te(r+k);return d!==void 0?se([1+d,4+d]).map(oe(k||"major",r+"3")):ne(_.notes.map(t=>re(t)+4))}function x(r,m="major",d){q(F(r,m,d))}function y(r,m="major",d){ee(F(r,m,d))}return(r,m)=>{const d=W,k=G("tooltip");return a(),i("div",ae,[l("pre",ie,M(e(X).offset),1),(a(),i("svg",ce,[l("g",le,[l("text",null,M(e(Y)[0]),1)]),j((a(),i("g",{class:"cursor-pointer",transform:"translate(10,90)",onClick:m[0]||(m[0]=_=>o.seventh=!o.seventh)},[l("text",{fill:"currentColor","font-size":"3px","text-anchor":"middle","dominant-baseline":"middle",y:"0.3","font-weight":o.seventh?"bold":"normal"},"7",8,me),l("circle",{r:"3",fill:"transparent",stroke:"currentColor","stroke-width":o.seventh?.8:.4},null,8,he)])),[[k,"Hold SHIFT to toggle 7th chords",void 0,{top:!0}]]),j((a(),i("g",{class:"cursor-pointer",transform:"translate(90,90)",onClick:m[1]||(m[1]=_=>o.main=!o.main)},[l("text",{fill:"currentColor","font-size":"3px","text-anchor":"middle","dominant-baseline":"middle",y:"0.3","font-weight":o.main?"bold":"normal"},"A",8,de),l("circle",{r:"3",fill:"transparent",stroke:"currentColor","stroke-width":o.main?.8:.4},null,8,ue)])),[[k,"Hold ALT to toggle chord inversions",void 0,{top:!0}]]),l("g",fe,[(a(),i(w,null,b(U,(_,t)=>l("g",{class:"ring",key:t},[(a(!0),i(w,null,b(_,(s,n)=>(a(),i("g",{class:"around",key:n,style:{cursor:"pointer"}},[$(d,{cx:50,cy:50,from:(n-1)/12*360+15,to:n/12*360+15,radius:40-12*v(t),thickness:10,op:Math.abs(e(c)-n)==11||Math.abs(e(c)-n)%12<=1?.8:.1,fill:Math.abs(e(c)-n)==11||Math.abs(e(c)-n)%12<=1?e(f)(s.pitch):e(f)(s.pitch,2,1)},null,8,["from","to","radius","op","fill"]),(a(!0),i(w,null,b(L[t+(o.seventh?"7":"")],(h,u)=>(a(),i("g",{class:"quadro",onMouseenter:g=>o.pressed&&x(s.name,t,u),onMousedown:H(g=>{o.pressed=!0,x(s.name,t,u)},["stop","prevent"]),onTouchstart:H(g=>{o.pressed=!0,x(s.name,t,u)},["stop","prevent"]),onMouseleave:g=>y(s.name,t,u),onMouseup:g=>{o.pressed=!1,y(s.name,t,u)},onTouchend:g=>{o.pressed=!1,y(s.name,t,u)},onTouchcancel:g=>{o.pressed=!1,y(s.name,t,u)},key:u},[$(d,{class:"transition",cx:50,cy:50,from:(n-1)/12*360+15+15*(u%2),to:n/12*360+15*(u%2),radius:40-12*v(t)-5*(u>1?0:1),thickness:5,op:Math.abs(e(c)-n)==11||Math.abs(e(c)-n)%12<=1?e(R)[(s.pitch+h)%12]==1?.7:.3:e(R)[(s.pitch+h)%12]==1?.2:.1,fill:Math.abs(e(c)-n)==11||Math.abs(e(c)-n)%12<=1?e(f)(s.pitch+h,5):e(f)(s.pitch+h,5,1)},null,8,["from","to","radius","op","fill"])],40,pe))),128)),l("circle",{class:"transition opacity-20 hover-opacity-80",cx:e(p)(n,12,42-v(t)*26).x,cy:e(p)(n,12,42-v(t)*26).y,r:2,fill:e(f)(s.pitch,4,1,1),onClick:h=>{c.value=n,C.value=t}},null,8,ve),o.main?(a(),i("g",{key:0,onMousedown:h=>x(s.name,t),onTouchstart:h=>x(s.name,t),onMouseleave:h=>y(s.name,t),onMouseenter:h=>o.pressed&&x(s.name,t),onMouseup:h=>y(s.name,t),onTouchend:h=>y(s.name,t),onTouchcancel:h=>y(s.name,t)},[l("circle",{class:"note opacity-80 hover-opacity-100",style:{transition:"all 300ms ease-out","transform-box":"fill-box","transform-origin":"center center"},cx:e(p)(n,12,35-v(t)*12).x,cy:e(p)(n,12,35-v(t)*12).y,r:"5",fill:Math.abs(e(c)-n)==11||Math.abs(e(c)-n)%12<=1?e(f)(s.pitch,4):e(f)(s.pitch,5,1,.5)},null,8,_e)],40,ye)):T("",!0),l("text",{class:"pointer-events-none",style:{"user-select":"none",transition:"all 300ms ease"},fill:(e(Z)(e(f)(s.pitch,4)).isDark(),"white"),"font-size":"3px","text-anchor":"middle","dominant-baseline":"middle",x:e(p)(n,12,35-v(t)*12).x,y:e(p)(n,12,35-v(t)*12).y+.5},M(s.name)+M(N(t)),9,xe)]))),128))])),64))]),l("g",{class:"transition-all duration-300 ease-out",ref:"selector","transform-origin":"50 50",style:P({transform:`rotate(${e(c)/12*360}deg)`})},[$(d,{cx:50,cy:50,from:-2/12*360+15,to:1/12*360+15,radius:44.5,thickness:31,sWidth:.5,stroke:"#fff3",fill:"none"}),e(C)!="minor"?(a(),i("circle",{key:0,class:"transition-all duration-300 cursor-pointer",cx:50,cy:8,r:2,fill:e(f)(e(z)[e(c)].pitch,4)},null,8,ge)):T("",!0),e(C)!="major"?(a(),i("circle",{key:1,class:"transition-all duration-300 cursor-pointer",cx:50,cy:34,r:2,fill:e(f)(e(V)[e(c)].pitch,4)},null,8,ke)):T("",!0),(a(!0),i(w,null,b(K[e(C)],(_,t)=>(a(),i("g",{key:t},[(a(!0),i(w,null,b(_,(s,n)=>(a(),i("text",{class:"pointer-events-none",key:s,style:P([{"user-select":"none",transition:"all 300ms ease"},{transform:`rotate(${-e(c)*30}deg)`,transformOrigin:`${e(p)(n-1,12,42-t*26).x}px ${e(p)(n-1,12,42-t*26).y}px`}]),fill:"currentColor","font-size":"2.5px","text-anchor":"middle","dominant-baseline":"middle",x:e(p)(n-1,12,42-t*26).x,y:e(p)(n-1,12,42-t*26).y+.25},M(s),13,Me))),128))]))),128))],4)]))])}}},Ie=E(we,[["__scopeId","data-v-9c6486fb"]]);export{Ie as default};