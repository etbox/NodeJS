const router = require('koa-router')()
const redis = require('redis')
const {
	promisify,
} = require('util')

const client = redis.createClient() // 连接redis
const getAsync = promisify(client.get).bind(client) // 使用promise取得redis的数据

async function getNumber() { // 函数定义放外面，不要在函数里定义函数；async表明返回值为Promise
	return getAsync('number')
}

client.on('connect', () => { // 提示已连接redis
	console.log('connected to Redis!')
})

router
	.get('/', async (ctx, next) => {
		console.log('index')
		const title = 'Hello world'
		await ctx.render('index', {
			title,
			index: true,
		})
	})
	.get('/start', async (ctx, next) => {
		const result = 'Input To Guess'
		await ctx.render('number-guesser', {
			result,
		})

		const num = Math.floor(Math.random() * 100)
		client.set('number', num, () => {
			console.log(`random number: ${num}`)
		})
	})
	.post('/:number', async (ctx, next) => {
		const clientNum = Number(ctx.params.number) // 只会在 post 请求触发
		console.log(`clientNum: ${clientNum}`)

		const serverNum = Number(ctx.serverNum)

		let result

		if (Number.isNaN(serverNum)
			|| Number.isNaN(clientNum)) { // 发生意外
			const title = 'Something Goes Wrong'
			await ctx.render('index', {
				title,
				index: false,
			})
		} else {
			if (clientNum < serverNum) {
				result = 'Smaller'
			} else if (clientNum > serverNum) {
				result = 'Bigger'
			} else if (clientNum === serverNum) {
				result = 'Equal'
			}
			await ctx.render('number-guesser', {
				result,
			})
		}
	})

module.exports = {
	route: () => router.routes(),
	getNumber,
}
