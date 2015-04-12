CREATE TABLE `user_box_gacha` (
    `user_id`   INTEGER NOT NULL,
    `gacha_id`  INTEGER NOT NULL,
    `box_id`    INTEGER NOT NULL,
    `item_id`   INTEGER NOT NULL,
    `num`   INTEGER NOT NULL,
    PRIMARY KEY(user_id,gacha_id,box_id,item_id)
);