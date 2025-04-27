import js from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import pluginReact from 'eslint-plugin-react';
import eslintPluginUnicorn from 'eslint-plugin-unicorn';
import { defineConfig, globalIgnores } from 'eslint/config';

export default defineConfig([
	{
		files: ['**/*.{js,mjs,cjs,ts,jsx,tsx}'],
		plugins: { js, unicord: eslintPluginUnicorn },
		extends: ['js/recommended'],
	},
	{
		files: ['**/*.{js,mjs,cjs,ts,jsx,tsx}'],
		languageOptions: { globals: { ...globals.browser, ...globals.node } },
	},
	tseslint.configs.recommended,
	pluginReact.configs.flat.recommended,
	eslintPluginUnicorn.configs.recommended,
	{
		rules: {
			'unicorn/no-null': 'off',
			'unicorn/prevent-abbreviations': 'off',
		},
	},
	globalIgnores(['**/.react-router/']),
]);
