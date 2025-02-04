---
dynamic: true
title: Projects
hidden: true
---

<script setup>
import { useData } from 'vitepress'
const { params } = useData()
  
import ProjectPage from '../ProjectPage.vue'

import { defineClientComponent } from 'vitepress'
const ProjectEvents = defineClientComponent(() => import('../ProjectEvents.vue'))
</script>

<!-- @content -->

<ProjectEvents :id="$params?.id" ></ProjectEvents>
