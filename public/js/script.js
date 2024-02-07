/*  public/js/script.js  */
document.addEventListener('DOMContentLoaded', function () {
  const all_buttons = document.querySelectorAll('.btn-search')
  const search_bar = document.querySelector('.search-bar')
  const search_input = document.getElementById('search_input')
  const search_close = document.getElementById('search_close')
  for (var i = 0; i < all_buttons.length; i++) {
    all_buttons[i].addEventListener('click', function () {
      search_bar.style.visibility = 'visible'
      search_bar.classList.add('open')
      this.setAttribute('aria-expanded', 'true')
      search_input.focus()
    })
  }
  search_close.addEventListener('click', function () {
    search_bar.style.visibility = 'hidden'
    search_bar.classList.remove('open')
    this.setAttribute('aria-expanded', 'false')
  })
})