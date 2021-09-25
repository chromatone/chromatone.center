# Chromatone

[![](https://chromatone.center/media/logo/logo.svg)](https://chromatone.center/)

The visual music research center

## Research

Cards and short overviews on physics and physiology of vision and hearing and their intersection at visual music research, exploration, practice and self expression.

## Explore

Useful tools to have in the pocket like a pack of interactive cards to learn and use in everyday music practice. These are open source web-experiments with different aspects of sound and color. 

## Shop

- Stickers for musical instruments to physically map notes and pitch classes with corresponding colors.
- Posters and memos to use for better memorization of fundamental music concepts. 

## Community

Learners, sharing their experiences and setups. Musical and visual projects and performers, who implement Chromatone system in practice. Jams and other community events and 

## Contact

Contact the author and the headquarter of the project. 

## Road map

We've ported almost all separate apps into the main website. It becomes more and more integrated tool. But there's more! Next are the experiments, that stat at dev and need to be implemented with the new dev stack.

- Pitch field / Tone grid
- ~~Noise lab~~
- ~~Harmonics~~
- ~~Oscilloscope~~
- Synth waveforms
- Drum machine
- Fretboard detect chord

## Any other ideas? [Share them in the discussions!](https://github.com/chromatone/chromatone.center/discussions/2)


## STACK
- [chromatone-theory](https://www.npmjs.com/package/chromatone-theory)
- [vue 3](https://v3.vuejs.org/)
  - [vueUse](https://vueuse.org)
  - [vueUse/motion](https://motion.vueuse.org)
  - [vueUse/gesture](https://gesture.vueuse.org)
- [vite](https://vitejs.dev/)
  - [unplugin-plugin-components](https://github.com/antfu/unplugin-vue-components)
  - [unplugin-icons](https://github.com/antfu/unplugin-icons)
    - [Icônes](https://icones.js.org/)
  - [vitepress](https://vitepress.vuejs.org/guide/global-component.html#content)
    - i18n like in [vuepress](https://vuepress.vuejs.org/guide/i18n.html#default-theme-i18n-config)
- [windi css](https://windicss.org/)
- [pug](https://pugjs.org/api/getting-started.html)
- [tonaljs](https://github.com/tonaljs/tonal)
- [abcjs](https://paulrosen.github.io/abcjs/)
- [webmidi.js](https://webmidijs.org/docs/)
- [colord](https://www.npmjs.com/package/colord)
- audio
  - [tone.js](https://tonejs.github.io)
    - [@tonejs/midi](https://github.com/Tonejs/Midi)
    - [@tonejs/piano](https://tambien.github.io/Piano/) ?
  - [meyda](https://meyda.js.org)
  - [aubiojs](https://github.com/qiuxiang/aubiojs)
  - [audiomotion-analyzer](https://www.npmjs.com/package/audiomotion-analyzer) 
  

#### AudioWorklet further research
- https://dev.to/ndesmic/building-a-digital-synthesizer-part-1-making-some-noise-g7k
- https://developer.mozilla.org/en-US/docs/Web/API/AudioWorkletNode
- https://github_com.jam.dev/GoogleChromeLabs/audioworklet-polyfill
- https://github.com/acarabott/audio-dsp-playground
