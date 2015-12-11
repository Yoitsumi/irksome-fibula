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

  const Hidden    = Symbol("Hidden"),
        Uncovered = Symbol("Uncovered"),
        Marked    = Symbol("Marked")

  var config = {
    width: 10,
    height: 10,
    mines: 98
  }

  var state

  interface Cell { mine: boolean, state: Symbol, td?: Element }

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
        if (playfield[x][y].mine)
          td.classList.add('mine')
        td.textContent = String(countNeighborMines(x, y, playfield))
        tr.appendChild(td)
      })
      $('#playfield').appendChild(tr)
    })
  }

  function countNeighborMines(x: number, y: number, playfield: Cell[][]): number {
    return [-1, 0, 1].flatMap(xx => [-1, 0, 1].map(yy => guard(x+xx, y+yy, playfield).mine ? 1 : 0)).
      reduce((a, b) => a+b)
  }

})

interface Array<T> {
  flatMap<U>(f: (x: T) => U[]): U[]
}
Array.prototype.flatMap = Array.prototype.flatMap ||
  function(f) { return [].concat(... this.map(f)) }
