http                = require("http");
express             = require("express");
morgan              = require("morgan");
log4js              = require("log4js");
cookieParser        = require("cookie-parser");
cookieSession       = require("cookie-session");
session             = require("express-session");
bodyParser          = require("body-parser");
path                = require("path");
_                   = require("underscore");
async               = require("async");
fs                  = require("fs");
logger              = log4js.getLogger();
Const               = require("./common/Const");
Utils               = require("./common/Utils");
LocalCache          = require("./common/LocalCache");

var BaseClass       = require("./common/BaseClass");
var SQLiteManager   = require("./common/SQLiteManager");
var MasterDataCache = require("./common/MasterDataCache");
var Config          = require("../config/Config");

var AServer = BaseClass.subclass({
    classname : "Aserver",

    initialize : function(data) {
        this._initApp(data);
        this._initServer(data);
        this._initDBManager(data);
        this._loadMasterDataToCache();
    },

    _initApp : function(data) {
        var app = express();

        app.set("views", path.join(__dirname, "../views"));
        app.set("view engine", "jade");
        app.set("port", data.port);
        app.use(morgan('dev'));
        app.use(cookieParser());
        app.use(session({
            secret: Config.secret,
            resave: true,
            saveUninitialized: true,
        }));
        app.use(bodyParser.urlencoded({ extended: false }));
        app.use(express.static(path.join(__dirname, '../public')));

        this.myApp = app;
    },

    _initServer : function(data) {
        var server = http.createServer(this.myApp);
        server.listen(data.port);
        server.on("error", this.onError.bind(this));
        server.on("listening", this.onListening.bind(this));

        this.myServer   = server;
    },

    _initDBManager : function(data) {
        if (data.dbType == Const.DB_TYPE.SQLITE) {
            this._dbManager = new SQLiteManager();
            this._dbManager.initialize({
                dbName : data.dbName,
            });
        } else {
            logger.error(this.classname + "::_initDBManager does not support db type: " + data.dbType);
        }
    },

    _loadMasterDataToCache : function() {
        // TODO: make this works
        // call this everytime update database as well
        this._masterDataCache = new MasterDataCache();
        this._masterDataCache.initialize();
    },

    addController : function(path, controller) {
        logger.info(controller.classname + " will handle [" + path + "]...");
        this.myApp.use(path, controller.getRouter());
    },

    onListening : function() {
        logger.info("onListening");
    },

    onError : function() {
        logger.info("onError");
    },

    getModel : function(name) {
        if (!this._dbManager) {
            logger.error(classname + "::getModel cannot get model before init database connection.");
            return;
        }

        if (!this._models) {
            this._models = {};
        }

        if (!this._models[name]) {
            var dbDriver = this._dbManager.getSQLiteDriver("common", function(){});
            var ModelClass = require("../app/models/" + name);
            this._models[name] = new ModelClass();
            this._models[name].initialize(dbDriver);
        }

        return this._models[name];
    },

    getService : function(name) {
        if (!this._dbManager) {
            logger.error(classname + "::getSerivce cannot get service before init database connection.");
            return;
        }

        if (!this._services) {
            this._services = {};
        }

        if (!this._services[name]) {
            var dbDriver = this._dbManager.getSQLiteDriver("common", function(){});
            var ServiceClass = require("../app/services/" + name);
            this._services[name] = new ServiceClass();
            this._services[name].initialize(dbDriver);
        }

        return this._services[name];
    }
});

module.exports = AServer;