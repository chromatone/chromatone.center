---
dynamic: true
---

<script setup>
import EventCard from '../../events/EventCard.vue'
import PartnerCard from '../../partners/PartnerCard.vue'
import { useData } from 'vitepress'
import { computed } from 'vue'
const { params, frontmatter: f } = useData()

const events = computed(()=>[...f.value?.events].sort((a,b)=>(new Date(a.date)).getTime()>(new Date(b.date)).getTime() ? -1:1))

</script>

<youtube-embed v-if="f?.youtube_video" :video="f.youtube_video"></youtube-embed>

<!-- @content -->

<h2 v-if="f.partners">Partners</h2>

<div class="flex bg-light-200/50 rounded-xl flex-wrap gap-2 max-w-150">
<PartnerCard v-for="partner in f?.partners" v-bind="partner?.partners_id" ></PartnerCard>
</div>

<!-- <pre class="text-xs">{{ frontmatter }}</pre> -->

## {{ events.length }} events

<div class="m-4 flex flex-col gap-8">
  <EventCard v-for="event in events" :key="event.id" v-bind="event" />
</div>
