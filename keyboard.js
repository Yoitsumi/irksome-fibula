document.addEventListener('DOMContentLoaded', function() {

  function $(css) { return document.querySelector(css) }

  var canvas = document.createElement('canvas')
  document.body.appendChild(canvas)

  $('#mode').addEventListener('change', function() {
    player.velocity = {x: 0, y: 0}
  })

  document.addEventListener('keydown', function(e) {
    console.log($('#mode').value)
    switch(Number.parseInt($('#mode').value)) {
      case 1:
        switch(e.which) {
          case 37: // <-
            player.x -= 10
            break
          case 38: // ^
            player.y -= 10
            break
          case 39: // ->
            player.x += 10
            break
          case 40: // V
            player.y += 10
            break
          default:
            console.log(e.which)
        }
        break;
      case 2:
      case 3:
        console.log("here!")
        var speed = e.shiftKey ? 5 : 1
        switch(e.which) {
          case 37: // <-
            player.velocity = {x: -speed, y: 0}
            break
          case 38: // ^
            player.velocity = {x: 0, y: -speed}
            break
          case 39: // ->
            player.velocity = {x: speed, y: 0}
            break
          case 40: // V
            player.velocity = {x: 0, y: speed}
            break
          default:
            console.log(e.which)
        }
    }
  })

  document.addEventListener('keyup', function(e) {
    if($('#mode').value == 3)
      switch(e.which) {
        case 37:
        case 39:
          player.velocity.x = 0
          break
        case 38:
        case 40:
          player.velocity.y = 0
          break
      }
  })

  var ctxt = canvas.getContext('2d')


  canvas.width = parseInt(window.getComputedStyle(document.body).width)
  canvas.height = parseInt(window.getComputedStyle(document.body).height)

  var player = {
    x: 0, y: 0,
    velocity: {x: 0, y: 0},
    color: 0
  }

  function drawPlayer() {
    ctxt.fillStyle = 'hsla('+player.color+', 100%, 50%, 0.1)'
    ctxt.fillRect(player.x, player.y, 50, 50)
  }

  function clearCanvas() {
    ctxt.clearRect(0, 0, ctxt.width, ctxt.height)
  }

  var interval = setInterval(function(){
    clearCanvas()
    drawPlayer()
    player.x += player.velocity.x
    player.y += player.velocity.y
    player.color++
  }, 1000/30)

})
