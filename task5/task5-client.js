const request = require('request')

const url = 'http://localhost:3000'
let guessNum = 500000
let floor = 0
let ceil = 1000000

function sendRequest() {
	request({
		baseUrl: url,
		url: `/${guessNum}`,
	}, (error, response, body) => {
		console.log('body:', body) // Print the HTML for the homepage.
		if (body === 'smaller') {
			floor = guessNum
			guessNum = Math.floor((guessNum + ceil) / 2)
			sendRequest()
		} else if (body === 'bigger') {
			ceil = guessNum
			guessNum = Math.floor((guessNum + floor) / 2)
			sendRequest()
		} else if (body === 'equal') {
			console.log(`Bingo! The number is ${guessNum}`)
		} else {
			throw Error
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
	sendRequest()
})
