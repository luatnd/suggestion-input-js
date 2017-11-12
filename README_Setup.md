# Setup this dev kit

```
npm init
# Fill the info

# Add webpack
yarn add --dev webpack

# Add test support: babel-preset-env will support test ES6 syntax
yarn add --dev jest babel-preset-env
```

package.json
```
  "babel": {
    "presets": [
      "env"
    ]
  }
```

Sass support:
Disable image url resolution, use image url instead.
So that we need copy-webpack-plugin to copy file from `src` to `dist`
```
# Add sass + misc support
yarn add --dev extract-text-webpack-plugin style-loader css-loader sass-loader node-sass postcss-loader postcss-flexbugs-fixes autoprefixer
yarn add --dev copy-webpack-plugin
```
