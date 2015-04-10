var BaseClass = require("./BaseClass");

module.exports = BaseClass.subclass({
    classname : "BaseEntity",
    modelName : "BaseModel",

    initialize : function(data) {
        this._data = data;
    },

    getColumnNames : function() {
        return _.keys(this._data);
    },

    getColumnValues : function() {
        return _.values(this._data);
    }
});