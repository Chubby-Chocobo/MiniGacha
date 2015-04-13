CREATE TABLE `user_box_seq` (
    `user_id`   INTEGER,
    `gacha_id`  INTEGER,
    `box_id`    INTEGER,
    `created_at`    INTEGER,
    PRIMARY KEY(user_id,gacha_id,box_id)
);