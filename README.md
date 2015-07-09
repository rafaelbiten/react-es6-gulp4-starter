# es6_( babel react )_starter
#### Starter kit features:

- Transpiles ES6 (ES2015) to ES5 with [Babel](https://babeljs.io) / [Babelify](https://www.npmjs.com/package/babelify);
- Since [Babel :heart: React](http://babeljs.io/blog/2015/02/23/babel-loves-react/), this **Starter** is also 'React friendly';
- Encorages the use of [ES6 modules](http://www.2ality.com/2014/09/es6-modules-final.html) to 'modularize' scripts;
- Vendors scripts are loaded directly from package.json;
- Uses SCSS for styles and compiles it into CSS;
- Autoprefixes the styles and combines its media queries;
- For now it only watches for styles and scripts changes;

------

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

#### TODO
- Write a proper README file explaining everything that's already working;
- Implements a complete build process (and inject final files into the base template);
- Account for a `views` folder;
- Watch for changes on base template / views;
- Take care of images, svgs, etc...
- What else?
