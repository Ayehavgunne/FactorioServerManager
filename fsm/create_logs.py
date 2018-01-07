import logging

from fsm import APP_DIR


def make_log(log_name=None, stream_log=False, error_log=False):
	the_log = logging.getLogger(log_name)
	the_log.setLevel(logging.INFO)

	log_formatter = logging.Formatter('%(asctime)s - %(levelname)s: %(message)s', datefmt='%m/%d/%Y %I:%M:%S %p')

	if log_name:
		info_file_handler = logging.FileHandler('{}/logs/{}.log'.format(APP_DIR.as_posix(), log_name))
		info_file_handler.setLevel(logging.DEBUG)
		info_file_handler.setFormatter(log_formatter)
		the_log.addHandler(info_file_handler)

	if error_log:
		error_file_handler = logging.FileHandler('{}/logs/{}_errors.log'.format(APP_DIR.as_posix(), log_name))
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
