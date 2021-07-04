export default ({ app, $directus }, inject) => {
  async function data() {
    return await $directus.items('website').readMany()
  }

  inject('website', data())
}
