from pathlib import Path
from setuptools import setup

import fsm


def read(fname):
	return (Path(__file__) / '..' / fname).resolve().open().read()


package_name = fsm.__name__

setup(
	name=package_name,
	version=fsm.__version__,
	author='Anthony Post',
	author_email='postanthony3000@gmail.com',
	description='Factrio Server Manager with web interface',
	license='WTFPL',
	keywords='factorio server managment web interface',
	url='https://github.com/Ayehavgunne/FSM',
	packages=[package_name],
	package_data={},
	include_package_data=True,
	long_description=read('README.md'),
	classifiers=[
		'Development Status :: 1 - Planning',
		'Environment :: Web Environment',
		'Framework :: CherryPy',
		'Intended Audience :: End Users/Desktop',
		'License :: Other/Proprietary License',
		'Natural Language :: English',
		'Operating System :: Microsoft',
		'Operating System :: POSIX',
		'Programming Language :: JavaScript',
		'Programming Language :: Python',
		'Programming Language :: Python :: 3',
		'Programming Language :: Python :: 3.1',
		'Programming Language :: Python :: 3.2',
		'Programming Language :: Python :: 3.3',
		'Programming Language :: Python :: 3.4',
		'Programming Language :: Python :: 3.5',
		'Programming Language :: Python :: 3.6',
		'Programming Language :: Python :: 3 :: Only',
		'Topic :: Games/Entertainment',
		'Topic :: Games/Entertainment :: Simulation',
		'Topic :: Internet :: WWW/HTTP'
	],
	entry_points={
		'console_scripts': [f'fsm = {package_name}.fsm_manager:run']
	},
	install_requires=['cherrypy', 'prompt_toolkit', 'psutil', 'humanize', 'tqdm', 'ws4py']
)
