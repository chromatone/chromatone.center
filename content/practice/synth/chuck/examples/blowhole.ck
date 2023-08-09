// patch
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
