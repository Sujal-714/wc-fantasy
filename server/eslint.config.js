import js from '@eslint/js';

export default [
  js.configs.recommended,
  {
    rules: {
      // errors — these fail the pipeline
      'no-unused-vars': 'error',
    //   'no-undef': 'error',
    //   'no-console': 'warn',

    //   // style — warnings only, won't fail pipeline
    //   'semi': ['error', 'always'],
    //   'quotes': ['error', 'single'],
    //   'indent': ['error', 2],
    },
    languageOptions: {
      ecmaVersion: 2024,
      globals: {
        process: 'readonly',
        __dirname: 'readonly',
        __filename: 'readonly',
        Buffer: 'readonly',
        console: 'readonly',
      }
    }},{
    // ignore these folders
    ignores: [
      'node_modules/**',
      'dist/**',
      '.env*']
  }
];