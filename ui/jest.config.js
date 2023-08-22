module.exports = {
  preset: 'ts-jest',
  transform: {
    '^.+\\.jsx?$': 'babel-jest',
    '^.+\\.tsx?$': 'ts-jest',
  },
  testEnvironment: 'jsdom',
  moduleNameMapper: {
    '@docker/extension-api-client':
      '<rootDir>/__mocks__/@docker/extension-api-client.js',
  },
  modulePathIgnorePatterns: ['<rootDir>/dist/']
};
