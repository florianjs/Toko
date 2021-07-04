const { Directus } = require('@directus/sdk')

export default ({ app }, inject) => {
  const directus = new Directus(process.env.BASE_URL)

  inject('directus', directus)
}
