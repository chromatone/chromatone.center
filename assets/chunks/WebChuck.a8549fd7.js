import{_ as E,d as A,P as _,e as w,v as m,b as p,Z as R,g as y,F as d,a as T,H as M,z as I,X as D,N as S,A as x,c as C}from"./framework.7e747cd7.js";const F=`// patch
BlowHole hole => JCRev rev => dac;

// scale
[0, 2, 5, 7] @=> int scale[];

<<< "reed stiffness:", hole.reed() >>>;
<<< "noise gain:", hole.noiseGain() >>>;
<<< "tonehole state:", hole.tonehole() >>>;
<<< "register state:", hole.vent() >>>;
<<< "breath pressure:", hole.pressure() >>>;

// infinite time loop
while( true )
{
  // change parameters
  if( Math.random2f(0,1) > .75 )
  {
    Math.random2f( 0.6, 0.8 ) => hole.reed;
    Math.random2f( 0, 0.8 ) => hole.noiseGain;
    Math.random2f( 0.8, 1 ) => hole.tonehole;
    Math.random2f( 0, 0.2 ) => hole.vent;
    Math.random2f( 0, 0.7 ) => hole.pressure;

    // print
    <<< "going...", "" >>>;
    <<< "reed stiffness:", hole.reed() >>>;
    <<< "noise gain:", hole.noiseGain() >>>;
    <<< "tonehole state:", hole.tonehole() >>>;
    <<< "register state:", hole.vent() >>>;
    <<< "breath pressure:", hole.pressure() >>>;
  }

  // set freq
  scale[Math.random2(0,scale.size()-1)] => int note;
  36 + Math.random2(0,1)*12 + note => Std.mtof => hole.freq;
  <<< "note: ", Std.ftom( hole.freq() ) >>>;

  // go
  .2 => hole.noteOn;
  Math.random2(1,8)*.25::second => now;
  1 => hole.noteOff;
  // advance time
  Math.random2(0,8)*.5::second => now;
}
`,P=`// patch
Bowed bow => dac;

// scale
[0, 0, 2, 5, 7] @=> int scale[];

// infinite time loop
while( true )
{
    // set
    Math.random2f( 0.6, 0.8 ) => bow.bowPressure;
    Math.random2f( 0.2, 0.8 ) => bow.bowPosition;
    Math.random2f( 0, 0.2 ) => bow.vibratoFreq;
    Math.random2f( 0, 0.05 ) => bow.vibratoGain;
    Math.random2f( 0, .8 ) => bow.volume;

    // print
    <<< "bow pressure:", bow.bowPressure() >>>;

    // set freq
    scale[Math.random2(0,scale.size()-1)] + 44 => Std.mtof => bow.freq;
    // go
    Math.random2f(0.6, .8) => bow.noteOn;

    // advance time
    Math.random2(1, 8)*.125::second => now;
}
`,L=`// patch
Brass brass => JCRev r => dac;
.75 => r.gain;
.05 => r.mix;

// our notes
[ 61, 63, 65, 66, 68 ] @=> int notes[];

// infinite time-loop
while( true )
{
    // set
    Math.random2f( 0, 1 ) => brass.lip;
    Math.random2f( 0, 1 ) => brass.slide;
    Math.random2f( 0, 12 ) => brass.vibratoFreq;
    Math.random2f( 0, 1 ) => brass.vibratoGain;
    Math.random2f( 0, 1 ) => brass.volume;

    // print
    <<< "---", "" >>>;
    <<< "lip tension:", brass.lip() >>>;
    <<< "slide length:", brass.slide() >>>;
    <<< "vibrato freq:", brass.vibratoFreq() >>>;
    <<< "vibrato gain:", brass.vibratoGain() >>>;
    <<< "volume:", brass.volume() >>>;

    for( int i; i < notes.size(); i++ )
    {
        play( 12 + notes[i], Math.random2f( .6, .9 ) );
        300::ms => now;
    }
}

// basic play function (add more arguments as needed)
fun void play( float note, float velocity )
{
    // start the note
    Std.mtof( note ) => brass.freq;
    velocity => brass.noteOn;
}
`,N=`//--------------------------------------------------------------------
// name: chant.ck
// desc: chant synthesizer; demonstrates multi-shredded concurrency,
//       variable rates, source-filter model, and interpolation.
//
// This is a classic source-filter model for rudimentary singing
// synthesis: an impulse train (the "source", crudely modeling
// opening/closing of the glottis in the vocal tract) going through
// a bank of three formant filters (roughly modeling the filtering
// by the vocal cavity to induce the perception of different vowels).
//
// This example demonstrates an elegant way to implement the above
// in ChucK, by breaking up the tasks into three concurrent shreds:
//   1. a main shred selects the next target pitch and formants
//   2. doImpulse() generates the impulse train; using ChucK's
//      strongly-timed mechanisms to modulate the impulse train
//      period to create vibrato
//   3. doInterpolation() interpolates the period and formants,
//      to smoothly glide from note to note, vowel to vowel
//
// author: Perry R. Cook (2006)
//         modified by Rebecca Fiebrink and Ge Wang (2007, 2021)
//         published in ChucK examples 2021
//--------------------------------------------------------------------

// synthesis patch
Impulse i => TwoZero t => TwoZero t2 => OnePole p;
// formant filters
p => TwoPole f1 => Gain g;
p => TwoPole f2 => g;
p => TwoPole f3 => g;
// reverbs
g => JCRev r => dac;
g => JCRev rL => dac.left;
g => JCRev rR => dac.right;
// delays
g => Delay d1 => Gain g1 => r;
g => Delay d2 => Gain g2 => rL;
g => Delay d3 => Gain g3 => rR;
// connect gains to delays
g1 => d1; g2 => d2; g3 => d3;

// source gain (amplitude of the impulse train)
0.25 => float sourceGain;

// set filter coefficients
1.0 => t.b0;  0.0 => t.b1; -1.0 => t.b2;
1.0 => t2.b0; 0.0 => t2.b1; 1.0 => t2.b2;
// set gains
0.1 => g1.gain;	0.1 => g2.gain;	0.1 => g3.gain;
// set reverb mix
0.025 => r.mix;
// set delay max and length
1.5 :: second => d1.max;
2.0 :: second => d2.max;
2.8 :: second => d3.max;
1.41459 :: second => d1.delay;
1.97511 :: second => d2.delay;
2.71793 :: second => d3.delay;

// set two pole filter radii and gain
0.997 => f1.radius; 0.997 => f2.radius; 0.997 => f3.radius;
1.0 => f1.gain; 0.8 => f2.gain; 0.6 => f3.gain;
// randomize initial formant frequencies
Math.random2f( 230.0, 660.0 ) => f1.freq;
Math.random2f( 800.0, 2300.0 ) => f2.freq;
Math.random2f( 1700.0, 3000.0 ) => f3.freq;

// variables for interpolating current and target formant frequencies
400.0 => float f1freq;
1000.0 => float f2freq;
2800.0 => float f3freq;
400.0 => float target_f1freq;
1000.0 => float target_f2freq;
2800.0 => float target_f3freq;

// leaky integrator
0.99 => p.pole;
1.0 => p.gain;

// variables that control impulse train source
0.013 => float period;
0.013 => float targetPeriod;
0.0 => float modphase;
0.0001 => float vibratoDepth;

// scale
[ 0, 1, 5, 7,
  8, 11, 8, 7,
  11, 12, 14, 15,
  19, 17, 20, 24 ] @=> int scale[];
// names (for printing)
[ "ut0", "ra0", "fa0", "ut0",
  "ra0", "mi0", "ra1", "ut1", 
  "mi0", "ut1", "re1", "mi1", 
  "ut1", "fa1", "re1", "ut2" ] @=> string names[];
// current location in scale
9 => int scalepoint;
// frequency
float theFreq;

// spork two concurrent child shreds...
spork ~ doImpulse(); // generate voice source
spork ~ doInterpolation( 10::ms ); // interpolate pitch and formants

// main shred loop
while( true )
{
    // determine new formant targets
    Math.random2f( 230.0, 660.0 ) => target_f1freq;
    Math.random2f( 800.0, 2300.0 ) => target_f2freq;
    Math.random2f( 1700.0, 3000.0 ) => target_f3freq;

    // next pitch (random walk the scale)
    Math.random2(-1,1) + scalepoint => scalepoint;
    if( scalepoint < 0 ) 0 => scalepoint;
    if( scalepoint > 15 ) 15 => scalepoint;
    // compute the frequency
    32 + scale[scalepoint] => Std.mtof => theFreq;
    // print things for fun
    <<< names[scalepoint], theFreq >>>;
    // calculate corresponding target period
    1.0 / theFreq  => targetPeriod;

    // wait until next note
    Math.random2f( 0.2, 0.9 )::second => now;
}

// entry point for shred: generate source impulse train
fun void doImpulse()
{
    // infinite time-loop
    while( true )
    {
        // fire impulse
        sourceGain => i.next;
        // phase variable
        modphase + period => modphase;
        // vibrato depth
        .0001 => vibratoDepth;
        // modulate wait time until next impulse: vibrato
        (period + vibratoDepth*Math.sin(2*pi*modphase*6.0))::second => now;
    }
}

// entry point for shred: interpolate period and formant frequencies
fun void doInterpolation( dur T )
{
    // percentage progress per time slice
    0.10 => float slew;
    // infinite time-loop
    while( true )
    {
        // go towards target period (pitch)
        (targetPeriod - period) * slew + period => period;
        // go towards targat formant frequencies
        (target_f1freq - f1freq) * slew + f1freq => f1freq => f1.freq;
        (target_f2freq - f2freq) * slew + f2freq => f2freq => f2.freq;
        (target_f3freq - f3freq) * slew + f3freq => f3freq => f3.freq;

        // interpolation rate
        T => now;
    }
}
`,q=`// STK Clarinet
// (also see examples/event/polyfony2.ck)

// patch
Clarinet clair => JCRev r => dac;
.75 => r.gain;
.1 => r.mix;

// our notes
[ 61, 63, 65, 66, 68, 66, 65, 63, 61 ] @=> int notes[];

// infinite time-loop
while( true )
{
    // clear
    clair.clear( 1.0 );

    // set
    Math.random2f( 0, 1 ) => clair.reed;
    Math.random2f( 0, 1 ) => clair.noiseGain;
    Math.random2f( 0, 12 ) => clair.vibratoFreq;
    Math.random2f( 0, 1 ) => clair.vibratoGain;
    Math.random2f( 0, 1 ) => clair.pressure;

    // print
    <<< "---", "" >>>;
    <<< "reed stiffness:", clair.reed() >>>;
    <<< "noise gain:", clair.noiseGain() >>>;
    <<< "vibrato freq:", clair.vibratoFreq() >>>;
    <<< "vibrato gain:", clair.vibratoGain() >>>;
    <<< "breath pressure:", clair.pressure() >>>;

    for( int i; i < notes.size(); i++ )
    {
        play( 12 + notes[i], Math.random2f( .6, .9 ) );
        300::ms => now;
    }
}

// basic play function (add more arguments as needed)
fun void play( float note, float velocity )
{
    // start the note
    Std.mtof( note ) => clair.freq;
    velocity => clair.noteOn;
}
`,G=`// STK Flute

// patch
Flute flute => PoleZero f => JCRev r => dac;
.75 => r.gain;
.05 => r.mix;
.99 => f.blockZero;

// our notes
[ 0, 2, 5, 7 ] @=> int notes[];

// infinite time-loop
while( true )
{
    // clear
    flute.clear( 1.0 );

    // set
    Math.random2f( 0.2, .8 ) => flute.jetDelay;
    Math.random2f( 0.2, .8 ) => flute.jetReflection;
    Math.random2f( 0.2, .8 ) => flute.endReflection;
    Math.random2f( 0.2, .8 ) => flute.noiseGain;
    Math.random2f( 0, 12 ) => flute.vibratoFreq;
    Math.random2f( 0.2, .8 ) => flute.vibratoGain;
    Math.random2f( 0.2, .6 ) => flute.pressure;

    // print
    <<< "---", "" >>>;
    <<< "jetDelay:", flute.jetDelay() >>>;
    <<< "jetReflection:", flute.jetReflection() >>>;
    <<< "endReflection:", flute.endReflection() >>>;
    <<< "noiseGain:", flute.noiseGain() >>>;
    <<< "vibratoFreq:", flute.vibratoFreq() >>>;
    <<< "vibratoGain:", flute.vibratoGain() >>>;
    <<< "breath pressure:", flute.pressure() >>>;

    // factor
    Math.random2( 1, 4 ) => int factor;

    for( int i; i < notes.size(); i++ )
    {
        play(44 + Math.random2(1,2)*12 + notes[i], Math.random2f( .2, .6 ) );
        125::ms * factor => now;
    }
}

// basic play function (add more arguments as needed)
fun void play( float note, float velocity )
{
    // start the note
    Std.mtof( note ) => flute.freq;
    velocity => flute.noteOn;
}
`,O=`//-----------------------------------------------------------------------------
// name: hevymetl-dance-now.ck
// desc: riff from "Everybody Dance Now"
//       created using FM Synthesis, for "Everybody SLOrk Now!"
//
// author: Ge Wang (https://ccrma.stanford.edu/~ge/)
// date: Spring 2022
//
// original: inspired by "Gonna Make You Sweat (Everybody Dance Now)"
//           C+C Music Factory
//
// code notes:
//   * OFFSET: pitch of third note in power chord (try 0, -12, 12)
//   * DO_ECHO: set to 0 for clean chords; 1 for feedback echo
//   * USE_ENV: controls the attack; set to 0 for hevymetl attack
//-----------------------------------------------------------------------------
// note: want to learn more about HevyMetl? uncomment following line:
// HevyMetl.help();
//-----------------------------------------------------------------------------

// quarter note duration
0.2615::second => dur R;
// detune ("Everybody Dance Now" in Bb + somewhat sharper)
.3 => float TUNE;
// pitch of third note in power chord (try 0, -12, 12)
0  => int OFFSET;
// controls the attack; set to 0 for hevymetl attack
1 => int USE_ENV;
// set to 0 for clean chords; 1 for feedback echo
1 => int DO_ECHO;

// patch
HevyMetl h[3];
// high pass (for echoes)
HPF hpf[3];
// reverb
NRev r => dac; .5 => dac.gain;
// reverb mix
0.0 => r.mix;
// feedback delay
Delay d => r;
d => Gain feedback => d;
// delay
R => d.max => d.delay;
// delay gain
0.4 => d.gain;
// feedback
0.15 => feedback.gain;

// FM operator envelope indices
[31,31,31,31] @=> int attacks[]; // [18,14,15,15] from patch
[31,31,31,31] @=> int decays[];  // [31,31,26,31] from patch
[15,15,15,10] @=> int sustains[]; // [15,15,13,15] from patch
[31,31,31,31] @=> int releases[]; // [8,8,8,8] from patch

// connect
for( int i; i < 3; i++ )
{
    h[i] => r;
    // set delay
    h[i] => hpf[i] => d;
    // set high pass
    600 => hpf[i].freq;
    
    // LFO depth
    0.0 => h[i].lfoDepth;
    
    if( USE_ENV)
    {
        // ops
        for( 0=>int op; op < 4; op++ )
        {
            h[i].opADSR( op,
            h[i].getFMTableTime(attacks[op]),
            h[i].getFMTableTime(decays[op]),
            h[i].getFMTableSusLevel(sustains[op]),
            h[i].getFMTableTime(releases[op]) );
        }
    }
}

// time loop
while( true )
{
    // echo gain
    DO_ECHO * .5 => d.gain;
    
    // do it
    playChord( 46, 53, 46+OFFSET, .8, R );
    2*R => now;
    playChord( 46, 53, 46+OFFSET, .8, R );
    1*R => now;
    playChord( 41, 48, 41+OFFSET, 1.0, R*.8 ); .2*R => now;
    R/2+0*R => now;
    playChord( 44, 51, 44+OFFSET, .9, R*.8 ); .2*R => now;
    R/2+0*R => now;
}

fun void playChord( int a, int b, int c, float vel, dur D )
{
    // set the pitches
    Std.mtof(a+TUNE) => h[0].freq;
    Std.mtof(b+TUNE) => h[1].freq;
    Std.mtof(c+TUNE) => h[2].freq;
    
    // note on
    for( 0 => int i; i < 3; i++ )
    { vel => h[i].noteOn; }
    // sound
    0.85*(D) => now;
    
    // note off
    for( 0 => int i; i < 3; i++ )
    { 1 => h[i].noteOff; }
    // let ring
    0.15*(D) => now;
}
`,V=`// name: hevymetl-trumpet-algo3.ck
// desc: demo of how to turn HevyMetl (Algorithm 3) into an FM Trumpet!!
//       now you can transcribe (somewhat) directly from a TX81 Patch!!!
//
// author: Perry R. Cook
// date: June 2021, for REPAIRATHON 2021
//       needs chuck 1.4.1.0 or above


// patch
HevyMetl t => NRev r => dac;
// reverb mix
0.06 => r.mix;

// want to learn more about HevyMetl? uncomment this:
// t.help();

// FM
[1,6,6,1] @=> int waveForms[];
[99,85,74,99] @=> int opGains[]; // [93,75,54,81] from patch
[1.0,1.0,2.9,1.0] @=> float ratios[];
[15,14,15,15] @=> int attacks[]; // [18,14,15,15] from patch
[31,20,26,14] @=> int decays[];  // [31,31,26,31] from patch
[15,10,13,15] @=> int sustains[]; // [15,15,13,15] from patch
[10,10,10,10] @=> int releases[]; // [8,8,8,8] from patch

// ops
for( int op; op < 4; op++ )
{
    t.opWave( op, waveForms[op] );  // sine waves all
    t.opGain( op, t.getFMTableGain(opGains[op]) );
    t.opADSR( op, t.getFMTableTime(attacks[op]),
                  t.getFMTableTime(decays[op]),
                  t.getFMTableSusLevel(sustains[op]),
                  t.getFMTableTime(releases[op]) );
    t.opRatio( op, ratios[op] );
}

// t.setOpGain(1,0.0);
t.op4Feedback(0.5);

// our notes
[ 64, 62, 67, 69, 74, 71, 69, 74, 71, 67, 72, 69, 67] @=> int notes[];
[2, 2, 2, 1, 1, 2, 1, 1, 2, 2, 2, 2, 9] @=> int durs[];

0.005 => t.lfoDepth;

for( 0 => int i; i < notes.cap(); i++ )
{
    Std.mtof( 14 + notes[i] ) => t.freq;
    0.7 => t.noteOn;
    if (i == notes.cap()-1) 0.05 => t.lfoDepth;
    (0.2 * durs[i]) :: second => now;
    1.0 => t.noteOff;
    (0.1 * durs[i]) :: second => now;
}
`,W=`// impulse generator is cool...
// this demo is not

// connect impulse generator
Impulse i => dac;
.5 => i.gain;

// emit impulse every so often
2000 => int a;
while( 1 )
{
    // set the next sample
    1.0 => i.next;

    // advance time
    a::samp => now;
    a - 8 => a; if( a <= 0 ) 2000 => a;
}
`,H=`// low-frequency oscillator

// sine wave to blackhole (like dac but no sound)
SinOsc lfo => blackhole;
// set period (an alternative to .freq)
1::second => lfo.period;

// infinite time loop
while( true )
{
    // print out last value
    <<< lfo.last(), "" >>>;
    // advance time
    50::ms => now;
}
`,U=`// STK Mandolin

// patch
Mandolin m => JCRev r => dac;
.75 => r.gain;
.125 => r.mix;

// our notes
[ 0, 2, 5, 7, 9 ] @=> int notes[];

// infinite time-loop
while( true )
{
    // set
    Math.random2f( 0, 1 ) => m.bodySize;
    Math.random2f( 0, 1 ) => m.pluckPos;
    // Math.random2f( 0, 1 ) => m.stringDamping;
    // Math.random2f( 0, 1 ) => m.stringDetune;

    // print
    <<< "---", "" >>>;
    <<< "body size:", m.bodySize() >>>;
    <<< "pluck position:", m.pluckPos() >>>;
    <<< "string damping:", m.stringDamping() >>>;
    <<< "string detune:", m.stringDetune() >>>;

    // factor
    Math.random2( 1, 5 ) => int factor;

    for( int i; i < notes.size(); i++ )
    {
        play( 44 + Math.random2(0,2)*12 + notes[i], Math.random2f( .6, .9 ) );
        62.5::ms * factor => now;
    }
}

// basic play function (add more arguments as needed)
fun void play( float note, float velocity )
{
    // start the note
    Std.mtof( note ) => m.freq;
    velocity => m.pluck;
}
`,Y=`// STK ModalBar

// patch
ModalBar bar  => JCRev r => dac;

.9 => r.gain;
.02 => r.mix;

// scale
[-1,0, 2, 5, 7, 8, 11] @=> int scale[];

// infinite time loop
while( true )
{
    // ding!
    Math.random2( 0, 8 ) => bar.preset;
    Math.random2f( 0.2, 0.8 ) => bar.stickHardness;
    Math.random2f( 0.2, 0.8 ) => bar.strikePosition;
    Math.random2f( 0.2, 0.8 ) => bar.vibratoGain;
    Math.random2f( 1, 60 ) => bar.vibratoFreq;
    Math.random2f( 0.2, 0.8 ) => bar.volume;
    Math.random2f( .3, .9 ) => bar.directGain;
    Math.random2f( .2, .9 ) => bar.masterGain;


    // print
    <<< "preset:", bar.preset() >>>;

    // set freq
	scale[Math.random2(0,scale.size()-1)] => int winner;
    33 + Math.random2(0,1)*12 + winner => Std.mtof => bar.freq;
    // go
    Math.random2f(0.3,0.8) => bar.noteOn;

    // advance time
   Math.random2(1,4)*.125::second => now;
}
`,z=`// STK ModalBar

// patch
Moog moog => dac;

// scale
[0, 2, 5, 7, 9] @=> int scale[];

// infinite time loop
while( true )
{
    // ding!
    Math.random2f( 0, .5 ) => moog.filterQ;
    Math.random2f( 0, .2 ) => moog.filterSweepRate;
    Math.random2f( 0, 2 ) => moog.lfoSpeed;
    Math.random2f( 0, .1 ) => moog.lfoDepth;
    Math.random2f( 0, .8 ) => moog.volume;

    // print
    <<< "---", "" >>>;
    <<< "filterQ", moog.filterQ() >>>;
    <<< "filter sweep rate:", moog.filterSweepRate() >>>;
    <<< "lfo speed:", moog.lfoSpeed() >>>;
    <<< "lfo depth:", moog.lfoDepth() >>>;
    <<< "volume:", moog.volume() >>>;

    // set freq
    scale[Math.random2(0,scale.size()-1)] => int winner;
    44 + Math.random2(0,2)*12 + winner => Std.mtof => moog.freq;

    // go
    .6 => moog.noteOn;
    2::second => now;
    .6 => moog.noteOff;
    // advance time
    2::second => now;
}
`,j=`// karplus + strong plucked string filter
// Ge Wang (gewang@cs.princeton.edu)

// feedforward
Noise imp => OneZero lowpass => dac;
// feedback
lowpass => Delay delay => lowpass;

// our radius
.99999 => float R;
// our delay order
500 => float L;
// set delay
L::samp => delay.delay;
// set dissipation factor
Math.pow( R, L ) => delay.gain;
// place zero
-1 => lowpass.zero;

// fire excitation
1 => imp.gain;
// for one delay round trip
L::samp => now;
// cease fire
0 => imp.gain;

// advance time
(Math.log(.0001) / Math.log(R))::samp => now;
`,J=`// plucked string filter, different excitation
// Ge Wang (gewang@cs.princeton.edu)

// feedforward
SndBuf buffy => PoleZero block => OneZero lowpass => dac;
// feedback
lowpass => Delay delay => lowpass;

// our radius
.99999 => float R;
// our delay order
250 => float L;
// set delay
L::samp => delay.delay;
// set dissipation factor
Math.pow( R, L ) => delay.gain;
// take out DC and neighborhood
.999 => block.blockZero;
// place zero
-1 => lowpass.zero;

// fire excitation (try other sounds too)
"special:mand1" => buffy.read;

// advance time
(Math.log(.0001) / Math.log(R))::samp => now;
`,B=`// tuned plucked string filter
// Ge Wang (gewang@cs.princeton.edu)

// feedforward
Noise imp => OneZero lowpass => PoleZero allpass => dac;
// feedback
allpass => Delay delay => lowpass;

// our radius
.99999 => float R;
// finding our (integer) delay order
Std.mtof( 36.5 ) => setFreq => float L;
// set delay
L::samp => delay.delay;
// set dissipation factor
Math.pow( R, L ) => delay.gain;
// place zero
-1 => lowpass.zero;

// fire excitation
1 => imp.gain;
// for one delay round trip
L::samp => now;
// done
0 => imp.gain;

// advance time
(Math.log(.0001) / Math.log(R))::samp => now;

// set (fundamental) freq
fun int setFreq( float freq )
{
    // sample rate
    second / samp => float SR;
    // omega
    2 * pi * freq / SR => float omega;
    // figure total delay needed
    SR / freq - .5 => float D;
    // the integer part
    D $ int => int Di;
    // the fraction
    D - Di => float Df;
    // set allpass using fractional and fundamental
    polePos( Df, omega ) => allpass.allpass;

    // return integer portion
    return Di;
}

// find pole location from delay and omega
fun float polePos( float D, float omega )
{
    // here it is (a la Jaffe & Smith)
    return Math.sin( (1-D) * omega / 2 ) / 
           Math.sin( (1+D) * omega / 2 );
}
`,K=`// more music for replicants

// patch
Rhodey voc => JCRev r => Echo a => Echo b => Echo c => dac;

220.0 => voc.freq;
0.8 => voc.gain;
.8 => r.gain;
.2 => r.mix;
1000::ms => a.max => b.max => c.max;
750::ms => a.delay => b.delay => c.delay;
.50 => a.mix => b.mix => c.mix;

// shred to modulate the mix
fun void vecho_Shred( )
{
    0.0 => float decider;
    0.0 => float mix;
    0.0 => float old;
    0.0 => float inc;
    0 => int n;

    // time loop
    while( true )
    {
        Math.random2f( 0, 1 ) => decider;
        if( decider < .3 ) 0.0 => mix;
        else if( decider < .6 ) .08 => mix;
        else if( decider < .8 ) .5 => mix;
        else .15 => mix;

        // find the increment
        (mix-old)/1000.0 => inc;
        1000 => n;
        while( n-- )
        {
            old + inc => old;
            old => a.mix => b.mix => c.mix;
            1::ms => now;
        }
        mix => old;
        Math.random2(2,6)::second => now;
    }
}


// let echo shred go
spork ~ vecho_Shred();

// scale
[ 0, 2, 4, 7, 9 ] @=> int scale[];

// our main loop
while( true )
{ 
    // pentatonic
    scale[Math.random2(0,scale.size()-1)] => int freq;

    Std.mtof( ( 33 + Math.random2(0,1) * 12 + freq ) ) => voc.freq;
    Math.random2f( 0.6, 0.8 ) => voc.noteOn;

    // note: Math.randomf() returns value between 0 and 1
    if( Math.randomf() > 0.85 )
    { 1000::ms => now; }
    else if( Math.randomf() > .85 )
    { 500::ms => now; }
    else if( Math.randomf() > .1 )
    { .250::second => now; }
    else
    {
        0 => int i;
        2 * Math.random2( 1, 3 ) => int pick;
        0 => int pick_dir;
        0.0 => float pluck;

        for( ; i < pick; i++ )
        {
            Math.random2f(.4,.6) + i*.035 => pluck;
            pluck + -0.02 * (i * pick_dir) => voc.noteOn;
            !pick_dir => pick_dir;
            250::ms => now;
        }
    }
}
`,Z=`//---------------|
// shake-o-matic!
// by: Ge Wang (gewang@cs.princeton.edu)
//     Perry R. Cook (prc@cs.princeton.edu)
//------------------|

// our patch
Shakers shake => JCRev r => dac;
// set the gain
//.95 => r.gain;
// set the reverb mix
.025 => r.mix;

// our main loop
while( true )
{
    // frequency..
    // note: Math.randomf() returns value between 0 and 1
    if( Math.randomf() > 0.625 )
    {
        Math.random2( 0, 22 ) => shake.which;
        Std.mtof( Math.random2f( 0.0, 128.0 ) ) => shake.freq;
        Math.random2f( 0, 128 ) => shake.objects;
        <<< "instrument #:", shake.which(), shake.freq(), shake.objects() >>>;
    }

    // shake it!
    Math.random2f( 0.8, 1.3 ) => shake.noteOn;

    // note: Math.randomf() returns value between 0 and 1
    if( Math.randomf() > 0.9 )
    { 500::ms => now; }
    else if( Math.randomf() > .925 )
    { 250::ms => now; }
    else if( Math.randomf() > .05 )
    { .125::second => now; }
    else
    {
        1 => int i => int pick_dir;
        // how many times
        4 * Math.random2( 1, 5 ) => int pick;
        0.0 => float pluck;
        0.7 / pick => float inc;
        // time loop
        for( ; i < pick; i++ )
        {
            75::ms => now;
            Math.random2f(.2,.3) + i*inc => pluck;
            pluck + -.2 * pick_dir => shake.noteOn;
            // simulate pluck direction
            !pick_dir => pick_dir;
        }

        // let time pass for final shake
        75::ms => now;
    }
}
`,$=`// patch
Sitar sit => JCRev r => dac;
.05 => r.mix;

[0, 2, 5, 7, 9] @=> int scale[];

// time loop
while( true )
{
    // freq
    scale[Math.random2(0,scale.size()-1)] => int winner;
    Std.mtof( 44 + Math.random2(0,2) * 12 + winner ) => sit.freq;

    // pluck!
    Math.random2f( 0.4, 0.9 ) => sit.noteOn;

    // advance time
    // note: Math.randomf() returns value between 0 and 1
    if( Math.randomf() > .5 ) {
        .5::second => now;
    } else { 
        0.25::second => now;
    }
}
`,Q=`//---------------|
// karp-o-matic!
// by: Ge Wang (gewang@cs.princeton.edu)
//     Perry R. Cook (prc@cs.princeton.edu)
//------------------|

// our patch
StifKarp karp => JCRev r => Echo a => Echo b => Echo c => dac;
// set the gain
.95 => r.gain;
// set the reverb mix
.02 => r.mix;
// set max delay for echo
1000::ms => a.max => b.max => c.max;
// set delay for echo
750::ms => a.delay => b.delay => c.delay;
// set the initial effect mix
0.0 => a.mix => b.mix => c.mix;

// shred to modulate the mix
fun void echo_Shred( )
{
    0.0 => float decider => float mix => float old => float inc;

    // time loop
    while( true )
    {
        Math.random2f(0.0,1.0) => decider;
        if( decider < .35 ) 0.0 => mix;
        else if( decider < .55 ) .08 => mix;
        else if( decider < .8 ) .5 => mix;
        else .15 => mix;

        // find the increment
        (mix-old)/1000.0 => inc; 1000 => int n;
        // time loop
        while( n-- )
        {
            // set the mix for a, b, c
            old + inc => old => a.mix => b.mix => c.mix;
            1::ms => now;
        }
        // remember the old
        mix => old;
        // let time pass until the next iteration
        Math.random2(2,6)::second => now;
    }
}

// let echo shred go
spork ~ echo_Shred();

// scale
[ 0, 2, 4, 7, 9 ] @=> int scale[];

// our main loop
while( true )
{
    // position
    Math.random2f( 0.2, 0.8 ) => karp.pickupPosition;
    // frequency...
    scale[Math.random2(0,scale.size()-1)] => int freq;
    220.0 * Math.pow( 1.05946, (Math.random2(0,2)*12)
                      +freq ) => karp.freq;
    // pluck it!
    0.0 => karp.stretch;
    Math.random2f( 0.2, 0.9 ) => karp.pluck;

    // note: Math.randomf() return value between 0 and 1
    if( Math.randomf() > 0.9 )
    { 500::ms => now; }
    else if( Math.randomf() > .925 )
    { 250::ms => now; }
    else if( Math.randomf() > .05 )
    { .125::second => now; }
    else
    {
        1 => int i => int pick_dir;
        // how many times
        4 * Math.random2( 1, 5 ) => int pick;
        0.0 => float pluck;
        0.7 / pick => float inc;
        // time loop
        for( ; i < pick; i++ )
        {
            75::ms => now;
            Math.random2f(.2,.3) + i*inc => pluck;
            i * 0.025 => karp.stretch;
            pluck + -.2 * pick_dir => karp.pluck;
            // simulate pluck direction
            !pick_dir => pick_dir;
        }
        // let time pass for final pluck
        75::ms => now;
    }
}
`,X=`// STK StifKarp

// patch
StifKarp m => NRev r => dac;
.75 => r.gain;
.02 => r.mix;

// our notes
[ 0, 2, 5, 7, 9 ] @=> int notes[];

// infinite time-loop
while( true )
{
    Math.random2f( 0, 1 ) => m.pickupPosition;
    Math.random2f( 0, 1 ) => m.sustain;
    Math.random2f( 0, 1 ) => m.stretch;

    <<< "---", "" >>>;
    <<< "pickup:", m.pickupPosition() >>>;
    <<< "sustain:", m.sustain() >>>;
    <<< "stretch:", m.stretch() >>>;

    // factor
    Math.random2( 1, 4 ) => int factor;

    for( int i; i < notes.size(); i++ )
    {
        play( 44 +  Math.random2(0,2)*12 + notes[i], Math.random2f( .6, .9 ) );
        125::ms * factor => now;
    }
}

// basic play function (add more arguments as needed)
fun void play( float note, float velocity )
{
    // start the note
    Std.mtof( note ) => m.freq;
    velocity => m.pluck;
}
`,nn=`// name: unclap.ck
// desc: configurable "clapping music" (Steve Reich)
// author: Jesus Gollonet (original)
//         Ge Wang (shreds and glottal pops)
// date: Summer 2006

// our patch
SndBuf clapper1 => dac.left;
SndBuf clapper2 => dac.right;

// load built-in sounds
"special:glot_ahh" => clapper1.read; 3.0 => clapper1.gain;
"special:glot_ahh" => clapper2.read; 3.0 => clapper2.gain;

// the full "clapping music" figure
[.5, .5, 1, .5, 1, 1, .5, 1 ] @=> float seq[];

// length of quarter note
.4::second => dur quarter;
// how many measures per shift
3 => int shift_period;
// how much to shift by (in quarter notes)
.5 => float shift_factor;

// one clapper
fun void clap( SndBuf buffy, int max, float factor )
{
    1 => int shifts;

    // infinite time loop
    for( ; true; shifts++ )
    {
        // one measure
        for( 0 => int count; count < seq.size(); count++ )
        {
            // set gain
            seq[count] * 2 => buffy.gain;
            // clap!
            0 => buffy.pos;
            // let time go by
            if( !max || shifts < max || count != (seq.size() - 1) )
                seq[count]::quarter => now;
            else
            {
                <<< "shift!!!", "" >>>;
                seq[count]*factor*quarter => now;
                0 => shifts;
            }
        }
    }
}

// spork one clapper, shift every shift_period measures
spork ~ clap( clapper1, shift_period, shift_factor );
// spork, no shift
spork ~ clap( clapper2, 0, 0 );

// infinite time loop
while( true ) 1::day => now;
`,en=`// music for replicants

// patch
VoicForm voc=> JCRev r => Echo a => Echo b => Echo c => dac;

// settings
220.0 => voc.freq;
0.95 => voc.gain;
.8 => r.gain;
.2 => r.mix;
1000::ms => a.max => b.max => c.max;
750::ms => a.delay => b.delay => c.delay;
.50 => a.mix => b.mix => c.mix;

// shred to modulate the mix
fun void vecho_Shred( )
{
    0.0 => float decider;
    0.0 => float mix;
    0.0 => float old;
    0.0 => float inc;
    0 => int n;

    // time loop
    while( true )
    {
        Math.random2f(0.0,1.0) => decider;
        if( decider < .3 ) 0.0 => mix;
        else if( decider < .6 ) .08 => mix;
        else if( decider < .8 ) .5 => mix;
        else .15 => mix;

        // find the increment
        (mix-old)/1000.0 => inc;
        1000 => n;
        while( n-- )
        {
            old + inc => old;
            if( old < 0 ) 0 => old;
            old => a.mix => b.mix => c.mix;
            1::ms => now;
        }
        mix => old;
        Math.random2(2,6)::second => now;
    }
}

// let echo shred go
spork ~ vecho_Shred();
0.5 => voc.loudness;
0.01 => voc.vibratoGain;

// scale
[ 0, 2, 4, 7, 9 ] @=> int scale[];

// our main time loop
while( true )
{
    2 * Math.random2( 0,2 ) => int bphon;
    bphon => voc.phonemeNum;
    Math.random2f( 0.6, 0.8 ) => voc.noteOn;

    // note: Math.randomf() returns value between 0 and 1
    if( Math.randomf() > 0.85 )
    { 1000::ms => now; }
    else if( Math.randomf() > .85 )
    { 500::ms => now; }
    else if( Math.randomf() > .1 )
    { .250::second => now; }
    else
    {
        0 => int i;
        4 * Math.random2( 1, 4 ) => int pick;
        0 => int pick_dir;
        0.0 => float pluck;

	for( ; i < pick; i++ )
        {
	    bphon + 1 * pick_dir => voc.phonemeNum;
            Math.random2f(.4,.6) + i*.035 => pluck;
            pluck + 0.0 * pick_dir => voc.noteOn;
            !pick_dir => pick_dir;
            250::ms => now;
        }
    }

    // pentatonic
    scale[Math.random2(0,scale.size()-1)] => int freq;
    Std.mtof( ( 44 + Math.random2(0,2) * 12 + freq ) ) => voc.freq;
}
`,tn=`// even more music for replicants

// patch
Wurley voc=> JCRev r => dac;

// initial settings
220.0 => voc.freq;
0.95 => voc.gain;
.8 => r.gain;
.1 => r.mix;

// scale
[ 0, 2, 7, 9, 11 ] @=> int scale[];

// our main time loop
while( true )
{
    // scale
    scale[Math.random2(0,scale.size()-1)] => int freq;
    Std.mtof( ( 44 + Math.random2(0,1) * 12 + freq ) ) => voc.freq;
    Math.random2f( 0.6, 0.8 ) => voc.noteOn;

    // note: Math.randomf() returns value between 0 and 1
    if( Math.randomf() > 0.9 )
    {
        // 1000::ms => now;
        repeat( 100 )
        {
            voc.freq() * 1.01 => voc.freq;
            10::ms => now;
        }
    }
    else if( Math.randomf() > .75 )
    {
        // 500::ms => now;
        repeat( 50 )
        {
            voc.freq() * .99 => voc.freq;
            10::ms => now;
        }
    }
    else if( Math.randomf() > .1 )
    {
        250::ms => now;

    }
    else
    {
        0 => int i;
        2 * Math.random2( 1, 3 ) => int pick;
        0 => int pick_dir;
        0.0 => float pluck;

        for( ; i < pick; i++ )
        {
            Math.random2f(.4,.6) + i*.035 => pluck;
            pluck + 0.03 * (i * pick_dir) => voc.noteOn;
            !pick_dir => pick_dir;
            250::ms => now;
        }
    }
}
`;class an{constructor(){this.resolve=void 0,this.reject=void 0,this.promise=new Promise((n,e)=>{this.resolve=n,this.reject=e})}async value(){return await this.promise}}function on(a,n,e){const t=new XMLHttpRequest;t.open("GET",a,!0),t.responseType="arraybuffer",t.onload=()=>{t.status==200||t.status==0&&t.response?n(t.response):e()},t.onerror=e,t.send(null)}function g(a,n,e){on(a,t=>{n(new Uint8Array(t))},()=>{if(e)e();else throw new Error(`Loading data file ${a} failed.`)})}async function rn(a){const n=a.map(e=>new Promise((t,r)=>{g(e.serverFilename,l=>{t({filename:e.virtualFilename,data:l})},()=>{console.error(`Error fetching file: ${e.serverFilename}`)})}));return await Promise.all(n)}async function sn(a){return await new Promise((n,e)=>{g(a+"webchuck.wasm",n,e)})}const b=()=>new an;var o;(function(a){a.LOAD_FILE="loadFile",a.RUN_CODE="runChuckCode",a.RUN_CODE_WITH_REPLACEMENT_DAC="runChuckCodeWithReplacementDac",a.REPLACE_CODE="replaceChuckCode",a.REPLACE_CODE_WITH_REPLACEMENT_DAC="replaceChuckCodeWithReplacementDac",a.REMOVE_LAST_CODE="removeLastCode",a.RUN_FILE="runChuckFile",a.RUN_FILE_WITH_REPLACEMENT_DAC="runChuckFileWithReplacementDac",a.RUN_FILE_WITH_ARGS="runChuckFileWithArgs",a.REPLACE_FILE="replaceChuckFile",a.REPLACE_FILE_WITH_REPLACEMENT_DAC="replaceChuckFileWithReplacementDac",a.REPLACE_FILE_WITH_ARGS="replaceChuckFileWithArgs",a.REMOVE_SHRED="removeShred",a.IS_SHRED_ACTIVE="isShredActive",a.SIGNAL_EVENT="signalChuckEvent",a.BROADCAST_EVENT="broadcastChuckEvent",a.LISTEN_FOR_EVENT_ONCE="listenForChuckEventOnce",a.START_LISTENING_FOR_EVENT="startListeningForChuckEvent",a.STOP_LISTENING_FOR_EVENT="stopListeningForChuckEvent",a.SET_INT="setChuckInt",a.GET_INT="getChuckInt",a.SET_FLOAT="setChuckFloat",a.GET_FLOAT="getChuckFloat",a.SET_STRING="setChuckString",a.GET_STRING="getChuckString",a.SET_INT_ARRAY="setGlobalIntArray",a.GET_INT_ARRAY="getGlobalIntArray",a.SET_INT_ARRAY_VALUE="setGlobalIntArrayValue",a.GET_INT_ARRAY_VALUE="getGlobalIntArrayValue",a.SET_ASSOCIATIVE_INT_ARRAY_VALUE="setGlobalAssociativeIntArrayValue",a.GET_ASSOCIATIVE_INT_ARRAY_VALUE="getGlobalAssociativeIntArrayValue",a.SET_FLOAT_ARRAY="setGlobalFloatArray",a.GET_FLOAT_ARRAY="getGlobalFloatArray",a.SET_FLOAT_ARRAY_VALUE="setGlobalFloatArrayValue",a.GET_FLOAT_ARRAY_VALUE="getGlobalFloatArrayValue",a.SET_ASSOCIATIVE_FLOAT_ARRAY_VALUE="setGlobalAssociativeFloatArrayValue",a.GET_ASSOCIATIVE_FLOAT_ARRAY_VALUE="getGlobalAssociativeFloatArrayValue",a.SET_PARAM_INT="setParamInt",a.GET_PARAM_INT="getParamInt",a.SET_PARAM_FLOAT="setParamFloat",a.GET_PARAM_FLOAT="getParamFloat",a.SET_PARAM_STRING="setParamString",a.GET_PARAM_STRING="getParamString",a.GET_CHUCK_NOW="getChuckNow",a.CLEAR_INSTANCE="clearChuckInstance",a.CLEAR_GLOBALS="clearGlobals"})(o||(o={}));var s;(function(a){a.INIT_DONE="initCallback",a.PRINT="console print",a.EVENT="eventCallback",a.INT="intCallback",a.FLOAT="floatCallback",a.STRING="stringCallback",a.INT_ARRAY="intArrayCallback",a.FLOAT_ARRAY="floatArrayCallback",a.NEW_SHRED="newShredCallback",a.REPLACED_SHRED="replacedShredCallback",a.REMOVED_SHRED="removedShredCallback"})(s||(s={}));class f extends window.AudioWorkletNode{constructor(n,e,t,r=2){super(e,"chuck-node",{numberOfInputs:1,numberOfOutputs:1,outputChannelCount:[r],processorOptions:{chuckID:f.chuckID,srate:e.sampleRate,preloadedFiles:n,wasm:t}}),this.deferredPromises={},this.deferredPromiseCounter=0,this.eventCallbacks={},this.eventCallbackCounter=0,this.isReady=b(),this.port.onmessage=this.receiveMessage.bind(this),this.onprocessorerror=l=>console.error(l),f.chuckID++}static async init(n,e,t=2,r="https://chuck.stanford.edu/webchuck/src/"){const l=await sn(r);let u=!1;e===void 0&&(e=new AudioContext,u=!0),e.state==="suspended"&&await e.resume(),await e.audioWorklet.addModule(r+"webchuck.js");const h=await rn(n),i=new f(h,e,l,t);return u&&i.connect(e.destination),await i.isReady.promise,i}nextDeferID(){const n=this.deferredPromiseCounter++;return this.deferredPromises[n]=b(),n}createFile(n,e,t){this.sendMessage(o.LOAD_FILE,{directory:n,filename:e,data:t})}async loadFile(n){const e=n.split("/").pop();return n.endsWith(".ck")?fetch(n).then(t=>t.text()).then(t=>{this.createFile("",e,t)}):fetch(n).then(t=>t.arrayBuffer()).then(t=>{this.createFile("",e,new Uint8Array(t))})}runCode(n){const e=this.nextDeferID();return this.sendMessage(o.RUN_CODE,{callback:e,code:n}),this.deferredPromises[e].value()}runCodeWithReplacementDac(n,e){const t=this.nextDeferID();return this.sendMessage(o.RUN_CODE_WITH_REPLACEMENT_DAC,{callback:t,code:n,dac_name:e}),this.deferredPromises[t].value()}replaceCode(n){const e=this.nextDeferID();return this.sendMessage(o.REPLACE_CODE,{callback:e,code:n}),this.deferredPromises[e].value()}replaceCodeWithReplacementDac(n,e){const t=this.nextDeferID();return this.sendMessage(o.REPLACE_CODE_WITH_REPLACEMENT_DAC,{callback:t,code:n,dac_name:e}),this.deferredPromises[t].value()}removeLastCode(){const n=this.nextDeferID();return this.sendMessage(o.REMOVE_LAST_CODE,{callback:n}),this.deferredPromises[n].value()}runFile(n){const e=this.nextDeferID();return this.sendMessage(o.RUN_FILE,{callback:e,filename:n}),this.deferredPromises[e].value()}runFileWithReplacementDac(n,e){const t=this.nextDeferID();return this.sendMessage(o.RUN_FILE_WITH_REPLACEMENT_DAC,{callback:t,dac_name:e,filename:n}),this.deferredPromises[t].value()}runFileWithArgs(n,e){const t=this.nextDeferID();return this.sendMessage(o.RUN_FILE_WITH_ARGS,{callback:t,colon_separated_args:e,filename:n}),this.deferredPromises[t].value()}runFileWithArgsWithReplacementDac(n,e,t){const r=this.nextDeferID();return this.sendMessage(o.RUN_FILE_WITH_ARGS,{callback:r,colon_separated_args:e,dac_name:t,filename:n}),this.deferredPromises[r].value()}replaceFile(n){const e=this.nextDeferID();return this.sendMessage(o.REPLACE_FILE,{callback:e,filename:n}),this.deferredPromises[e].value()}replaceFileWithReplacementDac(n,e){const t=this.nextDeferID();return this.sendMessage(o.REPLACE_FILE_WITH_REPLACEMENT_DAC,{callback:t,dac_name:e,filename:n}),this.deferredPromises[t].value()}replaceFileWithArgs(n,e){const t=this.nextDeferID();return this.sendMessage(o.REPLACE_FILE_WITH_ARGS,{callback:t,colon_separated_args:e,filename:n}),this.deferredPromises[t].value()}replaceFileWithArgsWithReplacementDac(n,e,t){const r=this.nextDeferID();return this.sendMessage(o.REPLACE_FILE_WITH_ARGS,{callback:r,colon_separated_args:e,dac_name:t,filename:n}),this.deferredPromises[r].value()}removeShred(n){const e=this.nextDeferID();return this.sendMessage(o.REMOVE_SHRED,{shred:n,callback:e}),this.deferredPromises[e].value()}isShredActive(n){const e=this.nextDeferID();return this.sendMessage(o.IS_SHRED_ACTIVE,{shred:n,callback:e}),this.deferredPromises[e].value()}signalEvent(n){this.sendMessage(o.SIGNAL_EVENT,{variable:n})}broadcastEvent(n){this.sendMessage(o.BROADCAST_EVENT,{variable:n})}listenForEventOnce(n,e){const t=this.eventCallbackCounter++;this.eventCallbacks[t]=e,this.sendMessage(o.LISTEN_FOR_EVENT_ONCE,{variable:n,callback:t})}startListeningForEvent(n,e){const t=this.eventCallbackCounter++;return this.eventCallbacks[t]=e,this.sendMessage(o.START_LISTENING_FOR_EVENT,{variable:n,callback:t}),t}stopListeningForEvent(n,e){this.sendMessage(o.STOP_LISTENING_FOR_EVENT,{variable:n,callback:e})}setInt(n,e){this.sendMessage(o.SET_INT,{variable:n,value:e})}getInt(n){const e=this.nextDeferID();return this.sendMessage(o.GET_INT,{variable:n,callback:e}),this.deferredPromises[e].value()}setFloat(n,e){this.sendMessage(o.SET_FLOAT,{variable:n,value:e})}getFloat(n){const e=this.nextDeferID();return this.sendMessage(o.GET_FLOAT,{variable:n,callback:e}),this.deferredPromises[e].value()}setString(n,e){this.sendMessage(o.SET_STRING,{variable:n,value:e})}getString(n){const e=this.nextDeferID();return this.sendMessage(o.GET_STRING,{variable:n,callback:e}),this.deferredPromises[e].value()}setIntArray(n,e){this.sendMessage(o.SET_INT_ARRAY,{variable:n,values:e})}getIntArray(n){const e=this.nextDeferID();return this.sendMessage(o.GET_INT_ARRAY,{variable:n,callback:e}),this.deferredPromises[e].value()}setIntArrayValue(n,e,t){this.sendMessage(o.SET_INT_ARRAY_VALUE,{variable:n,index:e,value:t})}getIntArrayValue(n,e){const t=this.nextDeferID();return this.sendMessage(o.GET_INT_ARRAY_VALUE,{variable:n,index:e,callback:t}),this.deferredPromises[t].value()}setAssociativeIntArrayValue(n,e,t){this.sendMessage(o.SET_ASSOCIATIVE_INT_ARRAY_VALUE,{variable:n,key:e,value:t})}getAssociativeIntArrayValue(n,e){const t=this.nextDeferID();return this.sendMessage(o.GET_ASSOCIATIVE_INT_ARRAY_VALUE,{variable:n,key:e,callback:t}),this.deferredPromises[t].value()}setFloatArray(n,e){this.sendMessage(o.SET_FLOAT_ARRAY,{variable:n,values:e})}getFloatArray(n){const e=this.nextDeferID();return this.sendMessage(o.GET_FLOAT_ARRAY,{variable:n,callback:e}),this.deferredPromises[e].value()}setFloatArrayValue(n,e,t){this.sendMessage(o.SET_FLOAT_ARRAY_VALUE,{variable:n,index:e,value:t})}getFloatArrayValue(n,e){const t=this.nextDeferID();return this.sendMessage(o.GET_FLOAT_ARRAY_VALUE,{variable:n,index:e,callback:t}),this.deferredPromises[t].value()}setAssociativeFloatArrayValue(n,e,t){this.sendMessage(o.SET_ASSOCIATIVE_FLOAT_ARRAY_VALUE,{variable:n,key:e,value:t})}getAssociativeFloatArrayValue(n,e){const t=this.nextDeferID();return this.sendMessage(o.GET_ASSOCIATIVE_FLOAT_ARRAY_VALUE,{variable:n,key:e,callback:t}),this.deferredPromises[t].value()}setParamInt(n,e){this.sendMessage(o.SET_PARAM_INT,{name:n,value:e})}getParamInt(n){const e=this.nextDeferID();return this.sendMessage(o.GET_PARAM_INT,{name:n,callback:e}),this.deferredPromises[e].value()}setParamFloat(n,e){this.sendMessage(o.SET_PARAM_FLOAT,{name:n,value:e})}getParamFloat(n){const e=this.nextDeferID();return this.sendMessage(o.GET_PARAM_FLOAT,{name:n,callback:e}),this.deferredPromises[e].value()}setParamString(n,e){this.sendMessage(o.SET_PARAM_STRING,{name:n,value:e})}getParamString(n){const e=this.nextDeferID();return this.sendMessage(o.GET_PARAM_STRING,{name:n,callback:e}),this.deferredPromises[e].value()}now(){const n=this.nextDeferID();return this.sendMessage(o.GET_CHUCK_NOW,{callback:n}),this.deferredPromises[n].value()}clearChuckInstance(){this.sendMessage(o.CLEAR_INSTANCE)}clearGlobals(){this.sendMessage(o.CLEAR_GLOBALS)}chuckPrint(n){console.log(n)}sendMessage(n,e){const t=e?{type:n,...e}:{type:n};this.port.postMessage(t)}receiveMessage(n){switch(n.data.type){case s.INIT_DONE:this.isReady&&this.isReady.resolve&&this.isReady.resolve();break;case s.PRINT:this.chuckPrint(n.data.message);break;case s.EVENT:if(n.data.callback in this.eventCallbacks){const t=this.eventCallbacks[n.data.callback];t()}break;case s.INT:case s.FLOAT:case s.STRING:case s.INT_ARRAY:case s.FLOAT_ARRAY:if(n.data.callback in this.deferredPromises){const t=this.deferredPromises[n.data.callback];t.resolve&&t.resolve(n.data.result),delete this.deferredPromises[n.data.callback]}break;case s.NEW_SHRED:if(n.data.callback in this.deferredPromises){const t=this.deferredPromises[n.data.callback];n.data.shred>0?t.resolve&&t.resolve(n.data.shred):t.reject&&t.reject("Running code failed")}break;case s.REPLACED_SHRED:if(n.data.callback in this.deferredPromises){const t=this.deferredPromises[n.data.callback];n.data.newShred>0?t.resolve&&t.resolve({newShred:n.data.newShred,oldShred:n.data.oldShred}):t.reject&&t.reject("Replacing code failed")}break;case s.REMOVED_SHRED:if(n.data.callback in this.deferredPromises){const t=this.deferredPromises[n.data.callback];n.data.shred>0?t.resolve&&t.resolve(n.data.shred):t.reject&&t.reject("Removing code failed")}break}}}f.chuckID=1;const k=a=>(x("data-v-482de376"),a=a(),C(),a),ln={class:"flex flex-col gap-2"},cn=k(()=>d("div",{class:"text-3xl"},"CHUCK ",-1)),dn=k(()=>d("div",{class:"text-sm"},"Paste any ChucK code and press Run to hear generated sound. ",-1)),fn={class:"flex flex-wrap gap-2"},hn={key:0,class:"p-2 text-green-600 dark-text-green-300"},mn={class:"flex flex-wrap gap-2"},pn=["onClick"],un={__name:"WebChuck",setup(a){const n=Object.assign({"./examples/blowhole.ck":F,"./examples/bowed.ck":P,"./examples/brass.ck":L,"./examples/chant.ck":N,"./examples/clarinet.ck":q,"./examples/flute.ck":G,"./examples/hevymetl-dance-now.ck":O,"./examples/hevymetl-trumpet-algo3.ck":V,"./examples/imp.ck":W,"./examples/lfo.ck":H,"./examples/mandolin.ck":U,"./examples/modalbar.ck":Y,"./examples/moog.ck":z,"./examples/plu.ck":j,"./examples/plu2.ck":J,"./examples/plu3.ck":B,"./examples/rhodey.ck":K,"./examples/shake-o-matic.ck":Z,"./examples/sitar.ck":$,"./examples/stif-o-karp.ck":Q,"./examples/stifkarp.ck":X,"./examples/unclap.ck":nn,"./examples/voic-o-form.ck":en,"./examples/wurley.ck":tn});function e(h){return h.match(/([^./]+)(?=\.[^.]*$|$)/)[1]}const t=A(),r=_(!1),l=_(n["./examples/brass.ck"]);w(async()=>{t.value=await f.init([]),t.value.onprocessorerror=h=>{console.warn(h)},r.value=!0});async function u(){t.value=await f.init([])}return(h,i)=>(m(),p("div",ln,[cn,dn,R(d("textarea",{class:"font-mono text-sm p-2 w-full dark-bg-dark-200 rounded-lg","onUpdate:modelValue":i[0]||(i[0]=c=>l.value=c),cols:"55",rows:"20"},null,512),[[y,l.value]]),d("div",fn,[r.value?(m(),p("div",hn,"READY")):(m(),p("div",{key:1,class:"p-2 text-orange-600 dark-text-orange-300",onClick:i[1]||(i[1]=c=>u())},"INIT")),d("button",{class:"text-button flex-1",onClick:i[2]||(i[2]=c=>t.value.runCode(l.value))},"RUN"),d("button",{class:"text-button flex-1",onClick:i[3]||(i[3]=c=>t.value.replaceCode(l.value))},"RERUN "),d("button",{class:"text-button flex-1",onClick:i[4]||(i[4]=c=>t.value.removeLastCode())},"STOP")]),d("div",mn,[(m(!0),p(T,null,M(S(n),(c,v)=>(m(),p("div",{class:I(["p-2 border-1 rounded-lg border-dark-200 cursor-pointer",{active:c==l.value}]),key:c,onClick:_n=>l.value=c},D(e(v)),11,pn))),128))])]))}},gn=E(un,[["__scopeId","data-v-482de376"]]);export{gn as default};