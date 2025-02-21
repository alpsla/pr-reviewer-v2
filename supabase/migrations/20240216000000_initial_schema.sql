-- Create custom types
CREATE TYPE analysis_status AS ENUM ('pending', 'in_progress', 'completed', 'failed');

-- Create users table
CREATE TABLE IF NOT EXISTS public.users (
    id UUID PRIMARY KEY REFERENCES auth.users(id),
    email TEXT,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()),
    auth_provider TEXT NOT NULL,
    status TEXT DEFAULT 'active'::text,
    
    -- Provider-specific fields
    github_id TEXT,
    gitlab_id TEXT,
    google_id TEXT,
    azure_id TEXT,
    
    github_login TEXT,
    gitlab_username TEXT,
    google_email TEXT,
    azure_email TEXT,
    
    name TEXT,
    avatar_url TEXT,
    
    preferences JSONB DEFAULT '{"notifications": true, "theme": "system", "language": "en"}'::jsonb
);

-- Create repositories table
CREATE TABLE IF NOT EXISTS public.repositories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    github_id TEXT UNIQUE,
    owner TEXT NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    is_private BOOLEAN DEFAULT false,
    default_branch TEXT DEFAULT 'main',
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()),
    last_analyzed_at TIMESTAMPTZ,
    metadata JSONB DEFAULT '{}'::jsonb,
    
    CONSTRAINT repositories_owner_name_unique UNIQUE (owner, name)
);

-- Create pull_requests table
CREATE TABLE IF NOT EXISTS public.pull_requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    repository_id UUID REFERENCES public.repositories(id) ON DELETE CASCADE,
    number INTEGER NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    state TEXT NOT NULL,
    author TEXT NOT NULL,
    base_branch TEXT NOT NULL,
    head_branch TEXT NOT NULL,
    merge_commit_sha TEXT,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()),
    last_analyzed_at TIMESTAMPTZ,
    metadata JSONB DEFAULT '{}'::jsonb,
    
    CONSTRAINT pull_requests_repo_number_unique UNIQUE (repository_id, number)
);

-- Create analysis_queue table
CREATE TABLE IF NOT EXISTS public.analysis_queue (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    repository_id UUID REFERENCES public.repositories(id) ON DELETE CASCADE,
    pull_request_id UUID REFERENCES public.pull_requests(id) ON DELETE CASCADE,
    status analysis_status DEFAULT 'pending',
    priority INTEGER DEFAULT 0,
    started_at TIMESTAMPTZ,
    completed_at TIMESTAMPTZ,
    error TEXT,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now())
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_users_auth_provider ON public.users(auth_provider);
CREATE INDEX IF NOT EXISTS idx_repositories_github_id ON public.repositories(github_id);
CREATE INDEX IF NOT EXISTS idx_pull_requests_repository ON public.pull_requests(repository_id);
CREATE INDEX IF NOT EXISTS idx_analysis_queue_status ON public.analysis_queue(status);
CREATE INDEX IF NOT EXISTS idx_analysis_queue_priority ON public.analysis_queue(priority);

-- Create triggers for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON public.users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_repositories_updated_at
    BEFORE UPDATE ON public.repositories
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_pull_requests_updated_at
    BEFORE UPDATE ON public.pull_requests
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_analysis_queue_updated_at
    BEFORE UPDATE ON public.analysis_queue
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();