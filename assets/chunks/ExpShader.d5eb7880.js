import{aA as F,l as f,j as a,ab as O,ad as j,aS as B,G as r,q as N,o as s,c as h,v as q,u as g,h as E,b as K,B as p,d as i,a as W}from"./framework.f75e5dc4.js";import{u as M}from"./midi.ee496394.js";import{u as P}from"./tuner.f4ce031f.js";import"./audio.2835df43.js";import"./colors.6e70028c.js";import"./loop.56652456.js";import"./mic.3d194374.js";import"./Midi.1f918097.js";import"./tempo.f209cfb9.js";import"./noise.548e98dc.js";import"./index.cccf7ef0.js";import"./sequence.8c4d3560.js";import"./synth.ffb45e01.js";import"./theory.dec16ed9.js";import"./index.de966dde.js";import"./commonjsHelpers.de833af9.js";import"./index.140cffd8.js";import"./calculations.65ee336d.js";import"./index.654bd828.js";import"./index.9f9b4fe3.js";import"./midiRender.6d60b9e9.js";import"./Sequence.ac2a9b47.js";import"./Loop.4db2aa01.js";import"./UserMedia.c8f7c51a.js";import"./Subtract.e7604129.js";import"./OnePoleFilter.771f13b4.js";import"./FFT.27cb9b54.js";import"./BitCrusher.9eeb9a2f.js";import"./Filter.e19ab36f.js";import"./AutoPanner.5498cf00.js";import"./Scale.f9a07a23.js";import"./PingPongDelay.0ce05937.js";import"./MonoSynth.3cdcc469.js";import"./index.be7eb4a8.js";const R=`// precision highp float;

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

}`,V={class:"relative min-h-70svh h-80svh rounded-lg overflow-hidden pointer-events-auto touch-revert",id:"screen"},U=W("div",{class:"i-la-microphone"},null,-1),G=[U],ze={__name:"ExpShader",setup(I){const{tuner:l,init:y}=P(),{width:b,height:_}=F(),v=f(0),d=f(!1),{midi:t}=M(),x=a(()=>R),C=a(()=>{let n=new Array(12).fill(0);for(let e in t==null?void 0:t.activeNotes){const o=(Number(e)-9)%12;n[o]+=t==null?void 0:t.activeNotes[e]}return n.map((e,o)=>{let c=l.aChroma[o]>l.chromaAvg&&!l.note.silent?l.aChroma[o]:0;return e+c})}),w=O(C,{duration:200,transition:j.easeOutExpo}),S=a(()=>{const n=Array(16).fill(0);return w.value.forEach((e,o)=>n[o]=e),n});function D(n){v.value=(Math.sin(n.iTime)+1)/2}const L=a(()=>b.value||_.value?Math.random():0),T=B(L,100),z=a(()=>`
  // uniform sampler2D u_mainOutput;

  void main() {
    vec2 uv = gl_FragCoord.xy / iResolution.xy;
    vec4 mainOutput = texture2D(u_mainOutput, uv);

    // Perform any operations on mainOutput as needed

    gl_FragColor = mainOutput;
  }
`);return(n,e)=>{const o=r("gl-float"),c=r("gl-mat4"),m=r("gl-image"),u=r("gl-program"),A=r("gl-canvas"),k=N("tooltip");return s(),h("div",V,[d.value?E("",!0):q((s(),h("button",{key:0,class:"absolute z-200 text-2xl top-2 right-2 opacity-30 hover-opacity-100 transition",onClick:e[0]||(e[0]=$=>{g(y)(),d.value=!0})},G)),[[k,"Enable audio input"]]),(s(),K(A,{onUpdate:D,key:g(T)},{default:p(()=>[i(u,{name:"buffer0",code:x.value},{default:p(()=>[i(o,{name:"u_light",value:v.value},null,8,["value"]),i(c,{name:"u_notes",value:S.value},null,8,["value"]),i(m,{name:"u_mainOutput",value:"feedbackProgram"})]),_:1},8,["code"]),i(u,{name:"main",code:z.value},{default:p(()=>[i(m,{name:"u_mainOutput",value:"buffer0"})]),_:1},8,["code"])]),_:1}))])}}};export{ze as default};
