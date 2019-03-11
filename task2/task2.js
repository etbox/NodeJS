const Koa = require('koa')
const Router = require('koa-router')

const app = new Koa()
const router = new Router()

let num

router.get('/', (ctx, next) => {
	// ctx.router available
	ctx.body = 'Hello World'
}).get('/start', (ctx, next) => {
	ctx.body = 'OK'
	num = Math.floor(Math.random() * 100)
	console.log(num)
}).get('/:number', (ctx, next) => {
	if (typeof (num) !== 'undefined') {
		if (ctx.params.number < num) {
			ctx.body = 'smaller'
		} else if (ctx.params.number > num) {
			ctx.body = 'bigger'
		} else {
			ctx.body = 'equal'
		}
	} else {
		ctx.body = 'please enter /start first'
	}
})

app
	.use(router.routes())
	.use(router.allowedMethods())
	.listen(3000)
