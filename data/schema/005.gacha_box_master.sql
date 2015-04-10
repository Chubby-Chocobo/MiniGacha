CREATE TABLE `gacha_box` (
    `gacha_id`  INTEGER NOT NULL,
    `reset_condition`   INTEGER NOT NULL,
    `reset_condition_value` TEXT NOT NULL,
    PRIMARY KEY(gacha_id)
);