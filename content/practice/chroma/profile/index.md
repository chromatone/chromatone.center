---
title: Profile
description: Get info for any possible chroma combination

date: 2021-05-12
cover: profile.png
---

<chroma-profile v-model:chroma="chroma" :editable="true" />

<script setup>
import {ref} from 'vue'
const chroma = ref('100000010000')
</script>
