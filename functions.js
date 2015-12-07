(function(){
	window.addEventListener('DOMContentLoaded', function(){

		var $ = function(s) { return document.querySelector(s) }

		var one = {
			contents: ['1', '2', '4'],
			state: 0
		}

		window.setInterval(function(){
			$('#target1').textContent = one.contents[one.state]
			one.state++
			one.state %= one.contents.length
		}, 1000)


		var two = {
			contents: [
				"http://www.fractalsciencekit.com/fractals/large/Fractal-Mobius-Dragon-IFS-04.jpg",
				"http://i.kinja-img.com/gawker-media/image/upload/kynkw3shz8y768tm7tbw.jpg",
				//"http://www.allthatglittersbook.com/wp-content/uploads/2013/03/Fractal1.jpg",
				"http://weirdscience.eu/images/f/f6e39c2f0143549a2f220e51e0f7dd0d.jpeg"
			],
			state: 0
		}

		window.setInterval(function(){
			$('#target2').src = two.contents[two.state]
			two.state++
			two.state %= two.contents.length
		}, 1000)

		var three = {
			ascending: true
		}
		$('#target3').style.width = "50px"
		window.setInterval(function(){
			var width = $('#target3').style.width.match(/[0-9]+/)[0]
			width = +width + (three.ascending ? +10 : -10)
			if(width == 200 || width == 50)
				three.ascending = !three.ascending
			$('#target3').style.width = width+"px"
		}, 100)


		window.setInterval(function(){
			if($('#target4') != document.activeElement) {
				var value = $('#target4').value
				$('#target4').value = value.substring(1) + value[0]
			}
		}, 100)

		var five = {
			alpha: 0,
			max: 296
		}
		window.setInterval(function(){
			var w = Math.sin(five.alpha) * five.max
			five.alpha += 0.1
			if(w < 0) $('#target5').className = 'mirror'
			else $('#target5').className = ''
			$('#target5').style.width = Math.abs(w)+"px"
			$('#target5').style.left = 200 + (five.max - Math.abs(w))/2 + "px"
		}, 10)


	})
})()
