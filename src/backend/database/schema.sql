-- Sprint 3 Database Schema
-- Trading Journal Platform - Core Trading Functionality

-- Users table (extending existing)
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'user',
    account_balance DECIMAL(15,2) DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Trades table (Sprint 3 core functionality)
CREATE TABLE IF NOT EXISTS trades (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    symbol VARCHAR(10) NOT NULL,
    trade_type VARCHAR(10) NOT NULL CHECK (trade_type IN ('BUY', 'SELL')),
    quantity DECIMAL(15,4) NOT NULL,
    entry_price DECIMAL(15,4) NOT NULL,
    exit_price DECIMAL(15,4),
    entry_date TIMESTAMP NOT NULL,
    exit_date TIMESTAMP,
    strategy VARCHAR(100),
    notes TEXT,
    commission DECIMAL(10,2) DEFAULT 0,
    pnl DECIMAL(15,2),
    status VARCHAR(20) DEFAULT 'OPEN' CHECK (status IN ('OPEN', 'CLOSED', 'CANCELLED')),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Trade exits table (for partial exits and TP ladder)
CREATE TABLE IF NOT EXISTS trade_exits (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    trade_id UUID NOT NULL REFERENCES trades(id) ON DELETE CASCADE,
    exit_time TIMESTAMP NOT NULL,
    exit_price DECIMAL(15,4) NOT NULL,
    quantity DECIMAL(15,4) NOT NULL,
    exit_type VARCHAR(20) NOT NULL CHECK (exit_type IN ('TP1', 'TP2', 'TP3', 'RUNNER', 'STOP', 'MANUAL')),
    pnl_dollars DECIMAL(15,2),
    pnl_r_multiple DECIMAL(10,4),
    created_at TIMESTAMP DEFAULT NOW()
);

-- Analytics cache table (for performance optimization)
CREATE TABLE IF NOT EXISTS analytics_cache (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    cache_type VARCHAR(50) NOT NULL,
    cache_data JSONB NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_trades_user_id ON trades(user_id);
CREATE INDEX IF NOT EXISTS idx_trades_symbol ON trades(symbol);
CREATE INDEX IF NOT EXISTS idx_trades_entry_date ON trades(entry_date);
CREATE INDEX IF NOT EXISTS idx_trades_status ON trades(status);
CREATE INDEX IF NOT EXISTS idx_trade_exits_trade_id ON trade_exits(trade_id);
CREATE INDEX IF NOT EXISTS idx_analytics_cache_user_type ON analytics_cache(user_id, cache_type);
CREATE INDEX IF NOT EXISTS idx_analytics_cache_expires ON analytics_cache(expires_at);

-- Sample data for testing
INSERT INTO users (id, email, password_hash, name, role, account_balance) VALUES
    ('550e8400-e29b-41d4-a716-446655440001', 'ceo@company.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'CEO User', 'admin', 100000.00),
    ('550e8400-e29b-41d4-a716-446655440002', 'trader@company.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Trader User', 'user', 50000.00)
ON CONFLICT (email) DO NOTHING;

-- Sample trades for demo
INSERT INTO trades (id, user_id, symbol, trade_type, quantity, entry_price, exit_price, entry_date, exit_date, strategy, notes, commission, pnl, status) VALUES
    ('550e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440001', 'AAPL', 'BUY', 100, 150.25, 165.50, '2025-07-15 09:30:00', '2025-07-20 15:45:00', 'Momentum Breakout', 'Breaking above resistance with high volume', 9.99, 1510.01, 'CLOSED'),
    ('550e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440001', 'TSLA', 'SELL', 50, 250.00, 235.75, '2025-07-18 10:15:00', '2025-07-22 14:30:00', 'Mean Reversion', 'Overbought conditions, taking profits', 9.99, 700.01, 'CLOSED'),
    ('550e8400-e29b-41d4-a716-446655440005', '550e8400-e29b-41d4-a716-446655440001', 'MSFT', 'BUY', 75, 420.50, NULL, '2025-07-28 11:00:00', NULL, 'Channel Breakout', 'Breaking out of consolidation', 9.99, NULL, 'OPEN')
ON CONFLICT (id) DO NOTHING;

-- Sample trade exits
INSERT INTO trade_exits (trade_id, exit_time, exit_price, quantity, exit_type, pnl_dollars, pnl_r_multiple) VALUES
    ('550e8400-e29b-41d4-a716-446655440003', '2025-07-20 15:45:00', 165.50, 100, 'MANUAL', 1510.01, 2.1),
    ('550e8400-e29b-41d4-a716-446655440004', '2025-07-22 14:30:00', 235.75, 50, 'MANUAL', 700.01, 1.4)
ON CONFLICT (id) DO NOTHING; 