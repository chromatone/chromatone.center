import{_ as h}from"./ColorSvgInfo.BwLOQ6Zk.js";import{b as x,c as u,u as n,r as a,f as g,g as p,Q as b,h as s,R as _,p as k}from"./framework.BH4RfCYQ.js";import{H as i,O as c}from"./theme.CSn6VkK-.js";const y={class:"min-h-80svh max-h-100svh w-full",version:"1.1",baseProfile:"full",viewBox:"-5 -5 110 110",xmlns:"http://www.w3.org/2000/svg","stroke-width":"2px",style:{"touch-action":"none"},"font-family":"Commissioner, sans-serif"},w=["stroke-dasharray"],D=["r","fill","stroke-dashoffset"],B=["r","fill","stroke-dashoffset"],$=["r","fill","stroke-dashoffset"],O={__name:"ColorRgb",setup(N){const t=x({radius:30,len:u(()=>t.radius*Math.PI*2),max:255,r:i(n("red",190),0,255),g:i(n("gree",190),0,255),b:i(n("blue",190),0,255),rgb:u(()=>`rgb(${t.r},${t.g},${t.b})`)});function l(e){return r=>{t[e]=Number(t[e])+(Number(r[0])-Number(r[1]))}}const f=a(),d=a(),m=a();return c({onDrag(e){var r;(r=e==null?void 0:e.event)==null||r.preventDefault(),l("r")(e.delta)},onWheel(e){var r;(r=e==null?void 0:e.event)==null||r.preventDefault(),l("r")(e.velocities.map(o=>-o))}},{domTarget:f,eventOptions:{passive:!1}}),c({onDrag(e){var r;(r=e==null?void 0:e.event)==null||r.preventDefault(),l("g")(e.delta)},onWheel(e){var r;(r=e==null?void 0:e.event)==null||r.preventDefault(),l("g")(e.velocities.map(o=>-o))}},{domTarget:d,eventOptions:{passive:!1}}),c({onDrag(e){var r;(r=e==null?void 0:e.event)==null||r.preventDefault(),l("b")(e.delta)},onWheel(e){var r;(r=e==null?void 0:e.event)==null||r.preventDefault(),l("b")(e.velocities.map(o=>-o))}},{domTarget:m,eventOptions:{passive:!1}}),(e,r)=>{const o=h;return g(),p("div",{class:"fullscreen-container mb-8 p-4 transition-all duration-800 ease-out",id:"screen",style:k({backgroundColor:t.rgb})},[(g(),p("svg",y,[r[0]||(r[0]=b('<circle id="black" r="50" cx="50" cy="50"></circle><g id="sources"><circle r="8" cx="15" cy="29" fill="#ff0000"></circle><circle r="8" cx="85.5" cy="29" fill="#00ff00"></circle><circle r="8" cx="50" cy="91" fill="#0000ff"></circle></g>',2)),s("g",{class:"cursor-pointer",id:"circles","stroke-linecap":"round","stroke-dasharray":t.len},[s("circle",{class:"mix-blend-lighten",id:"r",r:t.radius,ref_key:"controlR",ref:f,fill:`rgb(${t.r},0,0)`,stroke:"#ff0000","stroke-dashoffset":t.len-t.len*(t.r/t.max),transform:"translate(35,40) rotate(-150)"},null,8,D),s("circle",{class:"mix-blend-lighten",id:"g",r:t.radius,ref_key:"controlG",ref:d,fill:`rgb(0,${t.g},0)`,stroke:"#00ff00","stroke-dashoffset":t.len-t.len*(t.g/t.max),transform:"translate(65,40) rotate(-30)"},null,8,B),s("circle",{class:"mix-blend-lighten",id:"b",r:t.radius,ref_key:"controlB",ref:m,fill:`rgb(0,0,${t.b})`,stroke:"#0000ff","stroke-dashoffset":t.len-t.len*(t.b/t.max),transform:"translate(50,68) rotate(90)"},null,8,$)],8,w),r[1]||(r[1]=s("g",{class:"font-bold text-xs select-none pointer-events-none",id:"text"},[s("text",{x:"15",y:"33","text-anchor":"middle",fill:"white"},"R"),s("text",{x:"50",y:"95","text-anchor":"middle",fill:"white"},"B"),s("text",{x:"85",y:"33","text-anchor":"middle",fill:"white"},"G")],-1)),_(o,{transform:"scale(0.7) translate(21,12)",color:t.rgb,y:46},null,8,["color"])]))],4)}}};export{O as _};