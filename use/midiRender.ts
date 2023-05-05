/**
 * @module MidiRender
 */

import { Writer, Track, NoteEvent } from "midi-writer-js";
import { Midi } from "@tonejs/midi";
import { tempo } from "./tempo";
let notes = ["C", "E", "G", "B", "D", "F", "A", "C#", "D#", "F#", "G#", "A#"];

export function renderMidi(tracks) {
  let render = [];
  console.log(tracks)
  tracks.forEach((track, t) => {
    let division = 512 / track?.meter?.under;
    let midiTrack = new Track();
    midiTrack.setTempo(tempo.bpm as number, 0);
    midiTrack.addInstrumentName("116");
    midiTrack.addTrackName("Chromatone beat " + t);
    midiTrack.setTimeSignature(4, 4);
    track.steps.forEach((step, s) => {
      step.forEach((code) => {
        if (track.mutes[s] || track.mutes[code]) return;
        let [beat, sub] = code.split("-").map(Number);
        let subdivision = division / step.length;
        let subStep = 0;
        if (step.length > 1) {
          subStep = sub * subdivision;
        }
        midiTrack.addEvent(
          new NoteEvent({
            //@ts-expect-error
            pitch: (track.accents[s]
              ? notes[t * 2] + "2"
              : notes[t * 2 + 1] + "2"),
            duration: `T${subdivision}`,
            startTick: division * beat + subStep,
            velocity: track.accents[s] || track.accents[code] ? 100 : 64,
          })
        );
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

  var write = new Writer(render);
  let midiData = new Midi(write.buildFile());
  midiData.tracks.forEach((track, t) => {
    midiData.tracks[t].instrument.number = 119;
  });

  createAndDownloadBlobFile(midiData.toArray(), "Chromatone-beat");
}

export function createAndDownloadBlobFile(body, filename, extension = "mid") {
  const blob = new Blob([body]);
  const fileName = `${filename}.${extension}`;
  //@ts-expect-error MS IE
  if (navigator.msSaveBlob) {
    //@ts-expect-error IE 10+
    navigator.msSaveBlob(blob, fileName);
  } else {
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
