document.addEventListener('DOMContentLoaded', function() {

  document.querySelector('input').addEventListener('keypress', function(e) {
    if(e.key < '0' || e.key > '9' && e.key != 'Tab' && e.key != 'Backspace')
      e.preventDefault()

  })

})
