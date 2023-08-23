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
    '\\.(css|scss|png|jpg|svg)$': '<rootDir>/__mocks__/image.js',
  },
  modulePathIgnorePatterns: ['<rootDir>/dist/'],
};
