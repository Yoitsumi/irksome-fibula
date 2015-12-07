document.addEventListener('DOMContentLoaded', function() {
  'use strict';

  var snek = []
  var vel = 'right', lastvel = vel

  var food
  var foodDiv

  var CellSize = 30
  var frame = 0
  var FPS = 30

  var XMax = (window.innerWidth / CellSize) | 0
  var YMax = (window.innerHeight / CellSize) | 0

  function $(css) {
    return document.querySelector(css)
  }

  function spawnFood() {
    do {
      food = {x: (Math.random() * XMax) | 0, y: (Math.random() * YMax) | 0}
    } while (snek.find(function(seg){return seg.x === food.x && seg.y === food.y}))
    if(!foodDiv) {
      foodDiv = document.createElement('div')
      foodDiv.className = 'food'
      $('#container').appendChild(foodDiv)
    }
    foodDiv.style.visibility = 'visible'
    foodDiv.style.left = food.x * CellSize + 'px'
    foodDiv.style.top = food.y * CellSize + 'px'
  }
  spawnFood()

  function addSegment(x, y) {
    var div = document.createElement('div')
    div.className = 'snek-part'
    snek.push({x: x, y: y, div: div})
    div.style.left = CellSize * x + 'px'
    div.style.top = CellSize * y + 'px'
    $('#container').appendChild(div)
  }
  addSegment(5, 5)

  function positionSegment(seg, nextPos) {
    seg.div.style.left = CellSize * interpolate(seg.x, nextPos.x, frame/FPS) + 'px'
    seg.div.style.top = CellSize * interpolate(seg.y, nextPos.y, frame/FPS) + 'px'
  }

  function interpolate(a, b, t) {
    return a + (b - a) * t
  }

  function advanceSnek() {
    var head = snek[0]
    var last = snek.pop()
    last.x = head.x; last.y = head.y
    switch(vel) {
      case 'left':
        last.x--; break
      case 'right':
        last.x++; break
      case 'up':
        last.y--; break
      case 'down':
        last.y++; break
    }
    if(snek.find(function(seg) { return seg.x === last.x && seg.y === last.y})) {
      alert('Przegrałeś')
    }
    snek.unshift(last)
    if(last.x < 0 || last.x > XMax || last.y < 0 || last.y > YMax)
      alert('Przegrałeś!')
    positionSegment(last, {x: 0, y: 0})
    if(last.x === food.x && last.y === food.y)
      friss()
    lastvel = vel

  }

  function friss() {
    //for(var i = 0; i<100; i++)
      addLastSegment()
    foodDiv.style.visibility = 'hidden'
    setTimeout(spawnFood, 500)
  }

  function animateSnek() {
    frame++
    if(frame === FPS) {
      advanceSnek()
      frame = 0
    }
    snek.forEach(function(seg, i) {
      if(i === 0) switch(vel) {
        case 'left': positionSegment(seg, {x: seg.x - 1, y: seg.y}); break;
        case 'right': positionSegment(seg, {x: seg.x + 1, y: seg.y}); break;
        case 'up': positionSegment(seg, {y: seg.y - 1, x: seg.x}); break;
        case 'down': positionSegment(seg, {y: seg.y + 1, x: seg.x}); break;
      } else {
        positionSegment(seg, snek[i-1])
      }
    })
  }

  function addLastSegment() {
    var last = snek[snek.length-1]
    addSegment(last.x, last.y)
  }

  window.addEventListener('keydown', function(e) {
    switch(e.which) {
      case 37:
        if(lastvel !== 'right') vel = 'left'; break;
      case 38:
        if(lastvel !== 'down') vel = 'up'; break;
      case 39:
        if(lastvel !== 'left') vel = 'right'; break;
      case 40:
        if(lastvel !== 'up') vel = 'down'; break;
      default:
        console.log(e.which)
    }
  })

  setInterval(animateSnek, 250 / FPS)

})
