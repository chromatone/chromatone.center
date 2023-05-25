// STK ModalBar

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
