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
* Draw a circle at vec2 `pos` with radius `rad` and
* color `color`.
*/
vec4 circle(vec2 uv, vec2 pos, float rad, vec3 color) {
  float d = length(pos - uv) - rad;
  float t = smoothstep(.04, 1., d);
  return vec4(color, 1. - t);
}

// uniform mat4 u_notes;

void mainImage(out vec4 fragColor, in vec2 fragCoord) {
  float zoom = .45;
  vec2 uv = fragCoord.xy;
  vec2 center = iResolution.xy * .5;
  float radius = zoom * .12 * iResolution.y;

  // Background layer
  vec4 layer1 = vec4(vec3(.0), 1.);

  for(float i = 0.; i < 12.; i++) {

    float angle = 2. * i * 3.1415 / 12.;

    float velocity = u_notes[int(i / 4.)][int(mod(i, 4.))];

    // float velocity = texture2D(u_notesTexture, vec2(i / 12., 0.5)).r;

    vec2 position = vec2(sin(angle), cos(angle)) * center.x * zoom + center;

    vec3 color = hsv2rgb(vec3(i / 12., velocity, .8));

    vec4 layer2 = circle(uv, position, radius * velocity + 1., color);

    layer1 = mix(layer1, layer2, layer2.a);
  }
  fragColor = layer1;
}