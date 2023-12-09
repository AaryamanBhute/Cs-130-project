module.exports = {
  testEnvironment: 'jsdom',
    transformIgnorePatterns: ["node_modules/(?!axios)"],
    transform: {
      '^.+\\.jsx?$': 'babel-jest',
    },
    moduleNameMapper: {
      '\\.(css|less|sass|scss)$': 'identity-obj-proxy',
    },
};