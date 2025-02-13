---
title: Musical Glossary
description: List of terms used in modern music conversations
cover: tom-hermans.jpg
date: 2019-02-04
---

<script setup>
import data from '../../../db/glossary/modern.yaml'
</script>

<ul>
<li v-for="(meaning, term) in data" :key="term">
<b>{{term}}</b>: {{meaning}}
</li>
</ul>
