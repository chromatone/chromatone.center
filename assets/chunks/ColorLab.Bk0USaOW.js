import{_ as F}from"./ColorSvgInfo.DwJ44lT6.js";import{u as h,c as d,b as G,r as f,w as S,f as a,g as i,p as A,h as o,F as y,j as m,l as n,n as $,V as R,C as E,an as N,m as p}from"./framework.B7TlvOs3.js";import{H as v,w as _,O as g}from"./theme.B-lyZe0u.js";const V={id:"gray",x1:"0",x2:"0",y1:"0",y2:"1"},M=["stop-color","offset"],j={id:"green-red",x1:"0",x2:"1",y1:"0",y2:"0"},q=["stop-color","offset"],I={id:"blue-yellow",x1:"0",x2:"0",y1:"0",y2:"1"},P=["stop-color","offset"],U=["x","y","rx","width","height","onMousedown","fill","stroke"],J={class:"cursor-pointer",id:"current"},K=["fill"],Q={class:"cursor-pointer",id:"b-range"},X=["transform"],Y=o("line",{x1:"-15",x2:"-5",stroke:"currentColor","stroke-linecap":"round"},null,-1),Z=o("line",{x1:"-15",x2:"100",stroke:"currentColor","stroke-linecap":"round","stroke-width":"0.1px"},null,-1),ee={fill:"currentColor","font-size":"3px",x:"-10",y:"-4","font-weight":"bold"},te={class:"cursor-pointer",id:"l-range"},oe=["transform"],re=o("line",{x1:"105",x2:"115",stroke:"currentColor","stroke-linecap":"round"},null,-1),ne={fill:"currentColor","font-size":"3px",x:"110",y:"-3","font-weight":"bold"},se={class:"cursor-pointer",id:"a-range"},le=["transform"],ae=o("line",{y1:"-15",y2:"-5",stroke:"currentColor","stroke-linecap":"round"},null,-1),ie=o("line",{y1:"-15",y2:"100",stroke:"currentColor","stroke-linecap":"round","stroke-width":"0.1px"},null,-1),ce={fill:"currentColor","font-size":"3px",x:"7",y:"-9.5","font-weight":"bold"},de=o("rect",{x:"-20",y:"-2.5",width:"40",height:"4",fill:"#ccc",stroke:"currentColor","stroke-width":"0.2"},null,-1),ue=["width"],he={class:"uppercase"},fe=o("rect",{x:"-20",y:"-2.5",width:"40",height:"4",fill:"#ccc",stroke:"currentColor","stroke-width":"0.2"},null,-1),pe=["width"],_e={class:"uppercase"},we={__name:"ColorLab",setup(ge){const r=v(h("lab-range",100),100,300),k=d(()=>-r.value/2),b=d(()=>r.value/2),e=G({current:h("color-current","#fffff"),max:{l:100,res:36},l:v(h("color-l",50),0,100),a:v(h("color-a",20),k,b),b:v(h("color-b",20),k,b),lab:d(()=>({l:e.l,a:e.a,b:e.b,alpha:1})),hex:d(()=>_(e.lab).toHex()),width:100,height:100,res:v(h("lab-res",10),10,36),steps:{a:d(()=>C(e.res)),b:d(()=>C(e.res))},dark:d(()=>_(e.lab).isDark())});function w(t,x,c){return _({l:t,a:x*r.value,b:-c*r.value,alpha:1}).toHex()}function C(t){return[...Array(t)].map((x,c)=>(c-t/2)/t)}const D=f();g({onDrag(t){t.event.preventDefault(),e.b-=t.delta[1]/4,e.a+=t.delta[0]/4},onWheel(t){t.event.preventDefault(),e.b+=t.delta[1]/4,e.a-=t.delta[0]/4}},{domTarget:D,eventOptions:{passive:!1}});const O=f();g({onDrag(t){t.event.preventDefault(),e.res+=t.delta[0]},onWheel(t){t.event.preventDefault(),e.res-=t.delta[0]}},{domTarget:O,eventOptions:{passive:!1}});const B=f();g({onDrag(t){t.event.preventDefault(),r.value+=t.delta[0]},onWheel(t){t.event.preventDefault(),r.value-=t.delta[0]}},{domTarget:B,eventOptions:{passive:!1}});const H=f();g({onDrag(t){t.event.preventDefault(),e.l-=t.delta[1]/8},onWheel(t){t.event.preventDefault(),e.l+=t.delta[1]/8}},{domTarget:H,eventOptions:{passive:!1}});const T=f();g({onDrag(t){t.event.preventDefault(),e.a+=t.delta[0]/4},onWheel(t){t.event.preventDefault(),e.a-=t.delta[0]/4}},{domTarget:T,eventOptions:{passive:!1}});const z=f();g({onDrag(t){t.event.preventDefault(),e.b-=t.delta[1]/4},onWheel(t){t.event.preventDefault(),e.b+=t.delta[1]/4}},{domTarget:z,eventOptions:{passive:!1}});function W(t,x,c){e.a=x*r.value,e.b=-c*r.value,e.current=e.hex}return S(()=>{e.current=e.hex}),(t,x)=>{const c=F;return a(),i("div",{class:"fullscreen-container p-4 transition-all duration-400 ease-in-out",id:"screen",style:A({backgroundColor:e.hex})},[(a(),i("svg",{class:"min-h-80svh max-h-100svh w-full select-none",version:"1.1",baseProfile:"full",viewBox:"-20 -20 140 130",xmlns:"http://www.w3.org/2000/svg","stroke-width":"2px","font-family":"Commissioner, sans-serif","text-anchor":"middle","dominant-baseline":"middle",style:A([{"touch-action":"none","user-select":"none"},{color:e.dark?"white":"black"}])},[o("defs",null,[o("linearGradient",V,[(a(),i(y,null,m(10,(s,l)=>o("stop",{key:s,"stop-color":n(_)({l:100-10*l,a:e.a,b:e.b,alpha:1}).toHex(),offset:l*10+"%"},null,8,M)),64))]),o("linearGradient",j,[(a(),i(y,null,m(10,(s,l)=>o("stop",{key:s,"stop-color":n(_)({l:e.l,a:l*n(r)/10-n(r)/2,b:e.b,alpha:1}).toHex(),offset:l*10+"%"},null,8,q)),64))]),o("linearGradient",I,[(a(),i(y,null,m(10,(s,l)=>o("stop",{key:s,"stop-color":n(_)({l:e.l,a:e.a,b:(10-l)*n(r)/10-n(r)/2,alpha:1}).toHex(),offset:l*10+"%"},null,8,P)),64))])]),o("g",{id:"square",ref_key:"controlCenter",ref:D},[(a(!0),i(y,null,m(e.steps.a,(s,l)=>(a(),i("g",{class:"row",key:s+l},[(a(!0),i(y,null,m(e.steps.b,(u,L)=>(a(),i("rect",{class:$(["cursor-pointer",{current:e.current==w(e.l,s,u)}]),key:u+L,x:l*e.width/e.res,y:L*e.height/e.res,rx:e.current==w(e.l,s,u)?10:0,width:e.width/e.res,height:e.height/e.res,onMousedown:xe=>W(e.l,s,u),fill:w(e.l,s,u),stroke:w(e.l,s,u),"stroke-width":"0.1px"},null,42,U))),128))]))),128))],512),R(N,{name:"fade"},{default:E(()=>[o("g",J,[o("rect",{x:30,y:30,width:40,height:40,fill:e.hex},null,8,K),R(c,{color:e.lab,y:36},null,8,["color"])])]),_:1}),o("g",Q,[o("rect",{id:"b",x:"-15",y:"0",width:"10",height:"100",fill:"url(#blue-yellow)",ref_key:"controlB",ref:z},null,512),o("g",{class:"pointer-events-none",transform:`translate(0,${100*(-e.b+n(r)/2)/n(r)})`},[Y,Z,o("text",ee,"B "+p(e.b.toFixed(1)),1)],8,X)]),o("g",te,[o("rect",{id:"l",x:"105",y:"0",width:"10",height:"100",fill:"url(#gray)",ref_key:"controlLight",ref:H},null,512),o("g",{class:"pointer-events-none",transform:`translate(0,${100-e.l})`},[re,o("text",ne,"L "+p(e.l.toFixed(1)),1)],8,oe)]),o("g",se,[o("rect",{id:"a",x:"0",y:"-15",width:"100",height:"10",fill:"url(#green-red)",ref_key:"controlA",ref:T},null,512),o("g",{class:"pointer-events-none",transform:`translate(${100*(e.a+n(r)/2)/n(r)},0)`},[ae,ie,o("text",ce,"A "+p(e.a.toFixed(1)),1)],8,le)]),o("g",{class:"cursor-pointer",id:"res",transform:"translate(20, 105)","font-size":"2",ref_key:"controlRes",ref:O},[de,o("rect",{x:"-20",y:"-2.5",width:40*(e.res/36),height:"4",fill:"#aaa",stroke:"currentColor","stroke-width":"0.2"},null,8,ue),o("text",he,"RESOLUTION "+p(e.res)+"x"+p(e.res),1)],512),o("g",{class:"cursor-pointer",id:"range",transform:"translate(80, 105)","font-size":"2",ref_key:"controlRange",ref:B},[fe,o("rect",{x:"-20",y:"-2.5",width:40*(n(r)/300),height:"4",fill:"#aaa",stroke:"currentColor","stroke-width":"0.2"},null,8,pe),o("text",_e,"AB RANGE "+p(n(r)),1)],512)],4))],4)}}};export{we as _};