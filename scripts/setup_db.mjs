import { createClient } from '@supabase/supabase-js';
import bcrypt from 'bcryptjs';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function setup() {
  const email = 'hruwhn@gmail.com';
  const plainPassword = 'password123'; // Default password
  const hashedPassword = await bcrypt.hash(plainPassword, 10);

  const { data, error } = await supabase
    .from('users')
    .insert([
      { name: 'Admin', email, password: hashedPassword }
    ]);

  if (error) {
    console.error('Error inserting admin user:', error);
  } else {
    console.log('Admin user created successfully.');
  }

  // Insert default settings
  const { error: settingsError } = await supabase
    .from('settings')
    .insert([
      { key: 'lawyer_name', value: '"John Doe"' },
      { key: 'lawyer_bio', value: '"Experienced and dedicated legal professional committed to achieving the best possible outcomes for clients. Specialized in corporate and civil law with a track record of success."' },
      { key: 'contact_email', value: '"hruwhn@gmail.com"' },
      { key: 'contact_phone', value: '"+1 234 567 8900"' },
      { key: 'office_address', value: '"123 Legal Avenue, Suite 400, Justice City, ST 12345"' },
      { key: 'working_hours', value: '"Mon - Fri: 9:00 AM - 5:00 PM"' }
    ]);
  
  if (settingsError) {
    console.error('Error inserting settings:', settingsError);
  } else {
    console.log('Default settings created successfully.');
  }
}

setup();
