(function(){

	var resulta, resultb, resultc, resultd

	window.addEventListener('DOMContentLoaded', function () {

		resulta = document.querySelector('#result-a')
		resultb = document.querySelector('#result-b')
		resultc = document.querySelector('#result-c')
		resultd = document.querySelector('#result-d')
		var input = document.querySelector('input#input')

		input.addEventListener('change', regenerateOutputs)
		document.querySelector('#ok').addEventListener('click', regenerateOutputs)

		function regenerateOutputs() {
			generate(input.value, resulta, styleWave(10, 20, 50))
			generate(input.value, resultb, squareWave(10, 20, 50))
			generate(input.value, resultc, squareWave(2, 20, 50))
			generate(input.value, resultd, sawWave(10, 50, 5))
		}

	})

	function styleWave(width, min, max) {
		var colors = ['Red', 'Orange', 'Yellow', 'Green', 'Blue', 'Indigo', 'Violet']
		return function(i) {
			i %= width
			var amplitude = max - min
			var size
			if(i > width/2)
				size = max - (i-width/2)/(width/2) * amplitude
			else
				size = min + i/(width/2) * amplitude

			return "font-size: "+size+"px; text-shadow: 0 0 5px "+colors[i%colors.length]+";"
		}
	}

	function sawWave(width, min, max) {
		return function(i) {
			i %= width
			var size = (max - min) * (i / width) + min
			return "font-size: "+size+"px;"
		}
	}

	function squareWave(width, min, max) {
		return function(i) {
			i %= width
			var size
			if(i < width/2)
				size = min
			else
				size = max
			return "font-size: "+size+"px;"
		}
	}

	function generate(msg, parent, style) {
		while(parent.firstChild) {
			parent.removeChild(parent.firstChild)
		}
		for(var i = 0; i < msg.length; i++) {
			var span = document.createElement('span')
			span.textContent = msg[i]
			span.style = style(i)
			parent.appendChild(span)
		}
	}

})()
