(function(){

	var $ = function(a, b) {
		if(b==undefined) {
			b = a
			a = document
		}
		return a.querySelector(b)
	}
	function $$(a, b) {
		if(b==undefined) {
			b = a
			a = document
		}
		return a.querySelectorAll(b)
	}

	var DaysOfWeek = [
		"Niedziela", "Poniedziałek", "Wtorek", "Środa", "Czwartek", "Piątek", "Sobota", 10
	]
	var MonthNames = [
		"Styczeń", "Luty", "Marzec", "Kwiecień", "Maj", "Czerwiec", "Lipiec", "Sierpień", "Wrzesień", "Październik", "Listopad", "Grudzień"
	]
	var kanji = [
		'〇', '一', '二', '三', '四', '五', '六', '七', '八', '九'
	]

	window.addEventListener('DOMContentLoaded', function(){
		(function() {
			var $main = $('#one')
			var date = new Date()
			$($main, '.dow').textContent = DaysOfWeek[date.getDay()]
			$($main, '.dom').textContent = date.getDate()
			$($main, '.month').textContent = MonthNames[date.getMonth()]
			$($main, '.year').textContent = date.getFullYear()
		})()


		function clockTick() {
			var $main = $('#two')
			var date = new Date()
			function digit(n) {
				return $($main, '.digit:nth-child('+n+')')
			}
			digit(1).textContent = kanji[(date.getHours()/10)|0]
			digit(2).textContent = kanji[date.getHours()%10]
			digit(3).textContent = kanji[(date.getMinutes()/10)|0]
			digit(4).textContent = kanji[date.getMinutes()%10]
			digit(5).textContent = kanji[(date.getSeconds()/10)|0]
			digit(6).textContent = kanji[date.getSeconds()%10]
		}
		setInterval(clockTick, 1000)

		function analogTick() {
			var c = $('#three').getContext('2d')
			c.lineCap = "round"
			c.lineJoin = "round"

			var date = new Date()

			c.clearRect(0, 0, 200, 200)

			var sec = (date.getSeconds() / 60) * 2 * Math.PI

			// c.lineWidth = 10
			// c.strokeStyle = "black"
			var hour = (date.getHours() / 60) * 2 * Math.PI
			// c.beginPath()
			// c.moveTo(100, 100)
			// c.lineTo(100 + Math.cos(hour)*50, 100 + Math.sin(hour)*50)
			// c.stroke()

			// c.strokeStyle = "black"
			var min = (date.getMinutes() / 60) * 2 * Math.PI
			// c.beginPath()
			// c.moveTo(100, 100)
			// c.lineTo(100 + Math.cos(min)*80, 100 + Math.sin(min)*80)
			// c.stroke()


			// c.strokeStyle = "red"
			// c.lineWidth = 5
			// c.beginPath()
			// c.moveTo(100, 100)
			// c.lineTo(100 + Math.cos(sec)*90, 100 + Math.sin(sec)*90)
			// c.stroke()

			c.lineWidth = 10
			c.beginPath()
			c.moveTo(100, 100)
			c.lineTo(100 + Math.cos(hour)*50, 100 + Math.sin(hour)*50)
			c.moveTo(100, 100)
			c.lineTo(100 + Math.cos(min)*80, 100 + Math.sin(min)*80)
			c.moveTo(100, 100)
			c.lineTo(100 + Math.cos(sec)*90, 100 + Math.sin(sec)*90)
			c.stroke()

		}
		setInterval(analogTick, 1000)

		function updateNixie(div, n) {
			div.style.backgroundPosition = -n*62 + "px 0"
		}
		window.updateNixie = updateNixie

		function nixieTick() {
			var nixies = document.querySelectorAll('#four .digit')
			var date = new Date()
			updateNixie(nixies[0], date.getHours()/10|0)
			updateNixie(nixies[1], date.getHours()%10)
			updateNixie(nixies[2], (date.getMinutes()/10)|0)
			updateNixie(nixies[3], date.getMinutes()%10)
			updateNixie(nixies[4], (date.getSeconds()/10)|0)
			updateNixie(nixies[5], date.getSeconds()%10)
		}
		setInterval(nixieTick, 1000)
	})

})()
