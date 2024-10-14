import eslint from '@eslint/js';
import typescript from '@typescript-eslint/eslint-plugin';
import typescriptParser from '@typescript-eslint/parser';

export default [
    eslint.configs.recommended,
    {
        files: ['jstracetoix.ts'],
        languageOptions: {
            parser: typescriptParser,
            parserOptions: {
                project: './tsconfig.json',
            },
        },
        plugins: {
            '@typescript-eslint': typescript,
        },
        rules: {
            'no-empty': 'off',
            'max-len': ['error', { code: 100 }],
            'no-trailing-spaces': ['error'],
            'no-unused-vars':
                [
                    'error',
                    {
                        argsIgnorePattern: '(data|index|allowIndex|value|name)'
                    }
                ]
        },
    }
];