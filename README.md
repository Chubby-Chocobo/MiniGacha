# Mini Gacha Game

## Preparation
### Install node
    Get node from https://nodejs.org/, version 0.10.24 is recommended

### Install npm
    $ curl https://npmjs.org/install.sh | sh

### Install node modules
    $ make install-modules

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