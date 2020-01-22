#!/usr/bin/python3
import logging
import os

import uvicorn
from cactuar import create_app
from fsm import APP_DIR, app_settings, get_settings, log
from fsm.factorio_manager import FactorioManager
from fsm.util import parse_the_args
from fsm.web_admin import WebAdmin

current_settings = get_settings()


def main(args):
    with open("fsm.pid", "w+") as pid_file:
        pid_file.write(str(os.getpid()))

    if args.debug:
        log.handlers[-1].setLevel(logging.DEBUG)
        log.setLevel(logging.DEBUG)

    log.debug("Setting app users")
    app_settings.web_admin_users = current_settings["web_admin_users"]

    log.debug("Setting app port")
    app_settings.web_admin_port = args.web_admin_port

    for name, instance in current_settings["factorio_instances"].items():
        app_settings.factorio_instances[name] = FactorioManager(name, instance)
        update = app_settings.factorio_instances[name].check_for_update()
        if update:
            log.info(
                f"Update Available: ver. {update}\tCurrent: "
                f"{app_settings.factorio_instances[name].version}"
            )

    # "tools.auth.on": True,
    # "log.access_file": f"{APP_DIR}/logs/cherrypy_access.log",
    # "log.error_file": f"{APP_DIR}/logs/cherrypy_error.log",

    # if args.debug_cherrypy:
    #     global_conf["global"]["log.screen"] = True

    if args.launch_factorios:
        names = args.launch_factorios.split(",")
        for name in names:
            if name in app_settings.factorio_instances:
                app_settings.factorio_instances[name].start()

    log.info(f"Starting web server on http://0.0.0.0:{args.web_admin_port}")
    app = create_app(WebAdmin)
    app.add_static_route(f"{APP_DIR}/static")
    app.add_static_route(f"{APP_DIR}/templates/css", "css")

    @app.on_startup
    def start():
        log.info("FSM server started")

    @app.on_shutdown
    def stop():
        log.info("FSM server stopped")

    uvicorn.run(
        app,
        host="0.0.0.0",
        port=args.web_admin_port,
        log_level="info",
        access_log=False,
    )


if __name__ == "__main__":
    main(parse_the_args())
