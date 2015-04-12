CREATE TABLE `user_box_seq` (
    `user_id`   INTEGER,
    `gacha_id`  INTEGER,
    `box_id`    INTEGER NOT NULL DEFAULT 1,
    `created_at`    INTEGER,
    PRIMARY KEY(user_id,gacha_id)
);