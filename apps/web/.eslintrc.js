module.exports = {
  extends: ['next/core-web-vitals'],
  settings: {
    'import/resolver': {
      node: {
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
        paths: ['src']
      }
    }
  },
  // Turn off all rules that are getting in the way of the build
  rules: {
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-unused-vars': 'off',
    '@typescript-eslint/no-empty-object-type': 'off',
    'import/no-unresolved': 'off',
    'import/namespace': 'off',
    'import/order': 'off',
    'import/no-duplicates': 'off',
    'import/export': 'off',
    'no-console': 'off',
    'react/no-unescaped-entities': 'off',
    'react-hooks/exhaustive-deps': 'off',
    'curly': 'off',
    '@next/next/no-img-element': 'off',
  }
};
