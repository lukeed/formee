require('undom/register');
const test = require('tape');
const { toForm } = require('./utils');
const formee = require('../dist/formee');
const { bind, serialize, validate } = formee;

test('exports', t => {
	t.is(typeof formee, 'object', 'exports a object');
	['serialize', 'validate', 'bind'].forEach(k => {
		t.is(typeof formee[k], 'function', `~> has "${k}" function`);
	});
	t.end();
});

test('(serialize) input[text]', t => {
	let { form, values } = toForm({
		type: 'text',
		name: 'hello',
		value: 'foo'
	}, {
		type: 'text',
		name: 'world',
		value: 'bar'
	});
	let output = serialize(form);
	t.is(typeof output, 'object', '~> returns an object');
	t.same(output, values);
	t.end();
});

test('(serialize) input[checkbox]', t => {
	let { form, values } = toForm({
		checked: false,
		type: 'checkbox',
		name: 'foobar',
		value: 'foo'
	}, {
		checked: true,
		type: 'checkbox',
		name: 'foobar',
		value: 'bar'
	}, {
		checked: true,
		type: 'checkbox',
		name: 'foobar',
		value: 'baz'
	});
	let output = serialize(form);
	t.is(typeof output, 'object', '~> returns an object');
	t.same(output, values);
	t.end();
});

test('(serialize) input[radio]', t => {
	let { form, values } = toForm({
		checked: false,
		type: 'radio',
		name: 'foobar',
		value: 'foo'
	}, {
		checked: true,
		type: 'radio',
		name: 'foobar',
		value: 'bar'
	}, {
		checked: false,
		type: 'radio',
		name: 'foobar',
		value: 'baz'
	}, {
		checked: true,
		type: 'radio',
		name: 'hello',
		value: '1'
	});
	let output = serialize(form);
	t.is(typeof output, 'object', '~> returns an object');
	t.same(output, values);
	t.end();
});

test('(serialize) select', t => {
	let { form, values } = toForm({
		tag: 'select',
		name: 'hello',
		value: ''
	}, {
		tag: 'select',
		name: 'world',
		value: 'foobar'
	});
	let output = serialize(form);
	t.is(typeof output, 'object', '~> returns an object');
	t.same(output, values);
	t.end();
});

test('(serialize) select', t => {
	let { form, values } = toForm({
		tag: 'select',
		name: 'hello',
		value: ''
	}, {
		tag: 'select',
		name: 'world',
		value: 'foobar'
	});
	let output = serialize(form);
	t.is(typeof output, 'object', '~> returns an object');
	t.same(output, values);
	t.end();
});

test('(serialize) select[multiple]', t => {
	let { form, values } = toForm({
		tag: 'select',
		type: 'select-multiple', // required
		name: 'hello',
		multiple: true,
		value: '',
		options: [{
			value: 'foo',
			selected: false
		}, {
			value: 'bar',
			selected: false
		}, {
			value: 'world',
			selected: true
		}, {
			value: 'baz',
			selected: true
		}]
	});
	let output = serialize(form);
	t.is(typeof output, 'object', '~> returns an object');
	t.same(output, values);
	t.end();
});

test('(serialize) ignores', t => {
	let { form } = toForm({
		name: '',
		type: 'text',
		value: 'noName'
	}, {
		name: 'foo',
		type: 'button',
		value: 'isButton'
	}, {
		name: 'bar',
		type: 'reset',
		value: 'isReset'
	}, {
		name: 'baz',
		type: 'file',
		value: 'isFile'
	}, {
		name: 'bat',
		type: 'text',
		disabled: true,
		value: 'disabled'
	});
	let output = serialize(form);
	t.is(typeof output, 'object', '~> returns an object');
	t.same(output, {});
	t.end();
});

test('(serialize) specials', t => {
	let { form } = toForm({
		name: 'foo',
		type: 'text',
		value: 0
	}, {
		name: 'foo',
		type: 'text',
		value: ''
	}, {
		name: 'foo',
		type: 'text',
		value: 0
	}, {
		name: 'bar',
		type: 'radio',
		checked: true,
		value: 0
	}, {
		name: 'bar',
		type: 'radio',
		checked: true,
		value: 'on'
	}, {
		name: 'bar',
		type: 'radio',
		checked: true,
		value: 0
	}, {
		name: 'baz',
		type: 'checkbox',
		checked: true,
		value: 'on'
	}, {
		name: 'baz',
		type: 'checkbox',
		checked: true,
		value: 0
	}, {
		name: 'baz',
		type: 'checkbox',
		checked: true,
		value: 'hello'
	});
	let output = serialize(form);
	t.is(typeof output, 'object', '~> returns an object');
	t.same(output, {
		foo: [0, 0],
		bar: [0, true, 0],
		baz: [true, 0, 'hello']
	});
	t.end();
});
