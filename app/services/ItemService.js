var BaseService = require("../../core/common/BaseService");

module.exports = BaseService.subclass({
    classname : "ItemService",

    getItemMaster : function(callback) {
        var ItemModel = getModel("ItemModel");
        var self      = this;

        async.auto({
            items : function(next, res) {
                ItemModel.getAll(next);
            },
        }, callback);
    },

    getUserItem : function(userId, callback) {
        var UserItemModel  = getModel("UserItemModel");
        var self           = this;

        async.auto({
            userItem : function(next, res) {
                UserItemModel.getAllOfUser(userId, next);
            },
        }, callback);
    },

    add : function(params, callback) {
        var userId          = params.userId;
        var itemId          = params.itemId;
        var num             = params.num;
        var UserItemModel   = getModel("UserItemModel");
        var self            = this;

        async.auto({
            userItem : function(next, res) {
                UserItemModel.get({
                    where : "user_id=" + userId + " AND item_id=" + itemId
                }, next);
            },
            add : ["userItem", function(next, res) {
                if (!res.userItem) {
                    UserItemModel.insertWithData([{
                        user_id : userId,
                        item_id : itemId,
                        num     : num
                    }], next);
                } else {
                    res.userItem.num += num;
                    res.userItem.save(next);
                }
            }]
        }, function(err, res) {
            if (res.userItem) {
                callback(err, res.userItem.getData());
            } else {
                // Ugly trick since insert query doesn't return data
                // TODO: refactor at model to return data
                callback(err, {
                    user_id : userId,
                    item_id : itemId,
                    num     : num
                });
            }
        });
    }

});