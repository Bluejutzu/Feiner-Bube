/* https://github.com/Vendicated/Vencord/blob/main/eslint.config.mjs */
import stylistic from "@stylistic/eslint-plugin";
import tseslint from "typescript-eslint";
import simpleImportSort from "eslint-plugin-simple-import-sort";

export default tseslint.config(
    { ignores: ["node_modules", "dist", "prisma", "db", "interface", ".commandkit", "/**/*.{js,jsx}"] },
    {
        ignores: ["node_modules", "dist", "prisma", "db", "/**/*.{js,jsx}"],

        files: ["/src/**/*.{js,jsx,ts,tsx}", "/interface/**/*.{js,jsx,ts,tsx}"],
        plugins: {
            "@stylistic": stylistic,
            "simple-import-sort": simpleImportSort,
            "@typescript-eslint": tseslint.plugin
        },
        languageOptions: {
            parser: tseslint.parser,
            parserOptions: {
                project: "./tsconfig.json"
            }
        },
        rules: {
            "simple-import-sort/imports": "error",
            "simple-import-sort/exports": "error",

            "no-constant-condition": ["error", { checkLoops: false }],
            "no-empty": ["error", { allowEmptyCatch: true }],
            "prefer-const": "error",
            "no-unused-vars": "off",
            "@typescript-eslint/no-unused-vars": ["error", { argsIgnorePattern: "^_" }],
            "@typescript-eslint/consistent-type-imports": "error",
            "@typescript-eslint/no-non-null-assertion": "off",
            "@typescript-eslint/ban-ts-comment": "off",
            "@typescript-eslint/no-explicit-any": "off",

            "@stylistic/quotes": ["error", "double"],
            "@stylistic/semi": "error",
            "@stylistic/indent": ["error", 4],
            "@stylistic/comma-dangle": ["error", "never"],
            "@stylistic/arrow-parens": ["error", "as-needed"],
            "@stylistic/no-mixed-spaces-and-tabs": "error"
        }
    },
    ...tseslint.configs.recommended
);
