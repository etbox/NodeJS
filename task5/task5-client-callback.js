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
		} else { // callback 的第一个参数就是 Error 类型，故要封装一下
			callback(new Error(body))
		}
	})
}

function callbackMain(floor, ceil, callback) {
	request({
		baseUrl: url,
		url: '/start',
	}, (error, response, body) => { // try/catch 和 throw 是同步处理，异步函数在callback 里面处理
		console.log(`Request body: ${body}`)
		if (body && body.search(/^[A-Za-z]+$/) === -1) { // 如果不返回一个单词就说明游戏没正常启动
			callback(new Error(body))
		} else if (body) {
			sendRequest(floor, ceil, callback) // 最内层的错误会由callback进行处理，不会抛到本层
		} else {
			callback(new Error('You send a wrong requst, please modify your URL'))
		}
	})
}

callbackMain(0, 1000000, (error, num) => {
	if (error) {
		console.log(`Something goes wrong: ${error.stack}`)
	} else {
		console.log(`Bingo! The number is ${num}`)
	}
})
