#!/bin/bash

# Demo Data Creation Script
# This script creates demo data for CEO presentation

echo "📊 Creating Demo Data for CEO Presentation"
echo "=========================================="

# Create demo users
echo "👥 Creating demo users..."

# Demo user 1: CEO
curl -X POST http://localhost:8000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "ceo@tradingjournal.com",
    "password": "DemoPass123!",
    "firstName": "John",
    "lastName": "CEO",
    "role": "admin"
  }'

# Demo user 2: Trader
curl -X POST http://localhost:8000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "trader@tradingjournal.com",
    "password": "DemoPass123!",
    "firstName": "Sarah",
    "lastName": "Trader",
    "role": "user"
  }'

# Demo user 3: Analyst
curl -X POST http://localhost:8000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "analyst@tradingjournal.com",
    "password": "DemoPass123!",
    "firstName": "Mike",
    "lastName": "Analyst",
    "role": "user"
  }'

echo "✅ Demo users created successfully!"
echo ""
echo "📋 Demo User Credentials:"
echo "   CEO: ceo@tradingjournal.com / DemoPass123!"
echo "   Trader: trader@tradingjournal.com / DemoPass123!"
echo "   Analyst: analyst@tradingjournal.com / DemoPass123!"
echo ""
echo "🎯 Demo data is ready for CEO presentation!"
