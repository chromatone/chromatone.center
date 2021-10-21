---
title: Euclidean rhythms
subtitle: An ancient algoritm to create evenly spaces odd rhythms

date: 2021-08-30
links:
  - https://habr.com/ru/post/278265/
---


{{ getEuclideanRhythm(7,16) }}



<script setup>

function _getEuclideanRhythm(m, k, input) {
    input = input || new Array(m).fill('1').concat(new Array(k).fill('0'));
    const output = [];

    for (let i = 0; i < Math.min(m, k); i++) {
        output.push(input.shift() + input.pop());
    }

    if (input.length > 1) {
        return _getEuclideanRhythm(output.length, input.length, output.concat(input));
    }

    return output.concat(input);
}

function getEuclideanRhythm(x, total) {
    return _getEuclideanRhythm(x, total - x).join('');
}

</script>