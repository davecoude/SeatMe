import tsParser from '@typescript-eslint/parser'
import tsPlugin from '@typescript-eslint/eslint-plugin'
import prettierConfig from 'eslint-config-prettier'

export default [
  {
    files: ['src/**/*.ts'],
    languageOptions: {
      parser: tsParser,
    },
    plugins: {
      '@typescript-eslint': tsPlugin,
    },
    rules: {
      ...tsPlugin.configs.recommended.rules,
      '@typescript-eslint/no-explicit-any': 'warn',
      // Permite omitir propiedades con rest: const { password: _, ...rest } = user
      '@typescript-eslint/no-unused-vars': ['error', { ignoreRestSiblings: true }],
      // Permite la augmentación de tipos: declare global { namespace Express { ... } }
      '@typescript-eslint/no-namespace': ['error', { allowDeclarations: true }],
    },
  },
  prettierConfig,
]