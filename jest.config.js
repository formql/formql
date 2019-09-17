module.exports = {
  preset: 'jest-preset-angular',
  setupFilesAfterEnv: ['<rootDir>/setupJest.ts'],
  globals: {
    'ts-jest': {
      tsConfig: "<rootDir>/tsconfig.spec.json",
      diagnostics: false,
      stringifyContentPathRegex: '\\.html$',
      astTransformers: ["<rootDir>/node_modules/jest-preset-angular/InlineHtmlStripStylesTransformer"]
    }
  },
  modulePathIgnorePatterns: [
    'npm-cache',
    '\'.npm',
    'packages/core/package.json',
    '/examples/*'
  ]
}