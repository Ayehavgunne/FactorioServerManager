import json
from collections import deque

import cherrypy
from time import sleep
from ws4py.websocket import WebSocket
from ws4py.server.cherrypyserver import WebSocketPlugin
from ws4py.server.cherrypyserver import WebSocketTool

from fsm.util import get_html, run_in_thread
from fsm.util import check_password
from fsm import app_settings
from fsm import log


SESSION_KEY = '_cp_username'
instances = app_settings.factorio_instances
cherrypy.tools.websocket = WebSocketTool()
log_history = deque(maxlen=20)


def check_credentials(username, password):
	users = app_settings.web_admin_users
	for user in users:
		if username == user['username']:
			hashed_pass = user['password']
			if check_password(hashed_pass, password):
				return None
	return 'Incorrect username or password'


def check_auth(*args, **kwargs):
	conditions = cherrypy.request.config.get('auth.require', None)
	if conditions is not None:
		username = cherrypy.session.get(SESSION_KEY)
		if username:
			cherrypy.request.login = username
			for condition in conditions:
				if not condition():
					raise cherrypy.HTTPRedirect('/auth/login')
		else:
			raise cherrypy.HTTPRedirect('/auth/login')


cherrypy.tools.auth = cherrypy.Tool('before_handler', check_auth)


def require(*conditions):
	def decorate(f):
		if not hasattr(f, '_cp_config'):
			f._cp_config = dict()
		if 'auth.require' not in f._cp_config:
			f._cp_config['auth.require'] = []
		f._cp_config['auth.require'].extend(conditions)
		return f
	return decorate


class AuthController(object):
	@staticmethod
	def on_login(username):
		log.info('User {} logged in'.format(username))

	@staticmethod
	def on_logout(username):
		log.info('User {} logged out'.format(username))

	@staticmethod
	def get_loginform(username, msg="Enter login information", from_page='/'):
		if len(app_settings.web_admin_users) == 0:
			msg = "There are no users setup. Stop the server and run 'fsm --setup' in the command line"
		return get_html('login', {'msg': msg, 'from_page': from_page, 'username': username})

	@cherrypy.expose
	def login(self, username=None, password=None, from_page='/'):
		if username is None or password is None:
			return self.get_loginform("", from_page=from_page)

		error_msg = check_credentials(username, password)
		if error_msg:
			return self.get_loginform(username, error_msg, from_page)
		else:
			cherrypy.session[SESSION_KEY] = cherrypy.request.login = username
			self.on_login(username)
			raise cherrypy.HTTPRedirect(from_page or '/')

	@cherrypy.expose
	def logout(self, from_page='/'):
		sess = cherrypy.session
		username = sess.get(SESSION_KEY, None)
		sess[SESSION_KEY] = None
		if username:
			cherrypy.request.login = None
			self.on_logout(username)
		raise cherrypy.HTTPRedirect(from_page or '/')


class CustomWS(WebSocket):
	def __init__(self, sock, protocols=None, extensions=None, environ=None, heartbeat_freq=None):
		super().__init__(sock, protocols, extensions, environ, heartbeat_freq)
		self.instance = None
		self.broadcast = False

	def set_instance(self, instance):
		self.instance = instance
		self.broadcast = True

	def opened(self):
		log.debug('{} Socket was opened'.format(self.__class__.__name__.replace('WSHandler', '')))

	def close(self, code=1000, reason=''):
		super().close(code, reason)
		self.broadcast = False

	def closed(self, code, reason=None):
		self.broadcast = False
		log.debug('{} Socket was closed'.format(self.__class__.__name__.replace('WSHandler', '')))

	def received_message(self, message):
		log.info(message)

	def __str__(self):
		return self.__class__.__name__


class FactorioWSHandler(CustomWS):
	@run_in_thread
	def start_stream(self):
		if self.instance is not None:
			while self.broadcast:
				data = self.instance.status()
				data = json.dumps(data)
				if self.broadcast and not self.client_terminated:
					self.send(data)
				sleep(2)


class LogWSHandler(CustomWS):
	@run_in_thread
	def start_stream(self):
		for line in log_history:
			self.send(line)
		if self.instance is not None:
			while self.broadcast:
				data = self.instance.get_log_line()
				if data:
					data = json.dumps(data)
					log_history.append(data)
					if self.broadcast and not self.client_terminated:
						self.send(data)
				else:
					sleep(.1)


class Ws(object):
	@cherrypy.expose()
	@cherrypy.tools.websocket(handler_cls=FactorioWSHandler)
	def factorio_status(self, name):
		handler = cherrypy.request.ws_handler
		log.debug('Factorio Status socket handler created {}'.format(handler))
		handler.set_instance(instances[name])
		cherrypy.engine.factorio_ws_handler = handler

	@cherrypy.expose()
	@cherrypy.tools.websocket(handler_cls=LogWSHandler)
	def log_tail(self, name):
		handler = cherrypy.request.ws_handler
		log.debug('Log Tail socket handler created {}'.format(handler))
		handler.set_instance(instances[name])
		cherrypy.engine.log_ws_handler = handler


@cherrypy.popargs('name')
class FactorioDispatch(object):
	@cherrypy.expose()
	def start(self, name):
		instances[name].start()

	@cherrypy.expose()
	def stop(self, name):
		log.info('Trying to stop {}'.format(name))
		instances[name].stop()

	@cherrypy.expose()
	def get_current_version(self, name):
		return instances[name].version

	@cherrypy.expose()
	def check_for_update(self, name):
		update = instances[name].check_for_update()
		if update:
			return '{"version": "%s"}' % update
		else:
			return 'false'

	@cherrypy.expose()
	def updates_available(self, name):
		update = instances[name].update_available
		if update:
			return '{"version": "%s"}' % update
		else:
			return 'false'

	@cherrypy.expose()
	def update(self, name, version):
		log.info(version)
		instances[name].download_update(version)
		instances[name].apply_update()

	@cherrypy.expose()
	@cherrypy.tools.json_out()
	def server_config(self, name):
		return instances[name].server_config

	@cherrypy.expose()
	@cherrypy.tools.json_in()
	def update_server_configs(self, name):
		configs = cherrypy.request.json
		instances[name].server_config = configs



class WebAdmin(object):
	auth = AuthController()
	factorio = FactorioDispatch()
	ws = Ws()

	def __init__(self):
		cherrypy.engine.subscribe('start', self.start)
		cherrypy.engine.subscribe('stop', self.stop)

	@staticmethod
	def start():
		log.info('FSM server started')

	@staticmethod
	def stop():
		if hasattr(cherrypy.engine, 'factorio_ws_handler'):
			cherrypy.engine.factorio_ws_handler.close()
		if hasattr(cherrypy.engine, 'log_ws_handler'):
			cherrypy.engine.log_ws_handler.close()
		for process in instances.values():
			try:
				process.stop()
			finally:
				pass
		log.info('FSM server stopped')

	@cherrypy.expose()
	@require()
	def index(self):
		sess = cherrypy.session
		username = sess.get(SESSION_KEY, None)
		games = ''.join([
			'<option value={0}>{0}</option>'.format(name)
			if x != 0 else '<option value={0} selected=true>{0}</option>'.format(name)
			for x, name in enumerate(instances.keys())
		])
		return get_html('fsm', {'username': username, 'games': games})

	@cherrypy.expose()
	def start_stream(self, stream_type):
		if stream_type == 'factorio':
			if hasattr(cherrypy.engine, 'factorio_ws_handler'):
				cherrypy.engine.factorio_ws_handler.start_stream()
		if stream_type == 'log':
			if hasattr(cherrypy.engine, 'log_ws_handler'):
				cherrypy.engine.log_ws_handler.start_stream()

	@cherrypy.expose()
	def restart_server(self):
		cherrypy.engine.restart()


WebSocketPlugin(cherrypy.engine).subscribe()
cherrypy.engine.signals.subscribe()
