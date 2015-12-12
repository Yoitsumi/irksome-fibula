document.addEventListener("DOMContentLoaded", () => {

  function $(css: string) { return document.querySelector(css) }

  type Lazy<T> = () => T

  function fill<T>(size: number, elem: T | Lazy<T>): T[] {
    return range(0, size).map(_ => typeof(elem) === "function" ? (<Lazy<T>> elem)() : <T> elem)
  }

  function zip<T, U>(t: T[], u: U[]): [T, U][] {
    return (t.length < u.length ? t : u).map((_, i): [T, U] => [t[i], u[i]])
  }

  function entries<T>(arr: T[]): [number, T][] {
    return arr.map((e, i): [number, T] => [i, e])
  }
  function indices(arr: any[]): number[] {
    return arr.map((_, i) => i)
  }
  function flatten<T>(arr: T[][]): T[] {
    return arr.flatMap(identity)
  }
  function identity<T>(t: T): T { return t }

  function shuffle<T>(arr: T[]): T[] {
    for (let i = 0; i < arr.length; i++) {
      const s   = Math.random() * arr.length | 0,
            tmp = arr[i]
      arr[i] = arr[s]
      arr[s] = tmp
    }
    return arr
  }

  function range(start: number, end: number, step: number = 1): number[] {
    const ret: number[] = []
    for (let i = start; i < end; i += step) ret.push(i)
    return ret
  }

  function take<T>(arr: T[], c: number): T[] {
    return arr.slice(0, c)
  }

  $('#btn-settings').addEventListener('click', e => {
    $('#settings').classList.add('active')
  })

  const colors = [
    "", "#0029ff", "#00ff29", "#b53100", "#0b0083", "#5d3800", "#00818e", "#b500ff", "#ffa100"
  ]

  const Hidden    = Symbol("Hidden"),
        Uncovered = Symbol("Uncovered"),
        Marked    = Symbol("Marked")

  const stateClasses = {
    [Hidden]: "hidden",
    [Uncovered]: "uncovered",
    [Marked]: "marked"
  }

  var config = {
    width: 30,
    height: 16,
    mines: 99
  }

  var state

  interface Cell { mine: boolean, state: symbol, td?: HTMLElement }

  function guard(x: number, y: number, playfield: Cell[][]): Cell {
    if (x >= 0 && y >= 0 && x < playfield.length && y < playfield[x].length)
      return playfield[x][y]
    else return { mine: false, state: Hidden }
  }

  function init() {
    const playfield: Cell[][] = fill(config.width, () => fill(config.height, () => ({ mine: false, state: Hidden })))
    var freeCells = flatten(playfield)
    take(shuffle(freeCells), config.mines).forEach(c => c.mine = true)

    prepareTable(config.width, config.height, playfield)
    state = { playfield }
    leftDown = false
    rightDown = false
    ignoreUp = false
  }
  init()

  function prepareTable(w: number, h: number, playfield: Cell[][]) {
    console.log(`prepareTable(${w}, ${h})`)
    while ($('#playfield').firstChild)
      $('#playfield').removeChild($('#playfield').firstChild)

    range(0, h).forEach(y => {
      const tr = document.createElement('tr')
      range(0, w).forEach(x => {
        const td = document.createElement('td')
        playfield[x][y].td = td
        // if (playfield[x][y].mine)
        //   td.classList.add('mine')
        // td.textContent = String(countNeighborMines(x, y, playfield))
        td.setAttribute('x', String(x))
        td.setAttribute('y', String(y))
        updateCell(x, y, playfield)
        tr.appendChild(td)
      })
      $('#playfield').appendChild(tr)
    })
  }

  function neighbors(x: number, y: number): [number, number][] {
    return [-1, 0, 1].flatMap( xx => [-1, 0, 1].flatMap( (yy) => {
      const rx = x + xx, ry = y + yy
      if (rx >= 0 && ry >= 0 && rx < config.width && ry < config.height && !(x == rx && y == ry))
        return [<[number, number]>[rx, ry]]
      else return []
    }))
  }

  function countNeighborMines(x: number, y: number, playfield: Cell[][]): number {
    // return [-1, 0, 1].flatMap(xx => [-1, 0, 1].map(yy => guard(x+xx, y+yy, playfield).mine ? 1 : 0)).
    //   reduce((a, b) => a+b)
    return neighbors(x, y).map(([x, y]) => playfield[x][y].mine ? 1 : 0).reduce((a, b) => a + b, 0)
  }

  function updateCell(x: number, y: number, playfield: Cell[][]) {
    const cell = playfield[x][y]
    if (cell.state === Uncovered) {
      const i = countNeighborMines(x, y, state.playfield)
      cell.td.textContent = cell.mine ? "X" : i == 0 ? " " : ""+i
      cell.td.style.color = colors[i]
    }
    cell.td.className = stateClasses[cell.state]
  }

  var leftDown = false,
      rightDown = false,
      ignoreUp = false

  $('#playfield').addEventListener('mousedown', (e: MouseEvent) => {
    if (e.button === 0) leftDown = true
    else if (e.button === 2) rightDown = true
  }, true)

  $('#playfield').addEventListener('mouseup', (e: MouseEvent) => {
    console.log('click')
    const target = <Element> e.target
    if (target.tagName.toLowerCase() === 'td') {
      const x = Number(target.getAttribute('x')),
            y = Number(target.getAttribute('y'))
      if (e.button === 0) leftDown = false
      else if (e.button === 2) rightDown = false
      if (ignoreUp) {
        ignoreUp = false
        return
      }
      if ((e.button === 0 && rightDown) || (e.button === 2 && leftDown)) {
        auto(x, y, state.playfield)
        if (state.won) init()
        ignoreUp = true
      } else if (e.button === 0) {
        uncover(x, y, state.playfield)
        if (state.won) init()
      } else if (e.button === 2) mark(x, y, state.playfield)
      e.stopImmediatePropagation()
      e.preventDefault()
    }
  }, true)
  $('#playfield').addEventListener('contextmenu', e => e.preventDefault())

  function uncover(x: number, y: number, playfield: Cell[][]) {
    // console.log(`uncover(${x}, ${y})`)
    if (playfield[x][y].state === Marked) return
    playfield[x][y].state = Uncovered
    updateCell(x, y, playfield)
    if (state.playfield[x][y].mine) {
      alert("Lost")
      init()
    } else {
      if (countNeighborMines(x, y, playfield) === 0)
        neighbors(x, y).forEach(c => {
          const [x, y] = c,
                cell   = playfield[x][y]
          if (cell.state === Hidden)
            uncover(x, y, playfield)
        })
        if (!state.won && flatten(playfield).every(c => c.mine || c.state === Uncovered)) {
          alert("Won")
          state.won = true
        }
    }
  }

  function mark(x: number, y: number, playfield: Cell[][]) {
    playfield[x][y].state = {
      [Hidden]: Marked,
      [Marked]: Hidden,
      [Uncovered]: Uncovered
    }[playfield[x][y].state]
    updateCell(x, y, playfield)

    $('#mines').textContent = ""+(config.mines - flatten(playfield).count(c => c.state === Marked))
  }

  function auto(x: number, y: number, playfield: Cell[][]) {
    if (playfield[x][y].state === Uncovered &&
        neighbors(x, y).map(([x, y]) => playfield[x][y]).
          count(c => c.state === Marked) === countNeighborMines(x, y, playfield)) {
      neighbors(x, y).forEach(([x, y]) => uncover(x, y, playfield))
    }
  }

})

interface Array<T> {
  flatMap<U>(f: (x: T) => U[]): U[],
  count(f: (x: T) => boolean): number,
  sum(): number

}
Array.prototype.flatMap = Array.prototype.flatMap ||
  function(f) { return [].concat(... this.map(f)) }

Array.prototype.count = Array.prototype.count ||
  function(f) { return this.map(x => f(x) ? 1 : 0).sum() }

Array.prototype.sum = Array.prototype.sum ||
  function() { return this.reduce((a, b) => a + b, 0)}
