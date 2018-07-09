import uuid
import hashlib
import binascii
import argparse
from functools import wraps
from threading import Thread

from tqdm import tqdm
from prompt_toolkit import prompt

from fsm import APP_DIR
from fsm import current_settings
from fsm.validators import BooleanValidator
from fsm import log


def run_in_thread(func):
	@wraps(func)
	def async_func(*args, **kwargs):
		def catch_exceptions():
			try:
				func(*args, **kwargs)
			except Exception as e:
				log.exception(msg=f'Parallelized function had an exception: {e}')
		func_hl = Thread(target=catch_exceptions, name=f'Thread_{func.__name__}')
		func_hl.start()
		return func_hl
	return async_func


def hash_pass(password):
	salt = uuid.uuid4().hex
	hash_object = hashlib.pbkdf2_hmac('sha512', password.encode(), salt.encode(), 100000)
	return binascii.hexlify(hash_object).decode() + ':' + salt


def check_password(hashed_password, user_password):
	password, salt = hashed_password.split(':')
	return password == binascii.hexlify(
		hashlib.pbkdf2_hmac('sha512', user_password.encode(), salt.encode(), 100000)
	).decode()


def merge_two_dicts(x, y):
	for key, value in x.items():
		if isinstance(value, dict):
			node = y.setdefault(key, {})
			merge_two_dicts(value, node)
		else:
			y[key] = value
	return y


class TqdmUpTo(tqdm):
	def download_progress(self, b=1, bsize=1, tsize=None):
		if tsize is not None:
			self.total = tsize
		self.update(b * bsize - self.n)


def get_html(file_path, format_kwargs=None):
	with open(f'{APP_DIR}/html/{file_path}.html') as html_file:
		html = html_file.read()
	if format_kwargs:
		html = html.format(**format_kwargs)
	return html.strip()


def make_prompt(msg, **kwargs):
	return prompt(f'\n{msg}\n', **kwargs)


def yes_no_prompt(msg, **kwargs):
	return prompt(f'\n{msg}? (y/n)\n', validator=BooleanValidator(), **kwargs)[0] in ('y', '1', 't')


def parse_the_args():
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
		'--web_admin_port', action='store', dest='web_admin_port', type=int,
		default=int(current_settings['web_admin_port']),
		help='The port that the Adminitration UI will bind to. Setting this will ignore the value in the config file '
		'for this instance only.'
	)
	parser.add_argument(
		'--launch_factorio_instances', action='store', dest='launch_factorios', default=None,
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
	parser.add_argument(
		'--start_in_background', action='store_true', dest='start_in_background', default=False,
		help='Starts FSM in the background and will continue to run even after this shell has closed'
	)
	parser.add_argument(
		'--stop', action='store_true', dest='stop', default=False,
		help='Shuts down the FSM server which in tern will shutdown all Factorio game instances that were started by it'
	)

	return parser.parse_args()
