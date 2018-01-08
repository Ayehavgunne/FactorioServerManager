"use strict";

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

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

function is_bool(val) {
	return (typeof val === "undefined" ? "undefined" : _typeof(val)) === _typeof(true);
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
	if (is_array(val)) {
		return false;
	}
	if (is_function(val)) {
		return false;
	}
	return (typeof val === "undefined" ? "undefined" : _typeof(val)) === 'object';
}

function is_undef(obj) {
	return typeof obj === 'undefined';
}

function is_null(obj) {
	return obj === null;
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

		if (is_null(dom_element)) {
			console.error('dom_element was null');
			return;
		} else if (is_undef(dom_element)) {
			console.error('dom_element was undefined');
			return;
		}
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
		key: "length",
		value: function length() {
			return 1;
		}
	}, {
		key: "item",
		value: function item() {
			return this.element;
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

			if (!is_null(new_text)) {
				this.element.innerText = new_text;
			} else {
				return this.element.innerText;
			}
		}
	}, {
		key: "html",
		value: function html() {
			var new_html = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;

			if (!is_null(new_html)) {
				this.element.innerHTML = new_html;
			} else {
				return this.element.innerHTML;
			}
		}
	}, {
		key: "val",
		value: function val() {
			var new_val = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;

			if (!is_null(new_val)) {
				if (this.element.tagName === 'select') {
					if (is_number(new_val)) {
						this.element.selectedIndex = new_val;
					} else {
						var _iteratorNormalCompletion2 = true;
						var _didIteratorError2 = false;
						var _iteratorError2 = undefined;

						try {
							for (var _iterator2 = this.element.options.entries()[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
								var _ref = _step2.value;

								var _ref2 = _slicedToArray(_ref, 2);

								var x = _ref2[0];
								var opt = _ref2[1];

								if (opt.value === new_val) {
									this.element.selectedIndex = x;
									break;
								}
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
					}
				} else {
					this.element.value = new_val;
				}
			} else {
				if (this.element.tagName === 'select') {
					return this.element.options[this.element.selectedIndex].value;
				} else {
					return this.element.value;
				}
			}
		}
	}, {
		key: "checked",
		value: function checked(val) {
			this.element.checked = val;
			return this;
		}
	}, {
		key: "attr",
		value: function attr(attribute) {
			var value = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

			if (!is_null(value)) {
				this.element.setAttribute(attribute, value);
			} else {
				return this.element.getAttribute(attribute);
			}
			return this;
		}
	}, {
		key: "data",
		value: function data(data_name) {
			var data_attr = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

			if (is_null(data_attr)) {
				return this.element.getAttribute('data-' + data_name);
			} else {
				this.element.setAttribute('data-' + data_name, data_attr);
				return this;
			}
		}
	}, {
		key: "add_event",
		value: function add_event(type, handler) {
			var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;

			this.element.addEventListener(type, handler, options);
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
			var url = void 0;
			if (this.data('url')) {
				url = this.data('url');
			}
			this.add_event('click', handler.bind(this, url));
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

function is_enhanced_element(obj) {
	return obj instanceof EnhancedElement;
}

var EnhancedElements = function () {
	function EnhancedElements(dom_elements) {
		_classCallCheck(this, EnhancedElements);

		if (!dom_elements) {
			console.error('dom_elements was empty');
			return;
		}
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
		key: "item",
		value: function item() {
			var i = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;

			return this.elements.item(i);
		}
	}, {
		key: "push",
		value: function push() {} // TODO: impliment

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
			var _iteratorNormalCompletion3 = true;
			var _didIteratorError3 = false;
			var _iteratorError3 = undefined;

			try {
				for (var _iterator3 = this.elements[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
					var element = _step3.value;

					element.insertAdjacentHTML('afterbegin', str);
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
		key: "append",
		value: function append(str) {
			var _iteratorNormalCompletion4 = true;
			var _didIteratorError4 = false;
			var _iteratorError4 = undefined;

			try {
				for (var _iterator4 = this.elements[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
					var element = _step4.value;

					element.insertAdjacentHTML('beforeend', str);
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
		key: "add_class",
		value: function add_class(class_name) {
			var _iteratorNormalCompletion5 = true;
			var _didIteratorError5 = false;
			var _iteratorError5 = undefined;

			try {
				for (var _iterator5 = this.elements[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
					var element = _step5.value;

					element.classList.add(class_name);
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
		key: "remove_class",
		value: function remove_class(class_name) {
			var _iteratorNormalCompletion6 = true;
			var _didIteratorError6 = false;
			var _iteratorError6 = undefined;

			try {
				for (var _iterator6 = this.elements[Symbol.iterator](), _step6; !(_iteratorNormalCompletion6 = (_step6 = _iterator6.next()).done); _iteratorNormalCompletion6 = true) {
					var element = _step6.value;

					element.classList.remove(class_name);
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

			return this;
		}
	}, {
		key: "has_class",
		value: function has_class(class_name) {
			var _iteratorNormalCompletion7 = true;
			var _didIteratorError7 = false;
			var _iteratorError7 = undefined;

			try {
				for (var _iterator7 = this.elements[Symbol.iterator](), _step7; !(_iteratorNormalCompletion7 = (_step7 = _iterator7.next()).done); _iteratorNormalCompletion7 = true) {
					var element = _step7.value;

					if (element.classList.contains(class_name)) {
						return true;
					}
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
		}
	}, {
		key: "text",
		value: function text() {
			var new_text = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
			var seperator = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : ' ';

			if (!is_null(new_text)) {
				var _iteratorNormalCompletion8 = true;
				var _didIteratorError8 = false;
				var _iteratorError8 = undefined;

				try {
					for (var _iterator8 = this.elements[Symbol.iterator](), _step8; !(_iteratorNormalCompletion8 = (_step8 = _iterator8.next()).done); _iteratorNormalCompletion8 = true) {
						var element = _step8.value;

						element.innerText = new_text;
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
			} else {
				var combined_text = '';
				var _iteratorNormalCompletion9 = true;
				var _didIteratorError9 = false;
				var _iteratorError9 = undefined;

				try {
					for (var _iterator9 = this.elements[Symbol.iterator](), _step9; !(_iteratorNormalCompletion9 = (_step9 = _iterator9.next()).done); _iteratorNormalCompletion9 = true) {
						var _element = _step9.value;

						combined_text += _element.innerText + seperator;
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

				return combined_text;
			}
			return this;
		}
	}, {
		key: "html",
		value: function html() {
			var new_html = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;

			if (!is_null(new_html)) {
				var _iteratorNormalCompletion10 = true;
				var _didIteratorError10 = false;
				var _iteratorError10 = undefined;

				try {
					for (var _iterator10 = this.elements[Symbol.iterator](), _step10; !(_iteratorNormalCompletion10 = (_step10 = _iterator10.next()).done); _iteratorNormalCompletion10 = true) {
						var element = _step10.value;

						element.innerHTML = new_html;
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
			} else {
				var combined_html = '';
				var _iteratorNormalCompletion11 = true;
				var _didIteratorError11 = false;
				var _iteratorError11 = undefined;

				try {
					for (var _iterator11 = this.elements[Symbol.iterator](), _step11; !(_iteratorNormalCompletion11 = (_step11 = _iterator11.next()).done); _iteratorNormalCompletion11 = true) {
						var _element2 = _step11.value;

						combined_html += _element2.innerHTML;
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

				return combined_html;
			}
			return this;
		}
	}, {
		key: "val",
		value: function val() {
			var new_val = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;

			if (!is_null(new_val)) {
				var _iteratorNormalCompletion12 = true;
				var _didIteratorError12 = false;
				var _iteratorError12 = undefined;

				try {
					for (var _iterator12 = this.elements[Symbol.iterator](), _step12; !(_iteratorNormalCompletion12 = (_step12 = _iterator12.next()).done); _iteratorNormalCompletion12 = true) {
						var element = _step12.value;

						if (element.tagName === 'select') {
							if (is_number(new_val)) {
								element.selectedIndex = new_val;
							} else {
								var _iteratorNormalCompletion13 = true;
								var _didIteratorError13 = false;
								var _iteratorError13 = undefined;

								try {
									for (var _iterator13 = element.options.entries()[Symbol.iterator](), _step13; !(_iteratorNormalCompletion13 = (_step13 = _iterator13.next()).done); _iteratorNormalCompletion13 = true) {
										var _ref3 = _step13.value;

										var _ref4 = _slicedToArray(_ref3, 2);

										var x = _ref4[0];
										var opt = _ref4[1];

										if (opt.value === new_val) {
											element.selectedIndex = x;
											break;
										}
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
							}
						} else {
							element.value = new_val;
						}
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
			} else {
				if (this.elements.item(0).tagName === 'select') {
					return this.elements.item(0).options[this.elements.item(0).selectedIndex].value;
				} else {
					return this.elements.item(0).value;
				}
			}
			return this;
		}
	}, {
		key: "checked",
		value: function checked(val) {
			var _iteratorNormalCompletion14 = true;
			var _didIteratorError14 = false;
			var _iteratorError14 = undefined;

			try {
				for (var _iterator14 = this.elements[Symbol.iterator](), _step14; !(_iteratorNormalCompletion14 = (_step14 = _iterator14.next()).done); _iteratorNormalCompletion14 = true) {
					var element = _step14.value;

					element.checked = val;
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
		key: "attr",
		value: function attr(attribute) {
			var value = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

			if (!is_null(value)) {
				var _iteratorNormalCompletion15 = true;
				var _didIteratorError15 = false;
				var _iteratorError15 = undefined;

				try {
					for (var _iterator15 = this.elements[Symbol.iterator](), _step15; !(_iteratorNormalCompletion15 = (_step15 = _iterator15.next()).done); _iteratorNormalCompletion15 = true) {
						var element = _step15.value;

						element.setAttribute(attribute, value);
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
				return this.elements.item(0).getAttribute(attribute);
			}
			return this;
		}
	}, {
		key: "data",
		value: function data(data_name) {
			var data_attr = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

			if (is_null(data_attr)) {
				return this.elements.item(0).getAttribute('data-' + data_name);
			} else {
				var _iteratorNormalCompletion16 = true;
				var _didIteratorError16 = false;
				var _iteratorError16 = undefined;

				try {
					for (var _iterator16 = this.elements[Symbol.iterator](), _step16; !(_iteratorNormalCompletion16 = (_step16 = _iterator16.next()).done); _iteratorNormalCompletion16 = true) {
						var element = _step16.value;

						element.setAttribute('data-' + data_name, data_attr);
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
			}
			return this;
		}
	}, {
		key: "add_event",
		value: function add_event(type, handler) {
			var _iteratorNormalCompletion17 = true;
			var _didIteratorError17 = false;
			var _iteratorError17 = undefined;

			try {
				for (var _iterator17 = this.elements[Symbol.iterator](), _step17; !(_iteratorNormalCompletion17 = (_step17 = _iterator17.next()).done); _iteratorNormalCompletion17 = true) {
					var element = _step17.value;

					var url = void 0;
					var eelement = $(element);
					if (eelement.data('url')) {
						url = eelement.data('url');
					}
					element.addEventListener(type, handler.bind(element, url));
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

			return this;
		}
	}, {
		key: "remove_event",
		value: function remove_event(type, handler) {
			var _iteratorNormalCompletion18 = true;
			var _didIteratorError18 = false;
			var _iteratorError18 = undefined;

			try {
				for (var _iterator18 = this.elements[Symbol.iterator](), _step18; !(_iteratorNormalCompletion18 = (_step18 = _iterator18.next()).done); _iteratorNormalCompletion18 = true) {
					var element = _step18.value;

					element.removeEventListener(type, handler);
				}
			} catch (err) {
				_didIteratorError18 = true;
				_iteratorError18 = err;
			} finally {
				try {
					if (!_iteratorNormalCompletion18 && _iterator18.return) {
						_iterator18.return();
					}
				} finally {
					if (_didIteratorError18) {
						throw _iteratorError18;
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

			var _iteratorNormalCompletion19 = true;
			var _didIteratorError19 = false;
			var _iteratorError19 = undefined;

			try {
				for (var _iterator19 = this.elements[Symbol.iterator](), _step19; !(_iteratorNormalCompletion19 = (_step19 = _iterator19.next()).done); _iteratorNormalCompletion19 = true) {
					var element = _step19.value;

					_loop(element);
				}
			} catch (err) {
				_didIteratorError19 = true;
				_iteratorError19 = err;
			} finally {
				try {
					if (!_iteratorNormalCompletion19 && _iterator19.return) {
						_iterator19.return();
					}
				} finally {
					if (_didIteratorError19) {
						throw _iteratorError19;
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

function is_enhanced_elements(obj) {
	return obj instanceof EnhancedElements;
}

function is_enhanced(obj) {
	return is_enhanced_element(obj) || is_enhanced_elements(obj);
}

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
		var elements = parent.getElementsByClassName(identifier.slice(1));
		if (elements.length === 1) {
			return new EnhancedElement(elements.item(0));
		} else {
			return new EnhancedElements(elements);
		}
	} else if (identifier.indexOf('[') > -1 && identifier.indexOf(']') > -1) {
		var _elements = parent.querySelectorAll(identifier);
		if (_elements.length === 1) {
			return new EnhancedElement(_elements.item(0));
		} else {
			return new EnhancedElements(_elements);
		}
	} else {
		var _elements2 = parent.getElementsByTagName(identifier);
		if (_elements2.length === 1) {
			return new EnhancedElement(_elements2.item(0));
		} else {
			return new EnhancedElements(_elements2);
		}
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
	} else if (is_enhanced(obj)) {
		res = obj;
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

function if_near_bottom(e, threshold) {
	e = $(e).item(0);
	var r = Math.abs(e.scrollTop - (e.scrollHeight - e.offsetHeight));
	if (r === 0) {
		return true;
	}
	return Math.log10(r) <= threshold;
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
		var _iteratorNormalCompletion20 = true;
		var _didIteratorError20 = false;
		var _iteratorError20 = undefined;

		try {
			for (var _iterator20 = element[Symbol.iterator](), _step20; !(_iteratorNormalCompletion20 = (_step20 = _iterator20.next()).done); _iteratorNormalCompletion20 = true) {
				var elem = _step20.value;

				elem.classList.add(class_name);
			}
		} catch (err) {
			_didIteratorError20 = true;
			_iteratorError20 = err;
		} finally {
			try {
				if (!_iteratorNormalCompletion20 && _iterator20.return) {
					_iterator20.return();
				}
			} finally {
				if (_didIteratorError20) {
					throw _iteratorError20;
				}
			}
		}
	} else {
		element.classList.add(class_name);
	}
}

function remove_class(element, class_name) {
	if (is_array(element)) {
		var _iteratorNormalCompletion21 = true;
		var _didIteratorError21 = false;
		var _iteratorError21 = undefined;

		try {
			for (var _iterator21 = element[Symbol.iterator](), _step21; !(_iteratorNormalCompletion21 = (_step21 = _iterator21.next()).done); _iteratorNormalCompletion21 = true) {
				var elem = _step21.value;

				elem.classList.remove(class_name);
			}
		} catch (err) {
			_didIteratorError21 = true;
			_iteratorError21 = err;
		} finally {
			try {
				if (!_iteratorNormalCompletion21 && _iterator21.return) {
					_iterator21.return();
				}
			} finally {
				if (_didIteratorError21) {
					throw _iteratorError21;
				}
			}
		}
	} else if (is_HTMLCollection(element)) {
		element = Array.from(element);
		var _iteratorNormalCompletion22 = true;
		var _didIteratorError22 = false;
		var _iteratorError22 = undefined;

		try {
			for (var _iterator22 = element[Symbol.iterator](), _step22; !(_iteratorNormalCompletion22 = (_step22 = _iterator22.next()).done); _iteratorNormalCompletion22 = true) {
				var _elem = _step22.value;

				_elem.classList.remove(class_name);
			}
		} catch (err) {
			_didIteratorError22 = true;
			_iteratorError22 = err;
		} finally {
			try {
				if (!_iteratorNormalCompletion22 && _iterator22.return) {
					_iterator22.return();
				}
			} finally {
				if (_didIteratorError22) {
					throw _iteratorError22;
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

function ajax() {
	var _ref5 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
	    url = _ref5.url,
	    _ref5$type = _ref5.type,
	    type = _ref5$type === undefined ? 'GET' : _ref5$type,
	    _ref5$data = _ref5.data,
	    data = _ref5$data === undefined ? null : _ref5$data,
	    _ref5$responce_type = _ref5.responce_type,
	    responce_type = _ref5$responce_type === undefined ? 'text' : _ref5$responce_type,
	    _ref5$complete = _ref5.complete,
	    complete = _ref5$complete === undefined ? null : _ref5$complete;

	var httpRequest = new XMLHttpRequest();

	if (!httpRequest) {
		alert('Giving up :( Cannot create an XMLHTTP instance');
		return false;
	}
	if (is_function(complete)) {
		httpRequest.onreadystatechange = function () {
			if (httpRequest.readyState === XMLHttpRequest.DONE) {
				if (httpRequest.status === 200) {
					var resp = httpRequest.responseText;
					if (responce_type === 'json') {
						resp = JSON.parse(resp);
					}
					complete(resp);
				}
			}
		};
	}
	httpRequest.open(type, url);
	httpRequest.send();
}

function websocket() {
	var _ref6 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
	    url = _ref6.url,
	    _ref6$on_message = _ref6.on_message,
	    on_message = _ref6$on_message === undefined ? null : _ref6$on_message,
	    _ref6$on_open = _ref6.on_open,
	    on_open = _ref6$on_open === undefined ? null : _ref6$on_open,
	    _ref6$on_close = _ref6.on_close,
	    on_close = _ref6$on_close === undefined ? null : _ref6$on_close,
	    _ref6$on_error = _ref6.on_error,
	    on_error = _ref6$on_error === undefined ? null : _ref6$on_error;

	url = 'wss://' + window.location.host + '/' + url;
	var conn = new WebSocket(url);

	window.onunload = function () {
		conn.close();
	};

	if (is_function(on_message)) {
		conn.onmessage = on_message;
	}

	conn.onopen = function (evt) {
		print('opened WebSocket ' + url);
		if (is_function(on_open)) {
			on_open(evt);
		}
	};

	conn.onclose = function (evt) {
		print('closing WebSocket ' + url);
		if (is_function(on_close)) {
			on_close(evt);
		}
	};

	conn.onerror = function (evt) {
		print('error on WebSocket ' + url);
		if (is_function(on_error)) {
			on_error(evt);
		}
	};

	return conn;
}