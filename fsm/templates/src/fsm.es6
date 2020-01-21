on_load(function() {
	let links = $('#nav_links').find_all('li')
	let tabs = $('.chart_tab')
	let current_game_name = $('#selected_game').val()

	ajax({
		url: url_apply('factorio/`current_game`/updates_available'),
		responce_type: 'json',
		complete: function(result) {
			// result = JSON.parse(result)
			update_available(result)
		}
	})

	let factorio_ws = factorio_socket()
	let log_ws

	$('#overlay').click(function(e) {
		if (this !== e.target && $('#overlay_cell').element !== e.target) {
			return
		}
		$('#overlay').hide()
		$('#overlay_msg').html('')
	})

	apply_add_button($('#add_admins'))
	apply_add_button($('#add_tags'))

	$('.game_name').text(current_game_name)
	get_current_verison()
	$('#selected_game').add_event('change', function() {
		current_game_name = $(this).val()
		$('.game_name').text(current_game_name)
		get_current_verison()
	})

	links.click(function () {
		if ($('#console_sec').has_class('hidden')) {
			$('#console_box').html('')
		}
		$('section').hide()
		$('#' + this.id.replace('nav', 'sec')).show()

		links.remove_class('selected_nav')
		$(this).add_class('selected_nav')

		$('#title_label').text($(this).text())
	})

	tabs.click(function() {
		$('.chart_box').hide()
		$('#' + this.id.replace('_tab', '')).show()
		tabs.remove_class('selected_tab')
		$(this).add_class('selected_tab')
	})

	$('#start_game').click(function() {
		$('#game_status').text('Status: Starting')
	})

	$('#status_nav').click(function() {
		factorio_ws = factorio_socket()
		close_log_socket()
	})
	$('#console_nav').click(function() {
		close_factorio_socket()
		log_ws = log_socket()
	})
	$('#config_nav').click(function() {
		ajax({
			url: url_apply('factorio/`current_game`/server_config'),
			responce_type: 'json',
			complete: apply_configs_to_form
		})
	})

	$('#restart_fsm').click(function(url) {
		close_factorio_socket()

		ajax({url: url})

		$('#overlay').show()
		$('#overlay_msg').text('Restarting FSM')

		setTimeout(function() {
			window.location.reload()
		}, 20000)
	})

	$('#logout_button').click(function() {
		close_factorio_socket()
		close_log_socket()
	})

	$('.action').click(function(url) {
		ajax({url: url_apply(url)})
	})

	$('#check_for_update').click(function(url) {
		ajax({
			url: url_apply(url),
			responce_type: 'json',
			complete: function(result) {
				// update_available(JSON.parse(result))
				update_available(result)
			}
		})
	})

	$('#get_update').click(function(url) {
		let version = $('#update_version').text()
		if (version) {
			url = url_apply(url, {'current_game': current_game_name, 'version': version})
			ajax({url: url})
		}
	})

	$('#save_server_config').click(update_server_configs)

	function url_apply(url, replacements={'current_game': current_game_name}) {
		for (let item in replacements) {
			url = url.replace('`' + item + '`', replacements[item])
		}
		return url
	}

	function apply_configs_to_form(configs) {
		// configs = JSON.parse(configs)
		$('#admins_list').html('')
		$('#tags_list').html('')

		for (let key in configs) { // This could be refactored to be recursive but... this works for now
			if (configs.hasOwnProperty(key)) {
				let value = configs[key]
				if (key.startsWith('_comment_')) {
					if (key === '_comment_visibility') {
						let lan_comment
						let public_comment
						for (let item of value) {
							if (item.indexOf('lan') > -1) {
								lan_comment = item.replace('lan:', '').trim()
							}
							else if (item.indexOf('public') > -1) {
								public_comment = item.replace('public:', '').trim()
							}
						}
						$('#lan_label').attr('title', lan_comment)
						$('#public_label').attr('title', public_comment)
						continue
					}
					$('[data-comment="' + key + '"]').attr('title', value)
				}
				else if (key === 'visibility') {
					$('[data-field="lan"]').checked(value['lan'])
					$('[data-field="public"]').checked(value['public'])
				}
				else if (key === 'admins' || key === 'tags') {
					let item_list_container = $('#' + key + '_list')
					for (let item of value) {
						create_list_item(item_list_container, item, key)
					}
				}
				else if (key === 'allow_commands') {
					$('[data-field="' + key + '"]').val(value)
				}
				else {
					let field = $('[data-field="' + key + '"]')
					if (field.length()) {
						let text_box_fields = ['text', 'number']
						if (text_box_fields.includes(field.attr('type'))) {
							field.val(value)
						}
						else if (field.attr('type') === 'checkbox') {
							field.checked(value)
						}
					}
				}
			}
		}
	}

	function get_current_verison() {
		ajax({
			url: url_apply('factorio/`current_game`/get_current_version'),
			complete: function(version) {
				$('#current_version').html('<span class="bold">Current Version:</span> ' + version)
			}
		})
	}

	function update_available(responce) {
		if (responce) {
			$('#update_available').show()
			$('#update_version').text(responce['version'])
		}
		else {
			print('No update available')
		}
	}

	function factorio_socket() {
		if (!factorio_ws || factorio_ws.readyState === factorio_ws.CLOSED) {
			return websocket({
				url: 'ws/factorio_status?name=' + current_game_name,
				on_message: function(event) {
					let history = JSON.parse(event.data)

					if (history) {
						let status = history[0]['status']
						let total_mem = history[0]['total_mem']
						let total_mem_raw = history[0]['total_mem_raw']

						$('#game_status').html('<span class="bold">Status:</span> ' + status)
						$('#total_mem').html('<span class="bold">Total System Memory:</span> ' + total_mem)

						$('#game_cpu').html('')
						$('#game_mem').html('')
						$('#available_mem').html('')

						$('#cpu_text').text(history[0]['cpu'] + '%')
						$('#memory_text').text(history[0]['mem'])
						$('#avail_memory_text').text(history[0]['available_mem'])

						for (let [num, line] of history.entries()) {
							num = num * 2

							let threshold = 2
							let cpu = line['cpu']
							let mem_percent = (line['mem_raw'] / total_mem_raw) * 100
							let avail_mem_percent = (line['available_mem_raw'] / total_mem_raw) * 100

							if (cpu < threshold) {
								cpu = threshold
							}
							if (mem_percent < threshold) {
								mem_percent = threshold
							}
							if (avail_mem_percent < threshold) {
								avail_mem_percent = threshold
							}

							$('#game_cpu').append(tag('div', null, {
								class: 'history_bar',
								'style': 'height:' + cpu + '%;left:calc(' + num + '% + 5px);'
							}))
							$('#game_mem').append(tag('div', null, {
								class: 'history_bar',
								'style': 'height:' + mem_percent + '%;left:calc(' + num + '% + 5px);'
							}))
							$('#available_mem').append(tag('div', null, {
								class: 'history_bar',
								'style': 'height:' + avail_mem_percent + '%;left:calc(' + num + '% + 5px);'
							}))
						}
					}
					else {
						$('#game_status').text('Status: Not Running')
						$('#game_cpu').html('')
						$('#game_mem').html('')
						$('#available_mem').html('')
						$('#cpu_text').text('')
						$('#memory_text').text('')
						$('#avail_memory_text').text('')
					}
				},
				on_open: function() {
					ajax({url: 'start_stream/factorio'})
				},
				on_close: function() {
					$('#game_status').text('Status: Not Running')
					$('#game_cpu').html('')
					$('#game_mem').html('')
					$('#available_mem').html('')
					$('#cpu_text').text('')
					$('#memory_text').text('')
					$('#avail_memory_text').text('')
				}
			})
		}
		else {
			return factorio_ws
		}
	}

	function log_socket() {
		if (!log_ws || log_ws.readyState === log_ws.CLOSED) {
			return websocket({
				url: 'ws/log_tail?name=' + current_game_name,
				on_message: function(event) {
					let message = event.data

					if (message) {
						let message_line = tag('div', message, cls('console_line'))
						let console_box = $('#console_box')
						console_box.append(message_line)
						let at_bottom = if_near_bottom(console_box, 2)
						if (at_bottom) {
							let sb = console_box.item()
							sb.scrollTop = sb.scrollHeight
						}
					}
				},
				on_open: function() {
					ajax({url: 'start_stream/log'})
				}
			})
		}
		else {
			return log_ws
		}
	}

	function close_log_socket() {
		if (log_ws && log_ws.readyState !== log_ws.CLOSED) {
			log_ws.close()
			log_ws = null
		}
	}

	function close_factorio_socket() {
		if (factorio_ws && factorio_ws.readyState !== factorio_ws.CLOSED) {
			factorio_ws.close()
			factorio_ws = null
		}
	}

	function update_server_configs() {
		let form = $('#server_configs_form')
		let configs = {}
		let select = form.find('select')
		configs[select.data('field')] = select.val()
		for (let list_item of form.find('.list_item')) {
			let type = list_item.data('type')
			if (!(type in configs)) {
				configs[type] = []
			}
			configs[type].push(list_item.base_text())
		}
		for (let input of form.find('input')) {
			let field = input.data('field')
			let field_type = input.attr('type')
			if (field === 'lan' || field === 'public') {
				if (!('visibility' in configs)) {
					configs['visibility'] = {}
				}
				configs['visibility'][field] = input.checked()
			}
			else {
				if (field_type === 'number') {
					configs[field] = parseInt(input.val())
				}
				else if (field_type === 'checkbox') {
					configs[field] = input.checked()
				}
				else {
					configs[field] = input.val()
				}
			}
		}
		ajax({
			url: url_apply('factorio/`current_game`/update_server_configs'),
			data: configs,
			type: 'POST'
		})
		show_modal({
			message: 'The the settings have been saved. ' +
			'For them to take effect the Factorio server must be restarted.<br>' +
			'Would you like to do that now? ' +
			'Click outside message box to ignore.',
			enter: true,
			done: reset_factorio
		})
	}

	function reset_factorio(callback=null) {
		ajax({
			url: url_apply($('#stop_game').data('url')),
			complete: function() {
				ajax({
					url: url_apply($('#start_game').data('url')),
					complete: function() {
						if (is_function(callback)) {
							callback()
						}
					}
				})
			}
		})
	}

	function create_list_item(element, text, type) {
		let list_item_element = string_to_element(tag('div', text, {class: type + '_list_item list_item'}, {type: type}))
		let remove_button = string_to_element(tag('div', '&times;', {class: 'remove', 'title': 'Remove'}))
		list_item_element.appendChild(remove_button)
		$(element).append(list_item_element)
		apply_remove_button(remove_button)
	}

	function apply_add_button(element) {
		let label = $(element).attr('id').replace('add_', '')
		let list_element = $('#' + label + '_list')
		function enter_logic (value) {
			let item_elements = $('.' + label + '_list_item')
			for (let list_item of item_elements) {
				let t = list_item.text().replace(list_item.find('.remove').text(), '')
				if (value === t) {
					$('#error').show()
					return
				}
			}
			create_list_item(list_element, value, label)
			// $('#overlay_msg').html('')
			// $('#overlay').hide()
		}
		function add_button_logic() {
			show_modal({
				label: label.title() + ' Entry ',
				enter: true,
				input: true,
				error_msg: 'That entry already exists',
				done: enter_logic
			})
		}
		$(element).remove_event('click', add_button_logic).click(add_button_logic)
	}

	function show_modal({label='', message='', enter=false, input=false, error_msg='', done=null}={}) {
		let label_html = ''
		let message_html = ''
		let enter_html = ''
		let input_html = ''
		let error_html = ''
		if (label) {
			label_html = tag('label', label)
		}
		if (message) {
			message_html = tag('span', message)
		}
		if (enter) {
			enter_html = tag('button', 'Enter', {id: 'enter_button'})
		}
		if (input) {
			input_html = tag('input', {id: 'new_value'})
		}
		if (error_msg) {
			error_html = tag('div', error_msg, {class: 'hidden', id: 'error'})
		}
		$('#overlay').show()
		$('#overlay_msg').append(error_html + message_html + label_html + input_html + '<br>' + enter_html)
		if (input) {
			$('#new_value').element.focus()
		}
		if (is_function(done)) {
			$('#enter_button').click(() => {
				if (input) {
					done($('#new_value').val())
				}
				else {
					done()
				}
				$('#overlay_msg').html('')
				$('#overlay').hide()
			})
			if (input) {
				$('#new_value').add_event('keyup', (e) => {
					if (e.keyCode === 13) {
						done($('#new_value').val())
						$('#overlay_msg').html('')
						$('#overlay').hide()
					}
				})
			}
		}
	}

	function apply_remove_button(element) {
		function remove_button_logic() {
			$(this).parent().remove()
		}
		$(element).remove_event('click', remove_button_logic).click(remove_button_logic)
	}
})
