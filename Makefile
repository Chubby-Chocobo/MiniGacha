install-modules:
	cd core && npm install
	cd tools/scripts && npm install

config-dev:
	cd config && ln -sf Development.js Config.js

config-prod:
	cd config && ln -sf Production.js Config.js

start-server:
	cd app && node Main.js

load-schema:
	cd tools/scripts && node DBSchemaLoader.js ${target}

generate-data:
	cd tools/xls2JSON && python main.py

update-data:
	cd tools/scripts && node DBImporter.js

update-db:
	make generate-data
	make update-data
