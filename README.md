# Mini Gacha Game

## Preparation
### Install node
    Get node from https://nodejs.org/, version 0.10.24 is recommended

### Install npm
    $ curl https://npmjs.org/install.sh | sh

### Install node modules
    $ make install-modules

### Install python (to run master data generator)
    Install python 2.7
    https://www.python.org/downloads/
    Install module to read/write excel
    https://pypi.python.org/pypi/xlrd
    https://pypi.python.org/pypi/xlwt
    https://pypi.python.org/pypi/xlutils

## Development
### Switch config for current environment:
    $ make config-dev
    $ make config-prod

### Init database file & schema:
    Add schema file to data/schema folder
    $ make load-schema target={target}

### Update master data:
    Edit file data/master/master.xls
    Then run :
    $ make generate-data
    $ make update-data
    Or:
    $ make update-db

### Run app
    $ make start-server