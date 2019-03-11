const Koa = require('koa')

const app = new Koa()

let num

app.use(async (ctx) => {
	ctx.body = 'Hello World'
	if (ctx.url === '/start') {
		ctx.body = 'OK'
		num = Math.floor(Math.random() * 100)
		// console.log(`start ${num}`)
	} else if (ctx.url.search(/^\/\d{1,3}$/) !== -1) {
		// ctx.body = 'num'
		// console.log(`num ${num}`)
		const guessNum = Number(ctx.url.slice(1))

		if (typeof (num) !== 'undefined') {
			if (guessNum < num) {
				ctx.body = 'smaller'
			} else if (guessNum > num) {
				ctx.body = 'bigger'
			} else {
				ctx.body = 'equal'
			}
		} else {
			ctx.body = 'please enter /start first'
		}
	}
})

app.listen(3000)
