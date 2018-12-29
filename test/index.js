const test = require('tape');
const formee = require('../dist/formee');

test('exports', t => {
	t.is(typeof formee, 'object', 'exports a object');
	t.is(typeof formee.serialize, 'function', '~> has "serialize" function');
	t.end();
});
