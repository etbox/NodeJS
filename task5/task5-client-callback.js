const request = require('request')

const url = 'http://localhost:3000'

function sendRequest(floor, ceil, callback) {
	const guessNum = Math.floor((floor + ceil) / 2)

	request({
		baseUrl: url,
		url: `/${guessNum}`,
	}, (error, response, body) => {
		console.log(`Guess body: ${body}`)
		if (body === 'smaller') {
			sendRequest(guessNum, ceil, callback)
		} else if (body === 'bigger') {
			sendRequest(floor, guessNum, callback)
		} else if (body === 'equal') {
			callback(null, guessNum)
		} else {
			callback(body)
		}
	})
}

function callbackMain(floor, ceil, callback) {
	request({
		baseUrl: url,
		url: '/start',
	}, (error, response, body) => {
		console.log(`Request body: ${body}`)
		try {
			if (body && body.search(/^[A-Za-z]+$/) === -1) { // 如果不返回一个单词就说明游戏没正常启动
				throw Error(body)
			} else if (body) {
				sendRequest(floor, ceil, callback) // 最内层的错误会由callback进行处理，不会抛到本层
			} else {
				throw Error('You send a wrong requst, please modify your URL')
			}
		} catch (err) {
			console.log(err)
		}
	})
}

callbackMain(0, 1000000, (error, num) => {
	if (error) {
		console.log(`Error: ${error}`)
	} else {
		console.log(`Bingo! The number is ${num}`)
	}
})
