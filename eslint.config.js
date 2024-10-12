import eslint from '@eslint/js';
import typescript from '@typescript-eslint/eslint-plugin';
import typescriptParser from '@typescript-eslint/parser';

export default [
    eslint.configs.recommended,
    {
        files: ['*.ts'],
        languageOptions: {
            parser: typescriptParser,
            parserOptions: {
                project: './tsconfig.json',
            },
            globals: {
                IS_NODE: 'readonly',
                process: 'readonly',
                console: 'readonly',
            },
        },
        plugins: {
            '@typescript-eslint': typescript,
        },
        rules: {
            'no-empty': 'off',
            'no-unused-vars':
                [
                    'error',
                    {
                        argsIgnorePattern: '(data|index|allowIndex|value|name)',
                        varsIgnorePattern: 'IS_NODE',
                    }
                ]
        },
    }
];