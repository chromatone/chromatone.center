import{H as u,I as m,u as s,B as d,C as f,E as _,r as h,e as c}from"./framework.B_b_ZswS.js";import{u as v}from"./useElementary.IXqeTkqK.js";const y=["viewBox"],g=["stroke","points"],w={__name:"AnalysisScope",props:{name:{default:"osc",type:String},color:{default:"currentColor",type:String}},setup(a){const i=a;function l(n="osc"){const{scopes:r}=v(),e=h({data:c(()=>r[n]||[]),points:c(()=>e.data.map((t,p)=>[p,t*25].join(",")).join(" "))});return e}const o=l(i.name);return(n,r)=>{var e,t;return u((d(),f("svg",{ref:"svgElem",viewBox:`0 -25 ${s(o).data.length} 50`},[_("polyline",{"stroke-width":"2",stroke:a.color,fill:"transparent",points:s(o).points},null,8,g)],8,y)),[[m,((t=(e=s(o))==null?void 0:e.data)==null?void 0:t.length)>2]])}}};export{w as _};