---
title: Color names
subtitle: Know how to name any color of 12 equally spaced hues

date: 2021-08-01
cover: theory/color-names.svg
langs:
  nm: Wavelength
  en: English
  fr: Français
  es: Español
  ru: Русский
colors:
  red:
    nm: 700 nm
    en: Red
    fr: Rouge
    es: Rojo
    ru: Красный
  orange:
    nm: 600 nm
    en: Orange
    fr: Orange
    es: Naranja
    ru: Оранжевый
  yellow:
    nm: 570 nm
    en: Yellow
    fr: Jaune
    es: Amarillo
    ru: Желтый
  lime:
    nm: 564 nm
    en: Lime
    fr: Chartreuse
    es: Lima
    ru: Лаймовый
  green:
    nm: 525 nm
    en: Green
    fr: Vert
    es: Verde
    ru: Зеленый
  mint:
    nm: 505 nm
    en: Mint
    fr: Turquoise
    es: Primavera
    ru: Мятный
  cyan:
    nm: 490 nm
    en: Cyan
    fr: Cyan
    es: Cian
    ru: Голубой
  azure:
    nm: 488 nm
    en: Azure
    fr: Azure
    es: Azure
    ru: Лазурный
  blue:
    nm: 450 nm
    en: Blue
    fr: Bleu
    es: Azul
    ru: Синий
  violet:
    nm: 400 nm
    en: Violet
    fr: Violet
    es: Violeta
    ru: Фиолетовый
  magenta:
    nm: "-"
    en: Magenta
    fr: Magenta
    es: Magenta
    ru: Пурпурный
  rose:
    nm: "-"
    en: Rose
    fr: Cramoisi
    es: Carmesí
    ru: Малиновый
---

<script setup>
import colorCards from './cards.vue'
import colorNames from './names.vue'
</script>

<color-cards :list="$frontmatter.colors" :langs="$frontmatter.langs" />

<color-names :list="$frontmatter.colors" :langs="$frontmatter.langs" />

<img src="/media/theory/color-names.svg">

https://en.wikipedia.org/wiki/Tertiary_color

<img src="/media/theory/palette.svg" width="400" height="400" />
