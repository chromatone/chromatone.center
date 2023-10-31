---
title: Musical transport
description: How we subdivide time to have a rhythm
date: 2023-10-30
layout: app
---

<script setup>
import { defineAsyncComponent } from 'vue'

const ElemTimeMath = defineAsyncComponent(() =>import('../../../../audio/time/ElemTimeMath.vue'))
</script>

<client-only>
<ElemTimeMath />
</client-only>

## Metronome

[Yea long story short](https://discord.com/channels/826071713426178078/834787928688689172/1127958693695205387) I think metro was maybe not a great idea and it's worth considering to deprecate it. More effective in my opinion is to take el.time() which monotonically increases, counting the number of elapsed samples, and derive a quarter-note phasor from el.time(). (From bpm you calculate seconds per beat, from which you calculate samples per beat, which you can use to convert el.time() into a phasor running at exactly quarter-note rate). Then of course if you want to change bpm you just change the numbers in your calculation but it will all be perfectly time-synced because it's derived from the actual time signal. And then you can turn your quarter-note phasor into a pulse train with el.le(phasor, 0.5)
