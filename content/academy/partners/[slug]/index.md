---
dynamic: true
---

<script setup>
import EventCard from '../../events/EventCard.vue'
import ProjectCard from '../../projects/ProjectCard.vue'
import { useData } from 'vitepress'
import { computed } from 'vue'
const { params, frontmatter: f } = useData()
</script>

<youtube-embed v-if="f?.youtube_video" :video="f.youtube_video"></youtube-embed>

<img class="max-w-150" :src="`https://db.chromatone.center/assets/${f?.logo}/`" />

<!-- @content -->

<h2 v-if="f.events.length>0"> {{ f.events.length }} events </h2>

<div class="m-4 flex flex-col gap-8">
  <EventCard v-for="event in f.events" :key="event.id" v-bind="event" />
</div>

<h2 v-if="f.projects.length>0"> {{ f.projects.length }} projects </h2>

<div class="flex flex-col gap-4 mx-4">
<ProjectCard v-for="project in f?.projects" :key="project" v-bind="project?.projects_id"  >{{project}}</ProjectCard>
</div>
