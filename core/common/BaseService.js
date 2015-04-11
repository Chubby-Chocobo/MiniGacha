var BaseClass = require("./BaseClass");

module.exports = BaseClass.subclass({
    classname : "BaseService",

    initialize : function(dbDriver) {
        logger.info(this.classname + "::initialize");
        this._dbDriver = dbDriver;
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
});
