const router = require('koa-router')()

router
	.get('/', async (ctx, next) => {
		const result = 'Press To Start ↗'
		await ctx.render('number-guesser', {
			result,
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

		if (Number.isNaN(serverNum) || Number.isNaN(clientNum)) {
			// 发生意外
			result = 'Something Goes Wrong'
			await ctx.render('number-guesser', {
				result,
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
}
