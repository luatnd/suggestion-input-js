# Introduce
A pure JS plugin which transform input into a suggestion-able input.
Support keyboard, mouse, history.

# How to use
TBW:
`id`
`data`

# API
TBR

# Development

Features:

* Input delay after 200ms
* Polyfill
* Test
* ~~Linter~~

First, install dev dependency, webpack ...
```
# Install dev dependency
yarn install
```

Modify the source code in `src/`.
Turn on development:
```
yarn watch
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


# Compatible
### Specs
This plugin use (~~strikethrough~~ mean this compatible was not investigated):

* Class
* let/const
* arrow fn
* ~~Object assign with polyfill() ~~
* ~~spread operator {…} --> Not safe for all browser so we use Object.assign instead~~
* ~~Promise  --> Haven't used any Promise in this project~~
* ~~Async await  --> Haven't used any Promise in this project~~
* ~~matches (closest polyfill)~~

### Supported browser
##### Desktop
| Feature       | Chrome | Edge	| Firefox | IE | Opera  | Safari |
| ------------- |-------:| ----:|   -----:| --:|  -----:| -----: |
| Class         |49	     | 13	| 45	  | No | 43		|  9     |
| Const/let		|21		 | Yes	| 36	  | 11 | Yes	|  5.1	 |
| Arrow fn		|45		 | Yes	| 22	  | No | 32		|  10	 |
| Obj.assign()	|45		 | Yes	| 34	  | No | 32		|  9	 |
| matches()		|34		 | Yes	| 34	  | No | 21		|  7.1	 |
|---------------|---     |---   |---      |--- |---     |---     |
| ALL(max)      |55	     | 13	| 52	  | No | 43		|  10.1  |

##### Mobile
| Feature       | Android webview | Chrome for Android |  Edge mobile   |Firefox Android| IE    | Opera Android | iOS Safari |
| ------------- |-------:         | ----:              |   -----:       | --:           | -----:| -----:     |---:           |
| Class         |?	              | Yes	               |13	            | 45			|No		| ?			 |  9			 |
| const/let		|Yes              | Yes	               |Yes	            | 36			|11		| Yes		 |  Yes			 |
| Arrow fn		|45               | 45	               |Yes	            | 22			|No		| 32		 |  10			 |
| Obj.assign()	|No(has polyfil)  | 45	               |Yes	            | Yes			|No		| No		 |  Yes			 |
| matches()		|?  			  | Yes	               |Yes	            | ?				|?		| ?		 	 |  8			 |
|---------------|---|---|---|---|---|---|---|
| ALL           |Yes (? + polyf)  | 45	               |Yes             | 45            |No     | 42(polyfl) |  10		 	 |



