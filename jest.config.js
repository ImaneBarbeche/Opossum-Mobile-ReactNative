module.exports = {
  preset: "jest-expo",
  transform: {
    "^.+\\.(js|jsx|ts|tsx)$": "babel-jest",
  },
  transformIgnorePatterns: [
    "node_modules/(?!(expo|@expo|expo-modules-core|react-native|@react-native|@react-navigation|@unimodules|unimodules|sentry-expo|native-base|@react-native-async-storage|@react-native-community|@react-native-picker|@react-native-masked-view|@react-native-segmented-control|@react-native-clipboard|@react-native-safe-area-context|@react-native-firebase|@react-native-google-signin|@react-native-google-signin/google-signin|@react-native-async-storage/async-storage)/)",
  ],
  moduleNameMapper: {
    "^react-native-toast-message$": "<rootDir>/__mocks__/react-native-toast-message.js",
  },
};
