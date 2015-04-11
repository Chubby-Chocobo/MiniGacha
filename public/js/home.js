var Config = {
    UPDATE_INTERVAL      : 15,
    UI_UPDATE_INTERVAL  : 1000,
};

var global = {
    lastUpdate       : 0,
    fromLastUIUpdate : 0,
};

$(document).ready(function() {
    init();
});

function onUpdate(delta) {
    global.fromLastUIUpdate += delta;
    if (global.fromLastUIUpdate > Config.UI_UPDATE_INTERVAL) {
        updateCurrentTime();
        updateCurrentCoin();
        markUpFreeGachas();
        markUpBoxGachas();
        global.fromLastUIUpdate -= Config.UI_UPDATE_INTERVAL;
    }
}

function update() {
    var now = Date.now();
    var delta = 0;
    if (global.lastUpdate) {
        delta = now - global.lastUpdate;
    }
    global.lastUpdate = now;

    onUpdate(delta);
}

function init() {
    setInterval(update, Config.UPDATE_INTERVAL);
}

function updateCurrentTime() {
    var now = (new Date()).toTimeString();
    $(".current-time").text(now);
}

function updateCurrentCoin() {
    var now = Date.now();
    $(".current-coin").text(Math.floor((now - user.zero_coin_at)/1000));
}

function markUpFreeGachas() {
    var freeGachas = data.gacha.freeGachas;
    _.each(freeGachas, function(freeGacha) {
        var gachaId = freeGacha.gacha_id;
        $("#gacha-markup-" + gachaId).text("abc123");
    });
}

function markUpBoxGachas() {

}

function onDrawSuccess(data) {
    console.log("onDrawSuccess");
    console.log(data);
}

function onDrawError(data) {
    console.log("onDrawError");
    console.log(data);
}

function drawGacha(gachaId) {
    console.log("drawGacha: " + gachaId);

    $.ajax({
        url         : "/gacha/draw",
        type        : "post",
        dataType    : "html",
        data        : gachaId,
        success     : onDrawSuccess,
        error       : onDrawError,
    });
}