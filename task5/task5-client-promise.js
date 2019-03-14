const rp = require('request-promise')

const url = 'http://localhost:3000'

function sendRequest(floor, ceil, guessNum) {
	return rp({
		uri: `${url}/${guessNum}`,
	})
		.then((body) => {
			console.log('body:', body)
			if (body === 'smaller') {
				return sendRequest(guessNum, ceil, Math.floor((guessNum + ceil) / 2))
			}
			if (body === 'bigger') {
				return sendRequest(floor, guessNum, Math.floor((guessNum + floor) / 2))
			}
			if (body === 'equal') {
				return guessNum
			}
			throw Error(body)
		})
		.catch(err => console.log(err))
}

function promiseMain(floor, ceil) {
	return rp({
		uri: `${url}/start`,
	})
		.then((body) => {
			console.log('body:', body)
			if (body.search(/^[A-Za-z]+$/) === -1) {
				throw Error(body)
			}

			return sendRequest(floor, ceil, Math.floor((floor + ceil) / 2))
		})
		.catch(err => console.log(err))
}

promiseMain(0, 1000000)
	.then(guessNum => console.log(`Bingo! The number is ${guessNum}`))
	.catch(err => console.log(err))
