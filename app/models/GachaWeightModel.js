var BaseModel = require("../../core/common/BaseModel");

module.exports = BaseModel.subclass({
    classname : "GachaWeightModel",
    tablename : "gacha_weight",

    $primaryKeys : ["gacha_id", "item_id"],

});