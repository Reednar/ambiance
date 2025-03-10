module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: 'tsconfig.json',
    tsconfigRootDir: __dirname,
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint/eslint-plugin'],
  extends: [
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
  ],
  root: true,
  env: {
    node: true,
    jest: true,
  },
  ignorePatterns: ['.eslintrc.js', 'dist/'], // Exclut le dossier de build
  rules: {
    //Assouplissement des regles trop strictes
    '@typescript-eslint/interface-name-prefix': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',

    // Pour les variables de type `any`
    '@typescript-eslint/no-explicit-any': 'warn', // Autorisé mais signalé

    // Gestion des variables non utilisées
    '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }], // Tolère les variables non utilisées commençant par `_`

    // Gestion des promesses
    '@typescript-eslint/no-floating-promises': 'error', // Interdit les promesses non gérées
    '@typescript-eslint/require-await': 'error', // Interdit les `async` sans `await`

    // Formatage du code
    'prettier/prettier': [
      'error',
      {
        endOfLine: 'auto',
      },
    ],
  },
};
