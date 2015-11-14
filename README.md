# const Starter = ES6 => ES5;
Starter using Gulp 4 and Babel 6. React 0.14 is prepacked as a `dev dependency`.

### Quick Start

1. Clone or download the project and from the root folder run:
	**`$ npm install`** or **`$ sudo npm install`** if the first command fails

2. When it's done installing all dependencies, from the same root folder run:
	**`$ npm run gulp serve`** or **`$ npm run gulp serve -- --prod`** for production

And that should be it.

**Important:** This Starter uses [Gulp 4](https://github.com/gulpjs/gulp/tree/4.0). If you try `$ gulp serve` or `gulp serve --prod` on your `terminal` it won't work unless you have Gulp 4 installed globally on your machine. The command above runs the local version of Gulp installed with `$ npm install`.

### Gulp Tasks
To list all available tasks, use `gulp --tasks-simple`.
To see a tree of all tasks and its dependencies, run `gulp --tasks`

The `serve` task is the only task that's currently being exposed to the user and this task can be modified for production passing the `--prod` flag when running Gulp.

### Important files
- **gulpfile.src**
	- You shouldn't need to touch this file
	- will write proper documentation for this later...

- **gulp-user-config-sample.js**
	- If you like the default user configs, you can ignore this file/step
	- will write proper documentation for this later...

- **base.src**
	- You'll notice that there's no `index` file
	- `base.src` will be compiled into index.[extension]
	- Set name and extension for the `index` file inside `gulp-project-config.js`

### Features

- **SCRIPTS**
ES6/ES2015 to ES5 using [Babel6](https://babeljs.io/) with sourcemaps, preconfigured to use [React](https://facebook.github.io/react/), encorages the use of [ES6 modules](http://www.2ality.com/2014/09/es6-modules-final.html), automatically bundles dev dependencies from package.json into a separate file and supports custom Modernizr.

	- **development:**
	-- watch all files, except vendors' scripts
	- **production with the `--prod` flag:**
	-- [concat](https://www.npmjs.com/package/gulp-concat) and [uglify](https://www.npmjs.com/package/gulp-uglify) scripts into a single file and cache bust it

- **STYLES**
Compiles SCSS to CSS with sourcemaps.

	- **development:**
	-- watch all files
	- **production with the `--prod` flag:**
	-- [autoprefix](https://www.npmjs.com/package/gulp-autoprefixer), [minify](https://www.npmjs.com/package/gulp-sass), [strip comments](https://www.npmjs.com/package/gulp-strip-css-comments), [combines MQ's](https://www.npmjs.com/package/gulp-combine-mq) and cache bust

- **FONTS**
Copy fonts to `dist` folder excluding unnecessary files

- **IMAGES**
Copy images to `dist` folder

	- **development:**
	-- watch folder for new images
	- **production with the `--prod` flag:**
	-- copy images and tries to [reduce](https://www.npmjs.com/package/gulp-imagemin) their sizes

- **SVG**
Creates a single SVG sprite out of the SVGs inside `assets/src/svgs/`. Injects the sprite into the `index` file, right after the opening `<body>` tag. The result is a single **inline SVG**, so no new file or folder is created on the `dist/` folder.
**Usage example:** for a file called `apple.svg` saved inside `assets/src/svgs/`, use something like `<svg class="svg--apple"><use xlink:href="#apple"></use></svg>`.

	- **development:**
	-- watch folder for new or removed SVGs
	- **production with the `--prod` flag:**
	-- creates the sprite and injects it into the index file

----------

#### Installing Gulp 4 globally
You don't need and probably shouldn't install Gulp 4 (or any other Gulp version) globally, but here's how it can be done, for reference:
`$ npm uninstall -g gulp` to uninstall your current Gulp version
`$ npm install -g gulpjs/gulp.git#4.0` to install Gulp 4 CLI globally

**note:** you probably need to `sudo` any command that's using the `-g` flag.

#### TODO
- Account for a `views` folder;
- Image sprites...
- What else?
