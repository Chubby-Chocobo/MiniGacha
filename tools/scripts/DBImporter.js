sqlite3             = require("sqlite3").verbose();
log4js              = require("log4js");
fs                  = require("fs");
path                = require("path");
async               = require("async");
_                   = require("underscore");
logger              = log4js.getLogger();

var dbDir           = "../../data/db/";
var dbName          = require("../../config/Config").dbName;
var master          = require("../../data/master/output/master");
var Utils           = require("../../core/common/Utils");
var SQLiteDriver    = require("../../core/common/SQLiteDriver");

async.auto({
    connectToDB : function(next, res) {
        logger.info("Connecting to DB...");
        var db = new SQLiteDriver();
        db.initialize(dbName, next);
    },
    tableNames : ["connectToDB", function(next, res) {
        var db = res.connectToDB;
        db.run("BEGIN");
        var tables = _.keys(master);
        logger.info(tables);
        async.forEachSeries(tables, function(table, _next) {
            logger.info("Inserting data to table: " + table);
            var name = Utils.convertToCamelCase(table).capitalizeFirstLetter();
            var modelName = name + "Model";
            var ModelClass = require("../../app/models/" + modelName);
            var entityName = name + "Entity";
            var EntityClass = require("../../app/entities/" + entityName);
            var model = new ModelClass();
            model.initialize(db);
            var entities = [];
            for (var i = 0; i < master[table].length; i++) {
                var entity = new EntityClass();
                entity.initialize(master[table][i]);
                entities.push(entity);
            }
            model.truncate(function(_err, _res) {
                if (_err) {
                    _next(_err)
                } else {
                    model.insert(entities, _next);
                }
            })
        }, function(_err, _res) {
            if (_err) {
                logger.info(_err);
            }
            next(_err);
        });
    }]
}, function (err, res) {
    if (err) {
        res.connectToDB.run("ROLLBACK");
        logger.error(err);
    } else {
        res.connectToDB.run("COMMIT");
    }
    logger.info("Finish.");
});