(function ($) {
	$.fn.SuperNirValidator = function (s, markFailFields) {
		var r = true;
		var w = [];
		var container = this;

		if (!s || s == null || typeof s != 'object') {
			return true;
		}

		var m = {
			notFound: 'elementNotFound',
			maxStringLength: 'exceededMaxLengthString',
			minStringLength: 'exceedMinLengthString',
			pattern: 'valueDoesNotMatchPattern',
			max: 'valueIsMoreThenLimit',
			min: 'valueIsLessThanLimit',
			notInt: 'valueIsNotInteger',
			notFloat: 'valueIsNotFloat',
			notEqual: 'notEqual',
			equal: 'equal'
		}

		var markFailField = function (el, markFailFields) {
			if (markFailFields === true) {
				if (el.is('select') && el.hasClass('selectpicker')) {
					el.selectpicker('setStyle', 'btn-danger')
						.on('changed.bs.select', function (e) {
							el.selectpicker('setStyle', 'btn-danger', 'remove')
						});
				}
				el.css({ borderColor: '#ff0000' })
					.bind('change, input, focus', function () {
						$(this).css({ borderColor: '' })
					});
			}
		}

		var onFail = function (o, el, f) {
			if ('onFail' in o && typeof o.onFail == 'function') {
				o.onFail(o, el, f);
			}
		};

		var onSuccess = function (o, el) {
			if ('onSuccess' in o && typeof o.onSuccess == 'function') {
				o.onSuccess(o, el);
			}
		};

		var getField = function (i) {
			var el = container.find(
				'input[name="' + i + '"], ' +
				'select[name="' + i + '"], ' +
				'textarea[name="' + i + '"]'
			);
			if ('length' in el && el.length == 0) {
				w.push({ name: i, type: 'system', message: m.notFound });
				return false;
			}
			return el;
		};

		var testEqual = function (i, o, el) {
			for (var j in o.equal) {
				var compareEl = getField(o.equal[j]);
				if (compareEl !== false && compareEl.val() !== el.val()) {
					var f = {
						name: i,
						type: 'user',
						value: el.val(),
						equal: compareEl.val(),
						message: m.notEqual
					};
					w.push(f);
					onFail(o, el, f);
					markFailField(el, markFailFields);
					return false;
				} else {
					return true;
				}
			}
		};

		var testNotEqual = function (i, o, el) {
			for (var j in o.notEqual) {
				var compareEl = getField(o.notEqual[j]);
				if (compareEl !== false && compareEl.val() === el.val()) {
					var f = {
						name: i,
						type: 'user',
						value: el.val(),
						notEqual: compareEl.val(),
						message: m.notEqual
					};
					w.push(f);
					onFail(o, el, f);
					markFailField(el, markFailFields);
					return false;
				} else {
					return true;
				}
			}
		};

		var testPattern = function (i, p, o, el) {
			if (!p.test(el.val())) {
				var f = {
					name: i,
					type: 'user',
					value: el.val(),
					pattern: p,
					message: m.pattern
				};
				w.push(f);
				onFail(o, el, f);
				markFailField(el, markFailFields);
				return false;
			} else {
				return true;
			}
		};

		var testMaxLength = function (i, o, el) {
			if (o.maxLength < el.val().length) {
				var f = {
					name: i,
					type: 'user',
					value: el.val(),
					maxLength: o.maxLength,
					message: m.maxStringLength
				};
				w.push(f);
				onFail(o, el, f);
				markFailField(el, markFailFields);
				return false;
			} else {
				return true;
			}
		};

		var testMinLength = function (i, o, el) {
			if (o.minLength > el.val().length) {
				var f = {
					name: i,
					type: 'user',
					value: el.val(),
					minLength: o.minLength,
					message: m.minStringLength
				};
				w.push(f);
				onFail(o, el, f);
				markFailField(el, markFailFields);
				return false;
			} else {
				return true;
			}
		};

		var testMax = function (i, o, el) {
			if (o.max < el.val()) {
				var f = {
					name: i,
					type: 'user',
					value: el.val(),
					max: o.max,
					message: m.max
				};
				w.push(f);
				onFail(o, el, f);
				markFailField(el, markFailFields);
				return false;
			} else {
				return true;
			}
		};

		var testMin = function (i, o, el) {
			if (o.min > el.val()) {
				var f = {
					name: i,
					type: 'user',
					value: el.val(),
					min: o.min,
					message: m.min
				};
				w.push(f);
				onFail(o, el, f);
				markFailField(el, markFailFields);
				return false;
			} else {
				return true;
			}
		};

		var dd = {
			password: function (i, o) {
				var el = getField(i);
				if (el !== false) {
					var success = true;
					if ('maxLength' in o) { success = !success ? false : testMaxLength(i, o, el); }
					if ('minLength' in o) { success = !success ? false : testMinLength(i, o, el) }
					if ('pattern' in o) {
						success = !success ? false : testPattern(i, o.pattern, o, el);
					} else {
						success = !success ? false : testPattern(i, new RegExp('^[A-Za-z0-9_\-\]{6,}$'), o, el);
					}
					if ('equal' in o) { success = !success ? false : testEqual(i, o, el); }
					if ('notEqual' in o) { success = !success ? false : testNotEqual(i, o, el); }

					if (success === true) {
						onSuccess(o, el);
					}
				}
			},
			email: function (i, o) {
				var el = getField(i);
				if (el !== false) {
					var success = true;
					if ('maxLength' in o) { success = !success ? false : testMaxLength(i, o, el); }
					if ('minLength' in o) { success = !success ? false : testMinLength(i, o, el); }
					if ('pattern' in o) {
						success = !success ? false : testPattern(i, o.pattern, o, el);
					} else {
						success = !success ? false : testPattern(i, new RegExp('^[-._a-z0-9]+@(?:[a-z0-9][-a-z0-9]+\.)+[a-z]{2,6}$'), o, el);
					}
					if ('equal' in o) { success = !success ? false : testEqual(i, o, el); }
					if ('notEqual' in o) { success = !success ? false : testNotEqual(i, o, el); }

					if (success === true) {
						onSuccess(o, el);
					}
				}
			},
			string: function (i, o) {
				var el = getField(i);
				if (el !== false) {
					var success = true;
					if ('maxLength' in o) { success = !success ? false : testMaxLength(i, o, el); }
					if ('minLength' in o) { success = !success ? false : testMinLength(i, o, el) }
					if ('pattern' in o) { success = !success ? false : testPattern(i, o.pattern, o, el); }
					if ('equal' in o) { success = !success ? false : testEqual(i, o, el); }
					if ('notEqual' in o) { success = !success ? false : testNotEqual(i, o, el); }

					if (success === true) {
						onSuccess(o, el);
					}
				}
			},
			int: function (i, o) {
				var el = getField(i);
				if (el !== false) {
					var success = true;
					if ('max' in o) { success = !success ? false : testMax(i, o, el); }
					if ('min' in o) { success = !success ? false : testMin(i, o, el); }
					if ('pattern' in o) {
						success = !success ? false : testPattern(i, o.pattern, o, el);
					} else {
						success = !success ? false : testPattern(i, new RegExp('^[0-9]{0,}$'), o, el);
					}
					if ('equal' in o) { success = !success ? false : testEqual(i, o, el); }
					if ('notEqual' in o) { success = !success ? false : testNotEqual(i, o, el); }

					if (success === true) {
						onSuccess(o, el);
					}
				}
			},
			float: function (i, o) {
				var el = getField(i);
				if (el !== false) {
					var success = true;
					if ('max' in o) { success = !success ? false : testMax(i, o, el); }
					if ('min' in o) { success = !success ? false : testMin(i, o, el); }
					if ('pattern' in o) {
						success = !success ? false : testPattern(i, o.pattern, o, el);
					} else {
						success = !success ? false : testPattern(i, new RegExp('^[0-9]{0,}(\.)[0-9]{0,}$'), o, el);
					}
					if ('equal' in o) { success = !success ? false : testEqual(i, o, el); }
					if ('notEqual' in o) { success = !success ? false : testNotEqual(i, o, el); }

					if (success === true) {
						onSuccess(o, el);
					}
				}
			},
		};

		for (var i in s) {
			if (s[i] != null && typeof s[i] == 'object') {
				if ('type' in s[i]) {
					try {
						dd[s[i].type](i, s[i]);
					} catch (e) {
						w.push({
							name: 'exeption',
							type: e.message + ', ' + e.stack
						})
					}
				}
			}
		}

		return w.length === 0 ? true : w;
	};
})(jQuery);
