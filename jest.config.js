module.exports = {
    moduleFileExtensions: ["ts", "js"],
    testEnvironment: "node",
    testRegex: "/tests/.*\\.(test|spec)?\\.(ts|tsx)$",
    testResultsProcessor: "jest-sonar-reporter",
    transform: {"^.+\\.ts?$": "ts-jest"}
};
