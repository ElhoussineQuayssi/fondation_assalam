// @ts-nocheck
// SQL commands to create tables in Supabase PostgreSQL
export const schema = `
  -- Enable UUID extension
  CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

  -- Admins table
  CREATE TABLE IF NOT EXISTS admins (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    name TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'admin',
    failed_attempts INTEGER DEFAULT 0,
    locked_until TIMESTAMPTZ,
    last_login TIMESTAMPTZ,
    last_password_change TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW()
  );

  -- Blog posts table
  CREATE TABLE IF NOT EXISTS blog_posts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    excerpt TEXT NOT NULL,
    content TEXT NOT NULL,
    category TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'draft',
    share_on_social BOOLEAN DEFAULT FALSE,
    views INTEGER DEFAULT 0,
    image TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    published_at TIMESTAMPTZ
  );

  -- Messages table
  CREATE TABLE IF NOT EXISTS messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    message TEXT NOT NULL,
    type TEXT DEFAULT 'contact',
    status TEXT DEFAULT 'unread',
    created_at TIMESTAMPTZ DEFAULT NOW()
  );

  -- Projects table
  CREATE TABLE IF NOT EXISTS projects (
    id TEXT PRIMARY KEY,
    slug TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    excerpt TEXT NOT NULL,
    image TEXT,
    categories JSONB NOT NULL DEFAULT '[]'::jsonb,
    start_date TEXT,
    location TEXT,
    people_helped TEXT,
    status TEXT DEFAULT 'Actif',
    content JSONB DEFAULT '[]'::jsonb,
    goals JSONB DEFAULT '[]'::jsonb,
    gallery JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
  );

  -- Create indexes for better performance
  CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON blog_posts(slug);
  CREATE INDEX IF NOT EXISTS idx_blog_posts_status ON blog_posts(status);
  CREATE INDEX IF NOT EXISTS idx_blog_posts_category ON blog_posts(category);
  CREATE INDEX IF NOT EXISTS idx_blog_posts_created_at ON blog_posts(created_at DESC);

  CREATE INDEX IF NOT EXISTS idx_blog_posts_published_at ON blog_posts(published_at DESC);

  CREATE INDEX IF NOT EXISTS idx_messages_status ON messages(status);
  CREATE INDEX IF NOT EXISTS idx_messages_created_at ON messages(created_at DESC);

  CREATE INDEX IF NOT EXISTS idx_projects_slug ON projects(slug);
  CREATE INDEX IF NOT EXISTS idx_projects_status ON projects(status);
  CREATE INDEX IF NOT EXISTS idx_projects_created_at ON projects(created_at DESC);

  CREATE INDEX IF NOT EXISTS idx_projects_created_at_id ON projects(created_at DESC, id);
  CREATE INDEX IF NOT EXISTS idx_projects_status_created_at ON projects(status, created_at DESC);

  CREATE INDEX IF NOT EXISTS idx_admins_email ON admins(email);

  -- Site configuration table
  CREATE TABLE IF NOT EXISTS site_config (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    logo_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
  )`;

// Row Level Security (RLS) policies for Supabase
export const rlsPolicies = `
  -- Enable RLS on all tables
  ALTER TABLE admins ENABLE ROW LEVEL SECURITY;
  ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
  ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
  ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
  ALTER TABLE site_config ENABLE ROW LEVEL SECURITY;

  -- Admins table: only authenticated admins can access
  CREATE POLICY "Admins can access their own data" ON admins
    FOR ALL USING (auth.jwt() ->> 'role' = 'admin');

  -- Blog posts: public read, admin write
  CREATE POLICY "Anyone can read blog posts" ON blog_posts
    FOR SELECT USING (true);

  CREATE POLICY "Admins can manage blog posts" ON blog_posts
    FOR ALL USING (auth.jwt() ->> 'role' = 'admin');

  -- Messages: admin read/write, public insert
  CREATE POLICY "Anyone can create messages" ON messages
    FOR INSERT WITH CHECK (true);

  CREATE POLICY "Admins can read messages" ON messages
    FOR SELECT USING (auth.jwt() ->> 'role' = 'admin');

  CREATE POLICY "Admins can update messages" ON messages
    FOR UPDATE USING (auth.jwt() ->> 'role' = 'admin');

  -- Projects: public read, admin write
  CREATE POLICY "Anyone can read projects" ON projects
    FOR SELECT USING (true);

  CREATE POLICY "Admins can manage projects" ON projects
    FOR ALL USING (auth.jwt() ->> 'role' = 'admin');

  -- Site config: public read, admin write
  CREATE POLICY "Anyone can read site config" ON site_config
    FOR SELECT USING (true);

  CREATE POLICY "Admins can manage site config" ON site_config
    FOR ALL USING (auth.jwt() ->> 'role' = 'admin');
`;
