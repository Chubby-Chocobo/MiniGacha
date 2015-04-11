module.exports = {
    RESPONSE_MESSAGE : {
        COMMON : {
            UNKNOWN_ERROR : {
                code : 500,
                msg  : "Server unkown error"
            }
        },
        LOGIN : {
            SUCCESS : {
                code : 0,
                msg  : "Logged in successfully.",
            },
            WRONG_PASSWORD : {
                code : 1,
                msg  : "You entered wrong password.",
            },
            NOT_REGISTER : {
                code : 2,
                msg  : "This email is not registered yet.",
            }
        },
        AUTHENTICATE : {
            SUCCESS : {
                code : 0,
                msg  : "Loggged in successfully with auth token."
            },
            FAIL : {
                code : 1,
                msg  : "Authenticate failed. Please login again."
            }
        },
        REGISTER : {

        },
    }
}