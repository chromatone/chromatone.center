---
dynamic: true
page_type: event
---

<script setup>
import { useData } from 'vitepress'
import { computed } from 'vue'
const { params, frontmatter: f } = useData()
</script>

<a class="no-underline text-xl" href="/academy/">Academy</a>  / <a class="no-underline" href="/academy/partners/">Partners</a> / {{ f?.title }}

<youtube-embed v-if="f?.youtube_video" :video="f.youtube_video"></youtube-embed>

<PartnerDetails v-bind="f" />

<!-- @content -->

<h2 v-if="f.projects.length>0"> Projects: {{ f.projects.length }} </h2>

<div class="flex flex-col gap-4 mx-4">
<ProjectCard v-for="project in f?.projects" :key="project" v-bind="project?.projects_id"  >{{project}}</ProjectCard>
</div>

<h2 v-if="f.events.length>0">Events: {{ f.events.length }} </h2>

<div class="m-4 flex flex-col gap-8">
  <EventCard v-for="event in f.events" :key="event.id" v-bind="event" />
</div>
