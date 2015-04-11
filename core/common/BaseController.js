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
        logger.info(this.classname + "::logRequestInfo body=" + JSON.stringify(req.body)
                                    + ", params=" + JSON.stringify(req.params)
                                    + ", session=" + JSON.stringify(req.session));
        if (next) {
            next();
        }
    }

});

module.exports = BaseController;