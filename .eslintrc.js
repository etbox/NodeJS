module.exports = {
	'env': {
		'browser': true,
		'es6': true,
		'node': true,
		'mocha': true
	},
	'extends': 'airbnb-base',
	'globals': {
		'Atomics': 'readonly',
		'SharedArrayBuffer': 'readonly'
	},
	'parserOptions': {
		'ecmaVersion': 2018,
		'sourceType': 'module'
	},
	'rules': {
		"no-tabs": 0,
		'indent': [
			'error',
			'tab'
		],
		'linebreak-style': [
			'error',
			'unix'
		],
		'quotes': [
			'error',
			'single'
		],
		'semi': [
			'error',
			'never'
		],
		"no-console": "off",
	}
}