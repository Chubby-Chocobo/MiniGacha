CREATE TABLE `gacha_regular_weight` (
    `gacha_id`  INTEGER NOT NULL,
    `item_id`   INTEGER NOT NULL,
    `weight`    INTEGER NOT NULL,
    PRIMARY KEY(gacha_id,item_id)
);