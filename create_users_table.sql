-- Create users table for Bharat Pashudhan cattle breed identification system
CREATE TABLE IF NOT EXISTS users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(50) DEFAULT 'farmer' CHECK (role IN ('farmer', 'veterinarian', 'expert', 'flw', 'admin')),
  phone VARCHAR(20),
  location VARCHAR(255),
  region VARCHAR(100),
  state VARCHAR(100),
  district VARCHAR(100),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_login TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_users_created_at ON users(created_at);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security (optional but recommended)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Create policy for users to access their own data
CREATE POLICY "Users can view own profile" ON users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON users FOR UPDATE USING (auth.uid() = id);

-- Insert sample admin user for testing (password: admin123)
INSERT INTO users (name, email, password_hash, role, region, state, district) 
VALUES (
  'System Admin',
  'admin@bharatpashudhan.com',
  '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/VcSAg/9PS',
  'admin',
  'National',
  'Delhi',
  'New Delhi'
) ON CONFLICT (email) DO NOTHING;

-- Insert sample field worker for testing (password: flw123)
INSERT INTO users (name, email, password_hash, role, region, state, district) 
VALUES (
  'Field Worker Demo',
  'flw@bharatpashudhan.com',
  '$2a$12$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
  'flw',
  'North',
  'Punjab',
  'Amritsar'
) ON CONFLICT (email) DO NOTHING;
