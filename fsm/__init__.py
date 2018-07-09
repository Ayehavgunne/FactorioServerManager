__version__ = "0.1.0"

import os
import json
import logging
from pathlib import Path

APP_DIR = (Path(__file__) / '..' / '..').resolve()

from psutil import virtual_memory


def make_log(log_name: str = None, stream_log: bool = False, error_log: bool = False) -> logging.Logger:
	the_log = logging.getLogger(log_name)
	the_log.setLevel(logging.INFO)

	log_formatter = logging.Formatter('%(asctime)s - %(levelname)s: %(message)s', datefmt='%m/%d/%Y %I:%M:%S %p')

	logs_path = Path(f'{APP_DIR.as_posix()}/logs')
	if not logs_path.exists():
		print('creating logs directory')
		logs_path.mkdir()
	else:
		print(f'logs directory already exists {Path().as_posix()}')

	if log_name:
		info_file_handler = logging.FileHandler(logs_path / f'{log_name}.log')
		info_file_handler.setLevel(logging.DEBUG)
		info_file_handler.setFormatter(log_formatter)
		the_log.addHandler(info_file_handler)

	if error_log:
		error_file_handler = logging.FileHandler(logs_path / f'{log_name}_errors.log')
		error_file_handler.setLevel(logging.ERROR)
		error_file_handler.setFormatter(log_formatter)
		the_log.addHandler(error_file_handler)

	if stream_log:
		stream_handler = logging.StreamHandler()
		stream_handler.setLevel(logging.INFO)
		stream_handler.setFormatter(log_formatter)
		the_log.addHandler(stream_handler)

	return the_log


log = make_log('fsm', True, True)

config_path = APP_DIR / 'config' / 'fsm_config.json'


def get_settings() -> dict:
	with config_path.open() as fsm_config_file:
		try:
			return json.load(fsm_config_file)
		except json.decoder.JSONDecodeError:
			log.error('Check on the fsm_config.json file, it may be malformed')


current_settings = get_settings()
OS_WIN = os.name == 'nt'  # assuming Linux if not Windows


class AppSettings:
	web_admin_users = {}
	web_admin_port: int = None
	factorio_instances = {}


app_settings = AppSettings()


from fsm import util


def save_settings(settings: dict, conf_path: Path = config_path) -> None:
	with conf_path.open('r+') as fsm_config_file:
		settings = util.merge_two_dicts(settings, json.load(fsm_config_file))
		fsm_config_file.seek(0)
		fsm_config_file.truncate()
		json.dump(settings, fsm_config_file, indent=4, sort_keys=True, separators=(',', ': '))
		fsm_config_file.write('\n')


VIRTUAL_MEMORY = virtual_memory()
TOTAL_MEMORY = VIRTUAL_MEMORY.total
