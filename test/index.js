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

// ---

const myRules = {
	// Optional
	fullname(val) {
		if (!val) return true; // because optional
		return val.trim().length && val.trim().includes(' ') || 'Must be first and last name';
	},
	// RegExp rule
	email: /.+\@.+\..+/,
	// Function, with custom error messages
	password(val) {
		if (!val) return 'Required';
		return val.length >= 8 || 'Must be at least 8 characters';
	},
	// Function, comparing to other value
	confirm(val, data) {
		if (!val) return 'Required';
		return val === data.password || 'Must match your password';
	}
};

test('(validate) all', t => {
	let { form } = toForm({
		name: 'fullname',
		type: 'text',
		value: 'Pocahantas'
	}, {
		name: 'email',
		type: 'email',
		value: '',
	}, {
		name: 'password',
		type: 'password',
		value: 'foobar'
	}, {
		name: 'confirm',
		type: 'password',
		value: 'foo'
	});

	let out = validate(form, myRules);
	t.is(typeof out, 'object', '~> returns an object');
	t.same(out, {
		email: false,
		fullname: 'Must be first and last name',
		password: 'Must be at least 8 characters',
    confirm: 'Must match your password'
  });

  t.true('isValid' in form, 'added "isValid" key to form');
  t.false(form.isValid, '~> is false; had errors');

  form.elements.forEach(elem => {
	  t.true('isValid' in elem, `(${elem.name}) added "isValid" key to form element`);
	  t.is(elem.isValid, out[elem.name] == null, `(${elem.name}).isValid = ${out[elem.name] == null}`);
  });

	t.end();
});

test('(validate) valid', t => {
	let { form } = toForm({
		name: 'fullname',
		type: 'text',
		value: ''
	}, {
		name: 'email',
		value: 'asd@asd.com',
		type: 'email',
	});

	let out = validate(form, {
		fullname: myRules.fullname,
		email: myRules.email,
	});

	t.is(typeof out, 'object', '~> returns an object');
	t.same(out, {});

	t.true('isValid' in form, 'added "isValid" key to form');
  t.true(form.isValid, '~> is true; had no errors');

  ['fullname', 'email'].forEach(name => {
	  t.true('isValid' in form.elements[name], `(${name}) added "isValid" key to form element`);
	  t.true(form.elements[name].isValid, `(${name}).isValid = true`);
  });

	t.end();
});

test('(validate) single', t => {
	let { form } = toForm({
		name: 'fullname',
		type: 'text',
		value: ''
	}, {
		name: 'email',
		value: 'asd.com',
		type: 'email',
	});

	let foo = validate(form, myRules, 'email');
	t.is(typeof foo, 'object', '~> returns an object');
	t.same(foo, { email:false });

	t.false(form.isValid, 'sets form.isValid to false');
	t.false(form.elements.email.isValid, '~> "email" is invalid');
	t.is(form.elements.fullname.isValid, undefined, '~> "fullname" is unknown');

	let bar = validate(form, myRules, 'fullname');
	t.is(typeof bar, 'object', '~> returns an object');
	t.same(bar, {});

	t.true(form.isValid, 'sets form.isValid to TRUE');
	t.false(form.elements.email.isValid, '~> "email" remains invalid');
	t.true(form.elements.fullname.isValid, '~> "fullname" is now valid');

	t.end();
});
