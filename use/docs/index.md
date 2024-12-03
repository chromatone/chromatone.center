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
<dt><a href="#module_Mouse">Mouse</a></dt>
<dd></dd>
<dt><a href="#module_AudioRecorder">AudioRecorder</a></dt>
<dd></dd>
<dt><a href="#module_Render">Render</a></dt>
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
<a name="module_Mouse"></a>

## Mouse
<a name="module_AudioRecorder"></a>

## AudioRecorder
<a name="module_Render"></a>

## Render
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

