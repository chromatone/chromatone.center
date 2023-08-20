---
title: Devlog
description: Short video streams about the build process of this web-site
date: 2022-06-18
topContent: true
---

This exact web-site is a huge undertaking, that has years of focused development invested in it. It's all open source and one thing that's always lacking is the documentation. This vlog is an attempt to leave at least some trace of the process. We show the thought process, the tooling and the actual code evolving on the screen to become new features and updates here on this web-site and around Chromatone. The intention is to share the method for others to get into the collaborative coding, working on this huge project together.

You can start writing articles on music theory, adding and refining features of current apps and creating whole new applications with Chromatone.

<script setup>
  import { data } from './devlog.data'
</script>

<RowList :children="data" />
