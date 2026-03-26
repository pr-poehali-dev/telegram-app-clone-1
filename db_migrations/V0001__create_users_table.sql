CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    phone VARCHAR(20) UNIQUE,
    display_name VARCHAR(100) NOT NULL,
    about TEXT DEFAULT 'Привет! Я использую Линк',
    password_hash VARCHAR(255) NOT NULL,
    session_token VARCHAR(255) UNIQUE,
    online BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);