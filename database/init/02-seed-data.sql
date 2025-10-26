-- ============================================================================
-- FinX Portfolio Database - Seed Data (Optional)
-- Version: 1.0.0
-- Description: Example data for testing and demonstration
-- ============================================================================

USE finx;

-- Note: This file is optional and only for development/testing
-- Production environments should start with empty tables

-- ============================================================================
-- Example Portfolio
-- ============================================================================

-- Create a sample portfolio for demonstration
INSERT INTO portfolios (id, name, description, currency)
VALUES (
    '550e8400-e29b-41d4-a716-446655440000',
    'Main Portfolio',
    'Primary investment portfolio for long-term growth',
    'USD'
);

-- ============================================================================
-- Example Watchlist Items
-- ============================================================================

-- Add some popular stocks to the watchlist
INSERT INTO watchlists (portfolio_id, symbol, notes, target_price, priority) VALUES
    ('550e8400-e29b-41d4-a716-446655440000', 'AAPL', 'Apple - monitoring for potential entry point', 150.00, 'HIGH'),
    ('550e8400-e29b-41d4-a716-446655440000', 'MSFT', 'Microsoft - strong fundamentals, waiting for pullback', 380.00, 'HIGH'),
    ('550e8400-e29b-41d4-a716-446655440000', 'GOOGL', 'Alphabet - good value, researching AI strategy', 140.00, 'MEDIUM'),
    ('550e8400-e29b-41d4-a716-446655440000', 'NVDA', 'NVIDIA - AI leader, very high valuation', NULL, 'MEDIUM'),
    ('550e8400-e29b-41d4-a716-446655440000', 'BRK.B', 'Berkshire Hathaway - Buffett value play', 380.00, 'MEDIUM');

-- ============================================================================
-- Example Tags (Additional to defaults)
-- ============================================================================

-- Add more specific tags
INSERT IGNORE INTO tags (name, color, description) VALUES
    ('ai', '#A855F7', 'AI and machine learning focused'),
    ('cloud', '#0EA5E9', 'Cloud computing and SaaS'),
    ('international', '#84CC16', 'International/non-US companies'),
    ('etf', '#6366F1', 'Exchange-traded funds'),
    ('crypto-related', '#F43F5E', 'Crypto and blockchain exposure'),
    ('esg', '#22C55E', 'ESG and sustainable investing');

-- ============================================================================
-- Migration Tracking Table
-- ============================================================================

-- Create a table to track migrations
CREATE TABLE IF NOT EXISTS schema_migrations (
    version VARCHAR(14) PRIMARY KEY,
    description VARCHAR(255) NOT NULL,
    applied_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    
    INDEX idx_migrations_applied (applied_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Track applied database migrations';

-- Record initial schema version
INSERT INTO schema_migrations (version, description) VALUES
    ('20250126000001', 'Initial schema - portfolios, holdings, transactions'),
    ('20250126000002', 'Seed data - example portfolio and tags');

-- ============================================================================
-- Seed Data Info
-- ============================================================================

SELECT 
    'Seed data loaded successfully' as status,
    COUNT(*) as portfolio_count FROM portfolios
UNION ALL
SELECT 
    'Watchlist items' as status,
    COUNT(*) FROM watchlists
UNION ALL
SELECT 
    'Tags created' as status,
    COUNT(*) FROM tags;

