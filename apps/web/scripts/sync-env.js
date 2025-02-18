const fs = require('fs');
const path = require('path');

// Define the base template with all possible environment variables
const baseTemplate = {
  // API and App URLs
  'NEXT_PUBLIC_API_URL': '',
  'NEXT_PUBLIC_APP_URL': '',

  // Supabase Configuration
  'NEXT_PUBLIC_SUPABASE_URL': '',
  'NEXT_PUBLIC_SUPABASE_ANON_KEY': '',

  // OAuth Providers
  // GitHub
  'GITHUB_CLIENT_ID': '',
  'GITHUB_CLIENT_SECRET': '',

  // GitLab
  'GITLAB_CLIENT_ID': '',
  'GITLAB_CLIENT_SECRET': '',
  'GITLAB_REDIRECT_URI': 'http://localhost:3000/auth/callback',

  // Google
  'GOOGLE_CLIENT_ID': '',
  'GOOGLE_CLIENT_SECRET': '',

  // Azure AD
  'AZURE_AD_CLIENT_ID': '',
  'AZURE_AD_CLIENT_SECRET': '',
  'AZURE_AD_TENANT_ID': '',

  // Email Configuration
  'SMTP_HOST': '',
  'SMTP_PORT': '',
  'SMTP_USER': '',
  'SMTP_PASSWORD': '',
  'SMTP_FROM': ''
};

// Define paths
const envPath = path.join(__dirname, '../.env');
const envLocalPath = path.join(__dirname, '../.env.local');
const envExamplePath = path.join(__dirname, '../.env.example');

// Read .env and .env.local files
const envContent = fs.existsSync(envPath) ? fs.readFileSync(envPath, 'utf8') : '';
const envLocalContent = fs.existsSync(envLocalPath) ? fs.readFileSync(envLocalPath, 'utf8') : '';

// Parse environment files
function parseEnvFile(content) {
  const result = {};
  const lines = content.split('\n');
  
  for (const line of lines) {
    // Keep comments
    if (line.startsWith('#') || !line.trim()) {
      continue;
    }
    
    const [key, ...valueParts] = line.split('=');
    if (key) {
      const value = valueParts.join('=').trim();
      result[key.trim()] = value;
    }
  }
  
  return result;
}

// Create formatted env content
function createEnvContent(vars, includeValues = true, includeComments = true) {
  let content = '';
  let currentSection = '';

  Object.entries(baseTemplate).forEach(([key, defaultValue]) => {
    // Determine section from key
    let section = 'Other';
    if (key.includes('PUBLIC')) section = 'API and App URLs';
    else if (key.includes('SUPABASE')) section = 'Supabase Configuration';
    else if (key.includes('GITHUB')) section = 'GitHub Configuration';
    else if (key.includes('GITLAB')) section = 'GitLab Configuration';
    else if (key.includes('GOOGLE')) section = 'Google Configuration';
    else if (key.includes('AZURE')) section = 'Azure Configuration';
    else if (key.includes('SMTP')) section = 'Email Configuration';

    // Add section header if changed
    if (includeComments && section !== currentSection) {
      if (currentSection !== '') content += '\n';
      content += `# ${section}\n`;
      currentSection = section;
    }

    const value = vars[key] || defaultValue;
    content += `${key}=${includeValues ? value : ''}\n`;
  });

  return content;
}

// Parse existing files
const envVars = parseEnvFile(envContent);
const envLocalVars = parseEnvFile(envLocalContent);
const mergedVars = { ...baseTemplate, ...envVars, ...envLocalVars };

// Write .env with template values
fs.writeFileSync(envPath, createEnvContent(baseTemplate, true, true));

// Write .env.example with empty values but keeping Supabase values if they exist
const exampleVars = { ...baseTemplate };
if (mergedVars['NEXT_PUBLIC_SUPABASE_URL']) {
  exampleVars['NEXT_PUBLIC_SUPABASE_URL'] = mergedVars['NEXT_PUBLIC_SUPABASE_URL'];
}
if (mergedVars['NEXT_PUBLIC_SUPABASE_ANON_KEY']) {
  exampleVars['NEXT_PUBLIC_SUPABASE_ANON_KEY'] = mergedVars['NEXT_PUBLIC_SUPABASE_ANON_KEY'];
}
fs.writeFileSync(envExamplePath, createEnvContent(exampleVars, true, true));

console.log('Environment files synchronized successfully!');