export default ({ app }, inject) => {
  let metamask

  if (typeof window.ethereum !== 'undefined') {
    metamask = window.ethereum
  } else {
    metamask = false
  }

  inject('metamask', metamask)
}
