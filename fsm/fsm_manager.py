#!/usr/bin/python3
import os
import sys

from pathlib import Path
from subprocess import Popen
from subprocess import DEVNULL

from psutil import Process

from fsm import OS_WIN
from fsm.util import hash_pass
from fsm.util import make_prompt
from fsm.util import yes_no_prompt
from fsm.util import parse_the_args
from fsm.start import main

from fsm import save_settings
from fsm import current_settings
from fsm.validators import PortNumberValidator
from fsm.validators import FactorioRootValidator
from fsm.validators import FactorioPortNumberValidator
from fsm.validators import FactorioInstanceNameValidator
from fsm import log

common_paths = {
    True: [  # Windows
        "C:/Program Files/Steam/steamapps/common/Factorio/bin",
        "C:/Program Files (x86)/Steam/steamapps/common/Factorio/bin",
        "C:/Program Files/Factorio/bin",
        "C:/Program Files (x86)/Factorio/bin",
        f'{os.getenv("APPDATA")}/Factorio/bin',
        f'{os.getenv("LOCALAPPDATA")}/Factorio/bin',
    ],
    False: [  # Linux
        f'{os.getenv("HOME")}/.factorio/bin',
        f'{os.getenv("HOME")}/.local/share/Steam/steamapps/common/Factorio/bin',
        "/opt/factorio",
    ],
}


def fsm_setup():
    print(
        "Welcome to the FSM setup. To exit at any time please press CTRL-C (settings will NOT be saved)"
    )

    try:
        check_current_settings("web_admin_port", set_web_admin_port)

        set_web_admin_users()
        set_factorio_instance()

        save_settings(current_settings)
    except KeyboardInterrupt:
        print("\nExiting setup. Your settings were not saved!")


def check_current_settings(field_name, callback):
    field_value = current_settings[field_name]
    if field_value:
        set_field_value = not yes_no_prompt(
            f'Would you like to keep the {field_name.replace("_", " ")} set to {field_value}'
        )
    else:
        set_field_value = True
    if set_field_value:
        callback()


def set_factorio_root_path():
    factorio_root_path = None
    for path in common_paths[OS_WIN]:
        check_path = Path(path)
        if check_path.exists():
            check_path = check_path / ".."
            check_path = check_path.resolve()
            keep_path = yes_no_prompt(
                f"Found Factorio installation at {check_path.as_posix()}\n"
                f"Would you like to use this directory"
            )
            if keep_path:
                factorio_root_path = check_path.as_posix()
                break
    if factorio_root_path is None:
        factorio_root_path = make_prompt(
            "Please enter the root path of the Factorio server installation.",
            validator=FactorioRootValidator(),
        )
    factorio_root_path = Path(factorio_root_path)
    if "~" in factorio_root_path.as_posix() and not OS_WIN:
        factorio_root_path = factorio_root_path.expanduser()
    return factorio_root_path.as_posix()


def set_web_admin_port():
    web_admin_port = make_prompt(
        "Please enter the port that the web admin server will bind to.\n"
        "To use the default value of 9876 just press Enter.",
        validator=PortNumberValidator(),
    )
    if web_admin_port == "":
        web_admin_port = 9876
    else:
        web_admin_port = int(web_admin_port)
    current_settings["web_admin_port"] = web_admin_port


def set_web_admin_users():
    if len(current_settings["web_admin_users"]) == 0:
        username = make_prompt(
            "Please enter the username of the first administrator of the web application."
        )
        password = make_prompt(
            "Please enter the password of the first administrator of the web application.",
            is_password=True,
        )
    else:
        setup_new_user = yes_no_prompt("Would you like to setup a new admin user")
        if setup_new_user:
            username = make_prompt("Please enter the username of the new user.")
            password = make_prompt(
                "Please enter the password of the new user.", is_password=True
            )
        else:
            username = None
            password = None
    if username and password:
        current_settings["web_admin_users"].append(
            {"username": username, "password": hash_pass(password)}
        )


def set_factorio_instance():
    # TODO: Might need to do some validation on the instance names to prevent some characters from being used
    name = ""
    port = 34197
    if not current_settings["factorio_instances"]:
        name = make_prompt(
            "Please name your first Factorio Server instance.\n"
            "Instances are individule Factoio servers running different games on different ports.",
            validator=FactorioInstanceNameValidator(),
        )
        port = make_prompt(
            "What port would you like to run this instance on?\n"
            "To use Factorio's default port of 34197 just press Enter. (Mmm, factorios...)",  # part of a balanced breakfast!
            validator=FactorioPortNumberValidator(),
        )
    else:
        while yes_no_prompt("Would you like to add a new instance"):
            name = make_prompt("Please name this Factorio Server instance.")
            port = make_prompt(
                "What port would you like to run this instance on?",
                validator=FactorioPortNumberValidator(),
            )
    port = int(port)
    current_settings["factorio_instances"][name] = {}
    current_settings["factorio_instances"][name]["port"] = port
    path = set_factorio_root_path()
    current_settings["factorio_instances"][name]["root_path"] = path
    current_settings["factorio_instances"][name]["is_steam"] = "/steam/" in path.lower()
    remove_used_paths()


def remove_used_paths():
    for name, instance in current_settings["factorio_instances"].items():
        if instance["root_path"] in common_paths[OS_WIN]:
            common_paths[OS_WIN].remove(instance["root_path"])


def run():
    args = parse_the_args()

    if args.run_setup:
        log.debug("Running FSM Setup")
        fsm_setup()
    elif args.start_in_background:
        if os.name == "NT":
            python = "python"
        else:
            python = "python3"

        commands = [python, "start.py"]
        if len(sys.argv) > 1:
            commands.extend(sys.argv[1:])

        process = Popen(commands, stdout=DEVNULL, stderr=DEVNULL)

        with open("fsm.pid", "w+") as pid_file:
            pid_file.write(str(process.pid))
    elif args.stop:
        with open("fsm.pid") as pid_file:
            pid = int(pid_file.read())

        p = Process(pid)
        p.terminate()
    else:
        main(args)


if __name__ == "__main__":
    run()
