# Introduce
TBW

Features:

* Input delay after 200ms
* Polyfill
* ~~Linter~~

# How to use
TBW:
`id`
`data`

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
This plugin use (~~strikethrough~~ mean this compatible was not investigated):

* Class
* let/const
* ~~spread operator {…} --> Not safe for all browser so we use Object.assign instead~~
* arrow fn
* ~~Promise~~
* Async await
* ~~matches (closest polyfill)~~
* ~~Object assign with polyfill() ~~

### Supported browser
##### Desktop
| Feature       | Chrome | Edge	| Firefox | IE | Opera  | Safari |
| ------------- |-------:| ----:|   -----:| --:|  -----:| -----: |
| Async await   |55	     | Yes	| 52	  | No | 42		|  10.1  |
| Class         |49	     | 13	| 45	  | No | 43		|  9     |
| Const/let		|21		 | Yes	| 36	  | 11 | Yes	|  5.1	 |
| Arrow fn		|45		 | Yes	| 22	  | No | 32		|  10	 |
| Obj.assign()	|45		 | Yes	| 34	  | No | 32		|  9	 |
|---------------|---     |---   |---      |--- |---     |---     |
| ALL(max)      |55	     | 13	| 52	  | No | 43		|  10.1  |

##### Mobile
| Feature       | Android webview | Chrome for Android |  Edge mobile   |Firefox Android| IE    | Opera Android | iOS Safari |
| ------------- |-------:         | ----:              |   -----:       | --:           | -----:| -----:     |---:           |
| Async await   |Yes	          | 55	               |Yes             | 52            |No     | 42         |  10.1         |
| Class         |?	              | Yes	               |13	            | 45			|No		| ?			 |  9			 |
| const/let		|Yes              | Yes	               |Yes	            | 36			|11		| Yes		 |  Yes			 |
| Obj.assign()	|No(has polyfil)  | 45	               |Yes	            | Yes			|No		| No		 |  Yes			 |
|---------------|---|---|---|---|---|---|---|
| ALL           |Yes (? + polyf)  | 55	               |Yes             | 52            |No     | 42(polyfl) |  10.1		 |



