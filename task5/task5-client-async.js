const rp = require('request-promise')

const url = 'http://localhost:3000'
let guessNum = 500000
let floor = 0
let ceil = 1000000

async function sendRequest() {
	const body = await rp({
		uri: `${url}/${guessNum}`,
	})

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
}

async function main() {
	const body = await rp({
		uri: `${url}/start`,
	})

	// Process html...
	console.log('body:', body)
	sendRequest()
}

main()
