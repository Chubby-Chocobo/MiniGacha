var BaseClass   = require("./BaseClass");
var BaseEntity  = require("./BaseEntity");

module.exports = BaseClass.subclass({
    classname : "BaseModel",
    tablename : "Table",

    initialize : function(dbDriver) {
        logger.info(this.classname + "::initialize");
        this._dbDriver = dbDriver;
    },

    getTableName : function() {
        var table = this.tablename;
        if (!table) {
            table = this.classname.match(/([A-Z][a-z0-9]+)/g)
                .join('_').toLowerCase();
        }
        return table;
    },

    beginTransaction : function(callback) {
        this._dbDriver.beginTransaction(callback)
    },

    commit : function(callback) {
        this._dbDriver.commit(callback);
    },

    rollback : function(callback) {
        this._dbDriver.rollback(callback);
    },

    _parseOption : function(options) {
        return "";
    },

    _columns : function(columns) {
        var result = " (";
        for (var i = 0; i < columns.length; i++) {
            result += "`" + columns[i] + "`";
            if (i < columns.length - 1) {
                result += ", ";
            }
        }
        result += ") ";
        return result;
    },

    _values : function(values) {
        var result = " (";
        for (var i = 0; i < values.length; i++) {
            value = values[i];
            if (value == "") {
                result += "''";
            } else {
                if (typeof value == "string") {
                    result += "'" + value + "'";
                } else {
                    result += value.toString();
                }
            }
            if (i < values.length - 1) {
                result += ", ";
            }
        }
        result += ") ";
        return result;
    },

    insert : function(entities, callback) {
        if (!entities || !entities.length) {
            callback();
            return;
        }

        var columns = entities[0].getColumnNames();
        var sql = "INSERT INTO " + this.getTableName();
        sql += this._columns(columns);
        sql += "VALUES";

        for (var i = 0; i < entities.length; i++) {
            var entity = entities[i];
            sql += this._values(entity.getColumnValues());
            if (i < entities.length - 1) {
                sql += ", "
            }
        }

        this._dbDriver.run(sql, callback);
    },

    get : function(options, callback) {
        var sql = "SELECT * from " + this.getTableName() + this._parseOption(options);
        this._dbDriver.get(sql, callback);
    },

    truncate : function(callback) {
        var sql = "DELETE FROM " + this.getTableName();
        this._dbDriver.run(sql, callback);
    },

    remove : function(options, callback) {

    },

    update : function(callback) {

    },
});