export default {
  plugins: ['@awmottaz/prettier-plugin-void-html'],
  singleQuote: true,
  printWidth: 100,
  overrides: [
    {
      files: ['dist'],
      options: { requirePragma: true },
    },
  ],
};
