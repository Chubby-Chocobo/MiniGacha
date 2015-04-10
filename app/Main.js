var AServer = require("../core/Main");
var Const   = require("../core/common/Const");
var Config  = require("../config/Config");
var Routes  = require("../config/Routes");

function createServerInstance() {

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

    for (var path in Routes) {
        var controller = new Routes[path]();
        controller.initialize();
        global.aserver.app.addController(path, controller);
    }
}

function boot() {
    createServerInstance();
}

boot();