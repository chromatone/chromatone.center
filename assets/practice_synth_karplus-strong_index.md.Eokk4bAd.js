import{o as e,c as t,a as l,_ as o,f as d}from"./chunks/framework.HVt1h3pg.js";const i={class:"flex flex-col gap-4"},c=l("div",{class:"text-2xl"},"ALGO",-1),p=l("pre",null,`import { el } from '@elemaudio/core';

let midi = 42
let train = el.train(1)
let freq = el.mul(440, el.pow(2, el.div(el.sub(midi, 69), 12)))
let delTime = el.mul(el.div(1, freq), 1000)
let lfo1 = el.cycle(1 / 8)
let adsr = el.adsr(0.0001, .2, 0.01, .2, train)
let synth = el.mul(adsr, el.noise())
let filtered = el.lowpass(880, 6, synth)
let adsrOsc = el.adsr(
  0.005,
  el.add(.3, el.mul(.05, el.add(1, lfo1))),
  0, 0.1, train)
let osc = el.mul(adsrOsc, el.cycle(el.mul(1, freq)), .2)
let dl = el.delay(
  { size: 44100 },
  el.ms2samps(delTime),
  el.add(0.955, el.mul(0.02, lfo1)),
  filtered)
let both = el.add(dl, osc)
let signal = el.tanh(both)`,-1),_=[c,p],m={__name:"SynthKarplus",setup(s){return(n,a)=>(e(),t("div",i,_))}},v=JSON.parse('{"title":"Karplus–Strong synthesis","description":"Pratical KS synth","frontmatter":{"title":"Karplus–Strong synthesis","description":"Pratical KS synth","date":"2013-11-14T00:00:00.000Z","cover":"ksa.png"},"headers":[],"relativePath":"practice/synth/karplus-strong/index.md","filePath":"practice/synth/karplus-strong/index.md","lastUpdated":1702298819000}'),u={name:"practice/synth/karplus-strong/index.md"};function h(s,n,a,f,y,x){const r=m;return e(),t("div",null,[d(r)])}const S=o(u,[["render",h]]);export{v as __pageData,S as default};
