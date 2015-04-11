var BaseClass = require("./BaseClass");

module.exports = BaseClass.subclass({
    classname : "BaseEntity",

    initialize : function(model, data) {
        this._model = model;
        this._data = data;

        var self = this;
        for (property in data) {
            this.__defineGetter__(property, function(property) {
                return self._data[property];
            }.bind(this, property));
            this.__defineSetter__(property, function(property, value) {
                self._data[property] = value;
            }.bind(this, property));
        }
    },

    getColumnNames : function() {
        return _.keys(this._data);
    },

    getColumnValues : function() {
        return _.values(this._data);
    },

    getData : function() {
        return this._data;
    },

    toString : function() {
        return JSON.stringify(this._data);
    },

    save : function(next) {
        this._model.update(this, next);
    },

    $extractDataFromEntities : function(entities) {
        return _.pluck(entities, "_data");
    }

});