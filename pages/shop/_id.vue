<template>
  <div class="px-4 md:w-3/4 mx-auto grid grid-cols-12 gap-6 py-16">
    <nuxt-img
      :src="`${product.item_hero.src}?height=512&quality=100`"
      class="col-span-12 md:col-span-8 rounded-lg object-cover h-96 w-full"
      :alt="product.item_hero.alt"
    />
    <p class="text-6xl col-span-4 font-bold">
      Exclusive
      <span :class="`text-${website.color_schema}-500`">Air Jordans.</span>
    </p>
    <ul class="col-span-12 gap-6 grid grid-cols-3">
      <div class="col-span-3 md:col-span-2 grid grid-cols-2 gap-6">
        <div
          v-for="item in product.item_images"
          @click="showGallery(item)"
          :key="item.src"
          class="w-full h-64 cursor-pointer col-span-2 md:col-span-1 rounded-lg"
        >
          <nuxt-img
            class="w-full rounded-lg object-cover h-full"
            :src="`${item.src}?height=256&quality=100`"
            :alt="item.alt"
          />
        </div>
      </div>

      <div
        class="
          col-span-3
          md:col-span-1
          row-span-3
          w-full
          h-full
          order-2
          flex flex-col
          selectdiv
        "
      >
        <div class="top-4 sticky flex flex-col">
          <label class="text-2xl font-semibold" for="size"
            >Choose your size :</label
          >
          <div class="grid grid-cols-4 gap-4 mb-6">
            <div
              v-for="(item, index) in product.item_sizes"
              :key="index"
              class="
                rounded-lg
                border
                h-12
                flex
                justify-center
                items-center
                font-bold
                text-xl
                cursor-pointer
                select-none
                transform
                duration-200
                easi-in-out
              "
              :class="
                sizesClass(index) &&
                `bg-${website.color_schema}-500 text-white border-${website.color_schema}-500`
              "
              @click="sizesChoose(index)"
            >
              {{ item.size }}
            </div>
          </div>
          <p class="text-6xl font-bold">
            {{ product.item_sizes[chooseSize].price }}€
          </p>

          <button
            v-if="!productQty && !loading"
            class="rounded-lg text-2xl font-bold py-2"
            :class="
              product.item_sizes[chooseSize].quantity
                ? `bg-${website.color_schema}-500 text-${website.color_schema}-100 hover:bg-${website.color_schema}-600 ease-in-out duration-200 transform`
                : 'bg-gray-300 text-gray-50 cursor-not-allowed'
            "
            @click="product.item_sizes[chooseSize].quantity && addToCart()"
          >
            {{
              product.item_sizes[chooseSize].quantity
                ? 'Add to cart'
                : 'Out of stock'
            }}
          </button>
          <div
            v-if="productQty"
            class="
              flex
              justify-between
              p-2
              w-full
              items-center
              border-2
              rounded-lg
              text-2xl
              font-bold
            "
            :class="`border-${website.color_schema}-500`"
          >
            <p
              class="
                text-white
                h-12
                w-12
                flex
                justify-center
                items-center
                rounded-lg
                cursor-pointer
                select-none
                shadow
                ease-in-out
                duration-200
                transform
              "
              :class="`bg-${website.color_schema}-500 hover:bg-${website.color_schema}-600 `"
              @click="substractItem()"
            >
              -
            </p>
            {{ productQty }}
            <p
              class="
                text-white
                h-12
                w-12
                flex
                justify-center
                items-center
                rounded-lg
                cursor-pointer
                select-none
                shadow
                ease-in-out
                duration-200
                transform
              "
              :class="`bg-${website.color_schema}-500 hover:bg-${website.color_schema}-600`"
              @click="addItem()"
            >
              +
            </p>
          </div>
          <transition name="slide-fade">
            <p
              v-if="loading"
              class="
                flex
                items-center
                justify-center
                bg-green-400
                text-gray-50
                rounded-lg
                text-2xl
                font-bold
                py-2
              "
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-12 w-12 ml-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </p>
          </transition>
        </div>
      </div>
    </ul>
    <transition name="slide-fade">
      <div
        class="fixed top-0 left-0 h-screen w-screen"
        v-if="gallery"
        @click="gallery = false"
      >
        <div
          class="absolute top-0 w-full h-full bg-black left-0 opacity-25 z-10"
        ></div>
        <div
          class="
            absolute
            top-0
            left-0
            w-full
            h-full
            flex
            justify-center
            items-center
            z-30
          "
        >
          <img
            :src="currentGalleryImg.src"
            :alt="currentGalleryImg.alt"
            class="rounded-lg bg-white object-cover"
            style="height: 90vh"
          />
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
export default {
  async asyncData({ params, $directus }) {
    let product = { item_sizes: [], item_images: [] }
    // fetch current Shoes item
    let items = await $directus.items('items').readMany({
      filter: {
        item_slug: {
          _eq: params.id,
        },
      },
    })

    await Promise.all(
      // Fetch all variants from the current product
      items.data[0]['item_variants'].map(async (element) => {
        // element represent the PK of the variants collection
        let relatedProduct = await $directus.items('variants').readMany({
          filter: {
            id: {
              // Filter item in variants collection with the current element PK
              _eq: element,
            },
          },
        })

        // Push those variants into an Array
        product['item_sizes'].push({
          size: relatedProduct.data[0].size,
          price: relatedProduct.data[0].price,
          quantity: relatedProduct.data[0].quantity,
          stripe: relatedProduct.data[0].stripe_id,
        })
      })
    )

    // there is a maximum of 6 images / item
    for (let index = 0; index < 6; index++) {
      if (items.data[0][`item_image_${index}`]) {
        // fetch images from the current item
        let img = await $directus.files.readMany({
          filter: { id: { _eq: items.data[0][`item_image_${index}`] } },
        })

        // push image src and alt into the object
        product['item_images'].push({
          src: process.env.BASE_URL + '/assets/' + img.data[0].id,
          alt: img.data[0].description || '',
        })
      }
    }

    product['item_name'] = items.data[0].item_name
    product['item_variants'] = items.data[0].item_variants
    product['item_hero'] = {
      src: process.env.BASE_URL + '/assets/' + items.data[0].item_hero,
      alt: '',
    }

    const { data } = await $directus.items('website').readMany()

    return { product, website: data }
  },
  data() {
    return {
      chooseSize: 0,
      gallery: false,
      currentGalleryImg: '',
      addedToCart: false,
      loading: false,
    }
  },
  computed: {
    productQty() {
      let isInCart = false
      if (this.$store.state.localStorage.cart) {
        this.$store.state.localStorage.cart.forEach((element) => {
          if (
            element.item_variants.stripe ===
            this.product.item_sizes[this.chooseSize].stripe
          )
            isInCart = element.item_quantity
        })
      }

      return isInCart
    },
  },
  methods: {
    sizesChoose(index) {
      this.addedToCart = false
      this.chooseSize = index
    },
    showGallery(img) {
      this.gallery = true
      this.currentGalleryImg = { src: img.src, alt: img.alt }
    },
    sizesClass(index) {
      if (index === this.chooseSize) return true
      return false
    },
    async addToCart() {
      this.addedToCart = true
      this.loading = true

      setTimeout(() => {
        this.loading = false
        this.$store.commit('localStorage/add', {
          item_hero: this.product.item_hero,
          item_name: this.product.item_name,
          item_quantity: 1,
          item_variants: {
            price: this.product.item_sizes[this.chooseSize].price,
            size: this.product.item_sizes[this.chooseSize].size,
            stripe: this.product.item_sizes[this.chooseSize].stripe,
          },
        })
      }, 1000)
    },
    addItem() {
      this.$store.commit('localStorage/addOne', {
        item_hero: this.product.item_hero,
        item_name: this.product.item_name,
        item_quantity: 1,
        item_variants: {
          price: this.product.item_sizes[this.chooseSize].price,
          size: this.product.item_sizes[this.chooseSize].size,
          stripe: this.product.item_sizes[this.chooseSize].stripe,
        },
      })
    },
    substractItem() {
      this.$store.commit('localStorage/subsctractOne', {
        item_hero: this.product.item_hero,
        item_name: this.product.item_name,
        item_quantity: 1,
        item_variants: {
          price: this.product.item_sizes[this.chooseSize].price,
          size: this.product.item_sizes[this.chooseSize].size,
          stripe: this.product.item_sizes[this.chooseSize].stripe,
        },
      })
    },
  },
}
</script>

<style scoped>
.slide-fade-enter-active {
  transition: all 0.8s ease;
}

.slide-fade-enter {
  transform: translateX(10px);
  opacity: 0;
}

select {
  @apply px-8;
}
</style>
