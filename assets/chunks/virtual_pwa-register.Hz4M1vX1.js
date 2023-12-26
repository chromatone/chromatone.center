import{a4 as w}from"./framework.IUYQRuva.js";function v(c={}){const{immediate:d=!1,onNeedRefresh:_,onOfflineReady:i,onRegistered:a,onRegisteredSW:s,onRegisterError:r}=c;let t,o;const l=async(n=!0)=>{await o};async function p(){if("serviceWorker"in navigator){const{Workbox:n}=await w(()=>import("./workbox-window.prod.es5.prqDwDSL.js"),__vite__mapDeps([]));t=new n("/sw.js",{scope:"/",type:"classic"}),t.addEventListener("activated",e=>{(e.isUpdate||e.isExternal)&&window.location.reload()}),t.addEventListener("installed",e=>{e.isUpdate||i==null||i()}),t.register({immediate:d}).then(e=>{s?s("/sw.js",e):a==null||a(e)}).catch(e=>{r==null||r(e)})}}return o=p(),l}export{v as registerSW};
function __vite__mapDeps(indexes) {
  if (!__vite__mapDeps.viteFileDeps) {
    __vite__mapDeps.viteFileDeps = []
  }
  return indexes.map((i) => __vite__mapDeps.viteFileDeps[i])
}