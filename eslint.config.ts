import js from "@eslint/js";
import tseslint from "typescript-eslint";
import reactPlugin from "eslint-plugin-react";
import hooksPlugin from "eslint-plugin-react-hooks";
import a11yPlugin from "eslint-plugin-jsx-a11y";
import globals from "globals";

export default tseslint.config(
    {
        ignores: ["dist", "node_modules"],
    },
    {
        files: ["**/*.{ts,tsx}"],
        languageOptions: {
            parser: tseslint.parser,
            parserOptions: {
                project: "./tsconfig.json",
                ecmaVersion: "latest",
                sourceType: "module",
                ecmaFeatures: { jsx: true },
            },
            globals: {
                ...globals.browser,
                ...globals.node,
            },
        },
        plugins: {
            "@typescript-eslint": tseslint.plugin,
            react: reactPlugin,
            "react-hooks": hooksPlugin,
            "jsx-a11y": a11yPlugin,
        },
        settings: {
            react: {
                version: "detect",
            },
        },
        rules: {
            ...js.configs.recommended.rules,
            ...tseslint.configs.recommended.rules,
            ...reactPlugin.configs.recommended.rules,
            ...hooksPlugin.configs.recommended.rules,
            "react/react-in-jsx-scope": "off",
            "@typescript-eslint/no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
            "@typescript-eslint/explicit-module-boundary-types": "off",
        },
    }
);
