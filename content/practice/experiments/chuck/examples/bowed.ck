// patch
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
