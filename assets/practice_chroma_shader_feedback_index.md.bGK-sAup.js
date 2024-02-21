import{am as O,r as x,c,as as j,at as M,au as N,a4 as r,M as B,E as v,F as m,N as G,C,T as K,a2 as P,X as s,O as e,G as $,D as E}from"./chunks/framework.avS8w96o.js";import{K as U,u as W}from"./chunks/theme.NJ_Xky9a.js";const q=`// precision highp float;

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

}`,R={class:"relative rounded-lg overflow-hidden pointer-events-auto touch-revert",id:"screen"},V=$("div",{class:"i-la-microphone"},null,-1),I=[V],J={__name:"GpuFeedback",setup(w){const{tuner:d,init:h}=U(),{width:g,height:_}=O(),u=x(0),p=x(!1),{midi:t}=W(),b=c(()=>q),D=c(()=>{let o=new Array(12).fill(0);for(let n in t==null?void 0:t.activeNotes){const a=(Number(n)-9)%12;o[a]+=t==null?void 0:t.activeNotes[n]}return o.map((n,a)=>{let i=Math.pow(d.aChroma[a],2),l=i>Math.pow(d.chromaAvg,2)&&!d.note.silent?i:0;return n+l})}),k=j(D,{duration:200,transition:M.easeOutExpo}),y=c(()=>{const o=Array(16).fill(0);return k.value.forEach((n,a)=>o[a]=n),o});function S(o){u.value=(Math.sin(o.iTime)+1)/2}const L=c(()=>g.value||_.value?Math.random():0),F=N(L,100),T=c(()=>`
  // uniform sampler2D u_mainOutput;

  void main() {
    vec2 uv = gl_FragCoord.xy / iResolution.xy;
    vec4 mainOutput = texture2D(u_mainOutput, uv);

    // Perform any operations on mainOutput as needed

    gl_FragColor = mainOutput;
  }
`);return(o,n)=>{const a=r("gl-float"),i=r("gl-mat4"),l=r("gl-image"),f=r("gl-program"),z=r("gl-canvas"),A=B("tooltip");return v(),m("div",R,[p.value?K("",!0):G((v(),m("button",{key:0,class:"absolute z-200 text-2xl top-2 right-2 opacity-30 hover-opacity-100 transition",onClick:n[0]||(n[0]=H=>{C(h)(),p.value=!0})},I)),[[A,"Enable audio input"]]),(v(),P(z,{onUpdate:S,key:C(F)},{default:s(()=>[e(f,{name:"buffer0",code:b.value},{default:s(()=>[e(a,{name:"u_light",value:u.value},null,8,["value"]),e(i,{name:"u_notes",value:y.value},null,8,["value"]),e(l,{name:"u_mainOutput",value:"buffer1"})]),_:1},8,["code"]),e(f,{name:"buffer1",code:b.value},{default:s(()=>[e(a,{name:"u_light",value:u.value},null,8,["value"]),e(i,{name:"u_notes",value:y.value},null,8,["value"]),e(l,{name:"u_mainOutput",value:"buffer0"})]),_:1},8,["code"]),e(f,{name:"main",code:T.value},{default:s(()=>[e(l,{name:"u_mainOutput",value:"buffer1"})]),_:1},8,["code"])]),_:1}))])}}},ee=JSON.parse('{"title":"GPU shader with feedback","description":"More interesting and chaotic shader setup","frontmatter":{"title":"GPU shader with feedback","description":"More interesting and chaotic shader setup","date":"2021-04-22T00:00:00.000Z","cover":"feedback.png","layout":"app"},"headers":[],"relativePath":"practice/chroma/shader/feedback/index.md","filePath":"practice/chroma/shader/feedback/index.md","lastUpdated":1708536366000}'),X={name:"practice/chroma/shader/feedback/index.md"};function Z(w,d,h,g,_,u){const p=J,t=r("client-only");return v(),m("div",null,[e(t,null,{default:s(()=>[e(p,{class:"min-h-70svh h-80svh"})]),_:1})])}const ne=E(X,[["render",Z]]);export{ee as __pageData,ne as default};
