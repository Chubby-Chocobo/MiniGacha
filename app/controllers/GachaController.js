var BaseController = require("../../core/common/BaseController");

var GachaController = BaseController.subclass({
    classname : "GachaController",

    initialize : function() {
        logger.trace(this.classname + "::initialize");

        this._router.post('/gacha/list', this._draw.bind(this));
        this._router.post('/gacha/draw', this._draw.bind(this));
    },

    _list : function(req, res) {

    },

    _draw : function(req, res) {
        var GachaService = getService("GachaService");
        var LoginService = getService("LoginService");
        var userId       = req.session.userId;
        var authToken    = req.session.authToken;

        userId = 6;
        authToken = "30448947231829981f318761d129f477";

        if (!userId || !authToken) {
            res.render("main");
            return;
        }

        async.auto({
            authenticate : function(next, res) {
                LoginService.authenticate({
                    userId    : userId,
                    authToken : authToken,
                }, next);
            },
        }, function(err, ret) {
            if (err) {
                logger.error(err);
            }

            var msg  = ret.authenticate.msg;
            var user = ret.authenticate.user;
            var data = ret.authenticate.data;

            logger.info(data);

            if (msg == AppConstants.RESPONSE_MESSAGE.AUTHENTICATE.SUCCESS) {
                res.render("main", {
                    user : user.getData(),
                    data : data
                });
            } else if (msg == AppConstants.RESPONSE_MESSAGE.AUTHENTICATE.FAIL) {
                res.status(401);
                res.send(msg);
            } else if (msg == AppConstants.RESPONSE_MESSAGE.Gacha.NOT_REGISTER) {
                res.status(401);
                res.send(msg);
            } else {
                logger.error("GachaController::_main unkonwn message: " + JSON.stringify(msg));
                res.status(500);
                res.send(AppConstants.RESPONSE_MESSAGE.COMMON.UNKNOWN_ERROR);
            }
        });
    },

});

module.exports = GachaController;