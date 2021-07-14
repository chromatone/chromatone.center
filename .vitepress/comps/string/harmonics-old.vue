<template lang="pug">
#harmonic-series
  svg#artwork(viewBox="-10 -65 420 420") {{ time }}

    g(v-for="(wave, harm) in string.waves")
      polyline(
        v-if="harm < string.harmNum && harm < 7 && string.front", 
        :points="wave.front.join(' ')",
        fill="transparent", 
        stroke="rgba(255,0,0,0.3)",
        stroke-linejoin="round",
        stroke-miterlimit="5"
        )
      polyline(
        v-if="harm < string.harmNum && harm < 7 && string.back", 
        :points="wave.back.join(' ')", 
        fill="transparent", 
        stroke="rgba(0,0,255,0.3)", 
        stroke-linejoin="round", 
        stroke-miterlimit="5"
        )
      polyline(
        v-if="harm < string.harmNum && harm < 7 && string.sum",
        :points="wave.sum.join(' ')", 
        fill="transparent", 
        stroke-width="2", 
        :stroke="string.colors[harm]", 
        stroke-linejoin="round", 
        stroke-miterlimit="5"
        )
    polyline(
      :points="string.full.points.join(' ')",
      fill="transparent", 
      stroke="black", 
      stroke-linejoin="round", 
      stroke-width="2", 
      stroke-miterlimit="5"
      )
    circle(r="3", cx="0", cy="0", fill="black")
    circle(r="3", cx="400", cy="0", fill="black")
    text(
      v-for="num in string.harmonicsNumber", 
      style="font-size:8px", 
      x="3", 
      :y="3 + num * distance"
      ) {{ (frequency * num).toFixed(2) }} Hz
    line(
      v-for="semi in 48", 
      :x1="length * 2 - length * 2 / Math.pow(string.semitone, semi)", 
      :x2="length * 2 - length * 2 / Math.pow(string.semitone, semi)", 
      y1="320", 
      y2="350", 
      stroke-width="1", 
      stroke="grey"
      )
    circle(
      v-for="(dot,i) in string.dots", 
      r="2", 
      :cx="dot - 8 + i / 1.7", 
      cy="335", 
      fill="grey"
      ) {{ i }}
    line(x1="0", y1="0", x2="0", y2="340", stroke="black")
    line(x1="400", y1="0", x2="400", y2="340", stroke="black")
    circle(r="3", cx="0", cy="50", :fill="string.colors[0]")
    circle(r="3", :cx="length * 2", cy="50", :fill="string.colors[0]")
    rect(x="0", width="400", y="320", height="30", stroke="black", fill="none")
    g(v-for="num in string.harmonicsNumber-1")
      text(
        style="font-size:10px", 
        text-anchor="middle", 
        v-for="col in num", 
        :x="string.length * 2 / (num + 1) * col", 
        :y="90 + (num - 1) * string.distance - 10"
        ) 1/{{ num + 1 }}
      circle(
        v-for="col in num", r="3", 
        :cx="length * 2 / (num + 1) * col", 
        :cy="90 + (num - 1) * string.distance", 
        :fill="string.colors[num]"
        )
      circle(r="3", cx="0", :cy="90 + (num - 1) * string.distance", :fill="string.colors[num]")
      circle(r="3", :cx="string.length * 2", :cy="90 + (num - 1) * string.distance", :fill="string.colors[num]")
      line(v-for="col in num", :x1="string.length * 2 / (num + 1) * col", :y1="90 + (num - 1) * string.distance", :x2="string.length * 2 / (num + 1) * col", y2="350", :stroke="string.colors[num]") {{ col }}
      text(
        style="font-size:7px", 
        v-for="col in num", 
        :x="string.length * 2 / (num + 1) * col", 
        :y="327 + (num - 1) * 4"
        ) 1/{{ num + 1 }}
  div(
    style="padding:0px 20px 20px 20px;display:grid;grid-template-columns:1fr 1fr 1fr 1fr"
    )
    div
      input(type="checkbox", v-model="string.front")
      span.label Front waves
    div
      input(type="checkbox", v-model="string.back")
      span.label Back waves
    div
      input(type="checkbox", v-model="string.sum")
      span.label Standing waves
    div
      input(type="checkbox", v-model="string.combine")
      span.label Combine waves
  div(style="padding:0px 20px 100px 20px;display:grid;grid-template-columns:1fr 1fr")
    label Frequency
    input(
      type="number" 
      v-model="string.frequency", 
      ticks, 
      :step="0.01", 
      :min="0.05", 
      :max="1"
      )
    label Harmonics
    input(
      type="number"
      v-model="string.harmNum", 
      ticks, 
      :step="1", 
      :min="1", 
      :max="25"
      )
</template>

<script setup>
import { useRafFn } from '@vueuse/core'
const string = reactive({
  tonic: 0,
  semitone: 1.05946309436,
  frets: [3, 5, 7, 9, 12, 15, 17, 19, 21, 24],
  length: 200,
  distance: 40,
  frequency: 0.5,
  amplitude: 10,
  time: 0,
  date: new Date(),
  harmonics: [],
  harmonicsNumber: 7,
  front: true,
  back: true,
  sum: true,
  combine: false,
  waves: [],
  full: {
    y: [],
    points: []
  },
  harmNum: 7,
  colors: ['grey', 'red', 'orange', 'yellow', 'green', 'blue', 'purple'],
  fillColors: [
    'rgba(0,0,0,0.05)',
    'rgba(255,0,0,0.05)',
    'rgba(255,165,0,0.05)',
    'rgba(255,255,0,0.05)',
    'rgba(0,128,0,0.05)',
    'rgba(0,0,255,0.05)',
    'rgba(128,0,128,0.05)'
  ]

});

const dots = computed(() => {
  let dots = [];
  string.frets.forEach(fret => {
    let dist = string.length * 2 - string.length * 2 / Math.pow(string.semitone, fret);
    dots.push(dist)
  })
  return dots
});

for (let harm = 0; harm <= string.harmonicsNumber; harm++) {
  string.harmonics.push({
    path: 'M0 0',
    phase: 0,
    shift: 0,
    sign: true
  })
}

for (let i = 0; i < string.harmNum; i++) {
  string.waves[i] = {
    front: [],
    back: [],
    sum: [],
    y: []
  }
}

function getY(num, x, way = true) {
  let y = 0;
  let time = way ? -string.time : string.time;
  y = Math.sin(x / (string.length * 2) * Math.PI * num + time * Math.PI * num * string.frequency) * string.amplitude;
  return y
}

function calcPath(num) {
  let w = string.length / (num + 1);
  let h = 50 + num * string.distance;
  let shift = Math.sin(string.time * Math.PI * string.frequency * (num + 1)) * string.amplitude / (0.5 * num + 1);
  let harm = [];
  harm.push('M 0 ', h, ' q ', w, ' ', shift, ' ', w * 2, ' 0');
  for (let j = 0; j < num; j++) {
    harm.push(' t ', w * 2, ' 0')
  }
  return harm.join('')
}

const { pause, resume } = useRafFn(draw)

function draw() {
  string.time = (Date.now() - string.date) / 1000;
  for (let i = 0; i < string.harmonicsNumber; i++) {
    string.harmonics[i].path = calcPath(i)
  };
  let y1, y2, shift;
  for (let x = 0; x <= string.length / 2; x++) {
    string.full.y[x] = 0;
    for (let i = 0; i < string.harmNum; i++) {
      if (string.combine) {
        shift = 0;
      } else {
        shift = 10 + (i + 1) * 40;
      }
      y1 = getY(i + 1, x * 4, true) / (i / 2 + 1);
      y2 = getY(i + 1, x * 4, false) / (i / 2 + 1);
      string.waves[i].front[x] = x * 4 + ',' + (y1 + shift).toFixed(2);
      string.waves[i].back[x] = x * 4 + ',' + (y2 + shift).toFixed(2);
      string.waves[i].sum[x] = x * 4 + ',' + (y1 + y2 + shift).toFixed(2);
      string.full.y[x] += y1 + y2;
    }
    string.full.points[x] = x * 4 + ',' + string.full.y[x];
  }
  requestAnimationFrame(draw);
}

draw()
</script>

<style scoped>
</style>