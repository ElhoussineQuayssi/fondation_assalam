// eslint.config.cjs
const { FlatCompat } = require("@eslint/eslintrc");
const nextConfig = require("eslint-config-next");

const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: require("@eslint/js").configs.recommended,
});

module.exports = [
  ...compat.extends("next/core-web-vitals"),
  {
    ignores: ["node_modules/**", "dist/**", ".next/**"],
    rules: {
      "no-console": "off",
      "no-undef": "off",
    },
  },
];
