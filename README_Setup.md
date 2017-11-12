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
