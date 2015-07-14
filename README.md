# es6_( babel react )_starter
#### Starter kit features:

- **Scripts**
	- Transpiles ES6 (aka ES2015) to ES5 with [Babel](https://babeljs.io) / [Babelify](https://www.npmjs.com/package/babelify)
	- Since [Babel :heart: React](http://babeljs.io/blog/2015/02/23/babel-loves-react/), this **Starter** is also 'React friendly'
	- Encorages the use of [ES6 modules](http://www.2ality.com/2014/09/es6-modules-final.html) and `import` to 'modularize' scripts
	- Vendors scripts are loaded directly from package.json
	- Supports custom Modernizr, loaded by default inside the `<head>` tag
	- For development, separates vendors on its own file to speed up watch process
	- For production, concatenates all scripts into one and minifies/uglifies it
	- For production, 'cache bust' the file
- **Styles**
	- Uses SCSS for styles and compiles it into CSS with support for sourcemaps
	- For production, autoprefixes, minifies, strip comments and combines MQ's
	- For production, 'cache bust' the file
- **Fonts**
	- Copy fonts to dist folder removing all unnecessary files
- **Images**
	- For development, only copy 'new' images and watch folder for new images
	- For production, will copy all images while reducing image sizes
- **Sprites**
	- TODO...
- **SVG**
	- TODO...
- **Watchers**
	- *For development only*
	- For now will watch for changes on styles, scripts, images and base.src file

------

#### Important files:
- **gulpfile.src**
	- You shouldn't need to touch this file
	- right proper documentation for this...
- **gulp-user-config-sample.js**
	- If you like the default user configs, you can ignore this file/step
	- right proper documentation for this...
- **base.src**
	- You'll notice that there's no index.[html, php, php.twig] file
	- `base.src` will be compiled into your base.[extension]
	- Config paths.base inside `gulp-project-config.js` with your base file

------

#### Getting Started:

#### Gulp 4
This starter uses Gulp 4. To install it globally, uninstall your current version of Gulp
with ``` $ npm uninstall -g gulp ``` and install the new Gulp 4 CLI globally with
``` $ npm install -g gulpjs/gulp.git#4.0 ```.

**note:** you may need to `sudo` any command that's using the `-g` flag.


If you don't want to mess with your current version of Gulp, no problem. Just do a
``` $ npm install ``` to install all dependencies and use your local version of Gulp with
``` $ npm run gulp {task-name} ```.

To list all available tasks, use ``` gulp --tasks-simple ```.
To see a tree of all tasks and its dependencies, run ``` gulp --tasks ```

#### Gulp Tasks

If you list all tasks now you may get frustrated because there's really only one task that's being exposed to the user and I do believe this might be all you need.

The exposed task is the 'Serve' tasks that can be run with `gulp serve`.
This task also accepts a `--prod` flag that will change its behaviour and prepare everything for production.
To run the 'Serve' task passing the flag, use `$ gulp serve --prod`, or `$ npm run gulp serve -- --prod` if you're using your local version of Gulp.

#### TODO
- Account for a `views` folder;
- Take care of sprites, svgs, etc...
- What else?
