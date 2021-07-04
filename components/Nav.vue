<template>
  <header class="w-3/4 mx-auto flex justify-between py-8">
    <nuxt-link to="/" style="color: red"
      ><nuxt-img
        :src="logo"
        class="
          h-12
          transform
          hover:rotate-45
          fill-current
          ease-in-out
          duration-500
        "
        alt="logo image"
    /></nuxt-link>
    <client-only>
      <nuxt-link
        to="/cart"
        class="h-12 w-12 border flex justify-center items-center rounded-lg"
        :class="
          items
            ? `border-${colorschema}-500 bg-${colorschema}-500 text-white`
            : 'border-gray-300'
        "
      >
        <p v-if="items">{{ items }}</p>
        <svg
          v-else
          xmlns="http://www.w3.org/2000/svg"
          class="h-6 w-6 text-gray-500"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
          />
        </svg> </nuxt-link
    ></client-only>
  </header>
</template>

<script>
export default {
  computed: {
    logo() {
      return process.env.BASE_URL + '/assets/' + this.$seo.logo
    },
    colorschema() {
      return this.$seo.color
    },
    seo() {
      return this.$seo
    },
    items() {
      return this.$store.state.localStorage.cart.length
    },
  },
}
</script>

<style scoped>
.color-svg {
  fill: red;
}
</style>
