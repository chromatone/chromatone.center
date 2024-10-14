# Chromatone
 
[![Chomatone logo in a shape of 12 petals flower, each having it's own distinct color 30 degrees of hue apart. Starting from red A it goes to orange A#, yellow B, lime C and then all around the circle with cyan D# and purple G back to red A.](https://chromatone.center/media/logo/logo.svg)](https://chromatone.center/)

## Visual Music Language

Independent open-source research project that uses colors and shapes on the screen to learn, play and communicate notes and rhythms from the speakers.

[Open digital garden](./content/index.md)

## Theory

Cards and short overviews on physics and physiology of vision and hearing and their intersection at visual music research, exploration, practice and self expression.

[Visual Music Theory](./content/theory/index.md)

## Practice

Useful tools to have in the pocket like a pack of interactive cards to learn and use in everyday music practice. These are open source web-experiments with different aspects of sound and color.

[Visual Music Practice](./content/practice/index.md)

## Use-chromatone package

[![NPM Version and link to npmjs.com](https://img.shields.io/npm/v/use-chromatone)](https://www.npmjs.com/package/use-chromatone)

A collection of sound analysis and synthesis tools along with other useful media instruments to experiment with. All in a form of convenient NPM package you can use in any JS project, both SSR and client-side. Ideal tool for modern audio researchers, educators and their students as we abstract all the low level details into simple building blocks that can be used for prototyping and concept verification.

[Chromatone composables](./use/README.md)

## Chromatone database package

[![NPM Version and link to npmjs.com](https://img.shields.io/npm/v/chromatone-db)](https://www.npmjs.com/package/chromatone-db)

We collect all the musical knowledge we can get so then we can build new insights on top of this pile. Lists of intervals, chords and scales, rhythmic patterns from different cultures and more data, neatly stored in YAML format and provided to be used as a standalone NPM package with treeshaking enabled.

[Music Database](./db/README.md)

## TECH STACK

### JS UI

- [Vite](https://vitejs.dev/) - Next generation frontend tooling for fast development and building
  - [unplugin-vue-components](https://github.com/antfu/unplugin-vue-components) - On-demand components auto-importing for Vue
  - [unplugin-icons](https://github.com/antfu/unplugin-icons) - Access thousands of icons as Vue components on-demand
  - [Icônes](https://icones.js.org/) - Icon explorer with instant searching and SVG downloading
  - [Vitepress](https://vitepress.vuejs.org/guide/global-component.html#content) - Vue-powered static site generator

- [Vue 3](https://v3.vuejs.org/) - Progressive JavaScript framework for building user interfaces
  - [VueUse](https://vueuse.org) - Collection of essential Vue Composition Utilities
  - [VueUse/Gesture](https://gesture.vueuse.org) - Vue Composables making your app interactive with gestures
  - [Floating Vue](https://floating-vue.starpad.dev) - Tooltips, dropdowns, and popovers made easy for Vue

- [UnoCSS](https://github.com/unocss/unocss) - Instant on-demand atomic CSS engine
- [Pug](https://pugjs.org/api/getting-started.html) - Templating engine for concise HTML

### Graphics

- [colord](https://www.npmjs.com/package/colord) - Tiny color manipulation and conversion library
- [PaperJs](http://paperjs.org) - Vector graphics scripting framework
- [simplex-noise](https://github.com/jwagner/simplex-noise.js) - Simplex noise implementation for JavaScript
- [hydra-synth](https://github.com/hydra-synth/hydra) - Livecoding networked visuals in the browser

### Music

- [TonalJs](https://github.com/tonaljs/tonal) - Music theory library for JavaScript
- [AbcJs](https://paulrosen.github.io/abcjs/) - JavaScript library for rendering music notation
- [WebMidi.js](https://webmidijs.org/docs/) - Web MIDI API wrapper for easy MIDI device interaction

### Audio

- [Tone.js](https://tonejs.github.io) - Framework for creating interactive music in the browser
  - [@tonejs/midi](https://github.com/Tonejs/Midi) - Convert MIDI into Tone.js-friendly JSON
- [Meyda](https://meyda.js.org) - Audio feature extraction library for JavaScript
- [AubioJs](https://github.com/qiuxiang/aubiojs) - WebAssembly port of Aubio, a library for audio analysis
- [audiomotion-analyzer](https://www.npmjs.com/package/audiomotion-analyzer) - High-resolution real-time audio spectrum analyzer
- [Elementary audio](https://elementary.audio) - WebAssembly-powered audio engine for sound synthesis and analysis
- [RecordRTC](https://recordrtc.org/) - WebRTC JavaScript library for audio/video/screen recording

- TODO:
  - https://baianat.github.io/leaps/reveal.html#example
  - https://vuexyz.org/primitives/useArc.html

## Codesandbox

You can instantly fork and start editing your own copy of the whole web-app with this link. So if you want to edit some small imperfection or adjust any parameter of any of components - your are welcome to use Chromatone repo as a playground for your own ideas. And we would be glad to merge your contributions too!

[Edit repo on Codesandbox](https://codesandbox.io/p/github/chromatone/chromatone.center/)

## TBD

- Tauri desktop build
  - https://github.com/NicolaSpadari/nuxtor
  - https://github.com/ZaneH/piano-trainer/blob/master/src-tauri/Cargo.toml
  - https://www.youtube.com/watch?v=RFFSYgdeczw
  - https://github.com/ruohki/tauri-midi-example/blob/main/src-tauri/src/main.rs
- Popover panels
  - https://caniuse.com/?search=popover
  - https://frontendmasters.com/blog/popovers-work-pretty-nicely-as-slide-out-drawers/
  - https://caniuse.com/css-text-wrap-balance
