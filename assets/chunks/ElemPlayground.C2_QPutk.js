import{ar as a,as as m}from"./theme.BwIdyTJj.js";import{r as d,x as v,y as w,A as x,G as y}from"./framework.BR0mAPCP.js";const b={class:"flex items-center justify-center h-screen"},C={__name:"ElemPlayground",setup(A){const r=d(!1),i=d(!1);let n,s;async function c(){if(r.value)return;n=new(window.AudioContext||window.webkitAudioContext),s=new m,(await s.initialize(n,{numberOfInputs:1,numberOfOutputs:1,outputChannelCount:[2]})).connect(n.destination),r.value=!0}let t;async function f(){r.value||await c(),n.state==="suspended"&&await n.resume();const[u,e]=s.createRef("const",{value:0},[]);t=e;const o=a.mul(a.smooth(a.tau2pole(.01),u),a.cycle(220));s.render(o,o),i.value=!0}function p(){i.value||f(),t==null||t({value:.2})}function l(){t==null||t({value:0})}return(u,e)=>(v(),w("div",b,[x("button",{class:"text-2xl p-4 cursor-pointer",onPointerdown:e[0]||(e[0]=o=>p()),onPointerup:e[1]||(e[1]=o=>l()),onPointerleave:e[2]||(e[2]=o=>l())},y(i.value?"Press to play sound":"Start"),33)]))}};export{C as default};