CREATE TABLE `user_box_gacha` (
    `user_id`   INTEGER NOT NULL,
    `gacha_id`  INTEGER NOT NULL,
    `item_id`   INTEGER NOT NULL,
    `num`   INTEGER NOT NULL,
    PRIMARY KEY(user_id,gacha_id,item_id)
);