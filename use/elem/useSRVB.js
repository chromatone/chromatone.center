// import invariant from 'invariant';
import { el } from '@elemaudio/core';
// import params from './srvbParams.json'

// A size 8 Hadamard matrix constructed using Numpy and Scipy.
//
// The Hadamard matrix satisfies the property H*H^T = nI, where n is the size
// of the matrix, I the identity, and H^T the transpose of H. Therefore, we have
// orthogonality and stability in the feedback path if we scale according to (1 / n)
// along the diagonal, which we do internally by multiplying each matrix element
// by Math.sqrt(1 / n), which yields the identity as above.
//
// @see https://docs.scipy.org/doc/scipy-0.14.0/reference/generated/scipy.linalg.hadamard.html
// @see https://nhigham.com/2020/04/10/what-is-a-hadamard-matrix/
const H8 = [[1, 1, 1, 1, 1, 1, 1, 1],
[1, -1, 1, -1, 1, -1, 1, -1],
[1, 1, -1, -1, 1, 1, -1, -1],
[1, -1, -1, 1, 1, -1, -1, 1],
[1, 1, 1, 1, -1, -1, -1, -1],
[1, -1, 1, -1, -1, 1, -1, 1],
[1, 1, -1, -1, -1, -1, 1, 1],
[1, -1, -1, 1, -1, 1, 1, -1]];

// A diffusion step expecting exactly 8 input channels with
// a maximum diffusion time of 500ms
function diffuse(size, ...ins) {
  const len = ins.length;
  const scale = Math.sqrt(1 / len);

  // invariant(len === 8, "Invalid diffusion step!");
  // invariant(typeof size === 'number', "Diffusion step size must be a number");

  const dels = ins.map(function (input, i) {
    const lineSize = size * ((i + 1) / len);
    return el.sdelay({ size: lineSize }, input);
  });

  return H8.map(function (row, i) {
    return el.add(...row.map(function (col, j) {
      return el.mul(col * scale, dels[j]);
    }));
  });
}

// An eight channel feedback delay network with a one-pole lowpass filter in
// the feedback loop for damping the high frequencies faster than the low.
//
// @param {string} name for the tap structures
// @param {el.const} size in the range [0, 1]
// @param {el.const} decay in the range [0, 1]
// @param {el.const} modDepth in the range [0, 1]
// @param {...core.Node} ...ins eight input channels
function dampFDN(name, sampleRate, size, decay, modDepth, ...ins) {
  const len = ins.length;
  const scale = Math.sqrt(1 / len);
  const md = el.mul(modDepth, 0.02);

  if (len !== 8)
    throw new Error("Invalid FDN step!");

  // The unity-gain one pole lowpass here is tuned to taste along
  // the range [0.001, 0.5]. Towards the top of the range, we get into the region
  // of killing the decay time too quickly. Towards the bottom, not much damping.
  const dels = ins.map(function (input, i) {
    return el.add(
      input,
      el.mul(
        decay,
        el.smooth(
          0.105,
          el.tapIn({ name: `${name}:fdn${i}` }),
        ),
      ),
    );
  });

  let mix = H8.map(function (row, i) {
    return el.add(...row.map(function (col, j) {
      return el.mul(col * scale, dels[j]);
    }));
  });

  return mix.map(function (mm, i) {
    const modulate = (x, rate, amt) => el.add(x, el.mul(amt, el.cycle(rate)));
    const ms2samps = (ms) => sampleRate * (ms / 1000.0);

    // Each delay line here will be ((i + 1) * 17)ms long, multiplied by [1, 4]
    // depending on the size parameter. So at size = 0, delay lines are 17, 34, 51, ...,
    // and at size = 1 we have 68, 136, ..., all in ms here.
    const delaySize = el.mul(el.add(1.00, el.mul(3, size)), ms2samps((i + 1) * 17));

    // Then we modulate the read position for each tap to add some chorus in the
    // delay network.
    const readPos = modulate(delaySize, el.add(0.1, el.mul(i, md)), ms2samps(2.5));

    return el.tapOut(
      { name: `${name}:fdn${i}` },
      el.delay(
        { size: ms2samps(750) },
        readPos,
        0,
        mm
      ),
    );
  });
}

// Our main stereo reverb.
//
// Upmixes the stereo input into an 8-channel diffusion network and
// feedback delay network. Must supply a `key` prop to uniquely identify the
// feedback taps in here.
//
// @param {object} props
// @param {number} props.size in [0, 1]
// @param {number} props.decay in [0, 1]
// @param {number} props.mod in [0, 1]
// @param {number} props.mix in [0, 1]
// @param {core.Node} xl input
// @param {core.Node} xr input
export function srvb(props, xl, xr) {
  // invariant(typeof props === 'object', 'Unexpected props object');

  const key = props.key;
  const sampleRate = props.sampleRate;
  const size = el.sm(props.size);
  const decay = el.sm(props.decay);
  const modDepth = el.sm(props.mod);
  const mix = el.sm(props.mix);

  // Upmix to eight channels
  const mid = el.mul(0.5, el.add(xl, xr));
  const side = el.mul(0.5, el.sub(xl, xr));
  const four = [xl, xr, mid, side];
  const eight = [...four, ...four.map(x => el.mul(-1, x))];

  // Diffusion
  const ms2samps = (ms) => sampleRate * (ms / 1000.0);

  const d1 = diffuse(ms2samps(43), ...eight);
  const d2 = diffuse(ms2samps(97), ...d1);
  const d3 = diffuse(ms2samps(117), ...d2);

  // Reverb network
  const d4 = dampFDN(`${key}:d4`, sampleRate, size, 0.004, modDepth, ...d3)
  const r0 = dampFDN(`${key}:r0`, sampleRate, size, decay, modDepth, ...d4);

  // Downmix
  //
  // It's important here to interleave the output channels because the way that
  // the multi-channel delay lines are written above tends to correlate the delay
  // length with the current index in the 8-channel array. That means the smaller
  // the index, the shorter the delay line. The mix matrix will mostly address this,
  // but if you sum index 0-3 into the left and 4-7 into the right you can definitely
  // hear the energy in the left channel build before the energy in the right.
  const yl = el.mul(0.25, el.add(r0[0], r0[2], r0[4], r0[6]));
  const yr = el.mul(0.25, el.add(r0[1], r0[3], r0[5], r0[7]));

  // Wet dry mixing
  return [
    el.select(mix, yl, xl),
    el.select(mix, yr, xr),
  ];
}