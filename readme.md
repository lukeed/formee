# formee [![Build Status](https://travis-ci.org/lukeed/formee.svg?branch=master)](https://travis-ci.org/lukeed/formee)

> A tiny (305B) library for handling &#60;form&#62; elements

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
//
```


## API

### serialize(form)
Return: `Object`

Serializes a `<form>` into a data object.

> **Important:** Any inputs that unnamed, disabled, or are of `type=file|reset|submit|button` will be ignored.

#### form
Type: `HTMLFormElement`

The `<form>` element to evaluate.


## License

MIT © [Luke Edwards](https://lukeed.com)
