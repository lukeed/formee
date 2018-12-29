export default function (form) {
	var i=0, j, key, tmp, out={};
	var rgx = /(file|reset|submit|button)/i;

	while (tmp = form.elements[i++]) {
		// Ignore unnamed, disabled, or (...rgx) inputs
		if (!tmp.name || tmp.disabled || rgx.test(tmp.type)) continue;

		key = tmp.name;

		// Grab all values from multi-select
		if (tmp.type === 'select-multiple') {
			out[key] = [];
			for (j=0; j < tmp.options.length; j++) {
				if (tmp.options[j].selected) {
					out[key].push(tmp.options[j].value);
				}
			}
		} else if (tmp.checked !== void 0) {
			if (tmp.checked) {
				j = out[key];
				tmp = tmp.value === 'on' || tmp.value;
				out[key] = (j == null && j != 0) ? tmp : [].concat(j, tmp);
			}
		} else if (tmp.value || tmp.value == 0) {
			j = out[key];
			out[key] = (j == null && j != 0) ? tmp.value : [].concat(j, tmp.value);
		}
	}

	return out;
}
