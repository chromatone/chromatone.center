# Chromatone

[![](https://v2.chromatone.center/media/logo/logo.svg)](https://v2.chromatone.center/)

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
- Noise lab
- Harmonics
- Oscilloscope
- Synth waveforms
- Drum machine
- Fretboard detect chord


## STACK
- [vue 3](https://v3.vuejs.org/)
  - [vueUse](https://vueuse.org)
  - [vueUse/gesture](https://gesture.vueuse.org)
    - how to prevent scrolling [example](https://vuepress.vuejs.org/guide/i18n.html#default-theme-i18n-config)
- [vite](https://vitejs.dev/)
  - [vite-plugin-components](https://github.com/antfu/vite-plugin-components)
  - [vite-plugin-icons](https://github.com/antfu/vite-plugin-icons)
    - [Icônes](https://icones.js.org/)
  - [vitepress](https://vitepress.vuejs.org/guide/global-component.html#content)
    - i18n like in [vuepress](https://vuepress.vuejs.org/guide/i18n.html#default-theme-i18n-config)
- [windi css](https://windicss.org/)
- [pug](https://pugjs.org/api/getting-started.html)
- [tonaljs](https://github.com/tonaljs/tonal)
- [webmidi.js](https://webmidijs.org/docs/)
- audio
  - [tone.js](https://tonejs.github.io/docs/14.7.77)
  - [meyda](https://meyda.js.org)
  - [aubiojs](https://github.com/qiuxiang/aubiojs)
  - [audiomotion-analyzer](https://www.npmjs.com/package/audiomotion-analyzer) ? need to unconnect it from canvas to use with svg. It has 1/12 octave frequ bars to visualize
  

#### AudioWorklet further research
- https://dev.to/ndesmic/building-a-digital-synthesizer-part-1-making-some-noise-g7k
- https://developer.mozilla.org/en-US/docs/Web/API/AudioWorkletNode
- https://github_com.jam.dev/GoogleChromeLabs/audioworklet-polyfill
- https://github.com/acarabott/audio-dsp-playground