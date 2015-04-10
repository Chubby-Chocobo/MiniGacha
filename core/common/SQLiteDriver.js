var sqlite3     = require("sqlite3").verbose();
var async       = require("async");

var BaseClass   = require("./BaseClass");

module.exports = BaseClass.subclass({
    classname : "SQLiteDriver",

    initialize : function(filename, callback) {
        logger.trace(this.classname + "::initialize");
        var self = this;

        async.auto({
            createDB : function(next) {
                var filePath = __dirname + "/../../data/db/" + filename;
                self._db = new sqlite3.Database(filePath, sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, next);
            },
        }, function(err, res) {
            callback(err, self);
        });
    },

    get : function(sql, callback) {
        logger.info("SQL: get [" + sql + "]");
        this._db.get(sql, [], callback);
    },

    all : function(sql, callback) {
        logger.info("SQL: all [" + sql + "]");
        this._db.all(sql, [], callback);
    },

    each : function(sql, eachCallback, finalCallback) {
        logger.info("SQL: each [" + sql + "]");
        this._db.each(sql, [], eachCallback, finalCallback);
    },

    exec : function(sql, callback) {
        logger.info("SQL: exec [" + sql + "]");
        this._db.exec(sql, callback);
    },

    run : function(sql, callback) {
        logger.info("SQL: run [" + sql + "]");
        this._db.run(sql, [], callback);
    },

    beginTransaction : function(callback) {
        logger.info("SQL: BEGIN TRANSACTION");
        db.run("BEGIN", [], callback);
    },

    commit : function(callback) {
        logger.info("SQL: COMMIT");
        this.run("COMMIT", [], callback);
    },

    rollback : function(callback) {
        logger.info("SQL: ROLLBACK");
        this.run("ROLLBACK", [], callback);
    },
});