
const path = require('path');
const fs = require('fs');
const url = require('url');

const autoprefixer = require('autoprefixer');
//const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const outputFile = `[name].js`;
const cssFilename = 'css/[name].css';

/**
 * Ref: Create React App
 */
const appDirectory = fs.realpathSync(process.cwd());
const resolveApp = relativePath => path.resolve(appDirectory, relativePath);
const envPublicUrl = process.env.PUBLIC_URL;

function ensureSlash(path, needsSlash) {
  const hasSlash = path.endsWith('/');
  if (hasSlash && !needsSlash) {
    return path.substr(path, path.length - 1);
  } else if (!hasSlash && needsSlash) {
    return `${path}/`;
  } else {
    return path;
  }
}
const getPublicUrl = appPackageJson => envPublicUrl || require(appPackageJson).homepage;
function getServedPath(appPackageJson) {
  const publicUrl = getPublicUrl(appPackageJson);
  const servedUrl =
    envPublicUrl || (publicUrl ? url.parse(publicUrl).pathname : '/');
  return ensureSlash(servedUrl, true);
}
const servedPath = getServedPath(resolveApp('package.json'));
const publicPath = servedPath;
const shouldUseRelativeAssetPaths = publicPath === './';
const extractTextPluginOptions = shouldUseRelativeAssetPaths
  ? // Making sure that the publicPath goes back to to build folder.
  { publicPath: new Array(cssFilename.split('/').length).join('../') }
  : {};


module.exports = {
  entry: {
    // 'OutputPath': 'EntryPath',
    'Suggestion': './src/index.js',
    'Demo': './src/demo.js',
    'DemoStyles': './src/assets/DemoStyleLoader.js',
    'SuggestionStyles': './src/Suggestion/StyleLoader.js',
  },
  output: {
    filename: outputFile,
    path: path.resolve(__dirname, '..', 'dist'),
    //library: libraryName,
    //libraryTarget: 'umd',
    //umdNamedDefine: true,
  },
  module:{
    rules: [
      // Support Sass
      {
        test: /\.scss$/,
        loader: ExtractTextPlugin.extract(
          Object.assign({
            fallback: require.resolve('style-loader'),
            use: [
              //{
              //  loader: "style-loader" // creates style nodes from JS strings
              //},
              {
                loader: "css-loader", // translates CSS into CommonJS
                options: {
                  url: false, // disable css image url resolution, use direct copy file instead
                }
              }, {
                loader: require.resolve('postcss-loader'),
                options: {
                  // Necessary for external CSS imports to work
                  // https://github.com/facebookincubator/create-react-app/issues/2677
                  ident: 'postcss',
                  plugins: () => [
                    require('postcss-flexbugs-fixes'),
                    autoprefixer({
                      browsers: [
                        '>1%',
                        'last 4 versions',
                        'Firefox ESR',
                        'not ie < 9', // React doesn't support IE8 anyway
                      ],
                      flexbox: 'no-2009',
                    }),
                  ],
                },
              }, {
                loader: "sass-loader" // compiles Sass to CSS
              },
            ]
          }, extractTextPluginOptions)
        )
      }
      // End Support Sass
    ]
  },
  plugins: [
    //new UglifyJSPlugin()
    new ExtractTextPlugin({
      filename: cssFilename,
    }),
    
    // Copy file
    new CopyWebpackPlugin([
      {
        context: './src/assets/css', // switch context to source css folder (relative to project)
        from: './img', // copy the img + its structure (relative to context)
        to: './css/img', // (relative to outputDir `dist`)
      },
    ], {}),
  ],
};