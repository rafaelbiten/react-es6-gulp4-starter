var gulp		= require('gulp');
var babelify	= require('babelify');
var browserify	= require('browserify');
var bsync		= require('browser-sync');
var production	= require('yargs').argv.prod;
var source		= require('vinyl-source-stream');
var buffer		= require('vinyl-buffer');
var del			= require('del');
var $			= require('gulp-load-plugins')();

var cacheBuster = '?v=' + Math.round(new Date().getTime() / 1000);

var config;
	try { config = require('./gulp-user-config.js'); }
	catch (e) { config = require('./gulp-project-config.js'); } // e.code === MODULE_NOT_FOUND


/* BASE TASKS
 * ------------------------------------------------------------------ */

var base = {
	scaffold: function scaffold() {
		return gulp.src(config.paths.source, { base: './' })

			// normal flow, with vendors and main
			// in two different files to speed up the task
			.pipe( $.if( !production, $.htmlReplace({
				'styles': config.paths.dist.styles + 'main.css',
				'scripts': [
					config.paths.dist.scripts + 'vendors.js',
					config.paths.dist.scripts + 'main.js'
				],
				'modernizr': config.paths.dist.scripts + 'modernizr.js'
			}) ))

			// run gulp with --prod flag to use minified versions
			.pipe( $.if( production, $.htmlReplace({
				'styles': config.paths.dist.styles + 'styles.min.css' + cacheBuster,
				'scripts': config.paths.dist.scripts + 'scripts.min.js' + cacheBuster,
				'modernizr': config.paths.dist.scripts + 'modernizr.js'
			})))

			// base.src becomes index.{extension} - config.path.source
			.pipe($.rename(config.paths.base))
			.pipe(gulp.dest('.'));
	},
	clean: function clean(done) {
		if (!production) { done(); return; }

		del([
			config.paths.dist.scripts + 'main.js',
			config.paths.dist.scripts + 'vendors.js',

			'!' + config.paths.dist.scripts + 'scripts.min.js',
			'!' + config.paths.dist.scripts + 'modernizr.js'
		]);

		done();
	},
	watch: function watch() {
		if(!production) {
			gulp.watch(config.paths.src.styles + '**/*.*', styles.main);
			gulp.watch(config.paths.src.scripts + '**/*.*', scripts.main);
		}
	},
	browserSync: function browserSync() {
		bsync.init(config.browserSync);
	}
};


/* STYLES TASK
 * ------------------------------------------------------------------ */

var styles = {
	main: function styles() {
		return gulp.src(config.paths.src.styles + '**/*.scss')
			.pipe($.if( config.sourcemaps.styles, $.sourcemaps.init() ))
			.pipe($.sass().on('error', $.sass.logError))
			.pipe($.autoprefixer(config.autoprefixer))
			.pipe($.if( config.sourcemaps.styles, $.sourcemaps.write() ))

					// run gulp with --prod flag
					.pipe($.if( production, $.combineMq(config.combineMq) ))
					.pipe($.if( production, $.minifyCss() ))
					.pipe($.if( production, $.stripCssComments() ))
					.pipe($.if( production, $.rename('styles.min.css') ))

			.pipe(gulp.dest(config.paths.dist.styles))
			.pipe(bsync.reload({stream: true}));
		}
};


/* SCRIPTS TASKS
 * ------------------------------------------------------------------ */

var scripts = {
	vendors: function vendors() {
		var stream = browserify({
				debug: false,
				require: config.vendors
			});

		return stream
			.bundle()
			.pipe(source('vendors.js'))
			.pipe(buffer())
			.pipe($.if( production, $.uglify(config.uglify) ))
			.pipe(gulp.dest(config.paths.dist.scripts));
	},
	main: function scripts() {
		var stream = browserify({
				fullPaths: false,
				entries: 'assets/src/scripts/main.js',
				debug: config.sourcemaps.scripts,
				extensions: config.extensions
			});

		// references to the vendors' bundle
		config.vendors.forEach(function(vendor) {
			stream.external(vendor);
		});

		return stream
			.transform(babelify)
			.bundle().on('error', errorHandler.bind(this))
			.pipe(source('main.js'))
			.pipe(gulp.dest(config.paths.dist.scripts))
			.pipe(bsync.reload({stream: true, once: true}));
	},
	concat: function concat(done) {
		if (!production) { done(); return; }

		var source = gulp.src([
				config.paths.dist.scripts + 'vendors.js',
				config.paths.dist.scripts + 'main.js'
			]);

		return source
			.pipe($.concat('scripts.min.js'))
			.pipe($.uglify(config.uglify))
			.pipe(gulp.dest(config.paths.dist.scripts));
	},
	modernizr: function modernizr(done) {
		if (!config.paths.src.modernizr) { done(); return; }

		return gulp.src(config.paths.src.modernizr + '*.js')
			.pipe($.if( production, $.uglify(config.uglify) ))
			.pipe(gulp.dest(config.paths.dist.scripts));
	}
};

/* FONTS TASK
 * ------------------------------------------------------------------ */


/* IMAGES TASK
 * ------------------------------------------------------------------ */


/* SPRITES TASKS
 * ------------------------------------------------------------------ */


/* SVG TASK
 * ------------------------------------------------------------------ */


gulp.task('serve',
	gulp.series(
		gulp.parallel(
			base.scaffold,

			scripts.modernizr,
			scripts.vendors,
			scripts.main,

			styles.main
		),

		scripts.concat,

		gulp.parallel(
			base.browserSync,
			base.watch,
			base.clean
		)
));

/* helper functions */
function errorHandler(error) {
	console.log('Error: ' + error.message);
}
