const should = require('should') // 不保存为变量也会给 Object.prototype 扩展一个不可枚举的访问器
const rp = require('request-promise')

const url = 'http://localhost:3000'

describe('"测试套件"（test suite）', () => {
	it('"测试用例"（test case）', () => {
		should(5).be.exactly(5).and.be.a.Number()
	})
})

describe('接口测试', () => {
	it('request /start', () => {
		rp({
			uri: `${url}/start`,
		}).then((body) => {
			body.should.be.equal('OK')
		})
	})

	it('request /:number', () => {
		rp({
			uri: `${url}/50`,
		}).then((body) => {
			body.should.be.equalOneOf('smaller', 'bigger', 'equal')
		})
	})
})

describe('完整玩一遍', () => {
	function sendRequest(floor, ceil) { // 由 task5 改编
		const guessNum = Math.floor((floor + ceil) / 2)

		return rp({
			uri: `${url}/${guessNum}`,
		})
			.then((body) => {
				if (body === 'smaller') {
					return sendRequest(guessNum, ceil)
				}
				if (body === 'bigger') {
					return sendRequest(floor, guessNum)
				}
				if (body === 'equal') {
					return body
				}
				throw Error(body)
			})
	}

	it('从 /start 开始后进行递归，最终得到答案', () => {
		rp({
			uri: `${url}/start`,
		})
			.then(() => sendRequest(0, 100))
			.then(body => body.should.be.exactly('equal'))
	})
})
