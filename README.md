# Introduction
My journey to create a javascript static site app using typescript, babylonjs and webpack.

demo [here](https://mizux.github.io/babylonjs-101/)

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

# Add Install Babylonjs
Now, it's time to install babylonJS engine. 
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

index.html:
```html
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml">
	<head>
		<meta charset="UTF-8">
		<title>Local Development</title>
		<script src="https://code.jquery.com/pep/0.4.2/pep.min.js"></script>
		<style>
html, body {
	width: 100%;
	height: 100%;
	padding: 0;
	margin: 0;
	overflow: hidden;
}

#renderCanvas {
	width: 100%;
	height: 100%;
	display: block;
	font-size: 0;
}
		</style>
	</head>
	<body>
		<canvas id="renderCanvas" touch-action="none"></canvas>
		<script src="dist/bundle.js"></script>
	</body>
</html>
```

src/index.ts:
```ts
import {
  Engine,
  Scene,
  FreeCamera,
  HemisphericLight,
  Vector3,
  Color3,
  Color4,
  Mesh
} from "@babylonjs/core";

import {
  GridMaterial
} from "@babylonjs/materials";

// Required side effects to populate the Create methods on the mesh class. Without this, the bundle would be smaller but the createXXX methods from mesh would not be accessible.
import "@babylonjs/core/Meshes/meshBuilder";

// Get the canvas element from the DOM.
const canvas = document.getElementById("renderCanvas") as HTMLCanvasElement;

// Associate a Babylon Engine to it.
const engine = new Engine(canvas);

// Create our first scene.
var scene = new Scene(engine);
// Use direct coordinate, with Y-axis up.
scene.useRightHandedSystem = true;
scene.clearColor = new Color4(0.2, 0.2, 0.2, 1.0);

// This creates and positions a free camera (non-mesh)
var camera = new FreeCamera("camera1", new Vector3(0, 5, 10), scene);
// This targets the camera to scene origin
camera.setTarget(Vector3.Zero());
// This attaches the camera to the canvas
camera.attachControl(canvas, true);

// This creates a light, aiming 0,1,0 - to the sky (non-mesh)
var light = new HemisphericLight("light1", new Vector3(0, 1, 0), scene);
// Default intensity is 1. Let's dim the light a small amount
light.intensity = 0.7;

// Create a grid material
var material = new GridMaterial("grid", scene);

// Our built-in 'sphere' shape. Params: name, subdivs, size, scene
var sphere = Mesh.CreateSphere(/*name=*/"sphere1", 16, 2, scene);
// Move the sphere upward 1/2 its height
sphere.position.y = 2;
// Affect a material
sphere.material = material;

// Our built-in 'ground' shape. Params: name, width, depth, subdivs, scene
var ground = Mesh.CreateGround("ground1", 6, 6, 2, scene);
// Affect a material
ground.material = material;

// Render every frame
engine.runRenderLoop(() => {
  scene.render();
});
```
