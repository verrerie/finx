-- ============================================================================
-- FinX Portfolio Database Schema
-- Version: 2.0.0
-- Description: Database schema for portfolio management and tracking with multi-asset support
-- ============================================================================

-- Create database if not exists (for manual setup)
CREATE DATABASE IF NOT EXISTS finx
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;

USE finx;

-- ============================================================================
-- Table: portfolios
-- Description: Stores portfolio metadata
-- ============================================================================

CREATE TABLE IF NOT EXISTS portfolios (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    currency VARCHAR(3) NOT NULL DEFAULT 'USD',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_portfolios_created (created_at),
    INDEX idx_portfolios_name (name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Portfolio metadata and configuration';

-- ============================================================================
-- Table: asset_types
-- Description: Defines the types of assets that can be held
-- ============================================================================

CREATE TABLE IF NOT EXISTS asset_types (
    id INT AUTO_INCREMENT PRIMARY KEY,
    type_name VARCHAR(50) NOT NULL UNIQUE,
    description TEXT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Defines asset classes like STOCK, REAL_ESTATE, etc.';

-- Insert core asset types
INSERT IGNORE INTO asset_types (type_name, description) VALUES
    ('STOCK', 'Publicly traded equity security'),
    ('REAL_ESTATE', 'Physical real estate property'),
    ('INVESTMENT_ACCOUNT', 'Managed investment accounts like PEA, PER, Assurance Vie');

-- ============================================================================
-- Table: assets
-- Description: Generic table for all assets
-- ============================================================================

CREATE TABLE IF NOT EXISTS assets (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    asset_type_id INT NOT NULL,
    name VARCHAR(255) NOT NULL,
    symbol VARCHAR(20) NULL, -- Nullable, as not all assets have a symbol
    currency VARCHAR(3) NOT NULL DEFAULT 'USD',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (asset_type_id) REFERENCES asset_types(id),
    UNIQUE KEY idx_assets_symbol (symbol), -- Symbol should be unique if present
    INDEX idx_assets_name (name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Generic asset information';

-- ============================================================================
-- Table: asset_details_real_estate
-- Description: Specific details for real estate assets
-- ============================================================================

CREATE TABLE IF NOT EXISTS asset_details_real_estate (
    asset_id CHAR(36) PRIMARY KEY,
    address TEXT NOT NULL,
    property_type VARCHAR(50),
    market_value DECIMAL(18, 4),
    FOREIGN KEY (asset_id) REFERENCES assets(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Details for real estate assets';

-- ============================================================================
-- Table: asset_details_investment_account
-- Description: Specific details for investment accounts
-- ============================================================================

CREATE TABLE IF NOT EXISTS asset_details_investment_account (
    asset_id CHAR(36) PRIMARY KEY,
    account_type VARCHAR(50) NOT NULL, -- e.g., PEA, PER, Assurance Vie
    institution VARCHAR(255),
    current_value DECIMAL(18, 4),
    FOREIGN KEY (asset_id) REFERENCES assets(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Details for investment accounts';

-- ============================================================================
-- Table: holdings
-- Description: Current portfolio holdings (positions)
-- ============================================================================

CREATE TABLE IF NOT EXISTS holdings (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    portfolio_id CHAR(36) NOT NULL,
    asset_id CHAR(36) NOT NULL,
    quantity DECIMAL(18, 8) NOT NULL,
    average_cost DECIMAL(18, 4) NOT NULL,
    notes TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (portfolio_id) REFERENCES portfolios(id) ON DELETE CASCADE,
    FOREIGN KEY (asset_id) REFERENCES assets(id) ON DELETE CASCADE,
    UNIQUE KEY idx_holdings_portfolio_asset (portfolio_id, asset_id),
    INDEX idx_holdings_updated (updated_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Current portfolio holdings and positions';

-- ============================================================================
-- Table: transactions
-- Description: All buy/sell transactions
-- ============================================================================

CREATE TABLE IF NOT EXISTS transactions (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    portfolio_id CHAR(36) NOT NULL,
    asset_id CHAR(36) NOT NULL,
    type ENUM('BUY', 'SELL', 'DIVIDEND', 'SPLIT', 'TRANSFER_IN', 'TRANSFER_OUT', 'RENTAL_INCOME', 'EXPENSE') NOT NULL,
    quantity DECIMAL(18, 8) NOT NULL,
    price DECIMAL(18, 4) NOT NULL,
    fees DECIMAL(18, 4) NOT NULL DEFAULT 0,
    currency VARCHAR(3) NOT NULL DEFAULT 'USD',
    transaction_date DATE NOT NULL,
    notes TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (portfolio_id) REFERENCES portfolios(id) ON DELETE CASCADE,
    FOREIGN KEY (asset_id) REFERENCES assets(id) ON DELETE CASCADE,
    INDEX idx_transactions_portfolio (portfolio_id),
    INDEX idx_transactions_date (transaction_date),
    INDEX idx_transactions_type (type),
    INDEX idx_transactions_created (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Transaction history for all portfolio activities';

-- ============================================================================
-- Table: watchlists
-- Description: Assets to watch/research
-- ============================================================================

CREATE TABLE IF NOT EXISTS watchlists (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    portfolio_id CHAR(36) NOT NULL,
    asset_id CHAR(36) NOT NULL,
    notes TEXT,
    target_price DECIMAL(18, 4),
    priority ENUM('LOW', 'MEDIUM', 'HIGH') NOT NULL DEFAULT 'MEDIUM',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (portfolio_id) REFERENCES portfolios(id) ON DELETE CASCADE,
    FOREIGN KEY (asset_id) REFERENCES assets(id) ON DELETE CASCADE,
    UNIQUE KEY idx_watchlist_portfolio_asset (portfolio_id, asset_id),
    INDEX idx_watchlist_priority (priority)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Watchlist for assets to monitor and research';

-- ============================================================================
-- Table: investment_theses
-- Description: Investment reasoning and thesis for each holding
-- ============================================================================

CREATE TABLE IF NOT EXISTS investment_theses (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    portfolio_id CHAR(36) NOT NULL,
    asset_id CHAR(36) NOT NULL,
    thesis TEXT NOT NULL,
    bull_case TEXT,
    bear_case TEXT,
    target_allocation DECIMAL(5, 2),
    review_date DATE,
    status ENUM('ACTIVE', 'MONITORING', 'EXITED', 'INVALIDATED') NOT NULL DEFAULT 'ACTIVE',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (portfolio_id) REFERENCES portfolios(id) ON DELETE CASCADE,
    FOREIGN KEY (asset_id) REFERENCES assets(id) ON DELETE CASCADE,
    UNIQUE KEY idx_thesis_portfolio_asset (portfolio_id, asset_id),
    INDEX idx_thesis_status (status),
    INDEX idx_thesis_review (review_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Investment theses and reasoning for holdings';

-- ============================================================================
-- Table: portfolio_snapshots
-- Description: Daily portfolio value snapshots for performance tracking
-- ============================================================================

CREATE TABLE IF NOT EXISTS portfolio_snapshots (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    portfolio_id CHAR(36) NOT NULL,
    snapshot_date DATE NOT NULL,
    total_value DECIMAL(18, 4) NOT NULL,
    total_cost DECIMAL(18, 4) NOT NULL,
    cash_balance DECIMAL(18, 4) NOT NULL DEFAULT 0,
    currency VARCHAR(3) NOT NULL DEFAULT 'USD',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (portfolio_id) REFERENCES portfolios(id) ON DELETE CASCADE,
    UNIQUE KEY idx_snapshot_portfolio_date (portfolio_id, snapshot_date),
    INDEX idx_snapshot_date (snapshot_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Daily portfolio value snapshots for performance tracking';

-- ============================================================================
-- Table: tags
-- Description: Tags for categorizing assets (e.g., "growth", "dividend")
-- ============================================================================

CREATE TABLE IF NOT EXISTS tags (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    name VARCHAR(50) NOT NULL UNIQUE,
    color VARCHAR(7),
    description TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    
    INDEX idx_tags_name (name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Tags for categorizing and organizing holdings';

-- ============================================================================
-- Table: holding_tags
-- Description: Many-to-many relationship between holdings and tags
-- ============================================================================

CREATE TABLE IF NOT EXISTS holding_tags (
    holding_id CHAR(36) NOT NULL,
    tag_id CHAR(36) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    
    PRIMARY KEY (holding_id, tag_id),
    FOREIGN KEY (holding_id) REFERENCES holdings(id) ON DELETE CASCADE,
    FOREIGN KEY (tag_id) REFERENCES tags(id) ON DELETE CASCADE,
    INDEX idx_holding_tags_tag (tag_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Tags associated with holdings';

-- ============================================================================
-- Views for Common Queries
-- ============================================================================

-- View: portfolio_summary
-- Description: Summary of each portfolio with key metrics
CREATE OR REPLACE VIEW portfolio_summary AS
SELECT 
    p.id,
    p.name,
    p.description,
    p.currency,
    COUNT(DISTINCT h.asset_id) as holding_count,
    SUM(h.quantity * h.average_cost) as total_cost,
    p.created_at,
    p.updated_at
FROM portfolios p
LEFT JOIN holdings h ON p.id = h.portfolio_id
GROUP BY p.id, p.name, p.description, p.currency, p.created_at, p.updated_at;

-- View: holding_details
-- Description: Detailed view of holdings with calculated metrics
CREATE OR REPLACE VIEW holding_details AS
SELECT 
    h.id,
    h.portfolio_id,
    p.name as portfolio_name,
    a.id as asset_id,
    a.name as asset_name,
    a.symbol,
    at.type_name as asset_type,
    h.quantity,
    h.average_cost,
    a.currency,
    (h.quantity * h.average_cost) as total_cost,
    h.notes,
    h.created_at,
    h.updated_at
FROM holdings h
JOIN portfolios p ON h.portfolio_id = p.id
JOIN assets a ON h.asset_id = a.id
JOIN asset_types at ON a.asset_type_id = at.id;

-- ============================================================================
-- Initial Data
-- ============================================================================

-- Insert default portfolio (optional)
-- Users can create their own portfolios through the application

-- Insert some common tags
INSERT IGNORE INTO tags (name, color, description) VALUES
    ('growth', '#10B981', 'Growth stocks with high revenue/earnings growth'),
    ('value', '#3B82F6', 'Value stocks trading below intrinsic value'),
    ('dividend', '#8B5CF6', 'Dividend-paying stocks for income'),
    ('tech', '#F59E0B', 'Technology sector'),
    ('healthcare', '#EF4444', 'Healthcare and biotech sector'),
    ('finance', '#06B6D4', 'Financial services sector'),
    ('consumer', '#EC4899', 'Consumer goods and services'),
    ('energy', '#F97316', 'Energy and utilities sector'),
    ('defensive', '#6B7280', 'Defensive/stable stocks'),
    ('speculative', '#DC2626', 'High-risk speculative positions'),
    ('core', '#059669', 'Core long-term holdings'),
    ('short-term', '#F59E0B', 'Short-term trades or swings'),
    ('research', '#8B5CF6', 'Under research/analysis');

-- ============================================================================
-- Stored Procedures (Optional - for complex operations)
-- ============================================================================

DELIMITER //

-- Procedure: add_transaction
-- Description: Add a transaction and automatically update holdings
CREATE PROCEDURE IF NOT EXISTS add_transaction(
    IN p_portfolio_id CHAR(36),
    IN p_asset_id CHAR(36),
    IN p_type ENUM('BUY', 'SELL', 'DIVIDEND', 'SPLIT', 'TRANSFER_IN', 'TRANSFER_OUT', 'RENTAL_INCOME', 'EXPENSE'),
    IN p_quantity DECIMAL(18, 8),
    IN p_price DECIMAL(18, 4),
    IN p_fees DECIMAL(18, 4),
    IN p_currency VARCHAR(3),
    IN p_transaction_date DATE,
    IN p_notes TEXT
)
BEGIN
    DECLARE v_transaction_id CHAR(36);
    DECLARE v_current_quantity DECIMAL(18, 8);
    DECLARE v_current_average_cost DECIMAL(18, 4);
    DECLARE v_new_quantity DECIMAL(18, 8);
    DECLARE v_new_average_cost DECIMAL(18, 4);
    
    START TRANSACTION;
    
    -- Insert transaction
    SET v_transaction_id = UUID();
    INSERT INTO transactions (id, portfolio_id, asset_id, type, quantity, price, fees, currency, transaction_date, notes)
    VALUES (v_transaction_id, p_portfolio_id, p_asset_id, p_type, p_quantity, p_price, p_fees, p_currency, p_transaction_date, p_notes);
    
    -- Update holdings based on transaction type
    IF p_type IN ('BUY', 'TRANSFER_IN') THEN
        -- Get current holding
        SELECT quantity, average_cost INTO v_current_quantity, v_current_average_cost
        FROM holdings
        WHERE portfolio_id = p_portfolio_id AND asset_id = p_asset_id;
        
        IF v_current_quantity IS NULL THEN
            -- New holding
            INSERT INTO holdings (portfolio_id, asset_id, quantity, average_cost)
            VALUES (p_portfolio_id, p_asset_id, p_quantity, p_price + (p_fees / p_quantity));
        ELSE
            -- Update existing holding with new average cost
            SET v_new_quantity = v_current_quantity + p_quantity;
            SET v_new_average_cost = ((v_current_quantity * v_current_average_cost) + (p_quantity * p_price) + p_fees) / v_new_quantity;
            
            UPDATE holdings
            SET quantity = v_new_quantity, average_cost = v_new_average_cost
            WHERE portfolio_id = p_portfolio_id AND asset_id = p_asset_id;
        END IF;
        
    ELSEIF p_type IN ('SELL', 'TRANSFER_OUT') THEN
        -- Reduce holding quantity
        UPDATE holdings
        SET quantity = quantity - p_quantity
        WHERE portfolio_id = p_portfolio_id AND asset_id = p_asset_id;
        
        -- Remove holding if quantity is zero or negative
        DELETE FROM holdings
        WHERE portfolio_id = p_portfolio_id AND asset_id = p_asset_id AND quantity <= 0;
    END IF;
    
    COMMIT;
    
    SELECT v_transaction_id as transaction_id;
END //

DELIMITER ;

-- ============================================================================
-- Database Info
-- ============================================================================

SELECT 
    'FinX Portfolio Database' as database_name,
    '2.0.0' as version,
    NOW() as initialized_at,
    'Schema created successfully' as status;

