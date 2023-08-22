module.exports = {
  preset: 'ts-jest',
  transform: {
    '^.+\\.jsx?$': 'babel-jest',
    '^.+\\.tsx?$': 'ts-jest',
  },
  testEnvironment: 'jsdom',
  moduleNameMapper: {
    'docker/extension-api-client':
      '<rootDir>/_mocks_/@docker/extension-api-client.js',
  },
};
