---
title: Chromatic hands
description: A way to connect musical notes, colors and your own body and consciousness.
date: 2020-10-13
cover: hands.png
layout: app
---

<ChromaHand v-for="right in [false,true]" :style="{position:right? 'absolute' : 'block', transform: right?`translateX(200px) scaleX(-100%) ` : ''}" :right="right" />
