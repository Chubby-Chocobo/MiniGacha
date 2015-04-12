CREATE TABLE `user_gacha` (
    `id`    INTEGER PRIMARY KEY AUTOINCREMENT,
    `user_id`   INTEGER NOT NULL,
    `gacha_id`  INTEGER NOT NULL,
    `item_id`   INTEGER NOT NULL,
    `created_at`    INTEGER NOT NULL
);