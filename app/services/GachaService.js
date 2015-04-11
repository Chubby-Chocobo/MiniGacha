var BaseService = require("../../core/common/BaseService");

module.exports = BaseService.subclass({
    classname : "GachaService",

    getGachaMaster : function(callback) {
        var GachaModel              = getModel("GachaModel");
        var GachaFreeModel          = getModel("GachaFreeModel");
        var GachaBoxModel           = getModel("GachaBoxModel");
        var GachaBoxContentModel    = getModel("GachaBoxContentModel");
        var GachaWeightModel        = getModel("GachaWeightModel");
        var self                    = this;

        async.auto({
            gachas : function(next, res) {
                GachaModel.getAll(next);
            },
            freeGachas : function(next, res) {
                GachaFreeModel.getAll(next);
            },
            boxGachas : function(next, res) {
                GachaBoxModel.getAll(next);
            },
        }, callback);
    },

    getUserGacha : function(userId, callback) {
        var UserGachaModel      = getModel("UserGachaModel");
        var UserBoxGachaModel   = getModel("UserBoxGachaModel");
        var UserFreeGachaModel  = getModel("UserFreeGachaModel");
        var self                = this;

        async.auto({
            userGacha : function(next, res) {
                UserGachaModel.getAllOfUser(userId, next);
            },
            userFreeGacha : function(next, res) {
                UserFreeGachaModel.getAllOfUser(userId, next);
            },
            userBoxGacha : function(next, res) {
                UserBoxGachaModel.getAllOfUser(userId, next);
            }
        }, callback);
    },

    draw : function(params, callback) {
        var userId                  = params.userId;
        var gachaId                 = params.gachaId;
        var self                    = this;
        var GachaModel              = getModel("GachaModel");
        var GachaFreeModel          = getModel("GachaFreeModel");
        var GachaBoxModel           = getModel("GachaBoxModel");
        var GachaBoxContentModel    = getModel("GachaBoxContentModel");
        var GachaWeightModel        = getModel("GachaWeightModel");
        var UserGachaModel          = getModel("UserGachaModel");
        var UserBoxGachaModel       = getModel("UserBoxGachaModel");
        var UserFreeGachaModel      = getModel("UserFreeGachaModel");
        var UserModel               = getModel("UserModel");
        var ItemService             = getService("ItemService");
        var UserService             = getService("UserService");

        var now = Date.now();
        var canDrawForFree = false;

        async.auto({
            gachaMaster : function(next, res) {
                GachaModel.get({
                    where : "id=" + gachaId
                }, next);
            },
            gachaFree : function(next, res) {
                GachaFreeModel.get({
                    where : "gacha_id=" + gachaId
                }, next);
            },
            userGacha : function(next, res) {
                UserGachaModel.get({
                    where : "user_id=" + userId + " AND gacha_id=" + gachaId
                }, next);
            },
            userFreeGacha : function(next, res) {
                UserFreeGachaModel.get({
                    where : "user_id=" + userId + " AND gacha_id=" + gachaId
                }, next);
            },
            doDraw : ["gachaMaster", "gachaFree", "userGacha", "userFreeGacha", function(next, res) {
                if (res.gachaFree) {
                    var waitInterval = res.gachaFree.wait_interval * 1000;
                    if (!res.userFreeGacha) {
                        canDrawForFree = true;
                    } else {
                        if (now - res.userFreeGacha.last_draw_at > waitInterval) {
                            canDrawForFree = true;
                        }
                    }
                }

                if (res.gachaMaster.type == AppConstants.GACHA.TYPE.BOX) {
                    self._drawBoxGacha(params, res.gachaMaster, res.userGacha, next);
                } else {
                    self._drawRegularGacha(params, res.gachaMaster, res.userGacha, next);
                }
            }],
            minusUserCoin : ["doDraw", function(next, res) {
                if (canDrawForFree) {
                    UserFreeGachaModel.insertOrUpdate({
                        user_id       : userId,
                        gacha_id      : gachaId,
                        last_draw_at  : now,
                    }, next);
                } else {
                    UserService.minusCoin({
                        userId : userId,
                        num    : res.gachaMaster.price
                    }, next);
                }
            }],
            addItemForUser : ["doDraw", function(next, res) {
                ItemService.add({
                    userId : userId,
                    itemId : res.doDraw.id,
                    num    : 1
                }, next);
            }],
            user : ["minusUserCoin", function(next, res) {
                UserModel.get({
                    where : "id=" + userId,
                }, next);
            }]
        }, callback);
    },

    _drawRegularGacha : function(params, gachaMaster, userGacha, callback) {
        var userId                  = params.userId;
        var gachaId                 = params.gachaId;
        var self                    = this;
        var GachaModel              = getModel("GachaModel");
        var GachaFreeModel          = getModel("GachaFreeModel");
        var GachaBoxModel           = getModel("GachaBoxModel");
        var GachaBoxContentModel    = getModel("GachaBoxContentModel");
        var GachaWeightModel        = getModel("GachaWeightModel");
        var UserGachaModel          = getModel("UserGachaModel");
        var UserBoxGachaModel       = getModel("UserBoxGachaModel");
        var UserFreeGachaModel      = getModel("UserFreeGachaModel");
        var ItemModel               = getModel("ItemModel");

        async.auto({
            gachaWeight : function(next, res) {
                GachaWeightModel.all({
                    where : "gacha_id=" + gachaId,
                }, next);
            },
            getItem : ["gachaWeight", function(next, res) {
                var selected = Utils.getRandomByProb(res.gachaWeight, "weight");
                ItemModel.get({
                    where : "id=" + selected.item_id,
                }, next);
            }]
        }, function(err, res) {
            callback(err, res.getItem);
        });
    },

    _drawBoxGacha : function(params, gachaMaster, userGacha, callback) {
        var userId                  = params.userId;
        var gachaId                 = params.gachaId;
        var self                    = this;
        var GachaModel              = getModel("GachaModel");
        var GachaFreeModel          = getModel("GachaFreeModel");
        var GachaBoxModel           = getModel("GachaBoxModel");
        var GachaBoxContentModel    = getModel("GachaBoxContentModel");
        var GachaWeightModel        = getModel("GachaWeightModel");
        var UserGachaModel          = getModel("UserGachaModel");
        var UserBoxGachaModel       = getModel("UserBoxGachaModel");
        var UserFreeGachaModel      = getModel("UserFreeGachaModel");
    }
});