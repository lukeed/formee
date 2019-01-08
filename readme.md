# formee [![Build Status](https://travis-ci.org/lukeed/formee.svg?branch=master)](https://travis-ci.org/lukeed/formee)

> A tiny (532B) library for handling &#60;form&#62; elements

This module exposes three module definitions:

* **ES Module**: `dist/formee.mjs`
* **CommonJS**: `dist/formee.js`
* **UMD**: `dist/formee.min.js`


## Install

```
$ npm install --save formee
```


## Usage

```js
const formee = require('formee');
// TODO
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

> **Important:** The `rules`' key names and `form.elements`' names must match~!

Returns an Object of errors, whose keys are the failing `rules` keys (and the `name=""`s of failing elements) and whose values are your error messages (if provided) else `false`.

Additionally, the `<form>` and _each_ of its elements will receive a new `isValid` property with a `Boolean` value.<br>For example:

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

> **Important:** The key names must match an `<form>` element's `name=""` attribute!

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
