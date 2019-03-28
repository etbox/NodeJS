const router = require('koa-router')()

router
	.get('/', async (ctx, next) => {
		const title = 'Home'
		const userName = 'World'
		const btnLeft = '/Register'
		const btnRight = '/Login'
		await ctx.render('index', {
			title,
			userName,
			btnLeft,
			btnRight,
		})
	})
	.get('/register', async (ctx, next) => {
		const title = 'Register'
		const btnLeft = '/Register'
		const btnRight = '/Login'
		await ctx.render('index', {
			title,
			btnLeft,
			btnRight,
		})
	})
	.get('/start', async (ctx, next) => {
		const result = 'Input To Guess'
		await ctx.render('number-guesser', {
			result,
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
