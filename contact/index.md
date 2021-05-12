---
title: Contact
subtitle: The project and it's founder
tags: main
order: 120
org:
  avatar: /media/logo/logo.svg
  name: Chromatone
  pos: HQ
  place: Moscow, Russia
  about: Ecosystem of tools to learn, practice, compose and perform music visually. The source codes are open so we can develop it as an internationally funded  social initiative.
  social:
    instagram: chromatone.center
    email: support@chromatone.center
    github: chromatone

author:
  avatar: /img/starov.jpg
  name: Denis K Starov
  pos: Founder, designer and developer
  place: Based in Moscow, Russia
  about: I'm a broad range designer and enthusiastic open source developer. So I explore music with the web browser. And share my experiments and explorations with everyone here.
  social:
    instagram: starov
    telegram: starov
    email: me@starovdenis.com
    github: davay42
---


<author-card :author="$frontmatter?.org" />

<author-card :author="$frontmatter?.author" />
