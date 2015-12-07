document.addEventListener('DOMContentLoaded', () => {
  function $(css) {
    return document.querySelector(css)
  }

  $('#name-form').addEventListener('submit', () => {
    putCookie('name', $('#name-input').value)
    putCookie('time', new Date())
  })

  if(getCookie('name') && getCookie('time')) {
    greet()
    putCookie('time', new Date())
  }

  function putCookie(name, value) {
    document.cookie = name + '=' + value
  }

  function deleteCookie(name) {
    document.cookie = name + '=   ;expires=' + (new Date().toUTCString())
  }

  function getCookie(name) {
    return document.cookie.split(';').find(c => c.trim().split('=')[0] == name).split('=')[1]
  }

  window.deleteCookie = deleteCookie
  window.getCookie = getCookie

  function greet() {
    alert("Hello, "+getCookie('name')+", haven't seen you since "+getCookie('time'))
  }

})
