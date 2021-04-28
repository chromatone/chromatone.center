<template lang="pug">
footer(class="mx-auto max-w-960px md:px-6" v-if="$frontmatter.footer")
  .container
    p(class="m-0 text-center leading-6 text-0.9rem text-$c-text-light")
      | {{ $frontmatter.footer }}
</template>

<style scoped lang="postcss">
.container {
  padding: 2rem 1.5rem 2.25rem;
}

@screen xs {
  .container {
    padding: 3rem 1.5rem 3.25rem;
  }
}
</style>
