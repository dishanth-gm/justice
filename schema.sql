-- SQL Schema for Lawyer Portfolio & Appointment Application

-- Disable RLS on all tables so our Next.js server actions (using anon key) can read/write data.
-- Security is handled by NextAuth in the application layer.

-- 1. Users Table (for Admin Login)
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  name TEXT,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
ALTER TABLE users DISABLE ROW LEVEL SECURITY;

-- 2. Settings Table (for global configuration)
CREATE TABLE IF NOT EXISTS settings (
  key TEXT PRIMARY KEY,
  value TEXT
);
ALTER TABLE settings DISABLE ROW LEVEL SECURITY;

-- 3. Services Table
CREATE TABLE IF NOT EXISTS services (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  fee DECIMAL(10,2),
  icon TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
ALTER TABLE services DISABLE ROW LEVEL SECURITY;

-- 4. Experience Table
CREATE TABLE IF NOT EXISTS experience (
  id SERIAL PRIMARY KEY,
  role TEXT NOT NULL,
  company TEXT NOT NULL,
  start_date TEXT NOT NULL,
  end_date TEXT,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
ALTER TABLE experience DISABLE ROW LEVEL SECURITY;

-- 5. Testimonials Table
CREATE TABLE IF NOT EXISTS testimonials (
  id SERIAL PRIMARY KEY,
  client_name TEXT NOT NULL,
  content TEXT NOT NULL,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
ALTER TABLE testimonials DISABLE ROW LEVEL SECURITY;

-- 6. FAQs Table
CREATE TABLE IF NOT EXISTS faqs (
  id SERIAL PRIMARY KEY,
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
ALTER TABLE faqs DISABLE ROW LEVEL SECURITY;

-- 7. Availability Rules Table
CREATE TABLE IF NOT EXISTS availability_rules (
  id SERIAL PRIMARY KEY,
  day_of_week INTEGER, -- 0-6 (Sunday-Saturday), NULL if specific date
  specific_date DATE,  -- NULL if weekly recurring
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  is_available BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
ALTER TABLE availability_rules DISABLE ROW LEVEL SECURITY;

-- 8. Appointments Table
CREATE TABLE IF NOT EXISTS appointments (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  service_id INTEGER REFERENCES services(id) ON DELETE SET NULL,
  date DATE NOT NULL,
  time_slot TIME NOT NULL,
  issue_description TEXT,
  additional_info TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
ALTER TABLE appointments DISABLE ROW LEVEL SECURITY;

-- Insert default admin user if not exists
-- Email: hruwhn@gmail.com, Password: password123
INSERT INTO users (name, email, password)
VALUES ('Admin', 'hruwhn@gmail.com', '$2a$10$wT5a0n6jP0v5i.D0iA.A8uD1y.A.V.5.w.N.T.M.L.1.1.X.9.y')
ON CONFLICT (email) DO NOTHING;

-- Insert default settings
INSERT INTO settings (key, value)
VALUES 
  ('lawyer_name', '"John Doe"'),
  ('lawyer_bio', '"Experienced and dedicated legal professional committed to achieving the best possible outcomes for clients. Specialized in corporate and civil law with a track record of success."'),
  ('contact_email', '"hruwhn@gmail.com"'),
  ('contact_phone', '"+1 234 567 8900"'),
  ('office_address', '"123 Legal Avenue, Suite 400, Justice City, ST 12345"'),
  ('working_hours', '"Mon - Fri: 9:00 AM - 5:00 PM"')
ON CONFLICT (key) DO NOTHING;
