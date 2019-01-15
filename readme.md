<div align="center">
  <img src="logo.png" alt="formee" height="120" />
</div>

<div align="center">
  <a href="https://npmjs.org/package/formee">
    <img src="https://badgen.now.sh/npm/v/formee" alt="version" />
  </a>
  <a href="https://travis-ci.org/lukeed/formee">
    <img src="https://badgen.now.sh/travis/lukeed/formee" alt="travis" />
  </a>
  <a href="https://npmjs.org/package/formee">
    <img src="https://badgen.now.sh/npm/dm/formee" alt="downloads" />
  </a>
  <a href="https://bundlephobia.com/result?p=formee">
    <img src="https://badgen.net/badgesize/brotli/https://unpkg.com/formee?label=brotli" alt="install size" />
  </a>
</div>

<div align="center">A tiny (532B) library for handling &#60;form&#62; elements</div>

## Features

* Includes `serialize` and `validation` methods
* Compatible with any UI library
* Fully [tree-shakeable](https://developer.mozilla.org/en-US/docs/Glossary/Tree_shaking)

Additionally, this module is delivered as:

* **ES Module**: [`dist/formee.mjs`](https://unpkg.com/formee/dist/formee.mjs)
* **CommonJS**: [`dist/formee.js`](https://unpkg.com/formee/dist/formee.js)
* **UMD**: [`dist/formee.min.js`](https://unpkg.com/formee)


## Install

```
$ npm install --save formee
```


## Usage

> :wave: [_View a full demo on Codepen_](https://codepen.io/lukeed/pen/dwKWVa)

```html
<form id="foo">
  <h2>Register</h2>
  <input type="email" name="email" />
  <input type="password" name="password" />
  <input type="password" name="confirm" />
  <button>Register</button>
</form>
```

```js
const { validate } = require('formee');

const myForm = document.querySelector('#foo');
const myRules = {
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

myForm.onsubmit = function (ev) {
  ev.preventDefault();
  let errors = validate(myForm, myRules);
  if (myForm.isValid) return alert('Success!');
  for (let k in errors) {
    // TODO: Render errors manually
    //   with {insert favorite UI lib here}
    console.log(`My rule & element's name: ${k}`);
    console.log('> Error message:', errors[k] || 'Required');
    console.log('> My form element(s):', myForm.elements[k]);
  }
};
```


## API

### formee.serialize(form)
Return: `Object`

Serializes a `<form>` into a data object.

> **Important:** Any inputs that are unnamed, disabled, or are of `type=file|reset|submit|button` will be ignored.

#### form
Type: `HTMLFormElement`

The `<form>` element to evaluate.


### formee.validate(form, rules, toCheck)
Return: `Object`

Validates a `<form>` according to its `rules`.<br>
To check an individual input, you may pass its name as the `toCheck` value.

> **Important:** The `rules` key names must match `form.elements`' names~!

Returns an Object of errors, whose keys are the failing `rules` keys (and the `name=""`s of failing elements) and whose values are your error messages (if provided) else `false`.

Additionally, the `<form>` and _each of its elements_ will receive a new `isValid` property with a `Boolean` value.<br>For example:

```js
let myForm = document.querySelector('#myform');
let errors = formee.validate(myForm, { ... });

if (!myForm.isValid) {
  let i=0, item;
  for (; i < myForm.elements; i++) {
    item = myForm.elements[i];
    console.log(`${item.name} – Am I valid?`, item.isValid);
    item.isValid || console.log('>> my error message:', errors[item.name]);
  }
}
```


#### form
Type: `HTMLFormElement`

The `<form>` element to validate.

#### rules
Type: `Object`

An object of rules for your form's inputs.

> **Important:** The key names must match a `<form>` element's `name=""` attribute!

The form values will be serialized before reaching your rule(s). (see [`serialize`](#formeeserializeform))<br>
For example, a `select[multiple]` may present its value as `undefined`, a String, or an Array of Strings.

Each rule:

* May be a `RegExp` or a `Function`
* Must return `false` or an error message (`String`) if invalid
* Otherwise, must return `true` if valid

Your `Function`-type rules will receive the corresponding input's value _and_ the entire data object.

```js
validate(form, {
  password(val, data) {
    if (!val) return 'Required';
    if (val.length < 8) return 'Must be at least 8 characters';
    if (val !== data.confirmPassword) return 'Please confirm your password!';
    return true; // all good homey
  }
});
```

#### toCheck
Type: `String`<br>
Default: `undefined`

If set, ***only*** the corresponding form element (with `name={toCheck}`) will be validated.<br>
When unset (default), all form elements will be validated.

> **Important:** The value must match a key within `rules` and a `name=""` attribute for one of `<form>`'s elements.


### formee.bind(form, options)
Return: `HTMLFormElement`

Attaches [`serialize`](#formeeserializeform) and [`validate`](#formeevalidateform-rules-tocheck) methods to the `<form>` element.

Also registers a custom `onsubmit` handler that will:

1) `event.preventDefault` the `"submit"` event
2) Perform [`validate`](#formeevalidateform-rules-tocheck), then
  a) If all validation passed, call your `options.onSubmit` function
  b) Otherwise, call your `options.onError` function

```js
let myForm = document.querySelector('#myform');

formee.bind(myForm, {
  rules: {
    // ...
  },
  onSubmit(ev) {
    // validation passed!
    console.log(ev.errors); //=> {}
    console.log(ev.target === myForm); //=> true
    console.log(myForm.isValid, myForm.errors); //=> true {}
  },
  onError(ev) {
    // validation failed!
    console.log(ev.errors); //=> { ... }
    console.log(ev.target === myForm); //=> true
    console.log(myForm.isValid, myForm.errors); //=> false { ... }
  }
});

// Now available:
// ---
form.serialize();
form.validate(/* specific item? */);
```

#### form
Type: `HTMLFormElement`

The `<form>` element to evaluate.


#### options.rules
Type: `Object`

Passed directly to `validate` – see [`rules`](#rules).

#### options.onSubmit
Type: `Function`<br>
Required: `true`

The callback to run when validation succeeds fails.

It receives the original `event` – however, a `event.errors` property is added, containing the output from [`validate`](#formeevalidateform-rules-tocheck).

#### options.onError
Type: `Function`<br>
Required: `true`

The callback to run when validation fails.

It receives the original `event` – however, a `event.errors` property is added, containing the output from [`validate`](#formeevalidateform-rules-tocheck).


## License

MIT © [Luke Edwards](https://lukeed.com)
