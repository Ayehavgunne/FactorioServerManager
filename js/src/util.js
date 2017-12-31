function on_load(callback) {
	document.addEventListener("DOMContentLoaded", function() {
		if (is_function(callback)) {
			callback()
		}
	})
}

function is_function(fun) {
	let get_type = {}
	return fun && get_type.toString.call(fun) === '[object Function]'
}

function is_array(val) {
	return val instanceof Array
}

function is_element(val) {
	return (
		typeof HTMLElement === "object" ? val instanceof HTMLElement :
			val && typeof val === "object" && val !== null && val.nodeType === 1 && typeof val.nodeName === "string"
	)
}

function is_HTMLCollection(val) {
	return val instanceof HTMLCollection
}

function is_number(val) {
	return val instanceof Number
}

function is_string(val) {
	return typeof val === 'string' || val instanceof String
}

function is_object(val) {
	if (val === null) {
		return false
	}
	return ((typeof val === 'function') || (typeof val === 'object'));
}

function click_outside_close(element, callback) {
	add_event(document, 'mouseup', function close(e) {
		if (element !== e.target && !element.contains(e.target)) {
			element.style.display = 'none'
			if (is_function(callback)) {
				callback()
			}
			remove_event(document, 'mouseup', close)
		}
	})
}

function _create_html(tag, inner_html, attributes={}, data_attr={}, self_closing=false) {
	let html = '<' + tag
	if (!is_array(inner_html) && is_object(inner_html)) {
		attributes = inner_html
		inner_html = null
	}
	for (let key in attributes) {
		html = html + ' ' + key + '="' + attributes[key] + '"'
	}
	for (let key in data_attr) {
		html = html + ' data-' + key + '="' + data_attr[key] + '"'
	}
	if (self_closing && !inner_html) {
		html = ' />'
	}
	else {
		html = html + '>'
		if (inner_html) {
			if (is_array(inner_html)) {
				for (let element of inner_html) {
					html = html + element
				}
			}
			else {
				html = html + inner_html
			}
		}
		html = html + '</' + tag + '>'
	}
	return html
}

function tag(tag, inner_html=null, attributes={}, data_attr={}, self_closing=false) {
	return _create_html(tag, inner_html, attributes, data_attr, self_closing)
}

function tag_factory(tag) {
	return function(inner_html, attributes = {}, data_attr = {}, self_closing = false) {
		return _create_html(tag, inner_html, attributes, data_attr, self_closing)
	}
}

class EnhancedElement {
	constructor(dom_element) {
		this.element = dom_element
	}

	find(identifier, index=0) {
		return find_element(identifier, this.element, index)
	}

	find_all(identifier, index=0) {
		return find_elements(identifier, this.element, index)
	}

	hide() {
		this.add_class('hidden')
		return this
	}

	show() {
		this.remove_class('hidden')
		return this
	}

	prepend(str) {
		this.element.insertAdjacentHTML('afterbegin', str)
		return this
	}

	append(str) {
		this.element.insertAdjacentHTML('beforeend', str)
		return this
	}

	add_class(class_name) {
		this.element.classList.add(class_name)
		return this
	}

	remove_class(class_name) {
		this.element.classList.remove(class_name)
		return this
	}

	has_class(class_name) {
		return this.element.classList.contains(class_name)
	}

	text(new_text=null) {
		if (new_text) {
			this.element.innerText = new_text
		}
		else {
			return this.element.innerText
		}
	}

	html(new_html=null) {
		if (new_html) {
			this.element.innerHTML = new_html
		}
		else {
			return this.element.innerHTML
		}
	}

	data(data_name, data_attr=null) {
		if (!data_attr) {
			return this.element.getAttribute('data-' + data_name)
		}
		else {
			this.element.setAttribute('data-' + data_name, data_attr)
			return this
		}
	}

	add_event(type, handler) {
		this.element.addEventListener(type, handler)
		return this
	}

	remove_event(type, handler) {
		this.element.removeEventListener(type, handler)
		return this
	}

	click(handler) {
		this.add_event('click', handler)
		return this
	}

	//Does this action have an official name? People ask about it all the time but just call it click outside to close...
	click_outside_close(callback, parent=document) {
		let close = (e) => {
			if (this.element !== e.target && !this.element.contains(e.target)) {
				this.hide()
				if (is_function(callback)) {
					callback()
				}
				remove_event(parent, 'mouseup', close)
			}
		}
		add_event(parent, 'mouseup', close)
		return this
	}
}

class EnhancedElements {
	constructor(dom_elements) {
		this.elements = dom_elements
		this.i = 0
	}

	find(identifier, index=0) {
		return find_element(identifier, this.elements.item(0), index)
	}

	find_all(identifier, index=0) {
		return find_elements(identifier, this.elements.item(0), index)
	}

	[Symbol.iterator]() {
		return {
			next: () => {
				if (this.i > this.elements.length) {
					return {value: new EnhancedElement(this.elements[this.i++]), done: false}
				}
				else {
					this.i = 0
					return {done: true}
				}
			}
		}
	}

	length() {
		return this.elements.length
	}

	hide() {
		this.add_class('hidden')
		return this
	}

	show() {
		this.remove_class('hidden')
		return this
	}

	prepend(str) {
		for (let element of this.elements) {
			element.insertAdjacentHTML('afterbegin', str)
		}
		return this
	}

	append(str) {
		for (let element of this.elements) {
			element.insertAdjacentHTML('beforeend', str)
		}
		return this
	}

	add_class(class_name) {
		for (let element of this.elements) {
			element.classList.add(class_name)
		}
		return this
	}

	remove_class(class_name) {
		for (let element of this.elements) {
			element.classList.remove(class_name)
		}
		return this
	}

	has_class(class_name) {
		for (let element of this.elements) {
			if (element.classList.contains(class_name)) {
				return true
			}
		}
	}

	text(new_text=null, seperator=' ') {
		if (new_text) {
			for (let element of this.elements) {
				element.innerText = new_text
			}
		}
		else {
			let combined_text = ''
			for (let element of this.elements) {
				combined_text += element.innerText + seperator
			}
			return combined_text
		}
	}

	html(new_html=null) {
		if (new_html) {
			for (let element of this.elements) {
				element.innerHTML = new_html
			}
		}
		else {
			let combined_html = ''
			for (let element of this.elements) {
				combined_html += element.innerHTML
			}
			return combined_html
		}
	}

	data(data_name, data_attr=null) {
		if (!data_attr) {
			return this.elements.item(0).getAttribute('data-' + data_name)
		}
		else {
			for (let element of this.elements) {
				element.setAttribute('data-' + data_name, data_attr)
			}
			return this
		}
	}

	add_event(type, handler) {
		for (let element of this.elements) {
			element.addEventListener(type, handler)
		}
		return this
	}

	remove_event(type, handler) {
		for (let element of this.elements) {
			element.removeEventListener(type, handler)
		}
		return this
	}

	click(handler) {
		this.add_event('click', handler)
		return this
	}

	click_outside_close(callback, parent=document) {
		for (let element of this.elements) {
			let close = (e) => {
				if (element !== e.target && !element.contains(e.target)) {
					this.hide()
					if (is_function(callback)) {
						callback()
					}
					remove_event(parent, 'mouseup', close)
				}
			}
			add_event(parent, 'mouseup', close)
		}
		return this
	}

	eq(index) {
		return new EnhancedElement(this.elements.item(index))
	}
}

function find_element(identifier, parent=document, index = 0) {
	let first_char = identifier.slice(0, 1)

	if (first_char === '#') {
		return new EnhancedElement(parent.getElementById(identifier.slice(1)))
	}
	else {
		return find_elements(identifier, parent)[index]
	}
}

function find_elements(identifier, parent=document) {
	let first_char = identifier.slice(0, 1)

	if (first_char === '#') {
		return new EnhancedElement(parent.getElementById(identifier.slice(1)))
	}
	else if (first_char === '.') {
		return new EnhancedElements(parent.getElementsByClassName(identifier.slice(1)))
	}
	else {
		let elems = parent.getElementsByTagName(identifier)
		return new EnhancedElements(elems)
	}
}

function enhance_element(obj) {
	let res = null
	if (is_HTMLCollection(obj)) {
		res = new EnhancedElements(obj)
	}
	else if (is_element(obj)) {
		res = new EnhancedElement(obj)
	}
	else if (is_string(obj)) {
		let first_char = obj.slice(0, 1)
		if (first_char === '#') {
			res = find_element(obj)
		}
		else {
			res = find_elements(obj)
		}
	}
	return res
}

let $ = enhance_element

function cls(...classes) {
	return {class: classes.join(' ')}
}

function prepend_to_element(element, str) {
	element.insertAdjacentHTML('afterbegin', str)
	return element
}

function append_to_element(element, str) {
	element.insertAdjacentHTML('beforeend', str)
	return element
}

function add_class(element, class_name) {
	if (is_array(element)) {
		for (let elem of element) {
			elem.classList.add(class_name)
		}
	}
	else {
		element.classList.add(class_name)
	}
}

function remove_class(element, class_name) {
	if (is_array(element)) {
		for (let elem of element) {
			elem.classList.remove(class_name)
		}
	}
	else if (is_HTMLCollection(element)) {
		element = Array.from(element)
		for (let elem of element) {
			elem.classList.remove(class_name)
		}
	}
	else {
		element.classList.remove(class_name)
	}
}

function has_class(element, class_name) {
	return element.classList.contains(class_name)
}

function add_event(element, type, handler) {
	element.addEventListener(type, handler)
}

function remove_event(element, type, handler) {
	element.removeEventListener(type, handler);
}

function click(element, handler) {
	add_event(element, 'click', handler)
}

function data(element, data_name, data_attr=null) {
	if (!data_attr) {
		return element.getAttribute('data-' + data_name)
	}
	else {
		element.setAttribute('data-' + data_name, data_attr)
	}
}

let print = console.log.bind(console);

function ajax(url, type='GET', data=null, responce_type='text', callback=null) {
	let httpRequest = new XMLHttpRequest()

	if (!httpRequest) {
		alert('Giving up :( Cannot create an XMLHTTP instance')
		return false
	}
	if (is_function(callback)) {
		httpRequest.onreadystatechange = function() {
			if (httpRequest.readyState === XMLHttpRequest.DONE) {
				if (httpRequest.status === 200) {
					let resp = httpRequest.responseText
					if (responce_type === 'json') {
						resp = JSON.parse(resp)
					}
					callback(resp)
				}
			}
		}
	}
	httpRequest.open(type, url)
	httpRequest.send()
}