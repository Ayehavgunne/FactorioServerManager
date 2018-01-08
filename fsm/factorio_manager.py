import json
from datetime import datetime
from time import sleep
from urllib import parse
from urllib import request
from pathlib import Path
from subprocess import Popen
from subprocess import PIPE
from collections import deque
from configparser import ConfigParser

from psutil import Process
from psutil import NoSuchProcess
from humanize import naturalsize

from fsm import OS_WIN
from fsm import TOTAL_MEMORY
from fsm import VIRTUAL_MEMORY
from fsm import app_settings
from fsm import log
from fsm import make_log
from fsm.util import TqdmUpTo
from fsm.util import run_in_thread


# TODO Need to account for Steam in some of these paths


class FactorioManager(object):
	def __init__(self, name, port, root_path, is_steam=False):
		self.name = name
		self.port = port
		self.process = None
		self.root_path = Path(root_path)
		self.log = make_log('{}_factorio'.format(name))
		self.update_available = False
		self._ps_proc = None
		self._virtual_mem = VIRTUAL_MEMORY
		self._is_steam = is_steam
		self._player_data = None
		self._config = None
		self._server_config = None
		self._version_info = None
		self._available_versions = None
		self._temp_update = None
		self._log_queue = deque(maxlen=20)
		self._status_history = deque(maxlen=50)

	@property
	def version(self):
		if self._version_info is None:
			self.set_version_info()
		return self._version_info['version']

	@property
	def build(self):
		if self._version_info is None:
			self.set_version_info()
		return self._version_info['build']

	@property
	def build_num(self):
		if self._version_info is None:
			self.set_version_info()
		return self._version_info['build']['number']

	@property
	def build_platform(self):
		if self._version_info is None:
			self.set_version_info()
		return self._version_info['build']['platform']

	@property
	def build_mode(self):
		if self._version_info is None:
			self.set_version_info()
		return self._version_info['build']['mode']

	@property
	def bin_version(self):
		if self._version_info is None:
			self.set_version_info()
		return self._version_info['binary version']

	@property
	def map_in_version(self):
		if self._version_info is None:
			self.set_version_info()
		return self._version_info['map input version']

	@property
	def map_out_version(self):
		if self._version_info is None:
			self.set_version_info()
		return self._version_info['map output version']

	@property
	def is_experimental(self):
		if not self._available_versions:
			t = self.fetch_factorio_versions()
			t.join()
		if self.version_list.index(self.stable) < self.version_list.index(self.version):
			return True
		return False

	@property
	def stable(self):
		if not self._available_versions:
			t = self.fetch_factorio_versions()
			t.join()
		return self._available_versions['stable']

	@property
	def version_list(self):
		if not self._available_versions:
			t = self.fetch_factorio_versions()
			t.join()
		return self._available_versions['version_list']

	@property
	def experimental_version_list(self):
		if not self._available_versions:
			t = self.fetch_factorio_versions()
			t.join()
		return self.version_list[self.version_list.index(self.stable) + 1:]

	@property
	def stable_version_list(self):
		if not self._available_versions:
			t = self.fetch_factorio_versions()
			t.join()
		return self.version_list[:self.version_list.index(self.stable) + 1]

	@property
	def executable(self):
		if OS_WIN:
			return (self.root_path / 'bin' / 'x64' / 'factorio.exe').resolve()
		else:
			return (self.root_path / 'bin' / 'x64' / 'factorio').resolve()

	@property
	def save_file(self):
		return (self.root_path / 'saves' / self.name / '{}.zip'.format(self.name)).resolve()

	@property
	def player_data(self):
		if not self._player_data:
			self._player_data = json.load((self.root_path / 'player-data.json').resolve().open())
		return self._player_data

	@property
	def service_username(self):
		if not self._player_data:
			self._player_data = json.load((self.root_path / 'player-data.json').resolve().open())
		return self._player_data['service-username']

	@property
	def service_token(self):
		if not self._player_data:
			self._player_data = json.load((self.root_path / 'player-data.json').resolve().open())
		return self._player_data['service-token']

	@property
	def config(self):
		if not self._config:
			conf_parser = ConfigParser()
			self._config = conf_parser.read((self.root_path / 'config' / 'config.ini').resolve().as_posix())
		return self._config

	@property
	def server_config(self):
		if not self._server_config:
			self._server_config = json.load((self.root_path / 'config' / 'server-settings.json').resolve().open())
		return self._server_config

	@property
	def bits(self):
		if self.build_platform[-2:] == '64':
			return '64'
		else:
			return '32'  # I don't have any 32 bit systems so I wasn't sure what factorio would respond with

	@property
	def core_str(self):
		core = 'core-{}'.format(self.build_platform[:-2])
		if self.build_mode == 'headless':
			core = core + '_headless'
		core = core + self.bits
		return core

	def set_version_info(self):
		log.info('Getting the version info for {}'.format(self.name))
		commands = [self.executable.as_posix(), '--version']
		p = Popen(commands, stdout=PIPE, stderr=PIPE)
		std_out, std_err = p.communicate()
		self._version_info = std_out.decode().splitlines()
		self._version_info = {l.split(':')[0].lower(): l.split(':')[1] for l in self._version_info}
		self._version_info['build'] = self._version_info['version'].split('(')[1]
		self._version_info['build'] = self._version_info['build'].replace(')', '').split(', ')
		self._version_info['build'] = {
			'number': self._version_info['build'][0].replace('build', ''),
			'platform': self._version_info['build'][1],
			'mode': self._version_info['build'][2]
		}
		self._version_info['version'] = self._version_info['version'].split('(')[0].strip()

	def status(self):
		if self.process:
			if not self._ps_proc:
				self._ps_proc = Process(self.process.pid)
			try:
				data = {
					'status': self._ps_proc.status(),
					'cpu': self._ps_proc.cpu_percent(interval=2),
					'mem': naturalsize(self._ps_proc.memory_info().rss),
					'mem_raw': self._ps_proc.memory_info().rss,
					'available_mem': naturalsize(self._virtual_mem.available),
					'available_mem_raw': self._virtual_mem.available,
					'total_mem': naturalsize(TOTAL_MEMORY),
					'total_mem_raw': TOTAL_MEMORY,
				}
			except (NoSuchProcess, AttributeError):
				log.warn('Factorio Process {} does not exist anymore'.format(self.name))
				return
			self._status_history.appendleft(data)
			return list(self._status_history)

	@run_in_thread
	def start(self):
		log.info('Starting Factorio instance {}'.format(self.name))
		if self.name in app_settings.factorio_instances:
			if isinstance(self.process, Popen):
				# TODO: need to do more here to actually check if it is running
				log.warn('{} factorio instance is already running'.format(self.name))
				return
		if self.name not in app_settings.factorio_instances:
			log.warn('{} factorio instance does not exist'.format(self.name))
			return
		commands = [self.executable.as_posix(), '--start-server', self.save_file, '--port', str(self.port)]
		log.debug('Starting {}'.format(self.name))
		self.process = Popen(commands, stdin=PIPE, stdout=PIPE, stderr=PIPE)
		self.output_log()

	@run_in_thread
	def output_log(self):
		while True:
			std_out = self.process.stdout.readline()
			if std_out:
				std_out = std_out.decode()
				self._log_queue.append('{} {}: {}'.format(
					datetime.now().strftime('%Y-%m-%d %H:%M:%S.%f')[:-3],
					self.name.upper(),
					std_out.replace('\n', '')
				))
				self.log.info(std_out)
			else:
				sleep(.05)
			if self.process is None:
				break
			if self.process.poll() is not None:
				break

	def get_log_line(self):
		if len(self._log_queue):
			return self._log_queue.pop()
		else:
			return

	@run_in_thread
	def stop(self):
		log.debug('Stopping {}'.format(self.name))
		if self.process:
			self.process.terminate()
			self.process = None
			self._ps_proc = None

	@run_in_thread
	def kill(self):
		log.debug('Killing {}'.format(self.name))
		if self.process:
			self.process.kill()
			self.process = None
			self._ps_proc = None

	@run_in_thread
	def send_command(self, command):
		# TODO: This does not work. No idea how it should work
		if self.process:
			self.process.communicate('{}\n'.format(command).encode())

	def create_save_file(self, map_gen_file_path=None, map_settings_path=None, preset=None, map_preview_path=None):
		if not self.save_file.is_file():
			if not (self.save_file / '..').resolve().is_dir():
				(self.save_file / '..').resolve().mkdir()
			commands = [
				self.executable.as_posix(),
				'--create',
				self.save_file.as_posix()
			]
			# TODO: Add the optional arguments to commands
			p = Popen(commands, stdout=PIPE, stderr=PIPE)
			log.info(p.communicate())

	def get_version_info(self):
		if self._version_info is None:
			self.set_version_info()
		return self._version_info

	def check_for_update(self):
		self.get_version_info()
		t = self.fetch_factorio_versions()
		t.join()
		if self.is_experimental:
			version_list = self.experimental_version_list
		else:
			version_list = self.stable_version_list
		if self.version != version_list[-1]:
			self.update_available = version_list[-1]
			return version_list[-1]
		else:
			self.update_available = False

	def get_download_link(self, version):
		get_link_url = 'https://www.factorio.com/get-download-link'
		update_version_info = list(filter(
			lambda x: x['to'] == version,
			self._available_versions['available_versions']
		))[0]
		data = {
			'username': self.service_username,
			'token': self.service_token,
			'package': self.core_str,
			'from': update_version_info['from'],
			'to': update_version_info['to'],
			'apiVersion': 2
		}
		req = request.Request(get_link_url + '?' + parse.urlencode(data))
		resp = request.urlopen(req)
		download_link = json.loads(resp.read())
		return download_link[0]

	def download_update(self, version):
		link = self.get_download_link(version)
		log.info(link)
		with TqdmUpTo(unit='B', unit_scale=True, miniters=1, desc=link.split('/')[-1]) as t:
			self._temp_update = request.urlretrieve(link, reporthook=t.download_progress)[0]

	@run_in_thread
	def apply_update(self):
		if self._temp_update:
			commands = [
				self.executable.as_posix(),
				'--apply-update',
				self._temp_update
			]
			p = Popen(commands, stdout=PIPE, stderr=PIPE)
			log.info(p.communicate())
			p.terminate()
		self.set_version_info()
		self.update_available = False

	@run_in_thread
	def fetch_factorio_versions(self):
		available_versions_url = 'https://www.factorio.com/get-available-versions'
		data = parse.urlencode({'username': self.service_username, 'token': self.service_token, 'apiVersion': 2})
		req = request.Request(available_versions_url + '?' + data)
		resp = request.urlopen(req)
		json_resp = json.loads(resp.read())
		available_versions = json_resp[self.core_str]
		stable_version = list(filter(lambda x: True if 'stable' in x else False, available_versions))[0]['stable']
		available_versions = list(filter(lambda x: False if 'stable' in x else True, available_versions))
		version_list = sorted(available_versions, key=lambda s: [int(u) for u in s['to'].split('.')])
		version_list = [u['to'] for u in version_list]
		self._available_versions = {
			'stable': stable_version, 'version_list': version_list, 'available_versions': available_versions
		}
		return json_resp
