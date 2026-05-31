module.exports = {
  projects: [
    {
      displayName: 'detection-client',
      testEnvironment: 'jsdom',
      rootDir: 'bot-detection-platform/client',
      testMatch: ['<rootDir>/src/**/__tests__/**/*.js', '<rootDir>/src/**/*.test.js'],
      setupFilesAfterEnv: ['<rootDir>/src/setupTests.js'],
      moduleNameMapper: {
        '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
        '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$':
          '<rootDir>/src/__mocks__/fileMock.js',
      },
      collectCoverageFrom: [
        'src/**/*.js',
        '!src/index.js',
        '!src/**/*.test.js',
        '!src/**/__tests__/**',
      ],
    },
    {
      displayName: 'detection-server',
      testEnvironment: 'node',
      rootDir: 'bot-detection-platform/server',
      testMatch: ['<rootDir>/src/**/__tests__/**/*.js', '<rootDir>/src/**/*.test.js'],
      testPathIgnorePatterns: [
        'src/controllers/authController.test.js',
        'src/utils/validation.test.js',
      ],
      collectCoverageFrom: [
        'src/**/*.js',
        '!src/index.js',
        '!src/**/*.test.js',
        '!src/**/__tests__/**',
      ],
    },
    {
      displayName: 'simulator-client',
      testEnvironment: 'jsdom',
      rootDir: 'bot-traffic-simulator/client',
      testMatch: ['<rootDir>/src/**/__tests__/**/*.js', '<rootDir>/src/**/*.test.js'],
      setupFilesAfterEnv: ['<rootDir>/src/setupTests.js'],
      moduleNameMapper: {
        '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
        '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$':
          '<rootDir>/src/__mocks__/fileMock.js',
      },
      collectCoverageFrom: [
        'src/**/*.js',
        '!src/index.js',
        '!src/**/*.test.js',
        '!src/**/__tests__/**',
      ],
    },
    {
      displayName: 'simulator-server',
      testEnvironment: 'node',
      rootDir: 'bot-traffic-simulator/server',
      testMatch: ['<rootDir>/src/**/__tests__/**/*.js', '<rootDir>/src/**/*.test.js'],
      collectCoverageFrom: [
        'src/**/*.js',
        '!src/index.js',
        '!src/**/*.test.js',
        '!src/**/__tests__/**',
      ],
    },
  ],
  coveragePathIgnorePatterns: ['/node_modules/', '/.next/'],
  testPathIgnorePatterns: ['/node_modules/', '/.next/'],
  collectCoverageFrom: ['src/**/*.js', '!src/**/*.test.js', '!src/**/__tests__/**'],
};
