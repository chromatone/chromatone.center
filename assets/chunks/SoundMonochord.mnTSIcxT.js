import{H as h,aA as g,F as u,aB as v}from"./theme.CSn6VkK-.js";import{b as y,c as r,av as b,aQ as z,P as B,f as q,g as p,h as e,l as o,m as s,k as F,F as H,j as P}from"./framework.BH4RfCYQ.js";import{F as k}from"./fraction.DqatKmli.js";const D={class:"flex flex-col fullscreen-container",id:"screen"},N={class:"py-8 select-none",version:"1.1",baseProfile:"full",viewBox:"-10 -5 120 35",xmlns:"http://www.w3.org/2000/svg","font-family":"Commissioner, sans-serif","font-size":"3px","text-anchor":"middle","dominant-baseline":"middle","stroke-linecap":"round",fill:"white",style:{"touch-action":"none"}},j={id:"ruler","stroke-width":"0.2",stroke:"currentColor"},S=["x1","x2"],T={id:"freqs",stroke:"none",fill:"currentColor"},A={id:"left","text-anchor":"end"},E=["x"],L=["x"],O={id:"right","text-anchor":"start"},Q=["x"],R=["x"],V={class:"cursor-pointer",id:"ratio","font-size":"4px",fill:"currentColor"},G=["x"],I=["x"],J=["stroke"],K={x:"50","font-weight":"bold"},U={class:"cursor-pointer",id:"divided",transform:"translate(0,15)","font-weight":"bold"},W=["stroke","x2"],X=["x"],Y=["stroke","x1"],Z=["x"],tt=["cx"],et={class:"flex flex-wrap justify-center m-4"},ot=["onClick"],dt={__name:"SoundMonochord",setup(nt){function a(x){console.log(x)}const f=y({ratio:h(.8,.05,.95),fraction:r(()=>new k(1-f.ratio).simplify(.001).toFraction(!0)),invFraction:r(()=>new k(f.ratio).simplify(.001).toFraction(!0))}),n=y({freq:h(220,50,2e3),pitch:r(()=>g(n.freq).toFixed()),note:r(()=>u(n.freq).toNote()),cents:r(()=>_(u(n.note).toFrequency(),n.freq))}),l=y({freq:r(()=>n.freq/(1-f.ratio)),pitch:r(()=>(g(l.freq)+120)%12),note:r(()=>u(l.freq).toNote()),cents:r(()=>_(u(l.note).toFrequency(),l.freq))}),d=y({freq:r(()=>n.freq/f.ratio),pitch:r(()=>(g(d.freq)+120)%12),note:r(()=>u(d.freq).toNote()),cents:r(()=>_(u(d.note).toFrequency(),d.freq))}),M={"1/2":1/2,"2/3":2/3,"3/4":3/4,"3/5":3/5,"4/5":4/5,"5/6":5/6,"4/7":4/7,"5/7":5/7,"6/7":6/7,"5/8":5/8,"7/8":7/8,"5/9":5/9,"7/9":7/9,"8/9":8/9,"9/10":9/10,"10/11":10/11,"11/12":11/12,"8/15":8/15,"15/16":15/16,"32/45":32/45},i=b(r(()=>f.ratio),{duration:200,transition:z.easeOutCubic});function C(x){n.freq+=x.delta[0]/4}function $(x){f.ratio-=x.delta[0]/1200}function _(x,t){return-(1200/Math.log10(2))*Math.log10(x/t)%1200}return(x,t)=>{const m=B("drag");return q(),p("div",D,[(q(),p("svg",N,[e("g",j,[t[8]||(t[8]=e("line",{y1:"30",y2:"30",x2:"100"},null,-1)),t[9]||(t[9]=e("line",{y1:"0",y2:"30"},null,-1)),t[10]||(t[10]=e("line",{x1:"100",x2:"100",y1:"0",y2:"30"},null,-1)),e("line",{x1:100*(1-o(i)),x2:100*(1-o(i)),y1:"0",y2:"30"},null,8,S),e("g",T,[e("g",A,[e("text",{x:100*(1-o(i))-2,y:"28"},s(l.freq.toFixed(1))+" Hz",9,E),e("text",{x:100*(1-o(i))-2,y:"24"},s(l.note)+" ("+s(l.cents.toFixed())+" cents) ",9,L)]),e("g",O,[e("text",{x:100*(1-o(i))+2,y:"28"},s(d.freq.toFixed(1))+" Hz",9,Q),e("text",{x:100*(1-o(i))+2,y:"24"},s(d.note)+" ("+s(d.cents.toFixed())+" cents) ",9,R)])]),e("g",V,[e("g",{onMousedown:t[0]||(t[0]=c=>{a(n.freq),a(l.freq)})},[e("text",{x:100*(1-o(i))-2,y:"8","text-anchor":"end"},s(f.fraction),9,G)],32),e("g",{onMousedown:t[1]||(t[1]=c=>{a(n.freq),a(d.freq)})},[e("text",{x:100*(1-o(i))+2,y:"8","text-anchor":"start"},s(f.invFraction),9,I)],32)])]),F((q(),p("g",{class:"cursor-pointer",id:"fundamental",onMouseover:t[2]||(t[2]=c=>a(n.freq)),onMousedown:t[3]||(t[3]=c=>a(n.freq))},[e("line",{x2:"100","stroke-width":"4",stroke:o(v)(n.freq)},null,8,J),t[11]||(t[11]=e("circle",{r:"1"},null,-1)),t[12]||(t[12]=e("circle",{cx:"100",r:"1"},null,-1)),e("text",K,s(n.note)+" "+s(n.freq.toFixed())+" Hz ("+s(n.cents.toFixed())+" cents)",1)],32)),[[m,C]]),F((q(),p("g",U,[e("g",{id:"part1",onMouseover:t[4]||(t[4]=c=>a(l.freq)),onMousedown:t[5]||(t[5]=c=>a(l.freq))},[e("line",{stroke:o(v)(l.freq),"stroke-width":"4",x2:100*(1-o(i))},null,8,W),e("text",{y:"0.3",x:100*(1-o(i))/2},s(l.note),9,X)],32),e("g",{id:"part2",onMouseover:t[6]||(t[6]=c=>a(d.freq)),onMousedown:t[7]||(t[7]=c=>a(d.freq))},[e("line",{stroke:o(v)(d.freq),"stroke-width":"4",x1:100*(1-o(i)),x2:"100"},null,8,Y),e("text",{y:"0.3",x:100-100*o(i)/2},s(d.note),9,Z),e("circle",{cx:100*(1-o(i)),r:"1"},null,8,tt)],32),t[13]||(t[13]=e("circle",{r:"1"},null,-1)),t[14]||(t[14]=e("circle",{r:"1",cx:"100"},null,-1))])),[[m,$]])])),e("div",et,[(q(),p(H,null,P(M,(c,w)=>e("button",{class:"p-2 border-1 shadow m-2",key:w,onClick:rt=>f.ratio=c},s(w),9,ot)),64))])])}}};export{dt as default};