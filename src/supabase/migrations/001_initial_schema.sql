-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Create enums
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'analysis_status') THEN
    CREATE TYPE analysis_status AS ENUM (
      'pending',
      'in_progress',
      'completed',
      'failed'
    );
  END IF;
END $$;

-- Create tables
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  github_id TEXT UNIQUE,
  name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE TABLE repositories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  github_id INTEGER UNIQUE NOT NULL,
  owner TEXT NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  is_private BOOLEAN NOT NULL DEFAULT false,
  default_branch TEXT NOT NULL DEFAULT 'main',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  last_analyzed_at TIMESTAMP WITH TIME ZONE,
  metadata JSONB NOT NULL DEFAULT '{}',
  UNIQUE(owner, name)
);

CREATE TABLE pull_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  repository_id UUID NOT NULL REFERENCES repositories(id) ON DELETE CASCADE,
  number INTEGER NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  author TEXT NOT NULL,
  base_branch TEXT NOT NULL,
  head_branch TEXT NOT NULL,
  state TEXT NOT NULL DEFAULT 'open',
  is_draft BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  merged_at TIMESTAMP WITH TIME ZONE,
  closed_at TIMESTAMP WITH TIME ZONE,
  metadata JSONB NOT NULL DEFAULT '{}',
  UNIQUE(repository_id, number)
);

CREATE TABLE analysis_queue (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  repository_id UUID REFERENCES repositories(id) ON DELETE CASCADE,
  pull_request_id UUID REFERENCES pull_requests(id) ON DELETE CASCADE,
  status analysis_status NOT NULL DEFAULT 'pending',
  priority INTEGER NOT NULL DEFAULT 0,
  started_at TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,
  error TEXT,
  metadata JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  CHECK (repository_id IS NOT NULL OR pull_request_id IS NOT NULL)
);

-- Create indexes
CREATE INDEX idx_repositories_owner_name ON repositories(owner, name);
CREATE INDEX idx_pull_requests_repository ON pull_requests(repository_id);
CREATE INDEX idx_analysis_queue_status ON analysis_queue(status);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE repositories ENABLE ROW LEVEL SECURITY;
ALTER TABLE pull_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE analysis_queue ENABLE ROW LEVEL SECURITY;

-- Create RLS Policies
-- Users can only see their own data
CREATE POLICY "Users can view own data"
  ON users FOR SELECT
  USING (auth.uid() = id);

-- Anyone can view public repositories
CREATE POLICY "Anyone can view public repositories"
  ON repositories FOR SELECT
  USING (NOT is_private);

-- Repository owner can view private repositories
CREATE POLICY "Owner can view private repositories"
  ON repositories FOR SELECT
  USING (auth.uid() IN (
    SELECT id FROM users WHERE github_id = owner
  ));

-- PR policies follow repository access
CREATE POLICY "Users can view PRs they have access to"
  ON pull_requests FOR SELECT
  USING (
    repository_id IN (
      SELECT id FROM repositories
      WHERE NOT is_private 
      OR auth.uid() IN (SELECT id FROM users WHERE github_id = owner)
    )
  );

-- Analysis queue follows PR access
CREATE POLICY "Users can view analysis they have access to"
  ON analysis_queue FOR SELECT
  USING (
    repository_id IN (
      SELECT id FROM repositories
      WHERE NOT is_private 
      OR auth.uid() IN (SELECT id FROM users WHERE github_id = owner)
    )
    OR
    pull_request_id IN (
      SELECT id FROM pull_requests
      WHERE repository_id IN (
        SELECT id FROM repositories
        WHERE NOT is_private 
        OR auth.uid() IN (SELECT id FROM users WHERE github_id = owner)
      )
    )
  );