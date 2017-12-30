from pathlib import Path

from prompt_toolkit.validation import Validator
from prompt_toolkit.validation import ValidationError

from fsm.settings import app_settings


class DirPathValidator(Validator):
	def validate(self, document):
		path = Path(document.text)

		if '~' in path.as_posix():
			path = path.expanduser()

		if not path.is_dir():
			raise ValidationError(message='That is not a valid path. Please try again.')


class PortNumberValidator(Validator):
	def validate(self, document):
		port = document.text
		error = False

		if port == '':
			return

		if not port.isdigit():
			error = True
		else:
			port = int(port)
			if not 0 < port < 65536:
				error = True

		if error:
			raise ValidationError(message='That is not a valid port number. Please try again.')


class FactorioPortNumberValidator(PortNumberValidator):
	def validate(self, document):
		super().validate(document)
		port = document.text

		if port in app_settings.factorio_instances.values():
			raise ValidationError(message='That port number is already taken by another Factorio instance')
		if port == app_settings.web_admin_port:
			raise ValidationError(message='That port number is already taken by FSM')


class FactorioInstanceNameValidator(Validator):
	def validate(self, document):
		name = document.text

		if name in app_settings.factorio_instances.keys():
			raise ValidationError(message='That Factorio instance name is already taken')


class BooleanValidator(Validator):
	def validate(self, document):
		text = document.text

		text = text[0].lower()
		if text not in ('y', 'n', '1', '0', 't', 'f'):
			raise ValidationError(message='You must type y, 1, or t for yes or type n, 0, f for no')
