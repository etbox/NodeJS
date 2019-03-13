const rp = require('request-promise')

const url = 'http://localhost:3000'
let guessNum = 500000
let floor = 0
let ceil = 1000000

function sendRequest() {
	return rp({
		uri: `${url}/${guessNum}`,
	})
		.then((body) => {
			// Process html...
			console.log('body:', body)
			if (body === 'smaller') {
				floor = guessNum
				guessNum = Math.floor((guessNum + ceil) / 2)
				return sendRequest()
			}
			if (body === 'bigger') {
				ceil = guessNum
				guessNum = Math.floor((guessNum + floor) / 2)
				return sendRequest()
			}
			if (body === 'equal') {
				console.log(`Bingo! The number is ${guessNum}`)
			} else {
				throw Error
			}
		})
		.catch((err) => {
			// Crawling failed...
			console.log(err)
		})
}

rp({
	uri: `${url}/start`,
})
	.then((body) => {
		// Process html...
		console.log('body:', body)
		return sendRequest()
	})
	.catch((err) => {
		// Crawling failed...
		console.log(err)
	})
