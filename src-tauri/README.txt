Hey! we're looking for Rust MIDI routing solution for the open source music education platform  https://chromatone.center . In ideal world it could be something like a proper Rust port of https://webmidijs.org/, in real world it seems to some elaboration on the https://github.com/ruohki/tauri-midi-example . 

I could readily engage with the project, but I don't know any of Rust and it will take months for me to learn it in my spare time. 

I'm looking for someone to collaborate on the Chromatone desktop (and mobile?) apps Audio, Midi and Media APIs for the best of all music learners :rocket: 

https://github.com/chromatone/chromatone.center here's the repo with tauri builds going fine. 


There's the crate [midir](https://github.com/Boddlnagg/midir) and the starter. 

Some elaborations [by boonier](https://gist.github.com/boonier/9ea4deb9c0a8d38f124536680943d95b)


## Resources
- [tauri plugins video](https://www.youtube.com/watch?v=pTJhJGbjFzg)
- [midir Docs](https://docs.rs/midir/latest/midir/#modules)
- [ Build a Menubar app with Tauri ](https://www.youtube.com/watch?v=Jm5dzewv3gA) 
  - https://github.com/rust-adventure/yt-tauri-menubar-example

## Audio
- https://rustwasm.github.io/docs/wasm-bindgen/examples/web-audio.html
- https://timdaub.github.io/wasm-synth/ 
  + https://timdaub.github.io/2020/02/19/wasm-synth/
  + https://github.com/TimDaub/wasm-synth
- https://github.com/a-cordier/wasm-audio
- https://github.com/stephanepericat/rust-wasm-simple-synth
- https://github.com/h1romas4/rust-synth-emulation
- https://github.com/wildyeast/wasm-fm-synth
