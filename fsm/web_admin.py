from asyncio import sleep
from collections import deque

from cactuar import expose, session, websocket
from fsm import app_settings, log
from fsm.util import check_password, render_template

instances = app_settings.factorio_instances
log_history = deque(maxlen=20)


def check_credentials(username, password):
    users = app_settings.web_admin_users
    for user in users:
        if username == user["username"]:
            hashed_pass = user["password"]
            if check_password(hashed_pass, password):
                return None
    return "Incorrect username or password"


class AuthController(object):
    @staticmethod
    def on_login(username):
        log.info(f"User {username} logged in")

    @staticmethod
    def on_logout(username):
        log.info(f"User {username} logged out")

    @staticmethod
    def get_loginform(username: str = "", msg="Enter your login information"):
        if len(app_settings.web_admin_users) == 0:
            msg = (
                "There are no users setup. Stop the server and run 'fsm --setup' "
                "in the command line"
            )
        return render_template(context={"message": msg, "username": username})

    @expose.get
    async def login(self, username=None, password=None):
        if username is None or password is None:
            return self.get_loginform()

        error_msg = check_credentials(username, password)
        if error_msg:
            return self.get_loginform(username, error_msg)
        else:
            session["username"] = username
            self.on_login(username)
            raise cherrypy.HTTPRedirect("/")

    @expose.get
    async def logout(self):
        username = session.get("username", None)
        session["username"] = None
        if username:
            self.on_logout(username)
        raise cherrypy.HTTPRedirect("/")


class FactorioDispatch(object):
    @expose.get
    async def start(self, name):
        instances[name].start()

    @expose.get
    async def stop(self, name):
        log.info(f"Trying to stop {name}")
        instances[name].stop()

    @expose.get
    async def get_current_version(self, name):
        return instances[name].version

    @expose.get
    async def check_for_update(self, name):
        update = instances[name].check_for_update()
        if update:
            return f'{{"version": "{update}"}}'
        else:
            return "false"

    @expose.get
    async def updates_available(self, name):
        update = instances[name].update_available
        if update:
            return f'{{"version": "{update}"}}'
        else:
            return "false"

    @expose.get
    async def update(self, name, version):
        log.info(version)
        instances[name].download_update(version)
        instances[name].apply_update()

    @expose.get
    async def server_config(self, name):
        return instances[name].server_config

    @expose.get
    async def update_server_configs(self, name, configs):
        instances[name].server_config = configs


class WebAdmin(object):
    auth = AuthController()
    factorio = FactorioDispatch()

    @expose.get
    async def index(self):
        username = session.get("username", None)
        games = list(instances.keys())

        return render_template(
            page="fsm",
            title="FSM",
            context={"username": username, "games": games, "selected_game": games[0]},
        )

    @expose.websocket
    async def factorio_status(self, name):
        instance = instances[name]
        if instance is not None:
            while websocket.client_is_connected:
                data = instance.status()
                await websocket.send_json(data)
                await sleep(2)
        else:
            await websocket.close()

    @expose.websocket
    async def log_tail(self, name):
        instance = instances[name]
        for line in log_history:
            await websocket.send_text(line)
        if instance is not None:
            while websocket.client_is_connected:
                data = instance.get_log_line()
                if data:
                    log_history.append(data)
                    await websocket.send_json(data)
                else:
                    await sleep(0.1)
        else:
            await websocket.close()

    @expose.get
    async def restart_server(self):
        pass
