<template>
  <div class="px-4 lg:w-3/4 mx-auto pb-16">
    <client-only>
      <div
        v-for="(product, index) in products"
        class="
          grid grid-cols-12
          gap-6
          p-2
          lg:p-8
          bg-white
          rounded-lg
          mt-6
          shadow
        "
        :key="index"
      >
        <nuxt-img
          :src="product.product_hero.src"
          class="col-span-12 lg:col-span-3 h-48 rounded-lg w-full object-cover"
          :alt="product.product_hero.alt"
        />
        <div class="col-span-8 lg:col-span-7 flex flex-col justify-between">
          <div>
            <p class="col-span-4 text-2xl font-bold">
              {{ product.product_name }}
            </p>
            <p class="col-span-4" v-if="product.product_variants.size">
              Size : {{ product.product_variants.size }} <br />
              Qty :
              {{ product.product_quantity }}
            </p>
          </div>
          <p class="col-span-4 text-2xl font-bold">
            {{ product.product_variants.price }}€
          </p>
        </div>

        <div
          class="
            col-span-4
            lg:col-span-2
            flex
            justify-center
            items-center
            h-12
            lg:h-auto
            w-12
            lg:w-auto
          "
        >
          <button
            class="
              rounded-full
              h-12
              w-12
              border
              flex
              justify-center
              items-center
              group
            "
            :class="`border-${website.color_schema}-500 hover:${colors.bg}`"
            @click="remove(index)"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-6 w-6 group-hover:text-white"
              :class="`text-${website.color_schema}-500`"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      </div>
    </client-only>

    <div
      class="text-4xl pt-6 pb-4 text-right w-full flex font-light justify-end"
    >
      Tot. {{ total }}€
    </div>
    <div class="flex justify-end items-center w-full">
      <button
        v-if="hasMetamask"
        @click="checkoutBNB()"
        class="
          mr-6
          uppercase
          bg-gradient-to-br
          from-yellow-500
          to-red-500
          shadow-md
          font-light
          duration-200
          rounded-lg
          text-white
          px-4
          py-4
          h-16
          text-2xl
          flex
          justify-evenly
          items-center
          hover:shadow-none hover:translate-y-1
          transform
        "
        :class="loading && 'w-16'"
      >
        <div class="loader" v-if="loading">
          <svg class="circular-loader p-4" viewBox="25 25 50 50">
            <circle
              class="loader-path"
              cx="50"
              cy="50"
              r="20"
              fill="none"
              stroke="#fff"
              stroke-width="4"
            />
          </svg>
        </div>

        <p v-if="!loading">Pay with BNB</p>
        <svg
          v-if="!loading"
          xmlns="http://www.w3.org/2000/svg"
          class="h-8 w-8 ml-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
          />
        </svg>
      </button>
      <button
        @click="checkout()"
        class="
          uppercase
          bg-gradient-to-br
          from-pink-600
          to-purple-500
          shadow-md
          font-light
          duration-200
          rounded-lg
          text-white
          px-4
          py-4
          h-16
          text-2xl
          flex
          justify-evenly
          items-center
          hover:shadow-none hover:translate-y-1
          transform
        "
        :class="loading && 'w-16'"
      >
        <div class="loader" v-if="loading">
          <svg class="circular-loader p-4" viewBox="25 25 50 50">
            <circle
              class="loader-path"
              cx="50"
              cy="50"
              r="20"
              fill="none"
              stroke="#fff"
              stroke-width="4"
            />
          </svg>
        </div>

        <p v-if="!loading">Checkout</p>
        <svg
          v-if="!loading"
          xmlns="http://www.w3.org/2000/svg"
          class="h-8 w-8 ml-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
          />
        </svg>
      </button>
    </div>
  </div>
</template>

<script>
export default {
  async asyncData({ $directus }) {
    const { data } = await $directus.items('website').readMany()
    return { website: data }
  },
  data() {
    return {
      loading: false,
      metamaskAccount: '',
    }
  },
  computed: {
    colors() {
      return {
        bg: `bg-${this.website.color_schema}-500`,
        text: `text-${this.website.color_schema}-500`,
      }
    },
    hasMetamask() {
      if (this.$metamask) {
        return true
      } else return false
    },
    products() {
      return this.$store.state.localStorage.cart
    },
    total() {
      let total = 0
      this.products.forEach((element) => {
        total +=
          Number(element.product_variants.price) * element.product_quantity
      })

      return total
    },
    productList() {
      let productList = []
      this.products.forEach((element) => {
        productList.push({
          price: element.product_variants.stripe,
          quantity: element.product_quantity,
        })
      })

      return productList
    },
  },
  methods: {
    remove(index) {
      this.$store.commit('localStorage/remove', index)
    },
    async checkoutBNB() {
      if (this.$metamask) {
        const accounts = await this.$metamask.request({
          method: 'eth_requestAccounts',
        })
        this.metamaskAccount = accounts[0]
      }
    },
    checkout() {
      this.loading = true
      this.$stripe
        .redirectToCheckout({
          lineItems: this.productList,
          mode: 'payment',
          successUrl: 'https://toko-demo.netlify.app/',
          cancelUrl: 'https://toko-demo.netlify.app/',
        })
        .then(function (result) {
          if (result.error) {
            var displayError = document.getElementById('error-message')
            displayError.textContent = result.error.message
          }
        })
    },
  },
}
</script>

<style scoped>
.circular-loader {
  -webkit-animation: rotate 2s linear infinite;
  animation: rotate 2s linear infinite;
  height: 100%;
  -webkit-transform-origin: center center;
  -ms-transform-origin: center center;
  transform-origin: center center;
  width: 100%;
  position: absolute;
  top: 0;
  left: 0;
  margin: auto;
}

.loader-path {
  stroke-dasharray: 150, 200;
  stroke-dashoffset: -10;
  -webkit-animation: dash 1.5s ease-in-out infinite,
    color 6s ease-in-out infinite;
  animation: dash 1.5s ease-in-out infinite, color 6s ease-in-out infinite;
  stroke-linecap: round;
}

@-webkit-keyframes rotate {
  100% {
    -webkit-transform: rotate(360deg);
    transform: rotate(360deg);
  }
}

@keyframes rotate {
  100% {
    -webkit-transform: rotate(360deg);
    transform: rotate(360deg);
  }
}
@-webkit-keyframes dash {
  0% {
    stroke-dasharray: 1, 200;
    stroke-dashoffset: 0;
  }
  50% {
    stroke-dasharray: 89, 200;
    stroke-dashoffset: -35;
  }
  100% {
    stroke-dasharray: 89, 200;
    stroke-dashoffset: -124;
  }
}
@keyframes dash {
  0% {
    stroke-dasharray: 1, 200;
    stroke-dashoffset: 0;
  }
  50% {
    stroke-dasharray: 89, 200;
    stroke-dashoffset: -35;
  }
  100% {
    stroke-dasharray: 89, 200;
    stroke-dashoffset: -124;
  }
}
@-webkit-keyframes color {
  0% {
    stroke: #fff;
  }
  40% {
    stroke: #fff;
  }
  66% {
    stroke: #fff;
  }
  80%,
  90% {
    stroke: #fff;
  }
}
@keyframes color {
  0% {
    stroke: #fff;
  }
  40% {
    stroke: #fff;
  }
  66% {
    stroke: #fff;
  }
  80%,
  90% {
    stroke: #fff;
  }
}
</style>
