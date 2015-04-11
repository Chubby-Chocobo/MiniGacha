module.exports = {
    login : {
        paths : [
            "/",
        ],
        controller : require("../app/controllers/LoginController"),
    },
    gacha : {
        paths : [
            "/gacha",
        ],
        controller : require("../app/controllers/GachaController")
    }
}