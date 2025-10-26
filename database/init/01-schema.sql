-- ============================================================================
-- FinX Portfolio Database Schema
-- Version: 1.0.0
-- Description: Database schema for portfolio management and tracking
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
-- Table: holdings
-- Description: Current portfolio holdings (positions)
-- ============================================================================

CREATE TABLE IF NOT EXISTS holdings (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    portfolio_id CHAR(36) NOT NULL,
    symbol VARCHAR(20) NOT NULL,
    quantity DECIMAL(18, 8) NOT NULL,
    average_cost DECIMAL(18, 4) NOT NULL,
    currency VARCHAR(3) NOT NULL DEFAULT 'USD',
    notes TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (portfolio_id) REFERENCES portfolios(id) ON DELETE CASCADE,
    UNIQUE KEY idx_holdings_portfolio_symbol (portfolio_id, symbol),
    INDEX idx_holdings_symbol (symbol),
    INDEX idx_holdings_updated (updated_at),
    
    CONSTRAINT chk_quantity CHECK (quantity > 0)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Current portfolio holdings and positions';

-- ============================================================================
-- Table: transactions
-- Description: All buy/sell transactions
-- ============================================================================

CREATE TABLE IF NOT EXISTS transactions (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    portfolio_id CHAR(36) NOT NULL,
    symbol VARCHAR(20) NOT NULL,
    type ENUM('BUY', 'SELL', 'DIVIDEND', 'SPLIT', 'TRANSFER_IN', 'TRANSFER_OUT') NOT NULL,
    quantity DECIMAL(18, 8) NOT NULL,
    price DECIMAL(18, 4) NOT NULL,
    fees DECIMAL(18, 4) NOT NULL DEFAULT 0,
    currency VARCHAR(3) NOT NULL DEFAULT 'USD',
    transaction_date DATE NOT NULL,
    notes TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (portfolio_id) REFERENCES portfolios(id) ON DELETE CASCADE,
    INDEX idx_transactions_portfolio (portfolio_id),
    INDEX idx_transactions_symbol (symbol),
    INDEX idx_transactions_date (transaction_date),
    INDEX idx_transactions_type (type),
    INDEX idx_transactions_created (created_at),
    
    CONSTRAINT chk_quantity_positive CHECK (quantity > 0),
    CONSTRAINT chk_price_positive CHECK (price >= 0),
    CONSTRAINT chk_fees_non_negative CHECK (fees >= 0)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Transaction history for all portfolio activities';

-- ============================================================================
-- Table: watchlists
-- Description: Stocks to watch/research
-- ============================================================================

CREATE TABLE IF NOT EXISTS watchlists (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    portfolio_id CHAR(36) NOT NULL,
    symbol VARCHAR(20) NOT NULL,
    notes TEXT,
    target_price DECIMAL(18, 4),
    priority ENUM('LOW', 'MEDIUM', 'HIGH') NOT NULL DEFAULT 'MEDIUM',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (portfolio_id) REFERENCES portfolios(id) ON DELETE CASCADE,
    UNIQUE KEY idx_watchlist_portfolio_symbol (portfolio_id, symbol),
    INDEX idx_watchlist_symbol (symbol),
    INDEX idx_watchlist_priority (priority)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Watchlist for stocks to monitor and research';

-- ============================================================================
-- Table: investment_theses
-- Description: Investment reasoning and thesis for each holding
-- ============================================================================

CREATE TABLE IF NOT EXISTS investment_theses (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    portfolio_id CHAR(36) NOT NULL,
    symbol VARCHAR(20) NOT NULL,
    thesis TEXT NOT NULL,
    bull_case TEXT,
    bear_case TEXT,
    target_allocation DECIMAL(5, 2),
    review_date DATE,
    status ENUM('ACTIVE', 'MONITORING', 'EXITED', 'INVALIDATED') NOT NULL DEFAULT 'ACTIVE',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (portfolio_id) REFERENCES portfolios(id) ON DELETE CASCADE,
    UNIQUE KEY idx_thesis_portfolio_symbol (portfolio_id, symbol),
    INDEX idx_thesis_symbol (symbol),
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
-- Description: Tags for categorizing stocks (e.g., "growth", "dividend")
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
    COUNT(DISTINCT h.symbol) as holding_count,
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
    h.symbol,
    h.quantity,
    h.average_cost,
    h.currency,
    (h.quantity * h.average_cost) as total_cost,
    h.notes,
    h.created_at,
    h.updated_at
FROM holdings h
JOIN portfolios p ON h.portfolio_id = p.id;

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
    IN p_symbol VARCHAR(20),
    IN p_type ENUM('BUY', 'SELL', 'DIVIDEND', 'SPLIT', 'TRANSFER_IN', 'TRANSFER_OUT'),
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
    INSERT INTO transactions (id, portfolio_id, symbol, type, quantity, price, fees, currency, transaction_date, notes)
    VALUES (v_transaction_id, p_portfolio_id, p_symbol, p_type, p_quantity, p_price, p_fees, p_currency, p_transaction_date, p_notes);
    
    -- Update holdings based on transaction type
    IF p_type IN ('BUY', 'TRANSFER_IN') THEN
        -- Get current holding
        SELECT quantity, average_cost INTO v_current_quantity, v_current_average_cost
        FROM holdings
        WHERE portfolio_id = p_portfolio_id AND symbol = p_symbol;
        
        IF v_current_quantity IS NULL THEN
            -- New holding
            INSERT INTO holdings (portfolio_id, symbol, quantity, average_cost, currency)
            VALUES (p_portfolio_id, p_symbol, p_quantity, p_price + (p_fees / p_quantity), p_currency);
        ELSE
            -- Update existing holding with new average cost
            SET v_new_quantity = v_current_quantity + p_quantity;
            SET v_new_average_cost = ((v_current_quantity * v_current_average_cost) + (p_quantity * p_price) + p_fees) / v_new_quantity;
            
            UPDATE holdings
            SET quantity = v_new_quantity, average_cost = v_new_average_cost
            WHERE portfolio_id = p_portfolio_id AND symbol = p_symbol;
        END IF;
        
    ELSEIF p_type IN ('SELL', 'TRANSFER_OUT') THEN
        -- Reduce holding quantity
        UPDATE holdings
        SET quantity = quantity - p_quantity
        WHERE portfolio_id = p_portfolio_id AND symbol = p_symbol;
        
        -- Remove holding if quantity is zero or negative
        DELETE FROM holdings
        WHERE portfolio_id = p_portfolio_id AND symbol = p_symbol AND quantity <= 0;
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
    '1.0.0' as version,
    NOW() as initialized_at,
    'Schema created successfully' as status;

