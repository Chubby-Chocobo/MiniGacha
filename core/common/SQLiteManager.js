var _               = require("underscore");
var async           = require("async");

var BaseClass       = require("./BaseClass");
var SQLiteDriver    = require("./SQLiteDriver");
var Config          = require("../../config/Config");

module.exports = BaseClass.subclass({

    classname: "SQLiteManager",

    initialize : function(config) {
        logger.trace(this.classname + "::initialize");

        this._config = config;
        this._drivers = {};
    },

    getSQLiteDriver : function(key, callback) {
        var self = this;
        async.series ({
            createDrive : function(next) {
                if (!self._drivers[key]) {
                    self._drivers[key] = new SQLiteDriver();
                    self._drivers[key].initialize(self._config.dbName, next);
                } else {
                    next(null, self._drivers[key]);
                }
            }
        }, function(err, res) {
            callback(err, res.createDrive);
        });

        return self._drivers[key];
    },

    release : function(callback) {
        // TODO
        if (callback) {
            callback();
        }
    },

    commit : function(callback) {
        var self = this;

        async.forEachSeries(_.toArray(self._drivers), function(driver, next) {
            logger.info("SQL: COMMIT");
            driver.query("COMMIT", next);
        }, function(err, res) {
            if (err) {
                cb(err);
                return;
            }
            cb(null, true);
        });
    },

    rollback : function(callback) {
        var self = this;

        async.forEachSeries(_.toArray(self._drivers), function(driver, next) {
            logger.info("SQL: ROLLBACK");
            driver.query("ROLLBACK", next);
        }, function(err, res) {
            if (err) {
                cb(err);
                return;
            }
            cb(null, true);
        });
    }

});