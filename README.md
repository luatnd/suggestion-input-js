# Introduce
A pure JS plugin which transform input into a suggestion-able input.
Support keyboard, mouse, history.

# How to use
### Quickstart

1. Basic HTML input element with `data-sg-id`
    ```html
    <link rel="stylesheet" href="../dist/css/SuggestionStyles.css">
    <script src="../dist/Suggestion.js" defer></script>

    <form>
        <input data-sg-id="sg-appstore-top-free1">
        <input data-sg-id="sg-appstore-top-paid1">
        <input data-sg-id="sg-appstore-top-paid2">

        <button class="submit-btn btn btn-info">Submit</button>
    </form>
    ```

2. Init plugin by JS:

    ```html
    <script>
      window.addEventListener('DOMContentLoaded', function () {
        // Run this script after defer script was executed
        const sgInstanceAppstoreTopFree1 = new Suggestion('sg-appstore-top-free1');
        const sgInstanceAppstoreTopPaid1 = new Suggestion('sg-appstore-top-paid1');
        const sgInstanceAppstoreTopPaid2 = new Suggestion('sg-appstore-top-paid2');
      });
    </script>
    ```
Done.

### Specs
##### Attr
`data-sg-id`: The suggestion plugin ID, each Suggestion instance have 1 unique ID. You must define it as an attr of `<input/>`

##### JS constructor
```js
constructor(
    id: string,
    data: {
        [key:string]: {
            id: string, // Same value as `key`,
            icon: string, // Image url
            name: string, // Item title --> OMG
        }
    },
    option = {
        debug: boolean, // default is false
        searchDelay: int, // default is 200
    }
)
```
| Attr			| Required	| Description	| Default |
| ------------- |-------	|  ----			|   ----- |
| id			| Required	| Value of `data-sg-id`	     | |
| data			| Required	| Initial data of suggestion | |
| option		| Optional	| Some options: `debug`=true will turn on the console.log to debug. `searchDelay` is the debounce time in ms, ensure your plugin will trigger search every `n`ms. |debug: false, searchDelay: 200|


# Development

NOTE:
> * This plugin use no dependency library in production.
> * You can use `<script src="./src/index.js" type="module"></script> ` if your browser support modules.
> * This plugin use `webpack` to concat all JS file into bundle file for older browser. But no transpile was made. You can see the `./dist` folder to see the source code are no different from the `./src` folder.
> * Use Sass for preprocess CSS


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



