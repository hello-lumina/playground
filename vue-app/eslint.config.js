import js from '@eslint/js'
import pluginVue from 'eslint-plugin-vue'
import eslintConfigPrettier from 'eslint-config-prettier'

export default [
  {
    name: 'app/files-to-lint',
    files: ['**/*.{js,mjs,jsx,vue}'],
  },

  {
    name: 'app/files-to-ignore',
    ignores: ['**/dist/**', '**/dist-ssr/**', '**/coverage/**'],
  },

  js.configs.recommended,
  ...pluginVue.configs['flat/essential'],

  {
    name: 'app/vue-rules',
    files: ['**/*.vue'],
    languageOptions: {
      parserOptions: {
        parser: '@babel/eslint-parser',
        requireConfigFile: false,
        babelOptions: {
          babelrc: false,
          configFile: false,
          presets: ['@babel/preset-env'],
        },
      },
      globals: {
        console: 'readonly',
        process: 'readonly',
        fetch: 'readonly',
        window: 'readonly',
        document: 'readonly',
        requestAnimationFrame: 'readonly',
        cancelAnimationFrame: 'readonly',
      },
    },
  },

  {
    name: 'app/javascript-rules',
    files: ['**/*.{js,mjs,jsx}'],
    languageOptions: {
      globals: {
        console: 'readonly',
        process: 'readonly',
        fetch: 'readonly',
      },
    },
    rules: {
      'no-console': 'off',
      'no-debugger': 'off',
    },
  },

  eslintConfigPrettier,
]
