---
title: Indian notation system
subtitle: The seven varnas of a saptak
tags: notation
date: 2021-08-19
cover: theory/notation/Bhat_notation1.jpg
svaras:
  - name: ṣaḍja (षड्ज)
    trans: Giving birth to the six
    variants: shuddha sa (sa)
    color: Green
    planet: Mercury
    mnem: Sa
    chakra: Mūlādhāra

  - name: ṛṣabha (ऋषभ) 
    variants: komal re (ra), shuddha re (ri)
    trans: Bull
    color: Red
    planet: Mars
    mnem: Re
    chakra: Svādhiṣṭhāna

  - name: gāndhāra (गान्धार) 
    variants: komal ga (ga), shuddha ma (gi)
    trans: Minium
    color: Gold
    planet: Sun
    mnem: Ga
    chakra: Maṇipūra

  - name: madhyama (मध्यम) 
    variants: shuddha ma (mi), tivra ma (mu)
    trans: Middlemost
    color: White
    planet: Moon
    mnem: Ma
    chakra: Anāhata

  - name: pañcama (पंचम) 
    trans: Fifth
    variants: shuddha pa (pa)
    color: Black
    planet: Saturn
    mnem: Pa
    chakra: Viśuddha

  - name: dhaivata (धैवत) 
    variants: komal dha (dha), shuddha dha (dhi)
    trans: Steady
    color: Yellow
    planet: Jupiter
    mnem: Dha
    chakra: Ājñā

  - name: niṣāda (निषाद) 
    variants: komal ni (na), shuddha ni (ni)
    trans: Sitting
    color: Multi
    planet: Venus
    mnem: Ni
    chakra: Sahasrāra

---

The Samaveda text (1200 BC – 1000 BC) contains notated melodies, and these are probably the world's oldest surviving ones.

https://en.wikipedia.org/wiki/Vedic_accent

The musical notation is written usually immediately above, sometimes within, the line of Samaveda text, either in syllabic or a numerical form depending on the Samavedic Sakha (school). The Indian scholar and musical theorist Pingala (c. 200 BC), in his Chanda Sutra, used marks indicating long and short syllables.

![](/media/theory/notation/Bhat_notation1.jpg)

## Saptak - सप्तक - 7 svaras - Octave

<table>
<tr>
  <th>Syllable</th>
  <th>Name</th>
  <th>Meaning</th>
  <th>Variants</th>
  <th>Color</th>
  <th>Planet</th>
  <th>Chakra</th>
</tr>
<tr v-for="svara in $frontmatter.svaras" :key="svara.name">
  <td class="font-bold"> {{svara.mnem}}</td>
  <td> {{svara.name}}</td>
  <td> {{svara.trans}}</td>
  <td> {{svara.variants}}</td>
  <td :style="{backgroundColor: svara.color}"> {{svara.color}}</td>
  <td> {{svara.planet}}</td>
  <td> {{svara.chakra}}</td>
</tr>
</table>

https://en.wikipedia.org/wiki/Svara



http://sanskritdictionary.com/%E1%B9%A3a%E1%B8%8Dja/242242/1