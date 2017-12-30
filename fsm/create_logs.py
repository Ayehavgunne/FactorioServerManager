import logging

from fsm import APP_DIR

log = logging.getLogger('FSM')
log.setLevel(logging.INFO)

log_formatter = logging.Formatter('%(asctime)s - %(levelname)s: %(message)s', datefmt='%m/%d/%Y %I:%M:%S %p')

info_file_handler = logging.FileHandler('{}/logs/fsm.log'.format(APP_DIR.as_posix()))
info_file_handler.setLevel(logging.DEBUG)
info_file_handler.setFormatter(log_formatter)

error_file_handler = logging.FileHandler('{}/logs/fsm_errors.log'.format(APP_DIR.as_posix()))
error_file_handler.setLevel(logging.ERROR)
error_file_handler.setFormatter(log_formatter)

stream_handler = logging.StreamHandler()
stream_handler.setLevel(logging.INFO)
stream_handler.setFormatter(log_formatter)

log.addHandler(info_file_handler)
log.addHandler(error_file_handler)
log.addHandler(stream_handler)
