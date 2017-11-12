# Introduce
TBR

# How to use
TBR

# API
TBR

# Development
First, install dev dependency, webpack ...
```
# Install dev dependency
yarn install
```

Modify the source code in `src/`.
Turn on development:
```
```

```
# Merge all JS source to bundle.js
yarn bundle

# Build minimized production version
yarn build
```

Test:
```
# Test all
yarn test

# Test 1 file only
yarn jest test/Suggestion/Suggestion.test.js
yarn test test/Suggestion/Suggestion.test.js
```


# Compatible (DRAFT - not completed)
### Specs
This plugin use:

* spread operator {…} : safe for all major
* arrow fn: safe for all major
* Promise: safe for all major
* Async await: safe for all major

### Supported browser
##### Desktop
| Feature       | Chrome | Edge	| Firefox | IE | Opera | Safari |
| ------------- |-------:| ----:|   -----:| --:| -----:| -----: |
| Async await   |55	     | Yes	| 52	  | No | 42	   |  10.1  |
|---------------|---     |---   |---      |--- |---    |---     |
| ALL           |55	     | Yes	| 52	  | No | 42	   |  10.1  |

##### Mobile
| Feature       | Android webview | Chrome for Android |  Edge mobile   |Firefox Android| IE    | iOS Safari | Opera Android |
| ------------- |-------:         | ----:              |   -----:       | --:           | -----:| -----:     |---:           |
| Async await   |Yes	          | 55	               |Yes             | 52            |No     | 42         |  10.1         |
|---------------|---|---|---|---|---|---|---|
| ALL           |Yes	          | 55	               |Yes             | 52            |No     | 42         |  10.1         |



