'use strict';

on_load(function () {
	var links = $('#nav_links').find_all('li');
	links.click(function () {
		$('section').hide();
		$('#' + this.id.replace('nav', 'sec')).show();

		links.remove_class('selected_nav');
		$(this).add_class('selected_nav');

		$('#title_label').text($(this).text());
	});
	$('#restart_fsm').click(function () {
		ajax('restart_server');
		$('#overlay').show();
		$('#overlay_msg').text('Restarting FSM');
		setTimeout(function () {
			window.location.reload();
		}, 20000);
	});
	$('#start_my_game').click(function () {
		ajax('factorio/my_game/start');
	});
	$('#stop_my_game').click(function () {
		ajax('factorio/my_game/stop');
	});
	$('#status_my_game').click(function () {
		ajax('factorio/my_game/status');
	});
	$('#start_other_game').click(function () {
		ajax('factorio/other_game/start');
	});
	$('#stop_other_game').click(function () {
		ajax('factorio/other_game/stop');
	});
	$('#get_factorio_versions').click(function () {
		ajax('get_factorio_versions', 'GET', null, 'json', function (versions) {
			print(versions);
		});
	});
});