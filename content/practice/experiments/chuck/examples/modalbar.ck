// STK ModalBar

// patch
ModalBar bar  => JCRev r => dac;

.9 => r.gain;
.02 => r.mix;

// scale
[0, 2, 5, 7, 8, 11] @=> int scale[];

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
    Math.random2f( .5, .9 ) => bar.directGain;
    Math.random2f( .5, .9 ) => bar.masterGain;

    // print
    <<< "---", "" >>>;
    <<< "preset:", bar.preset() >>>;

    // set freq
	scale[Math.random2(0,scale.size()-1)] => int winner;
    33 + Math.random2(0,1)*12 + winner => Std.mtof => bar.freq;
    // go
    Math.random2f(0.3,0.8) => bar.noteOn;

    // advance time
   Math.random2(1,4)*.125::second => now;
}
