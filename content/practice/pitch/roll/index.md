---
title: Pitch Roll
description: Plot main pitch of any incoming audio on an endless roll

cover: roll.png
date: 2022-06-12
---

<script setup>
import pitchRoll from './roll.vue'
</script>

<client-only>
  <pitch-roll />
</client-only>

This app listens to the incoming audio and analyzes it for the base pitch and tempo. The note with the cents difference is show at the top left. Tempo is shown at the top right. The pitch is plotted on the vertical axis with colored circles while beats are drawn as vertical lines.

1. Press <i class="p-3 mr-1 i-la-play"></i> to start plotting the audio parameters. Press <i class="p-3 mr-1 i-la-pause"></i> to pause the process. You can also do this by clicking the graph itself or by pressing the **Spacebar** key on your keyboard.
2. Press <i class="p-3 mr-1 i-la-times"></i> to clear the graph. Double clicking the graph and pressing the **Enter** key will have the same effect
3. Drag across the graph plain left or right to increase or decrease the speed of the plot head.
4. If you see the <i class="p-3 mr-1 i-la-expand"></i> button at the bottom right, you browser is capable of stretching the graph to the full screen. Have fun!
