# Figgie

Figgie is a game designed by Jane Street to simulate market making and options trading.

## Project Outline

### Project Objective

The goal of this project is to create a web extension that acts as a bot and can collect data, make suggestions, and even play the game for the user.

### High Level Objectives

1. Create a web extension ui
2. Interpret the Figgie website's UI in game to track trades and collect detailed statistics
3. Show relevant, but basic, statistics in game that give the player an edge
4. Perform statistical analysis to determine probabilities and suit values
5. Suggest when to buy/sell suits and for what price
6. Allow the user to play the game directly through the extension UI
7. Give the extension an option to play the game completely by itself

### Technical Details

- Build the web extension UI with React components
  - Utilize Typescript with react
  - Use Vite as a front end build tool
- Scrape the in game data with {insert tool/tech here}
- Store current game data on the client side and display on the ui
- utilize the python math package to provide advanced analytics
- Push all data to a SQL database after each game
- Host and deploy with AWS or vercel

## System Architecture and Tech Stack

### Frontend (Extension UI)
#### Core Framework
- **Vite + React + TypeScript**
  - Fast development and optimized builds
  - Component-based UI architecture
  - Type safety and better IDE support
- **Tailwind CSS**
  - Utility-first styling
  - Rapid UI development
  - Consistent design system
- **Zustand**
  - Lightweight state management
  - TypeScript-first approach
  - Simple API for extension state

#### Chrome Extension Architecture
- **Components**
  - Popup UI (React + Tailwind)
  - Content Script (TypeScript)
  - Background Script (TypeScript)
  - Service Worker (TypeScript)
- **Development Tools**
  - ESLint + Prettier for code quality
  - Jest + React Testing Library for testing
  - Chrome Extension TypeScript Definitions

### Backend (Data Processing)
#### Python Server
- **FastAPI**
  - WebSocket + REST endpoints
  - Automatic API documentation
  - High performance
- **Core Dependencies**
  - numpy for numerical computations
  - pandas for data analysis
  - scipy for statistical analysis
  - pydantic for data validation
  - python-dotenv for environment management

#### WebSocket Communication
- FastAPI WebSocket server
- Client-side WebSocket manager
- Real-time game data transfer
- Type-safe message handling

### Database
#### PostgreSQL
- **Tools**
  - SQLAlchemy for ORM
  - Alembic for migrations
  - psycopg2 for database connection
- **Features**
  - ACID compliance
  - Complex query support
  - Time-series data optimization

### Development Environment
#### Docker
- **Containers**
  - Frontend development
  - Python backend
  - PostgreSQL database
- **Docker Compose**
  - Service orchestration
  - Development environment consistency
  - Easy local setup

### Monitoring and Error Tracking
#### Sentry
- Frontend error tracking
- Backend error tracking
- Performance monitoring
- User session tracking

### API Documentation
#### OpenAPI/Swagger
- FastAPI automatic documentation
- Interactive API testing
- Comprehensive endpoint documentation

### Deployment
#### Frontend: Vercel
- Static hosting
- CI/CD pipeline
- Edge network distribution

#### Backend: AWS
- **Services**
  - EC2 for Python server
  - RDS for PostgreSQL
  - CloudWatch for monitoring
  - S3 for static assets
- **Features**
  - Scalable infrastructure
  - Comprehensive monitoring
  - Cost-effective scaling

### Development Workflow
#### Version Control
- Git for source control
- GitHub Actions for CI/CD
- Automated testing and deployment

#### Code Quality
- ESLint + Prettier
- TypeScript strict mode
- Python type hints
- Automated code formatting

### Project Structure
```
figgie/
├── frontend/                 # Extension frontend
│   ├── src/
│   │   ├── popup/           # Popup UI components
│   │   ├── content/         # Content script
│   │   ├── background/      # Background script
│   │   └── shared/          # Shared types and utilities
│   ├── public/              # Static assets
│   └── vite.config.ts       # Vite configuration
├── backend/                 # Python backend
│   ├── app/
│   │   ├── api/            # API endpoints
│   │   ├── models/         # Database models
│   │   ├── services/       # Business logic
│   │   └── utils/          # Utilities
│   ├── tests/              # Backend tests
│   └── alembic/            # Database migrations
├── database/               # Database setup and migrations
├── docker/                # Docker configuration
│   ├── frontend/
│   ├── backend/
│   └── database/
└── docs/                  # Documentation
```

### Development Phases
1. **Phase 1: Basic Extension**
   - Set up Vite + React + TypeScript
   - Create basic popup UI
   - Implement content script injection
   - Test extension loading

2. **Phase 2: Data Collection**
   - Implement basic DOM observation
   - Set up WebSocket communication
   - Create data structures
   - Test data collection

3. **Phase 3: Backend Integration**
   - Set up FastAPI server
   - Implement WebSocket endpoints
   - Create database models
   - Test data processing

4. **Phase 4: Advanced Features**
   - Implement game logic
   - Add statistical analysis
   - Create trading strategies
   - Test full system

## In Game Strategy

### Data Collection

Every possible data point should be noted during the game. The data will first be collected by the frontend before being sent to the processing files in the backend.

- The count of each suit in the original hand
- How many (minimum or maximum) of each suit each player has
- Every bid/offer including:
  - the suit
  - the price
  - the player
  - the start time
  - the end time
- Every purchase, including
  - the price
  - who bought/who sold

### Data Processing

All data will be processed in python with complex math being done by the python math package.

#### Suits Tracking

Suits will be tracked in detail in order to give the best chance of determining the common suit, as well as to help value the suits.

- The initial counts will be determined by the cards in the initial hand
- Each time a "New" card comes into play, counts will be incremented

#### Offer/Bid Tracking

Tracking offer/bid details will be a huge factor in suit valuation and help to understand the objectives of each player

- Every single offer/bid will be tracked

#### Players

Arguably the most important thing is to track player movement.

- Each player will have an object that tracks
  - suit counts
  - profit
  - offers/bids
  - transactions
- Suits will be tracked by starting at 0 and incrementing each time a suit is purchased (or a suit is offered when their count is zero)
- Every offer/bid for each suit will be tracked

#### Analysis

Despite everything above, the only data that ever really matters is the chance each suit is relevant and the expected price of each suit to create arbitrage opportunities

- probabilities will be used to keep a running tally of the odds each suit is the common suit, goal suit, or neither
- the value of each card will also be continuously calculated

## How to Play

### Setup

- games begin with 4 or 5 players, who each start with $350 of chips
- Players buy and sell suits from each other during 4-minute rounds
- the deck contains 40 cards, composed of
  - two 10-card suits
  - one 8-card suit
  - one 12-card suit （**common suit**）
- the **goal suit** is the same color as the common suit, and can have 8 or 10 cards
- the ultimate goal of the game is to make as much money as possible over the rounds

### Outline of a Round

- players automatically ante even shares to create a $200 pot
- the 40 cards are evenly distributed
- players trade for 4 minutes by placing bids and offers and by buying and selling suits from one another
  - players can trade with anyone at anytime during the round
- the end
  - players collect a $10 bonus from the pot for each goal suit card that they own
  - the owner (or owners) of the most goal suit cards wins the rest of the pot

### Terminology

- **Bid:** the price the bidder is willing to pay for a suit
- **Offer:** the price the seller is willing to accept for a suit

### Strategy

- attempt to deduce the 12-card suit to determine the goal suit
  - remember, it's the same color as the 12-card suit
- accumulate goal suit cards while selling cards f other suits, as long as the prices seem worthwhile
- finish with the most goal sui cards and collect the bonus