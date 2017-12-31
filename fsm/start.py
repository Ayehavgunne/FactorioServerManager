import os
import logging
import argparse
from pathlib import Path

import cherrypy

from fsm import APP_DIR
from fsm import OS_WIN
from fsm.create_logs import log
from fsm.create_logs import stream_handler
from fsm.util import hash_pass, yes_no_prompt
from fsm.util import make_prompt
from fsm.settings import get_settings
from fsm.settings import save_settings
from fsm.settings import app_settings
from fsm.validators import DirPathValidator
from fsm.validators import FactorioPortNumberValidator
from fsm.validators import FactorioInstanceNameValidator
from fsm.validators import PortNumberValidator
from fsm.factorio_manager import FactorioManager
from fsm.web_admin import WebAdmin

current_settings = get_settings()


def main():
	args = parse_the_args()

	if args.debug:
		stream_handler.setLevel(logging.DEBUG)
		log.setLevel(logging.DEBUG)

	if args.run_setup:
		log.debug('Running FSM Setup')
		fsm_setup()
		return

	if args.factorio_root_path == '':
		log.debug('Factorio root path is empty')
		print(
			"Please run the factorio setup as some required values don't seem to be set in the fsm_conf.json file.\n"
			"Run setup by running 'fsm --start' in the command line."
		)
		return

	log.debug('Setting app paths')
	factorio_root_path = Path(args.factorio_root_path)
	app_settings.factorio_root_path = factorio_root_path
	app_settings.saves_path = (factorio_root_path / 'saves').resolve()
	if OS_WIN:
		app_settings.factorio_executable_path = (factorio_root_path / 'bin' / 'x64' / 'factorio.exe').resolve()
	else:
		app_settings.factorio_executable_path = (factorio_root_path / 'bin' / 'x64' / 'factorio').resolve()

	log.debug('Checking paths')
	if not app_settings.factorio_executable_path.is_file():
		log.error(
			'The Factorio server executable was not found in {}'.format(app_settings.factorio_executable_path.as_posix())
		)
		raise FileNotFoundError(
			'The Factorio server executable is not found in {}'.format(app_settings.factorio_executable_path.as_posix())
		)
	if not app_settings.saves_path.is_dir():
		log.info("The Factorio saves direcory doesn't seem to exist. Attemting to create it")
		try:
			app_settings.saves_path.mkdir()
		except OSError as e:
			log.error('Failed to create the saves directory: {}'.format(e))
			print('Tried to create the saves directory here {} but was denied')
			raise

	log.debug('Setting app users')
	app_settings.web_admin_users = current_settings['web_admin_users']

	log.debug('Setting app port')
	app_settings.web_admin_port = args.web_admin_port

	app_settings.factorio_instances = current_settings['factorio_instances']

	# TODO: get args.launch_factorios working

	global_conf = {
		'global': {
			'engine.autoreload.on': False,
			'server.socket_host': '0.0.0.0',
			'server.socket_port': args.web_admin_port,
			'log.screen': False,
			'server.ssl_module': 'builtin',
			'server.ssl_certificate': '{}/certs/fsm_cert.pem'.format(APP_DIR),
			'server.ssl_private_key': '{}/certs/fsm_key.pem'.format(APP_DIR),
		},

	}
	conf = {
		'/': {
			'tools.sessions.on': True,
			'tools.auth.on': True,
			'tools.log_tracebacks.on': True,
			'log.access_file': '{}/logs/cherrypy_access.log'.format(APP_DIR),
			'log.error_file': '{}/logs/cherrypy_error.log'.format(APP_DIR),
		},
		'/css': {
			'tools.staticdir.on': True,
			'tools.staticdir.dir': '{}/css'.format(APP_DIR),
		},
		'/js': {
			'tools.staticdir.on': True,
			'tools.staticdir.dir': '{}/js'.format(APP_DIR),
		},
	}

	if args.debug_cherrypy:
		global_conf['global']['log.screen'] = True

	for name, port in app_settings.factorio_instances.items():
		app_settings.factorio_processes[name] = FactorioManager(name, port)

	log.info('Starting web server on 0.0.0.0:{}'.format(args.web_admin_port))
	cherrypy.config.update(global_conf)
	cherrypy.tree.mount(root=WebAdmin(), config=conf)
	cherrypy.engine.start()
	cherrypy.engine.block()


def fsm_setup():
	print('Welcome to the FSM setup. To exit at any time please press CTRL-C (settings will NOT be saved)')

	try:
		check_current_settings('factorio_root_path', set_factorio_root_path)
		check_current_settings('web_admin_port', set_web_admin_port)

		set_web_admin_users()
		set_factorio_instance()

		save_settings(current_settings)
	except KeyboardInterrupt:
		print('\nExiting setup. Your settings were not saved!')


def check_current_settings(field_name, callback):
	field_value = current_settings[field_name]
	if field_value:
		set_field_value = not yes_no_prompt(
			'Would you like to keep the {} set to {}'.format(field_name.replace('_', ' '), field_value)
		)
	else:
		set_field_value = True
	if set_field_value:
		callback()


def set_factorio_root_path():
	factorio_root_path = None
	if OS_WIN:
		common_paths = [
			'C:/Program Files/Steam/steamapps/common/Factorio/bin',
			'C:/Program Files (x86)/Steam/steamapps/common/Factorio/bin',
			'C:/Program Files/Factorio/bin',
			'C:/Program Files (x86)/Factorio/bin',
			'{}/Factorio/bin'.format(os.getenv('APPDATA')),
			'{}/Factorio/bin'.format(os.getenv('LOCALAPPDATA'))
		]
	else:
		common_paths = [
			'{}/.factorio/bin'.format(os.getenv('HOME')),
			'{}/.local/share/Steam/steamapps/common/Factorio/bin'.format(os.getenv('HOME')),
			'/opt/factorio'
		]
	for path in common_paths:
		check_path = Path(path)
		if check_path.exists():
			check_path = check_path / '..'
			check_path = check_path.resolve()
			keep_path = yes_no_prompt(
				'Found Factorio installation at {}\n'
				'Would you like to use this directory'.format(check_path.as_posix())
			)
			if keep_path:
				factorio_root_path = check_path.as_posix()
				break
	if factorio_root_path is None:
		factorio_root_path = make_prompt(
			'Please enter the root path of the Factorio server installation.',
			validator=DirPathValidator()
		)
	factorio_root_path = Path(factorio_root_path)
	if '~' in factorio_root_path.as_posix():
		factorio_root_path = factorio_root_path.expanduser()
	current_settings['factorio_root_path'] = factorio_root_path.as_posix()


def set_web_admin_port():
	web_admin_port = make_prompt(
		'Please enter the port that the web admin server will bind to.\n'
		'To use the default value of 9876 just press Enter.',
		validator=PortNumberValidator()
	)
	if web_admin_port == '':
		web_admin_port = 9876
	else:
		web_admin_port = int(web_admin_port)
	current_settings['web_admin_port'] = web_admin_port


def set_web_admin_users():
	if len(current_settings['web_admin_users']) == 0:
		username = make_prompt('Please enter the username of the first administrator of the web application.')
		password = make_prompt(
			'Please enter the password of the first administrator of the web application.',
			is_password=True
		)
	else:
		setup_new_user = yes_no_prompt('Would you like to setup a new admin user')
		if setup_new_user:
			username = make_prompt('Please enter the username of the new user.')
			password = make_prompt('Please enter the password of the new user.', is_password=True)
		else:
			username = None
			password = None
	if username and password:
		current_settings['web_admin_users'].append({'username': username, 'password': hash_pass(password)})


def set_factorio_instance():
	if not current_settings['factorio_instances']:
		name = make_prompt(
			'Please name your first Factorio Server instance.\n'
			'Instances are individule Factoio servers running different games on different ports.',
			validator=FactorioInstanceNameValidator()
		)
		port = make_prompt(
			'What port would you like to run this instance on?\n'
			'To use Factorio\'s default port of 34197 just press Enter. (Mmm, factorios...)',  # part of a balanced breakfast!
			validator=FactorioPortNumberValidator()
		)
		if port == '':
			port = 34197
		else:
			port = int(port)
		current_settings['factorio_instances'][name] = port
	else:
		while yes_no_prompt('Would you like to add a new instance'):
			name = make_prompt('Please name this Factorio Server instance.')
			port = make_prompt(
				'What port would you like to run this instance on?',
				validator=FactorioPortNumberValidator()
			)
			current_settings['factorio_instances'][name] = port


def parse_the_args():
	# TODO: add more arguments to override defaults in the config file if the user desires
	log.debug('Parsing the arguments from the command line')
	parser = argparse.ArgumentParser(
		description='FSM is not the Flying Spagetti Monster (at least in this case). It is, however, '
		'the Factorio Server Manager.'
	)

	parser.add_argument(
		'--setup', action='store_true', dest='run_setup', default=False,
		help='The path to the root of the Factorio server installation'
	)
	parser.add_argument(
		'--factorio_path', action='store', dest='factorio_root_path', default=current_settings['factorio_root_path'],
		help='The path to the root of the Factorio server installation. Setting this will ignore the value in '
		'the config file for this instance only.'
	)
	parser.add_argument(
		'--web_admin_port', action='store', dest='web_admin_port', type=int,
		default=int(current_settings['web_admin_port']),
		help='The port that the Adminitration UI will bind to. Setting this will ignore the value in the config file '
		'for this instance only.'
	)
	parser.add_argument(
		'--launch_factorio_instances', action='store', dest='launch_factorios', default=False,
		help='Will automatically start up the Factorio server(s) with the launching of FSM instead of having to start '
		'factorio from the web interface. Useful for starting the Factorio server(s) at boot of host machine. Just '
		'enter the names of the instances to start seperated by a comma'
	)
	parser.add_argument(
		'--debug_cherrypy', action='store_true', dest='debug_cherrypy', default=False,
		help='Sets cherrypy to log to screen'
	)
	parser.add_argument(
		'--debug', action='store_true', dest='debug', default=False,
		help='Sets log level to debug to show extra messaging'
	)

	return parser.parse_args()


if __name__ == '__main__':
	main()
