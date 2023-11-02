---
title: Musical transport
description: How we subdivide time to have a rhythm
date: 2020-10-30
layout: app
cover: cover.png
links: https://discord.com/channels/826071713426178078/834787928688689172/1127958693695205387
---

<script setup>
import { defineAsyncComponent } from 'vue'

const ElemTimeMath = defineAsyncComponent(() =>import('../../../../audio/time/ElemTimeMath.vue'))
</script>

<client-only>
<ElemTimeMath />
</client-only>
