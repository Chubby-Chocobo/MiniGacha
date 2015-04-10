var AServer = require("../core/Main");
var Config  = require("../config/Config");
var Routes  = require("../config/Routes");

function boot() {
    logger.info("Start booting application...");
    if(!global.aserver) {
        global.aserver = {};
    }

    global.aserver.app = new AServer()
    global.aserver.app.initialize({
        port    : Config.port,
        dbType  : Config.dbType,
        dbName  : Config.dbName,
        env     : process.env.NODE_ENV || Const.ENV.DEV,
    });

    logger.info("Application initialized. Creating routes table...");

    for (var path in Routes) {
        var controller = new Routes[path]();
        controller.initialize();
        global.aserver.app.addController(path, controller);
    }

    getModel = function(name) {
        return global.aserver.app.getModel(name);
    };

    getService = function(name) {
        return global.aserver.app.getService(name);
    };

}

boot();