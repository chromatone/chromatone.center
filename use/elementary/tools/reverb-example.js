import { el } from '@elemaudio/core';

const ctx = new (window.AudioContext || window.webkitAudioContext)();

// In the few functions below, we're going to look at implementing a reverb based on
// the classic Dattorro reverb topology. If you're interested, the original paper is here:
//
//   https://ccrma.stanford.edu/~dattorro/EffectDesignPart1.pdf

// We start here with a simple building block used all over the reverb topology,
// a simple Schroeder allpass filter.
//
//   https://ccrma.stanford.edu/~jos/pasp/Schroeder_Allpass_Sections.html
//
// We accomplish this using Elementary's tapIn/tapOut structure (this is part of the
// v0.9.7 prerelease branch, it's not officially stable yet, but close enough for a fun
// demo!). The tap structure allows us to design the feedback signal such that `fb` flows
// through a delay of length `size` samples, then feeds back around to the beginning of the delay.
// We match the feedback component with a feedforward component with inverted polarity to yield
// the allpass filter.
function schroeder(name, size, g, xn) {
  let fb = el.add(xn, el.mul(g, el.tapIn({ name })));
  return el.add(el.mul(-g, fb), el.tapOut({ name, size }, fb));
}

// Next we have the input diffusion stage. The reverb input first flows through
// a bandwidth filter, then through 4 Schroeder allpass sections which act to blur the input
// signal slightly before sending it into the reverb network
//
// The four allpass stages here have different sizes than the ones listed in the paper, which
// will affeect the blur characteristics slightly, but is a necessary constraint of Elementary's
// tap structure in the pre-release build.
//
// Each stage here is named independently according to the input `name`, which allows Eleentary
// to feed the appropriate signal from a given `tapOut` node to its corresponding `tapIn`.
function diffuse(name, x) {
  let steps = [
    { size: 512, decay: 0.75 },
    { size: 612, decay: 0.75 },
    { size: 517, decay: 0.625 },
    { size: 579, decay: 0.625 },
  ];

  return steps.reduce(function (acc, next, i) {
    return schroeder(`${name}:diff:${i}`, next.size, next.decay, acc);
  }, x);
}

// Next up is what I call the "tank," which is essentially the structure through
// which the diffuse signal from the prior stage feeds, then continues to feedback
// as it decays over time. This is the main part of our "reverb network" after the diffusion stage.
//
// As in the paper, this starts with another allpass step, followed by a delay, then
// a damping filter (here using el.smooth, a unity-gain one-pole lowpass), a decay coefficient,
// and a final allpass step.
function tank(name, decay, x) {
  let step1 = schroeder(`${name}:s1`, 672, 0.7, x);
  let step2 = el.delay({ size: 4453 }, 4453, 0, step1);
  let step3 = el.smooth(0.0005, step2);
  let step4 = el.mul(decay, step3);

  return schroeder(`${name}:s5`, 1800, 0.5, step4);
}

// Finally, we can put the whole structure together.
//
// Here we start by diffusing the input signal (I've omitted the initial bandwidth filter),
// then constructing the left and the right feeds for the two separate tanks by tapping the
// opposite feedback component.
//
// We run those left and right inputs through their respective tanks, and tap out for the feedback
// after.
//
// Finally, we sum the left and right out to yield the wet signal. This output tap formation is again
// different than the one in the paper, but sufficient for our demonstration!
function reverb(name, x) {
  // Adjust this coefficient on the range [0, 0.99] for longer or shorter decay tails.
  // 
  // Setting a value near 0.99 will yield a very long decay, which means
  // that the energy in the reverb tank will linger for a long time. This can get loud within the context of
  // this example because the arpeggio plays continuously, meaning that we continue to feed new energy into the
  // reverb tank while the existing energy is very slowly decaying, causing a buildup. This is an interesting
  // region to experiment with, but I recommend changing the input signal to play very occasionally or play briefly
  // and then stop.
  //
  // !!! WARNING !!!
  // Setting a value > 1.0 will cause instability in the feedback loop. That is, runaway feedback
  // which can get dangerously loud quickly. I've added some `Math.min` statements below to try to
  // protect from that. See note above about decay coefficients near 0.99; they also get loud.
  // !!! WARNING !!!
  let decay = 0.618;

  let d = diffuse(name, x);
  let leftIn = el.add(d, el.mul(Math.min(0.99, decay), el.tapIn({ name: `${name}:reverb:right` })));
  let rightIn = el.add(d, el.mul(Math.min(0.99, decay), el.tapIn({ name: `${name}:reverb:left` })));
  let leftOut = el.tapOut({ name: `${name}:reverb:left`, size: 3720 }, tank(`${name}:tank:left`, Math.min(0.99, decay), leftIn));
  let rightOut = el.tapOut({ name: `${name}:reverb:right`, size: 3163 }, tank(`${name}:tank:right`, Math.min(0.99, decay), rightIn));

  return el.add(leftOut, rightOut);
}

// ==============================================================
// The rest of the example code here concerns setting up the user interface and the
// plucky arpeggio that we send through the reverb. All of the code for the reverb itself
// is above.
//
// Read on :)
// ==============================================================

// This is a rather non-robust function taking note names in the form "a4" or "c#5"
// and mapping them to their corresponding MIDI note value. It's just robust enough
// for our example, but probably not to be used elsewhere without some additional effort!
function noteToMidi(n) {
  let notes = ['c', 'c#', 'd', 'd#', 'e', 'f', 'f#', 'g', 'g#', 'a', 'a#', 'b'];
  let [name, octave] = n.split('');

  return 12 * octave + notes.indexOf(name);
}

// A similarly hacked-through function for producing frequency values from midi note numbers.
function midiToFrequency(m) {
  return 440 * Math.pow(2, (m - 69) / 12);
}

// Our user interface component, a simple set of buttons which
// controls our app state using React's useState, and updates the
// signal processing in a useEffect hook after those stat updates.
function App(props) {
  let [dryGain, setDryGain] = useState(1.0);
  let [wetGain, setWetGain] = useState(1.0);

  useEffect(async () => {
    if (ctx.state === 'suspended') {
      await ctx.resume();
    }

    const a4 = noteToMidi('a4');
    const e4 = noteToMidi('e4');
    const c5 = noteToMidi('c5');
    const e5 = noteToMidi('e5');
    const d5 = noteToMidi('d5');
    const f5 = noteToMidi('f5');

    // The bulk of this effort here is just setting up the arpeggio sequence.
    // We start with `s1`, a hand-written sequence which repeats four times, as in `b1` below.
    // Then `s2`, another hand-written sequence which caps the end of the first bar in `b1`.
    let s1 = [a4, e4, d5, a4, f5, c5];
    let s2 = [a4, e4, d5, a4, c5, e4, c5, e4];
    let b1 = [...s1, ...s1, ...s1, ...s1, ...s2];

    // Then we produce a second bar just transposing the first bar down 5 steps, and
    // map the complete sequence into frequency values.
    let b2 = b1.map(x => x - 5);
    let seq = [...b1, ...b2].map(midiToFrequency);

    // Here we have the primary generator. A train at 5Hz triggers an ADSR envelope,
    // which is responsible for the plucky character of our arpeggio. The same train triggers
    // moving through the steps of the sequence we've created above. We run this sequence
    // through `el.blepsaw` for an anti-aliased sawtooth waveform, and multiply the same sequence
    // by 1.01 to get a slightly detuned pair of oscillators. Finally, the result is sent through
    // a lowpass filter with a cutoff modulating between [600Hz, 1200Hz].
    let train = el.train(5.0);
    let env = el.adsr(0.01, 0.25, 0.0, 0.1, train);
    let modulate = (x, rate, amount) => el.add(x, el.mul(amount, el.cycle(rate)));
    let dry = el.mul(0.2, env, el.lowpass(modulate(900, 0.1, 300), 1.0, el.add(
      el.blepsaw(el.seq({ seq, hold: true }, train)),
      el.blepsaw(el.mul(1.01, el.seq({ seq, hold: true }, train))),
    )));

    // Our wet signal is simply the result of running the dry through our reverb above.
    let wet = reverb("dattorro", dry);

    // And some wet/dry gains from the user interface
    let dg = el.const({ key: 'DryGain', value: dryGain });
    let wg = el.const({ key: 'WetGain', value: wetGain });

    // Than tanh on the output signal here is unnecessary, but I have it here to artificially
    // clip the output signal into the range [-1, 1] so that in case you accidentally set the decay
    // coefficients above into an unstable feedback loop, your speakers will be okay.
    core.render(
      el.tanh(el.add(el.mul(dg, dry), el.mul(wg, wet))),
      el.tanh(el.add(el.mul(dg, dry), el.mul(wg, wet))),
    );
  });
}