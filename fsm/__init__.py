__version__ = "0.1.0"

import os

from pathlib import Path

APP_DIR = (Path(__file__) / '..' / '..').resolve()
OS_WIN = os.name == 'nt'  # assuming Linux if not Windows
