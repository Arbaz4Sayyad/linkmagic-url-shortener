-- Migration: V4__Add_oauth2_fields
-- Description: Add fields for OAuth2 support and make password nullable

ALTER TABLE users ADD COLUMN provider VARCHAR(20) DEFAULT 'local';
ALTER TABLE users ADD COLUMN provider_id VARCHAR(100);

-- Make password nullable for OAuth2 users
ALTER TABLE users MODIFY COLUMN password VARCHAR(100) NULL;

-- Add index for provider lookups
CREATE INDEX idx_provider_provider_id ON users(provider, provider_id);
