-- Add platform column if it doesn't exist
ALTER TABLE repositories 
ADD COLUMN IF NOT EXISTS platform text DEFAULT 'github';

-- Update all existing repositories to set platform to 'github'
UPDATE repositories 
SET platform = 'github' 
WHERE platform IS NULL;

-- Verify the column was added and data updated
SELECT id, owner, name, platform, fingerprint 
FROM repositories 
LIMIT 10;

-- If you need to check details about specific repositories having issues
SELECT id, owner, name, platform, fingerprint, analysis_count, free_tier_analysis_limit
FROM repositories
WHERE owner = 'alpsla' AND name = 'family-central';

-- If you need to force update a specific repository that's causing issues
UPDATE repositories
SET 
  platform = 'github',
  updated_at = NOW()
WHERE 
  owner = 'alpsla' AND name = 'family-central';
