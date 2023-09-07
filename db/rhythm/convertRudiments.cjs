const fs = require('fs');
const path = require('path');
const { Midi } = require('@tonejs/midi');

const midiDir = './midi-rudiments/';
const jsonDir = './';

const collection = {}

fs.readdirSync(midiDir).forEach(file => {
  if (file.split('.mid').length < 2) return

  const midiData = fs.readFileSync(path.resolve(midiDir, file));
  const midi = new Midi(midiData);
  const fileData = parseFilename(file)

  collection[fileData.num] = {
    ...fileData,
    signature: midi.header.timeSignatures[0].timeSignature.join('/'),
    ppq: midi.header.ppq,
    totalTicks: midi.tracks[0].notes[midi.tracks[0].notes.length - 1].ticks + midi.tracks[0].notes[midi.tracks[0].notes.length - 1].durationTicks,
    totalNotes: midi.tracks[0].notes.length,
    notes: midi.tracks[0].notes,
  }
});

const jsonFile = path.resolve(jsonDir, '40-rudiments.json');
fs.writeFileSync(jsonFile, JSON.stringify(collection));


function parseFilename(filename) {
  return (([, num, title]) => ({ num: parseInt(num, 10), title }))(filename.match(/{(\d+)}(.*)\.mid$/));
}