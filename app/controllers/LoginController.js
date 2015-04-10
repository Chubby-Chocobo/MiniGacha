var BaseController = require("../../core/common/BaseController");

var LoginController = BaseController.subclass({
    classname : "LoginController",

    initialize : function() {
        logger.trace(this.classname + "::initialize");

        this._router.get('/', function(req, res) {
            res.render("main", {});
        }.bind(this));

        this._router.post('/', function(req, res) {
            res.render("main", {});
        }.bind(this));
    },

});

module.exports = LoginController;