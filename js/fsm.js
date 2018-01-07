'use strict';

on_load(function () {
	var links = $('#nav_links').find_all('li');
	var current_game_name = $('#selected_game').val();

	ajax({
		url: cur_game_url('factorio/`current_game`/updates_available'),
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
		ajax({ url: cur_game_url(url) });
	});

	$('#check_for_update').click(function (url) {
		ajax({
			url: cur_game_url(url),
			complete: update_available
		});
	});

	$('#get_update').click(function (url) {
		var version = $('#update_version').text();
		if (version) {
			url = url.replace('`current_game`', current_game_name).replace('`version`', version);
			ajax({ url: cur_game_url(url) });
		}
	});

	function cur_game_url(url) {
		return url.replace('`current_game`', current_game_name);
	}

	function get_current_verison() {
		ajax({
			url: cur_game_url('factorio/`current_game`/get_current_version'),
			complete: function complete(version) {
				$('#current_version').text(version);
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
					var message = JSON.parse(event.data);

					if (message) {
						$('#game_status').text('Status: ' + message['status']);
						$('#game_pid').text('PID: ' + message['pid']);
						$('#game_cpu').text('CPU Percent: ' + message['cpu']);
						$('#game_mem').text('Memory Usage: ' + message['mem']);
						$('#total_mem').text('Total Memory: ' + message['total_mem']);
						$('#available_mem').text('Available Memory: ' + message['available_mem']);
					} else {
						$('#game_status').text('Status: Not Running');
						$('#game_pid').text('');
						$('#game_cpu').text('');
						$('#game_mem').text('');
						$('#total_mem').text('');
						$('#available_mem').text('');
					}
				},
				on_open: function on_open() {
					ajax({ url: 'start_stream/factorio' });
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
			$('#game_status').text('');
			$('#game_pid').text('');
			$('#game_cpu').text('');
			$('#game_mem').text('');
			$('#total_mem').text('');
			$('#available_mem').text('');
		}
	}

	function close_factorio_socket() {
		if (factorio_ws && factorio_ws.readyState !== factorio_ws.CLOSED) {
			factorio_ws.close();
			factorio_ws = null;
		}
	}
});