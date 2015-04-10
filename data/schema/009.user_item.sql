CREATE TABLE `user_item` (
    `user_id`   INTEGER NOT NULL,
    `item_id`   INTEGER NOT NULL,
    `num`   INTEGER NOT NULL,
    PRIMARY KEY(user_id,item_id)
);