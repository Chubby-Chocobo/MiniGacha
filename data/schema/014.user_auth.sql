CREATE TABLE `user_auth` (
    `user_id`   INTEGER,
    `auth_token`    INTEGER,
    `created_at`    INTEGER NOT NULL,
    PRIMARY KEY(user_id,auth_token)
);