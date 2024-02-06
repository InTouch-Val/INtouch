export default {
  singleQuote: true,
  printWidth: 100,
  overrides: [
    {
      files: [
        'dist',
        'vite.config.js',
        'eslint.config.js',
        'stylelint.config.js',
        'prettier.config.js',
      ],
      options: { requirePragma: true },
    },
  ],
};
