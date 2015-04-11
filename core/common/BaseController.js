var express     = require("express");
var BaseClass   = require("./BaseClass");

var BaseController = BaseClass.subclass({
    classname : "BaseController",

    initialize : function() {
        logger.info("BaseController<" + this.classname + ">::initialize");
        var router = express.Router();
        this._router = router;
    },

    getRouter : function() {
        return this._router;
    },

});

module.exports = BaseController;