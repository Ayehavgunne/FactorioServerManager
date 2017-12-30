import uuid
import hashlib
import binascii
from functools import wraps
from threading import Thread

from prompt_toolkit import prompt

from fsm import APP_DIR
from fsm.create_logs import log
from fsm.validators import BooleanValidator


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


def get_html(file_path, format_kwargs=None):
	with open('{}/html/{}.html'.format(APP_DIR, file_path)) as html_file:
		html = html_file.read()
	if format_kwargs:
		html = html.format(**format_kwargs)
	return html.strip()


def make_prompt(msg, **kwargs):
	return prompt('\n{}\n'.format(msg), **kwargs)


def yes_no_prompt(msg, **kwargs):
	return prompt('\n{}? (y/n)\n'.format(msg), validator=BooleanValidator(), **kwargs)[0] in ('y', '1', 't')


def run_async(func):
	@wraps(func)
	def async_func(*args, **kwargs):
		def catch_exceptions():
			try:
				func(*args, **kwargs)
			except Exception as e:
				log.error(e)
		func_hl = Thread(target=catch_exceptions, name='Thread_{}'.format(func.__name__))
		func_hl.start()
		return func_hl
	return async_func
