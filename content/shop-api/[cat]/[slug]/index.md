---
dynamic: true
title: Product
---

<script setup>
import { useData } from 'vitepress'
import { computed } from 'vue'
const { params, frontmatter } = useData()

</script>

<!-- @content -->

<!-- <pre class="text-xs">{{ frontmatter }}</pre> -->

### Price: ${{ frontmatter.price }}
