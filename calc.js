document.addEventListener('DOMContentLoaded', function() {

  var $ = document.querySelector.bind(document)

  var ops = {
    minus: function(a, b) { return a - b },
    plus: function(a, b) { return a + b },
  }

  $('#frist').addEventListener('keydown', recompute, true)
  $('#frist').addEventListener('change', recompute, true)

  function recompute() {
    var a = $('#a').value,
        b = $('#b').value,
        op = $('#op').value
    $('#c').textContent = ops[op](Number(a), Number(b))
  }


  $('table').addEventListener('click', function(e) {
    if(e.target.tagName.toLowerCase() === 'button') {
      var calcText = $('#calc-text')
      if(e.target.textContent === '=') {
        var sqrt = Math.sqrt
        var pow = function(a) { return function(x) { return Math.pow(a, x) }}
        try {
          $('#calc-text').textContent = eval($('#calc-text').textContent)
        } catch(err) {
          alert(err)
        }
      } else if(e.target.textContent === '<-') {
        calcText.textContent = calcText.textContent.substr(0, calcText.textContent.length - 1)
      } else {
        if(isOperator(calcText.textContent.charAt(calcText.textContent.length-1))
           && isOperator(e.target.textContent)) {
          calcText.textContent = calcText.textContent.substr(0, calcText.textContent.length - 1) + e.target.textContent
        } else {
          calcText.textContent += e.target.textContent
        }
      }
    }
    e.stopPropagation()
  })

  function isOperator(c) {
    return "+-*/".indexOf(c) !== -1
  }

  var buzzer = new Audio("buzzer.wav")

  $('#set-timer').addEventListener('click', function() {
    setTimeout(function() {
      buzzer.play()
    }, Number($('#timer').value) * 1000)
  })

})
