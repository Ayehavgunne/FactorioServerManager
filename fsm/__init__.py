__version__ = "0.1.0"

import os
from pathlib import Path

APP_DIR = (Path(__file__) / '..' / '..').resolve()

from psutil import virtual_memory

from fsm.settings import get_settings

current_settings = get_settings()

OS_WIN = os.name == 'nt'  # assuming Linux if not Windows
TOTAL_MEMORY = virtual_memory().total
