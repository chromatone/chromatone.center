import{r as O,o as F,v as x,x as U,W as N,D as G,as as K}from"./chunks/framework.BG7tPuiF.js";var m=["x","y","z"],l=function(t){Object.assign(this,{uniforms:{},geometry:{vertices:[{x:0,y:0,z:0}]},mode:0,modifiers:{},attributes:[],multiplier:1,buffers:[]}),Object.assign(this,t),this.prepareProgram(),this.prepareUniforms(),this.prepareAttributes()};l.prototype.compileShader=function(t,o){var e=this.gl.createShader(t);return this.gl.shaderSource(e,o),this.gl.compileShader(e),e},l.prototype.prepareProgram=function(){var t=this.gl,o=this.vertex,e=this.fragment,a=t.createProgram();t.attachShader(a,this.compileShader(35633,o)),t.attachShader(a,this.compileShader(35632,e)),t.linkProgram(a),t.useProgram(a),this.program=a},l.prototype.prepareUniforms=function(){for(var t=Object.keys(this.uniforms),o=0;o<t.length;o+=1){var e=this.gl.getUniformLocation(this.program,t[o]);this.uniforms[t[o]].location=e}},l.prototype.prepareAttributes=function(){this.geometry.vertices!==void 0&&this.attributes.push({name:"aPosition",size:3}),this.geometry.normal!==void 0&&this.attributes.push({name:"aNormal",size:3}),this.attributeKeys=[];for(var t=0;t<this.attributes.length;t+=1)this.attributeKeys.push(this.attributes[t].name),this.prepareAttribute(this.attributes[t])},l.prototype.prepareAttribute=function(t){for(var o=this.geometry,e=this.multiplier,a=o.vertices,s=o.normal,r=new Float32Array(e*a.length*t.size),i=0;i<e;i+=1)for(var n=t.data&&t.data(i,e),c=i*a.length*t.size,u=0;u<a.length;u+=1)for(var d=0;d<t.size;d+=1){var y=this.modifiers[t.name];r[c]=y!==void 0?y(n,u,d,this):t.name==="aPosition"?a[u][m[d]]:t.name==="aNormal"?s[u][m[d]]:n[d],c+=1}this.attributes[this.attributeKeys.indexOf(t.name)].data=r,this.prepareBuffer(this.attributes[this.attributeKeys.indexOf(t.name)])},l.prototype.prepareBuffer=function(t){var o=t.data,e=t.name,a=t.size,s=this.gl.createBuffer();this.gl.bindBuffer(34962,s),this.gl.bufferData(34962,o,35044);var r=this.gl.getAttribLocation(this.program,e);this.gl.enableVertexAttribArray(r),this.gl.vertexAttribPointer(r,a,5126,!1,0,0),this.buffers[this.attributeKeys.indexOf(t.name)]={buffer:s,location:r,size:a}},l.prototype.render=function(t){var o=this,e=this.uniforms,a=this.multiplier,s=this.gl;s.useProgram(this.program);for(var r=0;r<this.buffers.length;r+=1){var i=this.buffers[r],n=i.location,c=i.buffer,u=i.size;s.enableVertexAttribArray(n),s.bindBuffer(34962,c),s.vertexAttribPointer(n,u,5126,!1,0,0)}Object.keys(t).forEach(function(d){e[d].value=t[d].value}),Object.keys(e).forEach(function(d){var y=e[d];o.uniformMap[y.type](y.location,y.value)}),s.drawArrays(this.mode,0,a*this.geometry.vertices.length),this.onRender&&this.onRender(this)},l.prototype.destroy=function(){for(var t=0;t<this.buffers.length;t+=1)this.gl.deleteBuffer(this.buffers[t].buffer);this.gl.deleteProgram(this.program),this.gl=null};var h=function(t){var o=this,e=t||{},a=e.canvas;a===void 0&&(a=document.querySelector("canvas"));var s=e.context;s===void 0&&(s={});var r=e.contextType;r===void 0&&(r="experimental-webgl");var i=e.settings;i===void 0&&(i={});var n=a.getContext(r,Object.assign({alpha:!1,antialias:!1},s));Object.assign(this,{gl:n,canvas:a,uniforms:{},instances:new Map,shouldRender:!0}),Object.assign(this,{devicePixelRatio:1,clearColor:[1,1,1,1],position:{x:0,y:0,z:2},clip:[.001,100]}),Object.assign(this,i),this.uniformMap={float:function(c,u){return n.uniform1f(c,u)},vec2:function(c,u){return n.uniform2fv(c,u)},vec3:function(c,u){return n.uniform3fv(c,u)},vec4:function(c,u){return n.uniform4fv(c,u)},mat2:function(c,u){return n.uniformMatrix2fv(c,!1,u)},mat3:function(c,u){return n.uniformMatrix3fv(c,!1,u)},mat4:function(c,u){return n.uniformMatrix4fv(c,!1,u)}},n.enable(n.DEPTH_TEST),n.depthFunc(n.LEQUAL),n.getContextAttributes().alpha===!1&&(n.clearColor.apply(n,this.clearColor),n.clearDepth(1)),this.onSetup&&this.onSetup(n),window.addEventListener("resize",function(){return o.resize()}),this.resize(),this.render()};h.prototype.resize=function(){var t=this.gl,o=this.canvas,e=this.devicePixelRatio,a=this.position;o.width=o.clientWidth*e,o.height=o.clientHeight*e;var s=t.drawingBufferWidth,r=t.drawingBufferHeight,i=s/r;t.viewport(0,0,s,r);var n=Math.tan(Math.PI/180*22.5),c=[1,0,0,0,0,1,0,0,0,0,1,0,a.x,a.y,(i<1?1:i)*-a.z,1];this.uniforms.uProjectionMatrix={type:"mat4",value:[.5/n,0,0,0,0,i/n*.5,0,0,0,0,-(this.clip[1]+this.clip[0])/(this.clip[1]-this.clip[0]),-1,0,0,-2*this.clip[1]*(this.clip[0]/(this.clip[1]-this.clip[0])),0]},this.uniforms.uViewMatrix={type:"mat4",value:[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1]},this.uniforms.uModelMatrix={type:"mat4",value:c}},h.prototype.toggle=function(t){t!==this.shouldRender&&(this.shouldRender=t!==void 0?t:!this.shouldRender,this.shouldRender&&this.render())},h.prototype.render=function(){var t=this;this.gl.clear(16640),this.instances.forEach(function(o){o.render(t.uniforms)}),this.onRender&&this.onRender(this),this.shouldRender&&requestAnimationFrame(function(){return t.render()})},h.prototype.add=function(t,o){o===void 0&&(o={uniforms:{}}),o.uniforms===void 0&&(o.uniforms={}),Object.assign(o.uniforms,JSON.parse(JSON.stringify(this.uniforms))),Object.assign(o,{gl:this.gl,uniformMap:this.uniformMap});var e=new l(o);return this.instances.set(t,e),e},h.prototype.remove=function(t){var o=this.instances.get(t);o!==void 0&&(o.destroy(),this.instances.delete(t))},h.prototype.destroy=function(){var t=this;this.instances.forEach(function(o,e){o.destroy(),t.instances.delete(e)}),this.toggle(!1)};var w="phi",C="theta",M="mapSamples",k="mapBrightness",P="baseColor",z="markerColor",B="glowColor",f="markers",R="diffuse",g="devicePixelRatio",T="dark",E="offset",_="scale",D="opacity",I="mapBaseBrightness",A={[w]:"A",[C]:"B",[M]:"l",[k]:"E",[P]:"R",[z]:"S",[B]:"y",[R]:"F",[T]:"G",[E]:"x",[_]:"C",[D]:"H",[I]:"I"},{PI:p,sin:v,cos:b}=Math,S=t=>[].concat(...t.map(o=>{let[e,a]=o.location;e=e*p/180,a=a*p/180-p;let s=b(e);return[-s*b(a),v(e),s*v(a),o.size]}),[0,0,0,0]),j=(t,o)=>{let e=(r,i,n)=>({type:r,value:typeof o[i]>"u"?n:o[i]}),a=t.getContext("webgl")?"webgl":"experimental-webgl",s=new h({canvas:t,contextType:a,context:{alpha:!0,stencil:!1,antialias:!0,depth:!1,preserveDrawingBuffer:!1,...o.context},settings:{[g]:o[g]||1,onSetup:r=>{let i=r.RGB,n=r.UNSIGNED_BYTE,c=r.TEXTURE_2D,u=r.createTexture();r.bindTexture(c,u),r.texImage2D(c,0,i,1,1,0,i,n,new Uint8Array([0,0,0,0]));let d=new Image;d.onload=()=>{r.bindTexture(c,u),r.texImage2D(c,0,i,i,n,d),r.generateMipmap(c);let y=r.getParameter(r.CURRENT_PROGRAM),L=r.getUniformLocation(y,"J");r.texParameteri(c,r.TEXTURE_MIN_FILTER,r.NEAREST),r.texParameteri(c,r.TEXTURE_MAG_FILTER,r.NEAREST),r.uniform1i(L,0)},d.src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAQAAAACAAQAAAADMzoqnAAAAAXNSR0IArs4c6QAABA5JREFUeNrV179uHEUAx/Hf3JpbF+E2VASBsmVKTBcpKJs3SMEDcDwBiVJAAewYEBUivIHT0uUBIt0YCovKD0CRjUC4QfHYh8hYXu+P25vZ2Zm9c66gMd/GJ/tz82d3bk8GN4SrByYF2366FNTACIAkivVAAazQdnf3MvAlbNUQfOPAdQDvSAimMWhwy4I2g4SU+Kp04ISLpPBAKLxPyic3O/CCi+Y7rUJbiodcpDOFY7CgxCEXmdYD2EYK2s5lApOx5pEDDYCUwM1XdJUwBV11QQMg59kePSCaPAASQMEL2hwo6TJFgxpg+TgC2ymXPbuvc40awr3D1QCFfbH9kcoqAOkZozpQo0aqAGQRKCog/+tjkgbNFEtg2FffBvBGlSxHoAaAa1u6X4PBAwDiR8FFsrQgeUhfJTSALaB9jy5NCybJPn1SVFiWk7ywN+KzhH1aKAuydhGkbEF4lWohLXDXavlyFgHY7LBnLRdlAP6BS5Cc8RfVDXbkwN/oIvmY+6obbNeBP0JwTuMGu9gTzy1Q4RS/cWpfzszeYwd+CAFrtBW/Hur0gLbJGlD+/OjVwe/drfBxkbbg63dndEDfiEBlAd7ac0BPe1D6Jd8dfbLH+RI0OzseFB5s01/M+gMdAeluLOCAuaUA9Lezo/vSgXoCX9rtEiXnp7Q1W/CNyWcd8DXoS6jH/YZ5vAJEWY2dXFQe2TUgaFaNejCzJ98g6HnlVrsE58sDcYqg+9XY75fPqdoh/kRQWiXKg8MWlJQxUFMPjqnyujhFBE7UxIMjyszk0QwQlFsezImsyvUYYYVED2pk6m0Tg8T04Fwjk2kdAwSACqlM6gRRt3vQYAFGX0Ah7Ebx1H+MDRI5ui0QldH4j7FGcm90XdxD2Jg1AOEAVAKhEFXSn4cKUELurIAKwJ3MArypPscQaLhJFICJ0ohjDySAdH8AhDtCiTuMycH8CXzhH9jUACAO5uMhoAwA5i+T6WAKmmAqnLy80wxHqIPFYpqCwxGaYLt4Dyievg5kEoVEUAhs6pqKgFtDQYOuaXypaWKQfIuwwoGSZgfLsu/XAtI8cGN+h7Cc1A5oLOMhwlIPXuhu48AIvsSBkvtV9wsJRKCyYLfq5lTrQMFd1a262oqBck9K1V0YjQg0iEYYgpS1A9GlXQV5cykwm4A7BzVsxQqo7E+zCegO7Ma7yKgsuOcfKbMBwLC8wvVNYDsANYalEpOAa6zpWjTeMKGwEwC1CiQewJc5EKfgy7GmRAZA4vUVGwE2dPM/g0xuAInE/yG5aZ8ISxWGfYigUVbdyBElTHh2uCwGdfCkOLGgQVBh3Ewp+/QK4CDlR5Ws/Zf7yhCf8pH7vinWAvoVCQ6zz0NX5V/6GkAVV+2/5qsJ/gU8bsxpM8IeAQAAAABJRU5ErkJggg=="}}});return s.add("",{vertex:"attribute vec3 aPosition;uniform mat4 uProjectionMatrix;uniform mat4 uModelMatrix;uniform mat4 uViewMatrix;void main(){gl_Position=uProjectionMatrix*uModelMatrix*uViewMatrix*vec4(aPosition,1.);}",fragment:"precision highp float;uniform vec2 t,x;uniform vec3 R,S,y;uniform vec4 z[64];uniform float A,B,l,C,D,E,F,G,H,I;uniform sampler2D J;float K=1./l;mat3 L(float a,float b){float c=cos(a),d=cos(b),e=sin(a),f=sin(b);return mat3(d,f*e,-f*c,0.,c,e,f,d*-e,d*c);}vec3 w(vec3 c,out float v){c=c.xzy;float p=max(2.,floor(log2(2.236068*l*3.141593*(1.-c.z*c.z))*.72021));vec2 g=floor(pow(1.618034,p)/2.236068*vec2(1.,1.618034)+.5),d=fract((g+1.)*.618034)*6.283185-3.883222,e=-2.*g,f=vec2(atan(c.y,c.x),c.z-1.),q=floor(vec2(e.y*f.x-d.y*(f.y*l+1.),-e.x*f.x+d.x*(f.y*l+1.))/(d.x*e.y-e.x*d.y));float n=3.141593;vec3 r;for(float h=0.;h<4.;h+=1.){vec2 s=vec2(mod(h,2.),floor(h*.5));float j=dot(g,q+s);if(j>l)continue;float a=j,b=0.;if(a>=524288.)a-=524288.,b+=.803894;if(a>=262144.)a-=262144.,b+=.901947;if(a>=131072.)a-=131072.,b+=.950973;if(a>=65536.)a-=65536.,b+=.475487;if(a>=32768.)a-=32768.,b+=.737743;if(a>=16384.)a-=16384.,b+=.868872;if(a>=8192.)a-=8192.,b+=.934436;if(a>=4096.)a-=4096.,b+=.467218;if(a>=2048.)a-=2048.,b+=.733609;if(a>=1024.)a-=1024.,b+=.866804;if(a>=512.)a-=512.,b+=.433402;if(a>=256.)a-=256.,b+=.216701;if(a>=128.)a-=128.,b+=.108351;if(a>=64.)a-=64.,b+=.554175;if(a>=32.)a-=32.,b+=.777088;if(a>=16.)a-=16.,b+=.888544;if(a>=8.)a-=8.,b+=.944272;if(a>=4.)a-=4.,b+=.472136;if(a>=2.)a-=2.,b+=.236068;if(a>=1.)a-=1.,b+=.618034;float k=fract(b)*6.283185,i=1.-2.*j*K,m=sqrt(1.-i*i);vec3 o=vec3(cos(k)*m,sin(k)*m,i);float u=length(c-o);if(u<n)n=u,r=o;}v=n;return r.xzy;}void main(){vec2 b=(gl_FragCoord.xy/t*2.-1.)/C-x*vec2(1.,-1.)/t;b.x*=t.x/t.y;float c=dot(b,b);vec4 M=vec4(0.);float m=0.;if(c<=.64){for(int d=0;d<2;d++){vec4 e=vec4(0.);float a;vec3 u=vec3(0.,0.,1.),f=normalize(vec3(b,sqrt(.64-c)));f.z*=d>0?-1.:1.,u.z*=d>0?-1.:1.;vec3 g=f*L(B,A),h=w(g,a);float n=asin(h.y),i=acos(-h.x/cos(n));i=h.z<0.?-i:i;float N=max(texture2D(J,vec2(i*.5/3.141593,-(n/3.141593+.5))).x,I),O=smoothstep(8e-3,0.,a),j=dot(f,u),v=pow(j,F)*E,o=N*O*v,T=mix((1.-o)*pow(j,.4),o,G)+.1;e+=vec4(R*T,1.);int U=int(D);float p=0.;for(int k=0;k<64;k++){if(k>=U)break;vec4 q=z[k];vec3 r=q.xyz,P=r-g;float s=q.w;if(dot(P,P)>s*s*4.)continue;vec3 V=w(r,a);a=length(V-g),a<s?p+=smoothstep(s*.5,0.,a):0.;}p=min(1.,p*v),e.xyz=mix(e.xyz,S,p),e.xyz+=pow(1.-j,4.)*y,M+=e*(1.+(d>0?-H:H))/2.;}m=pow(dot(normalize(vec3(-b,sqrt(1.-c))),vec3(0.,0.,1.)),4.)*smoothstep(0.,1.,.2/(c-.64));}else{float Q=sqrt(.2/(c-.64));m=smoothstep(.5,1.,Q/(Q+1.));}gl_FragColor=M+vec4(m*y,m);}",uniforms:{t:{type:"vec2",value:[o.width,o.height]},A:e("float",w),B:e("float",C),l:e("float",M),E:e("float",k),I:e("float",I),R:e("vec3",P),S:e("vec3",z),F:e("float",R),y:e("vec3",B),G:e("float",T),z:{type:"vec4",value:S(o[f])},D:{type:"float",value:o[f].length},x:e("vec2",E,[0,0]),C:e("float",_,1),H:e("float",D,1)},mode:4,geometry:{vertices:[{x:-100,y:100,z:0},{x:-100,y:-100,z:0},{x:100,y:100,z:0},{x:100,y:-100,z:0},{x:-100,y:-100,z:0},{x:100,y:100,z:0}]},onRender:({uniforms:r})=>{let i={};if(o.onRender){i=o.onRender(i)||i;for(let n in A)i[n]!==void 0&&(r[A[n]].value=i[n]);i[f]!==void 0&&(r.z.value=S(i[f]),r.D.value=i[f].length),i.width&&i.height&&(r.t.value=[i.width,i.height])}}}),s};const Q={__name:"MapGlobe",props:{dots:{type:Array,default:()=>[]},center:{type:Array,default:()=>[0,70]}},setup(t){const o=t,e=O();let a=0;const s=o.dots.map(r=>({location:r,size:.05}));return F(()=>{j(e.value,{devicePixelRatio:2,width:1e3,height:1e3,phi:0,theta:.28,dark:0,diffuse:1.2,mapSamples:16e3,mapBrightness:9,baseColor:[.8,.8,.8],markerColor:[.3,.9,.7],glowColor:[1,1,1],markers:[{location:o.center,size:0},...s],onRender:r=>{r.phi=a,a+=.0025}})}),(r,i)=>(x(),U("canvas",{class:"-z-4 top-0 right-0 scale-150 opacity-30 absolute max-w-500px h-500px m-auto rounded-2xl",ref_key:"canvas",ref:e},null,512))}},H={cities:[{city:"Moscow",country:"Russia",coord:[55.799996,37.722273]},{city:"Lambrecht",country:"Germany",coord:[49.36844,8.06908]},{city:"Tai Hang",country:"Hong Kong",coord:[22.278482,114.191555]},{city:"Springfield, MO",country:"USA",coord:[37.23644149305249,-93.31788335980335]},{city:"Boston, MA",country:"USA",coord:[42.34194113664735,-71.08229155779708]},{city:"Houston, TX",country:"USA",coord:[29.735028114813133,-95.39164122930882]},{city:"Seattle, WA",country:"USA",coord:[47.63706202239283,-122.32512540365461]},{city:"Austin, TX",country:"USA",coord:[30.39635002887474,-97.72578998886299]},{city:"Abu Dhabi",country:"UAE",coord:[24.49044273887996,54.36462952211651]},{city:"Seattle, WA",country:"USA",coord:[47.70480542895955,-122.30721498650125]},{city:"Austin, TX",country:"USA",coord:[30.39634077476088,-97.72569342934]},{city:"Maastricht",country:"Netherlands",coord:[50.845526102209426,5.727534942446412]},{city:"Canoga Park, CA",country:"USA",coord:[34.19040845978032,-118.63312948506535]},{city:"Boston, MA",country:"USA",coord:[42.3540225294268,-71.12804734805329]},{city:"Chelsea, MA",country:"USA",coord:[42.397355333588465,-71.05128758852892]},{city:"Ufa",country:"Russia",coord:[54.727504597860474,55.92887418491986]},{city:"Sollentuna",country:"Sweden",coord:[59.42713810896922,17.94741354092568]},{city:"Glasgow",country:"UK",coord:[55.84329900186399,-4.262568359216469]},{city:"San Jose, CA",country:"USA",coord:[37.368964030215004,-121.87021581566515]},{city:"Lisboa",country:"Portugal",coord:[38.72491728789344,-9.154708259805224]},{city:"Alpharetta, GA",country:"USA",coord:[34.05207299507581,-84.26252201575606]},{city:"Baltimore, MD",country:"USA",coord:[39.354498634297556,-76.63196285978663]},{city:"Bourges",country:"France",coord:[47.06495865556312,2.387234669297158]},{city:"Queens, NY",country:"USA",coord:[40.743396444096376,-73.95792044440105]},{city:"Boise, ID",country:"USA",coord:[43.61227314250574,-116.1839302596541]},{city:"Stockholm",country:"Sweden",coord:[59.34416947760414,18.02896214092233]},{city:"Leinfelden-Echterdingen",country:"Germany",coord:[48.70360695569888,9.117458569354266]},{city:"Birmingham, AL",country:"USA",coord:[33.415634743916165,-86.84714175810089]},{city:"Wien",country:"Austria",coord:[48.196427529398186,16.38395050002354]},{city:"Bettembourg",country:"Luxembourg",coord:[49.51528233796304,6.094764013562539]},{city:"Herne",country:"UK",coord:[51.555473375995234,7.2120092694571065]},{city:"Vilnius",country:"Lithuania",coord:[54.708154248113225,25.300905525396132]},{city:"Sejong",country:"South Korea",coord:[36.61755807694026,127.28611585138286]},{city:"Etagnières",country:"Switzerland",coord:[46.59853974595982,6.609985271132374]},{city:"Carmel, IN",country:"USA",coord:[39.966728109666334,-86.13818945976824]},{city:"New York, NY",country:"USA",coord:[40.73793185378023,-73.99603195789358]},{city:"Lindenhurst, NY",country:"USA",coord:[40.69751713068349,-73.38968707138714]},{city:"Miami, FL",country:"USA",coord:[25.753134305582403,-80.21235944663749]},{city:"Philadelphia, PA",country:"USA",coord:[39.97883708051853,-75.1227100542142]},{city:"Bristol",country:"UK",coord:[51.415332606772104,-2.6025003482766427]},{city:"Raleigh, NC",country:"USA",coord:[35.876551340835555,-78.63878060221454]},{city:"Sanda, Hyogo",country:"Japan",coord:[34.93838040065808,135.203640540088]},{city:"Rennes",country:"France",coord:[48.10122420012787,-1.687018017174579]},{city:"Myrtle Beach, SC",country:"USA",coord:[33.87656853408961,-78.94440235343117]},{city:"Lubbock, TX",country:"USA",coord:[33.57997829383441,-101.90378078508132]},{city:"Singapore",country:"Singapore",coord:[1.270687986137204,103.81392790597627]},{city:"Oxfordshire",country:"UK",coord:[51.5473289025092,-.9048854450430958]},{city:"West Sussex",country:"UK",coord:[50.84780791570482,-.39353173741211933]},{city:"Münsing",country:"Germany",coord:[47.864920752611894,11.334687654748803]},{city:"Oxford, MS",country:"USA",coord:[34.375485682799706,-89.56731479008573]},{city:"Plano, TX",country:"USA",coord:[33.0331150889832,-96.69670981897664]},{city:"Västerås",country:"Sweden",coord:[59.59870096363624,16.45421262661296]},{city:"Milwaukee, WI",country:"USA",coord:[43.06669584562939,-87.8883584455047]},{city:"Sevierville, TN",country:"USA",coord:[35.824924659360626,-83.51726373050275]},{city:"Branford, CT",country:"USA",coord:[41.295968689802734,-72.82438206093555]},{city:"Quaker Hill, CT",country:"USA",coord:[41.4033900534013,-72.11293247442322]},{city:"Wichita Falls, TX",country:"USA",coord:[33.8991556478199,-98.5160114324342]},{city:"Dubai",country:"UAE",coord:[25.095120693212635,55.178214709573446]},{city:"Sydney",country:"Australia",coord:[-33.90203136416128,151.13412198547118]},{city:"Daytona Beach, FL",country:"USA",coord:[29.161547020109836,-80.97644420378207]},{city:"Atlanta, GA",country:"USA",coord:[33.79523732075658,-84.33315953243846]},{city:"Sochi",country:"Russia",coord:[43.901217115240094,39.335106302698165]},{city:"Almaty",country:"Kazakhstan",coord:[43.16908367837858,76.87487656731079]},{city:"Moscow, Strogino",country:"Russia",coord:[55.80529425924007,37.39869510652762]},{city:"Moscow, Khamovniki",country:"Russia",coord:[55.74483961420843,37.59322618089409]},{city:"Osielsko",country:"Poland",coord:[53.18467813335776,18.06578745624908]},{city:"Praha",country:"Czech republic",coord:[50.11023377083589,14.472452225457124]},{city:"Austin, TX",country:"USA",coord:[30.20261175781122,-97.84653826002946]},{city:"Seattle, WA",country:"USA",coord:[47.6060154513441,-122.32035515948176]},{city:"Northville, MI",country:"USA",coord:[42.40910219529877,-83.4336254593393]},{city:"Leiden",country:"Netherlands",coord:[52.153924318773925,4.49086640014789]},{city:"Mochdre, Colwyn Bay",country:"UK",coord:[53.29398377085999,-3.764940086163702]},{city:"St.Gallen",country:"Switzerland",coord:[47.433922614739856,9.383051984649073]},{city:"Antwerpen",country:"Belgium",coord:[51.21691231798491,4.417465229464261]},{city:"Grand Rapids, MI",country:"USA",coord:[42.94684243977635,-85.64382820165625]},{city:"Springdale, AR",country:"USA",coord:[36.23714010693595,-94.12344684200349]},{city:"Skokie, IL",country:"USA",coord:[42.03730357512444,-87.76156707638249]},{city:"Leeds",country:"UK",coord:[53.77806590446647,-1.2546868044128854]},{city:"Pflugerville, TX",country:"USA",coord:[30.471375127822885,-97.56903284388358]},{city:"Azusa, CA",country:"USA",coord:[34.143579457039365,-117.9127539472182]},{city:"Wakefield, MA",country:"USA",coord:[42.51351725371844,-71.09156126142905]},{city:"Singapore",country:"Singapore",coord:[1.2888089431353276,103.82838432648393]},{city:"Oxnard, CA",country:"USA",coord:[34.24759359370812,-119.17481440598617]},{city:"Tübingen",country:"Germany",coord:[48.52067492924253,9.02865176973334]},{city:"Malmö",country:"Sweden",coord:[55.60082392293618,12.968196869576506]},{city:"Bardon",country:"Australia",coord:[-27.46318926780656,152.9782996556569]},{city:"Denver, CO",country:"USA",coord:[39.74917550828077,-104.96380944599251]},{city:"Paris",country:"France",coord:[48.82679300660968,2.33213061166907]},{city:"Carol Stream, IL",country:"USA",coord:[41.92410946573435,-88.12669267492724]},{city:"Astoria, NY",country:"USA",coord:[40.76345307617687,-73.9079990596028]},{city:"Lisburn",country:"UK",coord:[54.50621073748895,-6.0791036303430745]},{city:"Hyde",country:"UK",coord:[53.43986054115799,-2.0831345304049598]},{city:"Muskegon, MI",country:"USA",coord:[43.23399152649921,-86.25687663413066]},{city:"Orem, UT",country:"USA",coord:[40.320147288228135,-111.7564163365697]},{city:"Victoria, BC",country:"Canada",coord:[48.46709822376857,-123.51123649990528]},{city:"Bakersfield, CA",country:"USA",coord:[35.38269183637649,-119.03723688836575]},{city:"Almaty",country:"Kazakhstan",coord:[43.248382260038504,76.88898539828217]},{city:"Belfast",country:"UK",coord:[54.571930969805635,-5.932298472643656]},{city:"Richland, WA",country:"USA",coord:[46.264036172197365,-119.25549633054989]},{city:"Oakland, CA",country:"USA",coord:[37.81392800030482,-122.29769607305747]},{city:"Seattle, WA",country:"USA",coord:[47.651177482229784,-122.40659301697279]},{city:"Lisboa",country:"Portugal",coord:[38.72492867297487,-9.15467683729957]},{city:"Portland, OR",country:"USA",coord:[45.52109957021652,-122.69760518805865]},{city:"Cherepovets",country:"Russia",coord:[59.13087654316835,37.935468540949174]},{city:"Hamden, CT",country:"USA",coord:[41.34315358630149,-72.91758954426835]},{city:"Portland, OR",country:"USA",coord:[45.58119561544355,-122.68165727307998]},{city:"Northridge,CA",country:"USA",coord:[34.228423010586646,-118.52193938488283]},{city:"Reykjavík",country:"Iceland",coord:[64.1482583545403,-21.88271503197135]},{city:"San Leandro, CA",country:"USA",coord:[37.71906529949552,-122.15310627429379]},{city:"Winter Park, FL",country:"USA",coord:[28.623073882215863,-81.31819254747326]},{city:"Istanbul",country:"Turkey",coord:[41.078823658374375,28.996954341353025]},{city:"Los Angeles, CA",country:"USA",coord:[34.12414810517873,-118.20212041661163]},{city:"Indianapolis, IN",country:"USA",coord:[39.81284107214478,-86.15505243086642]}]},V=K("",10),J=JSON.parse('{"title":"Support","description":"Share links, contribute code or donate money to the open source development","frontmatter":{"title":"Support","description":"Share links, contribute code or donate money to the open source development","date":"2021-01-05T00:00:00.000Z","topContent":true,"cover":"diego-catto.jpg","buttons":[{"url":"https://instagram.com/chromatone.center","text":"@chromatone.center","type":"instagram"},{"url":"https://www.reddit.com/r/chromatone","text":"r/chromatone","type":"reddit"},{"url":"https://github.com/chromatone/","text":"GitHub Organisation","type":"github"}]},"headers":[],"relativePath":"support/index.md","filePath":"support/index.md","lastUpdated":1719395822000}'),X={name:"support/index.md"},W=Object.assign(X,{setup(t){const o=H.cities.map(e=>e.coord);return(e,a)=>{const s=Q;return x(),U("div",null,[N(s,{class:"mb-8",dots:G(o)},null,8,["dots"]),V])}}});export{J as __pageData,W as default};