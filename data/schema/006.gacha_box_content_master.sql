CREATE TABLE `gacha_box_content` (
    `gacha_id`  INTEGER NOT NULL,
    `item_id`   INTEGER NOT NULL,
    `num`   INTEGER NOT NULL,
    PRIMARY KEY(gacha_id,item_id)
);