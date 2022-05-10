module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: ["plugin:prettier/recommended"],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 12,
    sourceType: "module",
  },
  plugins: ["prettier", "react-hooks", "react"],
  rules: {
    "no-use-before-define": "off",
    "@typescript-eslint/no-use-before-define": ["off"],
    "react/self-closing-comp": "error", // <--- THIS IS THE NEW RULE
    "@typescript-eslint/no-shadow": "off",
    "react/jsx-uses-react": "off",
    "react/react-in-jsx-scope": "off",
    "import/no-commonjs": "off",
    "import/no-mutable-exports": "off",
    "no-shadow": "off",
    "react/prop-types": "off",
    "react-hooks/rules-of-hooks": "error",
    "react-hooks/exhaustive-deps": "warn",
  },
};
