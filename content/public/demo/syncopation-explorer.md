# Syncopation Explorer

*A bar of time you can take apart with your fingers: four synthesized drums, a float for a clock, and a colour wheel that turns rhythm into harmony.*

`syncopation-explorer.html` is one file. It plays four drums that are built from oscillators and noise at the moment each hit is scheduled, it draws one bar of music as four lanes or as four inlaid rings, and it lets you place every hit at any real-valued position in that bar. This document is the long version of how it was built, why it is shaped the way it is, what went wrong on the way, and where it could go next.

| | |
|---|---|
| File | one `.html`, 544 lines, 50 KB (18 KB gzipped) |
| Script / styles | 447 lines of JS (41 KB), 79 lines of CSS (7 KB) |
| Dependencies | none to run. One Google Fonts stylesheet (three typefaces), each with a system fallback |
| Audio | Web Audio only. No samples, no files, no libraries |
| Views | bar (four lanes) and circle (four inlaid cycles) |
| Grids | any combination of 1 to 16 divisions per bar |
| Rhythms | 38 presets in 8 families, all editable |
| Tempo | 40 to 200 BPM, one bar is four beats, so a bar lasts `240 / bpm` seconds |
| State | saved in the viewer's browser (`localStorage`), nothing leaves the page |

---

## 1. What it does, in one minute

You get a bar. It has four tracks, from the top: **ka** (a wooden tick), **ts** (a shaker), **ch** (a snare) and **bum** (a kick). Click a track to drop a hit. The horizontal position is the exact moment in the loop. The height is how loud it is. Drag it to move it, click it to remove it.

Behind the tracks sits a grid. You choose which divisions of the bar to show: 2, 3, 5, 7, 16 or any mix. Each division has its own colour. A hit that sits on a grid line is on the grid. A hit that sits between lines is syncopated or micro-shifted, and the readout under the tracks tells you by how many milliseconds, and against which grid line.

Press **Circle** and the same bar wraps into four concentric rings. Angle is time, distance from the ring's inner edge is velocity. Nothing is converted. It is the same data drawn in polar coordinates.

Three things to try first:

1. **Hear the difference between a grid and a feel.** Load *Samba batucada*, then *Samba, measured 16ths*. The second one re-times the same pattern so that the four 16th notes of every beat last 26.0, 20.3, 21.3 and 32.4 percent of the beat instead of 25 each. Select grid 16 and watch the hits sit just off the lines.
2. **Hear a fourth.** Select grids 3 and 4, turn on **Grid ticks**, press Space. The two sets of ticks are tuned to the pitch of their own rate (section 7). Three against four is the interval of a perfect fourth, and you can hear it as well as see it.
3. **Loosen a track while it plays.** Load *Son clave 3-2*, press Space, and turn the knob next to **bum** upward. The kick grows from a tight thump into a long boom without stopping the loop.

---

## 2. The one idea: time is a float between 0 and 1

Most step sequencers hold a list of sixteen booleans. That is convenient, and it hides almost everything that matters in the rhythms this tool is about. A samba 16th is not a sixteenth. A Dilla snare is not on the grid. A Candombe chico drags. If the data model has no room for "between", every one of those facts has to be faked with an offset on top of the grid.

Here a hit is this:

```js sketch
{ p: 0.34375, v: 0.82 }      // p: position in the bar, 0 <= p < 1.  v: velocity, 0 < v <= 1
```

The grid is a drawing, not a data structure. It is a set of lines at `k / n` and a magnet that is allowed to pull a hit onto them. Everything else follows from that choice:

- Loops wrap with one operation: `p + 1` when the position has already passed.
- Tempo changes cost nothing. Positions are fractions of a bar, so only the bar's duration changes.
- Every tradition's published timing is just a list of numbers. The research tables in this project give hits as percentages of the bar, and the loader for those is one `split` and a division by 100.
- The readout is one line of arithmetic: the distance from the nearest grid line times the bar duration.

```js verbatim
function readout(p,v){const b=nearest(p),ms=b.d*barDur()*1000;
```

That is the whole microtiming ruler. `nearest` walks the active grids (plus the always-present 8-division base) and returns the closest line; `ms` says how early or late the hit is in real time at the current tempo.

---

## 3. Anatomy of a 544-line file

The page reads top to bottom in the order things are needed:

1. CSS tokens and layout (79 lines for everything: header, chip strips, lanes, knobs, circle wrapper).
2. Colour: the Chromatone functions.
3. State: one plain object `S`, and four track objects in an array `T`.
4. The rhythm library: notation helpers and 38 presets.
5. Audio: graph setup, four voice functions, the size envelope.
6. The scheduler.
7. UI construction and wiring.
8. Persistence.
9. Pointer editing (bar view), then the circle's geometry, hit-testing and handlers.
10. Drawing: ruler, lanes, circle, and the frame loop.
11. Boot: restore saved state or load the first preset.

### How the code stays small

None of this is clever in a way you need to study. A few habits do most of the work.

**Data first.** A rhythm is a string. `'X.....x.X.....x.'` is sixteen steps with `X`, `x`, `o`, `g` as four velocity levels (1, .82, .58, .34) and `.` as silence. A whole preset is four such strings and a few labels. Presets that need real-valued timing use small helpers (section 10) instead of hand-written numbers.

**One `sync()`.** Whenever state changes (a hit is placed, a chip is pressed, the tempo moves) the code calls `sync()`. It recomputes colours, updates the tempo readout, refreshes chip states and titles, toggles the view class, and schedules a save. Nothing else keeps those in step. There is no store, no subscription, no diffing.

**Immediate-mode canvas.** The lanes and the circle are redrawn from state on every animation frame. That sounds wasteful and costs very little: four lanes and a few dozen hits. In return, there is no invalidation logic at all. A hit that is dragged, a playhead that moves, a flash that fades are all just the next frame.

**CSS as tokens.** Colours, fonts and the label column width are custom properties. The theme is one block. The responsive behaviour is two media queries.

**No abstraction for things used once.** The four voices are four arrow functions in an array indexed by track. The pointer logic for the lanes and the pointer logic for the circle are two separate small blocks, because their geometry differs and a shared abstraction would have been longer than both.

### What it costs

The code is dense. Many lines carry several statements. It is easy to read in an editor with a formatter on and hard to review as a diff. If this file grows, the first thing to do is run it through a formatter and split the script into modules. The compactness here is a property of a one-file demo, not a style recommendation for a project that will have several authors.

---

## 4. Timing you can trust

JavaScript timers are not clocks. `setInterval(fn, 25)` can fire at 25 ms, or at 31 ms, or not at all for a second if the tab is busy or hidden. Audio hardware, on the other hand, runs on a clock that is sample-accurate. The standard fix, and the one used here, is a **lookahead scheduler**: a loose timer wakes up often and schedules the next slice of audio against the audio clock, a little way into the future.

```js verbatim
function sched(){
  if(!S.playing)return;
  const now=ctx.currentTime,hz=now+LOOK;
  if(cursor<now-.05){cursorPhase=(cursorPhase+(now+.03-cursor)/barDur())%1;cursor=now+.03}   // tab stalled: resync
  if(cursor>=hz)return;
  const dur=barDur(),a=cursorPhase,b=a+(hz-cursor)/dur;
  const when=p=>{if(p<a)p+=1;return p<b?cursor+(p-a)*dur:-1};
  T.forEach((t,i)=>{if(t.muted)return;for(const o of t.hits){const w=when(o.p);if(w>=0){o.fl=w;VOICE[i](w,amp(o.v))}}});
  if(S.tick)for(const k of ticks){const w=when(k.p);if(w>=0)tickVoice(w,k.f,k.a)}
  cursor=hz;cursorPhase=b-Math.floor(b);
}
```

How it works:

- `cursor` is the audio-clock time up to which events have already been handed to the audio engine. `cursorPhase` is the loop position at that moment, as a float.
- Each wake-up looks at the window from `cursor` to `now + 0.14 s` and converts it to a range of loop positions `[a, b)`. `b` can be larger than 1, which is how the loop wraps.
- `when(p)` answers one question: does a hit at position `p` fall inside the window, and if so at what audio time? A hit that is before `a` is treated as `p + 1`, the same hit one lap later.
- Every hit inside the window is started with an explicit start time. After that, the audio engine owns the timing. If the main thread stalls for 50 ms, nothing audible happens.

### The gotchas that mattered

**Hidden tabs throttle timers.** The browser may stretch a background tab's `setInterval` to one second. A 140 ms lookahead cannot survive that. The scheduler tick therefore runs inside a tiny Web Worker created from a `Blob`, which is not throttled the same way, and posts a message every 25 ms. If a worker cannot be created, it falls back to `setInterval` on the main thread.

**Resync after a real stall.** If the window is already in the past by more than 50 ms (the machine slept, the tab was frozen), the code advances `cursorPhase` by the elapsed time and restarts from now instead of firing a burst of late hits.

**The playhead is drawn from the audio clock.** `ctx.currentTime` minus `outputLatency` is what you hear now. The visual playhead and the hit flashes use that, not wall-clock time, so the flash lands when the sound does.

**Tempo changes mid-loop.** Because the cursor is stored as a loop phase and a time, changing `S.bpm` only alters how much phase one second of audio covers. The loop continues from where it was.

**Nothing audible starts before a click.** Browsers refuse to start audio until the page has seen a gesture. The audio context is created lazily, on the first pointer-down in the capture phase, and resumed on every later one.

---

## 5. A drum kit made of arithmetic

All four voices are built each time a hit fires, from oscillators and filtered noise. The inputs are the start time and the amplitude. Nothing is cached except one second and a half of white noise and one generated reverb impulse response.

| Track | Recipe |
|---|---|
| **bum** (kick) | A sine that falls from `105 + 55 * velocity` Hz to 50 Hz in 130 ms, with a 550 ms amplitude tail, plus a 25 ms click of low-passed noise. The bus goes through a `tanh` waveshaper (drive 2.2, 2x oversampled) for a bit of warmth. |
| **ts** (shaker) | White noise through a 5.4 kHz high-pass, a +6 dB peak at 8.8 kHz and a 13.5 kHz low-pass. The decay is `35 ms + 40 ms * velocity`, so louder hits ring slightly longer. |
| **ch** (snare) | Two bands of noise (2.7 kHz with a 150 ms tail, 1.15 kHz with a 90 ms tail) plus a triangle "body" that falls from 215 Hz to about 150 Hz in 70 ms. |
| **ka** (wood) | A sine at `930 + 220 * velocity` Hz that falls a few percent in the first 12 ms, a second partial at 2.43 times the frequency, and a 9 ms bandpassed click. |

Some decisions that matter more than the recipes:

**Velocity is a curve, not a multiplier.** `amp(v) = 0.04 + 0.96 * v^1.6`. Loudness does not feel linear, and a sequencer that maps pixels to gain linearly makes the bottom half of every lane too quiet to use. The exponent gives the lane an even feel from bottom to top. Velocity also changes timbre: the kick's start pitch, the wood's pitch and the shaker's tail length all move with it, which is why velocity reads as "expressive" and not only as "louder".

**No two hits are identical.** Each noise burst starts at a random offset in the shared noise buffer. A shaker played sixteen times in a row does not give the machine-gun effect of the same waveform repeated.

**Spaces.** There is a generated 0.9 s stereo impulse response (noise with a steep decay, run through a one-pole low-pass, so it is dark and short) and each track sends a different amount into it: none for the kick, 12% for the shaker, 26% for the snare and 20% for the wood. It gives the kit a shared small room, which is most of what makes four unrelated synths sound like one kit.

**A compressor at the end of the chain.** Threshold -12 dB, ratio 5:1, attack 2 ms, release 180 ms, then a master gain of 0.8. It is there for long listening sessions: stacked hits at full velocity are held in check, so a dense pattern does not jump out at you.

**No harsh top end.** The shaker is low-passed at 13.5 kHz, and the wood's pitched content stays under about 3 kHz. That choice was made for the ear, not measured. The claim "pleasant for hours" is a design intent, and the person who practices with it is the only real test.

---

## 6. The size knob

Each track has a knob next to its name. It is a macro: one gesture that moves several parameters of one voice together. Turned up, the track gets looser, with a longer release and a fuller sustain. Turned down, it gets tight and dry. At 12 o'clock, there is a detent, and the voice is exactly the original.

The mapping is described by one number per track, `u`, running from -1 (tight) to +1 (loose), and two rules that every voice follows:

1. **Release time** is multiplied by `K^u`, with `K` chosen per voice: 5 for the kick, 4 for the shaker, 3 for the snare, 4 for the wood.
2. **Sustain level** is multiplied by `6^u`.

The interesting part is how to add a sustain level to an envelope that never had one. These drums are all a fast attack and one exponential decay. The trick is to split the decay in two at 30% of its length and to place the knee exactly where the single exponential would have been:

```js verbatim
const env=(g,t,pk,a,d,u=0)=>{const p=g.gain,pp=Math.max(pk,2e-4);p.setValueAtTime(1e-4,t);p.exponentialRampToValueAtTime(pp,t+a);
  if(!u)return p.exponentialRampToValueAtTime(1e-4,t+a+d);
  p.exponentialRampToValueAtTime(Math.max(1e-4,Math.min(pp*.9,pp*Math.pow(1e-4/pp,.3)*Math.pow(6,u))),t+a+d*.3);p.exponentialRampToValueAtTime(1e-4,t+a+d)};
```

With `u = 0` the function takes the original single-exponential path. For any other `u` the knee starts on that same curve and moves away from it smoothly, so there is no jump as you leave the detent. With `u > 0` the knee is lifted (the track holds its level longer, then lets go), and with `u < 0` it is lowered (the track drops quickly and fades). One envelope function, no special cases per voice.

Each voice adds a few small moves of its own:

| Track | Release | Extras when loose |
|---|---|---|
| bum | 0.11 s to 2.75 s | slower, slightly deeper pitch drop, less click |
| ts | a tick to about 0.3 s | band shifts a little lower, level compensated |
| ch | 3x shorter to 3x longer | body tone gets lower and longer |
| ka | 4x shorter to 4x longer | longer ring on both partials |

The knob is read **when a hit is scheduled**, not when the sound is built in advance. Since the scheduler looks 140 ms ahead, a turn of the knob is heard within a beat, and you can tighten and loosen a track while it plays. That was the point: a pattern that sounds mechanical at one setting becomes phrasing when the size of the sound is something you play.

The knob responds to a vertical drag (140 px for the whole range), the mouse wheel, and the arrow keys when it has focus. Double-click or Home resets to the centre. A 2.5% dead zone around the centre snaps to the exact original, so "back to normal" is easy to hit. Releasing it plays a sample hit of that track after a short pause, which is how you hear what you set. The position of every knob is saved with the rest of the state, and stays when you switch rhythms.

---

## 7. Chromatone, harmonics and the grid

This is the part that turned a sequencer into an instrument for thinking.

### 7.1 A grid has a frequency

A bar lasts `240 / bpm` seconds. A grid with `n` divisions has one line every `bar / n` seconds, which is a rate of:

```js verbatim
const gHz=n=>n*S.bpm/240;                            // n divisions per bar is a rate of n * bpm / 240 Hz
```

At 100 BPM, grid 16 pulses at 6.67 Hz and grid 3 at 1.25 Hz. These are far below hearing, but they are frequencies, and frequencies have ratios, and ratios have names. The ratio between grid 4 and grid 3 is 4:3. In music that ratio is a perfect fourth. The ratio between 3 and 2 is a perfect fifth. Grid 8 against grid 4 is an octave, which is why they feel like the same pulse at two speeds.

| Grids | Ratio | Semitones | Interval | Angle on the colour wheel |
|---|---|---|---|---|
| 2 : 3 | 1.5 | 7.02 | perfect fifth | 211° |
| 3 : 4 | 1.333 | 4.98 | perfect fourth | 149° |
| 4 : 5 | 1.25 | 3.86 | major third | 116° |
| 5 : 6 | 1.2 | 3.16 | minor third | 95° |
| 5 : 7 | 1.4 | 5.83 | 17 cents under a tritone | 175° |
| 7 : 8 | 1.143 | 2.31 | a whole tone, 31 cents wide | 69° |
| 5 : 8 | 1.6 | 8.14 | a minor sixth, 14 cents wide | 244° |

(Angles are on the plain twelve-semitone wheel before the perceptual remap in 7.3.)

The relationship holds at every tempo. Change the BPM and every grid's frequency moves, but all the ratios stay put, so the intervals between grids do not change.

### 7.2 Chromatone: a note is a colour

The colour system follows one rule. **A is red, and every semitone turns the hue by 30 degrees**, so twelve semitones bring you back to red. Octaves share a colour. Any frequency can be folded into one octave and given a colour that way.

```js verbatim
const hueOf=f=>{const d=((30*semis(f))%360+360)%360,i=Math.floor(d/60);return(HUES[i]+(HUES[i+1]-HUES[i])*(d-i*60)/60)%360};
```

That is the whole system in one line. `semis(f)` is the number of semitones from A (440 Hz) for any frequency, in any octave. The rest maps that angle to a perceptual hue.

### 7.3 Laid onto OKLCH

Colours are drawn in **OKLCH**, which gives every hue the same lightness and chroma, so no colour in the wheel looks louder than another. The wheel the rule describes is the familiar RGB wheel, whose hue spacing is uneven in OKLCH (red to yellow is 81 degrees there, yellow to green only 32). To keep the 30-degrees-per-semitone rule honest, the code interpolates between the OKLCH hues of the six RGB corners:

```js verbatim
const HUES=[29,110,142,195,264,328,389];            // OKLCH hue at RGB-wheel angles 0, 60 ... 360
```

Every colour in the interface is built by one function, `ok(hue, lightness, chroma, alpha)`, which returns a CSS `oklch()` string. The default is lightness 0.76 and chroma 0.16, which is vivid enough to carry meaning on a dark background and quiet enough to look at for an hour. Canvas contexts are requested with the `display-p3` colour space where the browser supports it, so on a wide-gamut display the colours use the wider range, and everywhere else the browser maps them down.

C comes out as a lime green. That is a property of the RGB wheel the rule is based on. Because the whole wheel hangs off the table above, a different anchor set is a one-line change.

### 7.4 Where colour shows up

**Tracks have a colour from the pitch of their voice.** The kick is around 55 Hz, which is an A, so it is red. The snare body is around 185 Hz, which gives a blue. The shaker's bright band is at 8.8 kHz, and comes out green; the wood sits near 1 kHz and comes out yellow. None of these colours was chosen. They are what the voices already are.

**Grids have a colour from their rate in Hz.** Each chip's dot and its lines across the lanes use the colour of `n * bpm / 240` Hz. Hover a chip to see the number and the note. Because the colour depends on the tempo, **the colours drift as you change the BPM** and the relationships between them stay fixed. A fourth is always about 150 degrees of wheel angle from its root, at any tempo. The idea is that you can read a polyrhythm by its colours: two grids whose lines are close in hue are a close interval, and a pair on opposite sides of the wheel are a tritone.

**The tempo has a colour and a note.** The readout next to the BPM shows the beat rate as a pitch. 60 BPM is 1 Hz, which is a C about 38 cents flat. That is **C-4 in scientific pitch notation**. (We started this by calling that note C-6; the number depends on the octave convention, the pitch class is C either way, and `noteOf` uses the scientific one.) At 92 BPM the beat is 1.53 Hz, a G a couple of cents sharp. The slider's accent colour, the BPM digits and the readout dot all take the tempo's colour.

### 7.5 The ticks play the grid

**Grid ticks** is a mode in which every line of every selected grid gives a short click. The click for grid `n` is a sine at the pitch class of that grid's rate, folded up into one octave (330 to 660 Hz):

```js verbatim
const fold=f=>{while(f<330)f*=2;while(f>=660)f/=2;return f};
```

A grid of 16 at 100 BPM is 6.67 Hz, which folds to 426 Hz. A grid of 3 is 1.25 Hz, which folds to 640 Hz. Turn both on and the ticks sound a pair of notes whose interval is exactly the ratio of the grids. 3 and 4 sound as a fourth, 2 and 3 as a fifth, 4 and 5 as a major third. You can dial a polyrhythm and listen to the chord it implies.

### 7.6 Where the analogy holds and where it stops

The mathematics is exact. Rate ratios are ratios, and folding by octaves is how pitch class is defined. The mapping from grid to colour and to tick pitch is a clean, consistent translation, and it is useful because it is consistent.

It would be wrong to say that rhythm and pitch are the same thing. Pitch perception happens above about 20 Hz, where the ear fuses periodicities into a tone; rhythm perception happens below about 10 Hz, where we hear separate events and group them into a meter. A 3-against-4 does not sound like a fourth in the way two sine tones do. The tick folding is what makes the relationship audible: it borrows the pitch system to display a ratio that the rhythm system only implies. The visual and audible relationships are labels for an exact ratio, and they are more or less helpful depending on the person.

---

## 8. The circle

The circle is the same data in polar coordinates, drawn on a second canvas that replaces the lanes when you press **Circle** (or `V`).

- **Angle** is the loop position. `p = 0` is at 12 o'clock and the loop runs clockwise: `angle = p * 2π - π/2`.
- **Radius** inside a ring is velocity. Each ring has a baseline at its inner edge (a thin circle in the track's colour) and a hit rises outward from it.
- **Rings** from the centre out are bum, ch, ts, ka, which is the lanes' order from the bottom up.
- **Grids** are radial spokes, one colour each, crossing all four rings. Eighths are always drawn faintly. The playhead is a spoke with a trailing glow made with a conic gradient.
- The centre shows the BPM, and the ring of beat labels (`1 + 2 + 3 + 4 +`) sits just outside.

Editing is the same, with different geometry. A pointer position is converted to polar: the angle gives the loop position and the radius gives both the ring and, inside it, the velocity. Because the same snap function serves both views, the circle needs one small addition: **wrap-around**. In a lane, a position at the far right edge is the end of the bar. On a circle it is a short step before 12 o'clock, and it should snap to `0`, not stay at `0.9999`. Snapping takes a `wrap` flag that lets the last division close onto the first.

Hit detection on a ring is done in arc length at the pointer's own radius. The tolerance is 11 px, which means a hit near the centre (where angles are small steps) is exactly as easy to grab as one on the outer ring.

The circle makes some things visible that the lanes hide. A rhythm that is a rotation of another one, like the two sides of a clave, shows up as the same shape turned by some angle. A symmetric pattern is a symmetric picture, and evenly spread (Euclidean) rhythms come out close to regular polygons.

---

## 9. Small things that make it feel snappy

- **Everything draws from the frame loop.** No handler draws. Handlers change state and the next frame shows it.
- **Magnet tolerance is 7 px, hit tolerance is 11 px.** Snapping is generous enough to be useful and small enough that you can still place a hit between two lines. Alt turns snapping off for a free placement.
- **A hit is grabbed anywhere along its stem.** The stem from the baseline to the dot is part of the target, so you do not have to aim at the dot.
- **A click on a hit removes it, a drag moves it.** The 4 px movement threshold separates them. Right-click also removes. A new hit starts a drag immediately, so one gesture can place and position.
- **Placing a hit plays it.** Placement, a completed drag and a knob change all trigger a sample hit, so the ear confirms the hand.
- **A hover ghost** shows where the next hit would land, after snapping, before you click.
- **The BPM is a draggable number.** Right or up is faster; one BPM per 4 px; clamped to 40 to 200. The minus and plus buttons and the arrow keys do the same.
- **Chip strips scroll in every way.** The grid and rhythm strips are single-line scrollers with edge fades that appear only where there is more to see. They respond to the mouse wheel (translated from vertical to horizontal), to mouse drag, and to touch. After a drag, the click that follows is suppressed so a drag never selects a rhythm. The active rhythm scrolls into view.
- **Rhythms step with the arrow keys.** Left and right move through all 38 in order.

---

## 10. The rhythm library and where its data comes from

The library is 38 presets in eight families: Cuba, Brazil, Latin & Caribbean, Africa, Europe, Jazz & beats, Asia & Oceania, and Cycles (the polyrhythms). Every preset names its four voices (the kick lane might be a surdo, a düm, a bayan or a boom), sets a tempo and a grid, and carries a short note about what is unusual.

Four notations cover everything:

```js verbatim
const pc=s=>s.trim()?s.trim().split(/\s+/).map(h=>{const[a,b]=h.split(':');return{p:a/100,v:b/100}}):[];
```

**`pc('0:100 37.5:80 50:95')`** reads hits as percent-of-bar:velocity, which is the notation of the research tables, so published data is entered as it is written.

**`'x..x..x...x..x..'`** is a sixteen-step string. `X x o g` are four velocities, `.` is a rest.

```js verbatim
const wp=r=>{const c=cumul(r);return hs=>hs.map(h=>{const s=Math.round(h.p*16);return{p:((s>>2)+c[s&3])/4,v:h.v}})};
```

**`wp(ratio)`** re-times a 16th-note pattern. Each beat is cut into four parts whose lengths follow the ratio, so the same pattern gets the swing of Rio (`22:28:23:27`), Bahia (`19:25:30:26`) or a measured samba (`26:20.3:21.3:32.4`).

```js verbatim
const sub=(r,s,beats=4)=>{const n=r.length,c=cumul(r);if(s.length!==beats*n)throw Error('sub '+s);
```

**`sub(ratio, steps)`** repeats a ratio inside every beat, so `sub([63,37], ...)` is a medium-tempo swing and `sub([45,25,30], ...)` is the Tunisian Sṭambēlī triplet. **`grp(ratio, steps, k)`** applies the ratio across the whole bar, which is how a Viennese waltz becomes a bar of three unequal pulses (27, 40 and 33 percent), and a Bulgarian 5/8 becomes two groups at 38 and 62 percent. Both throw an error at load time if a pattern string has the wrong length, so a typo cannot ship silently.

### Pairs for the ear

A number of rhythms come in pairs on purpose: *Cumbia, on grid* and *late llamador*; *Candombe, on grid* and *dragged chico*; *Samba batucada*, *research feel* and *measured 16ths*; *Son clave 3-2* and *pushed tresillo*. Load one, then the other, while the loop plays. The difference is often a single percent of the bar, and it is the whole feel.

### What is measured and what is composed

This needs to be said clearly. The material came from three notes supplied for the project: a table of genres with 4-voice grids (timing as percent of the bar, velocity as 0 to 100), a note on regional microtiming, and a database of beat-subdivision ratios with sixteen entries.

- The first two give **actual hit lists**. Those are entered as written or lightly adapted, apart from the two places where the table disagreed with the standard form of the rhythm. *Rumba clave 3-2* ends its second bar on 75 percent (the standard rumba 3-2), where the table listed 87.5. *Dembow* has a kick on every beat, where the table gave a tresillo-derived kick. Both presets say so in their info line.
- The ratio database gives **only the duration ratios**, not the patterns that ride on them. For Sṭambēlī, Mandé jembe, Ewe, Candombe corpus, Suingue baiano, the waltz, the polska, the Bulgarian and aksak groupings, jazz swing, bebop, the Dilla feel, Wangga and Haka, the ratios are exactly what the data says. The grooves on top are composed for this project, to give each ratio something plausible to carry, and the info line of each says so. *Teental* is in this group too: the data only says the 16 matras are nominally even, so the theka and the voicing come from general knowledge. *Samba carioca* is different: it applies its ratio to the batucada pattern from the first note.
- A handful of presets did not come from the supplied notes at all: *One drop*, *Bossa clave*, *Afro 12/8 bell* and the four cycles (2:3, 3:4, 5:8, 7:8) are standard repertoire written from general knowledge.
- The notes themselves describe velocities as practitioner conventions and warn that real performances vary by 20 to 40 percent between players. The timing values are canonical or idealised. Treat every preset as a starting point to be edited by ear. It is not a transcription.
- The notes cite Toussaint's *The Geometry of Musical Rhythm* (2013), Witek et al. (2014) on syncopation and groove, and Longuet-Higgins and Lee (1984) on metrical syncopation. We did not independently check those citations or the figures against the literature.

---

## 11. Gotchas

Three of these actually bit during the build (11, 12 and 13, marked in bold). The rest are well-known traps that the design was written to avoid from the start, and they are listed because they are the ones to remember in the next project.

| # | The trap | How it is handled |
|---|---|---|
| 1 | Audio does nothing until the user acts. | Build the `AudioContext` lazily on the first pointer-down (capture phase) and `resume()` on every later one. |
| 2 | Hidden tabs stretch timers, and the beat stutters. | Run the 25 ms scheduler tick in a `Blob` worker; keep the lookahead at 140 ms and resync after real stalls. |
| 3 | Hits are scheduled up to 140 ms ahead, so a flash drawn at schedule time would lead the sound. | Store each hit's audio start time when it is scheduled, and draw against `ctx.currentTime - outputLatency`. |
| 4 | `exponentialRampToValueAtTime` throws on zero. | Floor every envelope at `1e-4` and the peak at `2e-4`. |
| 5 | Adding sustain to a voice changed its sound at the default setting. | Place the envelope's knee on the original exponential, so `u = 0` reproduces it exactly. |
| 6 | A transparent-fade trick, `colour + '00'`, only works for hex colours. | All colours go through `ok(h, L, C, alpha)`, which returns `oklch(... / alpha)`. |
| 7 | A canvas takes its colour space on the first `getContext` call only. | Ask for `display-p3` there, inside a `try`, and keep the context on the object so resizes reuse it. |
| 8 | Hidden canvases measure zero. When the view is switched, a canvas is sized zero until the `ResizeObserver` fires. | All drawing skips a canvas whose width is 0, and the observer refits both views whenever either shows. |
| 9 | In the circle, hits just before 12 o'clock refused to snap onto 0. | `snap` takes a `wrap` flag so the last division can close onto the first. |
| 10 | Dragging a chip strip with the mouse also selected the chip under the pointer on release. | A capture-phase click handler swallows the click that follows a drag. |
| **11** | **On a 360 px phone, the header was wider than the screen.** The tempo readout and four toggles did not fit. | `flex-wrap` on the tempo group and the toggles, `min-width: 0` on the strip children. Found by measuring `scrollWidth` at several viewport sizes. |
| **12** | **The lanes were in the wrong order.** The brief asked for ka, ts, ch, bum from the top. The loop that built them used `[3,2,1,0]`, which gave ka, ch, ts, bum. The circle was correct. | A test dragged the second knob and the third track changed. The loop is `[3,1,2,0]` now. A check that drives a control and reads back which thing changed is worth running even on work that looks finished. |
| **13** | **The tempo note was first reported as "20 cents flat".** That number came from an estimate. | Computing it gave 38 cents. Recompute a figure before printing it. |

---

## 12. Where to take it next

Roughly in order of how much each would add.

**Per-track swing.** The `sub` ratio already encodes swing. A knob that sets a ratio for each track's off-beats would make the Dilla feel a thing you play with a gesture, and a hat could swing while the kick stays straight.

**Rotate a ring.** A phase offset per track, in fractions of a bar. In the circle it would be a literal rotation of a ring by dragging its edge. Rotation is how clave directions (3-2 and 2-3) relate, and how many Cuban and West African timelines are the same shape turned.

**Polymetric tracks.** Give each track its own cycle length: three beats against four, five against four. The circle view is already the right picture, because rings of different speeds would turn against each other and come back into alignment after a common period.

**Euclidean generators.** A button that fills a track with `k` hits spread as evenly as possible across `n` steps. Toussaint's work on Euclidean rhythms argues that many traditional timelines have exactly this shape.

**A live syncopation meter.** A score for the current pattern built on Longuet-Higgins and Lee's metrical weights, shown beside the readout. The cited groove research describes an inverted U between syncopation and the pleasure people report, so a meter would show where a pattern sits on that curve, with the caveat that it is one study's finding.

**Evenness and Fourier view.** A small polar plot of each track's discrete Fourier magnitude, which shows at once how much of a pattern is "in 3", "in 4" or "in 5". This would connect most directly to the harmonic analogy in section 7: the spectrum of a rhythm is the set of grids it implies.

**Sustained grid chords.** The ticks are short. An option that holds a quiet tone for each selected grid, at its folded pitch, would let you hear the whole polyrhythm as a chord and move it by changing the tempo.

**Pitched voices.** Tune the wood and body tone to a selectable root, and colour the hits by their interval to it. Rhythm identity would then have a melodic partner.

**Humanise and record.** A "play it in" mode that records hits from keyboard taps with quantise off, so real micro-timing from a player could be taken apart, measured against grids and saved.

**Share and export.** Copy the pattern as a short text string, and export standard MIDI for a DAW. (The page runs in a sandboxed frame where downloads and `mailto:` links do not work, so the copy button, and a paste box, are the realistic routes inside a published artifact.)

**Web MIDI.** Send the bar's hits out as notes, or sync to a clock, so the explorer can be an instrument rack's pattern source.

**Accessibility.** The knobs and the BPM already have keyboard support and ARIA roles. Placing hits has no keyboard route yet: a cursor that steps through grid lines and drops a hit with Enter would open the lanes to everyone.

---

## 13. Hacking guide

Everything is in one file, and each of these is a one-spot change.

- **Add a rhythm.** Append an object to `PR`:

  ```js sketch
  { f:'cu', n:'My clave', bpm:100, g:[16], v:['bass','shaker','conga','clave'],
    s:'what is unusual about it',
    t:[ 'X.......x.......', 'x.x.x.x.x.x.x.x.', '....x.......x...', pc('0:100 18.75:80 37.5:95') ] }
  ```
  The four entries in `t` are bum, ts, ch, ka, in that order, and each can be a string, a `pc(...)` list or the output of `sub`, `grp` or `wp`.
- **Change where A lands on the wheel.** Edit `HUES`. The six numbers are OKLCH hues at 0, 60, 120, 180, 240, 300 and 360 degrees of the RGB wheel.
- **Change how vivid the colours are.** The defaults sit in the `ok` function's argument list (lightness 0.76, chroma 0.16).
- **Change a voice.** The four functions in `VOICE` each take `(time, amplitude)`. Reading `U(i)` inside gives that track's size, from -1 to +1.
- **Change the size ranges.** `KR` holds the release range per voice and `6` in `env` is the sustain range.
- **Change the scheduling.** `LOOK` is the lookahead (0.14 s), and the worker's `postMessage(25)` is the wake-up interval.
- **Reset the saved state.** The key is `syncopation-explorer-v1` in `localStorage`.

---

## 14. Controls

| Input | Action |
|---|---|
| Click empty lane or ring | place a hit (height or radius is velocity) |
| Drag a hit | move it in time and velocity |
| Click or right-click a hit | remove it |
| Alt while placing or dragging | turn the magnet off |
| `Space` | play and stop |
| `V` | switch between bar and circle |
| `←` `→` | previous and next rhythm |
| `↑` `↓` (`Shift` for 5) | tempo up and down |
| Drag the BPM number | tempo, 1 BPM at a time |
| Knob: drag, wheel, arrows | track size, tight to loose (`Home` or double-click resets) |
| Grid chips 1 to 16 | show any set of grids |
| Grid ticks | click on every line of the chosen grids, tuned to their rates |
| Magnet | snap hits to the grid lines |
| M, × on a track | mute, clear |
| Clear | clear all four tracks |

---

## Credits

- Typefaces: Unbounded, Instrument Sans and JetBrains Mono, loaded from Google Fonts under the SIL Open Font License, with system fallbacks.
- The colour notation is the Chromatone rule as given for this project (A red, 30 degrees per semitone). The OKLCH remapping, the grid-rate mapping and the tick folding are this project's own.
- Rhythm data comes from the research notes supplied for the project; see section 10 for what that does and does not guarantee.
- The tests mentioned here were run in a headless browser, which can check the data, the layout and the interaction but cannot listen. Whether it sounds good is still decided by ear.
