export const state = () => ({
  cart: [],
})

export const mutations = {
  add(state, item) {
    let alreadyExist = { state: false, index: 0 }
    state.cart.forEach((element, index) => {
      if (element.item_variants.stripe === item.item_variants.stripe) {
        alreadyExist.state = true
        alreadyExist.index = index
      }
    })
    alreadyExist.state
      ? state.cart[alreadyExist.index].item_quantity++
      : state.cart.push(item)
  },
  addOne(state, item) {
    let alreadyExist = { state: false, index: 0 }
    state.cart.forEach((element, index) => {
      if (element.item_variants.stripe === item.item_variants.stripe) {
        alreadyExist.state = true
        alreadyExist.index = index
      }
    })
    alreadyExist.state
      ? state.cart[alreadyExist.index].item_quantity++
      : state.cart.push(item)
  },
  subsctractOne(state, item) {
    let alreadyExist = { state: false, index: 0 }
    state.cart.forEach((element, index) => {
      if (element.item_variants.stripe === item.item_variants.stripe) {
        alreadyExist.state = true
        alreadyExist.index = index
      }
    })
    alreadyExist.state
      ? state.cart[alreadyExist.index].item_quantity--
      : state.cart.push(item)
  },
  remove(state, index) {
    Array.prototype.remove = function (from, to) {
      let rest = this.slice((to || from) + 1 || this.length)
      this.length = from < 0 ? this.length + from : from
      return this.push.apply(this, rest)
    }

    state.cart.remove(index)
  },

  reset(state) {
    state.cart = []
  },
}
