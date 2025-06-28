-- Fix database schema to match the code expectations
-- Drop existing tables and recreate with correct column names

DROP TABLE IF EXISTS alerts CASCADE;
DROP TABLE IF EXISTS sensor_data CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- Create users table with correct schema
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  firebase_uid VARCHAR(255) UNIQUE NOT NULL,
  email VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  age INTEGER,
  medical_condition TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create sensor_data table with correct schema
CREATE TABLE sensor_data (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  data_type VARCHAR(50) NOT NULL,
  value DECIMAL(10,2) NOT NULL,
  signal_quality INTEGER,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create alerts table with correct schema
CREATE TABLE alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  type VARCHAR(20) NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  status VARCHAR(20) DEFAULT 'active',
  resolved BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW(),
  resolved_at TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_sensor_data_user_created ON sensor_data(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_sensor_data_type_created ON sensor_data(data_type, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_alerts_user_status ON alerts(user_id, status);
CREATE INDEX IF NOT EXISTS idx_alerts_status_created ON alerts(status, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_users_firebase_uid ON users(firebase_uid);

-- Insert a test user if none exists
INSERT INTO users (firebase_uid, email, name) 
VALUES ('test-user-123', 'test@example.com', 'Test User')
ON CONFLICT (firebase_uid) DO NOTHING;

-- Insert some test sensor data
INSERT INTO sensor_data (user_id, data_type, value, signal_quality, metadata)
SELECT 
  u.id,
  'heartRate',
  75.0,
  95,
  '{"deviceId": "ESP8266_001"}'::jsonb
FROM users u 
WHERE u.firebase_uid = 'test-user-123'
ON CONFLICT DO NOTHING;

INSERT INTO sensor_data (user_id, data_type, value, signal_quality, metadata)
SELECT 
  u.id,
  'eeg',
  12.5,
  88,
  '{"frequency": "alpha", "deviceId": "EEG_001"}'::jsonb
FROM users u 
WHERE u.firebase_uid = 'test-user-123'
ON CONFLICT DO NOTHING;
