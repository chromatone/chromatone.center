---
title: Projects
description: Academy projects as a form of growing Chromatone social ecosystem
date: 2023-08-23
cover: caught-in-joy.jpg
---

<script setup>
import ProjectList from './ProjectList.vue'
import { data } from '../academy.data'
</script>

<ProjectList :projects="data?.projects"/>
