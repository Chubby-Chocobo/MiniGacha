var BaseModel = require("../../core/common/BaseModel");

module.exports = BaseModel.subclass({
    classname : "UserBoxGachaModel",
    tablename : "user_box_gacha",

    $primaryKeys : ["user_id", "gacha_id", "item_id"],

});