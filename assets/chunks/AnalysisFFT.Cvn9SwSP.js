import{aG as f}from"./theme.oPgoCdSG.js";import{u as m}from"./useElementary.IXqeTkqK.js";import{r as g,e as s,a as p,o as v,w,B as x,C as _,E as M}from"./framework.B_b_ZswS.js";function b(n="main:fft"){const{FFTs:r,meters:a}=m(),t=g({sr:s(()=>{var e;return((e=a["main:sample-rate"])==null?void 0:e.max)||44100}),freq:s(()=>t.data[0].map((e,l)=>l*t.sr/(t.data[0].length||1))),colors:s(()=>t.freq.map(e=>f(e))),data:s(()=>(r==null?void 0:r[n])||[[],[]]),total:s(()=>t.data[0].map((e,l)=>Math.log2(1+Math.abs(e)+Math.abs(t.data[1][l]))))});return{FFT:t}}const y={class:"flex is-group p-2 bg-light-200 dark-bg-dark-200 shadow rounded gap-4"},E={__name:"AnalysisFFT",props:{name:{default:"main:fft",type:String}},setup(n){const r=n,{FFT:a}=b(r.name);let t=p(null);v(e),w(a,e,{deep:!0});function e(){if(!t.value||!(a!=null&&a.total))return;let l=t.value.getContext("2d");l.clearRect(0,0,t.value.width,t.value.height);for(let o=0;o<a.total.length;o++){let i=a.total[o],h=Math.pow(i,2)*t.value.height/50,c=Math.log2(o+1)*t.value.width/Math.log2(a.total.length+1),u=Math.log2(o+2)*t.value.width/Math.log2(a.total.length+1)-c,d=t.value.height-h;l.fillStyle=a.colors[o],l.fillRect(c,d,u,h)}}return(l,o)=>(x(),_("div",y,[M("canvas",{class:"max-w-full",ref_key:"canvas",ref:t,height:"512",width:"2048"},null,512)]))}};export{E as _};