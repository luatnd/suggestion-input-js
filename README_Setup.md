# Setup this dev kit

```
npm init
# Fill the info

# Add webpack
yarn add --dev webpack

# Add test support: babel-preset-env will support test ES6 syntax
yarn add --dev jest babel-preset-env

# Add sass + misc support
yarn add --dev extract-text-webpack-plugin style-loader css-loader sass-loader node-sass postcss-loader postcss-flexbugs-fixes autoprefixer
```

package.json
```
  "babel": {
    "presets": [
      "env"
    ]
  }
```
