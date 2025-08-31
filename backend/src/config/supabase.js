import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

// Database helper functions
export const dbHelpers = {
  // Create user in database
  async createUser(userData) {
    const { data, error } = await supabase
      .from('users')
      .insert([{
        name: userData.name,
        email: userData.email,
        password_hash: userData.password,
        role: userData.role || 'farmer',
        phone: userData.phone,
        location: userData.location,
        region: userData.region,
        state: userData.state,
        district: userData.district,
        created_at: new Date().toISOString(),
        last_login: null
      }])
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to create user: ${error.message}`);
    }

    return data;
  },

  // Find user by email
  async findUserByEmail(email) {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();

    if (error && error.code !== 'PGRST116') { // PGRST116 is "not found"
      throw new Error(`Failed to find user: ${error.message}`);
    }

    return data;
  },

  // Update user last login
  async updateLastLogin(userId) {
    const { error } = await supabase
      .from('users')
      .update({ last_login: new Date().toISOString() })
      .eq('id', userId);

    if (error) {
      console.error('Failed to update last login:', error);
    }
  },

  // Get user by ID
  async getUserById(userId) {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      throw new Error(`Failed to get user: ${error.message}`);
    }

    return data;
  }
};

// Initialize database tables if they don't exist
export const initializeDatabase = async () => {
  try {
    // Check if users table exists by trying to select from it
    const { error } = await supabase
      .from('users')
      .select('id')
      .limit(1);

    if (error && error.code === '42P01') { // Table doesn't exist
      console.log('Users table does not exist. Please create it manually in Supabase dashboard.');
      console.log(`
        CREATE TABLE users (
          id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
          name VARCHAR(100) NOT NULL,
          email VARCHAR(255) UNIQUE NOT NULL,
          password_hash VARCHAR(255) NOT NULL,
          role VARCHAR(50) DEFAULT 'farmer',
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
        CREATE INDEX idx_users_email ON users(email);
        CREATE INDEX idx_users_role ON users(role);
        
        -- Enable Row Level Security (optional)
        ALTER TABLE users ENABLE ROW LEVEL SECURITY;
      `);
    }
  } catch (error) {
    console.error('Database initialization error:', error);
  }
};
