var BaseModel = require("../../core/common/BaseModel");

module.exports = BaseModel.subclass({
    classname : "UserGachaModel",
    tablename : "user_gacha",

    $primaryKeys : ["id"],

});