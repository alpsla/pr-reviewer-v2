import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['cjs', 'esm'],
  dts: {
    resolve: true,
  },
  splitting: false,
  sourcemap: true,
  clean: true,
  treeshake: true,
  external: [
    '@octokit/rest',
    '@octokit/types',
    '@octokit/auth-token',
    '@octokit/plugin-paginate-rest',
    '@octokit/plugin-rest-endpoint-methods',
    '@supabase/supabase-js',
    '@supabase/auth-helpers-nextjs'
  ]
});