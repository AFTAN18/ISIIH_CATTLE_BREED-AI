import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

console.log('Testing Supabase connection...');
console.log('URL:', supabaseUrl);
console.log('Key exists:', !!supabaseKey);

const supabase = createClient(supabaseUrl, supabaseKey);

async function testConnection() {
  try {
    // Test basic connection
    console.log('\n1. Testing basic connection...');
    const { data, error } = await supabase.from('users').select('count').limit(1);
    
    if (error) {
      console.error('Connection error:', error.message);
      
      // Check if table exists
      if (error.message.includes('relation "users" does not exist')) {
        console.log('\n❌ Users table does not exist in Supabase');
        console.log('Please run the SQL script in Supabase SQL Editor:');
        console.log('File: create_users_table.sql');
        return false;
      }
    } else {
      console.log('✅ Connection successful');
      console.log('Users table exists');
    }

    // Test user creation
    console.log('\n2. Testing user creation...');
    const testUser = {
      name: 'Test User',
      email: 'test@example.com',
      password_hash: '$2a$12$test.hash.for.testing',
      phone: '+91-9876543210',
      role: 'FLW',
      location: 'Test Location',
      region: 'Test Region',
      state: 'Test State',
      district: 'Test District'
    };

    const { data: userData, error: userError } = await supabase
      .from('users')
      .insert([testUser])
      .select();

    if (userError) {
      console.error('User creation error:', userError.message);
      return false;
    } else {
      console.log('✅ User creation successful');
      console.log('Created user ID:', userData[0]?.id);
      
      // Clean up test user
      await supabase.from('users').delete().eq('email', 'test@example.com');
      console.log('✅ Test user cleaned up');
    }

    return true;
  } catch (error) {
    console.error('Test failed:', error.message);
    return false;
  }
}

testConnection().then(success => {
  if (success) {
    console.log('\n🎉 All tests passed! Supabase is ready for authentication.');
  } else {
    console.log('\n❌ Tests failed. Please check Supabase configuration.');
  }
  process.exit(success ? 0 : 1);
});
