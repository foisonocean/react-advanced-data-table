module.exports = {
  transform: {
    '^.+\\.jsx?$': '<rootDir>/node_modules/babel-jest',
    '^.+\\.tsx?$': 'ts-jest',
  },
  transformIgnorePatterns: ['node_modules/(?!(lodash-es)/)'],
  testRegex: '(__tests__/.*|(\\.|/)(test|spec))\\.(jsx?|tsx?)$',
  setupFiles: ['<rootDir>/src/__test__/setup.ts'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  modulePaths: ['<rootDir>/src/'],
  moduleNameMapper: {
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$':
      '<rootDir>/src/__test__/__mocks__/fileMock.ts',
    '\\.(css|less|sass|scss|stylus|styl)$':
      '<rootDir>/src/__test__/__mocks__/styleMock.ts',
  },
  collectCoverage: true,
  mapCoverage: true,
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!**/node_modules/**',
    '!**/*.d.ts',
  ],
  coveragePathIgnorePatterns: [
    '/node_modules/',
    '<rootDir>/src/__test__/',
    '<rootDir>/src/.*types\\.(ts|tsx)',
    '<rootDir>/src/index\\.ts',
  ],
}
