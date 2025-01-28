module.exports = {
    presets: [
      '@babel/preset-react',        // Handles JSX transformation
      '@babel/preset-typescript'    // Handles TypeScript transformation
    ],
    plugins: [
      // Optional plugins can be added here if needed
    ],
    rules: [
        {
            test: /\.tsx?$/,
            use: 'ts-loader',
            exclude: /node_modules/,
        },
        {
            test: /\.js$/,
            use: 'babel-loader',
            exclude: /node_modules/,
        }
    ]
};
  