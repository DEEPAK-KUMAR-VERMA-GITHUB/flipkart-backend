-- Initialize database with required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create additional databases for testing
CREATE DATABASE IF NOT EXISTS flipkart_test;
GRANT ALL PRIVILEGES ON DATABASE flipkart_test TO flipkart;