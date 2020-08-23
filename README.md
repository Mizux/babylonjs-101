![CI](https://github.com/Mizux/babylonjs-101/workflows/CI/badge.svg)

# Introduction
My journey to create a javascript static site app using typescript, babylonjs and webpack.

# Host Setup
In your `.rc` you can add these line to have *user* global install:
```sh
# NodeJS
# see: http://npm.github.io/installation-setup-docs/installing/a-note-on-permissions.html
export NPM_CONFIG_PREFIX=${HOME}/.npm-global
export PATH=${NPM_CONFIG_PREFIX}/bin:${PATH}
```

First you must have installed on your system:
* `nodejs`,
* `npm`
* [`yarn`]

note: For `yarn` you can also install it using `npm install -g yarn`

# Creating a New project
Install few dependencies:
```sh
mkdir -p <.../project>
cd <.../project>
npm init
```

ref: https://docs.npmjs.com/creating-a-package-json-file

# Install Typescript
```sh
npm install --save-dev typescript
```
or
```sh
yarn add --dev typescript
```

then we can create a default config using:
```sh
npx tsc --init
```

Update Typescript config `tsconfig.json`:
```json
{
  "compilerOptions": {
    "target": "es2020",
    "module": "commonjs",
    "strict": true,
    "outDir": "dist",
    "sourceMap": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true
  }
}
```

note: `ES6 == ES2015`.  
ref: https://www.typescriptlang.org/docs/home.html

# Add Webpack
We need to add webpack and few loaders.  
First we install webpack:
```sh
npm install --save-dev webpack webpack-cli webpack-dev-server
```

We'll need to add a `webpack.config.js` to bundle our app.
```js
'use strict';
const path = require('path');

module.exports = {
  mode: 'none',
	devtool: 'inline-source-map',
  devServer: {
    port: 8080,
    contentBase: ['.'],
    inline: true,
    hot: true,
    historyApiFallback: true,
    noInfo: true
  },
  entry: './src/index.ts',
  output: {
    path: path.resolve(__dirname, './dist'),
    filename: 'bundle.js'
  },
  module: {
    rules: []
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js']
  },
  performance: {
    hints: false
  }
};
```

Add few script to `package.json`:
```json
  "scripts": {
    "build": "webpack --mode production",
    "start": "webpack-dev-server --mode development --progress --color"
  },
```

ref: https://webpack.js.org/concepts/

## Generate index.html
To generate the `index.html` we can use the HtmlWebpackPlugin:
```sh
npm install --save-dev html-webpack-plugin
```

Then in `webpack.config.js`:
```js
// Creates index.html file.
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  ...
  plugins: [
    new HtmlWebpackPlugin({
      title: 'Output Management',
    }),
  ],
```

ref: https://webpack.js.org/guides/output-management/#setting-up-htmlwebpackplugin

## Typescript Loader
Then you need to install typescript loader:
```sh
npm install --save-dev ts-loader
```

Then you need to add a new **rule** to `webpack.config.js`:
```js
module: {
  rules: [
    {
      test: /\.tsx?$/,
      loader: 'ts-loader',
      exclude: /node_modules/
    },
```

ref: https://www.npmjs.com/package/ts-loader#examples

## CSS Loader
```sh
npm install --save-dev css-loader style-loader
```
First you'll need to install `css-loader` to transform CSS to a JS module.  
Then you'll need to install `style-loader` to inject the JS module
into a `<style>` tag at runtime.

You also need to add a new rule to `webpack.config.js`:
```js
module: {
  rules: [
    {
      test: /\.css$/,
      use: ['style-loader', 'css-loader'],
    },
```

Then now in any typescript file, you can simply use:
```ts
import 'relative/path/to/file.css';
```

ref: https://webpack.js.org/loaders/css-loader/
ref: https://webpack.js.org/loaders/style-loader/

To investiate...
ref: https://github.com/seek-oss/css-modules-typescript-loader
ref: https://github.com/Jimdo/typings-for-css-modules-loader

## File Loader
NOT TESTED YET !
```sh
npm install --save-dev file-loader
```

Then you need to add a new rule to `webpack.config.js`:
```js
module: {
  rules: [
    {
      test: /\.(png|jpg|gif|svg)$/,
      loader: 'file-loader',
      options: {
        name: '[name].[ext]?[hash]'
      }
    },
```

## Cleanup dist
To keep dist directory clean you should use the CleanWebpackPlugin:
```sh
npm install --save-dev clean-webpack-plugin
```

Then in `webpack.config.js`:
```js
// Cleans dist folder.
const CleanWebpackPlugin = require('clean-webpack-plugin');

module.exports = {
  ...
  plugins: [
    new CleanWebpackPlugin(),
  ],
```

ref: https://webpack.js.org/guides/output-management/#cleaning-up-the-dist-folder

# Add BabylonJS
Now, it's time to install BabylonJS engine.
```sh
npm install --save-dev @babylonjs/core @babylonjs/materials
```

ref: https://doc.babylonjs.com/

# Directory layout
Next, we'll scaffold our project in the following way:
```
project/
├─ dist/
└─ src/
   └─ index.ts
```

[src/index.ts](src/index.ts)
