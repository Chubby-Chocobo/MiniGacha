var BaseClass = require("./BaseClass");

module.exports = BaseClass.subclass({
    classname : "LocalCache",
    $_cache : {},

    $set : function (key, value) {
        this._cache[key] = value;
    },

    $get : function (key, value) {
        return this._cache[key];
    }
});