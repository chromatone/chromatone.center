---
title: Contacts
description: The project and it's author
date: 2021-01-01
cover: javier-balseiro.jpg
org:
  avatar: /media/logo/smooth.svg
  name: Chromatone center
  pos: HQ
  place: Since 2017
  about:
  social:
    instagram: chromatone.center
    email: support@chromatone.center
    github: chromatone
    reddit: r/chromatone
author:
  avatar: /img/starov.jpg
  name: Denis K Starov
  pos: Founder, designer and developer
  place: Born in 1987 and dwelling
  about: I'm a broad range designer and enthusiastic open source developer. So I explore music with the web browser. And share my experiments and explorations with everyone here.
  social:
    instagram: starov
    telegram: starov
    email: davay@chromatone.center
    github: davay42
topContent: true
---

<script setup>
import { useData } from 'vitepress'
const { frontmatter: f } = useData()
</script>

<author-card :author="f?.org"  />

Chromatone is a self sustaining ecosystem of music learners, music teachers and new tools to learn, practice, compose and perform music visually. The source code for them is open and is developed as an internationally funded social initiative.

Our mission is to build a complete visual music ecosystem built by international community of learners, teachers and performers. With open music labs as the new form of real time creative collaboration.

The stickers and printable files sales bring fuel to feed the research and development process. Charity funding is very welcome! We are building a whole language here - and the wider we can reach and share the joy of playing Visual Music together. ✨

<author-card :author="f?.author" />
