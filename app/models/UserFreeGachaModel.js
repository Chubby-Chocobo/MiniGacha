var BaseModel = require("../../core/common/BaseModel");

module.exports = BaseModel.subclass({
    classname : "UserFreeGachaModel",
    tablename : "user_free_gacha",

    $primaryKeys : ["user_id", "gacha_id"],

});