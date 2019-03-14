const rp = require('request-promise')

const url = 'http://localhost:3000'
let floor = 0
let ceil = 1000000
let guessNum = Math.floor((floor + ceil) / 2)

async function main() {
	let body = await rp({
		uri: `${url}/start`,
	})

	// Process html...
	console.log('body:', body)
	if (body.search(/^[A-Za-z]+$/) === -1) {
		throw Error(body)
	}

	do {
		body = await rp({ // 使用循环才需要改变全局变量，因为不会产生局部变量
			uri: `${url}/${guessNum}`,
		})

		console.log('body:', body)

		if (body === 'smaller') {
			floor = guessNum
			guessNum = Math.floor((guessNum + ceil) / 2)
		}
		if (body === 'bigger') {
			ceil = guessNum
			guessNum = Math.floor((guessNum + floor) / 2)
		}
	} while (body !== 'equal')

	console.log(`Bingo! The number is ${guessNum}`)
}

main()
