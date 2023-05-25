// patch
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
