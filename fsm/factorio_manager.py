from subprocess import Popen
from subprocess import PIPE

from fsm import APP_DIR
from fsm.util import run_async
from fsm.settings import app_settings
from fsm.create_logs import log


class FactorioManager(object):
	def __init__(self, name, port):
		self.name = name
		self.port = port
		self.process = None

	@run_async
	def start(self):
		log.debug('Starting Factorio instance {}'.format(self.name))
		if self.name in app_settings.factorio_processes:
			if isinstance(app_settings.factorio_processes[self.name], Popen):
				# TODO: need to do more here to actaully check if it is running
				log.warn('{} factorio instance is already running'.format(self.name))
				return
		if self.name not in app_settings.factorio_instances.keys():
			log.warn('{} factorio instance does not exist'.format(self.name))
			return
		commands = [
			app_settings.factorio_executable_path.as_posix(),
			'--start-server',
			self.get_save_file_path(),
			'--port',
			str(self.port)
		]
		log.debug('Starting {}'.format(self.name))
		with open('{}/logs/{}_factorio.log'.format(APP_DIR.as_posix(), self.name), 'a') as factorio_log:
			self.process = Popen(commands, stdin=PIPE, stdout=factorio_log, stderr=factorio_log)

	def get_save_file_path(self, most_recent=True):
		# TODO: this must be made to be much more robust
		return '{0}/{1}/{1}.zip'.format(app_settings.saves_path.as_posix(), self.name)

	def create_save_file(self):
		pass

	@run_async
	def stop(self):
		log.debug('Stopping {}'.format(self.name))
		self.process.terminate()

	@run_async
	def kill(self):
		log.debug('Killing {}'.format(self.name))
		self.process.kill()

	@run_async
	def send_command(self, command):
		self.process.communicate('{}\n'.format(command).encode())
