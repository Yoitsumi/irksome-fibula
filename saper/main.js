"use strict";

var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; })();

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i]; return arr2; } else { return Array.from(arr); } }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

document.addEventListener("DOMContentLoaded", function () {
    var _stateClasses;

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
    var colors = ["", "#0029ff", "#00ff29", "#b53100", "#0b0083", "#5d3800", "#00818e", "#b500ff", "#ffa100"];
    var Hidden = Symbol("Hidden"),
        Uncovered = Symbol("Uncovered"),
        Marked = Symbol("Marked");
    var stateClasses = (_stateClasses = {}, _defineProperty(_stateClasses, Hidden, "hidden"), _defineProperty(_stateClasses, Uncovered, "uncovered"), _defineProperty(_stateClasses, Marked, "marked"), _stateClasses);
    var config = {
        width: 30,
        height: 16,
        mines: 99
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
        leftDown = false;
        rightDown = false;
        ignoreUp = false;
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
                td.setAttribute('x', String(x));
                td.setAttribute('y', String(y));
                updateCell(x, y, playfield);
                tr.appendChild(td);
            });
            $('#playfield').appendChild(tr);
        });
    }
    function neighbors(x, y) {
        return [-1, 0, 1].flatMap(function (xx) {
            return [-1, 0, 1].flatMap(function (yy) {
                var rx = x + xx,
                    ry = y + yy;
                if (rx >= 0 && ry >= 0 && rx < config.width && ry < config.height && !(x == rx && y == ry)) return [[rx, ry]];else return [];
            });
        });
    }
    function countNeighborMines(x, y, playfield) {
        return neighbors(x, y).map(function (_ref) {
            var _ref2 = _slicedToArray(_ref, 2);

            var x = _ref2[0];
            var y = _ref2[1];
            return playfield[x][y].mine ? 1 : 0;
        }).reduce(function (a, b) {
            return a + b;
        }, 0);
    }
    function updateCell(x, y, playfield) {
        var cell = playfield[x][y];
        if (cell.state === Uncovered) {
            var i = countNeighborMines(x, y, state.playfield);
            cell.td.textContent = cell.mine ? "X" : i == 0 ? " " : "" + i;
            cell.td.style.color = colors[i];
        }
        cell.td.className = stateClasses[cell.state];
    }
    var leftDown = false,
        rightDown = false,
        ignoreUp = false;
    $('#playfield').addEventListener('mousedown', function (e) {
        if (e.button === 0) leftDown = true;else if (e.button === 2) rightDown = true;
    }, true);
    $('#playfield').addEventListener('mouseup', function (e) {
        console.log('click');
        var target = e.target;
        if (target.tagName.toLowerCase() === 'td') {
            var x = Number(target.getAttribute('x')),
                y = Number(target.getAttribute('y'));
            if (e.button === 0) leftDown = false;else if (e.button === 2) rightDown = false;
            if (ignoreUp) {
                ignoreUp = false;
                return;
            }
            if (e.button === 0 && rightDown || e.button === 2 && leftDown) {
                auto(x, y, state.playfield);
                if (state.won) init();
                ignoreUp = true;
            } else if (e.button === 0) {
                uncover(x, y, state.playfield);
                if (state.won) init();
            } else if (e.button === 2) mark(x, y, state.playfield);
            e.stopImmediatePropagation();
            e.preventDefault();
        }
    }, true);
    $('#playfield').addEventListener('contextmenu', function (e) {
        return e.preventDefault();
    });
    function uncover(x, y, playfield) {
        if (playfield[x][y].state === Marked) return;
        playfield[x][y].state = Uncovered;
        updateCell(x, y, playfield);
        if (state.playfield[x][y].mine) {
            alert("Lost");
            init();
        } else {
            if (countNeighborMines(x, y, playfield) === 0) neighbors(x, y).forEach(function (c) {
                var _c = _slicedToArray(c, 2);

                var x = _c[0];
                var y = _c[1];var cell = playfield[x][y];
                if (cell.state === Hidden) uncover(x, y, playfield);
            });
            if (!state.won && flatten(playfield).every(function (c) {
                return c.mine || c.state === Uncovered;
            })) {
                alert("Won");
                state.won = true;
            }
        }
    }
    function mark(x, y, playfield) {
        var _Hidden$Marked$Uncovered$playfield$x$y$state;

        playfield[x][y].state = (_Hidden$Marked$Uncovered$playfield$x$y$state = {}, _defineProperty(_Hidden$Marked$Uncovered$playfield$x$y$state, Hidden, Marked), _defineProperty(_Hidden$Marked$Uncovered$playfield$x$y$state, Marked, Hidden), _defineProperty(_Hidden$Marked$Uncovered$playfield$x$y$state, Uncovered, Uncovered), _Hidden$Marked$Uncovered$playfield$x$y$state)[playfield[x][y].state];
        updateCell(x, y, playfield);
        $('#mines').textContent = "" + (config.mines - flatten(playfield).count(function (c) {
            return c.state === Marked;
        }));
    }
    function auto(x, y, playfield) {
        if (playfield[x][y].state === Uncovered && neighbors(x, y).map(function (_ref3) {
            var _ref32 = _slicedToArray(_ref3, 2);

            var x = _ref32[0];
            var y = _ref32[1];
            return playfield[x][y];
        }).count(function (c) {
            return c.state === Marked;
        }) === countNeighborMines(x, y, playfield)) {
            neighbors(x, y).forEach(function (_ref4) {
                var _ref42 = _slicedToArray(_ref4, 2);

                var x = _ref42[0];
                var y = _ref42[1];
                return uncover(x, y, playfield);
            });
        }
    }
});
Array.prototype.flatMap = Array.prototype.flatMap || function (f) {
    var _ref5;

    return (_ref5 = []).concat.apply(_ref5, _toConsumableArray(this.map(f)));
};
Array.prototype.count = Array.prototype.count || function (f) {
    return this.map(function (x) {
        return f(x) ? 1 : 0;
    }).sum();
};
Array.prototype.sum = Array.prototype.sum || function () {
    return this.reduce(function (a, b) {
        return a + b;
    }, 0);
};