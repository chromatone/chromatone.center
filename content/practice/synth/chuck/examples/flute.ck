// STK Flute

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
