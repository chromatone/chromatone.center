const fs = require('fs');
const path = require('path');
const { Midi } = require('@tonejs/midi');

const midiDir = './midi-rudiments/';
const jsonDir = './';

const collection = {}

fs.readdirSync(midiDir).forEach(file => {
  const midiData = fs.readFileSync(path.resolve(midiDir, file));
  const midi = new Midi(midiData);
  const fileData = parseFilename(file)
  collection[fileData.num] = collection[fileData.num] || {}
  collection[fileData.num] = { [fileData.title]: midi }
});

const jsonFile = path.resolve(jsonDir, '40-rudiments.json');
fs.writeFileSync(jsonFile, JSON.stringify(collection));


function parseFilename(filename) {

  return (([, num, title]) => ({ num: parseInt(num, 10), title }))(filename.match(/{(\d+)}(.*)\.mid$/));
}