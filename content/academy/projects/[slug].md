---
dynamic: true
---

<script setup>
import EventCard from '../events/EventCard.vue'
import { useData } from 'vitepress'
import { computed } from 'vue'
const { params, frontmatter } = useData()

const events = computed(()=>[...frontmatter.value?.events].sort((a,b)=>a.date<b.date ? 1:0))
</script>

<youtube-embed v-if="frontmatter?.youtube_video" :video="frontmatter.youtube_video"></youtube-embed>

<!-- @content -->

<!-- <pre class="text-xs">{{ frontmatter }}</pre> -->
<div class="m-4 flex flex-col gap-4">
  <EventCard v-for="event in events" :key="event.id" v-bind="event" />
</div>
