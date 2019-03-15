const rp = require('request-promise')

const url = 'http://localhost:3000'

function sendRequest(floor, ceil) {
	const guessNum = Math.floor((floor + ceil) / 2)

	return rp({
		uri: `${url}/${guessNum}`,
	})
		.then((body) => {
			console.log(`Guess body: ${body}`)
			if (body === 'smaller') {
				return sendRequest(guessNum, ceil)
			}
			if (body === 'bigger') {
				return sendRequest(floor, guessNum)
			}
			if (body === 'equal') {
				return guessNum
			}
			throw Error(body)
		}) // 这里的catch是没有意义的，因为这里是递归调用，反而会让调用者不知道在哪层出现了错误
	// .catch((err) => {
	// 	console.log(i++) // 每层i都会自增，在返回上层的时候每次都会输出
	// 	throw err
	// })
}

function promiseMain(floor, ceil) {
	return rp({
		uri: `${url}/start`,
	})
		.then((body) => {
			console.log(`Request body: ${body}`)
			if (body && body.search(/^[A-Za-z]+$/) === -1) { // 如果不返回一个单词就说明游戏没正常启动
				throw Error(body)
			} else if (body) { // 如果抛出异常，最外层会进行处理
				return sendRequest(floor, ceil)
			} else { // 原则上内层异常尽量抛出给外层处理，视具体需求在本层处理
				throw Error('Please modify your URL')
			}
		})
}

promiseMain(0, 1000000)
	.then(guessNum => console.log(`Bingo! The number is ${guessNum}`))
	.catch(err => console.log(`Something goes wrong: ${err}`))
