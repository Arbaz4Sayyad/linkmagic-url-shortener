-- Migration: V2__Add_users_and_custom_slug
-- Description: Create users table and link to urls

CREATE TABLE IF NOT EXISTS users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Add custom_slug and user_id to urls table
ALTER TABLE urls ADD COLUMN custom_slug VARCHAR(50);
ALTER TABLE urls ADD COLUMN user_id BIGINT;

-- Add uniqueness constraint to custom_slug
ALTER TABLE urls ADD CONSTRAINT uc_custom_slug UNIQUE (custom_slug);

-- Add indexes
CREATE INDEX idx_custom_slug ON urls(custom_slug);
CREATE INDEX idx_user_id ON urls(user_id);

-- Add foreign key constraint
ALTER TABLE urls ADD CONSTRAINT fk_urls_user_id FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL;
