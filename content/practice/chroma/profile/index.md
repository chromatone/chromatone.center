---
title: Profile
description: Get info for any possible chroma combination
layout: app
date: 2021-05-12
cover: profile.png
---

<chroma-profile v-model:chroma="chroma"  class="m-2" :editable="true" />

<script setup>
import {ref} from 'vue'
const chroma = ref('100000010000')
</script>
