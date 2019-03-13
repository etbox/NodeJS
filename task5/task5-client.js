const request = require('request')

const url = 'http://localhost:3000'
const guessNum = 500000

request({
	baseUrl: url,
	url: `/${guessNum}`,
}, (error, response, body) => {
	console.log('error:', error) // Print the error if one occurred
	console.log('statusCode:', response && response.statusCode) // Print the response status code if a response was received
	console.log('body:', body) // Print the HTML for the homepage.
})
