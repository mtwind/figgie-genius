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

This project utilizes a modern, decoupled architecture designed for real-time data processing, intensive statistical analysis, and scalability. The system consists of a browser extension frontend that communicates with a powerful Python backend for analysis and data persistence.

### Frontend (Extension UI)

The extension frontend is built to be fast, responsive, and type-safe.

#### Core Framework
- **Vite + React + TypeScript**: Provides a fast development server, an optimized build process, and a robust, component-based UI architecture with type safety.
- **Tailwind CSS**: A utility-first CSS framework for rapid and consistent UI development.
- **Zustand**: A simple, lightweight state management library that is TypeScript-first and ideal for managing the state within the browser extension without excessive boilerplate.

#### Chrome Extension Architecture
- **Content Script (TypeScript)**: Injected directly into the Figgie game page. It is responsible for all data scraping by observing DOM changes and capturing game events as they happen.
- **Background Script / Service Worker (TypeScript)**: Acts as the communication hub. It manages the WebSocket connection to the backend, processes data from the content script, and maintains the core extension logic.
- **Popup UI (React + Tailwind)**: The user-facing interface for displaying statistics, suggestions, and controlling the bot.

### Data Scraping & Communication

The link between the live game and the analysis engine is critical and built for speed.

- **Data Scraping**: The Content Script will use the **`MutationObserver` API** and standard DOM APIs to efficiently watch for and capture real-time game events (new bids, trades, etc.) without needing to constantly poll the page.
- **WebSocket Communication**: A persistent **WebSocket** connection, managed by the FastAPI backend and the extension's Background Script, is used for the real-time, bidirectional transfer of game data.

### Backend (Data Processing & Analysis)

The backend is a high-performance Python server dedicated to statistical analysis and strategy calculation.

- **Server**: **FastAPI** is used for its high performance, native asynchronous support (critical for WebSockets), and automatic OpenAPI documentation.
- **Advanced Analytics**: The core statistical analysis and probability calculations will be performed using:
    - **`numpy`** for high-performance numerical computations.
    - **`pandas`** for data manipulation and analysis.
    - **`scipy`** for advanced statistical functions.
- **Data Validation**: **`pydantic`** is used for robust data validation and settings management within FastAPI.

### Database & Data Storage

A two-tiered data storage approach is used to balance real-time performance with long-term analytical capabilities.

- **In-Memory (Live Game Data)**: **Redis** will be used as a fast, in-memory data store for caching the state of the current, live game. This ensures the bot can access data like player hands and current bids with minimal latency during a round.
- **Persistent (Post-Game Analysis)**: **PostgreSQL** serves as the primary relational database. All data from a completed game is pushed to PostgreSQL for long-term storage, historical analysis, and potentially training future machine learning models.
    - **Tools**: **SQLAlchemy** is used as the ORM for interacting with the database, with **Alembic** managing database migrations.

### Deployment

The deployment strategy leverages modern platforms optimized for their respective tasks.

- **Frontend (Vercel)**: The React-based extension frontend will be deployed using Vercel for its seamless static hosting, CI/CD pipelines, and global edge network.
- **Backend (AWS)**: A scalable infrastructure using **EC2** for the Python server and **RDS** for the PostgreSQL database, with **CloudWatch** for monitoring.

### Key Architectural Considerations

- **Scraping Stability**: The success of the bot is highly dependent on the stability of the content script's selectors. The Figgie website UI could change at any time, requiring updates to the scraping logic.
- **Anti-Bot Measures**: The target website may have measures to detect and block automated bots. The bot's design, particularly if it plays automatically, should consider strategies (e.g., randomized delays) to mimic human-like interaction and avoid detection.

### Development Environment & Tooling

- **Containerization (Docker)**: Docker and Docker Compose will be used to containerize the frontend, backend, and database services for a consistent and easy-to-set-up local development environment.
- **Monitoring (Sentry)**: Sentry will be used for real-time error tracking and performance monitoring on both the frontend and backend.
- **API Documentation (OpenAPI/Swagger)**: FastAPI will automatically generate interactive API documentation.
- **Version Control (Git & GitHub Actions)**: Git will be used for source control, with GitHub Actions automating CI/CD pipelines for testing and deployment.

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