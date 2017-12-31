from subprocess import Popen
from subprocess import PIPE

from psutil import Process
from humanize import naturalsize

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
		log.info('Starting Factorio instance {}'.format(self.name))
		if self.name in app_settings.factorio_processes:
			if isinstance(self.process, Popen):
				# TODO: need to do more here to actaully check if it is running
				log.warn('{} factorio instance is already running'.format(self.name))
				return
		if self.name not in app_settings.factorio_instances:
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
	def status(self):
		if self.process:
			ps_proc = Process(self.process.pid)
			with ps_proc.oneshot():
				log.info('Name: {} PID: {} CPU Percent: {} Memory Usage: {} Status: {}'.format(
					ps_proc.name(), self.process.pid, ps_proc.cpu_percent(.1), naturalsize(ps_proc.memory_info().rss), ps_proc.status()
				))

	@run_async
	def stop(self):
		if self.process:
			log.debug('Stopping {}'.format(self.name))
			self.process.terminate()

	@run_async
	def kill(self):
		if self.process:
			log.debug('Killing {}'.format(self.name))
			self.process.kill()

	@run_async
	def send_command(self, command):
		# TODO: This does not work. No idea how it should work
		if self.process:
			self.process.communicate('{}\n'.format(command).encode())

	@run_async
	def update_version(self, version_list, experimental=False, version=None):
		pass
