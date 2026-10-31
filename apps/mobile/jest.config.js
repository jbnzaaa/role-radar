/** @type {import('jest').Config} */
module.exports = {
  preset: "jest-expo",
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
  moduleNameMapper: {
    // Under Jest's "react-native" condition lucide resolves to an .mjs file Jest can't load;
    // use its CommonJS build instead (Metro still uses the ESM build in the app).
    "^lucide-react-native$": require.resolve("lucide-react-native"),
  },
};
