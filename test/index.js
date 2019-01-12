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

// ---

test('(bind) mutations', t => {
	let { form } = toForm();
	let arr = ['serialize', 'validate', 'onsubmit'];

	arr.forEach(key => {
		// not true of `onsubmit` in real world, but true here
		t.is(form[key], undefined, `form.${key} does not initially exist`);
	});

	let out = bind(form);
	t.same(out, form, '~> sends back the <form/> value');

	arr.forEach(key => {
		t.ok(form[key], `form.${key} property added`);
		t.is(typeof form[key], 'function', '~> is a function');
	});

	t.end();
});

test('(bind) serialize', t => {
	let { form } = toForm({
		type: 'text',
		name: 'hello',
		value: ''
	}, {
		type: 'text',
		name: 'world',
		value: 'foobar'
	});

	bind(form);

	t.same(form.serialize(), serialize(form), '~> output identical to serialize()');

	t.end();
});

test('(bind) validate', t => {
	let { form } = toForm({
		type: 'password',
		name: 'password',
		value: 'foobar'
	}, {
		type: 'password',
		name: 'confirm',
		value: 'abc'
	});

	let rules = {
		password: myRules.password,
		confirm: myRules.confirm
	};

	bind(form, { rules });
	let all = form.validate();

	t.true(form.isValid !== void 0, 'adds "isValid" property to form');
	t.false(form.isValid, '~> form marked as invalid');

	t.is(typeof all, 'object', '(all) returns an object');
	t.same(all, validate(form, rules), '~> identical to validate() call');

	let one = form.validate('password');
	t.is(typeof one, 'object', '(one) returns an object');
	t.same(one, validate(form, rules, 'password'), '~> identical to validate() call');

	t.end();
});

test('(bind) onsubmit', t => {
	t.plan(23);

	let { form } = toForm({
		type: 'password',
		name: 'password',
		value: 'foobar'
	}, {
		type: 'password',
		name: 'confirm',
		value: 'abc'
	});

	let rules = {
		password: myRules.password,
		confirm: myRules.confirm
	};

	function onSubmit(ev) {
		t.pass('calls "onSubmit" callback');
		t.is(typeof ev, 'object', '~> receives Event object'); // fake here
		t.true(ev.errors !== void 0, '~> adds "errors" property to Event');
		t.same(ev.errors, validate(form, rules), '~~> identical to validate() output');
		t.same(ev.errors, form.errors, '~> "errors" property is empty object');

		t.true(form.isValid, 'form was marked as valid!');
		t.true(form.errors !== void 0, '~> adds "errors" property to form');
		t.same(form.errors, ev.errors, '~> form "errors" matches `ev.errors` value');

		return 'onSubmit output';
	}

	function onError(ev) {
		t.pass('calls "onError" callback');
		t.is(typeof ev, 'object', '~> receives Event object'); // fake here
		t.true(ev.errors !== void 0, '~> adds "errors" property to Event');
		t.same(ev.errors, validate(form, rules), '~~> identical to validate() output');
		t.same(ev.errors, form.errors, '~> "errors" property is empty object');

		t.false(form.isValid, 'form was marked as invalid!');
		t.true(form.errors !== void 0, '~> adds "errors" property to form');
		t.same(form.errors, ev.errors, '~> form "errors" matches `ev.errors` value');

		return 'onError output';
	}

	let event = {
		preventDefault() {
			t.pass('calls "preventDefault" on submit event'); //=> x3
		}
	};

	// Missing Options
	// > TypeError: opts.onSubmit is not a function
	console.log(' '); // spacer
	bind(form, { rules });
	t.throws(() => form.onsubmit(event), TypeError, 'throws TypeError if "onSubmit" or "onError" are missing!');

	// Complete Options: Invalid Form
	console.log(' '); // spacer
	bind(form, { rules, onSubmit, onError });
	t.doesNotThrow(() => {
		let foo = form.onsubmit(event);
		t.is(foo, 'onError output', '~> returns output from "onError" directly');
	}, TypeError, 'does not throw TypeError when "onSubmit" and "onError" are defined');

	// Cleanup: Change form values & reset event
	form.elements.password.value = form.elements.confirm.value = 'password123';
	delete event.errors; // reset

	// Complete Options: Valid Form
	let bar = form.onsubmit(event);
	t.is(bar, 'onSubmit output', '~> returns output from "onSubmit" directly');
});
