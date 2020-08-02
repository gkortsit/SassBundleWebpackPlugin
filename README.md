
# SassBundleWebpackPlugin
Webpack plugin that lets you bundle SASS/SCSS files into one file

## Getting Started

First install the package

```js
$ npm install --save-dev sass-bundle-webpack-plugin
```

## Usage in webpack.config.js

Require the module at the top of file

```js
const SassBundleWebpackPlugin = require('sass-bundle-webpack-plugin');
```

You will also need to require `path`
```js
const path = require("path");
```

Insert a new instance of the plugin inside the plugins array

### Example:

```js
plugins: [
	new SassBundleWebpackPlugin({
		file: path.join(__dirname, 'src/index.sass'),
		type: 'sass',
		output: {
			name: 'global'
		}
	}),
],
```

This reads all the `@imports` specified inside `src/index.sass` and bundles them into one file at the `dist` folder as `global.sass`.

## Options

### `file`

Type:  `String`

The path to the main SASS/SCSS file. This needs to be the main SASS/SCSS files where all the `@imports` are specified. The plugin will read the `@imports` and bundle the contents of the files specified. It will not read any style rules inside this file.

```js
file: path.join(__dirname, 'src/index.sass')
```

### `type`

Type:  `String`

The extension of the files. Use either `'sass'` or `'scss'`.

```js
type:  'sass'
```

### `output`

Type:  `Object`

Specify output options. Currently only supports `name`

```js
output: {}
```

### `output.name`

Type:  `String`

The name of the final compiled file.

```js
output: { name:  'global' }
```