CREATE TABLE `user` (
    `id`    INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    `username`  TEXT UNIQUE,
    `email` TEXT NOT NULL UNIQUE,
    `password`  TEXT NOT NULL,
    `registered_at` INTEGER NOT NULL,
    `zero_coin_at`  INTEGER NOT NULL,
    `auth_token` TEXT
);