#!/bin/bash
# Quick Start Script for Projex (Local Development)

echo "🚀 Projex - Local Development Setup"
echo "======================================"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check Node.js
echo -e "${YELLOW}Checking Node.js...${NC}"
if ! command -v node &> /dev/null; then
    echo -e "${RED}✗ Node.js not found! Please install Node.js v18+${NC}"
    exit 1
fi
NODE_VERSION=$(node -v)
echo -e "${GREEN}✓ Node.js $NODE_VERSION${NC}"

# Check npm
echo -e "${YELLOW}Checking npm...${NC}"
if ! command -v npm &> /dev/null; then
    echo -e "${RED}✗ npm not found!${NC}"
    exit 1
fi
NPM_VERSION=$(npm -v)
echo -e "${GREEN}✓ npm $NPM_VERSION${NC}"

# Check MySQL
echo -e "${YELLOW}Checking MySQL...${NC}"
if ! command -v mysql &> /dev/null; then
    echo -e "${RED}✗ MySQL not found! Please install MySQL 8.0+${NC}"
    echo -e "${YELLOW}Instructions: https://dev.mysql.com/downloads/mysql/${NC}"
    exit 1
fi
echo -e "${GREEN}✓ MySQL installed${NC}"

# Verify MySQL is running
echo -e "${YELLOW}Verifying MySQL is running...${NC}"
if ! mysql -u root -e "SELECT 1" > /dev/null 2>&1; then
    echo -e "${RED}✗ MySQL is not running or not accessible${NC}"
    echo -e "${YELLOW}Please start MySQL:${NC}"
    echo -e "  macOS:   brew services start mysql"
    echo -e "  Linux:   sudo systemctl start mysql"
    echo -e "  Windows: Start MySQL from Services"
    exit 1
fi
echo -e "${GREEN}✓ MySQL is running${NC}"

# Backend setup
echo ""
echo -e "${YELLOW}Setting up Backend...${NC}"
cd backend

if [ ! -d "node_modules" ]; then
    echo "Installing backend dependencies..."
    npm install
    if [ $? -ne 0 ]; then
        echo -e "${RED}✗ Failed to install backend dependencies${NC}"
        exit 1
    fi
fi
echo -e "${GREEN}✓ Backend dependencies ready${NC}"

# Run database migrations
echo -e "${YELLOW}Setting up database...${NC}"
npm run generate > /dev/null 2>&1
npm run migrate --silent > /dev/null 2>&1

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Database migrations completed${NC}"
    
    # Try to seed
    echo -e "${YELLOW}Seeding database with test data...${NC}"
    npm run seed > /dev/null 2>&1
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✓ Database seeded with test data${NC}"
    fi
else
    echo -e "${RED}✗ Database migration failed${NC}"
    echo -e "${YELLOW}This might be expected on first run. Backend will handle it.${NC}"
fi

cd ..

# Frontend setup
echo ""
echo -e "${YELLOW}Setting up Frontend...${NC}"
cd frontend

if [ ! -d "node_modules" ]; then
    echo "Installing frontend dependencies..."
    npm install
    if [ $? -ne 0 ]; then
        echo -e "${RED}✗ Failed to install frontend dependencies${NC}"
        exit 1
    fi
fi
echo -e "${GREEN}✓ Frontend dependencies ready${NC}"

cd ..

# Final setup
echo ""
echo -e "${GREEN}======================================"
echo -e "✓ Setup complete!${NC}"
echo ""
echo -e "${YELLOW}Next steps:${NC}"
echo ""
echo "1. Start Backend (in terminal 1):"
echo -e "   ${GREEN}cd backend && npm run dev${NC}"
echo ""
echo "2. Start Frontend (in terminal 2):"
echo -e "   ${GREEN}cd frontend && npm run dev${NC}"
echo ""
echo "3. Open in browser:"
echo -e "   ${GREEN}http://localhost:5173${NC}"
echo ""
echo "4. Login with:"
echo -e "   Email: ${GREEN}admin@projex.com${NC}"
echo -e "   Password: ${GREEN}Password@123${NC}"
echo ""
echo -e "${YELLOW}For detailed instructions, see SETUP_LOCAL.md${NC}"
