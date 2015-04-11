var BaseController = require("../../core/common/BaseController");

var GachaController = BaseController.subclass({
    classname : "GachaController",

    initialize : function() {
        logger.info(this.classname + "::initialize");

        this._router.post('/list', this._list.bind(this));
        this._router.post('/draw', this._draw.bind(this));
    },

    _list : function(req, res) {

    },

    _draw : function(req, res) {
        var userId          = req.session.userId;
        var gachaId         = req.body.gacha_id;
        var GachaService    = getService("GachaService");

        async.auto({
            beginTransaction : function(next, res) {
                GachaService.beginTransaction(next);
            },
            draw : ["beginTransaction", function(next, res) {
                GachaService.draw({
                    userId  : userId,
                    gachaId : gachaId
                }, next);
            }],
            commit : ["draw", function(next, res) {
                GachaService.commit(next);
            }],
        }, function(err, ret) {
            if (err) {
                logger.error(err);
                GachaService.rollback();
                return;
            }
            res.send({
                item : ret.draw.doDraw.getData(),
                user : ret.draw.user.getData()
            });
        });
    },

});

module.exports = GachaController;