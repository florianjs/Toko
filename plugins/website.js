export default async function ({ $axios }, inject) {
  const datas = $axios
    .get(process.env.BASE_URL + '/items/website/')
    .then((response) => {
      return {
        color: response.data.data.color_schema,
        seo: response.data.data.seo_title,
        keywords: response.data.data.seo_keywords,
        description: response.data.data.seo_description,
        og_banner: response.data.data.og_banner,
        og_alt: response.data.data.og_alt,
        url: response.data.data.front_url,
        logo: response.data.data.website_logo,
        header_image: response.data.data.header_image,
      }
    })
  inject('seo', await datas)
}
