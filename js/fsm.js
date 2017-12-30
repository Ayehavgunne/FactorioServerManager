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
	$('#start_my_game').click(function () {
		ajax('start_factorio_instance/my_game');
	});
	$('#stop_my_game').click(function () {
		ajax('stop_factorio_instance/my_game');
	});
	$('#send_command_to_my_game').click(function () {
		ajax('send_command/my_game');
	});
	$('#start_other_game').click(function () {
		ajax('start_factorio_instance/other_game');
	});
	$('#stop_other_game').click(function () {
		ajax('stop_factorio_instance/other_game');
	});
});