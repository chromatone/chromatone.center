import{O,i as x,j as c,P as j,Q as M,R as N,n as r,x as P,o as v,c as f,y as B,g as C,b as $,e as G,m as s,f as e,a as K,_ as R}from"./chunks/framework.KnxPB1sj.js";import{u as U}from"./chunks/midi.91UwWBqe.js";import{u as W}from"./chunks/tuner.0-FZg3vi.js";import"./chunks/audio.pG3RnClx.js";import"./chunks/colors.hHBI9fPI.js";import"./chunks/loop.CI0tpsQr.js";import"./chunks/mic.v1-AeFkx.js";import"./chunks/midiRender.c86h86WZ.js";import"./chunks/Midi.6fTTQsck.js";import"./chunks/tempo.fl6CFXyY.js";import"./chunks/noise.bpaR192Z.js";import"./chunks/index.RYxauP_R.js";import"./chunks/sequence.lQXqylrG.js";import"./chunks/synth.TVJKhjDp.js";import"./chunks/theory.c9f85u7m.js";import"./chunks/index.bnjSkgpl.js";import"./chunks/commonjsHelpers.4gQjN7DL.js";import"./chunks/calculations.uITx2GSi.js";import"./chunks/index.kn6emmbE.js";import"./chunks/index.QyW-2vQe.js";import"./chunks/Sequence.kPz-JF-q.js";import"./chunks/Loop.bmxnTff3.js";import"./chunks/UserMedia.XqLXAXtE.js";import"./chunks/Subtract.6yvEFIfU.js";import"./chunks/OnePoleFilter.5ASB6TIv.js";import"./chunks/BitCrusher.Qqt3OxKC.js";import"./chunks/Filter.CUstuK5R.js";import"./chunks/AutoPanner.02Sltg0b.js";import"./chunks/Scale.nioafpJK.js";import"./chunks/PingPongDelay.a3-runAV.js";import"./chunks/MonoSynth.pp_JS1sF.js";import"./chunks/index._4u9I4xi.js";const q=`// precision highp float;

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

}`,E={class:"relative rounded-lg overflow-hidden pointer-events-auto touch-revert",id:"screen"},V=K("div",{class:"i-la-microphone"},null,-1),I=[V],J={__name:"GpuFeedback",setup(w){const{tuner:p,init:h}=W(),{width:g,height:_}=O(),d=x(0),u=x(!1),{midi:t}=U(),b=c(()=>q),k=c(()=>{let o=new Array(12).fill(0);for(let n in t==null?void 0:t.activeNotes){const a=(Number(n)-9)%12;o[a]+=t==null?void 0:t.activeNotes[n]}return o.map((n,a)=>{let i=Math.pow(p.aChroma[a],2),l=i>Math.pow(p.chromaAvg,2)&&!p.note.silent?i:0;return n+l})}),D=j(k,{duration:200,transition:M.easeOutExpo}),y=c(()=>{const o=Array(16).fill(0);return D.value.forEach((n,a)=>o[a]=n),o});function S(o){d.value=(Math.sin(o.iTime)+1)/2}const L=c(()=>g.value||_.value?Math.random():0),F=N(L,100),T=c(()=>`
  // uniform sampler2D u_mainOutput;

  void main() {
    vec2 uv = gl_FragCoord.xy / iResolution.xy;
    vec4 mainOutput = texture2D(u_mainOutput, uv);

    // Perform any operations on mainOutput as needed

    gl_FragColor = mainOutput;
  }
`);return(o,n)=>{const a=r("gl-float"),i=r("gl-mat4"),l=r("gl-image"),m=r("gl-program"),z=r("gl-canvas"),A=P("tooltip");return v(),f("div",E,[u.value?$("",!0):B((v(),f("button",{key:0,class:"absolute z-200 text-2xl top-2 right-2 opacity-30 hover-opacity-100 transition",onClick:n[0]||(n[0]=H=>{C(h)(),u.value=!0})},I)),[[A,"Enable audio input"]]),(v(),G(z,{onUpdate:S,key:C(F)},{default:s(()=>[e(m,{name:"buffer0",code:b.value},{default:s(()=>[e(a,{name:"u_light",value:d.value},null,8,["value"]),e(i,{name:"u_notes",value:y.value},null,8,["value"]),e(l,{name:"u_mainOutput",value:"buffer1"})]),_:1},8,["code"]),e(m,{name:"buffer1",code:b.value},{default:s(()=>[e(a,{name:"u_light",value:d.value},null,8,["value"]),e(i,{name:"u_notes",value:y.value},null,8,["value"]),e(l,{name:"u_mainOutput",value:"buffer0"})]),_:1},8,["code"]),e(m,{name:"main",code:T.value},{default:s(()=>[e(l,{name:"u_mainOutput",value:"buffer1"})]),_:1},8,["code"])]),_:1}))])}}},ze=JSON.parse('{"title":"GPU shader with feedback","description":"More interesting and chaotic shader setup","frontmatter":{"title":"GPU shader with feedback","description":"More interesting and chaotic shader setup","date":"2021-04-22T00:00:00.000Z","cover":"feedback.png","layout":"app"},"headers":[],"relativePath":"practice/chroma/shader/feedback/index.md","filePath":"practice/chroma/shader/feedback/index.md","lastUpdated":1705238977000}'),Q={name:"practice/chroma/shader/feedback/index.md"};function Z(w,p,h,g,_,d){const u=J,t=r("client-only");return v(),f("div",null,[e(t,null,{default:s(()=>[e(u,{class:"min-h-70svh h-80svh"})]),_:1})])}const Ae=R(Q,[["render",Z]]);export{ze as __pageData,Ae as default};
