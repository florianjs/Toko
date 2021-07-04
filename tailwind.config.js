module.exports = {
  purge: {
    options: {
      // Whitelisting some classes to avoid purge
      safelist: [/^bg-/, /^text-/],
    },
  },
  theme: {
    extend: {
      fontFamily: {
        inter: ['Inter'],
      },
    },
  },
}
