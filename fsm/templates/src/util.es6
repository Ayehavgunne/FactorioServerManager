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
			val && typeof val === "object" && val.nodeType === 1 && typeof val.nodeName === "string"
	)
}

function is_HTMLCollection(val) {
	return val instanceof HTMLCollection
}

function is_bool(val) {
	return typeof val === typeof true
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
	if (is_array(val)) {
		return false
	}
	if (is_function(val)) {
		return false
	}
	return typeof val === 'object'
}

function is_undef(obj) {
	return typeof obj === 'undefined'
}

function is_null(obj) {
	return obj === null
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
	let html = `<${tag}`
	if (!is_array(inner_html) && is_object(inner_html)) {
		attributes = inner_html
		inner_html = null
	}
	for (let key in attributes) {
		if (attributes.hasOwnProperty(key)) {
			html = `${html} ${key}="${attributes[key]}"`
		}
	}
	for (let key in data_attr) {
		if (data_attr.hasOwnProperty(key)) {
			html = `${html} data-${key}="${data_attr[key]}"`
		}
	}
	if (self_closing && !inner_html) {
		html = ' />'
	}
	else {
		html = `${html}>`
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
		html = `${html}</${tag}>`
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
		if (is_null(dom_element)) {
			console.error('dom_element was null')
			return
		}
		else if (is_undef(dom_element)) {
			console.error('dom_element was undefined')
			return
		}
		this.element = dom_element
		this.i = 0
	}

	find(identifier) {
		return find_element(identifier, this.element)
	}

	find_all(identifier, index=0) {
		return find_elements(identifier, this.element, index)
	}

	[Symbol.iterator]() {
		return {
			next: () => {
				if (this.i === 0) {
					this.i++
					return {value: new EnhancedElement(this.element), done: false}
				}
				else {
					this.i = 0
					return {done: true}
				}
			}
		}
	}

	static length() {
		return 1
	}

	item() {
		return this.element
	}

	parent() {
		return new EnhancedElement(this.element.parentNode)
	}

	remove() {
		this.element.parentNode.removeChild(this.element)
	}

	hide() {
		this.add_class('hidden')
		return this
	}

	show() {
		this.remove_class('hidden')
		return this
	}

	filter(identifier) {
		let array_filter = Array.prototype.filter
		let filtered
		if (is_string(identifier)) {
			filtered = array_filter.call([this.element], function(node) {
				return !!node.querySelectorAll(identifier).length
			})
		}
		else if (is_function(identifier)) {
			filtered = array_filter.call([this.element], identifier)
		}
		if (filtered.length > 0) {
			return new EnhancedElement(filtered)
		}
	}

	prepend(str) {
		if (is_string(str)) {
			this.element.insertAdjacentHTML('afterbegin', str)
		}
		else if (is_element(str)) {
			this.element.prepend(str)
		}
		return this
	}

	append(str) {
		if (is_string(str)) {
			this.element.insertAdjacentHTML('beforeend', str)
		}
		else if (is_element(str)) {
			this.element.appendChild(str)
		}
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
		if (!is_null(new_text)) {
			this.element.innerText = new_text
		}
		else {
			return this.element.innerText
		}
	}

	base_text() {
		return [].reduce.call(
			this.element.childNodes,
			function(a, b) {
				return a + (b.nodeType === 3 ? b.textContent : '')
			},
			''
		)
	}

	html(new_html=null) {
		if (!is_null(new_html)) {
			this.element.innerHTML = new_html
		}
		else {
			return this.element.innerHTML
		}
	}

	val(new_val=null) {
		if (!is_null(new_val)) {
			if (this.element.tagName === 'select') {
				if (is_number(new_val)) {
					this.element.selectedIndex = new_val
				}
				else {
					for (let [x, opt] of this.element.options.entries()) {
						if (opt.value === new_val) {
							this.element.selectedIndex = x
							break
						}
					}
				}
			}
			else {
				this.element.value = new_val
			}
		}
		else {
			if (this.element.tagName === 'select') {
				return this.element.options[this.element.selectedIndex].value
			}
			else {
				return this.element.value
			}
		}
	}

	checked(val=null) {
		if (is_null(val)) {
			return this.element.checked
		}
		else {
			this.element.checked = val
			return this
		}
	}

	attr(attribute, value=null) {
		if (!is_null(value)) {
			this.element.setAttribute(attribute, value)
		}
		else {
			return this.element.getAttribute(attribute)
		}
		return this
	}

	data(data_name, data_attr=null) {
		if (is_null(data_attr)) {
			return this.element.getAttribute(`data-${data_name}`)
		}
		else {
			this.element.setAttribute(`data-${data_name}`, data_attr)
			return this
		}
	}

	add_event(type, handler, options=null) {
		this.element.addEventListener(type, handler, options)
		return this
	}

	remove_event(type, handler) {
		this.element.removeEventListener(type, handler)
		return this
	}

	click(handler) {
		if (this.data('url')) {
			let url = this.data('url')
			this.add_event('click', handler.bind(this, url))
		}
		else {
			this.add_event('click', handler)
		}
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

function is_enhanced_element(obj) {
	return obj instanceof EnhancedElement
}

class EnhancedElements {
	constructor(dom_elements) {
		if (!dom_elements) {
			console.error('dom_elements was empty')
			return
		}
		this.elements = dom_elements
		this.i = 0
	}

	find(identifier, index=0) {
		return find_element(identifier, this.elements.item(index))
	}

	find_all(identifier, index=0) {
		return find_elements(identifier, this.elements.item(index))
	}

	[Symbol.iterator]() {
		return {
			next: () => {
				if (this.i < this.elements.length) {
					return {value: new EnhancedElement(this.elements.item(this.i++)), done: false}
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

	item(i=0) {
		if (i < 0) {
			i = this.elements.length + i
		}
		return this.elements.item(i)
	}

	push() {}  // TODO: impliment

	parent(index=0) {
		return new EnhancedElement(this.elements.item(index).parentNode)
	}

	remove() {
		for (let element of this.elements) {
			element.parentNode.removeChild(element)
		}
	}

	hide() {
		this.add_class('hidden')
		return this
	}

	show() {
		this.remove_class('hidden')
		return this
	}

	filter(identifier) {
		let array_filter = Array.prototype.filter
		let filtered
		if (is_string(identifier)) {
			filtered = array_filter.call(this.elements, function(node) {
				return !!node.querySelectorAll(identifier).length
			})
		}
		else if (is_function(identifier)) {
			filtered =  array_filter.call(this.elements, identifier)
		}
		if (filtered.length > 1) {
			return new EnhancedElements(filtered)
		}
		else if (filtered.length === 1) {
			return new EnhancedElement(filtered)
		}
	}

	prepend(str) {
		if (is_string(str)) {
			for (let element of this.elements) {
				element.insertAdjacentHTML('afterbegin', str)
			}
		}
		else if (is_element(str)) {
			for (let element of this.elements) {
				element.prepend(str)
			}
		}
		return this
	}

	append(str) {
		if (is_string(str)) {
			for (let element of this.elements) {
				element.insertAdjacentHTML('beforeend', str)
			}
		}
		else if (is_element(str)) {
			for (let element of this.elements) {
				element.appendChild(str)
			}
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
		if (!is_null(new_text)) {
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
		return this
	}

	base_text(index=0) {
		return [].reduce.call(
			this.elements.item(index).childNodes,
			function(a, b) {
				return a + (b.nodeType === 3 ? b.textContent : '')
			},
			''
		)
	}

	html(new_html=null) {
		if (!is_null(new_html)) {
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
		return this
	}

	val(new_val=null, index=0) {
		if (!is_null(new_val)) {
			for (let element of this.elements) {
				if (element.tagName === 'select') {
					if (is_number(new_val)) {
						element.selectedIndex = new_val
					}
					else {
						for (let [x, opt] of element.options.entries()) {
							if (opt.value === new_val) {
								element.selectedIndex = x
								break
							}
						}
					}
				}
				else {
					element.value = new_val
				}
			}
		}
		else {
			if (this.elements.item(index).tagName === 'select') {
				return this.elements.item(index).options[this.elements.item(index).selectedIndex].value
			}
			else {
				return this.elements.item(index).value
			}
		}
		return this
	}

	checked(val=null, index=0) {
		if (is_null(val)) {
			return this.elements.item(index).checked
		}
		else {
			for (let element of this.elements) {
				element.checked = val
			}
			return this
		}
	}

	attr(attribute, value = null, index=0) {
		if (!is_null(value)) {
			for (let element of this.elements) {
				element.setAttribute(attribute, value)
			}
		}
		else {
			return this.elements.item(index).getAttribute(attribute)
		}
		return this
	}

	data(data_name, data_attr=null, index=0) {
		if (is_null(data_attr)) {
			return this.elements.item(index).getAttribute(`data-${data_name}`)
		}
		else {
			for (let element of this.elements) {
				element.setAttribute(`data-${data_name}`, data_attr)
			}
		}
		return this
	}

	add_event(type, handler) {
		for (let element of this.elements) {
			let url
			let eelement = $(element)
			if (eelement.data('url')) {
				url = eelement.data('url')
			}
			element.addEventListener(type, handler.bind(element, url))
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

function is_enhanced_elements(obj) {
	return obj instanceof EnhancedElements
}

function is_enhanced(obj) {
	return is_enhanced_element(obj) || is_enhanced_elements(obj)
}

function find_element(identifier, parent=document) {
	let first_char = identifier.slice(0, 1)

	if (first_char === '#') {
		return new EnhancedElement(parent.getElementById(identifier.slice(1)))
	}
	else {
		return find_elements(identifier, parent)
	}
}

function find_elements(identifier, parent=document) {
	let first_char = identifier.slice(0, 1)

	if (first_char === '#') {
		return new EnhancedElement(parent.getElementById(identifier.slice(1)))
	}
	else if (first_char === '.') {
		let elements = parent.getElementsByClassName(identifier.slice(1))
		if (elements.length === 1) {
			return new EnhancedElement(elements.item(0))
		}
		else {
			return new EnhancedElements(elements)
		}
	}
	else if (identifier.indexOf('[') > -1 && identifier.indexOf(']') > -1) {
		let elements = parent.querySelectorAll(identifier)
		if (elements.length === 1) {
			return new EnhancedElement(elements.item(0))
		}
		else {
			return new EnhancedElements(elements)
		}
	}
	else {
		let elements = parent.getElementsByTagName(identifier)
		if (elements.length === 1) {
			return new EnhancedElement(elements.item(0))
		}
		else {
			return new EnhancedElements(elements)
		}
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
	else if (is_enhanced(obj)) {
		res = obj
	}
	return res
}

let $ = enhance_element

function cls(...classes) {
	return {class: classes.join(' ')}
}

function if_near_bottom(e, threshold) {
	e = $(e).item(0)
	let r = Math.abs(e.scrollTop - (e.scrollHeight - e.offsetHeight))
	if (r === 0) {
		return true
	}
	return Math.log10(r) <= threshold
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

function string_to_element(str) {
	let d = document.createElement('div')
	d.innerHTML = str
	return d.firstChild
}

function data(element, data_name, data_attr=null) {
	if (!data_attr) {
		return element.getAttribute(`data-${data_name}`)
	}
	else {
		element.setAttribute(`data-${data_name}`, data_attr)
	}
}

let print = console.log.bind(console);

function ajax({url, type='GET', data=null, content_type=null, responce_type='text', complete=null}={}) {
	let httpRequest = new XMLHttpRequest()

	if (!httpRequest) {
		alert('Giving up :( Cannot create an XMLHTTP instance')
		return false
	}
	if (is_function(complete)) {
		httpRequest.onreadystatechange = function() {
			if (httpRequest.readyState === XMLHttpRequest.DONE) {
				if (httpRequest.status === 200) {
					let resp = httpRequest.responseText
					if (responce_type === 'json') {
						resp = JSON.parse(resp)
					}
					complete(resp)
				}
			}
		}
	}
	httpRequest.open(type, url)
	if (is_null(data)) {
		httpRequest.send()
	}
	else {
		if (is_null(content_type)) {
			if (is_object(data)) {
				content_type = 'application/json'
				data = JSON.stringify(data)
			}
			else if (is_string(data)) {
				content_type = 'text/plain'
			}
			else {
				content_type = 'application/octet-stream'
			}
		}
		httpRequest.setRequestHeader('Content-Type', content_type);
		httpRequest.send(data)
	}
}

function websocket({url, on_message=null, on_open=null, on_close=null, on_error=null}={}) {
	url = `wss://${window.location.host}/${url}`
	let conn = new WebSocket(url)

	window.onunload = function() {
		conn.close()
	}

	if (is_function(on_message)) {
		conn.onmessage = on_message
	}

	conn.onopen = function(evt) {
		print(`opened WebSocket ${url}`)
		if (is_function(on_open)) {
			on_open(evt)
		}
	}

	conn.onclose = function(evt) {
		print(`closing WebSocket ${url}`)
		if (is_function(on_close)) {
			on_close(evt)
		}
	}

	conn.onerror = function(evt) {
		print(`error on WebSocket ${url}`)
		if (is_function(on_error)) {
			on_error(evt)
		}
	}

	return conn
}

String.prototype.title = function() {
	return this.replace(/\w\/|\S*/g, function(txt) {
		return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
	})
}
