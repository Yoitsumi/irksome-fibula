document.addEventListener("DOMContentLoaded", () => {

  var BunnehSpawnTime = 5000

  var lastBunneh, lastInterval

  var score = 0

  function $(css) { return document.querySelector(css) }

  function template(name) {
    return $('#templates .' + name).cloneNode(true)
  }

  function removePx(val) {
    return val.substr(0, val.length - 2)
  }

  function nowAndInterval(f, i) {
    f()
    return setInterval(f, i)
  }

  var powerPickups = []

  function spawnPower(pos) {
    var sprite = template('power')
    sprite.style.left = pos.x + "px";
  }

  function spawnBunneh() {
    var bunneh
    if(!lastBunneh) {
      lastBunneh = template('bunneh')
      lastBunneh.addEventListener('click', () => {
        var explosion = template('explosion')
        var centerXofBunneh = +removePx(bunneh.style.left) + 25
        explosion.style.left = centerXofBunneh - 50 + "px"

        var centerYofBunneh = +removePx(bunneh.style.top) + 25
        explosion.style.top  = centerYofBunneh - 250 + "px"
        $('#container').appendChild(explosion)
        $('#container').removeChild(lastBunneh)
        score += 1000000
        $('#score').textContent = score + "pkt."
      })
    }
    if(lastInterval)
      clearInterval(lastInterval)
    bunneh = lastBunneh

    bunneh.width = $('#templates .bunneh').width
    bunneh.width *= Math.random() + 1

    var G = 100
    var x = 0
    var y = ((Math.random() + 0.5) * getHeight($('#container')) / 2)
    var yv = - G * (BunnehSpawnTime / 2000)
    var xv = getWidth($('#container')) / (BunnehSpawnTime / 1000)
    lastInterval = nowAndInterval(() => {
      x += xv / 60
      y += yv / 60
      yv += G / 60

      bunneh.style.left = x + "px"
      bunneh.style.top  = y + "px"

    }, 1000/60)
    $('#container').appendChild(lastBunneh)
  }

  function getWidth(el) {
    var ret = getComputedStyle(el).width
    return +ret.substr(0, ret.length-2)
  }

  function getHeight(el) {
    var ret = getComputedStyle(el).height
    return +ret.substr(0, ret.length-2)
  }

  nowAndInterval(spawnBunneh, BunnehSpawnTime)

  setInterval(() => {
    score += 1587
    $('#score').textContent = score + "pkt."
  }, 1000/15)

  $('#container').addEventListener('mousemove', (e) => {
    var crosshair = $('#crosshair')
    crosshair.style.left = (e.clientX - crosshair.width / 2) + "px"
    crosshair.style.top = (e.clientY - crosshair.height / 2) + "px"
  })

})
