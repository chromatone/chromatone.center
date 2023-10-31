---
title: Synth snippets
description: Code pieces
---

### Skew by [upheaver](https://discord.com/channels/826071713426178078/834787928688689172/1123676571279048875)

Sharing a useful snippet. JUCE's logskew function in Typescript, if anyone wants to scale their parameter values (for example convert 0-1 range to 20-20000 hz in a non linear way) :

```js
const clamp = ( min: number, max: number, num: number ) => {
    return Math.min(Math.max(num, min), max);
}

const skew = ( min: number, max: number, centerPoint: number ) => {
    return Math.log(0.5) / Math.log((centerPoint - min) / (max - min));
}

const logskew = ( a: number, b: number, time: number, centerPoint: number) => {
    const proportion = clamp(0, 1, time);
    const sk = skew(a, b, centerPoint);
    const v = Math.exp (Math.log (proportion) / sk);
    return a + (b - a) * v;
}

console.log(logskew( 20, 20000, 0.5, 1000)) // will output 1000
```
