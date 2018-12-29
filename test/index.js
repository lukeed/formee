const test = require('tape');
const fn = require('../dist/serialize');

test('exports', t => {
	t.is(typeof fn, 'function', 'exports a function');
	t.end();
});
