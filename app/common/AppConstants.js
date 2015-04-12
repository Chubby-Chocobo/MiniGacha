module.exports = {
    STARTED_COIN : 5000,
    COIN_PER_SECOND : 1,
    GACHA : {
        TYPE : {
            NORMAL : "normal",
            BOX    : "box"
        },
        BOX_RESET_CONDITION : {
            DAILY  : "daily"
        }
    },
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
                msg  : "This email is not registered yet.<br/> Do you want to register it now?",
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
            SUCCESS : {
                code : 0,
                msg  : "Registered successfully."
            },
            FAIL : {
                code : 1,
                msg  : "Register failed. Please try again."
            }
        },
    },
}