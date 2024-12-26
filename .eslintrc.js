// https://docs.expo.dev/guides/using-eslint/
module.exports = {
  extends: ["expo", "prettier"],
  plugins: ["prettier"],
  rules: {
    "prettier/prettier": "warning",
  },
  overrides: [
    {
      files: ["*.ts", "*.tsx", "*.d.ts"],
      parserOptions: {
        project: "./tsconfig.json",
      },
    },
  ],
};
