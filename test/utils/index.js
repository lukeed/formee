function h(tag, attrs, kids) {
	let k, tmp, x=document.createElement(tag);
	let arr = Array.isArray(kids) ? kids : [kids];
	while (tmp=arr.shift()) x.appendChild(tmp);
	for (k in attrs) x[k] = attrs[k];
	return x;
}

exports.toForm = function (...inputs) {
	let old, val, values={}, elements=[];
	let kids = inputs.map(({ tag, ...attrs }) => h(tag || 'input', attrs));

	kids.forEach(el => {
		elements.push(el);
		old = elements[el.name];
		elements[el.name] = old ? [].concat(old, el) : el;
		if ('checked' in el ? el.checked : el.value) {
			old = values[el.name];
			val = el.value || !!el.checked;
			values[el.name] = old ? [].concat(old, val) : val;
		} else if (el.multiple && el.options) {
			values[el.name] = el.options.filter(x => x.selected).map(x => x.value);
		}
	});

	let form = h('form', null, kids);
	form.elements = elements;

	return { form, values };
}
