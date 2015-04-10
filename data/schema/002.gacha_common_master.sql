CREATE TABLE `gacha` (
    `id`    INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    `name`  TEXT NOT NULL,
    `type`  TEXT NOT NULL,
    `payment_type`  TEXT NOT NULL,
    `price` INTEGER NOT NULL,
    `quantity`  INTEGER NOT NULL
);