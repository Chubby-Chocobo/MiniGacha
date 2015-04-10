CREATE TABLE `user_gacha` (
    `user_id`   INTEGER NOT NULL,
    `gacha_id`  INTEGER NOT NULL,
    `draw_count`    INTEGER NOT NULL,
    `item_count`    INTEGER NOT NULL,
    `updated_at`    INTEGER NOT NULL,
    PRIMARY KEY(user_id,gacha_id)
);