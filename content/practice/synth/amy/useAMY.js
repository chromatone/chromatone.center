import { onKeyDown, onKeyUp, useStorage, onKeyStroke } from "@vueuse/core";
import { useClamp } from "@vueuse/math";
import { context } from "tone";
import { onMounted, reactive, computed, watch, ref } from "vue";
import AMYCodes from "#/db/amy-codes.yaml";
import { midi } from "#/use/midi";

var amy_started = false;
var amy_audio_buffer = null;
var amy_play_message = null;
var amy_start_web = null;
var callback = null;

const started = ref(false);
const codes = AMYCodes;

const message = computed(() => {
  const arr = [];
  for (let p in knobs) {
    arr.push(`${p}${knobs[p]}`);
  }
  arr.push("A0,0.2,150,1,250,0T59");
  return arr.join("");
});

const waveforms = [
  "SINE",
  "PULSE",
  "SAW_DOWN",
  "SAW_UP",
  "TRI",
  "NOISE",
  "KS",
  "PCM",
  "ALGO",
  "PARTIAL",
  "PARTIALS",
];
const note = useClamp(60, 10, 127);
const history = reactive([])

const knobs = reactive({
  p: useClamp(useStorage("amy-patch", 248), 0, 1024),
  w: useClamp(useStorage("amy-waveform", 7), 0, 11),
  V: useClamp(useStorage("amy-volume", 1), 0, 10),
  d: useClamp(useStorage("amy-duty", 0.5), 0.001, 0.999),
  o: useClamp(useStorage("amy-algo", 1), 1, 32),
  b: useClamp(useStorage("amy-feedback", 0), 0, 1),
});

export function useAMY() {
  watch(
    () => midi.note,
    (n) => {
      play(n.number, n.velocity / 127);
    }
  );

  watch(
    message,
    (m) => {
      amy_play_message(m);
      history.unshift(m);
    }
  );

  onKeyDown("a", () => {
    play(note.value, 1);
  });
  onKeyUp("a", () => {
    play(note.value, 0);
  });

  onKeyStroke("ArrowLeft", () => {
    knobs.patch--;
  });
  onKeyStroke("ArrowRight", () => {
    knobs.patch++;
  });

  onKeyStroke("ArrowUp", (e) => {
    e.preventDefault();
    note.value++;
  });
  onKeyStroke("ArrowDown", (e) => {
    e.preventDefault();
    note.value--;
  });

  onMounted(() => {
    import("./amyJS.js").then((amy) => {
      const { Module } = amy;
      Module.onRuntimeInitialized = function () {
        amy_audio_buffer = Module.cwrap("web_audio_buffer", "number", [
          "number",
          "number",
        ]);
        amy_play_message = Module.cwrap("amy_play_message", null, ["string"]);
        amy_start_web = Module.cwrap("amy_start_web", null, ["number"]);
      };

      var dataHeap = null;
      var dataPtr = null;
      var data = new Float32Array();

      callback = function audioCallback(l) {
        if (dataHeap == null || dataHeap.length == 0) {
          data = new Float32Array(l.length);
          var nDataBytes = data.length * data.BYTES_PER_ELEMENT;
          dataPtr = Module._malloc(nDataBytes);
          dataHeap = new Uint8Array(Module.HEAPU8.buffer, dataPtr, nDataBytes);
          dataHeap.set(new Uint8Array(data.buffer));
        }

        amy_audio_buffer(dataHeap.byteOffset, l.length);
        var result = new Float32Array(
          dataHeap.buffer,
          dataHeap.byteOffset,
          data.length
        );

        for (let i = 0; i < l.length; i++) {
          l[i] = result[i];
        }
      };
    });
  });

  var audioRunning = false;
  var scriptNode = null;
  var source = null;
  var audioCtx = null;

  function setupAudio(fn) {
    var AudioContext =
      window.AudioContext || window.webkitAudioContext || false;

    if (!AudioContext) {
      console.error("No Audio");
      return;
    }
    audioCtx = new AudioContext({
      sampleRate: 48000,
    });
    source = audioCtx.createBufferSource();
    scriptNode = audioCtx.createScriptProcessor(256, 0, 1);
    scriptNode.onaudioprocess = function (audioProcessingEvent) {
      fn(audioProcessingEvent.outputBuffer.getChannelData(0));
    };
  }

  function startAudio() {
    if (audioRunning) return;
    amy_start_web?.();
    setupAudio(callback);
    scriptNode.connect(audioCtx.destination);
    source.start();
    audioRunning = true;
    // setTimeout(() => {
    //   console.log('started')
    //   amy_play_message("v54l1w8n70p30")
    // }, 50)
    amy_started = true;
  }

  function stopAudio() {
    audioRunning = false;
    amy_started = false;
    audioCtx.suspend().then(function () {
      console.log("stopped");
    });
  }

  function play(note, velocity = 0) {
    if (!amy_started) startAudio();
    let osc = `v${note * 20}`;
    if (velocity > 0) {
      let setup = osc + message.value;
      amy_play_message(setup);
      history.unshift(setup);
    }

    let msg = osc + `n${note}l${velocity.toFixed(2)}`;
    history.unshift(msg);
    amy_play_message(msg);
  };

  function reset(n = 100000) {
    let msg = `S${n}`;
    history.unshift(msg);
    amy_play_message(msg);
  };

  return {
    started,
    codes,
    message,
    waveforms,
    history,
    note,
    knobs
  };
}
