module.exports = {
  root: true,
  parser: '@typescript-eslint/parser', // Pakai parser TS walaupun pakai JS — aman & future-proof
  plugins: ['react', 'react-hooks', '@typescript-eslint', 'unused-imports'],
  extends: [
    'next',
    'next/core-web-vitals',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'plugin:@typescript-eslint/recommended',
    'eslint:recommended',
  ],
  rules: {
    // ✅ React & JSX best practices
    'react/jsx-uses-react': 'error',
    'react/jsx-uses-vars': 'error',
    'react/react-in-jsx-scope': 'off', // Next.js tidak butuh import React
    'react/jsx-key': 'warn',
    'react/prop-types': 'off', // nonaktif jika pakai TypeScript

    // ✅ Hooks rules
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'warn',

    // 🚫 Hindari kesalahan umum
    'no-console': ['warn', { allow: ['warn', 'error'] }],
    'no-debugger': 'warn',
    'no-unused-vars': 'off', // off default, pakai versi TS di bawah
    '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
    'unused-imports/no-unused-imports': 'error',
    'no-undef': 'error',

    // 🧹 Style (opsional, tapi bikin kode lebih rapi)
    'semi': ['warn', 'never'],
    'quotes': ['warn', 'single', { avoidEscape: true }],
    'comma-dangle': ['warn', 'only-multiline'],
    'object-curly-spacing': ['warn', 'always'],
    'arrow-body-style': ['warn', 'as-needed'],
    'prefer-const': 'warn',

    // ❌ Hindari `any`
    '@typescript-eslint/no-explicit-any': 'warn',
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
}
