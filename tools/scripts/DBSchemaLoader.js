var sqlite3 = require("sqlite3").verbose();
var log4js  = require("log4js");
var fs      = require("fs");
var async   = require("async");
var _       = require("underscore");
logger = log4js.getLogger();

var dbDir       = "../../data/db/";
var schemaDir   = "../../data/schema/";
var dbName      = require("../../config/Config").dbName;
var target      = process.argv[2] || "all";
var db;

async.auto({
    checkSchemaFolder : function(next, res) {
        logger.info("Checking schema folder...");
        fs.readdir(schemaDir, next);
    },
    loadSchemaFile : ["checkSchemaFolder", function(next, res) {
        logger.info("Loading schema files...");

        if (target == "all") {
            var sqls = [];
            async.forEachSeries(res.checkSchemaFolder, function(fileName, _next) {
                if (fileName.indexOf(".sql") == -1) {
                    _next();
                    return;
                }
                logger.info("Processing file: " + fileName);
                var filePath = schemaDir + fileName;
                fs.readFile(filePath, "utf8", function(_err, _res) {
                    sqls.push(_res);
                    _next(_err);
                });
            }, function(_err, _res) {
                next(_err, sqls);
            });
        } else {
            var fileName = _.find(res.checkSchemaFolder, function(name) {
                return name.indexOf(target.toString()) == 0;
            });
            if (!fileName){
                next("Cannot find file with target: " + target);
                return;
            }

            logger.info("Processing file: " + fileName);
            var filePath = schemaDir + fileName;
            fs.readFile(filePath, "utf8", next);
        }
    }],
    connectToDB : function(next, res) {
        logger.info("Connecting to DB...");
        var filePath = dbDir + dbName;
        db = new sqlite3.Database(filePath, sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, next);
    },
    onDBConnected : ["connectToDB", "loadSchemaFile", function(next, res) {
        logger.info("On DB connected...");
        db.run("BEGIN");
        if (target == "all") {
            async.forEachSeries(res.loadSchemaFile, function(sql, _next) {
                logger.info("QUERY: " + sql);
                db.run(sql, [], _next);
            }, next);
        } else {
            var sql = res.loadSchemaFile;
            logger.info("QUERY: " + sql);
            db.run(sql, [], next);
        }
    }]

}, function (err, res) {
    if (err) {
        db.run("ROLLBACK");
        logger.error(err);
    } else {
        db.run("COMMIT");
    }
    logger.info("Finish.");
});