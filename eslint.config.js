const js = require('@eslint/js');

module.exports = [
    js.configs.recommended,
    {
        languageOptions: {
            ecmaVersion: 2022,
            sourceType:  'commonjs',
            globals: {
                require:   'readonly',
                module:    'readonly',
                exports:   'readonly',
                __dirname: 'readonly',
                __filename:'readonly',
                process:   'readonly',
                console:   'readonly',
            },
        },
        rules: {
            'no-unused-vars':  ['warn', { argsIgnorePattern: '^_' }],
            'no-console':       'off',
            'semi':            ['error', 'always'],
            'eqeqeq':          ['error', 'always'],
            'no-var':           'error',
            'prefer-const':    'warn',
        },
    },
    {
        ignores: ['node_modules/**', 'public/**'],
    },
];
