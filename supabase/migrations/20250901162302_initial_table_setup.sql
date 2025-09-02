-- Create items table with composite primary key
CREATE TABLE item (
    unique_id TEXT NOT NULL,
    item_name TEXT NOT NULL,
    item_description TEXT,
    enchantment INTEGER NOT NULL DEFAULT 0 CHECK (enchantment >= 0),
    tier SMALLINT NOT NULL CHECK (tier BETWEEN 1 AND 8),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    PRIMARY KEY (unique_id, enchantment)
);

-- Create index on commonly queried fields
CREATE INDEX idx_item_tier ON item(tier);
CREATE INDEX idx_item_name ON item(item_name);
CREATE INDEX idx_item_unique_id ON item(unique_id);

-- Create item_n_location table with composite primary key
CREATE TABLE item_n_location (
    unique_id TEXT NOT NULL,
    quality INTEGER NOT NULL CHECK (quality BETWEEN 1 AND 5),
    location TEXT NOT NULL,
    price NUMERIC(15,2) NOT NULL CHECK (price >= 0),
    recorded_time TIMESTAMP WITHOUT TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    count BIGINT NOT NULL DEFAULT 1 CHECK (count > 0),
    PRIMARY KEY (unique_id, quality, location, recorded_time)
);

-- Create indexes for better query performance
CREATE INDEX idx_item_location_location ON item_n_location(location);
CREATE INDEX idx_item_location_recorded_time ON item_n_location(recorded_time DESC);
CREATE INDEX idx_item_location_price ON item_n_location(price);

-- Create tracking_requests table
CREATE TABLE tracking_requests (
    id BIGSERIAL PRIMARY KEY,
    unique_id TEXT NOT NULL,
    enchantment INTEGER NOT NULL DEFAULT 0 CHECK (enchantment >= 0),
    user_id UUID NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    FOREIGN KEY (unique_id, enchantment) REFERENCES item(unique_id, enchantment) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Create indexes for tracking_requests
CREATE INDEX idx_tracking_requests_user_id ON tracking_requests(user_id);
CREATE INDEX idx_tracking_requests_unique_id ON tracking_requests(unique_id);
CREATE UNIQUE INDEX idx_tracking_requests_user_item ON tracking_requests(user_id, unique_id, enchantment);

-- Add triggers for updating timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_item_updated_at 
    BEFORE UPDATE ON item 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();