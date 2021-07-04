<template>
  <div class="md:w-3/4 px-4 md:px-0 mx-auto grid grid-cols-12 gap-6 pb-16">
    <nuxt-img
      :src="headerImage"
      class="col-span-12 rounded-lg object-cover h-96 w-full"
      alt="Shop header"
      height="600px"
    />
    <p class="text-4xl md:text-6xl col-span-12 md:col-span-8 font-bold">
      Check out our latest
      <span :class="`text-${website.color}-500`">sneakers. 👟</span>
    </p>
    <div class="col-span-12 gap-6 grid grid-cols-3">
      <nuxt-link
        :to="`/shop/${item.product_slug}`"
        class="
          group
          col-span-3
          md:col-span-1
          rounded-lg
          w-full
          h-64
          relative
          flex
          justify-end
          items-end
          p-6
          bg-center
        "
        v-for="item in products"
        :key="item.product_hero.src"
      >
        <nuxt-img
          :src="item.product_hero.src"
          :alt="item.product_hero.alt"
          class="
            absolute
            top-0
            left-0
            z-0
            w-full
            h-full
            object-cover
            rounded-lg
          "
        />
        <div
          class="
            absolute
            top-0
            left-0
            bg-black
            group-hover:opacity-40
            opacity-40
            md:opacity-0
            ease-in-out
            duration-200
            transform
            z-10
            w-full
            h-full
            rounded-lg
          "
        ></div>
        <div
          class="
            z-30
            group-hover:opacity-100
            md:opacity-0
            ease-in-out
            duration-200
            transform
          "
        >
          <p class="font-semibold text-white text-4xl">
            {{ item.product_name }}
          </p>
        </div>
      </nuxt-link>
    </div>
  </div>
</template>

<script>
export default {
  async asyncData({ $directus }) {
    let products = []
    let alt = []
    const items = await $directus.items('shoes').readMany()

    items.data.forEach((element) => {
      products.push({
        product_name: element.product_name,
        product_hero: {
          src: process.env.BASE_URL + '/assets/' + element.product_hero,
        },
        product_slug: element.product_slug,
        product_options: element.product_options,
        product_image: element.product_hero,
      })
    })

    await Promise.all(
      products.map(async (element, index) => {
        let img = await $directus.files.readMany({
          filter: { id: { _eq: element.product_image } },
        })
        products[index].product_hero['alt'] = img.data[0].description
      })
    )

    return { products, alt }
  },
  computed: {
    headerImage() {
      return process.env.BASE_URL + '/assets/' + this.$seo.header_image
    },
    website() {
      return {
        color: this.$seo.color,
        title: this.$seo.seo,
        description: this.$seo.description,
        keywords: this.$seo.keywords,
        url: this.$seo.url,
        og_banner: this.$seo.og_banner,
        og_alt: this.$seo.og_alt,
      }
    },
  },
  head() {
    return {
      title: this.website.title,
      meta: [
        // `hid` est un identifiant unique. N'utilisez pas `vmid` pour cela car cela ne marchera pas.
        {
          hid: 'keywords',
          name: 'keywords',
          content: this.website.keywords,
        },
        {
          hid: 'description',
          name: 'description',
          content: this.website.description,
        },
        {
          hid: 'twitter:title',
          name: 'twitter:title',
          content: this.website.description,
        },
        {
          hid: 'twitter:url',
          property: 'twitter:url',
          content: this.website.url,
        },
        {
          hid: 'twitter:description',
          name: 'twitter:description',
          content: this.website.description,
        },
        {
          hid: 'twitter:image',
          name: 'twitter:image',
          content: process.env.BASE_URL + '/assets/' + this.website.og_banner,
        },
        {
          hid: 'twitter:card',
          name: 'twitter:card',
          content: 'summary_large_image',
        },
        {
          hid: 'twitter:image:alt',
          name: 'twitter:image:alt',
          content: this.website.og_alt,
        },
        {
          hid: 'og:title',
          property: 'og:title',
          content: this.website.title,
        },
        {
          hid: 'og:url',
          property: 'og:url',
          content: this.website.description,
        },
        {
          hid: 'og:description',
          property: 'og:description',
          content: this.website.description,
        },
        {
          hid: 'og:image',
          property: 'og:image',
          content: process.env.BASE_URL + '/assets/' + this.website.og_banner,
        },
        {
          hid: 'og:image:secure_url',
          property: 'og:image:secure_url',
          content: process.env.BASE_URL + '/assets/' + this.website.og_banner,
        },
        {
          hid: 'og:image:alt',
          property: 'og:image:alt',
          content: this.website.og_alt,
        },
      ],
    }
  },
}
</script>
