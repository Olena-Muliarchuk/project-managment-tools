const js = require('@eslint/js');
const globals = require('globals');
const { defineConfig } = require('eslint/config');

module.exports = defineConfig([
    {
        files: ['**/*.{js,mjs,cjs}'],
        languageOptions: {
            sourceType: 'script',
            globals: {
                ...globals.node,
            },
        },
        plugins: {
            js,
        },
        extends: ['js/recommended'],
        rules: {
            'no-unused-vars': ['warn', { 'argsIgnorePattern': '^_' }],
            eqeqeq: 'error',
            curly: 'error',
            'no-var': 'error',
            'prefer-const': 'warn',
            semi: ['error', 'always'],
            indent: ['error', 4, { 'SwitchCase': 1, 'VariableDeclarator': 1 }],
            quotes: ['error', 'single'],
            'max-len': ['warn', { code: 100 }],
        },
    },
    {
        files: ['tests/**/*.js'],
        languageOptions: {
            sourceType: 'module',
            globals: {
                ...globals.node,
                ...globals.mocha,
                ...globals.chai,
            },
        },
        rules: {
            'max-len': 'off',
            'no-unused-expressions': 'off',
        },
    },
    {
        ignores: ['node_modules/', 'prisma/'],
    },
]);
