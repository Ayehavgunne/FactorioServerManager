import cherrypy

from fsm.util import get_html
from fsm.util import check_password
from fsm.settings import app_settings
from fsm.create_logs import log


SESSION_KEY = '_cp_username'


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


class WebAdmin(object):
	auth = AuthController()

	@cherrypy.expose()
	@require()
	def index(self):
		sess = cherrypy.session
		username = sess.get(SESSION_KEY, None)
		return get_html('fsm', {'username': username})

	@cherrypy.expose()
	def factorio_status(self, name):
		pass

	@cherrypy.expose()
	def start_factorio_instance(self, name):
		app_settings.factorio_processes[name].start()

	@cherrypy.expose()
	def stop_factorio_instance(self, name):
		app_settings.factorio_processes[name].stop()

	@cherrypy.expose()
	def send_command(self, name):
		app_settings.factorio_processes[name].send_command('/s hello all players!')
