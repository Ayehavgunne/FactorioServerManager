#!/usr/bin/python3
import logging
import os

import cherrypy
from ws4py.server.cherrypyserver import WebSocketPlugin
from ws4py.server.cherrypyserver import WebSocketTool

from fsm import APP_DIR
from fsm import app_settings
from fsm import get_settings
from fsm import log
from fsm.factorio_manager import FactorioManager
from fsm.util import parse_the_args
from fsm.web_admin import WebAdmin

current_settings = get_settings()


def main(args):
	with open('fsm.pid', 'w+') as pid_file:
		pid_file.write(str(os.getpid()))

	if args.debug:
		log.handlers[-1].setLevel(logging.DEBUG)
		log.setLevel(logging.DEBUG)

	log.debug('Setting app users')
	app_settings.web_admin_users = current_settings['web_admin_users']

	log.debug('Setting app port')
	app_settings.web_admin_port = args.web_admin_port

	for name, instance in current_settings['factorio_instances'].items():
		app_settings.factorio_instances[name] = FactorioManager(name, instance['port'], instance['root_path'])
		update = app_settings.factorio_instances[name].check_for_update()
		if update:
			log.info(f'Update Available: ver. {update}\tCurrent: {app_settings.factorio_instances[name].version}')

	global_conf = {
		'global': {
			'engine.autoreload.on': False,
			'server.socket_host': '0.0.0.0',
			'server.socket_port': args.web_admin_port,
			'log.screen': False,
			'server.ssl_module': 'builtin',
			'server.ssl_certificate': f'{APP_DIR}/certs/fsm_cert.pem',
			'server.ssl_private_key': f'{APP_DIR}/certs/fsm_key.pem',
		},
	}
	conf = {
		'/': {
			'tools.sessions.on': True,
			'tools.auth.on': True,
			'tools.log_tracebacks.on': True,
			'tools.staticdir.on': True,
			'tools.staticdir.dir': f'{APP_DIR}/root',
			'log.access_file': f'{APP_DIR}/logs/cherrypy_access.log',
			'log.error_file': f'{APP_DIR}/logs/cherrypy_error.log',
		},
		'/css': {
			'tools.staticdir.on': True,
			'tools.staticdir.dir': f'{APP_DIR}/css',
		},
		'/js': {
			'tools.staticdir.on': True,
			'tools.staticdir.dir': f'{APP_DIR}/js',
		},
	}

	if args.debug_cherrypy:
		global_conf['global']['log.screen'] = True

	if args.launch_factorios:
		names = args.launch_factorios.split(',')
		for name in names:
			if name in app_settings.factorio_instances:
				app_settings.factorio_instances[name].start()

	log.info(f'Starting web server on https://0.0.0.0:{args.web_admin_port}')
	cherrypy.config.update(global_conf)

	WebSocketPlugin(cherrypy.engine).subscribe()
	cherrypy.tools.websocket = WebSocketTool()

	cherrypy.tree.mount(root=WebAdmin(), config=conf)
	cherrypy.engine.start()
	cherrypy.engine.block()


if __name__ == '__main__':
	main(parse_the_args())
