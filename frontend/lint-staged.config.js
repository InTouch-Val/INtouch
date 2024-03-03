export default {
  '*.{js,jsx}': [
    'npm run format',
    // 'npm run lint:fix',
  ],
  '*.{css}': ['npm run lint:style:fix'],
};
