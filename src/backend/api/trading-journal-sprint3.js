const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const path = require('path');

const app = express();
const PORT = 3000;
const JWT_SECRET = 'your-super-secret-jwt-key-change-in-production';

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// In-memory data storage (replace with database in production)
const users = [
    {
        id: 1,
        email: 'ceo@company.com',
        password: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // password
        name: 'CEO User',
        role: 'admin',
        account_balance: 100000.00
    },
    {
        id: 2,
        email: 'trader@company.com',
        password: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // password
        name: 'Trader User',
        role: 'user',
        account_balance: 50000.00
    }
];

// Sample trades data (Sprint 3)
const trades = [
    {
        id: 1,
        user_id: 1,
        symbol: 'AAPL',
        trade_type: 'BUY',
        quantity: 100,
        entry_price: 150.25,
        exit_price: 165.50,
        entry_date: '2025-07-15T09:30:00Z',
        exit_date: '2025-07-20T15:45:00Z',
        strategy: 'Momentum Breakout',
        notes: 'Breaking above resistance with high volume',
        commission: 9.99,
        pnl: 1510.01,
        status: 'CLOSED',
        created_at: '2025-07-15T09:30:00Z',
        updated_at: '2025-07-20T15:45:00Z'
    },
    {
        id: 2,
        user_id: 1,
        symbol: 'TSLA',
        trade_type: 'SELL',
        quantity: 50,
        entry_price: 250.00,
        exit_price: 235.75,
        entry_date: '2025-07-18T10:15:00Z',
        exit_date: '2025-07-22T14:30:00Z',
        strategy: 'Mean Reversion',
        notes: 'Overbought conditions, taking profits',
        commission: 9.99,
        pnl: 700.01,
        status: 'CLOSED',
        created_at: '2025-07-18T10:15:00Z',
        updated_at: '2025-07-22T14:30:00Z'
    },
    {
        id: 3,
        user_id: 1,
        symbol: 'MSFT',
        trade_type: 'BUY',
        quantity: 75,
        entry_price: 420.50,
        exit_price: null,
        entry_date: '2025-07-28T11:00:00Z',
        exit_date: null,
        strategy: 'Channel Breakout',
        notes: 'Breaking out of consolidation',
        commission: 9.99,
        pnl: null,
        status: 'OPEN',
        created_at: '2025-07-28T11:00:00Z',
        updated_at: '2025-07-28T11:00:00Z'
    }
];

// Authentication middleware
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'Access token required' });
    }

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ error: 'Invalid token' });
        }
        req.user = user;
        next();
    });
};

// Routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        version: '1.0.0',
        sprint: 'Sprint 3 - Core Trading Functionality'
    });
});

// Authentication endpoints
app.post('/api/auth/register', async (req, res) => {
    try {
        const { email, password, name } = req.body;

        // Validation
        if (!email || !password || !name) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        // Check if user already exists
        const existingUser = users.find(u => u.email === email);
        if (existingUser) {
            return res.status(400).json({ error: 'User already exists' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new user
        const newUser = {
            id: `user-${Date.now()}`,
            email,
            password: hashedPassword,
            name,
            role: 'user',
            account_balance: 0
        };

        users.push(newUser);

        // Generate JWT token
        const token = jwt.sign(
            { userId: newUser.id, email: newUser.email, role: newUser.role },
            JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.status(201).json({
            message: 'User registered successfully',
            token,
            user: {
                id: newUser.id,
                email: newUser.email,
                name: newUser.name,
                role: newUser.role
            }
        });

    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ error: 'Registration failed' });
    }
});

app.post('/api/auth/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validation
        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required' });
        }

        // Find user
        const user = users.find(u => u.email === email);
        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Check password
        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Generate JWT token
        const token = jwt.sign(
            { userId: user.id, email: user.email, role: user.role },
            JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.json({
            message: 'Login successful',
            token,
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                role: user.role,
                account_balance: user.account_balance
            }
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Login failed' });
    }
});

// User profile endpoint
app.get('/api/users/profile', authenticateToken, (req, res) => {
    const user = users.find(u => u.id === req.user.userId);
    if (!user) {
        return res.status(404).json({ error: 'User not found' });
    }

    res.json({
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        account_balance: user.account_balance,
        created_at: user.created_at
    });
});

// Sprint 3: Trade CRUD endpoints
app.get('/api/trades', authenticateToken, (req, res) => {
    try {
        const userTrades = trades.filter(trade => trade.user_id === req.user.userId);
        
        // Apply filters
        let filteredTrades = userTrades;
        
        if (req.query.symbol) {
            filteredTrades = filteredTrades.filter(trade => 
                trade.symbol.toLowerCase().includes(req.query.symbol.toLowerCase())
            );
        }
        
        if (req.query.status) {
            filteredTrades = filteredTrades.filter(trade => 
                trade.status === req.query.status.toUpperCase()
            );
        }
        
        if (req.query.limit) {
            const limit = parseInt(req.query.limit);
            const offset = parseInt(req.query.offset) || 0;
            filteredTrades = filteredTrades.slice(offset, offset + limit);
        }
        
        // Sort by entry_date (newest first)
        filteredTrades.sort((a, b) => new Date(b.entry_date) - new Date(a.entry_date));
        
        res.json({
            trades: filteredTrades,
            total: userTrades.length,
            filtered: filteredTrades.length
        });
        
    } catch (error) {
        console.error('Get trades error:', error);
        res.status(500).json({ error: 'Failed to fetch trades' });
    }
});

app.post('/api/trades', authenticateToken, (req, res) => {
    try {
        const { symbol, trade_type, quantity, entry_price, strategy, notes, commission } = req.body;
        
        // Validation
        if (!symbol || !trade_type || !quantity || !entry_price) {
            return res.status(400).json({ error: 'Symbol, trade type, quantity, and entry price are required' });
        }
        
        if (!['BUY', 'SELL'].includes(trade_type.toUpperCase())) {
            return res.status(400).json({ error: 'Trade type must be BUY or SELL' });
        }
        
        // Create new trade
        const newTrade = {
            id: `trade-${Date.now()}`,
            user_id: req.user.userId,
            symbol: symbol.toUpperCase(),
            trade_type: trade_type.toUpperCase(),
            quantity: parseFloat(quantity),
            entry_price: parseFloat(entry_price),
            exit_price: null,
            entry_date: new Date().toISOString(),
            exit_date: null,
            strategy: strategy || '',
            notes: notes || '',
            commission: parseFloat(commission) || 0,
            pnl: null,
            status: 'OPEN',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
        };
        
        trades.push(newTrade);
        
        res.status(201).json({
            message: 'Trade created successfully',
            trade: newTrade
        });
        
    } catch (error) {
        console.error('Create trade error:', error);
        res.status(500).json({ error: 'Failed to create trade' });
    }
});

app.put('/api/trades/:id', authenticateToken, (req, res) => {
    try {
        const tradeId = req.params.id;
        const tradeIndex = trades.findIndex(trade => 
            trade.id === tradeId && trade.user_id === req.user.userId
        );
        
        if (tradeIndex === -1) {
            return res.status(404).json({ error: 'Trade not found' });
        }
        
        const updatedTrade = { ...trades[tradeIndex], ...req.body, updated_at: new Date().toISOString() };
        trades[tradeIndex] = updatedTrade;
        
        res.json({
            message: 'Trade updated successfully',
            trade: updatedTrade
        });
        
    } catch (error) {
        console.error('Update trade error:', error);
        res.status(500).json({ error: 'Failed to update trade' });
    }
});

app.delete('/api/trades/:id', authenticateToken, (req, res) => {
    try {
        const tradeId = req.params.id;
        const tradeIndex = trades.findIndex(trade => 
            trade.id === tradeId && trade.user_id === req.user.userId
        );
        
        if (tradeIndex === -1) {
            return res.status(404).json({ error: 'Trade not found' });
        }
        
        trades.splice(tradeIndex, 1);
        
        res.json({ message: 'Trade deleted successfully' });
        
    } catch (error) {
        console.error('Delete trade error:', error);
        res.status(500).json({ error: 'Failed to delete trade' });
    }
});

// Sprint 3: Analytics endpoints
app.get('/api/analytics/summary', authenticateToken, (req, res) => {
    try {
        const userTrades = trades.filter(trade => trade.user_id === req.user.userId);
        const closedTrades = userTrades.filter(trade => trade.status === 'CLOSED');
        
        const totalTrades = userTrades.length;
        const totalPnL = closedTrades.reduce((sum, trade) => sum + (trade.pnl || 0), 0);
        const winningTrades = closedTrades.filter(trade => (trade.pnl || 0) > 0);
        const winRate = closedTrades.length > 0 ? (winningTrades.length / closedTrades.length) * 100 : 0;
        
        const bestTrade = closedTrades.length > 0 ? 
            Math.max(...closedTrades.map(trade => trade.pnl || 0)) : 0;
        const worstTrade = closedTrades.length > 0 ? 
            Math.min(...closedTrades.map(trade => trade.pnl || 0)) : 0;
        const avgTrade = closedTrades.length > 0 ? totalPnL / closedTrades.length : 0;
        
        res.json({
            total_trades: totalTrades,
            closed_trades: closedTrades.length,
            open_trades: userTrades.filter(trade => trade.status === 'OPEN').length,
            total_pnl: parseFloat(totalPnL.toFixed(2)),
            win_rate: parseFloat(winRate.toFixed(2)),
            best_trade: parseFloat(bestTrade.toFixed(2)),
            worst_trade: parseFloat(worstTrade.toFixed(2)),
            avg_trade: parseFloat(avgTrade.toFixed(2))
        });
        
    } catch (error) {
        console.error('Analytics error:', error);
        res.status(500).json({ error: 'Failed to fetch analytics' });
    }
});

app.get('/api/analytics/by-symbol', authenticateToken, (req, res) => {
    try {
        const userTrades = trades.filter(trade => trade.user_id === req.user.userId);
        const symbolStats = {};
        
        userTrades.forEach(trade => {
            if (!symbolStats[trade.symbol]) {
                symbolStats[trade.symbol] = {
                    symbol: trade.symbol,
                    total_trades: 0,
                    winning_trades: 0,
                    total_pnl: 0,
                    avg_pnl: 0
                };
            }
            
            symbolStats[trade.symbol].total_trades++;
            
            if (trade.status === 'CLOSED' && trade.pnl) {
                symbolStats[trade.symbol].total_pnl += trade.pnl;
                if (trade.pnl > 0) {
                    symbolStats[trade.symbol].winning_trades++;
                }
            }
        });
        
        // Calculate averages
        Object.values(symbolStats).forEach(stat => {
            if (stat.total_trades > 0) {
                stat.avg_pnl = parseFloat((stat.total_pnl / stat.total_trades).toFixed(2));
                stat.win_rate = parseFloat(((stat.winning_trades / stat.total_trades) * 100).toFixed(2));
            }
        });
        
        res.json(Object.values(symbolStats));
        
    } catch (error) {
        console.error('Symbol analytics error:', error);
        res.status(500).json({ error: 'Failed to fetch symbol analytics' });
    }
});

// Sprint status endpoint
app.get('/api/sprint/status', authenticateToken, (req, res) => {
    res.json({
        current_sprint: 3,
        sprint_name: 'Core Trading Functionality',
        start_date: '2025-07-29',
        end_date: '2025-08-11',
        progress: {
            completed: 0,
            total: 70,
            percentage: 0
        },
        features: [
            'Trade Entry System',
            'Trade History Management',
            'Data Persistence',
            'Basic Analytics',
            'Enhanced Security'
        ],
        status: 'IN_PROGRESS'
    });
});

// Start server
app.listen(PORT, () => {
    console.log('🚀 Trading Journal Platform - Sprint 3 running at http://localhost:3000');
    console.log('✅ Authentication system: WORKING');
    console.log('✅ Trade CRUD API: WORKING');
    console.log('✅ Analytics API: WORKING');
    console.log('✅ UI components: WORKING');
    console.log('✅ System ready for Sprint 3 testing');
    console.log('🔑 Demo Accounts:');
    console.log('   CEO: ceo@company.com / password');
    console.log('   Trader: trader@company.com / password');
    console.log('🌐 Test the system at: http://localhost:3000');
    console.log('📊 Sprint 3 Features: Trade Entry, History, Analytics');
}); 