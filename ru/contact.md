---
title: Контакты
subtitle: Проект и его основатель
tags: main
order: 120
org:
  avatar: /media/logo/logo.svg
  name: Хроматон
  pos: Центр
  place: Москва, Россия
  about: Неформальная некоммерческая инициатива по обновлению музыкальной теории на основе современной науки и техники
  social:
    instagram: chromatone.center
    email: support@chromatone.center
    github: chromatone

author:
  avatar: /img/starov.jpg
  name: Денис К Старов
  pos: Основатель, дизайнер и разработчик
  place: Москва, Россия
  about: Я дизайнер широкого профиля и энтузиаст открытого кода. Я исследую музыку с помощью векторной графики и веб-браузера. И делюсь своими экспериментами и находками на этом сайте.
  social:
    instagram: starov
    telegram: starov
    email: me@starovdenis.com
    github: davay42
---


<author-card :author="$frontmatter?.org" />

<author-card :author="$frontmatter?.author" />
