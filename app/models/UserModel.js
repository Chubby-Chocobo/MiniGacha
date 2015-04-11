var BaseModel = require("../../core/common/BaseModel");

module.exports = BaseModel.subclass({
    classname : "UserModel",
    tablename : "user",

    $primaryKeys : ["id"],

});