var Config = {
    UPDATE_INTERVAL      : 15,
    UI_UPDATE_INTERVAL  : 1000,
    VIEW : {
        GACHA     : "gacha",
        INVENTORY : "inventory"
    }
};

// TODO: refactor to a more generic and convenient caching mechanism.
var Cache = function(name, primaryKeys) {
    this.name = name;
    this.primaryKeys = primaryKeys;
    this.data = {};
};
Cache.prototype.isValidData = function(data) {
    for (var i = 0; i < this.primaryKeys.length; i++) {
        if (data[this.primaryKeys[i]] === null ||
            data[this.primaryKeys[i]] === undefined) {
            return false;
        }
    }
    return true;
}
Cache.prototype.getHashKey = function(data) {
    var hash = "";
    for (var i = 0; i < this.primaryKeys.length; i++) {
        hash += "_" + data[this.primaryKeys[i]];
    }
    return hash;
}
Cache.prototype.updateOne = function(data) {
    console.log(this.name + "::updateOne " + JSON.stringify(data));
    if (!this.isValidData(data)) {
        console.log(this.name + "::updateOne invalid data=" + JSON.stringify(data));
        return;
    }

    var hash = this.getHashKey(data);
    this.data[hash] = data;
};
Cache.prototype.update = function(arr) {
    _.each(arr, function(data) {
        this.updateOne(data);
    }.bind(this));
};
Cache.prototype.removeOne = function(data) {
    console.log(this.name + "::removeOne " + JSON.stringify(data));
    if (!this.isValidData(data)) {
        console.log(this.name + "::removeOne invalid data=" + JSON.stringify(data));
        return;
    }

    var hash = this.getHashKey(data);
    delete this.data[hash];
};
Cache.prototype.remove = function(arr) {
    _.each(arr, function(data) {
        this.removeOne(data);
    }.bind(this));
};
Cache.prototype.getArrayData = function() {
    return _.values(this.data);
};
Cache.prototype.getBy = function(obj) {
    var hash = this.getHashKey(obj);
    return this.data[hash];
};

var cache = {
    lastUpdate       : 0,
    fromLastUIUpdate : 0,
    user             : {},
    gachas           : new Cache("GachaCache", ["id"]),
    freeGachas       : new Cache("FreeGachaCache", ["gacha_id"]),
    boxGachas        : new Cache("BoxGachaCache", ["gacha_id"]),
    userGachas       : new Cache("UserGachaCache", ["gacha_id", "user_id"]),
    userFreeGachas   : new Cache("UserFreeGachaCache", ["gacha_id", "user_id"]),
    userBoxGachas    : new Cache("UserBoxGachaCache", ["gacha_id", "user_id"]),
    items            : new Cache("ItemCache", ["id"]),
    userItems        : new Cache("UserItemCache", ["user_id", "item_id"]),
};

var global = {}
global.currentView = Config.VIEW.GACHA;

$(document).ready(function() {
    init();
});

function onUpdate(now, delta) {
    cache.fromLastUIUpdate += delta;
    if (cache.fromLastUIUpdate > Config.UI_UPDATE_INTERVAL) {
        updateCurrentTime(now, delta);
        updateCurrentCoin(now, delta);
        markUpFreeGachas(now, delta);
        markUpBoxGachas(now, delta);
        cache.fromLastUIUpdate -= Config.UI_UPDATE_INTERVAL;
    }
}

function update() {
    var now = Date.now();
    var delta = 0;
    if (cache.lastUpdate) {
        delta = now - cache.lastUpdate;
    }
    cache.lastUpdate = now;

    onUpdate(now, delta);
}

function init() {
    console.log(data);
    cache.user = user;
    cache.gachas.update(data.gacha.gachas);
    cache.freeGachas.update(data.gacha.freeGachas);
    cache.boxGachas.update(data.gacha.boxGachas);
    cache.items.update(data.item.items);
    cache.userGachas.update(data.userGacha.userGacha);
    cache.userFreeGachas.update(data.userGacha.userFreeGacha);
    cache.userBoxGachas.update(data.userGacha.userBoxGacha);
    cache.userItems.update(data.userItem.userItem);

    switchView(global.currentView);

    setInterval(update, Config.UPDATE_INTERVAL);
}

function updateCurrentTime(now, delta) {
    var nowStr = (new Date()).toTimeString();
    $(".current-time").text(nowStr);
}

function updateCurrentCoin(now, delta) {
    $(".current-coin").text(Math.floor((now - cache.user.zero_coin_at)/1000));
}

function switchView(viewName) {
    switch (viewName) {
        case Config.VIEW.GACHA:
            switchToGachaView();
            return;
        case Config.VIEW.INVENTORY:
            switchToInventoryView();
            return;
        default:
            console.log("switchView: invalid view=" + viewName);
            return;
    }
}

function switchToGachaView() {
    global.currentView = Config.VIEW.GACHA;

    $("#gacha-view").removeClass("disappear");
    $("#gacha-view-btn").addClass("active");
    $("#inventory-view").addClass("disappear");
    $("#inventory-view-btn").removeClass("active");

    _.each(cache.gachas.getArrayData(), function(gacha) {
        $("#gacha-price-" + gacha.id).text(getPriceString(gacha.price));
    });
}

function switchToInventoryView() {
    global.currentView = Config.VIEW.INVENTORY;

    $("#gacha-view").addClass("disappear");
    $("#gacha-view-btn").removeClass("active");
    $("#inventory-view").removeClass("disappear");
    $("#inventory-view-btn").addClass("active");

    _.each(cache.userItems.getArrayData(), function(userItem) {
        if (userItem.num > 0) {
            $("#item-num-" + userItem.item_id).text(getQuantityString(userItem.num));
            $("#item-" + userItem.item_id).removeClass("disappear");
            var item = cache.items.getBy({
                id : userItem.item_id
            });
            $("#item-rarity-" + userItem.item_id).text(getRarityString(item.rarity));
        }
    });
}

function markUpFreeGachas(now, delta) {
    var freeGachas = cache.freeGachas.getArrayData();
    if (!freeGachas || !freeGachas.length) {
        return;
    }
    _.each(freeGachas, function(freeGacha) {
        var gachaId = freeGacha.gacha_id;
        var waitInterval = freeGacha.wait_interval * 1000;
        if (!cache.userFreeGachas) {
            $("#gacha-markup-" + gachaId).text("This gacha is free now.");
            return;
        }
        var userFreeGachas = cache.userFreeGachas.getArrayData();
        var userFreeGacha = _.find(userFreeGachas, function(e) {
            return e.gacha_id == gachaId;
        });
        if (!userFreeGacha) {
            $("#gacha-markup-" + gachaId).text("This gacha is free now.");
        } else {
            if (now - userFreeGacha.last_draw_at > waitInterval) {
                $("#gacha-markup-" + gachaId).text("This gacha is free now.");
            } else{
                var timeLeft = Math.floor((waitInterval - (now - userFreeGacha.last_draw_at))/1000);
                $("#gacha-markup-" + gachaId).text("This gacha is free in " + timeLeft);
            }
        }
    });
}

function markUpBoxGachas(now, delta) {
    var boxGachas = cache.boxGachas;
    if (!boxGachas || !boxGachas.length) {
        return;
    }
}

function updateClientData(res) {
    console.log("updating client data...");
    console.log(res);

    if (res.updated && res.updated.user) {
        cache.user = res.updated.user;
    }

    var keys = [
        "items",
        "userItems",
        "gachas",
        "freeGachas",
        "boxGachas",
        "userGachas",
        "userFreeGachas",
        "userBoxGachas",
    ];

    _.each(keys, function(key) {
        if (res.updated) {
            var arr = res.updated[key];
            if (arr && arr.length) {
                cache[key].update(arr);
            }
        }
        if (res.deleted) {
            var arr = res.deleted[key];
            if (arr && arr.length) {
                cache[key].remove(arr);
            }
        }
    });
}


// TODO: make localization for these functions
function getRarityString(rarity) {
    var result = "";
    for (var i = 0; i < rarity; i++) {
        result += "★";
    }
    return result;
}

function getQuantityString(quantity) {
    return "You have: " + quantity;
}

function getPriceString(price) {
    return "Price: " + price;
}

function onDrawSuccess(data) {
    console.log("onDrawSuccess");
    console.log(data);
    try {
        var res = JSON.parse(data);
        updateClientData(res);

        if (res.updated && res.updated.userItems) {
            var userItems = res.updated.userItems;
            if (userItems.length > 0) {
                var notice = "You've got items: ";
                var items = [];
                _.each(userItems, function(userItem) {
                    var item = cache.items.getBy({id: userItem.item_id});
                    items.push(item.name);
                    $("#item-got-icon").text(item.id);
                    $("#item-got-name").text(item.name);
                    $("#item-got-rarity").text(getRarityString(item.rarity));
                    $("#item-got-num").text(getQuantityString(userItem.num));
                    $("#item-got").removeClass("disappear");
                });
                notice += items.join(", ");
                $("#gacha-notice").removeClass().addClass("info").text(notice);
            }
        }
    } catch (e) {
        console.log(e);
    }
}

function onDrawError(data) {
    console.log("onDrawError");
    console.log(data);
    $("#gacha-notice").removeClass().addClass("error").text(data.responseText);
    $("#item-got").addClass("disappear");
}

function drawGacha(gachaId) {
    console.log("drawGacha: " + gachaId);

    $.ajax({
        url         : "/gacha/draw",
        type        : "post",
        dataType    : "html",
        data        : "gacha_id=" + gachaId,
        success     : onDrawSuccess,
        error       : onDrawError,
    });
}