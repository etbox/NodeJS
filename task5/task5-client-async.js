const rp = require('request-promise')

const url = 'http://localhost:3000'

async function asyncMain(floor, ceil) {
	let body = await rp({
		uri: `${url}/start`,
	})

	console.log('body:', body)
	if (body.search(/^[A-Za-z]+$/) === -1) {
		throw Error(body)
	}

	let guessNum = Math.floor((floor + ceil) / 2)
	do {
		body = await rp({
			uri: `${url}/${guessNum}`,
		})
		console.log('body:', body)

		if (body === 'smaller') {
			floor = guessNum
			guessNum = Math.floor((guessNum + ceil) / 2)
		} else if (body === 'bigger') {
			ceil = guessNum
			guessNum = Math.floor((guessNum + floor) / 2)
		} else if (body !== 'equal') {
			throw Error(body)
		}
	} while (body !== 'equal')

	return guessNum
}

asyncMain(0, 1000000)
	.then(guessNum => console.log(`Bingo! The number is ${guessNum}`))
	.catch(err => console.log(err))
