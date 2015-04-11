CREATE TABLE `user_free_gacha` (
    `user_id`   INTEGER NOT NULL,
    `gacha_id`  INTEGER NOT NULL,
    `last_draw_at`  INTEGER,
    PRIMARY KEY(user_id,gacha_id)
);