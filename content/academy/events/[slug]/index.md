---
dynamic: true
---

<script setup>
import ProjectCard from '../../projects/ProjectCard.vue'
import EventSchedule from '../EventSchedule.vue'
import EventMedia from '../EventMedia.vue'
import EventDetails from '../EventDetails.vue'
import { useData } from 'vitepress'
const { params, frontmatter: f } = useData()
</script>

<EventDetails v-bind="f" />

<youtube-embed v-if="f.youtube_video" :video="f.youtube_video"></youtube-embed>

{{ params.announce ? '> ' + params.announce : ''}}

<!-- @content -->

<EventSchedule :schedule="f.schedule" />

<EventMedia class="mt-4" :media="f.media" />

## Project

<ProjectCard class="m-4 max-w-55ch" v-bind="f?.project" />

<!-- <pre class="text-xs">{{ frontmatter }}</pre> -->

<youtube-embed v-if="f.live_stream" :video="f.live_stream"></youtube-embed>
