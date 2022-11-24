---
title: Circles
subtitle: A circular rhythm and polyrhythm exploration tool

date: 2021-10-02
cover: tempo.png
links:
  - https://habr.com/ru/post/278265/
---

<client-only >
  <beat-circle />
</client-only >

<script setup>
import BeatCircle from './main.vue'
import MidiControls from './midi.vue'
</script>

## Welcome to the all-mighty Chromatone circular metronome!

It's the center for deep exploration of any kind of rhythmic patterns. We have two independent wheels ready to hold any variety of looping beats. Here's how you operate it:

1. Set the **number of steps** with the top left slider. The external loop takes up to 48 steps for long sequences. The internal loop is smaller and can hold up to 16 steps.
2. Set the **number of subdivisions** of a measure with the top right slider. If the left and right numbers are equal you get a full loop cycle equal to one measure. But many more combinations are possible!
3. Turn steps **on and off** by clicking the colored wheel segments. The colorful lines connect all active steps of a sequence.
4. Use the <ic-baseline-refresh /> button to reset the mutes distribution to the [Euclidean rhythm](./../../../theory/rhythm/system/euclidean/index.md) given the number of mutes and given the loop steps count.
5. You can **set accents** on certain steps by clicking the step number. Filled circles produce an accented sound, hollow ones are regular beats.
6. Of course you can choose one of **5 sound kits** for the wheels independently. Just drag or click the bottom left slider (that one with the letters A-E).
7. If you want your own sounds to be played by the metronome – choose the last letter **F**. It'll open the two recorders and loaders for that. **Record any sound** from your microphone or **upload any sound file** for both regular and accented beats.
8. Adjust the **panning** <mdi-pan-horizontal /> and the **volume** <la-volume-up /> of each loop with the sliders on the bottom right. You can even set two independent rhythms to play in two separate channels (left and right).
9. Press **play** button <la-play /> in the top right corner and listen to the patterns you've created. The playback may be paused <la-pause /> and resumed from that place or stopped and reset with the stop button <la-stop />. If you don't hear any sound on you mobile – just turn off the silent mode. Tested on iOS, it works!
10. There are two arrows <la-angle-left /> and <la-angle-right /> near the meter numbers at the top of the loops. With them you can **rotate the pattern** left or right at any moment, producing even more complex and evolving sequences.
11. The center circle of the metronome is very interactive. Use the <la-minus /> and <la-plus /> buttons to incrementally **change the tempo** by one BPM. Or press <la-slash /> and <la-times /> sectors to divide/multiply the tempo by two. It's like traversing the octaves of sound pitches. Notice that you get the same 'note' and starting color for these tempos.
12. You can also just tap and drag the center circle to change the tempo gradually, either with touch on mobile or mouse pointer on desktop.
13. The top left corner with the tempo information works the same – **drag it** to set the tempo you want.
14. At the bottom of the screen you can find buttons to get the tempo from the world around you to the app. The bottom left ear button <tabler-ear /> activates the sophisticated **analyser that can determine the tempo** from any incoming audio signal. Turn it on and let the microphone hear your rhythm: clap it, stomp it, sign it or just turn the music on. The app will listen to the audio and show it's guess in the box near the 'ear' button. If you like what you get just press the number and the tempo will be set to the metronome itself.
15. The bottom right hand button <fluent-tap-double-20-regular /> is just good old **tap tempo**. Tap it three times or more to see the tempo you've imagined or hear playing. The more you tap – the more precise the result gets. Then tap the number to set the main tempo to the new value.
16. If you see a square icon <la-expand /> at the bottom left corner, you are able to open the circle metronome to the **full screen**. What an immense experience!
17. Once you build some interesting patterns you can **export them as a MIDI file** to use in any DAW or other MIDI-compatible tool. Just press the <la-file-download /> button at the right bottom corner and choose a place to save it to your system. Then you can drag and drop it to your DAW timeline, choose intrument for the tracks and transpose the notes to desired notes.
18. Explore our [rhythm theory section](../../../theory/rhythm/index.md) for inspiration about what to dial into the loops. This app can act as a simple visual and audial cue for your music practice or become a tool to explore the enormous space of possible rhythmic combinations. Polyrhythms have never been so easy to see and internalise. The colors and the form of the metronome can help sticking to the tempo even in silence. Be creative and feel the power of this rhythm visualisation tool.
19. You can also control all the parameters of the metronome with your MIDI-controller. Use the knobs to send the **CC messages number 1-16** on **channel 1** for it. Two loops are independently controlled by these MIDI commands. You can easily change the CC numbers here.

<client-only >
  <midi-controls />
</client-only >
