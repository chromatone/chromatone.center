<script setup>
import 'ol/ol.css'
import { Map, View } from 'ol';
import OSM from 'ol/source/OSM';
import { fromLonLat } from 'ol/proj';
import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import LineString from 'ol/geom/LineString';
import { Circle, Style, Stroke } from 'ol/style';
import VectorSource from 'ol/source/Vector';
import { Tile as TileLayer, Vector as VectorLayer } from 'ol/layer';
import PinchZoom from 'ol/interaction/PinchZoom';


import { pitchColor } from '@use/calculations'

const props = defineProps({
  center: { type: Array, default: [0, 70] },
  cities: { type: Array, default: [] }
})

onMounted(() => {
  const cities = props.cities.map((city, c) => {
    let feature = new Feature({
      geometry: new Point(fromLonLat([city.coord[1], city.coord[0]])),
    })
    let pitch = c % 12
    feature.setStyle(new Style({
      image: new Circle({
        radius: 6,
        stroke: new Stroke({ color: pitchColor(pitch, 3), width: 2 }),
        fill: new Stroke({ color: pitchColor(pitch, 4, 1, 0.3) }),
      }),
    }))
    return feature
  })


  const pointSource = new VectorSource({
    features: cities,
  });

  const pointLayer = new VectorLayer({
    source: pointSource,
  });

  const lines = props.cities.map((city, c) => {
    let line = new Feature({
      geometry: new LineString([fromLonLat(props.center), fromLonLat([city.coord[1], city.coord[0]])])
    })
    line.setStyle(new Style({
      stroke: new Stroke({
        color: pitchColor(c % 12, 4, 1, 0.3),
        width: 2,
      }),
    }))
    return line
  })

  const lineSource = new VectorSource({
    features: lines,
  });

  const lineLayer = new VectorLayer({
    source: lineSource,
  });

  new Map({
    layers: [
      new TileLayer({ source: new OSM() }),
      lineLayer,
      pointLayer,

    ],
    view: new View({
      center: fromLonLat([10, 30]),
      zoom: 1,
      maxZoom: 9,
    }),
    target: 'map',

  });

});

</script>

<template lang="pug">
#map.h-400px.rounded-3xl.overflow-hidden.shadow-xl.mb-8.cursor-pointer(tabindex="1")
</template>

<style lang="postcss" scoped>
</style>