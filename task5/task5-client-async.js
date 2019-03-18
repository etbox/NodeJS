const rp = require('request-promise')

const url = 'http://localhost:3000'

async function sendRequest(floor, ceil) {
	const guessNum = Math.floor((floor + ceil) / 2)
	const body = await rp({
		uri: `${url}/${guessNum}`,
	})

	console.log(`Guess body: ${body}`)
	if (body === 'smaller') { // 不必加 await，因为 async 会将其封装为 promise
		return sendRequest(guessNum, ceil)
	}
	if (body === 'bigger') {
		return sendRequest(floor, guessNum)
	}
	if (body === 'equal') {
		return guessNum
	}
	throw Error(body)
}

async function asyncMain(floor, ceil) {
	const body = await rp({ // await会把错误向外层抛，故不用专门处理
		uri: `${url}/start`,
	})

	console.log(`Request body: ${body}`)
	if (body && body.search(/^[A-Za-z]+$/) === -1) { // 如果不返回一个单词就说明游戏没正常启动
		throw Error(body)
	} else if (!body) {
		throw Error('Please modify your URL')
	}

	return sendRequest(floor, ceil)
}

asyncMain(0, 1000000) // async 是把异步的处理写成同步的样子，故错误处理用 try/catch
	.then(guessNum => console.log(`Bingo! The number is ${guessNum}`))
	.catch(err => console.log(`Something goes wrong: ${err.stack}`))
