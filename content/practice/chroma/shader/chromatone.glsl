// precision highp float;

vec3 hsv2rgb(vec3 c) {
  vec4 K = vec4(1., 2. / 3., 1. / 3., 3.);
  vec3 p = abs(fract(c.xxx + K.xyz) * 6. - K.www);
  return c.z * mix(K.xxx, clamp(p - K.xxx, 0., 1.), c.y);
}

float hash11(float p) {
  p = fract(p * .1031);
  p *= p + 33.33;
  p *= p + p;
  return fract(p);
}

/**
* Draw a circle at vec2 `pos` with radius `rad`
*/
float circle(vec2 uv, vec2 pos, float rad, vec3 color, float feather) {
  vec2 uvDist = uv - pos;
  return 1.0 - smoothstep(rad - feather, rad + feather, length(uvDist));
}

// uniform mat4 u_notes;

void mainImage(out vec4 fragColor, in vec2 fragCoord) {
  float zoom = .65;
  vec2 uv = fragCoord.xy;
  vec2 center = iResolution.xy * .5;
  float radius = zoom * .12 * iResolution.y;

  // Background layer
  vec4 layer1 = vec4(vec3(.0), 0.);

  for(float i = 0.; i < 12.; i++) {

    float angle = i * radians(30.);

    float velocity = u_notes[int(i / 4.)][int(mod(i, 4.))];

    vec2 position = vec2(sin(angle), cos(angle)) * center.x * zoom + center;

    vec3 color = hsv2rgb(vec3(i / 12., velocity + .8, .9));

    vec4 circleShape = vec4(color, circle(uv, position, radius * velocity + 4., color, 0.8));

    layer1 = mix(layer1, circleShape, circleShape.a);
  }
  fragColor = layer1;
}