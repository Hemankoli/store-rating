module.exports = {
  testEnvironment: 'node',
  setupFilesAfterEnv: ['./src/tests/setup.js'],
  testMatch: ['**/tests/**/*.test.js'],
  forceExit: true,
  clearMocks: true,
};
