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
                var filePath = "../data/db/" + filename;
                self._db = new sqlite3.Database(filePath, sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, next);
            },
        }, function(err, res) {
            callback(err, self);
        });
    },

    get : function(sql, params, callback) {
        this._db.get(sql, params, callback);
    },

    all : function(sql, params, callback) {
        this._db.all(sql, params, callback);
    },

    each : function(sql, params, eachCallback, finalCallback) {
        this._db.each(sql, params, eachCallback, finalCallback);
    },

    exec : function(sql, callback) {
        this._db.exec(sql, callback);
    },

    run : function(sql, params, callback) {
        this._db.run(sql, params, callback);
    },

    commit : function(callback) {
        this.run("COMMIT", [], callback);
    },

    rollback : function(callback) {
        this.run("ROLLBACK", [], callback);
    },
});