import{R as j,x as _,b as l,S as F,U as G,V as N,I as a,A as P,o as s,c as m,B as W,u as b,l as B,g as I,w as p,f as i,a as M,_ as U}from"./chunks/framework.c7ad3ca2.js";import{u as $}from"./chunks/midi.9486e5fa.js";import{u as q}from"./chunks/tuner.11147eb4.js";import"./chunks/audio.01373f6f.js";import"./chunks/colors.394b294c.js";import"./chunks/loop.93be4422.js";import"./chunks/mic.0d26fc2e.js";import"./chunks/Midi.1f918097.js";import"./chunks/tempo.4bdd83c1.js";import"./chunks/noise.2dc59262.js";import"./chunks/index.098dc14b.js";import"./chunks/sequence.c07c6f83.js";import"./chunks/synth.97f998a0.js";import"./chunks/theory.61e5aadb.js";import"./chunks/commonjsHelpers.de833af9.js";import"./chunks/index.b30cd6d2.js";import"./chunks/calculations.65ee336d.js";import"./chunks/index.654bd828.js";import"./chunks/index.b3129a1a.js";import"./chunks/midiRender.bb5d7d88.js";import"./chunks/Sequence.dc8acd0f.js";import"./chunks/Loop.97b07c3f.js";import"./chunks/UserMedia.84833756.js";import"./chunks/Subtract.beb0cc34.js";import"./chunks/OnePoleFilter.f8119023.js";import"./chunks/FFT.6aac2071.js";import"./chunks/BitCrusher.e42cf4d0.js";import"./chunks/Filter.fb7acdf5.js";import"./chunks/AutoPanner.8d278bb2.js";import"./chunks/Scale.22b16e3d.js";import"./chunks/PingPongDelay.187daa12.js";import"./chunks/MonoSynth.ecb6ed30.js";import"./chunks/index.86652af6.js";const K=`// precision highp float;

vec3 hsv2rgb(vec3 c) {
  vec4 K = vec4(1., 2. / 3., 1. / 3., 3.);
  vec3 p = abs(fract(c.xxx + K.xyz) * 6. - K.www);
  return c.z * mix(K.xxx, clamp(p - K.xxx, 0., 1.), c.y);
}

float circle(vec2 uv, vec2 pos, float rad, float feather) {
  return 1. - smoothstep(rad - feather, rad + feather, length(uv - pos));
}

float blendScreen(float base, float blend) {
  return 1.0 - ((1.0 - base) * (1.0 - blend));
}

vec4 blendScreen(vec4 base, vec4 blend) {
  return vec4(blendScreen(base.r, blend.r), blendScreen(base.g, blend.g), blendScreen(base.b, blend.b), 1.);
}

vec4 blendScreen(vec4 base, vec4 blend, float opacity) {
  return (blendScreen(base, blend) * opacity + base * (1.0 - opacity));
}

float random(vec2 st) {
  return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
}

float drawLine(vec2 p1, vec2 p2, float thickness, vec4 color, in vec2 fragCoord) {
  vec2 dir = p2 - p1;
  float len = length(dir);
  vec2 normalizedDir = dir / len;
  vec2 normal = vec2(-normalizedDir.y, normalizedDir.x);
  vec2 pointToLineDir = fragCoord - p1;
  float dist = abs(dot(normal, pointToLineDir));
  float t = dot(normalizedDir, pointToLineDir) / len;
  if(t >= 0.0 && t <= 1.0 && dist <= thickness / 2.0) {
    return color.a;
  }
  return 0.0;
}

float drawWavyLine(vec2 p1, vec2 p2, float thickness, vec4 color, in vec2 fragCoord, float freq, float amp) {
  vec2 dir = p2 - p1;
  float len = length(dir);
  vec2 normalizedDir = dir / len;
  vec2 normal = vec2(-normalizedDir.y, normalizedDir.x);
  vec2 pointToLineDir = fragCoord - p1;

  // Add the sine wave modulation to the point-to-line direction
  float waveAmplitude = amp;
  float waveFrequency = freq;
  float waveOffset = iTime * 20.0;
  float progress = dot(normalizedDir, pointToLineDir) / len;
  pointToLineDir += waveAmplitude * sin(waveFrequency * progress + waveOffset) * normal * progress * (1.0 - progress);

  float dist = abs(dot(normal, pointToLineDir));
  float t = progress;
  if(t >= 0.0 && t <= 1.0 && dist <= thickness / 2.0) {
    return color.a;
  }
  return 0.0;
}

// float edgeFactor(vec2 p1, vec2 p2, vec2 uv) {
//   float dist = distance(p1, p2);
//   float edgeWidth = 0.002;
//   float alpha = smoothstep(0.0, edgeWidth * dist, abs(uv.x * (p2.y - p1.y) + uv.y * (p1.x - p2.x) + p2.x * p1.y - p2.y * p1.x) / dist);
//   return alpha;
// }

// float drawSmoothFilledTriangle(vec2 p1, vec2 p2, vec2 p3, vec4 color, in vec2 uv) {
//   float alpha1 = edgeFactor(p1, p2, uv);
//   float alpha2 = edgeFactor(p2, p3, uv);
//   float alpha3 = edgeFactor(p3, p1, uv);
//   float alpha = min(min(alpha1, alpha2), alpha3);
//   return mix(0.0, color.a, alpha);
// }

// uniform mat4 u_notes;

void mainImage(out vec4 fragColor, in vec2 fragCoord) {
  float zoom = .45 + .05 * sin(iTime / 4.);
  vec2 uv = fragCoord.xy;
  vec2 center = iResolution.xy * .5;
  float radius = zoom * .12 * iResolution.y;
  vec2 positions[12];
  vec3 colors[12];

// Background layer
  vec4 layer1 = vec4(vec3(.0), 0.);
  for(float i = 0.; i < 12.; i++) {
    float angle = i * radians(30.) + cos(iTime / 3.) * .05;
    float velocity = u_notes[int(i / 4.)][int(mod(i, 4.))];
    vec2 position = vec2(sin(angle), cos(angle)) * max(center.x, center.y) * zoom + center;
    vec3 color = hsv2rgb(vec3(i / 12., velocity + .8, 1.));
    positions[int(i)] = position;
    colors[int(i)] = color;
    vec4 circleShape2 = vec4(color, circle(uv, position, radius * velocity * (sin(iTime + i / 2.) + 1.0), radius / 2. + 500. * velocity));
    layer1 = blendScreen(layer1, circleShape2, circleShape2.a);
  }

  //Lines layer
  vec4 linesLayer = vec4(0.0);
  for(float i = 0.; i < 12.; i++) {
    float velocity1 = u_notes[int(i / 4.)][int(mod(i, 4.))];
    vec4 circleShape = vec4(colors[int(i)], circle(uv, positions[int(i)], radius * velocity1 + 4., 1.));
    layer1 = blendScreen(layer1, circleShape, circleShape.a);
    for(float j = 1.; j < 12.; j++) {
      float velocity1 = u_notes[int(i / 4.)][int(mod(i, 4.))];
      float velocity2 = u_notes[int(j / 4.)][int(mod(j, 4.))];
      if(velocity1 > 0.1 && velocity2 > 0.1) {
        vec4 lineColor = vec4(mix(colors[int(i)], colors[int(j)], 0.4), .75);

        // float lineAlpha = drawLine(positions[int(i)], positions[int(j)], 3., lineColor, fragCoord);

        float lineAlpha = drawWavyLine(positions[int(i)], positions[int(j)], 3., lineColor, fragCoord, 440. * pow(2., -3. + i / 12.), 10.);

        linesLayer = mix(linesLayer, lineColor * lineAlpha, lineAlpha);

      }
    }
  }

  fragColor = blendScreen(layer1, linesLayer, linesLayer.a);

  // // Draw triangles starting from the center of the canvas and touching the circles
  // vec4 trianglesLayer = vec4(0.0);
  // for(float i = 0.; i < 12.; i++) {
  //   vec2 p1 = center;
  //   vec2 p2 = positions[int(i)];
  //   vec2 p3 = positions[int(mod(i + 1., 12.))];
  //   vec3 color1 = colors[int(i)];
  //   vec3 color2 = colors[int(mod(i + 1., 12.))];
  //   vec4 triangleColor = vec4(mix(color1, color2, 0.5), 1);
  //   float triangleAlpha = drawSmoothFilledTriangle(p1, p2, p3, triangleColor, uv);

  //   trianglesLayer = blendScreen(trianglesLayer, triangleColor * triangleAlpha, triangleAlpha);
  // }

}`,R={class:"relative min-h-70svh h-80svh rounded-lg overflow-hidden pointer-events-auto touch-revert",id:"screen"},V=M("div",{class:"i-la-microphone"},null,-1),E=[V],J={__name:"GpuShader",setup(x){const{tuner:r,init:u}=q(),{width:f,height:h}=j(),d=_(0),c=_(!1),{midi:n}=$(),w=l(()=>K),C=l(()=>{let t=new Array(12).fill(0);for(let e in n==null?void 0:n.activeNotes){const o=(Number(e)-9)%12;t[o]+=n==null?void 0:n.activeNotes[e]}return t.map((e,o)=>{let v=r.aChroma[o]>r.chromaAvg&&!r.note.silent?r.aChroma[o]:0;return e+v})}),S=F(C,{duration:200,transition:G.easeOutExpo}),L=l(()=>{const t=Array(16).fill(0);return S.value.forEach((e,o)=>t[o]=e),t});function D(t){d.value=(Math.sin(t.iTime)+1)/2}const T=l(()=>f.value||h.value?Math.random():0),k=N(T,100),z=l(()=>`
  // uniform sampler2D u_mainOutput;

  void main() {
    vec2 uv = gl_FragCoord.xy / iResolution.xy;
    vec4 mainOutput = texture2D(u_mainOutput, uv);

    // Perform any operations on mainOutput as needed

    gl_FragColor = mainOutput;
  }
`);return(t,e)=>{const o=a("gl-float"),v=a("gl-mat4"),g=a("gl-image"),y=a("gl-program"),A=a("gl-canvas"),O=P("tooltip");return s(),m("div",R,[c.value?B("",!0):W((s(),m("button",{key:0,class:"absolute z-200 text-2xl top-2 right-2 opacity-30 hover-opacity-100 transition",onClick:e[0]||(e[0]=Q=>{b(u)(),c.value=!0})},E)),[[O,"Enable audio input"]]),(s(),I(A,{onUpdate:D,key:b(k)},{default:p(()=>[i(y,{name:"buffer0",code:w.value},{default:p(()=>[i(o,{name:"u_light",value:d.value},null,8,["value"]),i(v,{name:"u_notes",value:L.value},null,8,["value"]),i(g,{name:"u_mainOutput",value:"feedbackProgram"})]),_:1},8,["code"]),i(y,{name:"main",code:z.value},{default:p(()=>[i(g,{name:"u_mainOutput",value:"buffer0"})]),_:1},8,["code"])]),_:1}))])}}},Oe=JSON.parse('{"title":"GPU shader","description":"A MIDI reactive GLSL shader as a direct visual mathematical interpretation of musical notes","frontmatter":{"title":"GPU shader","description":"A MIDI reactive GLSL shader as a direct visual mathematical interpretation of musical notes","date":"2021-04-22T00:00:00.000Z","links":["https://github.com/kongxiaojian123/vue-glsl#readme","https://registry.khronos.org/OpenGL-Refpages/gl4/index.php","https://iquilezles.org/articles/palettes/","https://thebookofshaders.com/","https://github.com/jamieowen/glsl-blend","https://www.shadertoy.com/view/4tSGWV","https://www.shadertoy.com/view/mtyGWy"]},"headers":[],"relativePath":"practice/chroma/shader/index.md","filePath":"practice/chroma/shader/index.md","lastUpdated":1694022443000}'),Z={name:"practice/chroma/shader/index.md"};function H(x,r,u,f,h,d){const c=J,n=a("client-only");return s(),m("div",null,[i(n,null,{default:p(()=>[i(c)]),_:1})])}const je=U(Z,[["render",H]]);export{Oe as __pageData,je as default};
