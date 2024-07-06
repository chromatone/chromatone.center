// STK Mandolin

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
