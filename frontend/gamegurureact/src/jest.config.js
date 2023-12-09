module.exports = {
  testEnvironment: 'jsdom',
  transformIgnorePatterns: [
    "node_modules/(?!axios)",
    "\\.css$",
  ],
  transform: {
    '^.+\\.jsx?$': 'babel-jest',
  },
  moduleNameMapper: {
    '\\.(css|less|sass|scss)$': 'identity-obj-proxy',
    '\\.(png|jpg|jpeg|gif|svg)$': './mockImageFile.js', // Mock image files
  },
  testRegex: "(/__tests__/.*|(\\.|/)(test|spec))\\.jsx?$",
  testPathIgnorePatterns: ["/node_modules/", "\\.css$"]
};
