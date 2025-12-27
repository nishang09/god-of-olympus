-- 1. Create Tables for Users (Login System)
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    full_name VARCHAR(100),
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL, -- Store encrypted passwords here
    role VARCHAR(20) DEFAULT 'technician' -- 'manager' or 'technician'
);

-- 2. Create Equipment Table (Assets)
CREATE TABLE equipment (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,          -- e.g. "Lawn Mower X1"
    status VARCHAR(20) DEFAULT 'Active', -- 'Active', 'Maintenance', 'Scrap'
    location VARCHAR(100),               -- e.g. "Garden Shed"
    purchase_date DATE
);

-- 3. Create Maintenance Requests (The Tickets)
CREATE TABLE maintenance_requests (
    id SERIAL PRIMARY KEY,
    subject VARCHAR(200) NOT NULL,       -- e.g. "Water Leak"
    priority VARCHAR(20),                -- 'Routine', 'Urgent'
    stage VARCHAR(20) DEFAULT 'New',     -- 'New', 'In Progress', 'Done'
    
    -- Links
    equipment_id INT REFERENCES equipment(id),
    assigned_to INT REFERENCES users(id),
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    scheduled_date DATE                  -- For Calendar View
);

-- 4. Dummy Data (To test if it works)
INSERT INTO equipment (name, status, location) VALUES 
('Lawn Mower X1', 'Active', 'Shed A'),
('Generator 500', 'Maintenance', 'Basement');

INSERT INTO maintenance_requests (subject, priority, stage, scheduled_date) VALUES
('Fix Sprinkler', 'Urgent', 'New', '2025-12-02'),
('Plant Roses', 'Routine', 'In Progress', '2025-12-15');