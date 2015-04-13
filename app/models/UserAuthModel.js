var BaseModel = require("../../core/common/BaseModel");

module.exports = BaseModel.subclass({
    classname : "UserAuthModel",
    tablename : "user_auth",

    primaryKeys : ["user_id", "auth_token"],

});