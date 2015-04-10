var express     = require("express");
var BaseClass   = require("./BaseClass");

var BaseController = BaseClass.subclass({
    classname : "BaseController",

    initialize : function() {
        var router = express.Router();
        router.use(this.logRequestInfo.bind(this));
        this._router = router;
    },

    getRouter : function() {
        return this._router;
    },

    logRequestInfo : function(req, res, next) {
        logger.info(this.classname + "::logRequestInfo params=" + JSON.stringify(req.params));
        if (next) {
            next();
        }
    }

});

module.exports = BaseController;