"use strict";

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i]; return arr2; } else { return Array.from(arr); } }

document.addEventListener("DOMContentLoaded", function () {
    function $(css) {
        return document.querySelector(css);
    }
    function fill(size, elem) {
        return range(0, size).map(function (_) {
            return typeof elem === "function" ? elem() : elem;
        });
    }
    function zip(t, u) {
        return (t.length < u.length ? t : u).map(function (_, i) {
            return [t[i], u[i]];
        });
    }
    function entries(arr) {
        return arr.map(function (e, i) {
            return [i, e];
        });
    }
    function indices(arr) {
        return arr.map(function (_, i) {
            return i;
        });
    }
    function flatten(arr) {
        return arr.flatMap(identity);
    }
    function identity(t) {
        return t;
    }
    function shuffle(arr) {
        for (var i = 0; i < arr.length; i++) {
            var s = Math.random() * arr.length | 0,
                tmp = arr[i];
            arr[i] = arr[s];
            arr[s] = tmp;
        }
        return arr;
    }
    function range(start, end) {
        var step = arguments.length <= 2 || arguments[2] === undefined ? 1 : arguments[2];

        var ret = [];
        for (var i = start; i < end; i += step) {
            ret.push(i);
        }return ret;
    }
    function take(arr, c) {
        return arr.slice(0, c);
    }
    $('#btn-settings').addEventListener('click', function (e) {
        $('#settings').classList.add('active');
    });
    var Hidden = Symbol("Hidden"),
        Uncovered = Symbol("Uncovered"),
        Marked = Symbol("Marked");
    var config = {
        width: 10,
        height: 10,
        mines: 98
    };
    var state;
    function guard(x, y, playfield) {
        if (x >= 0 && y >= 0 && x < playfield.length && y < playfield[x].length) return playfield[x][y];else return { mine: false, state: Hidden };
    }
    function init() {
        var playfield = fill(config.width, function () {
            return fill(config.height, function () {
                return { mine: false, state: Hidden };
            });
        });
        var freeCells = flatten(playfield);
        take(shuffle(freeCells), config.mines).forEach(function (c) {
            return c.mine = true;
        });
        prepareTable(config.width, config.height, playfield);
        state = { playfield: playfield };
    }
    init();
    function prepareTable(w, h, playfield) {
        console.log("prepareTable(" + w + ", " + h + ")");
        while ($('#playfield').firstChild) $('#playfield').removeChild($('#playfield').firstChild);
        range(0, h).forEach(function (y) {
            var tr = document.createElement('tr');
            range(0, w).forEach(function (x) {
                var td = document.createElement('td');
                playfield[x][y].td = td;
                if (playfield[x][y].mine) td.classList.add('mine');
                td.textContent = String(countNeighborMines(x, y, playfield));
                tr.appendChild(td);
            });
            $('#playfield').appendChild(tr);
        });
    }
    function countNeighborMines(x, y, playfield) {
        return [-1, 0, 1].flatMap(function (xx) {
            return [-1, 0, 1].map(function (yy) {
                return guard(x + xx, y + yy, playfield).mine ? 1 : 0;
            });
        }).reduce(function (a, b) {
            return a + b;
        });
    }
});
Array.prototype.flatMap = Array.prototype.flatMap || function (f) {
    var _ref;

    return (_ref = []).concat.apply(_ref, _toConsumableArray(this.map(f)));
};