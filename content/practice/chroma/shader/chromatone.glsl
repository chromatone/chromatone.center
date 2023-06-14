// precision highp float;

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

  vec4 linesLayer = vec4(0.0);

  for(float i = 0.; i < 12.; i++) {

    float velocity1 = u_notes[int(i / 4.)][int(mod(i, 4.))];

    vec4 circleShape = vec4(colors[int(i)], circle(uv, positions[int(i)], radius * velocity1 + 4., 1.));

    layer1 = blendScreen(layer1, circleShape, circleShape.a);

    for(float j = 1.; j < 12.; j++) {

      float velocity1 = u_notes[int(i / 4.)][int(mod(i, 4.))];
      float velocity2 = u_notes[int(j / 4.)][int(mod(j, 4.))];

      if(velocity1 > 0.01 && velocity2 > 0.01) {

        vec4 lineColor = vec4(mix(colors[int(i)], colors[int(j)], 0.5), .95);

        float lineAlpha = drawLine(positions[int(i)], positions[int(j)], 3., lineColor, fragCoord);

        linesLayer = mix(linesLayer, lineColor * lineAlpha, lineAlpha);
      }
    }
  }

  fragColor = blendScreen(layer1, linesLayer, linesLayer.a);
}