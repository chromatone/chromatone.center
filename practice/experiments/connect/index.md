---
title: Connect
subtitle: Experiments with Gun connectivity
date: 2022-01-01
---

<script setup>
import { defineAsyncComponent } from 'vue'

const Connect = defineAsyncComponent(() =>  import('./index.vue'))

</script>

<client-only>
  <connect />
</client-only>