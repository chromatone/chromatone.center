import{aD as s}from"./chunks/theme.DvVY4vau.js";import{_ as n,g as i,h as t,au as a,R as r,Q as l,f as h}from"./chunks/framework.BX1Y-ISu.js";const w=JSON.parse('{"title":"Study of scales","description":"The principles for analyzing different combinations of notes","frontmatter":{"title":"Study of scales","description":"The principles for analyzing different combinations of notes","date":"2021-09-30T00:00:00.000Z"},"headers":[],"relativePath":"theory/scales/study/index.md","filePath":"theory/scales/study/index.md","lastUpdated":1725520089000}'),d={name:"theory/scales/study/index.md"};function c(u,e,m,p,f,y){const o=s;return h(),i("div",null,[e[0]||(e[0]=t("blockquote",null,[t("p",null,[a("This original text is from "),t("a",{href:"https://ianring.com/musictheory/scales/",target:"_blank",rel:"noreferrer"},"The Exciting Universe Of Music Theory by Ian Ring")])],-1)),e[1]||(e[1]=t("p",null,"There is no rule stating how many notes a scale must include. The most common scales in Western music contain seven pitches and are thus called “heptatonic” (meaning “seven tones”). Other scales have fewer notes—five-note “pentatonic” scales are quite common in popular music. There’s even a scale that uses all 12 pitches: it’s called the “chromatic” scale.",-1)),e[2]||(e[2]=t("p",null,'What we have in the 12-tone system is a binary "word" made of 12 bits. We can assign one bit to each degree of the chromatic scale, and use the power of binary arithmetic and logic to do some pretty awesome analysis with them. When represented as bits it reads from right to left - the lowest bit is the root, and each bit going from right to left ascends by one semitone.',-1)),e[3]||(e[3]=t("p",null,'The total number of possible combinations of on and off bits is called the "power set". The number of sets in a power set of size n is (2^n). Using a word of 12 bits, the power set (2^12) is equal to 4096. The fun thing about binary power sets is that we can produce every possible combination, by merely invoking the integers from 0 (no tones) to 4095 (all 12 tones).',-1)),e[4]||(e[4]=t("p",null,`This means that every possible combination of tones in the 12-tone set can be represented by a number between 0 and 4095. We don't need to remember the fancy names like "phrygian", we can just call it scale number 1451. Convenient!`,-1)),e[5]||(e[5]=t("blockquote",null,[t("p",null,[a(`An important concept here is that any set of tones can be represented by a number. This number is not "ordinal" - it's not merely describing the position of the set in an indexed scheme; it's also not "cardinal" because it's not describing an amount of something. This is a nominal number because the number `),t("em",null,"is"),a(" the scale. You can do binary arithmetic with it, and you are adding and subtracting scales with no need to convert the scale into some other representation.")])],-1)),r(o,{video:"Vq2xt2D3e3E"}),e[6]||(e[6]=l('<h2 id="interval-pattern" tabindex="-1">Interval Pattern <a class="header-anchor" href="#interval-pattern" aria-label="Permalink to &quot;Interval Pattern&quot;">​</a></h2><p>Another popular way of representing a scale is by its interval pattern. When I was learning the major scale, I was taught to say aloud: &quot;tone, tone, semitone, tone, tone, tone, semitone&quot;. Many music theorists like to represent a scale this way because it&#39;s accurate and easy to understand: &quot;TTSTTTS&quot;. Having a scale&#39;s interval pattern has merit as an intermediary step can make some kinds of analysis simpler. Expressed numerically - which is more convenient for computation - the major scale is [2,2,1,2,2,2,1].</p><h2 id="pitch-class-sets" tabindex="-1">Pitch Class Sets <a class="header-anchor" href="#pitch-class-sets" aria-label="Permalink to &quot;Pitch Class Sets&quot;">​</a></h2><p>Yet another way to represent a scale is as a &quot;pitch class set&quot;, where the tones are assigned numbers 0 to 11 (sometimes using &quot;T&quot; and &quot;E&quot; for 10 and 11), and the set enumerates the ones present in the scale. A pitch class set for the major scale is notated like this: {0,2,4,5,7,9,11}. The &quot;scales&quot; we&#39;ll study here are a subset of Pitch Classes (ie those that have a root, and obey Zeitler&#39;s Rules) and we can use many of the same mathematical tricks to manipulate them.</p><h2 id="what-is-a-scale" tabindex="-1">What is a scale? <a class="header-anchor" href="#what-is-a-scale" aria-label="Permalink to &quot;What is a scale?&quot;">​</a></h2><p>Or more importantly, what is <em>not</em> a scale?</p><p>Now that we have the superset of all possible sets of tones, we can whittle it down to exclude ones that we don&#39;t consider to be a legitimate &quot;scale&quot;. We can do this with just two rules.</p><h3 id="a-scale-starts-on-the-root-tone" tabindex="-1">A scale starts on the root tone. <a class="header-anchor" href="#a-scale-starts-on-the-root-tone" aria-label="Permalink to &quot;A scale starts on the root tone.&quot;">​</a></h3><p>This means any set of notes that doesn&#39;t have that first bit turned on is not eligible to be called a scale. This cuts our power set in exactly half, leaving 2048 sets.</p><p>In binary, it&#39;s easy to see that the first bit is on or off. In decimal, you can easily tell this by whether the number is odd or even. All even numbers have the first bit off; therefore all scales are represented by an odd number.</p><p>We could have cut some corners in our discussion of scales by omitting the root tone (always assumed to be on) to work with 11 bits instead of 12, but there are compelling reasons for keeping the 12-bit number for our scales, such as simplifying the analysis of symmetry, simplifying the calculation of modes, and performing analysis of sonorities that do not include the root, where an even number is appropriate.</p><p>Scales remaining: <strong>2048</strong></p><h3 id="a-scale-does-not-have-any-leaps-greater-than-n-semitones" tabindex="-1">A scale does not have any leaps greater than n semitones. <a class="header-anchor" href="#a-scale-does-not-have-any-leaps-greater-than-n-semitones" aria-label="Permalink to &quot;A scale does not have any leaps greater than n semitones.&quot;">​</a></h3><p>For the purposes of this exercise we are saying n = 4, a.k.a. a major third. Any collection of tones that has an interval greater than a major third is not considered a &quot;scale&quot;. This configuration is consistent with Zeitler&#39;s constant used to generate his comprehensive list of scales.</p><p>Scales remaining: <strong>1490</strong></p><p>Now that we&#39;ve whittled our set of tones to only the ones we&#39;d call a &quot;scale&quot;, let&#39;s count how many there are with each number of tones.</p><table tabindex="0"><thead><tr><th style="text-align:left;">number of tones</th><th style="text-align:left;">how many scales</th></tr></thead><tbody><tr><td style="text-align:left;">1</td><td style="text-align:left;">0</td></tr><tr><td style="text-align:left;">2</td><td style="text-align:left;">0</td></tr><tr><td style="text-align:left;">3</td><td style="text-align:left;">1</td></tr><tr><td style="text-align:left;">4</td><td style="text-align:left;">31</td></tr><tr><td style="text-align:left;">5</td><td style="text-align:left;">155</td></tr><tr><td style="text-align:left;">6</td><td style="text-align:left;">336</td></tr><tr><td style="text-align:left;">7</td><td style="text-align:left;">413</td></tr><tr><td style="text-align:left;">8</td><td style="text-align:left;">322</td></tr><tr><td style="text-align:left;">9</td><td style="text-align:left;">165</td></tr><tr><td style="text-align:left;">10</td><td style="text-align:left;">55</td></tr><tr><td style="text-align:left;">11</td><td style="text-align:left;">11</td></tr><tr><td style="text-align:left;">12</td><td style="text-align:left;">1</td></tr></tbody></table><h2 id="modes" tabindex="-1">Modes <a class="header-anchor" href="#modes" aria-label="Permalink to &quot;Modes&quot;">​</a></h2><p>There is a lot of confusion about what is a &quot;mode&quot;, chiefly because the word is used slightly differently in various contexts.</p><p>When we say &quot;C major&quot;, the word &quot;major&quot; refers to a specific pattern of whole- and half-steps. The &quot;C&quot; tells us to begin that pattern on the root tone of &quot;C&quot;.</p><p>Modes are created when you use the same patterns of whole- and half-steps, but you begin on a different step. For instance, the &quot;D Dorian&quot; mode uses all the same notes as C major (the white keys on a piano), but it begins with D. Compared with the Major (also known as &quot;Ionian&quot; mode), the Dorian sounds different, because relative to the root note D, it has a minor third and a minor seventh.</p><p>The best way to understand modes is to think of a toy piano where the black keys are just painted on - all you have are the white keys: C D E F G A B. Can you play a song that sounds like it&#39;s in a minor key? You can&#39;t play a song in C minor, because that would require three flats. So instead you play the song with A as the root (A B C D E F G). That scale is a mode of the major scale, called the Aeolian Mode.</p><p>When you play that minor scale, you&#39;re not playing &quot;C minor&quot;, you&#39;re playing the relative minor of C, which is &quot;A minor&quot;. Modes are relatives of each other if they have the same pattern of steps, starting on different steps.</p><p>To compute a mode of the current scale, we &quot;rotate&quot; all the notes down one semitone. Then if the rotated notes have an on bit in the root, then it is a mode of the original scale. It&#39;s as if you take the bracelet diagram that we&#39;ve been using throughout this study, and twist it like a dial so that a different note is at the top, in the root position.</p><ul><li>101010110101 = 2741 - major scale, &quot;ionian&quot; mode</li><li>110101011010 = 3418 - rotated down 1 semitone - not a scale</li><li>011010101101 = 1709 - rotated down 2 semitones - &quot;dorian&quot;</li><li>101101010110 = 2902 - rotated down 3 semitones - not a scale</li><li>010110101011 = 1451 - rotated down 4 semitones - &quot;phrygian&quot;</li><li>101011010101 = 2773 - rotated down 5 semitones - &quot;lydian&quot;</li><li>110101101010 = 3434 - rotated down 6 semitones - not a scale</li><li>011010110101 = 1717 - rotated down 7 semitones - &quot;mixolydian&quot;</li><li>101101011010 = 2906 - rotated down 8 semitones - not a scale</li><li>010110101101 = 1453 - rotated down 9 semitones - &quot;aeolian&quot;</li><li>101011010110 = 2774 - rotated down 10 semitones - not a scale</li><li>010101101011 = 1387 - rotated down 11 semitones - &quot;locrian&quot;</li></ul><p>When we do this to every scale, we see modal relationships between scales, and we also discover symmetries when a scale is a mode of itself on another degree.</p><h2 id="imperfection" tabindex="-1">Imperfection <a class="header-anchor" href="#imperfection" aria-label="Permalink to &quot;Imperfection&quot;">​</a></h2><p>Imperfection is a concept invented (so far as I can tell) by William Zeitler, to describe the presence or absense of perfect fifths in the scale tones. Any tone in the scale that does not have the perfect fifth above it represented in the scale is an &quot;imperfect&quot; tone. The number of imperfections is a metric that plausibly correlates with the perception of dissonance in a sonority.</p><p>The only scale that has no imperfections is the 12-tone chromatic scale.</p><p><a href="https://ianring.com/musictheory/scales/" target="_blank" rel="noreferrer">https://ianring.com/musictheory/scales/</a></p>',30))])}const q=n(d,[["render",c]]);export{w as __pageData,q as default};