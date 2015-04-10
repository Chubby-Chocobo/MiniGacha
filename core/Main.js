var http            = require("http");
var express         = require("express");
var path            = require("path");
var morgan          = require("morgan");
var log4js          = require("log4js");
var cookieParser    = require("cookie-parser");
var bodyParser      = require("body-parser");

logger = log4js.getLogger();

var Const           = require("./common/Const");
var BaseClass       = require("./common/BaseClass");
var SQLiteManager   = require("./common/SQLiteManager");

var AServer = BaseClass.subclass({
    classname : "Aserver",

    initialize : function(data) {
        this._initApp(data);
        this._initServer(data);
        this._initDBManager(data);
        this._initModels(data);
    },

    _initApp : function(data) {
        var app = express();

        app.set("views", path.join(__dirname, "../views"));
        app.set("view engine", "jade");
        app.set("port", data.port);
        app.use(morgan('dev'));
        app.use(bodyParser.urlencoded({ extended: false }));
        app.use(cookieParser());
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

        // TODO: test code
        var driver = this._dbManager.getSQLiteDriver("common", function(){});
    },

    _initModels : function(data) {

    },

    addController : function(path, controller) {
        this.myApp.use(path, controller.getRouter());
    },

    onListening : function() {
        logger.info("onListening");
    },

    onError : function() {
        logger.info("onError");
    }
});

module.exports = AServer;