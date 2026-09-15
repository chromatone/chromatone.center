import{r as e}from"./rolldown-runtime.C0FnF6B9.js";import{A as t,At as n,E as r,F as i,M as a,Pt as o,St as s,Tt as c,Z as ee,et as l,ft as te,jt as ne,n as u,rt as d}from"./framework.Bs4wm_X5.js";var f=e({default:()=>p}),p=`// patch
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
`,re=e({default:()=>m}),m=`// patch
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
`,ie=e({default:()=>h}),h=`// patch
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
`,ae=e({default:()=>g}),g=`//--------------------------------------------------------------------
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
`,_=e({default:()=>v}),v=`// STK Clarinet
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
`,y=e({default:()=>b}),b=`// STK Flute

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
`,x=e({default:()=>S}),S=`//-----------------------------------------------------------------------------
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
`,C=e({default:()=>w}),w=`// name: hevymetl-trumpet-algo3.ck
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
`,T=e({default:()=>E}),E=`// impulse generator is cool...
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
`,D=e({default:()=>O}),O=`// low-frequency oscillator

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
`,k=e({default:()=>A}),A=`// STK Mandolin

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
`,j=e({default:()=>M}),M=`// STK ModalBar

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
`,N=e({default:()=>P}),P=`// STK ModalBar

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
`,F=e({default:()=>I}),I=`// karplus + strong plucked string filter
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
`,L=e({default:()=>R}),R=`// plucked string filter, different excitation
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
`,z=e({default:()=>B}),B=`// tuned plucked string filter
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
`,V=e({default:()=>H}),H=`// more music for replicants

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
`,U=e({default:()=>oe}),oe=`//---------------|
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
`,W=e({default:()=>G}),G=`// patch
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
`,K=e({default:()=>q}),q=`//---------------|
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
`,se=e({default:()=>ce}),ce=`// STK StifKarp

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
`,le=e({default:()=>ue}),ue=`// name: unclap.ck
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
`,de=e({default:()=>fe}),fe=`// music for replicants

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
`,pe=e({default:()=>me}),me=`// even more music for replicants

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
`,he=class{constructor(){this.resolve=void 0,this.reject=void 0,this.promise=new Promise((e,t)=>{this.resolve=e,this.reject=t})}async value(){return await this.promise}};function ge(e,t,n){let r=new XMLHttpRequest;r.open(`GET`,e,!0),r.responseType=`arraybuffer`,r.onload=()=>{r.status==200||r.status==0&&r.response?t(r.response):n()},r.onerror=n,r.send(null)}function J(e,t,n){ge(e,e=>{t(new Uint8Array(e))},()=>{if(n)n();else throw Error(`Loading data file ${e} failed.`)})}async function _e(e){let t=e.map(e=>new Promise((t,n)=>{J(e.serverFilename,n=>{t({filename:e.virtualFilename,data:n})},()=>{console.error(`Error fetching file: ${e.serverFilename}`)})}));return await Promise.all(t)}async function ve(e){return new Promise((t,n)=>{J(e+`webchuck.wasm`,t,n)})}var ye=[`ck`,`txt`,`csv`,`json`,`xml`,`html`,`js`];function be(e){let t=e.split(`.`).pop();return ye.includes(t)}var Y=()=>new he,X;(function(e){e.CREATE_FILE=`createFile`,e.CREATE_DIRECTORY=`createDirectory`,e.RUN_CODE=`runChuckCode`,e.RUN_CODE_WITH_REPLACEMENT_DAC=`runChuckCodeWithReplacementDac`,e.REPLACE_CODE=`replaceChuckCode`,e.REPLACE_CODE_WITH_REPLACEMENT_DAC=`replaceChuckCodeWithReplacementDac`,e.REMOVE_LAST_CODE=`removeLastCode`,e.RUN_FILE=`runChuckFile`,e.RUN_FILE_WITH_REPLACEMENT_DAC=`runChuckFileWithReplacementDac`,e.RUN_FILE_WITH_ARGS=`runChuckFileWithArgs`,e.REPLACE_FILE=`replaceChuckFile`,e.REPLACE_FILE_WITH_REPLACEMENT_DAC=`replaceChuckFileWithReplacementDac`,e.REPLACE_FILE_WITH_ARGS=`replaceChuckFileWithArgs`,e.REMOVE_SHRED=`removeShred`,e.IS_SHRED_ACTIVE=`isShredActive`,e.SIGNAL_EVENT=`signalChuckEvent`,e.BROADCAST_EVENT=`broadcastChuckEvent`,e.LISTEN_FOR_EVENT_ONCE=`listenForChuckEventOnce`,e.START_LISTENING_FOR_EVENT=`startListeningForChuckEvent`,e.STOP_LISTENING_FOR_EVENT=`stopListeningForChuckEvent`,e.SET_INT=`setChuckInt`,e.GET_INT=`getChuckInt`,e.SET_FLOAT=`setChuckFloat`,e.GET_FLOAT=`getChuckFloat`,e.SET_STRING=`setChuckString`,e.GET_STRING=`getChuckString`,e.SET_INT_ARRAY=`setGlobalIntArray`,e.GET_INT_ARRAY=`getGlobalIntArray`,e.SET_INT_ARRAY_VALUE=`setGlobalIntArrayValue`,e.GET_INT_ARRAY_VALUE=`getGlobalIntArrayValue`,e.SET_ASSOCIATIVE_INT_ARRAY_VALUE=`setGlobalAssociativeIntArrayValue`,e.GET_ASSOCIATIVE_INT_ARRAY_VALUE=`getGlobalAssociativeIntArrayValue`,e.SET_FLOAT_ARRAY=`setGlobalFloatArray`,e.GET_FLOAT_ARRAY=`getGlobalFloatArray`,e.SET_FLOAT_ARRAY_VALUE=`setGlobalFloatArrayValue`,e.GET_FLOAT_ARRAY_VALUE=`getGlobalFloatArrayValue`,e.SET_ASSOCIATIVE_FLOAT_ARRAY_VALUE=`setGlobalAssociativeFloatArrayValue`,e.GET_ASSOCIATIVE_FLOAT_ARRAY_VALUE=`getGlobalAssociativeFloatArrayValue`,e.SET_PARAM_INT=`setParamInt`,e.GET_PARAM_INT=`getParamInt`,e.SET_PARAM_FLOAT=`setParamFloat`,e.GET_PARAM_FLOAT=`getParamFloat`,e.SET_PARAM_STRING=`setParamString`,e.GET_PARAM_STRING=`getParamString`,e.GET_CHUCK_NOW=`getChuckNow`,e.CLEAR_INSTANCE=`clearChuckInstance`,e.CLEAR_GLOBALS=`clearGlobals`})(X||={});var Z;(function(e){e.INIT_DONE=`initCallback`,e.PRINT=`console print`,e.EVENT=`eventCallback`,e.INT=`intCallback`,e.FLOAT=`floatCallback`,e.STRING=`stringCallback`,e.INT_ARRAY=`intArrayCallback`,e.FLOAT_ARRAY=`floatArrayCallback`,e.NEW_SHRED=`newShredCallback`,e.REPLACED_SHRED=`replacedShredCallback`,e.REMOVED_SHRED=`removedShredCallback`})(Z||={});var Q=class e extends window.AudioWorkletNode{constructor(t,n,r,i=2){super(n,`chuck-node`,{numberOfInputs:1,numberOfOutputs:1,outputChannelCount:[i],processorOptions:{chuckID:e.chuckID,srate:n.sampleRate,preloadedFiles:t,wasm:r}}),this.deferredPromises={},this.deferredPromiseCounter=0,this.eventCallbacks={},this.eventCallbackCounter=0,this.isReady=Y(),this.chugins=[],this.port.onmessage=this.receiveMessage.bind(this),this.onprocessorerror=e=>console.error(e),e.chuckID++}static async init(t,n,r=2,i=`https://chuck.stanford.edu/webchuck/src/`){let a=!1;n===void 0&&(n=new AudioContext,a=!0),t=t.concat(e.chuginsToLoad);let o,s;try{let e=await Promise.all([ve(i),n.audioWorklet.addModule(i+`webchuck.js`),_e(t)]);o=e[0],s=e[2]}catch(e){throw e}let c=new e(s,n,o,r);return c.chugins=e.chuginsToLoad.map(e=>e.virtualFilename.split(`/`).pop()),e.chuginsToLoad=[],a&&c.connect(n.destination),n.destination.channelCount=r,await c.isReady.promise,c}nextDeferID(){let e=this.deferredPromiseCounter++;return this.deferredPromises[e]=Y(),e}createFile(e,t,n){this.sendMessage(X.CREATE_FILE,{directory:e,filename:t,data:n})}createDirectory(e,t){this.sendMessage(X.CREATE_DIRECTORY,{parent:e,name:t})}async loadFile(e){let t=e.split(`/`).pop(),n=be(t);return fetch(e).then(e=>n?e.text():e.arrayBuffer()).then(e=>{n?this.createFile(``,t,e):this.createFile(``,t,new Uint8Array(e))}).catch(e=>{throw Error(e)})}static loadChugin(t){e.chuginsToLoad.push({serverFilename:t,virtualFilename:`/chugins/`+t.split(`/`).pop()})}loadedChugins(){return this.chugins}runCode(e){let t=this.nextDeferID();return this.sendMessage(X.RUN_CODE,{callback:t,code:e}),this.deferredPromises[t].value()}runCodeWithReplacementDac(e,t){let n=this.nextDeferID();return this.sendMessage(X.RUN_CODE_WITH_REPLACEMENT_DAC,{callback:n,code:e,dac_name:t}),this.deferredPromises[n].value()}replaceCode(e){let t=this.nextDeferID();return this.sendMessage(X.REPLACE_CODE,{callback:t,code:e}),this.deferredPromises[t].value()}replaceCodeWithReplacementDac(e,t){let n=this.nextDeferID();return this.sendMessage(X.REPLACE_CODE_WITH_REPLACEMENT_DAC,{callback:n,code:e,dac_name:t}),this.deferredPromises[n].value()}removeLastCode(){let e=this.nextDeferID();return this.sendMessage(X.REMOVE_LAST_CODE,{callback:e}),this.deferredPromises[e].value()}runFile(e){let t=this.nextDeferID();return this.sendMessage(X.RUN_FILE,{callback:t,filename:e}),this.deferredPromises[t].value()}runFileWithReplacementDac(e,t){let n=this.nextDeferID();return this.sendMessage(X.RUN_FILE_WITH_REPLACEMENT_DAC,{callback:n,dac_name:t,filename:e}),this.deferredPromises[n].value()}runFileWithArgs(e,t){let n=this.nextDeferID();return this.sendMessage(X.RUN_FILE_WITH_ARGS,{callback:n,colon_separated_args:t,filename:e}),this.deferredPromises[n].value()}runFileWithArgsWithReplacementDac(e,t,n){let r=this.nextDeferID();return this.sendMessage(X.RUN_FILE_WITH_ARGS,{callback:r,colon_separated_args:t,dac_name:n,filename:e}),this.deferredPromises[r].value()}replaceFile(e){let t=this.nextDeferID();return this.sendMessage(X.REPLACE_FILE,{callback:t,filename:e}),this.deferredPromises[t].value()}replaceFileWithReplacementDac(e,t){let n=this.nextDeferID();return this.sendMessage(X.REPLACE_FILE_WITH_REPLACEMENT_DAC,{callback:n,dac_name:t,filename:e}),this.deferredPromises[n].value()}replaceFileWithArgs(e,t){let n=this.nextDeferID();return this.sendMessage(X.REPLACE_FILE_WITH_ARGS,{callback:n,colon_separated_args:t,filename:e}),this.deferredPromises[n].value()}replaceFileWithArgsWithReplacementDac(e,t,n){let r=this.nextDeferID();return this.sendMessage(X.REPLACE_FILE_WITH_ARGS,{callback:r,colon_separated_args:t,dac_name:n,filename:e}),this.deferredPromises[r].value()}removeShred(e){let t=this.nextDeferID();return this.sendMessage(X.REMOVE_SHRED,{shred:e,callback:t}),this.deferredPromises[t].value()}isShredActive(e){let t=this.nextDeferID();return this.sendMessage(X.IS_SHRED_ACTIVE,{shred:e,callback:t}),this.deferredPromises[t].value()}signalEvent(e){this.sendMessage(X.SIGNAL_EVENT,{variable:e})}broadcastEvent(e){this.sendMessage(X.BROADCAST_EVENT,{variable:e})}listenForEventOnce(e,t){let n=this.eventCallbackCounter++;this.eventCallbacks[n]=t,this.sendMessage(X.LISTEN_FOR_EVENT_ONCE,{variable:e,callback:n})}startListeningForEvent(e,t){let n=this.eventCallbackCounter++;return this.eventCallbacks[n]=t,this.sendMessage(X.START_LISTENING_FOR_EVENT,{variable:e,callback:n}),n}stopListeningForEvent(e,t){this.sendMessage(X.STOP_LISTENING_FOR_EVENT,{variable:e,callback:t})}setInt(e,t){this.sendMessage(X.SET_INT,{variable:e,value:t})}getInt(e){let t=this.nextDeferID();return this.sendMessage(X.GET_INT,{variable:e,callback:t}),this.deferredPromises[t].value()}setFloat(e,t){this.sendMessage(X.SET_FLOAT,{variable:e,value:t})}getFloat(e){let t=this.nextDeferID();return this.sendMessage(X.GET_FLOAT,{variable:e,callback:t}),this.deferredPromises[t].value()}setString(e,t){this.sendMessage(X.SET_STRING,{variable:e,value:t})}getString(e){let t=this.nextDeferID();return this.sendMessage(X.GET_STRING,{variable:e,callback:t}),this.deferredPromises[t].value()}setIntArray(e,t){this.sendMessage(X.SET_INT_ARRAY,{variable:e,values:t})}getIntArray(e){let t=this.nextDeferID();return this.sendMessage(X.GET_INT_ARRAY,{variable:e,callback:t}),this.deferredPromises[t].value()}setIntArrayValue(e,t,n){this.sendMessage(X.SET_INT_ARRAY_VALUE,{variable:e,index:t,value:n})}getIntArrayValue(e,t){let n=this.nextDeferID();return this.sendMessage(X.GET_INT_ARRAY_VALUE,{variable:e,index:t,callback:n}),this.deferredPromises[n].value()}setAssociativeIntArrayValue(e,t,n){this.sendMessage(X.SET_ASSOCIATIVE_INT_ARRAY_VALUE,{variable:e,key:t,value:n})}getAssociativeIntArrayValue(e,t){let n=this.nextDeferID();return this.sendMessage(X.GET_ASSOCIATIVE_INT_ARRAY_VALUE,{variable:e,key:t,callback:n}),this.deferredPromises[n].value()}setFloatArray(e,t){this.sendMessage(X.SET_FLOAT_ARRAY,{variable:e,values:t})}getFloatArray(e){let t=this.nextDeferID();return this.sendMessage(X.GET_FLOAT_ARRAY,{variable:e,callback:t}),this.deferredPromises[t].value()}setFloatArrayValue(e,t,n){this.sendMessage(X.SET_FLOAT_ARRAY_VALUE,{variable:e,index:t,value:n})}getFloatArrayValue(e,t){let n=this.nextDeferID();return this.sendMessage(X.GET_FLOAT_ARRAY_VALUE,{variable:e,index:t,callback:n}),this.deferredPromises[n].value()}setAssociativeFloatArrayValue(e,t,n){this.sendMessage(X.SET_ASSOCIATIVE_FLOAT_ARRAY_VALUE,{variable:e,key:t,value:n})}getAssociativeFloatArrayValue(e,t){let n=this.nextDeferID();return this.sendMessage(X.GET_ASSOCIATIVE_FLOAT_ARRAY_VALUE,{variable:e,key:t,callback:n}),this.deferredPromises[n].value()}setParamInt(e,t){this.sendMessage(X.SET_PARAM_INT,{name:e,value:t})}getParamInt(e){let t=this.nextDeferID();return this.sendMessage(X.GET_PARAM_INT,{name:e,callback:t}),this.deferredPromises[t].value()}setParamFloat(e,t){this.sendMessage(X.SET_PARAM_FLOAT,{name:e,value:t})}getParamFloat(e){let t=this.nextDeferID();return this.sendMessage(X.GET_PARAM_FLOAT,{name:e,callback:t}),this.deferredPromises[t].value()}setParamString(e,t){this.sendMessage(X.SET_PARAM_STRING,{name:e,value:t})}getParamString(e){let t=this.nextDeferID();return this.sendMessage(X.GET_PARAM_STRING,{name:e,callback:t}),this.deferredPromises[t].value()}now(){let e=this.nextDeferID();return this.sendMessage(X.GET_CHUCK_NOW,{callback:e}),this.deferredPromises[e].value()}clearChuckInstance(){this.sendMessage(X.CLEAR_INSTANCE)}clearGlobals(){this.sendMessage(X.CLEAR_GLOBALS)}chuckPrint(e){console.log(e)}sendMessage(e,t){let n=t?{type:e,...t}:{type:e};this.port.postMessage(n)}receiveMessage(e){switch(e.data.type){case Z.INIT_DONE:this.isReady&&this.isReady.resolve&&this.isReady.resolve();break;case Z.PRINT:this.chuckPrint(e.data.message);break;case Z.EVENT:if(e.data.callback in this.eventCallbacks){let t=this.eventCallbacks[e.data.callback];t()}break;case Z.INT:case Z.FLOAT:case Z.STRING:case Z.INT_ARRAY:case Z.FLOAT_ARRAY:if(e.data.callback in this.deferredPromises){let t=this.deferredPromises[e.data.callback];t.resolve&&t.resolve(e.data.result),delete this.deferredPromises[e.data.callback]}break;case Z.NEW_SHRED:if(e.data.callback in this.deferredPromises){let t=this.deferredPromises[e.data.callback];e.data.shred>0?t.resolve&&t.resolve(e.data.shred):t.reject&&t.reject(`Running code failed`)}break;case Z.REPLACED_SHRED:if(e.data.callback in this.deferredPromises){let t=this.deferredPromises[e.data.callback];e.data.newShred>0?t.resolve&&t.resolve({newShred:e.data.newShred,oldShred:e.data.oldShred}):t.reject&&t.reject(`Replacing code failed`)}break;case Z.REMOVED_SHRED:if(e.data.callback in this.deferredPromises){let t=this.deferredPromises[e.data.callback];e.data.shred>0?t.resolve&&t.resolve(e.data.shred):t.reject&&t.reject(`Removing code failed`)}}}};Q.chuckID=1,Q.chuginsToLoad=[];var xe;(function(e){e[e.BUTTON_DOWN=1]=`BUTTON_DOWN`,e[e.BUTTON_UP=2]=`BUTTON_UP`,e[e.MOUSE_MOTION=5]=`MOUSE_MOTION`,e[e.WHEEL_MOTION=6]=`WHEEL_MOTION`})(xe||={});var Se={class:`flex flex-col gap-2 p-4`},Ce={class:`flex flex-wrap gap-2`},$={key:0,class:`p-2 text-green-600 dark-text-green-300`},we={class:`flex flex-wrap gap-2`},Te=[`onClick`],Ee=u({__name:`SynthChuck`,setup(e){let u=Object.assign({"./examples/blowhole.ck":f,"./examples/bowed.ck":re,"./examples/brass.ck":ie,"./examples/chant.ck":ae,"./examples/clarinet.ck":_,"./examples/flute.ck":y,"./examples/hevymetl-dance-now.ck":x,"./examples/hevymetl-trumpet-algo3.ck":C,"./examples/imp.ck":T,"./examples/lfo.ck":D,"./examples/mandolin.ck":k,"./examples/modalbar.ck":j,"./examples/moog.ck":N,"./examples/plu.ck":F,"./examples/plu2.ck":L,"./examples/plu3.ck":z,"./examples/rhodey.ck":V,"./examples/shake-o-matic.ck":U,"./examples/sitar.ck":W,"./examples/stif-o-karp.ck":K,"./examples/stifkarp.ck":se,"./examples/unclap.ck":le,"./examples/voic-o-form.ck":de,"./examples/wurley.ck":pe});function p(e){return e.match(/([^./]+)(?=\.[^.]*$|$)/)[1]}let m=c(),h=s(!1),g=s(u[`./examples/brass.ck`]?.default);ee(async()=>{await v(),m.value.onprocessorerror=e=>{console.warn(e)},h.value=!0});async function v(){m.value=await Q.init([])}return(e,s)=>(l(),i(`div`,Se,[s[5]||=a(`div`,{class:`text-3xl`},`CHUCK `,-1),s[6]||=a(`div`,{class:`text-sm`},`Paste any ChucK code and press Run to hear generated sound. `,-1),te(a(`textarea`,{class:`font-mono text-sm p-2 w-full dark-bg-dark-200 rounded-lg`,"onUpdate:modelValue":s[0]||=e=>g.value=e,cols:`55`,rows:`20`},null,512),[[r,g.value]]),a(`div`,Ce,[h.value?(l(),i(`div`,$,`READY`)):(l(),i(`div`,{key:1,class:`p-2 text-orange-600 dark-text-orange-300`,onClick:s[1]||=e=>v()},`INIT`)),a(`button`,{class:`text-button flex-1`,onClick:s[2]||=e=>m.value.runCode(g.value)},`RUN`),a(`button`,{class:`text-button flex-1`,onClick:s[3]||=e=>m.value.replaceCode(g.value)},`RERUN `),a(`button`,{class:`text-button flex-1`,onClick:s[4]||=e=>m.value.removeLastCode()},`STOP`)]),a(`div`,we,[(l(!0),i(t,null,d(n(u),(e,t)=>(l(),i(`div`,{class:ne([`p-2 border-1 rounded-lg border-dark-200 cursor-pointer`,{active:e?.default==g.value}]),key:e,onClick:t=>g.value=e?.default},o(p(t)),11,Te))),128))])]))}},[[`__scopeId`,`data-v-9d0b83bc`]]);export{Ee as default};