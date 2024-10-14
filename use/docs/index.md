## Modules

<dl>
<dt><a href="#module_Audio">Audio</a></dt>
<dd><p>Main audio bus controller for managing audio channels, effects, and settings.</p>
</dd>
<dt><a href="#module_Calculations">Calculations</a></dt>
<dd><p>All the basic math for note-frequency convertion</p>
</dd>
<dt><a href="#module_Chroma">Chroma</a></dt>
<dd><p>Chroma</p>
</dd>
<dt><a href="#module_Colors">Colors</a></dt>
<dd></dd>
<dt><a href="#module_Global">Global</a></dt>
<dd><p>Global state</p>
</dd>
<dt><a href="#module_Keyboard">Keyboard</a></dt>
<dd></dd>
<dt><a href="#module_Loop">Loop</a></dt>
<dd></dd>
<dt><a href="#module_Microphone">Microphone</a></dt>
<dd></dd>
<dt><a href="#module_MIDI">MIDI</a></dt>
<dd></dd>
<dt><a href="#module_MidiRender">MidiRender</a></dt>
<dd></dd>
<dt><a href="#module_Mouse">Mouse</a></dt>
<dd></dd>
<dt><a href="#module_AudioRecorder">AudioRecorder</a></dt>
<dd></dd>
<dt><a href="#Sequence
The beat loopsmodule_">Sequence
The beat loops</a></dt>
<dd></dd>
<dt><a href="#module_Tempo">Tempo</a></dt>
<dd></dd>
<dt><a href="#module_MusicTheory">MusicTheory</a></dt>
<dd></dd>
<dt><a href="#module_Tuner">Tuner</a></dt>
<dd><p>Audio analysis module using Aubio.js and Meyda for pitch detection and audio feature extraction</p>
</dd>
</dl>

<a name="module_Audio"></a>

## Audio
Main audio bus controller for managing audio channels, effects, and settings.


* [Audio](#module_Audio)
    * _static_
        * [.master](#module_Audio.master) : <code>MasterChannel</code>
        * [.channels](#module_Audio.channels) : <code>Object.&lt;string, AudioChannel&gt;</code>
        * [.useAudio()](#module_Audio.useAudio) ⇒ <code>Object</code>
        * [.createAudioChannel(title, options)](#module_Audio.createAudioChannel) ⇒ <code>AudioChannel</code>
        * [.initGetUserMedia()](#module_Audio.initGetUserMedia)
    * _inner_
        * [~audio](#module_Audio..audio) : <code>AudioState</code>
        * [~AudioState](#module_Audio..AudioState) : <code>Object</code>
        * [~MasterChannel](#module_Audio..MasterChannel) : <code>Object</code>
        * [~AudioChannel](#module_Audio..AudioChannel) : <code>Object</code>

<a name="module_Audio.master"></a>

### Audio.master : <code>MasterChannel</code>
**Kind**: static constant of [<code>Audio</code>](#module_Audio)  
<a name="module_Audio.channels"></a>

### Audio.channels : <code>Object.&lt;string, AudioChannel&gt;</code>
**Kind**: static constant of [<code>Audio</code>](#module_Audio)  
<a name="module_Audio.useAudio"></a>

### Audio.useAudio() ⇒ <code>Object</code>
Initialize and manage the main audio system.

**Kind**: static method of [<code>Audio</code>](#module_Audio)  
<a name="module_Audio.createAudioChannel"></a>

### Audio.createAudioChannel(title, options) ⇒ <code>AudioChannel</code>
Create a new audio channel with a limiter and volume control.

**Kind**: static method of [<code>Audio</code>](#module_Audio)  
**Returns**: <code>AudioChannel</code> - The created channel object.  

| Param | Type | Description |
| --- | --- | --- |
| title | <code>string</code> | The channel title. Defaults to a random number. |
| options | <code>Object</code> | Options for the Limiter constructor. |

<a name="module_Audio.initGetUserMedia"></a>

### Audio.initGetUserMedia()
Initialize getUserMedia for cross-browser compatibility.

**Kind**: static method of [<code>Audio</code>](#module_Audio)  
**Throws**:

- <code>Error</code> If AudioContext or getUserMedia is not supported.

<a name="module_Audio..audio"></a>

### Audio~audio : <code>AudioState</code>
**Kind**: inner constant of [<code>Audio</code>](#module_Audio)  
<a name="module_Audio..AudioState"></a>

### Audio~AudioState : <code>Object</code>
**Kind**: inner typedef of [<code>Audio</code>](#module_Audio)  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| initiated | <code>boolean</code> | Indicates if the audio system has been initiated. |
| mute | <code>boolean</code> | Indicates if the audio is muted. |
| volume | <code>number</code> | The main volume level (0 to 2). |
| meter | <code>number</code> | The current meter reading. |

<a name="module_Audio..MasterChannel"></a>

### Audio~MasterChannel : <code>Object</code>
**Kind**: inner typedef of [<code>Audio</code>](#module_Audio)  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| context | <code>AudioContext</code> | The main audio context. |
| destination | <code>Object</code> | The main audio destination. |
| stream | <code>MediaStreamAudioDestinationNode</code> | The media stream destination. |
| meter | <code>Object</code> | The audio meter. |
| limiter | <code>Object</code> | The main limiter. |
| reverb | <code>Object</code> | The main reverb effect. |

<a name="module_Audio..AudioChannel"></a>

### Audio~AudioChannel : <code>Object</code>
**Kind**: inner typedef of [<code>Audio</code>](#module_Audio)  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| channel | <code>Object</code> | The channel's limiter. |
| volume | <code>Object</code> | The channel's volume control. |

<a name="module_Calculations"></a>

## Calculations
All the basic math for note-frequency convertion


* [Calculations](#module_Calculations)
    * [.pitchNoteOctave()](#module_Calculations.pitchNoteOctave)
    * [.pitchFreq()](#module_Calculations.pitchFreq)
    * [.pitchColor()](#module_Calculations.pitchColor)
    * [.freqColor()](#module_Calculations.freqColor)
    * [.freqPitch()](#module_Calculations.freqPitch)
    * [.isInChroma()](#module_Calculations.isInChroma)
    * [.getCircleCoord()](#module_Calculations.getCircleCoord)
    * [.rotateArray()](#module_Calculations.rotateArray)
    * [.getCents()](#module_Calculations.getCents)
    * [.getStandardFrequency()](#module_Calculations.getStandardFrequency)

<a name="module_Calculations.pitchNoteOctave"></a>

### Calculations.pitchNoteOctave()
Convert an unbound pitch to 0-11 pitch + octave

**Kind**: static method of [<code>Calculations</code>](#module_Calculations)  
<a name="module_Calculations.pitchFreq"></a>

### Calculations.pitchFreq()
Determine a frequency in Hz out of a pitch with octave and optional tuning info

**Kind**: static method of [<code>Calculations</code>](#module_Calculations)  
<a name="module_Calculations.pitchColor"></a>

### Calculations.pitchColor()
Get a color for any given pitch and octave (velocity and alpha are also configurable)

**Kind**: static method of [<code>Calculations</code>](#module_Calculations)  
<a name="module_Calculations.freqColor"></a>

### Calculations.freqColor()
Get a color for a certain pitch frequency in Hz

**Kind**: static method of [<code>Calculations</code>](#module_Calculations)  
<a name="module_Calculations.freqPitch"></a>

### Calculations.freqPitch()
Get a pitch from a frequency

**Kind**: static method of [<code>Calculations</code>](#module_Calculations)  
<a name="module_Calculations.isInChroma"></a>

### Calculations.isInChroma()
Check if a note in included in a chroma string

**Kind**: static method of [<code>Calculations</code>](#module_Calculations)  
<a name="module_Calculations.getCircleCoord"></a>

### Calculations.getCircleCoord()
Radial coordinates calculation

**Kind**: static method of [<code>Calculations</code>](#module_Calculations)  
<a name="module_Calculations.rotateArray"></a>

### Calculations.rotateArray()
Rotate and array by a number of steps

**Kind**: static method of [<code>Calculations</code>](#module_Calculations)  
<a name="module_Calculations.getCents"></a>

### Calculations.getCents()
Get cents difference between a certain pitch and an arbitrary frequency

**Kind**: static method of [<code>Calculations</code>](#module_Calculations)  
<a name="module_Calculations.getStandardFrequency"></a>

### Calculations.getStandardFrequency()
Get a frequency for any given pitch

**Kind**: static method of [<code>Calculations</code>](#module_Calculations)  
<a name="module_Chroma"></a>

## Chroma
Chroma

<a name="module_Colors"></a>

## Colors
<a name="module_Global"></a>

## Global
Global state

<a name="module_Keyboard"></a>

## Keyboard
<a name="module_Loop"></a>

## Loop
<a name="module_Microphone"></a>

## Microphone
<a name="module_MIDI"></a>

## MIDI
<a name="module_MidiRender"></a>

## MidiRender
<a name="module_Mouse"></a>

## Mouse
<a name="module_AudioRecorder"></a>

## AudioRecorder
<a name="Sequence
The beat loopsmodule_"></a>

## Sequence
The beat loops
<a name="module_Tempo"></a>

## Tempo
<a name="module_MusicTheory"></a>

## MusicTheory
<a name="module_Tuner"></a>

## Tuner
Audio analysis module using Aubio.js and Meyda for pitch detection and audio feature extraction


* [Tuner](#module_Tuner)
    * _static_
        * [.tuner](#module_Tuner.tuner) : <code>TunerState</code>
        * [.useTuner()](#module_Tuner.useTuner) ⇒ <code>Object</code>
    * _inner_
        * [~BUFFER_SIZE](#module_Tuner..BUFFER_SIZE) : <code>number</code>
        * [~TEMPO_BUFFER_SIZE](#module_Tuner..TEMPO_BUFFER_SIZE) : <code>number</code>
        * [~MIDDLE_A](#module_Tuner..MIDDLE_A) : <code>number</code>
        * [~SEMITONE](#module_Tuner..SEMITONE) : <code>number</code>
        * [~chain](#module_Tuner..chain) : <code>Object</code>
        * [~handleBeatDetection()](#module_Tuner..handleBeatDetection)
        * [~init()](#module_Tuner..init) ⇒ <code>Promise.&lt;void&gt;</code>
        * [~setupAudioChain(audioContext)](#module_Tuner..setupAudioChain)
        * [~setupMeydaAnalyzer()](#module_Tuner..setupMeydaAnalyzer) ⇒ <code>Promise.&lt;void&gt;</code>
        * [~updateTunerFeatures(features)](#module_Tuner..updateTunerFeatures)
        * [~setupAubio()](#module_Tuner..setupAubio) ⇒ <code>Promise.&lt;void&gt;</code>
        * [~start()](#module_Tuner..start)
        * [~setupAudioStream(stream)](#module_Tuner..setupAudioStream)
        * [~handleBeatProcess(e)](#module_Tuner..handleBeatProcess)
        * [~handleAudioProcess(event)](#module_Tuner..handleAudioProcess)
        * [~updateTunerNote(frequency)](#module_Tuner..updateTunerNote)
        * [~getNote(frequency)](#module_Tuner..getNote) ⇒ <code>number</code>
        * [~getStandardFrequency(note)](#module_Tuner..getStandardFrequency) ⇒ <code>number</code>
        * [~getCents(frequency, note)](#module_Tuner..getCents) ⇒ <code>number</code>
        * [~freqColor(frequency)](#module_Tuner..freqColor) ⇒ <code>string</code>
        * [~getRawNote(frequency)](#module_Tuner..getRawNote) ⇒ <code>number</code>
        * [~TunerNote](#module_Tuner..TunerNote) : <code>Object</code>
        * [~TunerState](#module_Tuner..TunerState) : <code>Object</code>

<a name="module_Tuner.tuner"></a>

### Tuner.tuner : <code>TunerState</code>
**Kind**: static constant of [<code>Tuner</code>](#module_Tuner)  
<a name="module_Tuner.useTuner"></a>

### Tuner.useTuner() ⇒ <code>Object</code>
Tuner composable function

**Kind**: static method of [<code>Tuner</code>](#module_Tuner)  
**Returns**: <code>Object</code> - An object containing init function, tuner state, and audio chain  
<a name="module_Tuner..BUFFER_SIZE"></a>

### Tuner~BUFFER\_SIZE : <code>number</code>
**Kind**: inner constant of [<code>Tuner</code>](#module_Tuner)  
<a name="module_Tuner..TEMPO_BUFFER_SIZE"></a>

### Tuner~TEMPO\_BUFFER\_SIZE : <code>number</code>
**Kind**: inner constant of [<code>Tuner</code>](#module_Tuner)  
<a name="module_Tuner..MIDDLE_A"></a>

### Tuner~MIDDLE\_A : <code>number</code>
**Kind**: inner constant of [<code>Tuner</code>](#module_Tuner)  
<a name="module_Tuner..SEMITONE"></a>

### Tuner~SEMITONE : <code>number</code>
**Kind**: inner constant of [<code>Tuner</code>](#module_Tuner)  
<a name="module_Tuner..chain"></a>

### Tuner~chain : <code>Object</code>
**Kind**: inner constant of [<code>Tuner</code>](#module_Tuner)  
<a name="module_Tuner..handleBeatDetection"></a>

### Tuner~handleBeatDetection()
Handles beat detection

**Kind**: inner method of [<code>Tuner</code>](#module_Tuner)  
<a name="module_Tuner..init"></a>

### Tuner~init() ⇒ <code>Promise.&lt;void&gt;</code>
Initializes the tuner

**Kind**: inner method of [<code>Tuner</code>](#module_Tuner)  
<a name="module_Tuner..setupAudioChain"></a>

### Tuner~setupAudioChain(audioContext)
Sets up the audio processing chain

**Kind**: inner method of [<code>Tuner</code>](#module_Tuner)  

| Param | Type | Description |
| --- | --- | --- |
| audioContext | <code>AudioContext</code> | The audio context |

<a name="module_Tuner..setupMeydaAnalyzer"></a>

### Tuner~setupMeydaAnalyzer() ⇒ <code>Promise.&lt;void&gt;</code>
Sets up the Meyda analyzer

**Kind**: inner method of [<code>Tuner</code>](#module_Tuner)  
<a name="module_Tuner..updateTunerFeatures"></a>

### Tuner~updateTunerFeatures(features)
Updates tuner features based on Meyda analysis

**Kind**: inner method of [<code>Tuner</code>](#module_Tuner)  

| Param | Type | Description |
| --- | --- | --- |
| features | <code>Object</code> | The extracted features |

<a name="module_Tuner..setupAubio"></a>

### Tuner~setupAubio() ⇒ <code>Promise.&lt;void&gt;</code>
Sets up Aubio for pitch and tempo detection

**Kind**: inner method of [<code>Tuner</code>](#module_Tuner)  
<a name="module_Tuner..start"></a>

### Tuner~start()
Starts the audio input stream

**Kind**: inner method of [<code>Tuner</code>](#module_Tuner)  
<a name="module_Tuner..setupAudioStream"></a>

### Tuner~setupAudioStream(stream)
Sets up the audio stream and connects it to the audio chain

**Kind**: inner method of [<code>Tuner</code>](#module_Tuner)  

| Param | Type | Description |
| --- | --- | --- |
| stream | <code>MediaStream</code> | The audio input stream |

<a name="module_Tuner..handleBeatProcess"></a>

### Tuner~handleBeatProcess(e)
Handles beat processing

**Kind**: inner method of [<code>Tuner</code>](#module_Tuner)  

| Param | Type | Description |
| --- | --- | --- |
| e | <code>AudioProcessingEvent</code> | The audio processing event |

<a name="module_Tuner..handleAudioProcess"></a>

### Tuner~handleAudioProcess(event)
Handles audio processing for pitch detection

**Kind**: inner method of [<code>Tuner</code>](#module_Tuner)  

| Param | Type | Description |
| --- | --- | --- |
| event | <code>AudioProcessingEvent</code> | The audio processing event |

<a name="module_Tuner..updateTunerNote"></a>

### Tuner~updateTunerNote(frequency)
Updates the tuner note based on the detected frequency

**Kind**: inner method of [<code>Tuner</code>](#module_Tuner)  

| Param | Type | Description |
| --- | --- | --- |
| frequency | <code>number</code> | The detected frequency |

<a name="module_Tuner..getNote"></a>

### Tuner~getNote(frequency) ⇒ <code>number</code>
Gets the MIDI note number from a frequency

**Kind**: inner method of [<code>Tuner</code>](#module_Tuner)  
**Returns**: <code>number</code> - The MIDI note number  

| Param | Type | Description |
| --- | --- | --- |
| frequency | <code>number</code> | The input frequency |

<a name="module_Tuner..getStandardFrequency"></a>

### Tuner~getStandardFrequency(note) ⇒ <code>number</code>
Gets the standard frequency for a given note

**Kind**: inner method of [<code>Tuner</code>](#module_Tuner)  
**Returns**: <code>number</code> - The standard frequency  

| Param | Type | Description |
| --- | --- | --- |
| note | <code>number</code> | The MIDI note number |

<a name="module_Tuner..getCents"></a>

### Tuner~getCents(frequency, note) ⇒ <code>number</code>
Calculates the cents deviation from the perfect pitch

**Kind**: inner method of [<code>Tuner</code>](#module_Tuner)  
**Returns**: <code>number</code> - The cents deviation  

| Param | Type | Description |
| --- | --- | --- |
| frequency | <code>number</code> | The input frequency |
| note | <code>number</code> | The MIDI note number |

<a name="module_Tuner..freqColor"></a>

### Tuner~freqColor(frequency) ⇒ <code>string</code>
Gets the color associated with a frequency

**Kind**: inner method of [<code>Tuner</code>](#module_Tuner)  
**Returns**: <code>string</code> - The color in hexadecimal format  

| Param | Type | Description |
| --- | --- | --- |
| frequency | <code>number</code> | The input frequency |

<a name="module_Tuner..getRawNote"></a>

### Tuner~getRawNote(frequency) ⇒ <code>number</code>
Gets the raw note value (0-11) from a frequency

**Kind**: inner method of [<code>Tuner</code>](#module_Tuner)  
**Returns**: <code>number</code> - The raw note value  

| Param | Type | Description |
| --- | --- | --- |
| frequency | <code>number</code> | The input frequency |

<a name="module_Tuner..TunerNote"></a>

### Tuner~TunerNote : <code>Object</code>
**Kind**: inner typedef of [<code>Tuner</code>](#module_Tuner)  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| name | <code>string</code> | The name of the note |
| value | <code>number</code> | The MIDI note value |
| cents | <code>number</code> | The cents deviation from the perfect pitch |
| octave | <code>number</code> | The octave of the note |
| frequency | <code>number</code> | The frequency of the note |
| color | <code>string</code> | The color associated with the note |
| silent | <code>boolean</code> | Whether the note is silent |

<a name="module_Tuner..TunerState"></a>

### Tuner~TunerState : <code>Object</code>
**Kind**: inner typedef of [<code>Tuner</code>](#module_Tuner)  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| initiated | <code>boolean</code> | Whether the tuner has been initiated |
| initiating | <code>boolean</code> | Whether the tuner is currently initiating |
| stream | <code>MediaStream</code> \| <code>null</code> | The audio input stream |
| middleA | <code>number</code> | The frequency of middle A |
| semitone | <code>number</code> | The MIDI note number of middle A |
| note | <code>TunerNote</code> | The current detected note |
| span | <code>number</code> | The span of the tuner |
| bufferSize | <code>number</code> | The size of the audio buffer |
| tempoBufferSize | <code>number</code> | The size of the tempo buffer |
| running | <code>boolean</code> | Whether the tuner is running |
| frame | <code>number</code> | The current frame number |
| beat | <code>number</code> | The current beat number |
| bpm | <code>number</code> | The detected beats per minute |
| confidence | <code>number</code> | The confidence of the tempo detection |
| listenBeat | <code>boolean</code> | Whether to listen for beats |
| prevBeat | <code>number</code> | The previous beat number |
| blink | <code>boolean</code> | Whether to blink (for visual feedback) |
| chroma | <code>Array.&lt;number&gt;</code> | The chroma vector |
| spec | <code>Array.&lt;number&gt;</code> | The amplitude spectrum |
| rms | <code>number</code> | The root mean square of the signal |

