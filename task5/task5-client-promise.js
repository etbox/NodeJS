const rp = require('request-promise')

const url = 'http://localhost:3000'
const floor = 0
const ceil = 1000000
const guessNum = Math.floor((floor + ceil) / 2)

function sendRequest([flr, cel, num]) {
	return rp({
		uri: `${url}/${num}`,
	})
		.then((body) => {
			// Process html...
			console.log('body:', body)
			if (body === 'smaller') {
				return sendRequest([num, cel, Math.floor((num + cel) / 2)])
			}
			if (body === 'bigger') {
				return sendRequest([flr, num, Math.floor((num + flr) / 2)])
			}
			if (body === 'equal') {
				console.log(`Bingo! The number is ${num}`)
				return null
			}
			throw Error(body)
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
		return sendRequest([floor, ceil, guessNum])
	})
	.catch((err) => {
		// Crawling failed...
		console.log(err)
	})
