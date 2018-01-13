'use strict';

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

on_load(function () {
	var links = $('#nav_links').find_all('li');
	var tabs = $('.chart_tab');
	var current_game_name = $('#selected_game').val();

	ajax({
		url: url_apply('factorio/`current_game`/updates_available'),
		responce_type: 'json',
		complete: function complete(result) {
			// result = JSON.parse(result)
			update_available(result);
		}
	});

	var factorio_ws = factorio_socket();
	var log_ws = void 0;

	$('#overlay').click(function (e) {
		if (this !== e.target && $('#overlay_cell').element !== e.target) {
			return;
		}
		$('#overlay').hide();
		$('#overlay_msg').html('');
	});

	apply_add_button($('#add_admins'));
	apply_add_button($('#add_tags'));

	$('.game_name').text(current_game_name);
	get_current_verison();
	$('#selected_game').add_event('change', function () {
		current_game_name = $(this).val();
		$('.game_name').text(current_game_name);
		get_current_verison();
	});

	links.click(function () {
		if ($('#console_sec').has_class('hidden')) {
			$('#console_box').html('');
		}
		$('section').hide();
		$('#' + this.id.replace('nav', 'sec')).show();

		links.remove_class('selected_nav');
		$(this).add_class('selected_nav');

		$('#title_label').text($(this).text());
	});

	tabs.click(function () {
		$('.chart_box').hide();
		$('#' + this.id.replace('_tab', '')).show();
		tabs.remove_class('selected_tab');
		$(this).add_class('selected_tab');
	});

	$('#start_game').click(function () {
		$('#game_status').text('Status: Starting');
	});

	$('#status_nav').click(function () {
		factorio_ws = factorio_socket();
		close_log_socket();
	});
	$('#console_nav').click(function () {
		close_factorio_socket();
		log_ws = log_socket();
	});
	$('#config_nav').click(function () {
		ajax({
			url: url_apply('factorio/`current_game`/server_config'),
			responce_type: 'json',
			complete: apply_configs_to_form
		});
	});

	$('#restart_fsm').click(function (url) {
		close_factorio_socket();

		ajax({ url: url });

		$('#overlay').show();
		$('#overlay_msg').text('Restarting FSM');

		setTimeout(function () {
			window.location.reload();
		}, 20000);
	});

	$('#logout_button').click(function () {
		close_factorio_socket();
		close_log_socket();
	});

	$('.action').click(function (url) {
		ajax({ url: url_apply(url) });
	});

	$('#check_for_update').click(function (url) {
		ajax({
			url: url_apply(url),
			responce_type: 'json',
			complete: function complete(result) {
				// update_available(JSON.parse(result))
				update_available(result);
			}
		});
	});

	$('#get_update').click(function (url) {
		var version = $('#update_version').text();
		if (version) {
			url = url_apply(url, { 'current_game': current_game_name, 'version': version });
			ajax({ url: url });
		}
	});

	$('#save_server_config').click(update_server_configs);

	function url_apply(url) {
		var replacements = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : { 'current_game': current_game_name };

		for (var item in replacements) {
			url = url.replace('`' + item + '`', replacements[item]);
		}
		return url;
	}

	function apply_configs_to_form(configs) {
		// configs = JSON.parse(configs)
		$('#admins_list').html('');
		$('#tags_list').html('');

		for (var key in configs) {
			// This could be refactored to be recursive but... this works for now
			if (configs.hasOwnProperty(key)) {
				var value = configs[key];
				if (key.startsWith('_comment_')) {
					if (key === '_comment_visibility') {
						var lan_comment = void 0;
						var public_comment = void 0;
						var _iteratorNormalCompletion = true;
						var _didIteratorError = false;
						var _iteratorError = undefined;

						try {
							for (var _iterator = value[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
								var item = _step.value;

								if (item.indexOf('lan') > -1) {
									lan_comment = item.replace('lan:', '').trim();
								} else if (item.indexOf('public') > -1) {
									public_comment = item.replace('public:', '').trim();
								}
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

						$('#lan_label').attr('title', lan_comment);
						$('#public_label').attr('title', public_comment);
						continue;
					}
					$('[data-comment="' + key + '"]').attr('title', value);
				} else if (key === 'visibility') {
					$('[data-field="lan"]').checked(value['lan']);
					$('[data-field="public"]').checked(value['public']);
				} else if (key === 'admins' || key === 'tags') {
					var item_list_container = $('#' + key + '_list');
					var _iteratorNormalCompletion2 = true;
					var _didIteratorError2 = false;
					var _iteratorError2 = undefined;

					try {
						for (var _iterator2 = value[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
							var _item = _step2.value;

							create_list_item(item_list_container, _item, key);
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
				} else if (key === 'allow_commands') {
					$('[data-field="' + key + '"]').val(value);
				} else {
					var field = $('[data-field="' + key + '"]');
					if (field.length()) {
						var text_box_fields = ['text', 'number'];
						if (text_box_fields.includes(field.attr('type'))) {
							field.val(value);
						} else if (field.attr('type') === 'checkbox') {
							field.checked(value);
						}
					}
				}
			}
		}
	}

	function get_current_verison() {
		ajax({
			url: url_apply('factorio/`current_game`/get_current_version'),
			complete: function complete(version) {
				$('#current_version').html('<span class="bold">Current Version:</span> ' + version);
			}
		});
	}

	function update_available(responce) {
		if (responce) {
			$('#update_available').show();
			$('#update_version').text(responce['version']);
		} else {
			print('No update available');
		}
	}

	function factorio_socket() {
		if (!factorio_ws || factorio_ws.readyState === factorio_ws.CLOSED) {
			return websocket({
				url: 'ws/factorio_status?name=' + current_game_name,
				on_message: function on_message(event) {
					var history = JSON.parse(event.data);

					if (history) {
						var status = history[0]['status'];
						var total_mem = history[0]['total_mem'];
						var total_mem_raw = history[0]['total_mem_raw'];

						$('#game_status').html('<span class="bold">Status:</span> ' + status);
						$('#total_mem').html('<span class="bold">Total System Memory:</span> ' + total_mem);

						$('#game_cpu').html('');
						$('#game_mem').html('');
						$('#available_mem').html('');

						$('#cpu_text').text(history[0]['cpu'] + '%');
						$('#memory_text').text(history[0]['mem']);
						$('#avail_memory_text').text(history[0]['available_mem']);

						var _iteratorNormalCompletion3 = true;
						var _didIteratorError3 = false;
						var _iteratorError3 = undefined;

						try {
							for (var _iterator3 = history.entries()[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
								var _ref = _step3.value;

								var _ref2 = _slicedToArray(_ref, 2);

								var num = _ref2[0];
								var line = _ref2[1];

								num = num * 2;

								var threshold = 2;
								var cpu = line['cpu'];
								var mem_percent = line['mem_raw'] / total_mem_raw * 100;
								var avail_mem_percent = line['available_mem_raw'] / total_mem_raw * 100;

								if (cpu < threshold) {
									cpu = threshold;
								}
								if (mem_percent < threshold) {
									mem_percent = threshold;
								}
								if (avail_mem_percent < threshold) {
									avail_mem_percent = threshold;
								}

								$('#game_cpu').append(tag('div', null, {
									class: 'history_bar',
									'style': 'height:' + cpu + '%;left:calc(' + num + '% + 5px);'
								}));
								$('#game_mem').append(tag('div', null, {
									class: 'history_bar',
									'style': 'height:' + mem_percent + '%;left:calc(' + num + '% + 5px);'
								}));
								$('#available_mem').append(tag('div', null, {
									class: 'history_bar',
									'style': 'height:' + avail_mem_percent + '%;left:calc(' + num + '% + 5px);'
								}));
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
					} else {
						$('#game_status').text('Status: Not Running');
						$('#game_cpu').html('');
						$('#game_mem').html('');
						$('#available_mem').html('');
						$('#cpu_text').text('');
						$('#memory_text').text('');
						$('#avail_memory_text').text('');
					}
				},
				on_open: function on_open() {
					ajax({ url: 'start_stream/factorio' });
				},
				on_close: function on_close() {
					$('#game_status').text('Status: Not Running');
					$('#game_cpu').html('');
					$('#game_mem').html('');
					$('#available_mem').html('');
					$('#cpu_text').text('');
					$('#memory_text').text('');
					$('#avail_memory_text').text('');
				}
			});
		} else {
			return factorio_ws;
		}
	}

	function log_socket() {
		if (!log_ws || log_ws.readyState === log_ws.CLOSED) {
			return websocket({
				url: 'ws/log_tail?name=' + current_game_name,
				on_message: function on_message(event) {
					var message = event.data;

					if (message) {
						var message_line = tag('div', message, cls('console_line'));
						var console_box = $('#console_box');
						console_box.append(message_line);
						var at_bottom = if_near_bottom(console_box, 2);
						if (at_bottom) {
							var sb = console_box.item();
							sb.scrollTop = sb.scrollHeight;
						}
					}
				},
				on_open: function on_open() {
					ajax({ url: 'start_stream/log' });
				}
			});
		} else {
			return log_ws;
		}
	}

	function close_log_socket() {
		if (log_ws && log_ws.readyState !== log_ws.CLOSED) {
			log_ws.close();
			log_ws = null;
		}
	}

	function close_factorio_socket() {
		if (factorio_ws && factorio_ws.readyState !== factorio_ws.CLOSED) {
			factorio_ws.close();
			factorio_ws = null;
		}
	}

	function update_server_configs() {
		var form = $('#server_configs_form');
		var configs = {};
		var select = form.find('select');
		configs[select.data('field')] = select.val();
		var _iteratorNormalCompletion4 = true;
		var _didIteratorError4 = false;
		var _iteratorError4 = undefined;

		try {
			for (var _iterator4 = form.find('.list_item')[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
				var list_item = _step4.value;

				var type = list_item.data('type');
				if (!(type in configs)) {
					configs[type] = [];
				}
				configs[type].push(list_item.base_text());
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

		var _iteratorNormalCompletion5 = true;
		var _didIteratorError5 = false;
		var _iteratorError5 = undefined;

		try {
			for (var _iterator5 = form.find('input')[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
				var input = _step5.value;

				var field = input.data('field');
				var field_type = input.attr('type');
				if (field === 'lan' || field === 'public') {
					if (!('visibility' in configs)) {
						configs['visibility'] = {};
					}
					configs['visibility'][field] = input.checked();
				} else {
					if (field_type === 'number') {
						configs[field] = parseInt(input.val());
					} else if (field_type === 'checkbox') {
						configs[field] = input.checked();
					} else {
						configs[field] = input.val();
					}
				}
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

		ajax({
			url: url_apply('factorio/`current_game`/update_server_configs'),
			data: configs,
			type: 'POST'
		});
		show_modal({
			message: 'The the settings have been saved. ' + 'For them to take effect the Factorio server must be restarted.<br>' + 'Would you like to do that now? ' + 'Click outside message box to ignore.',
			enter: true,
			done: reset_factorio
		});
	}

	function reset_factorio() {
		var callback = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;

		ajax({
			url: url_apply($('#stop_game').data('url')),
			complete: function complete() {
				ajax({
					url: url_apply($('#start_game').data('url')),
					complete: function complete() {
						if (is_function(callback)) {
							callback();
						}
					}
				});
			}
		});
	}

	function create_list_item(element, text, type) {
		var list_item_element = string_to_element(tag('div', text, { class: type + '_list_item list_item' }, { type: type }));
		var remove_button = string_to_element(tag('div', '&times;', { class: 'remove', 'title': 'Remove' }));
		list_item_element.appendChild(remove_button);
		$(element).append(list_item_element);
		apply_remove_button(remove_button);
	}

	function apply_add_button(element) {
		var label = $(element).attr('id').replace('add_', '');
		var list_element = $('#' + label + '_list');
		function enter_logic(value) {
			var item_elements = $('.' + label + '_list_item');
			var _iteratorNormalCompletion6 = true;
			var _didIteratorError6 = false;
			var _iteratorError6 = undefined;

			try {
				for (var _iterator6 = item_elements[Symbol.iterator](), _step6; !(_iteratorNormalCompletion6 = (_step6 = _iterator6.next()).done); _iteratorNormalCompletion6 = true) {
					var list_item = _step6.value;

					var t = list_item.text().replace(list_item.find('.remove').text(), '');
					if (value === t) {
						$('#error').show();
						return;
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

			create_list_item(list_element, value, label);
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
			});
		}
		$(element).remove_event('click', add_button_logic).click(add_button_logic);
	}

	function show_modal() {
		var _ref3 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
		    _ref3$label = _ref3.label,
		    label = _ref3$label === undefined ? '' : _ref3$label,
		    _ref3$message = _ref3.message,
		    message = _ref3$message === undefined ? '' : _ref3$message,
		    _ref3$enter = _ref3.enter,
		    enter = _ref3$enter === undefined ? false : _ref3$enter,
		    _ref3$input = _ref3.input,
		    input = _ref3$input === undefined ? false : _ref3$input,
		    _ref3$error_msg = _ref3.error_msg,
		    error_msg = _ref3$error_msg === undefined ? '' : _ref3$error_msg,
		    _ref3$done = _ref3.done,
		    done = _ref3$done === undefined ? null : _ref3$done;

		var label_html = '';
		var message_html = '';
		var enter_html = '';
		var input_html = '';
		var error_html = '';
		if (label) {
			label_html = tag('label', label);
		}
		if (message) {
			message_html = tag('span', message);
		}
		if (enter) {
			enter_html = tag('button', 'Enter', { id: 'enter_button' });
		}
		if (input) {
			input_html = tag('input', { id: 'new_value' });
		}
		if (error_msg) {
			error_html = tag('div', error_msg, { class: 'hidden', id: 'error' });
		}
		$('#overlay').show();
		$('#overlay_msg').append(error_html + message_html + label_html + input_html + '<br>' + enter_html);
		if (input) {
			$('#new_value').element.focus();
		}
		if (is_function(done)) {
			$('#enter_button').click(function () {
				if (input) {
					done($('#new_value').val());
				} else {
					done();
				}
				$('#overlay_msg').html('');
				$('#overlay').hide();
			});
			if (input) {
				$('#new_value').add_event('keyup', function (e) {
					if (e.keyCode === 13) {
						done($('#new_value').val());
						$('#overlay_msg').html('');
						$('#overlay').hide();
					}
				});
			}
		}
	}

	function apply_remove_button(element) {
		function remove_button_logic() {
			$(this).parent().remove();
		}
		$(element).remove_event('click', remove_button_logic).click(remove_button_logic);
	}
});