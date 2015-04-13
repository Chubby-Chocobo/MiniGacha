var BaseModel = require("../../core/common/BaseModel");


module.exports = BaseModel.subclass({
    classname : "UserBoxSeqModel",
    tablename : "user_box_seq",

    $primaryKeys : ["user_id", "gacha_id"],

    getOrInit : function(params, callback) {
        var userId  = params.userId;
        var gachaId = params.gachaId;
        var self    = this;

        async.auto({
            curr : function(next, res) {
                self.get({
                    where : "user_id=" + userId + " AND gacha_id=" + gachaId
                }, next);
            },
            init : ["curr", function (next, res) {
                if (!res.curr) {
                    var e = self._constructEntity({
                        user_id     : userId,
                        gacha_id    : gachaId,
                        box_id      : 1,
                        created_at  : Date.now()
                    });
                    self.insert(e, function(_err, _res) {
                        if (_err) {
                            next(_err);
                            return;
                        }
                        next(null, e);
                    });
                } else {
                    next(null, res.curr);
                }
            }]
        }, function(err, res) {
            if (err) {
                callback(err);
                return;
            }
            callback(null, res.init);
        });
    }
});