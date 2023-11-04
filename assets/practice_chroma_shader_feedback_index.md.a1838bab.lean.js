import{d as O,e as j,T as N,r as B}from"./chunks/index.8dc0b613.js";import{u as M}from"./chunks/midi.36560961.js";import{u as P}from"./chunks/tuner.f3d8e340.js";import"./chunks/audio.aba48680.js";import"./chunks/colors.a5d5ae39.js";import"./chunks/loop.5f39f706.js";import"./chunks/mic.a8597eff.js";import"./chunks/midiRender.affeda4e.js";import"./chunks/Midi.1f918097.js";import"./chunks/tempo.4e2f4c38.js";import"./chunks/noise.50c0df1a.js";import"./chunks/index.e98b5e67.js";import"./chunks/sequence.23b98f68.js";import"./chunks/synth.8a2ee66e.js";import"./chunks/theory.61e5aadb.js";import{i as x,j as l,m as r,q as $,o as u,c as f,s as q,g as C,b as G,e as K,n as c,f as e,a as U,_ as W}from"./chunks/framework.f277db28.js";import"./chunks/index.911cb71e.js";import"./chunks/commonjsHelpers.de833af9.js";import"./chunks/index.b30cd6d2.js";import"./chunks/calculations.2bac3e9a.js";import"./chunks/index.654bd828.js";import"./chunks/index.9f721bc0.js";import"./chunks/Sequence.873f0209.js";import"./chunks/Loop.14cab9e9.js";import"./chunks/UserMedia.9dadeb85.js";import"./chunks/Subtract.109130cb.js";import"./chunks/OnePoleFilter.8566943f.js";import"./chunks/BitCrusher.1d797f1b.js";import"./chunks/Filter.ca6be54c.js";import"./chunks/AutoPanner.a9d5a784.js";import"./chunks/Scale.b6214b1d.js";import"./chunks/PingPongDelay.719d1232.js";import"./chunks/MonoSynth.c00b1270.js";import"./chunks/index.86652af6.js";const E=`// precision highp float;

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

// Calculate the distance from the center of the screen
  vec2 distance = fragCoord - center;

// Calculate the scale factor based on the distance
  float scaleFactor = length(distance) / length(center);

// Apply the scale factor to the offset
  vec2 offset = distance * scaleFactor * 0.02; // Adjust this value to change the scale factor

// Get the color of the previous frame
  vec4 previousFrame = texture2D(u_mainOutput, (fragCoord - offset) / iResolution.xy);

// Blend the current frame with the previous frame using the "add" blending function
  float feedback = 0.96; // Adjust this value to change the strength of the feedback effect
  vec4 currentFrame = blendScreen(layer1, linesLayer, linesLayer.a);
  fragColor = blendScreen(currentFrame, previousFrame, feedback);

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

}`,R={class:"relative rounded-lg overflow-hidden pointer-events-auto touch-revert",id:"screen"},V=U("div",{class:"i-la-microphone"},null,-1),I=[V],J={__name:"GpuFeedback",setup(w){const{tuner:i,init:h}=P(),{width:g,height:_}=O(),s=x(0),p=x(!1),{midi:o}=M(),b=l(()=>E),k=l(()=>{let a=new Array(12).fill(0);for(let n in o==null?void 0:o.activeNotes){const t=(Number(n)-9)%12;a[t]+=o==null?void 0:o.activeNotes[n]}return a.map((n,t)=>{let d=i.aChroma[t]>i.chromaAvg&&!i.note.silent?i.aChroma[t]:0;return n+d})}),D=j(k,{duration:200,transition:N.easeOutExpo}),y=l(()=>{const a=Array(16).fill(0);return D.value.forEach((n,t)=>a[t]=n),a});function S(a){s.value=(Math.sin(a.iTime)+1)/2}const L=l(()=>g.value||_.value?Math.random():0),T=B(L,100),F=l(()=>`
  // uniform sampler2D u_mainOutput;

  void main() {
    vec2 uv = gl_FragCoord.xy / iResolution.xy;
    vec4 mainOutput = texture2D(u_mainOutput, uv);

    // Perform any operations on mainOutput as needed

    gl_FragColor = mainOutput;
  }
`);return(a,n)=>{const t=r("gl-float"),d=r("gl-mat4"),v=r("gl-image"),m=r("gl-program"),z=r("gl-canvas"),A=$("tooltip");return u(),f("div",R,[p.value?G("",!0):q((u(),f("button",{key:0,class:"absolute z-200 text-2xl top-2 right-2 opacity-30 hover-opacity-100 transition",onClick:n[0]||(n[0]=Q=>{C(h)(),p.value=!0})},I)),[[A,"Enable audio input"]]),(u(),K(z,{onUpdate:S,key:C(T)},{default:c(()=>[e(m,{name:"buffer0",code:b.value},{default:c(()=>[e(t,{name:"u_light",value:s.value},null,8,["value"]),e(d,{name:"u_notes",value:y.value},null,8,["value"]),e(v,{name:"u_mainOutput",value:"buffer1"})]),_:1},8,["code"]),e(m,{name:"buffer1",code:b.value},{default:c(()=>[e(t,{name:"u_light",value:s.value},null,8,["value"]),e(d,{name:"u_notes",value:y.value},null,8,["value"]),e(v,{name:"u_mainOutput",value:"buffer0"})]),_:1},8,["code"]),e(m,{name:"main",code:F.value},{default:c(()=>[e(v,{name:"u_mainOutput",value:"buffer1"})]),_:1},8,["code"])]),_:1}))])}}},Oe=JSON.parse('{"title":"GPU shader with feedback","description":"More interesting and chaotic shader setup","frontmatter":{"title":"GPU shader with feedback","description":"More interesting and chaotic shader setup","date":"2021-04-22T00:00:00.000Z","cover":"feedback.png","layout":"app"},"headers":[],"relativePath":"practice/chroma/shader/feedback/index.md","filePath":"practice/chroma/shader/feedback/index.md","lastUpdated":1699065471000}'),Z={name:"practice/chroma/shader/feedback/index.md"};function H(w,i,h,g,_,s){const p=J,o=r("client-only");return u(),f("div",null,[e(o,null,{default:c(()=>[e(p,{class:"min-h-70svh h-80svh"})]),_:1})])}const je=W(Z,[["render",H]]);export{Oe as __pageData,je as default};
