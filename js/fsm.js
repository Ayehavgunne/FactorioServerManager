'use strict';

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

on_load(function () {
	var links = $('#nav_links').find_all('li');
	var tabs = $('.chart_tab');
	var current_game_name = $('#selected_game').val();

	ajax({
		url: url_apply('factorio/`current_game`/updates_available'),
		complete: function complete(result) {
			result = JSON.parse(result);
			update_available(result);
		}
	});

	var factorio_ws = factorio_socket();
	var log_ws = void 0;

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

	$('#start_my_game').click(function () {
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
			complete: function complete(config) {
				config = JSON.parse(config);
				apply_configs_to_form(config);
			}
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
			complete: function complete(result) {
				update_available(JSON.parse(result));
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

	function url_apply(url) {
		var replacements = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : { 'current_game': current_game_name };

		for (var item in replacements) {
			url = url.replace('`' + item + '`', replacements[item]);
		}
		return url;
	}

	function apply_configs_to_form(configs) {
		for (var key in configs) {
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
					var type = '';
					if (key === 'admins') {
						type = 'admin';
					} else if (key === 'tags') {
						type = 'tag';
					}
					var _iteratorNormalCompletion2 = true;
					var _didIteratorError2 = false;
					var _iteratorError2 = undefined;

					try {
						for (var _iterator2 = value[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
							var _item = _step2.value;

							$('#' + type + '_list').append(tag('div', _item + tag('div', '&times;', { class: 'remove', 'title': 'Remove' }), { class: type + '_list_item list_item' }));
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
});