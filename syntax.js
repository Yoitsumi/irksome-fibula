function main() {
	var input = window.prompt("Podaj liczbę")

	document.getElementById("input-prime").innerHTML = input
	document.getElementById("input-factorial").innerHTML = input
	document.getElementById("input-parity").innerHTML = input
	document.getElementById("input-primes").innerHTML = input

	document.getElementById("prime").innerHTML = prime(input) ? "jest" : "nie jest"
	document.getElementById("factorial").innerHTML = factorial(input)
	document.getElementById("parity").innerHTML = (input % 2 == 0) ? "jest" : "nie jest"
	document.getElementById("primes").innerHTML = primes(input).join(" ")

}

function prime(num) {
	if(num == 0 || num == 1)
		return false
	if(num == 2)
		return true
	var until = Math.sqrt(num)
	for(var i=2; i<until; i+=2) {
		if(num % i == 0)
			return false
	}
	return true
}

function factorial(num) {
	var ret = 1
	for(var i=2; i<=num; i++) {
		ret *= i
	}
	return ret
}

function primes(num) {
	var ret = []
	for(var i = 2; ret.length < num; i++) {
		var prime = true
		for(var j=0; j<ret.length; j++) {
			if(i % ret[j] === 0) {
				prime = false
				break
			}
		}
		if(prime) ret.push(i)
	}
	return ret
}
