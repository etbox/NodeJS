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
		})
	})
	.get('/start', async (ctx, next) => {
		const result = 'Input to guess'
		await ctx.render('number-guesser', {
			result,
		})

		const num = Math.floor(Math.random() * 100)
		client.set('number', num, () => {
			console.log(`random number: ${num}`)
		})
	})
	.get('/:number', async (ctx, next) => {
		const clientNum = Number(ctx.params.number) // 请求favicon.ico时也会触发
		console.log(`clientNum: ${clientNum}`)

		await next() // 等待 redis 取数

		const serverNum = Number(ctx.serverNum)

		let result

		if (ctx.serverNum === null || ctx.serverNum === undefined) { // 服务器出错
			const title = 'Something Goes Wrong'
			await ctx.render('index', {
				title,
			})
		} else if (clientNum < serverNum) {
			result = 'smaller'
			await ctx.render('number-guesser', {
				result,
			})
		} else if (clientNum > serverNum) {
			result = 'bigger'
			await ctx.render('number-guesser', {
				result,
			})
		} else if (clientNum === serverNum) {
			result = 'equal'
			await ctx.render('number-guesser', {
				result,
			})
		}
	})

module.exports = {
	route: () => router.routes(),
	getNumber: async (ctx) => {
		ctx.serverNum = await getNumber()
	},
}
