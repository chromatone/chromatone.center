import{a2 as x,q as E,x as p,y as _,J as T}from"./framework.-sYaBLvc.js";const v=`precision highp float;
precision highp int;
uniform vec3 iResolution;
uniform float iTime;
uniform float iTimeDelta;
uniform int iFrame;
uniform vec4 iMouse;
uniform vec4 iDate;

attribute vec4 aPosition;

varying vec4 v_iResolution_iMouse_iDate[3];
varying float iChannelTime[4];
varying vec3 iChannelResolution[4];

void main() {
    gl_Position = aPosition;

    v_iResolution_iMouse_iDate[0] = vec4(iResolution,iTime);
    v_iResolution_iMouse_iDate[1] = vec4(iMouse.xyz,iTimeDelta);
    v_iResolution_iMouse_iDate[2] = iDate;
    iChannelTime[0] = iTime;
    iChannelTime[1] = iTime;
    iChannelTime[2] = iTime;
    iChannelTime[3] = iTime;
    iChannelResolution[0] = iResolution;
    iChannelResolution[1] = iResolution;
    iChannelResolution[2] = iResolution;
    iChannelResolution[3] = iResolution;
}`,R=window.requestAnimationFrame||window.mozRequestAnimationFrame||window.webkitRequestAnimationFrame||window.msRequestAnimationFrame,f=window.cancelAnimationFrame||window.mozCancelAnimationFrame||window.webkitCancelAnimationFrame||window.msCancelAnimationFrame,d=24*60*60;class y{constructor(t=!1){this._paused=t,this.ready=new Promise(e=>{this._readyResolve=e}),this._commonCode="",this.EXT_LOD=null,this.EXT_DERIVATIVES=null}get commonCode(){return this._commonCode}set commonCode(t){this._commonCode!==t&&(this._commonCode=t,this.programStore&&Object.keys(this.programStore).forEach(e=>{this.updateProgram(e)}))}initVertex(){this.vertexBuffer=this.gl.createBuffer(),this.gl.bindBuffer(this.gl.ARRAY_BUFFER,this.vertexBuffer),this.gl.bufferData(this.gl.ARRAY_BUFFER,new Float32Array([1,1,-1,1,1,-1,-1,-1]),this.gl.STATIC_DRAW)}get paused(){return this._paused}set paused(t){this._paused=t,f(this.timer),t||this.autoRender()}init(t,e,r){this.canvas=t,this.canvasRect=e,this.commonCode=r,this.gl=t.getContext("webgl",{alpha:!0}),this.setExtension(),this.initVertex(),this.iResolution=[this.gl.drawingBufferWidth,this.gl.drawingBufferHeight,0],this.iMouse=[0,0,0,0],this.resetTime(),this.gl.clearColor(0,0,0,0),this.gl.pixelStorei(this.gl.UNPACK_FLIP_Y_WEBGL,!0),this.gl.enable(this.gl.BLEND),this.gl.blendFunc(this.gl.SRC_ALPHA,this.gl.ONE_MINUS_SRC_ALPHA),this.initVertShader(),this.setSize(),this.event(),this.paused||this.autoRender(),this._readyResolve()}setExtension(){const t=this.gl.getExtension("OES_texture_half_float");this.EXT_FLOAT=t&&t.HALF_FLOAT_OES||this.gl.UNSIGNED_BYTE,this.gl.getExtension("OES_texture_half_float_linear"),this.EXT_DERIVATIVES=this.gl.getExtension("OES_standard_derivatives"),this.EXT_LOD=this.gl.getExtension("EXT_shader_texture_lod")}setSize(){this.gl.viewport(0,0,this.iResolution[0],this.iResolution[1])}resetTime(){this.iTime=this.iTimeDelta=this.iFrame=0;const t=new Date;this.initTime=t.getTime()/1e3,this.iDate=[t.getFullYear(),t.getMonth(),t.getDate(),this.initTime/1e3%d]}event(){const t=e=>{this.iMouse[0]=(e.pageX-this.canvasRect.left)*this.gl.drawingBufferWidth/this.canvasRect.width,this.iMouse[1]=(this.canvasRect.height-(e.pageY-this.canvasRect.top))*this.gl.drawingBufferHeight/this.canvasRect.height};this.canvas.addEventListener("touchstart",e=>{this.iMouse[2]=this.iMouse[3]=1,t(e.touches[0])},!1),this.canvas.addEventListener("mousedown",e=>{this.iMouse[2]=this.iMouse[3]=1,t(e)},!1),this.canvas.addEventListener("touchmove",e=>{e.stopPropagation(),e.preventDefault(),t(e.touches[0])},!1),this.canvas.addEventListener("mousemove",t,!1),this.canvas.addEventListener("touchend",()=>{this.iMouse[2]=this.iMouse[3]=0},!1),this.canvas.addEventListener("mouseup",()=>{this.iMouse[2]=this.iMouse[3]=0},!1)}autoRender(){const t=new Date,e=t.getTime()/1e3,r=e-this.initTime;this.iTimeDelta=r-this.iTime,this.iTime=r,this.iDate=[t.getFullYear(),t.getMonth(),t.getDate(),e%d],this.iFrame++,this.render(),this.timer=R(()=>{this.autoRender()})}render(){Object.keys(this.programStore).forEach(t=>{const e=this.programStore[t],r=e.program;if(!r)return;this.gl.bindFramebuffer(this.gl.FRAMEBUFFER,e.frameBuffer||null),t!=="main"&&([e.frameTexture,e.cacheTexture]=[e.cacheTexture,e.frameTexture],this.gl.bindTexture(this.gl.TEXTURE_2D,e.frameTexture),this.gl.framebufferTexture2D(this.gl.FRAMEBUFFER,this.gl.COLOR_ATTACHMENT0,this.gl.TEXTURE_2D,e.frameTexture,0)),this.gl.useProgram(r),this.gl.bindBuffer(this.gl.ARRAY_BUFFER,this.vertexBuffer);const m=e.defaultLocation.aPosition;this.gl.vertexAttribPointer(m,2,this.gl.FLOAT,!1,0,0),this.gl.enableVertexAttribArray(m),this.gl.uniform3fv(e.defaultLocation.iResolution,this.iResolution),this.gl.uniform1f(e.defaultLocation.iTime,this.iTime),this.gl.uniform1f(e.defaultLocation.iTimeDelta,this.iTimeDelta),this.gl.uniform1i(e.defaultLocation.iFrame,this.iFrame),this.gl.uniform4fv(e.defaultLocation.iMouse,this.iMouse),this.gl.uniform4fv(e.defaultLocation.iDate,this.iDate),Object.values(e.uniform).forEach(i=>{switch(i.type){case"int":this.gl.uniform1i(i.id,i.value);break;case"float":this.gl.uniform1f(i.id,i.value);break;case"vec2":this.gl.uniform2fv(i.id,i.value);break;case"vec3":this.gl.uniform3fv(i.id,i.value);break;case"vec4":this.gl.uniform4fv(i.id,i.value);break;case"mat2":this.gl.uniformMatrix2fv(i.id,!1,i.value);break;case"mat3":this.gl.uniformMatrix3fv(i.id,!1,i.value);break;case"mat4":this.gl.uniformMatrix4fv(i.id,!1,i.value);break;case"sampler2D":{if(i.textureData){const n=i.textureData;if(this.gl.activeTexture(this.gl.TEXTURE0+n.id),this.gl.uniform1i(i.id,n.id),n.image)this.gl.bindTexture(this.gl.TEXTURE_2D,n.texture),n.image instanceof HTMLImageElement||this.gl.texImage2D(this.gl.TEXTURE_2D,0,this.gl.RGBA,this.gl.RGBA,this.gl.UNSIGNED_BYTE,n.image);else if(this.programStore[i.value]){const o=[this.gl.CLAMP_TO_EDGE,this.gl.REPEAT,this.gl.MIRRORED_REPEAT],s=this.programStore[i.value].cacheTexture;this.gl.bindTexture(this.gl.TEXTURE_2D,s),this.gl.texParameteri(this.gl.TEXTURE_2D,this.gl.TEXTURE_WRAP_S,o[n.repeatX]),this.gl.texParameteri(this.gl.TEXTURE_2D,this.gl.TEXTURE_WRAP_T,o[n.repeatY])}}break}case"samplerCube":{if(i.textureData){const n=i.textureData;if(this.gl.activeTexture(this.gl.TEXTURE0+n.id),this.gl.uniform1i(i.id,n.id),this.gl.bindTexture(this.gl.TEXTURE_CUBE_MAP,n.texture),n.imageCube){const o={front:this.gl.TEXTURE_CUBE_MAP_POSITIVE_Z,back:this.gl.TEXTURE_CUBE_MAP_NEGATIVE_Z,left:this.gl.TEXTURE_CUBE_MAP_POSITIVE_X,right:this.gl.TEXTURE_CUBE_MAP_NEGATIVE_X,top:this.gl.TEXTURE_CUBE_MAP_NEGATIVE_Y,bottom:this.gl.TEXTURE_CUBE_MAP_POSITIVE_Y};Object.keys(n.imageCube).forEach(s=>{const h=n.imageCube[s],l=o[s];h&&!(h instanceof HTMLImageElement)&&this.gl.texImage2D(l,0,this.gl.RGBA,this.gl.RGBA,this.gl.UNSIGNED_BYTE,h)})}}break}}}),this.gl.clear(this.gl.COLOR_BUFFER_BIT),this.gl.drawArrays(this.gl.TRIANGLE_STRIP,0,4)}),this.onUpdate&&this.onUpdate()}destroy(){f(this.timer),Object.values(this.programStore).forEach(e=>{this.gl.deleteProgram(e.program),this.gl.deleteShader(e.fragShader),e.fragShader=null,e.program=null}),this.programStore=null,this.gl.deleteBuffer(this.vertexBuffer),this.vertexBuffer=null,this.gl.deleteShader(this.vertShader),this.vertexBuffer=null,this.canvas.style.display="none";const t=this.gl.getExtension("WEBGL_lose_context");t&&t.loseContext()}initUniform(t,e,r,m,i,n){const o=this.programStore[t].uniform;if(o[e])throw new Error(`Multiple registration uniform: ${e}`);o[e]={id:null,type:r,value:m},r==="sampler2D"&&(o[e].textureData={id:this.programStore[t].textureLen++,texture:null,repeatX:i,repeatY:n}),r==="samplerCube"&&(o[e].textureData={id:this.programStore[t].textureLen++,texture:null,repeatX:0,repeatY:0})}initTexture(t,e,r,m,i,n,o,s){this.gl.useProgram(t),this.gl.activeTexture(this.gl.TEXTURE0+m),this.gl.bindTexture(i,e),this.gl.texImage2D(n,0,this.gl.RGBA,this.gl.RGBA,this.gl.UNSIGNED_BYTE,r);const h=r.naturalWidth||r.videoWidth||r.width,l=r.naturalHeight||r.videoHeight||r.height;!(h&h-1)&&!(l&l-1)?this.gl.generateMipmap(i):this.gl.texParameteri(i,this.gl.TEXTURE_MIN_FILTER,this.gl.LINEAR),this.gl.texParameteri(i,this.gl.TEXTURE_WRAP_S,o),this.gl.texParameteri(i,this.gl.TEXTURE_WRAP_T,s)}setUniform(t,e,r,m,i){const n=this.programStore[t];if(!n.program)return;const o=n.uniform[e];if(o.value=r,this.gl.useProgram(n.program),o.id===null&&(o.id=this.gl.getUniformLocation(n.program,e)),o.type==="sampler2D"){const s=o.textureData,h=[this.gl.CLAMP_TO_EDGE,this.gl.REPEAT,this.gl.MIRRORED_REPEAT];s.texture||(s.texture=this.gl.createTexture()),typeof o.value=="string"&&o.value.search(/\.(jpg|png)$|^data\:image/)>=0?(!s.image||(s.image.src||"").indexOf(o.value)<0)&&(s.image=new Image,s.image.crossOrigin="anonymous",s.image.onload=()=>{m!==void 0&&(s.repeatX=m),i!==void 0&&(s.repeatY=i),this.initTexture(n.program,s.texture,s.image,s.id,this.gl.TEXTURE_2D,this.gl.TEXTURE_2D,h[s.repeatX],h[s.repeatY])},s.image.src=o.value):o.value instanceof HTMLElement&&(s.image=r,m!==void 0&&(s.repeatX=m),i!==void 0&&(s.repeatY=i),this.initTexture(n.program,s.texture,s.image,s.id,this.gl.TEXTURE_2D,this.gl.TEXTURE_2D,h[s.repeatX],h[s.repeatY])),m!==void 0&&i!==void 0&&(s.repeatX!==m||s.repeatY!==i)&&(s.repeatX=m,s.repeatY=i,this.gl.texParameteri(this.gl.TEXTURE_2D,this.gl.TEXTURE_WRAP_S,h[s.repeatX]),this.gl.texParameteri(this.gl.TEXTURE_2D,this.gl.TEXTURE_WRAP_T,h[s.repeatY]))}if(o.type==="samplerCube"){const s=[this.gl.CLAMP_TO_EDGE,this.gl.REPEAT,this.gl.MIRRORED_REPEAT],h={front:this.gl.TEXTURE_CUBE_MAP_POSITIVE_Z,back:this.gl.TEXTURE_CUBE_MAP_NEGATIVE_Z,left:this.gl.TEXTURE_CUBE_MAP_POSITIVE_X,right:this.gl.TEXTURE_CUBE_MAP_NEGATIVE_X,top:this.gl.TEXTURE_CUBE_MAP_NEGATIVE_Y,bottom:this.gl.TEXTURE_CUBE_MAP_POSITIVE_Y},l=o.textureData;l.texture||(l.texture=this.gl.createTexture()),l.imageCube||(l.imageCube={front:null,back:null,left:null,right:null,top:null,bottom:null}),Object.keys(l.imageCube).forEach(u=>{if(typeof o.value[u]=="string"){const c=new Image;l.imageCube[u]=c,c.crossOrigin="anonymous",c.onload=()=>{this.initTexture(n.program,l.texture,c,l.id,this.gl.TEXTURE_CUBE_MAP,h[u],s[l.repeatX],s[l.repeatY])},c.src=o.value[u]}else{l.imageCube[u]=o.value[u];const c=l.imageCube[u];this.initTexture(n.program,l.texture,c,l.id,this.gl.TEXTURE_CUBE_MAP,h[u],s[l.repeatX],s[l.repeatY])}})}}initProgram(t,e){if(this.programStore||(this.programStore={}),this.programStore[t])throw new Error(`Multiple registration program: ${t}`);this.programStore[t]={uniform:{},defaultLocation:{iResolution:null,iTime:null,iTimeDelta:null,iFrame:null,iMouse:null,iDate:null,aPosition:null},fragShader:null,fragCode:e,program:null,textureLen:0}}initVertShader(){if(this.vertShader&&this.gl.deleteShader(this.vertShader),this.vertShader=this.gl.createShader(this.gl.VERTEX_SHADER),this.gl.shaderSource(this.vertShader,v),this.gl.compileShader(this.vertShader),!this.gl.getShaderParameter(this.vertShader,this.gl.COMPILE_STATUS)){let t=1;const e=this.vertShader;console.warn((t+"	|"+this.gl.getShaderSource(e)).replace(/\n/g,()=>`
${++t}	|`)),console.error(new Error(`VertShaderError: 
	${this.gl.getShaderInfoLog(this.vertShader)}
`))}}initFragShader(t){const e=this.programStore[t];e.fragShader&&this.gl.deleteShader(e.fragShader),e.fragShader=this.gl.createShader(this.gl.FRAGMENT_SHADER);const r=this.initFragCode(e);if(this.gl.shaderSource(e.fragShader,r),this.gl.compileShader(e.fragShader),!this.gl.getShaderParameter(e.fragShader,this.gl.COMPILE_STATUS)){let m=1;const i=e.fragShader;console.warn((m+"	|"+this.gl.getShaderSource(i)).replace(/\n/g,()=>`
${++m}	|`)),console.error(Error(`fragShaderError(${t}): 
	${this.gl.getShaderInfoLog(e.fragShader)}`))}}initFragCode(t){let e=(this.commonCode||"")+`
`+t.fragCode;e=e.replace(/precision[a-zA-Z0-9 ]+;|uniform[^;];/g,"");let r="";Object.keys(t.uniform).forEach(i=>{r+=`uniform ${t.uniform[i].type} ${i};
`});let m="";return this.EXT_DERIVATIVES&&(m+=`#ifdef GL_OES_standard_derivatives
    #extension GL_OES_standard_derivatives : enable
#endif
`),this.EXT_LOD&&(m+=`#extension GL_EXT_shader_texture_lod : enable
`),e=m+`
precision highp float;
precision highp int;
uniform int iFrame;
varying vec4 v_iResolution_iMouse_iDate[3];
varying float iChannelTime[4];
varying vec3 iChannelResolution[4];

#define v_iResolution v_iResolution_iMouse_iDate[0]
#define v_iMouse v_iResolution_iMouse_iDate[1]
#define v_iDate v_iResolution_iMouse_iDate[2]
#define iResolution v_iResolution.xyz
#define iTime v_iResolution.w
#define iTimeDelta v_iMouse.w
#define iMouse v_iMouse.xyzz
#define iDate v_iDate

//webGL2 type
#define uint int
#define uvec2 ivec2
#define uvec3 ivec3
#define uvec4 ivec4

//math function
#define round(x) floor(x + 0.5)
float trunc( float x, float n ) { return floor(x*n)/n; }
mat3 transpose(mat3 m) { return mat3(m[0].x, m[1].x, m[2].x, m[0].y, m[1].y, m[2].y, m[0].z, m[1].z, m[2].z); }
float determinant( in mat2 m ) { return m[0][0]*m[1][1] - m[0][1]*m[1][0]; }
float determinant( mat4 m ) { float b00 = m[0][0] * m[1][1] - m[0][1] * m[1][0], b01 = m[0][0] * m[1][2] - m[0][2] * m[1][0], b02 = m[0][0] * m[1][3] - m[0][3] * m[1][0], b03 = m[0][1] * m[1][2] - m[0][2] * m[1][1], b04 = m[0][1] * m[1][3] - m[0][3] * m[1][1], b05 = m[0][2] * m[1][3] - m[0][3] * m[1][2], b06 = m[2][0] * m[3][1] - m[2][1] * m[3][0], b07 = m[2][0] * m[3][2] - m[2][2] * m[3][0], b08 = m[2][0] * m[3][3] - m[2][3] * m[3][0], b09 = m[2][1] * m[3][2] - m[2][2] * m[3][1], b10 = m[2][1] * m[3][3] - m[2][3] * m[3][1], b11 = m[2][2] * m[3][3] - m[2][3] * m[3][2];  return b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;}
mat2 inverse(mat2 m) { float det = determinant(m); return mat2(m[1][1], -m[0][1], -m[1][0], m[0][0]) / det; }
mat4 inverse(mat4 m ) { float inv0 = m[1].y*m[2].z*m[3].w - m[1].y*m[2].w*m[3].z - m[2].y*m[1].z*m[3].w + m[2].y*m[1].w*m[3].z + m[3].y*m[1].z*m[2].w - m[3].y*m[1].w*m[2].z; float inv4 = -m[1].x*m[2].z*m[3].w + m[1].x*m[2].w*m[3].z + m[2].x*m[1].z*m[3].w - m[2].x*m[1].w*m[3].z - m[3].x*m[1].z*m[2].w + m[3].x*m[1].w*m[2].z; float inv8 = m[1].x*m[2].y*m[3].w - m[1].x*m[2].w*m[3].y - m[2].x  * m[1].y * m[3].w + m[2].x  * m[1].w * m[3].y + m[3].x * m[1].y * m[2].w - m[3].x * m[1].w * m[2].y; float inv12 = -m[1].x  * m[2].y * m[3].z + m[1].x  * m[2].z * m[3].y +m[2].x  * m[1].y * m[3].z - m[2].x  * m[1].z * m[3].y - m[3].x * m[1].y * m[2].z + m[3].x * m[1].z * m[2].y; float inv1 = -m[0].y*m[2].z * m[3].w + m[0].y*m[2].w * m[3].z + m[2].y  * m[0].z * m[3].w - m[2].y  * m[0].w * m[3].z - m[3].y * m[0].z * m[2].w + m[3].y * m[0].w * m[2].z; float inv5 = m[0].x  * m[2].z * m[3].w - m[0].x  * m[2].w * m[3].z - m[2].x  * m[0].z * m[3].w + m[2].x  * m[0].w * m[3].z + m[3].x * m[0].z * m[2].w - m[3].x * m[0].w * m[2].z; float inv9 = -m[0].x  * m[2].y * m[3].w +  m[0].x  * m[2].w * m[3].y + m[2].x  * m[0].y * m[3].w - m[2].x  * m[0].w * m[3].y - m[3].x * m[0].y * m[2].w + m[3].x * m[0].w * m[2].y; float inv13 = m[0].x  * m[2].y * m[3].z - m[0].x  * m[2].z * m[3].y - m[2].x  * m[0].y * m[3].z + m[2].x  * m[0].z * m[3].y + m[3].x * m[0].y * m[2].z - m[3].x * m[0].z * m[2].y; float inv2 = m[0].y  * m[1].z * m[3].w - m[0].y  * m[1].w * m[3].z - m[1].y  * m[0].z * m[3].w + m[1].y  * m[0].w * m[3].z + m[3].y * m[0].z * m[1].w - m[3].y * m[0].w * m[1].z; float inv6 = -m[0].x  * m[1].z * m[3].w + m[0].x  * m[1].w * m[3].z + m[1].x  * m[0].z * m[3].w - m[1].x  * m[0].w * m[3].z - m[3].x * m[0].z * m[1].w + m[3].x * m[0].w * m[1].z; float inv10 = m[0].x  * m[1].y * m[3].w - m[0].x  * m[1].w * m[3].y - m[1].x  * m[0].y * m[3].w + m[1].x  * m[0].w * m[3].y + m[3].x * m[0].y * m[1].w - m[3].x * m[0].w * m[1].y; float inv14 = -m[0].x  * m[1].y * m[3].z + m[0].x  * m[1].z * m[3].y + m[1].x  * m[0].y * m[3].z - m[1].x  * m[0].z * m[3].y - m[3].x * m[0].y * m[1].z + m[3].x * m[0].z * m[1].y; float inv3 = -m[0].y * m[1].z * m[2].w + m[0].y * m[1].w * m[2].z + m[1].y * m[0].z * m[2].w - m[1].y * m[0].w * m[2].z - m[2].y * m[0].z * m[1].w + m[2].y * m[0].w * m[1].z; float inv7 = m[0].x * m[1].z * m[2].w - m[0].x * m[1].w * m[2].z - m[1].x * m[0].z * m[2].w + m[1].x * m[0].w * m[2].z + m[2].x * m[0].z * m[1].w - m[2].x * m[0].w * m[1].z; float inv11 = -m[0].x * m[1].y * m[2].w + m[0].x * m[1].w * m[2].y + m[1].x * m[0].y * m[2].w - m[1].x * m[0].w * m[2].y - m[2].x * m[0].y * m[1].w + m[2].x * m[0].w * m[1].y; float inv15 = m[0].x * m[1].y * m[2].z - m[0].x * m[1].z * m[2].y - m[1].x * m[0].y * m[2].z + m[1].x * m[0].z * m[2].y + m[2].x * m[0].y * m[1].z - m[2].x * m[0].z * m[1].y; float det = m[0].x * inv0 + m[0].y * inv4 + m[0].z * inv8 + m[0].w * inv12; det = 1.0 / det; return det*mat4( inv0, inv1, inv2, inv3,inv4, inv5, inv6, inv7,inv8, inv9, inv10, inv11,inv12, inv13, inv14, inv15);}
float sinh(float x)  { return (exp(x)-exp(-x))/2.; }
float cosh(float x)  { return (exp(x)+exp(-x))/2.; }
float tanh(float x)  { return sinh(x)/cosh(x); }
float coth(float x)  { return cosh(x)/sinh(x); }
float sech(float x)  { return 1./cosh(x); }
float csch(float x)  { return 1./sinh(x); }
float asinh(float x) { return    log(x+sqrt(x*x+1.)); }
float acosh(float x) { return    log(x+sqrt(x*x-1.)); }
float atanh(float x) { return .5*log((1.+x)/(1.-x)); }
float acoth(float x) { return .5*log((x+1.)/(x-1.)); }
float asech(float x) { return    log((1.+sqrt(1.-x*x))/x); }
float acsch(float x) { return    log((1.+sqrt(1.+x*x))/x); }

//texture function
vec4 texture(sampler2D sampler, vec2 coord, float bias){
    return texture2D(sampler, coord, bias);
}
vec4 texture(sampler2D sampler, vec2 coord){
    return texture2D(sampler, coord);
}
vec4 texture(sampler2D sampler, vec3 coord, float bias){
    return texture(sampler, coord.xy, bias);
}
vec4 texture(sampler2D sampler, vec3 coord){
    return texture(sampler, coord.xy);
}
vec4 texture(samplerCube sampler, vec3 coord, float bias){
    return textureCube(sampler, -coord, bias);
}
vec4 texture(samplerCube sampler, vec3 coord){
    return textureCube(sampler, -coord);
}
`+(this.EXT_LOD?`
#define textureLod texture2DLodEXT
#define textureGrad texture2DGradEXT
vec4 texelFetch(sampler2D sampler, ivec2 coord, int bias){
    return textureLod(sampler, vec2(coord)/iResolution.xy, float(bias));
}

`:"")+r+e,e.search(/void\s+main\s*\(/)<0&&(e+=`

void main(){
    gl_FragColor = vec4(1);
    mainImage(gl_FragColor, gl_FragCoord.xy);
}
`),e}async updateProgram(t,e){await this.ready;const r=this.programStore[t];r.program&&this.gl.deleteProgram(r.program),e&&(r.fragCode=e),this.initFragShader(t);const m=this.gl.createProgram();if(r.program=m,this.gl.attachShader(m,this.vertShader),this.gl.attachShader(m,r.fragShader),this.gl.linkProgram(m),!this.gl.getProgramParameter(m,this.gl.LINK_STATUS))throw new Error(`ProgramError(${t}): 
	${this.gl.getProgramInfoLog(m)}`);t!="main"&&(r.frameTexture=this.gl.createTexture(),this.gl.bindTexture(this.gl.TEXTURE_2D,r.frameTexture),this.gl.texImage2D(this.gl.TEXTURE_2D,0,this.gl.RGBA,this.iResolution[0],this.iResolution[1],0,this.gl.RGBA,this.EXT_FLOAT,null),this.gl.texParameteri(this.gl.TEXTURE_2D,this.gl.TEXTURE_MIN_FILTER,this.gl.NEAREST),this.gl.texParameteri(this.gl.TEXTURE_2D,this.gl.TEXTURE_MAG_FILTER,this.gl.NEAREST),r.cacheTexture=this.gl.createTexture(),this.gl.bindTexture(this.gl.TEXTURE_2D,r.cacheTexture),this.gl.texImage2D(this.gl.TEXTURE_2D,0,this.gl.RGBA,this.iResolution[0],this.iResolution[1],0,this.gl.RGBA,this.EXT_FLOAT,null),this.gl.texParameteri(this.gl.TEXTURE_2D,this.gl.TEXTURE_MIN_FILTER,this.gl.NEAREST),this.gl.texParameteri(this.gl.TEXTURE_2D,this.gl.TEXTURE_MAG_FILTER,this.gl.NEAREST),r.frameBuffer=this.gl.createFramebuffer(),this.gl.bindFramebuffer(this.gl.FRAMEBUFFER,r.frameBuffer)),Object.keys(r.uniform).forEach(i=>{const n=r.uniform[i];r.program&&(this.gl.useProgram(r.program),n.id=this.gl.getUniformLocation(r.program,i),this.setUniform(t,i,r.uniform[i].value))}),Object.keys(r.defaultLocation).forEach(i=>{switch(i){case"aPosition":r.defaultLocation[i]=this.gl.getAttribLocation(m,i);break;default:r.defaultLocation[i]=this.gl.getUniformLocation(m,i)}})}}const w=x({emits:["update"],provide(){return{glContext:this.glContext}},props:{paused:{type:Boolean,default:!1},width:{type:[String,Number],default:null},height:{type:[String,Number],default:null},code:{type:String,default:""}},watch:{code(a){this.glContext.commonCode=a},paused(a){this.glContext.paused=a}},data(){return{canvasRect:null,glContext:new y(this.paused)}},methods:{setSize(){const a=this.$refs.canvas,t=a.parentElement;a.width=(isNaN(+this.width)?"":+this.width)||t.clientWidth,a.height=(isNaN(+this.height)?"":+this.height)||t.clientHeight,this.canvasRect=a.getBoundingClientRect();const e=this.glContext;e.init(a,this.canvasRect,this.code),e.onUpdate=()=>{this.$emit("update",{iResolution:[...e.iResolution],iTime:e.iTime,iTimeDelta:e.iTimeDelta,iFrame:e.iFrame,iMouse:[...e.iMouse],iDate:[...e.iDate]})}}},mounted(){this.setSize()},unmounted(){this.glContext.destroy()}}),S={ref:"canvas"};function b(a,t,e,r,m,i){return p(),_("canvas",S,[T(a.$slots,"default",{},void 0,!0)],512)}const A=E(w,[["render",b],["__scopeId","data-v-976c30f3"]]),D=x({inject:["glContext"],props:{name:{type:String,default:"main"},code:{type:String,default:""}},data(){return{timer:null}},created(){this.glContext.initProgram(this.name,this.code),this.updateProgram()},watch:{code(a){this.updateProgram(a)}},methods:{registerUniform(a){clearTimeout(this.timer),a.type.indexOf("sampler")>=0?this.glContext.initUniform(this.name,a.name,a.type,a.value,a._repeatX,a._repeatY):this.glContext.initUniform(this.name,a.name,a.type,a.value),this.updateProgram()},updateProgram(a){this.timer=setTimeout(()=>{this.glContext.updateProgram(this.name,a)},0)},setUniform(a){a.type.indexOf("sampler")>=0?this.glContext.setUniform(this.name,a.name,a.value,a._repeatX,a._repeatY):this.glContext.setUniform(this.name,a.name,a.value)}}});function U(a,t,e,r,m,i){return T(a.$slots,"default")}const C=E(D,[["render",U]]),g={name:"GLUniform",props:["name"],watch:{value(a){if(this.type==="samplerCube"){const t=["front","back","left","right","top","bottom"],e=JSON.stringify(t);if(Object.keys(a).sort().join("|").indexOf(t.sort().join("|"))<0)throw new Error(`
Type ${this.type}(${this.name}) value must contain:
	${e}
`)}this.$parent.setUniform(this)}},created(){this.$parent.registerUniform(this)}},M={name:"GlInt",mixins:[g],render:()=>null,props:{value:{type:Number,default:0}},data(){return{type:"int"}}},P={name:"GlFloat",mixins:[g],render:()=>null,props:{value:{type:Number,default:0}},data(){return{type:"float"}}},z={name:"GlVec2",mixins:[g],render:()=>null,props:{value:{type:Array,default:[0,0]}},data(){return{type:"vec2"}}},X={name:"GlVec3",mixins:[g],render:()=>null,props:{value:{type:Array,default:[0,0,0]}},data(){return{type:"vec3"}}},L={name:"GlVec4",mixins:[g],render:()=>null,props:{value:{type:Array,default:[0,0,0,0]}},data(){return{type:"vec4"}}},F={name:"GlMat2",mixins:[g],render:()=>null,props:{value:{type:Array,default:[0,0,0,0]}},data(){return{type:"mat2"}}},B={name:"GlMat3",mixins:[g],render:()=>null,props:{value:{type:Array,default:[0,0,0,0,0,0,0,0,0]}},data(){return{type:"mat3"}}},G={name:"GlMat4",mixins:[g],render:()=>null,props:{value:{type:Array,default:[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]}},data(){return{type:"mat4"}}},O={name:"GlTexture",mixins:[g],render:()=>null,props:{repeat:{type:Number,default:-1},repeatX:{type:Number,default:0},repeatY:{type:Number,default:0},value:{default:""}},computed:{type(){return typeof this.value=="string"||this.value instanceof HTMLElement?"sampler2D":"samplerCube"},_repeatX(){let a=this.repeatX;return this.repeat>=0&&(a=this.repeat),Math.max(0,Math.min(2,a))},_repeatY(){let a=this.repeatY;return this.repeat>=0&&(a=this.repeat),Math.max(0,Math.min(2,a))}},watch:{_repeatX(){this.type==="sampler2D"&&this.$parent.setUniform(this)},_repeatY(){this.type==="sampler2D"&&this.$parent.setUniform(this)}}};function N(a){a.component("gl-canvas",A),a.component("gl-program",C),a.component("gl-int",M),a.component("gl-float",P),a.component("gl-vec2",z),a.component("gl-vec3",X),a.component("gl-vec4",L),a.component("gl-mat2",F),a.component("gl-mat3",B),a.component("gl-mat4",G),a.component("gl-image",O)}export{N as default};
