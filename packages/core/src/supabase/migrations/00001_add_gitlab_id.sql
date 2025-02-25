-- Add gitlab_id column to repositories table
ALTER TABLE repositories ADD COLUMN IF NOT EXISTS gitlab_id TEXT;

-- Add index on gitlab_id
CREATE INDEX IF NOT EXISTS repositories_gitlab_id_idx ON repositories(gitlab_id);