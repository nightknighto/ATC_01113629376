/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    testMatch: ['**/*.test.ts'],
    //   testTimeout: 20000,
    verbose: true,
    // testEnvironmentOptions: {
    //     DATABASE_URL: 'postgresql://postgres:postgres@localhost:5432/events_test',
    //     JWT_SECRET: "test"
    // }
};
