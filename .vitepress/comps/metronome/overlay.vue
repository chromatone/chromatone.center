<template lang="pug">
g.overlay
  g#rects(
    stroke-width="4"
  )
    rect(opacity="0.85", :fill="isDark ? '#333' : '#f7f7f7'", stroke="none", stroke-miterlimit="10", width="1000", height="1000")
    rect(x="24.2", y="37.2", fill="none", rx="20", stroke="#31429B",  stroke-miterlimit="10", width="213.8", height="142.8")
    rect(x="786", y="37.2", fill="none", rx="20", stroke="#30ABE2",  stroke-miterlimit="10", width="169.3", height="86.3")
    rect(x="330.4", y="11", fill="none", rx="20", stroke="#AAD037",  stroke-miterlimit="10", width="169.3", height="86.3")
    rect(x="501.2", y="11", fill="none", rx="20", stroke="#B75527",  stroke-miterlimit="10", width="169.3", height="86.3")
    rect(x="330", y="174", fill="none", rx="20", stroke="#AAD037",  stroke-miterlimit="10", width="169.3", height="86.3")
    rect(x="500.7", y="174", fill="none", rx="20", stroke="#B75527",  stroke-miterlimit="10", width="169.3", height="86.3")
    rect(x="2.5", y="344.8", fill="none", rx="20", stroke="#EA68A7",  stroke-miterlimit="10", width="94.1", height="310.2")
    rect(x="168", y="344.8", fill="none", rx="20", stroke="#EA68A7",  stroke-miterlimit="10", width="94.1", height="310.2")
    rect(x="931.8", y="418.8", fill="none", rx="20", stroke="#8ECB84",  stroke-miterlimit="10", width="62.8", height="162.3")
    rect(x="757", y="418.8", fill="none", rx="20", stroke="#8ECB84",  stroke-miterlimit="10", width="62.8", height="162.3")
    rect(x="419.6", y="750.3", fill="none", rx="20", stroke="#F7956A",  stroke-miterlimit="10", width="147.6", height="81.4")
    rect(x="419.6", y="913.6", fill="none", rx="20", stroke="#F7956A",  stroke-miterlimit="10", width="147.6", height="81.4")
    rect(x="13.4", y="860.5", fill="none", rx="20", stroke="#9AA4D3",  stroke-miterlimit="10", width="265.8", height="115.1")
    rect(x="715.6", y="860.5", fill="none", rx="20", stroke="#027F92",  stroke-miterlimit="10", width="265.8", height="115.1")
    rect(x="453.8", y="462.1", fill="none", rx="20", stroke="#E21C41",  stroke-miterlimit="10", width="96.4", height="71.3")
    rect(x="450", y="380.1", fill="none", rx="20", stroke="#FCBB69",  stroke-miterlimit="10", width="104", height="77.4")
    rect(x="450.3", y="537.6", fill="none", rx="20", stroke="#7AC143",  stroke-miterlimit="10", width="104", height="77.4")
    rect(x="554", y="458.8", fill="none", rx="20", stroke="#60CCF2",  stroke-miterlimit="10", width="66", height="77.4")
    rect(x="382", y="458.8", fill="none", rx="20", stroke="#0A92CF",  stroke-miterlimit="10", width="68", height="77.4")                                

  g#texts(
    font-size="25"
    font-weight="bold"
  )
    text(transform="matrix(1 0 0 1 30.3114 217.1502)", fill="#31429B", ) TEMPO INFO
    text(transform="matrix(1 0 0 1 320.7164 142.0773)", fill="#AAD037", ) TOP NUMBER
    text(transform="matrix(1 0 0 1 400 879.9998)", fill="#F7956A", ) LOOP PANNING
    text(transform="matrix(1 0 0 1 830.1967 845.4425)", fill="#027F92", ) TAP TEMPO
    text(transform="matrix(1 0 0 1 730.3041 932.8613)", fill="#027F92", ) CLICK TO SET
    text(transform="matrix(1 0 0 1 100.6224 932.8613)", fill="#9AA4D3", ) CLICK TO SET
    text(transform="matrix(1 0 0 1 24.222 845.6915)", fill="#9AA4D3", ) ANALYZE AUDIO TEMPO
    text(transform="matrix(1 0 0 1 24.2225 699.7968)", fill="#EA68A7", ) CHOOSE LOOP SOUND
    text(transform="matrix(1 0 0 1 780 627.4999)", fill="#8ECB84", ) LOOP VOLUME
    text(transform="matrix(1 0 0 1 472.961 505)", fill="#E21C41", ) BPM
    text(transform="matrix(1 0 0 1 400 365)", fill="#FCBB69", ) MULTIPLY BPM BY 2
    text(transform="matrix(1 0 0 1 405 652.0281)", fill="#7AC143", ) DIVIDE BPM BY 2
    text(transform="matrix(1 0 0 1 633.1732 506.5871)", fill="#60CCF2", ) BPM +1
    text(transform="matrix(1 0 0 1 280.9967 506.587)", fill="#0A92CF", ) BPM -1
    text(transform="matrix(1 0 0 1 516.9559 142.0775)", fill="#B75527", ) BOTTOM NUMBER
    text(transform="matrix(1 0 0 1 710 32.25)", fill="#30ABE2", ) PLAY/STOP CONTROLS
    text(transform="matrix(1 0 0 1 520 710)", fill="#333", ) Click any sector to switch it on or off
</template>

<script setup>
import { isDark } from '@theme/composables/state.js'
</script>

<style scoped>
</style>