<script setup></script>

<template lang="pug">
g
  g#rects
    rect(
      y="0", 
      style="opacity:0.85;fill:#333333;enable-background:new;", 
      width="1000", 
      height="1000")
    path(
      style="fill:#666F9B;", d="M34.4,3.6h167.9c10.7,0,19.3,9.1,19.3,20.2v104c0,11.2-8.7,20.2-19.3,20.2H34.4		c-10.7,0-19.3-9.1-19.3-20.2v-104C15,12.7,23.7,3.6,34.4,3.6z")
    path(style="fill:#AAD037;", d="M446,9.7h101.7c8.7,0,15.7,6.1,15.7,13.7v31.6c0,7.5-7,13.7-15.7,13.7H446		c-8.7,0-15.7-6.1-15.7-13.7V23.3C430.3,15.8,437.3,9.7,446,9.7z")
    path(style="fill:#AAD037;", d="M446,208.3h101.7c8.7,0,15.7,6.1,15.7,13.7v31.6c0,7.5-7,13.7-15.7,13.7H446		c-8.7,0-15.7-6.1-15.7-13.7V222C430.3,214.4,437.3,208.3,446,208.3z")
    path(style="fill:#9AA4D3;", d="M23.5,901.3H260c11.6,0,21,7.4,21,16.5v62.1c0,9.1-9.4,16.5-21,16.5H23.5c-11.6,0-21-7.4-21-16.5		v-62.1C2.5,908.7,11.9,901.3,23.5,901.3z")
    path(style="fill:#027F92;", d="M754.4,890.1h225.8c11,0,20,7.7,20,17.2V972c0,9.5-9,17.2-20,17.2H754.4c-11,0-20-7.7-20-17.2v-64.7		C734.4,897.8,743.4,890.1,754.4,890.1z")
    path(style="fill:#88C6E2;", d="M975.8,210h-61.7c-7.8,0-14.2-6.4-14.2-14.2V25.2c0-7.8,6.4-14.2,14.2-14.2h61.7		c7.8,0,14.2,6.4,14.2,14.2v170.7C990,203.6,983.6,210,975.8,210z")

    rect(x="900" y="790" width="90" height="90" rx="20" fill="#037755")
    rect(x="10" y="150" width="110" height="60" rx="20" fill="#039955ee")

    path(style="fill-rule:evenodd;clip-rule:evenodd;fill:#60CCF2;", d="M563.6,563.6c35.1-35.1,35.1-92.1,0-127.3l-31.8,31.8			c17.6,17.6,17.6,46.1,0,63.6L563.6,563.6z")
    path(style="fill-rule:evenodd;clip-rule:evenodd;fill:#0A92CF;", d="M436.4,436.4c-35.1,35.1-35.1,92.1,0,127.3l31.8-31.8			c-17.6-17.6-17.6-46.1,0-63.6L436.4,436.4z")
    path(style="fill-rule:evenodd;clip-rule:evenodd;fill:#FCBB69;", d="M563.6,436.4c-35.1-35.1-92.1-35.1-127.3,0l31.8,31.8			c17.6-17.6,46.1-17.6,63.6,0L563.6,436.4z")
    path(style="fill-rule:evenodd;clip-rule:evenodd;fill:#7AC143;", d="M436.4,563.6c35.1,35.1,92.1,35.1,127.3,0l-31.8-31.8			c-17.6,17.6-46.1,17.6-63.6,0L436.4,563.6z")
    path(style="fill-rule:evenodd;clip-rule:evenodd;fill:#30ABE2;", d="M973,500c0-226.4-160.5-421.1-382.7-464.3		c-4.3-0.8-8.5,2-9.4,6.3c-0.8,4.3,2,8.5,6.3,9.4C802,93.1,957,281.2,957,500c0,4.4,3.6,8,8,8S973,504.4,973,500z")
    path(style="fill-rule:evenodd;clip-rule:evenodd;fill:#988CFF;", d="M401.7,37.3C183.2,83.8,27,276.7,27,500c0,4.4,3.6,8,8,8		s8-3.6,8-8C43,284.2,193.9,97.8,405,53c4.3-0.9,7.1-5.2,6.2-9.5C410.2,39.2,406,36.4,401.7,37.3z")
    path(style="fill-rule:evenodd;clip-rule:evenodd;fill:#8ECB84;", d="M862.3,804c57-67.9,93.7-150.4,106.1-238.2		c0.6-4.4-2.4-8.4-6.8-9c-4.4-0.6-8.4,2.4-9,6.8l0,0c-11.9,84.8-47.4,164.6-102.5,230.2c-2.8,3.4-2.4,8.4,1,11.3		C854.5,807.8,859.5,807.4,862.3,804z")
    path(style="fill-rule:evenodd;clip-rule:evenodd;fill:#F7956A;", d="M541.2,971.2c102.3-9,198.9-51,275.3-119.7		c3.3-3,3.5-8,0.6-11.3s-8-3.5-11.3-0.6l0,0c-73.7,66.4-167.1,107-266,115.6c-4.4,0.4-7.6,4.3-7.3,8.7		C533,968.3,536.8,971.6,541.2,971.2z")
    path(style="fill-rule:evenodd;clip-rule:evenodd;fill:#EA68A7;", d="M31.6,565.8c31.5,224.2,217.5,394.7,443.6,406.5		c4.4,0.2,8.2-3.2,8.4-7.6c0.2-4.4-3.2-8.1-7.6-8.4C257.6,944.9,77.9,780.2,47.4,563.6c-0.6-4.4-4.7-7.4-9-6.8		C34,557.4,31,561.5,31.6,565.8z")
    path(style="fill:#666;", d="M500,71C265.3,71,75,261.3,75,496s190.3,425,425,425s425-190.3,425-425S734.7,71,500,71z M500,821		c-179.5,0-325-145.5-325-325s145.5-325,325-325s325,145.5,325,325S679.5,821,500,821z")
    path(style="fill:#777;", d="M500,274.1c-122.5,0-221.9,99.3-221.9,221.9S377.5,717.9,500,717.9S721.9,618.5,721.9,496		S622.5,274.1,500,274.1z M500,624.3c-70.9,0-128.3-57.4-128.3-128.3S429.1,367.7,500,367.7S628.3,425.1,628.3,496		S570.9,624.3,500,624.3z")
    path(style="fill-rule:evenodd;clip-rule:evenodd;fill:#30ABE2;", d="M773,500c0-116.5-74-220.2-184.1-258.1		c-4.2-1.4-8.7,0.8-10.2,5c-1.4,4.2,0.8,8.7,5,10.2C687.4,292.7,757,390.3,757,500c0,4.4,3.6,8,8,8S773,504.4,773,500z")
    path(style="fill-rule:evenodd;clip-rule:evenodd;fill:#988CFF;", d="M406.6,243.5C298.8,282.7,227,385.2,227,500c0,4.4,3.6,8,8,8		s8-3.6,8-8c0-108,67.6-204.5,169.1-241.5c4.2-1.5,6.3-6.1,4.8-10.3C415.4,244.1,410.8,242,406.6,243.5z")
    path(style="fill-rule:evenodd;clip-rule:evenodd;fill:#8ECB84;", d="M709.1,675.5c26.7-31.8,45.7-69.2,55.8-109.4		c1.1-4.3-1.6-8.6-5.8-9.7c-4.3-1.1-8.6,1.5-9.7,5.8c-9.4,37.9-27.4,73.1-52.5,103c-2.8,3.4-2.4,8.4,1,11.3		C701.2,679.3,706.3,678.9,709.1,675.5z")
    path(style="fill-rule:evenodd;clip-rule:evenodd;fill:#F7956A;", d="M523.8,772c49.3-4.3,96.6-22,136.7-51.1		c3.6-2.6,4.4-7.6,1.8-11.2s-7.6-4.4-11.2-1.8l0,0c-37.7,27.4-82.2,44-128.7,48.1c-4.4,0.4-7.7,4.3-7.3,8.7S519.4,772.3,523.8,772z")
    path(style="fill-rule:evenodd;clip-rule:evenodd;fill:#EA68A7;", d="M235.1,566c26.5,106.3,114,186.5,222.2,203.6		c4.4,0.7,8.5-2.3,9.2-6.7c0.7-4.4-2.3-8.5-6.7-9.2c-101.9-16.1-184.2-91.6-209.2-191.7c-1.1-4.3-5.4-6.9-9.7-5.8		C236.6,557.4,234,561.8,235.1,566z")
  g#texts(font-weight="bold" font-size="25px")
    text(transform="matrix(1 0 0 1 15 188)" font-size="18" ) EUCLIDEAN
    text(font-size="15" text-anchor="middle" transform="matrix(1 0 0 1 945 820)", style="fill:#FFFFFF;  ")
      tspan(x="0") EXPORT 
      tspan(x="0" y="20") MIDI
      tspan(x="0" y="40") FILE
    text(transform="matrix(1 0 0 1 30.8611 55.5253)", style="fill:#FFFFFF;  ") TEMPO INFO
    text(transform="matrix(1 0 0 1 649.9998 804.2612)", style="fill:#F7956A;  ") PANNING
    text(transform="matrix(1 0 0 1 843.2753 925)", style="fill:#FFFFFF;  ") TAP TEMPO
    text(transform="matrix(1 0 0 1 748.6371 971.2296)", style="fill:#FFFFFF;  ") CLICK TO SET
    text(transform="matrix(1 0 0 1 96.1243 985.2861)", style="fill:#FFFFFF;  ") CLICK TO SET
    text(transform="matrix(1 0 0 1 14.5221 932.4329)", style="fill:#FFFFFF;  ") AUDIO TO TEMPO
    text(transform="matrix(1 0 0 1 162.5001 771.9922)", style="fill:#EA68A7;  ") SOUND KIT
    text(transform="matrix(1 0 0 1 189.7273 264.2068)")
      tspan(x="0", y="0", style="fill:#988CFF;  ") TOP
      tspan(x="-29.2", y="30", style="fill:#988CFF;  ") NUMBER
    text(transform="matrix(1 0 0 1 734.6319 263.8826)")
      tspan(x="0", y="0", style="fill:#30ABE2;  ") BOTTOM
      tspan(x="2.8", y="30", style="fill:#30ABE2;  ") NUMBER
    text(transform="matrix(1 0 0 1 446.9636 103.7921)", style="fill:#AAD037;  ") METER
    text(transform="matrix(1 0 0 1 777.0959 661.5693)", style="fill:#8ECB84;  ") VOLUME
    text(transform="matrix(1 0 0 1 472.961 505)", style="fill:#FFFFFF;  ") BPM

    text(transform="matrix(1 0 0 1 31.4109 95.1306)")
      tspan(x="0", y="0", style="fill:#FFFFFF;  font-size:19.8425px;") Drag across
      tspan(x="0", y="23.8", style="fill:#FFFFFF;  font-size:19.8425px;") to change BPM
    text(transform="matrix(1 0 0 1 440.7423 383)")
      tspan(x="0", y="0", style="fill:#FCBB69;  font-size:19.8425px;") Drag across
      tspan(x="-14.3", y="23.8", style="fill:#FCBB69;  font-size:19.8425px;") to change BPM
    text(transform="matrix(1 0 0 1 479.9783 443.6178)", style="fill:#FFFFFF;  ") Х 2
    text(transform="matrix(1 0 0 1 483.5272 574.109)", style="fill:#FFFFFF;  ") / 2
    text(transform="matrix(1 0 0 1 551.3752 509.5666)", style="fill:#FFFFFF;  ") +1
    text(transform="matrix(1 0 0 1 424.09 508)", style="fill:#FFFFFF;  ") -1
    text(transform="matrix(1 0 0 1 912.6625 52.0002)", style="enable-background:new;")
      tspan(x="0", y="0", style="fill:#FFFFFF;  ") PLAY
      tspan(x="-0.7", y="60", style="fill:#FFFFFF;  ") STOP
    text(transform="matrix(1 0 0 1 600.1643 38.6146)", style="fill:#88C6E2;  font-size:20px;") Press Spacebar to play/pause
    text(transform="matrix(1 0 0 1 700.2522 68.6146)", style="fill:#88C6E2;  font-size:20px;") Press Enter to stop
    text(transform="matrix(1 0 0 1 419.2261 148.5724)", style="fill:#FFFFFF;  font-size:21.6557px;") LOOP 1 STEPS
    text(transform="matrix(1 0 0 1 421.7783 340.3109)", style="fill:#FFFFFF;  font-size:21.6557px;") LOOP 2 STEPS
    text(transform="matrix(1 0 0 1 337.6439 650.5206)", style="fill:#FFFFFF;  font-size:21.6557px;") CLICK A STEP TO ACTIVATE IT
    text(transform="matrix(1 0 0 1 302.5375 853.3745)", style="fill:#FFFFFF;  font-size:21.6557px;") CLICK A STEP CIRCLE TO SET ACCENT
</template>

<style lang="postcss" scoped>

</style>
