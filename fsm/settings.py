import json

from fsm import APP_DIR
from fsm import util
from fsm.create_logs import log

config_path = APP_DIR / 'config' / 'fsm_config.json'


def get_settings():
	with config_path.open() as fsm_config_file:
		try:
			return json.load(fsm_config_file)
		except json.decoder.JSONDecodeError:
			log.error('Check on the fsm_config.json file, it may be malformed')


def save_settings(settings):
	with config_path.open('r+') as fsm_config_file:
		settings = util.merge_two_dicts(settings, json.load(fsm_config_file))
		fsm_config_file.seek(0)
		fsm_config_file.truncate()
		json.dump(settings, fsm_config_file, indent=4, sort_keys=True, separators=(',', ': '))
		fsm_config_file.write('\n')


class AppSettings(object):
	web_admin_users = {}
	web_admin_port = None
	factorio_instances = {}


app_settings = AppSettings()
