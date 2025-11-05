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
-- Example Assets
-- ============================================================================

-- Insert some popular stocks as assets
INSERT INTO assets (id, asset_type_id, name, symbol, currency)
VALUES
    (UUID(), (SELECT id FROM asset_types WHERE type_name = 'STOCK'), 'Apple Inc.', 'AAPL', 'USD'),
    (UUID(), (SELECT id FROM asset_types WHERE type_name = 'STOCK'), 'Microsoft Corporation', 'MSFT', 'USD'),
    (UUID(), (SELECT id FROM asset_types WHERE type_name = 'STOCK'), 'Alphabet Inc.', 'GOOGL', 'USD'),
    (UUID(), (SELECT id FROM asset_types WHERE type_name = 'STOCK'), 'NVIDIA Corporation', 'NVDA', 'USD'),
    (UUID(), (SELECT id FROM asset_types WHERE type_name = 'STOCK'), 'Berkshire Hathaway Inc.', 'BRK.B', 'USD');

-- ============================================================================
-- Example Watchlist Items
-- ============================================================================

-- Add some popular stocks to the watchlist
INSERT INTO watchlists (portfolio_id, asset_id, notes, target_price, priority)
VALUES
    ('550e8400-e29b-41d4-a716-446655440000', (SELECT id FROM assets WHERE symbol = 'AAPL'), 'Apple - monitoring for potential entry point', 150.00, 'HIGH'),
    ('550e8400-e29b-41d4-a716-446655440000', (SELECT id FROM assets WHERE symbol = 'MSFT'), 'Microsoft - strong fundamentals, waiting for pullback', 380.00, 'HIGH'),
    ('550e8400-e29b-41d4-a716-446655440000', (SELECT id FROM assets WHERE symbol = 'GOOGL'), 'Alphabet - good value, researching AI strategy', 140.00, 'MEDIUM'),
    ('550e8400-e29b-41d4-a716-446655440000', (SELECT id FROM assets WHERE symbol = 'NVDA'), 'NVIDIA - AI leader, very high valuation', NULL, 'MEDIUM'),
    ('550e8400-e29b-41d4-a716-446655440000', (SELECT id FROM assets WHERE symbol = 'BRK.B'), 'Berkshire Hathaway - Buffett value play', 380.00, 'MEDIUM');

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

