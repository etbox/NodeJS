const request = require('request')

const url = 'http://localhost:3000'
const floor = 0
const ceil = 1000000
const guessNum = Math.floor((floor + ceil) / 2)

function sendRequest(num, flr, cel) {
	request({
		baseUrl: url,
		url: `/${num}`,
	}, (error, response, body) => {
		console.log('body:', body) // Print the HTML for the homepage.
		if (body === 'smaller') {
			// flr = num
			// num = Math.floor((num + cel) / 2)
			sendRequest(Math.floor((num + cel) / 2), num, cel)
		} else if (body === 'bigger') {
			// cel = num
			// num = Math.floor((num + flr) / 2)
			sendRequest(Math.floor((num + flr) / 2), flr, num)
		} else if (body === 'equal') {
			console.log(`Bingo! The number is ${num}`)
		} else {
			throw Error(body)
		}
	})
}

request({
	baseUrl: url,
	url: '/start',
}, (error, response, body) => {
	console.log('error:', error) // Print the error if one occurred
	console.log('statusCode:', response && response.statusCode) // Print the response status code if a response was received
	console.log('body:', body) // Print the HTML for the homepage.
	sendRequest(guessNum, floor, ceil)
})
