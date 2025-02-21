const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log("🔍 Running targeted type error fixes...");

// File path constants
const vcsIndexPath = path.join(__dirname, 'src', 'vcs', 'index.ts');
const typeIndexPath = path.join(__dirname, 'src', 'types', 'index.ts');
const githubMappersPath = path.join(__dirname, 'src', 'vcs', 'github', 'mappers.ts');
const mockDbPath = path.join(__dirname, 'src', '__mocks__', 'database.ts');

// 1. Fix VCS URL parsing in vcs/index.ts
console.log("1️⃣ Fixing URL parsing in vcs/index.ts...");
try {
  let vcsIndexContent = fs.readFileSync(vcsIndexPath, 'utf8');
  
  // Add proper null checks to GitHub URL parsing
  vcsIndexContent = vcsIndexContent.replace(
    /const match = url\.match\(GITHUB_REPO_REGEX\);[\s\S]+?return {[\s\S]+?owner: match\[1\],[\s\S]+?repo: match\[2\]\.replace\(\/\\\.git\$\/,/g,
    'const match = url.match(GITHUB_REPO_REGEX);\n' +
    '  if (!match || !match[1] || !match[2]) {\n' +
    '    throw new Error(`Invalid GitHub repository URL: ${url}`);\n' +
    '  }\n' +
    '  return {\n' +
    '    platform: \'github\',\n' +
    '    owner: match[1],\n' +
    '    repo: match[2].replace(/\\.git$/,'
  );
  
  // Add proper null checks to GitHub PR URL parsing
  vcsIndexContent = vcsIndexContent.replace(
    /const match = url\.match\(GITHUB_PR_REGEX\);[\s\S]+?return {[\s\S]+?owner: match\[1\],[\s\S]+?repo: match\[2\],[\s\S]+?number: parseInt\(match\[3\]/g,
    'const match = url.match(GITHUB_PR_REGEX);\n' +
    '  if (!match || !match[1] || !match[2] || !match[3]) {\n' +
    '    throw new Error(`Invalid GitHub pull request URL: ${url}`);\n' +
    '  }\n' +
    '  return {\n' +
    '    platform: \'github\',\n' +
    '    owner: match[1],\n' +
    '    repo: match[2],\n' +
    '    number: parseInt(match[3]'
  );
  
  // Add proper null checks to GitLab URL parsing as well
  vcsIndexContent = vcsIndexContent.replace(
    /const match = url\.match\(GITLAB_REPO_REGEX\);[\s\S]+?return {[\s\S]+?owner: match\[1\],[\s\S]+?repo: match\[2\]\.replace\(\/\\\.git\$\/,/g,
    'const match = url.match(GITLAB_REPO_REGEX);\n' +
    '  if (!match || !match[1] || !match[2]) {\n' +
    '    throw new Error(`Invalid GitLab repository URL: ${url}`);\n' +
    '  }\n' +
    '  return {\n' +
    '    platform: \'gitlab\',\n' +
    '    owner: match[1],\n' +
    '    repo: match[2].replace(/\\.git$/,'
  );
  
  // Add proper null checks to GitLab PR URL parsing
  vcsIndexContent = vcsIndexContent.replace(
    /const match = url\.match\(GITLAB_PR_REGEX\);[\s\S]+?return {[\s\S]+?owner: match\[1\],[\s\S]+?repo: match\[2\],[\s\S]+?number: parseInt\(match\[3\]/g,
    'const match = url.match(GITLAB_PR_REGEX);\n' +
    '  if (!match || !match[1] || !match[2] || !match[3]) {\n' +
    '    throw new Error(`Invalid GitLab merge request URL: ${url}`);\n' +
    '  }\n' +
    '  return {\n' +
    '    platform: \'gitlab\',\n' +
    '    owner: match[1],\n' +
    '    repo: match[2],\n' +
    '    number: parseInt(match[3]'
  );
  
  fs.writeFileSync(vcsIndexPath, vcsIndexContent);
  console.log("✅ Fixed URL parsing in vcs/index.ts");
} catch (error) {
  console.error("❌ Failed to fix URL parsing:", error.message);
}

// 2. Fix the types/index.ts export issues
console.log("2️⃣ Fixing type exports in types/index.ts...");
try {
  let typesIndexContent = fs.readFileSync(typeIndexPath, 'utf8');
  
  // Ensure all type exports are using 'export type'
  typesIndexContent = typesIndexContent.replace(
    /export \* from "\.\/analysis";/g,
    'export * from "./analysis";\n// Export specific analysis types\n// export type { AnalysisConfig, AnalysisJob, AnalysisResult } from "./analysis";'
  );
  
  // Fix VCS type exports
  typesIndexContent = typesIndexContent.replace(
    /export type {[\s\S]+?VCSProvider,[\s\S]+?VCSClient,[\s\S]+?Repository as Repository,[\s\S]+?PullRequest as PullRequest,[\s\S]+?VCSError[\s\S]+?} from '\.\.\/vcs\/types';/g,
    `export type {
  VCSPlatform,
  VCSClient,
  VCSRepository as Repository,
  VCSPullRequest as PullRequest,
  VCSFile as PullRequestFile,
  VCSComment as Comment,
  VCSUser as User,
} from '../vcs/types';\n
// Import VCSError from the errors module
export type { VCSError } from '../vcs/errors';`
  );
  
  // Fix repository type exports
  typesIndexContent = typesIndexContent.replace(
    /export type {[\s\S]+?Repository as RepositoryService,[\s\S]+?RepositoryListOptions as RepositoryOptions,[\s\S]+?PullRequestListOptions as PROptions[\s\S]+?} from '\.\.\/repository\/types';/g,
    `export type {
  Repository,
  RepositoryListOptions as RepositoryOptions,
  PullRequestListOptions as PROptions
} from '../repository/types';`
  );
  
  // Fix auth type exports
  typesIndexContent = typesIndexContent.replace(
    /export type { AuthTokens as TokenData } from '\.\.\/auth\/types';/g,
    `// Re-export more specific auth types
export type { OAuthTokens as TokenData } from '../auth/auth-service';`
  );
  
  fs.writeFileSync(typeIndexPath, typesIndexContent);
  console.log("✅ Fixed type exports in types/index.ts");
} catch (error) {
  console.error("❌ Failed to fix type exports:", error.message);
}

// 3. Fix GitHub mappers to handle nulls properly
console.log("3️⃣ Fixing GitHub mappers for better null handling...");
try {
  let mappersContent = fs.readFileSync(githubMappersPath, 'utf8');
  
  // Fix commit mapper to handle null authors/committers
  mappersContent = mappersContent.replace(
    /author: {[\s\S]+?name: commit\.commit\.author\.name,[\s\S]+?email: commit\.commit\.author\.email,[\s\S]+?date: new Date\(commit\.commit\.author\.date\),[\s\S]+?username: commit\.author\?\.login[\s\S]+?},/g,
    `author: {
      name: commit.commit.author?.name || "Unknown",
      email: commit.commit.author?.email || "unknown@example.com",
      date: commit.commit.author?.date ? new Date(commit.commit.author.date) : new Date(),
      username: commit.author?.login
    },`
  );
  
  // Fix committer mapper to handle null committers
  mappersContent = mappersContent.replace(
    /committer: {[\s\S]+?name: commit\.commit\.committer\.name,[\s\S]+?email: commit\.commit\.committer\.email,[\s\S]+?date: new Date\(commit\.commit\.committer\.date\),[\s\S]+?username: commit\.committer\?\.login[\s\S]+?},/g,
    `committer: {
      name: commit.commit.committer?.name || "Unknown",
      email: commit.commit.committer?.email || "unknown@example.com",
      date: commit.commit.committer?.date ? new Date(commit.commit.committer.date) : new Date(),
      username: commit.committer?.login
    },`
  );
  
  // Fix review mapper
  mappersContent = mappersContent.replace(
    /commitId: review\.commit_id/g,
    'commitId: review.commit_id || ""'
  );
  
  // Fix comment mapper
  mappersContent = mappersContent.replace(
    /body: comment\.body,/g,
    'body: comment.body || "",'
  );
  
  fs.writeFileSync(githubMappersPath, mappersContent);
  console.log("✅ Fixed GitHub mappers");
} catch (error) {
  console.error("❌ Failed to fix GitHub mappers:", error.message);
}

// 4. Create a more complete mock database
console.log("4️⃣ Fixing mock database implementation...");
try {
  const mockDbContent = `import type { DatabaseService } from '../supabase/database';

export const createMockDatabaseService = () => {
  const mockDb = {
    // User methods
    createUser: jest.fn(),
    updateUser: jest.fn(),
    getUser: jest.fn(),
    getUserByGithubId: jest.fn(),
    getUserByGitlabId: jest.fn(),
    getUserByEmail: jest.fn(),
    
    // Repository methods
    createRepository: jest.fn(),
    updateRepository: jest.fn(),
    getRepository: jest.fn(),
    getRepositoryByOwnerAndName: jest.fn(),
    listUserRepositories: jest.fn(),
    
    // Pull request methods
    createPullRequest: jest.fn(),
    updatePullRequest: jest.fn(),
    getPullRequest: jest.fn(),
    getPullRequestByNumber: jest.fn(),
    listPullRequests: jest.fn(),
    
    // Analysis methods
    createAnalysis: jest.fn(),
    updateAnalysis: jest.fn(),
    getAnalysis: jest.fn(),
    getAnalysisByPullRequest: jest.fn(),
    getNextAnalysisJob: jest.fn()
  } as unknown as jest.Mocked<DatabaseService>;

  return mockDb;
};`;
  
  fs.writeFileSync(mockDbPath, mockDbContent);
  console.log("✅ Fixed mock database implementation");
} catch (error) {
  console.error("❌ Failed to fix mock database:", error.message);
}

console.log("🧪 All targeted fixes completed. Try building again.");
