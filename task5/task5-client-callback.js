const request = require('request')

const url = 'http://localhost:3000'

function sendRequest(floor, ceil, guessNum) {
	request({
		baseUrl: url,
		url: `/${guessNum}`,
	}, (error, response, body) => {
		console.log('body:', body)
		if (body === 'smaller') {
			sendRequest(guessNum, ceil, Math.floor((guessNum + ceil) / 2))
		} else if (body === 'bigger') {
			sendRequest(floor, guessNum, Math.floor((guessNum + floor) / 2))
		} else if (body === 'equal') {
			console.log(`Bingo! The number is ${guessNum}`)
		} else {
			throw Error(body)
		}
	})
}


function callbackMain(floor, ceil, callback) {
	request({
		baseUrl: url,
		url: '/start',
	}, (error, response, body) => {
		console.log('body:', body)
		if (body.search(/^[A-Za-z]+$/) === -1) {
			throw Error(body)
		}

		callback(floor, ceil, Math.floor((floor + ceil) / 2)) // callback形式无法返回最终值，除非使用全局变量或者传递的参数为对象
	})
}

callbackMain(0, 1000000, sendRequest)
