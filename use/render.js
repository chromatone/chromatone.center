/**
 * @module Render
 */

import { Midi } from "@tonejs/midi";
import { tempo } from "./tempo";
let notes = ["C", "E", "G", "B", "D", "F", "A", "C#", "D#", "F#", "G#", "A#"];

export function renderMidi(tracks) {
  import("midi-writer-js").then(MidiWriter => {
    let render = [];
    tracks.forEach((track, t) => {
      let _a;
      let division = 512 / ((_a = track === null || track === void 0 ? void 0 : track.meter) === null || _a === void 0 ? void 0 : _a.under);
      let midiTrack = new MidiWriter.Track();
      midiTrack.setTempo(tempo.bpm, 0);
      midiTrack.addInstrumentName("116");
      midiTrack.addTrackName("Chromatone beat " + t);
      midiTrack.setTimeSignature(4, 4, 24, 8);
      track.steps.forEach((step, s) => {
        step.forEach((code) => {
          if (track.mutes[s] || track.mutes[code])
            return;
          let [beat, sub] = code.split("-").map(Number);
          let subdivision = division / step.length;
          let subStep = 0;
          if (step.length > 1) {
            subStep = sub * subdivision;
          }
          midiTrack.addEvent(new MidiWriter.NoteEvent({
            pitch: (track.accents[s]
              ? notes[t * 2] + "2"
              : notes[t * 2 + 1] + "2"),
            duration: `T${subdivision}`,
            startTick: division * beat + subStep,
            velocity: track.accents[s] || track.accents[code] ? 100 : 64,
          }));
        });
      });
      // midiTrack.addEvent(
      //   new NoteEvent({
      //     pitch: 0,
      //     duration: `T1`,
      //     startTick: division * (track.steps.length - 1),
      //     velocity: 1,
      //   })
      // )
      render[t] = midiTrack;
    });
    const write = new MidiWriter.Writer(render);
    let midiData = new Midi(write.buildFile());
    midiData.tracks.forEach((track, t) => {
      midiData.tracks[t].instrument.number = 119;
    });
    createAndDownloadBlobFile(midiData.toArray(), "Chromatone-beat");
  })

}
export function createAndDownloadBlobFile(body, filename, extension = "mid") {
  const blob = new Blob([body]);
  const fileName = `${filename}.${extension}`;
  if (navigator.msSaveBlob) {
    navigator.msSaveBlob(blob, fileName);
  }
  else {
    const link = document.createElement("a");
    // Browsers that support HTML5 download attribute
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", fileName);
      link.setAttribute("target", "_blank");
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }
}
