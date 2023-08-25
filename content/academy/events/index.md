---
title: Events
description: Meetups, talks and performances
date: 2023-08-22
cover: hulki-okan-tabak.jpg
---


<script setup>
import EventList from './EventList.vue'
import { data } from '../academy.data'
</script>

<EventList :events="data?.events"/>
