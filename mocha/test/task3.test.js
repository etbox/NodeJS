const should = require('should')

describe('"测试套件"（test suite）', () => {
	it('"测试用例"（test case）', () => {
		(5).should.be.exactly(5).and.be.a.Number()
	})
})
