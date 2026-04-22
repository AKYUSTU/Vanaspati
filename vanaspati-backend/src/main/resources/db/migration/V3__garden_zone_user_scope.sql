ALTER TABLE garden_zones
ADD COLUMN user_id BIGINT NULL AFTER icon_emoji,
ADD CONSTRAINT fk_garden_zone_user
    FOREIGN KEY (user_id) REFERENCES users(id);

CREATE INDEX idx_garden_zones_user_id ON garden_zones(user_id);
