
const path = require('path');
//const UglifyJSPlugin = require('uglifyjs-webpack-plugin');

const libraryName = 'InputSuggestion'
const outputFile = `${libraryName}.js`

module.exports = {
  entry: './src/index.js',
  output: {
    filename: outputFile,
    path: path.resolve(__dirname, '..', 'dist'),
    //library: libraryName,
    //libraryTarget: 'umd',
    //umdNamedDefine: true,
  },
  plugins: [
    //new UglifyJSPlugin()
  ]
};