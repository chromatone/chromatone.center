## Modules

<dl>
<dt><a href="#module_Audio">Audio</a></dt>
<dd><p>Main audio bus controller</p>
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
<dt><a href="#module_Tuner - pitch detection">Tuner - pitch detection</a></dt>
<dd><p>Audio analysis on the fly using Aubio.js and Meyda</p>
</dd>
</dl>

<a name="module_Audio"></a>

## Audio
Main audio bus controller

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
<a name="module_Tuner - pitch detection"></a>

## Tuner - pitch detection
Audio analysis on the fly using Aubio.js and Meyda

