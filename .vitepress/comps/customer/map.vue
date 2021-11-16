<template lang="pug">
#map.h-400px.rounded-3xl.overflow-hidden.shadow-xl.mt-8
</template>

<script setup>
import 'ol/ol.css'
import { Map, View } from 'ol';
import OSM from 'ol/source/OSM';
import { fromLonLat } from 'ol/proj';
import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import { Circle, Style } from 'ol/style';
import VectorSource from 'ol/source/Vector';
import { Tile as TileLayer, Vector as VectorLayer } from 'ol/layer';

import { useData } from 'vitepress'

onMounted(() => {
  const { frontmatter } = useData()
  const cities = frontmatter.value.cities.map(city => {
    return new Feature({
      geometry: new Point(fromLonLat([city.coord[1], city.coord[0]]))
    })
  })

  const vectorSource = new VectorSource({
    features: cities,
  });

  const vectorLayer = new VectorLayer({
    source: vectorSource,
  });

  new Map({
    layers: [
      new TileLayer({ source: new OSM() }),
      vectorLayer,
    ],
    view: new View({
      center: fromLonLat([10, 30]),
      zoom: 1,
      maxZoom: 8,
    }),
    target: 'map'
  });

});

</script>

<style scoped>
</style>