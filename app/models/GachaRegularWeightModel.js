var BaseModel = require("../../core/common/BaseModel");

module.exports = BaseModel.subclass({
    classname : "GachaRegularWeightModel",
    tablename : "gacha_regular_weight",

    $primaryKeys : ["gacha_id", "item_id"],

});