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
                    where   : "user_id=" + userId + " AND gacha_id=" + gachaId,
                    orderBy : "created_at desc",
                    limit   : "1"
                }, next);
            },
            init : ["curr", function (next, res) {
                if (!res.curr) {
                    self._insert({
                        user_id     : userId,
                        gacha_id    : gachaId,
                        box_id      : 1,
                        created_at  : Date.now()
                    }, next);
                } else {
                    var now = new Date();
                    var createdAt = new Date(res.curr.created_at);
                    var difference = (now.getYear() - createdAt.getYear()) * 10000
                                    + (now.getMonth() - createdAt.getMonth()) * 100
                                    + (now.getDate() - createdAt.getDate());
                    if (difference > 0) {
                        self._insert({
                            user_id     : userId,
                            gacha_id    : gachaId,
                            box_id      : res.curr.box_id + 1,
                            created_at  : Date.now()
                        }, next);
                    } else {
                        next(null, res.curr);
                    }
                }
            }]
        }, function(err, res) {
            if (err) {
                callback(err);
                return;
            }
            callback(null, res.init);
        });
    },

    _insert : function(data, callback) {
        var e = this._constructEntity(data);
        this.insert([e], function(err, res) {
            if (err) {
                callback(err);
                return;
            }
            callback(null, e);
        });
    }
});