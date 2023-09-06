---
dynamic: true
title: Category
---

<!-- @content -->

<script setup>
import ProductCard from '../ProductCard.vue'
import { data } from '../shop.data'
import { useData } from 'vitepress'
import { computed } from 'vue'
const { params, frontmatter } = useData()
const category = computed(()=>data.categories.find((cat)=>cat.slug==params.value.slug))
</script>

<div class="flex flex-wrap gap-8 m-4">
  <ProductCard
    v-for="product in category.products" :key="product" v-bind="product"
  />
</div>

<!-- <pre>{{category}}</pre> -->

<!-- <pre class="text-xs">{{ frontmatter }}</pre> -->
