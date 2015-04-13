var BaseClass   = require("./BaseClass");
var BaseEntity  = require("./BaseEntity");

module.exports = BaseClass.subclass({
    classname   : "BaseModel",

    $entity      : BaseEntity,
    $tablename   : "Table",
    $primaryKeys : ["id"],

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

    _getStringQueryValue : function(value) {
        if (typeof value == "string") {
            return "'" + value + "'";
        } else {
            return value.toString();
        }
    },

    _getStringQueryColumn : function(column) {
        return "`" + column + "`";
    },

    _parseOption : function(options) {
        var clause = "";

        if (options.where) {
            clause += (" where " + options.where);
        }

        if (options.orderBy) {
            clause += (" order by " + options.orderBy);
        }

        if (options.limit) {
            clause += (" limit " + options.limit);
        }

        return clause;
    },

    _whereEntityIs : function(entity) {
        var data = entity;
        if (entity instanceof BaseEntity) {
            data = entity.getData();
        }
        var where = " where (";
        var conds = [];
        for (var i in this.primaryKeys) {
            var key = this.primaryKeys[i];
            var cond = (key + " = ");
            cond += this._getStringQueryValue(data[key]);
            conds.push(cond);
        }
        where += conds.join(" AND ");
        where += ")";
        return where;
    },

    _columns : function(columns) {
        var result = " (";
        for (var i = 0; i < columns.length; i++) {
            result += this._getStringQueryColumn(columns[i]);
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
                result += this._getStringQueryValue(value);
            }
            if (i < values.length - 1) {
                result += ", ";
            }
        }
        result += ") ";
        return result;
    },

    _setValuesClause : function(entity) {
        var t = [];
        var data = entity;
        if (entity instanceof BaseEntity) {
            data = entity.getData();
        }
        for (var key in data) {
            t.push(key + "=" + this._getStringQueryValue(data[key]));
        }
        return t.join(",");
    },

    _constructEntity: function(data) {
        if (!data) {
            return null;
        }
        var entity = new this.entity();
        entity.initialize(this, data);
        return entity;
    },

    insertWithData : function(data, callback) {
        if (!data || !data.length) {
            logger.warn(this.classname + "::insertWithData data=" + JSON.stringify(data));
            callback();
            return;
        }

        var columns = _.keys(data[0]);
        var sql = "INSERT INTO " + this.getTableName();
        sql += this._columns(columns);
        sql += "VALUES";

        for (var i = 0; i < data.length; i++) {
            sql += this._values(_.values(data[i]));
            if (i < data.length - 1) {
                sql += ", "
            }
        }

        this._dbDriver.run(sql, callback);
    },

    insert : function(entities, callback) {
        if (!entities || !entities.length) {
            logger.warn(this.classname + "::insert entities=" + JSON.stringify(entities));
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

    all : function(options, callback) {
        var self = this;
        async.auto({
            query : function(next, res) {
                var sql = "SELECT * from " + self.getTableName()
                        + self._parseOption(options);
                self._dbDriver.all(sql, next);
            }
        }, function(err, res) {
            var entities = [];
            _.each(res.query, function(data) {
                entities.push(self._constructEntity(data));
            });
            callback(err, entities);
        });
    },

    getAll : function(callback) {
        this.all({
            where : "1",
        }, callback);
    },

    // TODO: this method should separate to other interface
    // since there're tables that don't have user_id column
    getAllOfUser : function(userId, callback) {
        this.all({
            where : " user_id=" + userId,
        }, callback);
    },

    get : function(options, callback) {
        var self = this;
        async.auto({
            query : function(next, res) {
                var sql = "SELECT * from " + self.getTableName()
                        + self._parseOption(options);
                self._dbDriver.get(sql, next);
            }
        }, function (err, res) {
            callback(err, self._constructEntity(res.query));
        });
    },

    truncate : function(callback) {
        var sql = "DELETE FROM " + this.getTableName();
        this._dbDriver.run(sql, callback);
    },

    remove : function(entity, callback) {
        var sql = "DELETE FROM " + this.getTableName()
                + this._whereEntityIs(entity);
        this._dbDriver.run(sql, callback);
    },

    update : function(entity, callback) {
        // TODO: optimize by updating changed values only.
        var sql = "UPDATE " + this.getTableName()
                + " SET " + this._setValuesClause(entity)
                + this._whereEntityIs(entity);
        this._dbDriver.run(sql, callback);
    },

    insertOrUpdate : function(entity, callback) {
        var self = this;

        async.auto({
            current : function(next, res) {
                self.get({
                    where : self._whereEntityIs(entity).slice(6),
                }, next);
            },
            upsert : ["current", function(next, res) {
                if (!res.current) {
                    // TODO : refactor this. Data type should be unified
                    if (entity instanceof BaseEntity) {
                        self.insert([entity], next);
                    } else {
                        self.insertWithData([entity], next);
                    }
                } else {
                    self.update(entity, next);
                }
            }]
        }, function(err, res) {
            callback(err, entity);
        });
    }
});