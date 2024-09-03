import { el } from '@elemaudio/core';

function schroeder(name, size, g, xn) {
  let fb = el.add(xn, el.mul(g, el.tapIn({ name })));
  return el.add(el.mul(-g, fb), el.tapOut({ name, size }, fb));
}

function earlyReflections(name, x) {
  const delays = [0.0043, 0.0215, 0.0225, 0.0268, 0.0270, 0.0298, 0.0458, 0.0485];
  const gains = [0.841, 0.504, 0.491, 0.379, 0.380, 0.346, 0.289, 0.272];

  return delays.reduce((acc, delay, i) => {
    const delayInSamples = el.mul(el.sr(), delay);
    const delayedSignal = el.delay({ size: 44100 }, delayInSamples, 0, x);
    return el.add(acc, el.mul(gains[i], delayedSignal));
  }, el.mul(0, x));
}

function diffuse(name, x) {
  let steps = [
    { size: 241, decay: 0.72 },
    { size: 307, decay: 0.70 },
    { size: 379, decay: 0.68 },
    { size: 457, decay: 0.66 },
  ];

  return steps.reduce(function (acc, next, i) {
    return schroeder(`${name}:diff:${i}`, next.size, next.decay, acc);
  }, x);
}

function tank(name, decay, dampening, x) {
  let step1 = schroeder(`${name}:s1`, 1072, 0.7, x);
  let step2 = el.delay({ size: 6453 }, 6453, 0, step1);
  let step3 = el.lowpass(dampening, 0.5, step2);
  let step4 = el.mul(decay, step3);

  return schroeder(`${name}:s5`, 2100, 0.6, step4);
}

function lfo(rate) {
  return el.mul(0.5, el.add(1, el.cycle(rate)));
}

export function hallReverb(name, x, decay = 0.95, predelay = 0.06, dampening = 2000, mod = 1) {
  let preDelayInSamples = el.mul(el.sr(), predelay);
  let preDelayed = el.delay({ size: 44100 }, preDelayInSamples, 0, x);

  let er = earlyReflections(name, preDelayed);
  let diff = diffuse(name, el.add(preDelayed, el.mul(0.2, er)));
  let dec = el.min(0.99, decay)

  let modulation = el.mul(3, lfo(mod));

  let leftIn = el.add(diff, el.mul(dec, el.tapIn({ name: `${name}:reverb:right` })));
  let rightIn = el.add(diff, el.mul(dec, el.tapIn({ name: `${name}:reverb:left` })));

  let leftOut = el.tapOut({ name: `${name}:reverb:left`, size: 5720 },
    tank(`${name}:tank:left`, dec, dampening, leftIn));
  let rightOut = el.tapOut({ name: `${name}:reverb:right`, size: 5163 },
    tank(`${name}:tank:right`, dec, dampening, rightIn));

  let wetL = el.delay({ size: 100 }, modulation, 0, leftOut);
  let wetR = el.delay({ size: 100 }, modulation, 0, rightOut);

  // Enhance low frequencies for a fuller sound
  let enhancedL = el.add(wetL, el.mul(0.2, el.lowpass(200, 0.7, wetL)));
  let enhancedR = el.add(wetR, el.mul(0.2, el.lowpass(200, 0.7, wetR)));

  return [
    enhancedL,
    enhancedR
  ];
}