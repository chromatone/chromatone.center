import{an as T,r as g,c as r,av as O,aQ as j,aR as R,$ as l,P as B,f as d,g as y,k as M,l as b,h as q,q as K,z as N,A as c,R as n}from"./framework.n9whnjNp.js";import{ax as W,R as E}from"./theme.DAeH2_CE.js";const P=`// precision highp float;

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

}`,V={class:"relative rounded-lg overflow-hidden pointer-events-auto touch-revert",id:"screen"},Q={__name:"ChromaPaletteFeedback",setup(U){const{tuner:s,init:_}=W(),{width:x,height:C}=T(),u=g(0),p=g(!1),{activeNotes:f}=E(),m=r(()=>P),w=r(()=>{let t=new Array(12).fill(0);for(let e in f.value){const o=(Number(e)-9)%12;t[o]+=f.value[e]}return t.map((e,o)=>{let a=Math.pow(s.aChroma[o],2),i=a>Math.pow(s.chromaAvg,2)&&!s.note.silent?a:0;return e+i})}),D=O(w,{duration:200,transition:j.easeOutExpo}),h=r(()=>{const t=Array(16).fill(0);return D.value.forEach((e,o)=>t[o]=e),t});function S(t){u.value=(Math.sin(t.iTime)+1)/2}const L=r(()=>x.value||C.value?Math.random():0),k=R(L,100),z=r(()=>`
  // uniform sampler2D u_mainOutput;

  void main() {
    vec2 uv = gl_FragCoord.xy / iResolution.xy;
    vec4 mainOutput = texture2D(u_mainOutput, uv);

    // Perform any operations on mainOutput as needed

    gl_FragColor = mainOutput;
  }
`);return(t,e)=>{const o=l("gl-float"),a=l("gl-mat4"),i=l("gl-image"),v=l("gl-program"),A=l("gl-canvas"),F=B("tooltip");return d(),y("div",V,[p.value?K("",!0):M((d(),y("button",{key:0,class:"absolute z-200 text-2xl top-2 right-2 opacity-30 hover-opacity-100 transition",onClick:e[0]||(e[0]=$=>{b(_)(),p.value=!0})},e[1]||(e[1]=[q("div",{class:"i-la-microphone"},null,-1)]))),[[F,"Enable audio input"]]),(d(),N(A,{onUpdate:S,key:b(k)},{default:c(()=>[n(v,{name:"buffer0",code:m.value},{default:c(()=>[n(o,{name:"u_light",value:u.value},null,8,["value"]),n(a,{name:"u_notes",value:h.value},null,8,["value"]),n(i,{name:"u_mainOutput",value:"buffer1"})]),_:1},8,["code"]),n(v,{name:"buffer1",code:m.value},{default:c(()=>[n(o,{name:"u_light",value:u.value},null,8,["value"]),n(a,{name:"u_notes",value:h.value},null,8,["value"]),n(i,{name:"u_mainOutput",value:"buffer0"})]),_:1},8,["code"]),n(v,{name:"main",code:z.value},{default:c(()=>[n(i,{name:"u_mainOutput",value:"buffer1"})]),_:1},8,["code"])]),_:1}))])}}};export{Q as default};
