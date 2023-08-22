---
dynamic: true
---

<script setup>
import { useData } from 'vitepress'
const { params, frontmatter } = useData()
</script>

<youtube-embed v-if="frontmatter.youtube_video" :video="frontmatter.youtube_video"></youtube-embed>

{{ params.announce ? '> ' + params.announce : ''}}

 <audio controls v-if="frontmatter.audio">
  <source :src="`https://db.chromatone.center/assets/${frontmatter.audio}`" type="audio/mpeg">
Your browser does not support the audio element.
</audio>

<!-- @content -->

<!-- <pre class="text-xs">{{ frontmatter }}</pre> -->

<youtube-embed v-if="frontmatter.live_stream" :video="frontmatter.live_stream"></youtube-embed>
