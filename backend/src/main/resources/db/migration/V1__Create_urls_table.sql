CREATE TABLE urls (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    original_url VARCHAR(2048) NOT NULL,
    short_code VARCHAR(10) NOT NULL UNIQUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NULL,
    expiry_date TIMESTAMP NULL,
    click_count BIGINT NOT NULL DEFAULT 0,
    last_accessed_at TIMESTAMP NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE INDEX idx_short_code ON urls(short_code);
CREATE INDEX idx_expiry_date ON urls(expiry_date);
CREATE INDEX idx_created_at ON urls(created_at);
CREATE INDEX idx_click_count ON urls(click_count);
CREATE INDEX idx_active_expiry ON urls(is_active, expiry_date);
-- Add constraint for click_count
ALTER TABLE urls ADD CONSTRAINT chk_click_count_positive 
    CHECK (click_count >= 0);
