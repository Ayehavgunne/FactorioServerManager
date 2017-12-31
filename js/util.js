"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function on_load(callback) {
	document.addEventListener("DOMContentLoaded", function () {
		if (is_function(callback)) {
			callback();
		}
	});
}

function is_function(fun) {
	var get_type = {};
	return fun && get_type.toString.call(fun) === '[object Function]';
}

function is_array(val) {
	return val instanceof Array;
}

function is_element(val) {
	return (typeof HTMLElement === "undefined" ? "undefined" : _typeof(HTMLElement)) === "object" ? val instanceof HTMLElement : val && (typeof val === "undefined" ? "undefined" : _typeof(val)) === "object" && val !== null && val.nodeType === 1 && typeof val.nodeName === "string";
}

function is_HTMLCollection(val) {
	return val instanceof HTMLCollection;
}

function is_number(val) {
	return val instanceof Number;
}

function is_string(val) {
	return typeof val === 'string' || val instanceof String;
}

function is_object(val) {
	if (val === null) {
		return false;
	}
	return typeof val === 'function' || (typeof val === "undefined" ? "undefined" : _typeof(val)) === 'object';
}

function click_outside_close(element, callback) {
	add_event(document, 'mouseup', function close(e) {
		if (element !== e.target && !element.contains(e.target)) {
			element.style.display = 'none';
			if (is_function(callback)) {
				callback();
			}
			remove_event(document, 'mouseup', close);
		}
	});
}

function _create_html(tag, inner_html) {
	var attributes = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
	var data_attr = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
	var self_closing = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : false;

	var html = '<' + tag;
	if (!is_array(inner_html) && is_object(inner_html)) {
		attributes = inner_html;
		inner_html = null;
	}
	for (var key in attributes) {
		html = html + ' ' + key + '="' + attributes[key] + '"';
	}
	for (var _key in data_attr) {
		html = html + ' data-' + _key + '="' + data_attr[_key] + '"';
	}
	if (self_closing && !inner_html) {
		html = ' />';
	} else {
		html = html + '>';
		if (inner_html) {
			if (is_array(inner_html)) {
				var _iteratorNormalCompletion = true;
				var _didIteratorError = false;
				var _iteratorError = undefined;

				try {
					for (var _iterator = inner_html[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
						var element = _step.value;

						html = html + element;
					}
				} catch (err) {
					_didIteratorError = true;
					_iteratorError = err;
				} finally {
					try {
						if (!_iteratorNormalCompletion && _iterator.return) {
							_iterator.return();
						}
					} finally {
						if (_didIteratorError) {
							throw _iteratorError;
						}
					}
				}
			} else {
				html = html + inner_html;
			}
		}
		html = html + '</' + tag + '>';
	}
	return html;
}

function tag(tag) {
	var inner_html = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
	var attributes = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
	var data_attr = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
	var self_closing = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : false;

	return _create_html(tag, inner_html, attributes, data_attr, self_closing);
}

function tag_factory(tag) {
	return function (inner_html) {
		var attributes = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
		var data_attr = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
		var self_closing = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;

		return _create_html(tag, inner_html, attributes, data_attr, self_closing);
	};
}

var EnhancedElement = function () {
	function EnhancedElement(dom_element) {
		_classCallCheck(this, EnhancedElement);

		this.element = dom_element;
	}

	_createClass(EnhancedElement, [{
		key: "find",
		value: function find(identifier) {
			var index = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;

			return find_element(identifier, this.element, index);
		}
	}, {
		key: "find_all",
		value: function find_all(identifier) {
			var index = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;

			return find_elements(identifier, this.element, index);
		}
	}, {
		key: "hide",
		value: function hide() {
			this.add_class('hidden');
			return this;
		}
	}, {
		key: "show",
		value: function show() {
			this.remove_class('hidden');
			return this;
		}
	}, {
		key: "prepend",
		value: function prepend(str) {
			this.element.insertAdjacentHTML('afterbegin', str);
			return this;
		}
	}, {
		key: "append",
		value: function append(str) {
			this.element.insertAdjacentHTML('beforeend', str);
			return this;
		}
	}, {
		key: "add_class",
		value: function add_class(class_name) {
			this.element.classList.add(class_name);
			return this;
		}
	}, {
		key: "remove_class",
		value: function remove_class(class_name) {
			this.element.classList.remove(class_name);
			return this;
		}
	}, {
		key: "has_class",
		value: function has_class(class_name) {
			return this.element.classList.contains(class_name);
		}
	}, {
		key: "text",
		value: function text() {
			var new_text = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;

			if (new_text) {
				this.element.innerText = new_text;
			} else {
				return this.element.innerText;
			}
		}
	}, {
		key: "html",
		value: function html() {
			var new_html = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;

			if (new_html) {
				this.element.innerHTML = new_html;
			} else {
				return this.element.innerHTML;
			}
		}
	}, {
		key: "data",
		value: function data(data_name) {
			var data_attr = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

			if (!data_attr) {
				return this.element.getAttribute('data-' + data_name);
			} else {
				this.element.setAttribute('data-' + data_name, data_attr);
				return this;
			}
		}
	}, {
		key: "add_event",
		value: function add_event(type, handler) {
			this.element.addEventListener(type, handler);
			return this;
		}
	}, {
		key: "remove_event",
		value: function remove_event(type, handler) {
			this.element.removeEventListener(type, handler);
			return this;
		}
	}, {
		key: "click",
		value: function click(handler) {
			this.add_event('click', handler);
			return this;
		}

		//Does this action have an official name? People ask about it all the time but just call it click outside to close...

	}, {
		key: "click_outside_close",
		value: function click_outside_close(callback) {
			var _this = this;

			var parent = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : document;

			var close = function close(e) {
				if (_this.element !== e.target && !_this.element.contains(e.target)) {
					_this.hide();
					if (is_function(callback)) {
						callback();
					}
					remove_event(parent, 'mouseup', close);
				}
			};
			add_event(parent, 'mouseup', close);
			return this;
		}
	}]);

	return EnhancedElement;
}();

var EnhancedElements = function () {
	function EnhancedElements(dom_elements) {
		_classCallCheck(this, EnhancedElements);

		this.elements = dom_elements;
		this.i = 0;
	}

	_createClass(EnhancedElements, [{
		key: "find",
		value: function find(identifier) {
			var index = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;

			return find_element(identifier, this.elements.item(0), index);
		}
	}, {
		key: "find_all",
		value: function find_all(identifier) {
			var index = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;

			return find_elements(identifier, this.elements.item(0), index);
		}
	}, {
		key: Symbol.iterator,
		value: function value() {
			var _this2 = this;

			return {
				next: function next() {
					if (_this2.i > _this2.elements.length) {
						return { value: new EnhancedElement(_this2.elements[_this2.i++]), done: false };
					} else {
						_this2.i = 0;
						return { done: true };
					}
				}
			};
		}
	}, {
		key: "length",
		value: function length() {
			return this.elements.length;
		}
	}, {
		key: "hide",
		value: function hide() {
			this.add_class('hidden');
			return this;
		}
	}, {
		key: "show",
		value: function show() {
			this.remove_class('hidden');
			return this;
		}
	}, {
		key: "prepend",
		value: function prepend(str) {
			var _iteratorNormalCompletion2 = true;
			var _didIteratorError2 = false;
			var _iteratorError2 = undefined;

			try {
				for (var _iterator2 = this.elements[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
					var element = _step2.value;

					element.insertAdjacentHTML('afterbegin', str);
				}
			} catch (err) {
				_didIteratorError2 = true;
				_iteratorError2 = err;
			} finally {
				try {
					if (!_iteratorNormalCompletion2 && _iterator2.return) {
						_iterator2.return();
					}
				} finally {
					if (_didIteratorError2) {
						throw _iteratorError2;
					}
				}
			}

			return this;
		}
	}, {
		key: "append",
		value: function append(str) {
			var _iteratorNormalCompletion3 = true;
			var _didIteratorError3 = false;
			var _iteratorError3 = undefined;

			try {
				for (var _iterator3 = this.elements[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
					var element = _step3.value;

					element.insertAdjacentHTML('beforeend', str);
				}
			} catch (err) {
				_didIteratorError3 = true;
				_iteratorError3 = err;
			} finally {
				try {
					if (!_iteratorNormalCompletion3 && _iterator3.return) {
						_iterator3.return();
					}
				} finally {
					if (_didIteratorError3) {
						throw _iteratorError3;
					}
				}
			}

			return this;
		}
	}, {
		key: "add_class",
		value: function add_class(class_name) {
			var _iteratorNormalCompletion4 = true;
			var _didIteratorError4 = false;
			var _iteratorError4 = undefined;

			try {
				for (var _iterator4 = this.elements[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
					var element = _step4.value;

					element.classList.add(class_name);
				}
			} catch (err) {
				_didIteratorError4 = true;
				_iteratorError4 = err;
			} finally {
				try {
					if (!_iteratorNormalCompletion4 && _iterator4.return) {
						_iterator4.return();
					}
				} finally {
					if (_didIteratorError4) {
						throw _iteratorError4;
					}
				}
			}

			return this;
		}
	}, {
		key: "remove_class",
		value: function remove_class(class_name) {
			var _iteratorNormalCompletion5 = true;
			var _didIteratorError5 = false;
			var _iteratorError5 = undefined;

			try {
				for (var _iterator5 = this.elements[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
					var element = _step5.value;

					element.classList.remove(class_name);
				}
			} catch (err) {
				_didIteratorError5 = true;
				_iteratorError5 = err;
			} finally {
				try {
					if (!_iteratorNormalCompletion5 && _iterator5.return) {
						_iterator5.return();
					}
				} finally {
					if (_didIteratorError5) {
						throw _iteratorError5;
					}
				}
			}

			return this;
		}
	}, {
		key: "has_class",
		value: function has_class(class_name) {
			var _iteratorNormalCompletion6 = true;
			var _didIteratorError6 = false;
			var _iteratorError6 = undefined;

			try {
				for (var _iterator6 = this.elements[Symbol.iterator](), _step6; !(_iteratorNormalCompletion6 = (_step6 = _iterator6.next()).done); _iteratorNormalCompletion6 = true) {
					var element = _step6.value;

					if (element.classList.contains(class_name)) {
						return true;
					}
				}
			} catch (err) {
				_didIteratorError6 = true;
				_iteratorError6 = err;
			} finally {
				try {
					if (!_iteratorNormalCompletion6 && _iterator6.return) {
						_iterator6.return();
					}
				} finally {
					if (_didIteratorError6) {
						throw _iteratorError6;
					}
				}
			}
		}
	}, {
		key: "text",
		value: function text() {
			var new_text = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
			var seperator = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : ' ';

			if (new_text) {
				var _iteratorNormalCompletion7 = true;
				var _didIteratorError7 = false;
				var _iteratorError7 = undefined;

				try {
					for (var _iterator7 = this.elements[Symbol.iterator](), _step7; !(_iteratorNormalCompletion7 = (_step7 = _iterator7.next()).done); _iteratorNormalCompletion7 = true) {
						var element = _step7.value;

						element.innerText = new_text;
					}
				} catch (err) {
					_didIteratorError7 = true;
					_iteratorError7 = err;
				} finally {
					try {
						if (!_iteratorNormalCompletion7 && _iterator7.return) {
							_iterator7.return();
						}
					} finally {
						if (_didIteratorError7) {
							throw _iteratorError7;
						}
					}
				}
			} else {
				var combined_text = '';
				var _iteratorNormalCompletion8 = true;
				var _didIteratorError8 = false;
				var _iteratorError8 = undefined;

				try {
					for (var _iterator8 = this.elements[Symbol.iterator](), _step8; !(_iteratorNormalCompletion8 = (_step8 = _iterator8.next()).done); _iteratorNormalCompletion8 = true) {
						var _element = _step8.value;

						combined_text += _element.innerText + seperator;
					}
				} catch (err) {
					_didIteratorError8 = true;
					_iteratorError8 = err;
				} finally {
					try {
						if (!_iteratorNormalCompletion8 && _iterator8.return) {
							_iterator8.return();
						}
					} finally {
						if (_didIteratorError8) {
							throw _iteratorError8;
						}
					}
				}

				return combined_text;
			}
		}
	}, {
		key: "html",
		value: function html() {
			var new_html = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;

			if (new_html) {
				var _iteratorNormalCompletion9 = true;
				var _didIteratorError9 = false;
				var _iteratorError9 = undefined;

				try {
					for (var _iterator9 = this.elements[Symbol.iterator](), _step9; !(_iteratorNormalCompletion9 = (_step9 = _iterator9.next()).done); _iteratorNormalCompletion9 = true) {
						var element = _step9.value;

						element.innerHTML = new_html;
					}
				} catch (err) {
					_didIteratorError9 = true;
					_iteratorError9 = err;
				} finally {
					try {
						if (!_iteratorNormalCompletion9 && _iterator9.return) {
							_iterator9.return();
						}
					} finally {
						if (_didIteratorError9) {
							throw _iteratorError9;
						}
					}
				}
			} else {
				var combined_html = '';
				var _iteratorNormalCompletion10 = true;
				var _didIteratorError10 = false;
				var _iteratorError10 = undefined;

				try {
					for (var _iterator10 = this.elements[Symbol.iterator](), _step10; !(_iteratorNormalCompletion10 = (_step10 = _iterator10.next()).done); _iteratorNormalCompletion10 = true) {
						var _element2 = _step10.value;

						combined_html += _element2.innerHTML;
					}
				} catch (err) {
					_didIteratorError10 = true;
					_iteratorError10 = err;
				} finally {
					try {
						if (!_iteratorNormalCompletion10 && _iterator10.return) {
							_iterator10.return();
						}
					} finally {
						if (_didIteratorError10) {
							throw _iteratorError10;
						}
					}
				}

				return combined_html;
			}
		}
	}, {
		key: "data",
		value: function data(data_name) {
			var data_attr = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

			if (!data_attr) {
				return this.elements.item(0).getAttribute('data-' + data_name);
			} else {
				var _iteratorNormalCompletion11 = true;
				var _didIteratorError11 = false;
				var _iteratorError11 = undefined;

				try {
					for (var _iterator11 = this.elements[Symbol.iterator](), _step11; !(_iteratorNormalCompletion11 = (_step11 = _iterator11.next()).done); _iteratorNormalCompletion11 = true) {
						var element = _step11.value;

						element.setAttribute('data-' + data_name, data_attr);
					}
				} catch (err) {
					_didIteratorError11 = true;
					_iteratorError11 = err;
				} finally {
					try {
						if (!_iteratorNormalCompletion11 && _iterator11.return) {
							_iterator11.return();
						}
					} finally {
						if (_didIteratorError11) {
							throw _iteratorError11;
						}
					}
				}

				return this;
			}
		}
	}, {
		key: "add_event",
		value: function add_event(type, handler) {
			var _iteratorNormalCompletion12 = true;
			var _didIteratorError12 = false;
			var _iteratorError12 = undefined;

			try {
				for (var _iterator12 = this.elements[Symbol.iterator](), _step12; !(_iteratorNormalCompletion12 = (_step12 = _iterator12.next()).done); _iteratorNormalCompletion12 = true) {
					var element = _step12.value;

					element.addEventListener(type, handler);
				}
			} catch (err) {
				_didIteratorError12 = true;
				_iteratorError12 = err;
			} finally {
				try {
					if (!_iteratorNormalCompletion12 && _iterator12.return) {
						_iterator12.return();
					}
				} finally {
					if (_didIteratorError12) {
						throw _iteratorError12;
					}
				}
			}

			return this;
		}
	}, {
		key: "remove_event",
		value: function remove_event(type, handler) {
			var _iteratorNormalCompletion13 = true;
			var _didIteratorError13 = false;
			var _iteratorError13 = undefined;

			try {
				for (var _iterator13 = this.elements[Symbol.iterator](), _step13; !(_iteratorNormalCompletion13 = (_step13 = _iterator13.next()).done); _iteratorNormalCompletion13 = true) {
					var element = _step13.value;

					element.removeEventListener(type, handler);
				}
			} catch (err) {
				_didIteratorError13 = true;
				_iteratorError13 = err;
			} finally {
				try {
					if (!_iteratorNormalCompletion13 && _iterator13.return) {
						_iterator13.return();
					}
				} finally {
					if (_didIteratorError13) {
						throw _iteratorError13;
					}
				}
			}

			return this;
		}
	}, {
		key: "click",
		value: function click(handler) {
			this.add_event('click', handler);
			return this;
		}
	}, {
		key: "click_outside_close",
		value: function click_outside_close(callback) {
			var _this3 = this;

			var parent = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : document;

			var _loop = function _loop(element) {
				var close = function close(e) {
					if (element !== e.target && !element.contains(e.target)) {
						_this3.hide();
						if (is_function(callback)) {
							callback();
						}
						remove_event(parent, 'mouseup', close);
					}
				};
				add_event(parent, 'mouseup', close);
			};

			var _iteratorNormalCompletion14 = true;
			var _didIteratorError14 = false;
			var _iteratorError14 = undefined;

			try {
				for (var _iterator14 = this.elements[Symbol.iterator](), _step14; !(_iteratorNormalCompletion14 = (_step14 = _iterator14.next()).done); _iteratorNormalCompletion14 = true) {
					var element = _step14.value;

					_loop(element);
				}
			} catch (err) {
				_didIteratorError14 = true;
				_iteratorError14 = err;
			} finally {
				try {
					if (!_iteratorNormalCompletion14 && _iterator14.return) {
						_iterator14.return();
					}
				} finally {
					if (_didIteratorError14) {
						throw _iteratorError14;
					}
				}
			}

			return this;
		}
	}, {
		key: "eq",
		value: function eq(index) {
			return new EnhancedElement(this.elements.item(index));
		}
	}]);

	return EnhancedElements;
}();

function find_element(identifier) {
	var parent = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : document;
	var index = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;

	var first_char = identifier.slice(0, 1);

	if (first_char === '#') {
		return new EnhancedElement(parent.getElementById(identifier.slice(1)));
	} else {
		return find_elements(identifier, parent)[index];
	}
}

function find_elements(identifier) {
	var parent = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : document;

	var first_char = identifier.slice(0, 1);

	if (first_char === '#') {
		return new EnhancedElement(parent.getElementById(identifier.slice(1)));
	} else if (first_char === '.') {
		return new EnhancedElements(parent.getElementsByClassName(identifier.slice(1)));
	} else {
		var elems = parent.getElementsByTagName(identifier);
		return new EnhancedElements(elems);
	}
}

function enhance_element(obj) {
	var res = null;
	if (is_HTMLCollection(obj)) {
		res = new EnhancedElements(obj);
	} else if (is_element(obj)) {
		res = new EnhancedElement(obj);
	} else if (is_string(obj)) {
		var first_char = obj.slice(0, 1);
		if (first_char === '#') {
			res = find_element(obj);
		} else {
			res = find_elements(obj);
		}
	}
	return res;
}

var $ = enhance_element;

function cls() {
	for (var _len = arguments.length, classes = Array(_len), _key2 = 0; _key2 < _len; _key2++) {
		classes[_key2] = arguments[_key2];
	}

	return { class: classes.join(' ') };
}

function prepend_to_element(element, str) {
	element.insertAdjacentHTML('afterbegin', str);
	return element;
}

function append_to_element(element, str) {
	element.insertAdjacentHTML('beforeend', str);
	return element;
}

function add_class(element, class_name) {
	if (is_array(element)) {
		var _iteratorNormalCompletion15 = true;
		var _didIteratorError15 = false;
		var _iteratorError15 = undefined;

		try {
			for (var _iterator15 = element[Symbol.iterator](), _step15; !(_iteratorNormalCompletion15 = (_step15 = _iterator15.next()).done); _iteratorNormalCompletion15 = true) {
				var elem = _step15.value;

				elem.classList.add(class_name);
			}
		} catch (err) {
			_didIteratorError15 = true;
			_iteratorError15 = err;
		} finally {
			try {
				if (!_iteratorNormalCompletion15 && _iterator15.return) {
					_iterator15.return();
				}
			} finally {
				if (_didIteratorError15) {
					throw _iteratorError15;
				}
			}
		}
	} else {
		element.classList.add(class_name);
	}
}

function remove_class(element, class_name) {
	if (is_array(element)) {
		var _iteratorNormalCompletion16 = true;
		var _didIteratorError16 = false;
		var _iteratorError16 = undefined;

		try {
			for (var _iterator16 = element[Symbol.iterator](), _step16; !(_iteratorNormalCompletion16 = (_step16 = _iterator16.next()).done); _iteratorNormalCompletion16 = true) {
				var elem = _step16.value;

				elem.classList.remove(class_name);
			}
		} catch (err) {
			_didIteratorError16 = true;
			_iteratorError16 = err;
		} finally {
			try {
				if (!_iteratorNormalCompletion16 && _iterator16.return) {
					_iterator16.return();
				}
			} finally {
				if (_didIteratorError16) {
					throw _iteratorError16;
				}
			}
		}
	} else if (is_HTMLCollection(element)) {
		element = Array.from(element);
		var _iteratorNormalCompletion17 = true;
		var _didIteratorError17 = false;
		var _iteratorError17 = undefined;

		try {
			for (var _iterator17 = element[Symbol.iterator](), _step17; !(_iteratorNormalCompletion17 = (_step17 = _iterator17.next()).done); _iteratorNormalCompletion17 = true) {
				var _elem = _step17.value;

				_elem.classList.remove(class_name);
			}
		} catch (err) {
			_didIteratorError17 = true;
			_iteratorError17 = err;
		} finally {
			try {
				if (!_iteratorNormalCompletion17 && _iterator17.return) {
					_iterator17.return();
				}
			} finally {
				if (_didIteratorError17) {
					throw _iteratorError17;
				}
			}
		}
	} else {
		element.classList.remove(class_name);
	}
}

function has_class(element, class_name) {
	return element.classList.contains(class_name);
}

function add_event(element, type, handler) {
	element.addEventListener(type, handler);
}

function remove_event(element, type, handler) {
	element.removeEventListener(type, handler);
}

function click(element, handler) {
	add_event(element, 'click', handler);
}

function data(element, data_name) {
	var data_attr = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;

	if (!data_attr) {
		return element.getAttribute('data-' + data_name);
	} else {
		element.setAttribute('data-' + data_name, data_attr);
	}
}

var print = console.log.bind(console);

function ajax(url) {
	var type = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'GET';
	var data = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
	var responce_type = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 'text';
	var callback = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : null;

	var httpRequest = new XMLHttpRequest();

	if (!httpRequest) {
		alert('Giving up :( Cannot create an XMLHTTP instance');
		return false;
	}
	if (is_function(callback)) {
		httpRequest.onreadystatechange = function () {
			if (httpRequest.readyState === XMLHttpRequest.DONE) {
				if (httpRequest.status === 200) {
					var resp = httpRequest.responseText;
					if (responce_type === 'json') {
						resp = JSON.parse(resp);
					}
					callback(resp);
				}
			}
		};
	}
	httpRequest.open(type, url);
	httpRequest.send();
}