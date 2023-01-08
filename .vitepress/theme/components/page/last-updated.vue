<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useData } from 'vitepress'

const site = useData()

const hasLastUpdated = computed(() => {
  const lu = site.theme.value.lastUpdated

  return lu !== undefined && lu !== false
})

const prefix = computed(() => {
  const p = site.theme.value.lastUpdated
  return p === true ? 'Last Updated' : p
})

const datetime = ref('')
onMounted(() => {
  // locale string might be different based on end user
  // and will lead to potential hydration mismatch if calculated at build time
  datetime.value = new Date(site.page.value.lastUpdated).toLocaleString('en-US')
})
</script>

<template>
  <p v-if="hasLastUpdated" class="last-updated">
    <span class="inline-block font-medium">{{ prefix }}:</span>
    <span class="inline-block ml-1.5 font-normal">{{ datetime }}</span>
  </p>
</template>

<style scoped >
.last-updated {
  @apply inline-block m-0 text-0.9rem leading-1.4rem text-$c-text-light lg-(text-base leading-1.4rem);
}
</style>
