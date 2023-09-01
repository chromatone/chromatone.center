---
dynamic: true
---

<script setup>
import ProjectCard from '../../projects/ProjectCard.vue'
import { useData } from 'vitepress'
const { params, frontmatter: f } = useData()
</script>

<youtube-embed v-if="f.youtube_video" :video="f.youtube_video"></youtube-embed>

{{ params.announce ? '> ' + params.announce : ''}}

 <audio controls v-if="f?.audio">
  <source :src="`https://db.chromatone.center/assets/${f.audio}`" type="audio/mpeg">
Your browser does not support the audio element.
</audio>

<!-- @content -->

----

<h3 v-if="f.schedule"></h3>
<table class="max-w-55ch" v-if="f.schedule">
<tr class="text-xl font-bold p-4"><td colspan="3">Schedule</td></tr>
<tr v-for="act in f.schedule" :key="act">
<td width="60px" class="text-center">{{act.time.slice(0,-3)}}</td>
<td width="50%" >{{act.activity}}</td>
<td class="opacity-60">{{act.duration}}</td>
</tr>
</table>

## Project

<ProjectCard class="m-4 max-w-55ch" v-bind="f?.project" />

<!-- <pre class="text-xs">{{ frontmatter }}</pre> -->

<youtube-embed v-if="f.live_stream" :video="f.live_stream"></youtube-embed>
