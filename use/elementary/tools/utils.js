/**
 * Calculate the length, in ms, of one given subdivision at the specificed BPM
 * @param {number} tempo tempo in Beats Per Minute
 * @param {number} subDiv subdivision for which the length is sought, defaults to 16:th note
 * @returns the length of one subdivision in ms
 */
export const tempoToMs = (tempo, subDiv = 16) => {
  const beatLen = 1 / (tempo / 60);
  return ((beatLen * 4) / subDiv) * 1000;
};

/**
 * Generates a scale of the desired length from a scale of note names
 *
 * @param scale an array of note names, e.g. `["a3", "c#4"]`
 * @param numNotes the length of the resulting array
 * @param octave the starting octave
 * @param octaveBreak specifies an offset into the scale array where it should increase the octave.
 *
 * @example
 * // returns [440, 660, 880, 1760]
 * makeScale(["a, e"], 4, 4)
 * @example
 * // returns [55, 65.4, 82.4, 110, 130.8, 164.8, 220]
 * makeScale("a,c,e".split(","), 7, 3, 1)
 * @returns an array of frequency values
 */

export const bpmToHz = (tempo, subDiv = 16) => {
  return (tempo / (60 * 4)) * subDiv;
};

export const makeScale = (
  scale,
  numNotes = scale.length,
  octave = 4,
  octaveBreak = 0,
) => {
  const noteNames = range(numNotes).map(
    (i) =>
      `${scale[i % scale.length]}${Math.floor((i - octaveBreak) / scale.length) + octave
      }`,
  );
  return noteNames.flat().map(noteToMidi).map(midiToFrequency);
};

export const noteToMidi = (n) => {
  let notes = ["c", "c#", "d", "d#", "e", "f", "f#", "g", "g#", "a", "a#", "b"];
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let [_, name, octave] = n.match(
    /(?<name>\w?#?)(?<octave>\d)/,
  );

  if (notes.indexOf(name) < 0) return -1;

  return 12 * Number(octave) + notes.indexOf(name);
};

export const midiToFrequency = (m) => {
  if (m < 0) {
    return 0;
  }
  return 440 * Math.pow(2, (m - 69) / 12);
};

export const changePitch = (freq, delta) => {
  return freq * Math.pow(2, delta / 12);
};

export const freqDeltaFromSeq = (triggerVal, freq) => {
  if (triggerVal < 0) {
    return changePitch(freq, triggerVal);
  }

  if (triggerVal > 1) {
    return changePitch(freq, triggerVal - 1);
  }
  return freq;
};

export const initArray = (...dimensions) => {
  const dim = dimensions.splice(0, 1)[0];
  if (dimensions.length) {
    return Array(dim)
      .fill(0)
      .map(() => initArray(...dimensions));
  }
  return Array(dim).fill(0);
};

export const range = (n, start = 0) => [
  ...Array.from(Array(n).keys()).map((k) => k + start),
];

export const clamp = (n, min = 0, max = 1) =>
  Math.max(Math.min(n, max), min);

export const deepCopy = (obj) => JSON.parse(JSON.stringify(obj));

export const shiftArray = (array, shift) => {
  if (shift > 0) {
    const firstElem = array.shift();
    array = [...array, firstElem];
  } else {
    const lastElem = array.pop();
    array = [lastElem, ...array];
  }
  return deepCopy(array);
};

export const bitsToNumber = (bits) => {
  return bits.reduce((prev, cur, i) => prev | (cur << i));
};

export const numberToBits = (number, length = 16) => {
  return range(length).map((i) => {
    const bit = 1 << i;
    return (number & bit) === bit ? 1 : 0;
  });
};

export const countNodes = (node) => {
  if (!node || !node._children) {
    return 0;
  }
  return node._children.reduce(
    (acc, n) => acc + countNodes(n) + 1,
    0,
  );
};
