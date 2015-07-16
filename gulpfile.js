var gulp		= require('gulp');
var babelify	= require('babelify');
var browserify	= require('browserify');
var bsync		= require('browser-sync');
var production	= require('yargs').argv.prod;
var source		= require('vinyl-source-stream');
var buffer		= require('vinyl-buffer');
var del			= require('del');
var $			= require('gulp-load-plugins')();

var bsyncReload	= bsync.reload;
var cacheBuster = '?v=' + Math.round(new Date().getTime() / 1000);

var config;
	try { config = require('./gulp-user-config.js'); }
	catch (e) { config = require('./gulp-project-config.js'); } // e.code === MODULE_NOT_FOUND

var paths = config.paths;

/* BASE TASKS
 * ------------------------------------------------------------------ */

var base = {
	scaffold: function scaffold() {
		return gulp.src(paths.source, { base: './' })

			// normal flow, with vendors and main
			// in two different files to speed up the task
			.pipe( $.if( !production, $.htmlReplace({
				'styles': paths.dist.styles + 'main.css',
				'scripts': [
					paths.dist.scripts + 'vendors.js',
					paths.dist.scripts + 'main.js'
				],
				'modernizr': paths.dist.scripts + 'modernizr.js'
			}) ))

			// run gulp with --prod flag to use minified versions
			.pipe( $.if( production, $.htmlReplace({
				'styles': paths.dist.styles + 'styles.min.css' + cacheBuster,
				'scripts': paths.dist.scripts + 'scripts.min.js' + cacheBuster,
				'modernizr': paths.dist.scripts + 'modernizr.js'
			})))

			// base.src becomes index.{extension} - config.path.source
			.pipe($.rename(paths.base))
			.pipe(gulp.dest('.'));
	},
	clean: {
		pre: function cleanBefore(done) {
			if (!production) { done(); return; }
			del(paths.dist.root);
			done();
		},
		post: function cleanAfter(done) {
			if (!production) { done(); return; }

			del([
				paths.dist.scripts + 'main.js',
				paths.dist.scripts + 'vendors.js',

				'!' + paths.dist.scripts + 'scripts.min.js',
				'!' + paths.dist.scripts + 'modernizr.js'
			]);

			done();
		}
	},
	watch: function watch() {
		if(!production) {
			gulp.watch(paths.source, gulp.series(
				base.scaffold,
				base.reload
			));

			gulp.watch(paths.src.styles + '**/*', styles.main);
			gulp.watch(paths.src.scripts + '**/*', scripts.main);
			gulp.watch(paths.src.images + '**/*', images.main);
		}
	},
	browserSync: function browserSync() {
		bsync.init(config.browserSync);
	},
	reload: function reload() {
		if(!production) { bsyncReload(); }
	}
};


/* STYLES TASK
 * ------------------------------------------------------------------ */

var styles = {
	main: function styles() {
		return gulp.src(paths.src.styles + '**/*.scss')
			.pipe($.if( config.sourcemaps.styles, $.sourcemaps.init() ))
			.pipe($.sass().on('error', $.sass.logError))
			.pipe($.autoprefixer(config.autoprefixer))
			.pipe($.if( config.sourcemaps.styles, $.sourcemaps.write() ))

					// run gulp with --prod flag
					.pipe($.if( production, $.combineMq(config.combineMq) ))
					.pipe($.if( production, $.minifyCss() ))
					.pipe($.if( production, $.stripCssComments() ))
					.pipe($.if( production, $.rename('styles.min.css') ))

			.pipe(gulp.dest(paths.dist.styles))
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
			.pipe(gulp.dest(paths.dist.scripts));
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
			.pipe(gulp.dest(paths.dist.scripts))
			.pipe(bsync.reload({stream: true, once: true}));
	},
	concat: function concat(done) {
		if (!production) { done(); return; }

		var source = gulp.src([
				paths.dist.scripts + 'vendors.js',
				paths.dist.scripts + 'main.js'
			]);

		return source
			.pipe($.concat('scripts.min.js'))
			.pipe($.uglify(config.uglify))
			.pipe(gulp.dest(paths.dist.scripts));
	},
	modernizr: function modernizr(done) {
		if (!paths.src.modernizr) { done(); return; }

		return gulp.src(paths.src.modernizr + '*.js')
			.pipe($.if( production, $.uglify(config.uglify) ))
			.pipe(gulp.dest(paths.dist.scripts));
	}
};

/* FONTS TASK
 * ------------------------------------------------------------------ */
var fonts = {
	main: function fonts() {
		return gulp.src(paths.src.fonts + '**/*.{eot,svg,ttf,woff,woff2}')
			.pipe(gulp.dest(paths.dist.fonts));
	}
}

/* IMAGES TASK
 * ------------------------------------------------------------------ */
var images = {
	main: function images() {
		return gulp.src(paths.src.images + '**/*')
			.pipe($.changed(paths.dist.images))
			.pipe($.if( production, $.imagemin(config.imagemin) ))
			.pipe(gulp.dest(paths.dist.images));
	}
}

/* SPRITES TASKS
 * ------------------------------------------------------------------ */
var svgs = {
	main: function svgs() {
		return gulp.src(paths.src.svgs + '**/*')
			.pipe($.svgSprite(config.svgs))
			.pipe(gulp.dest(paths.dist.svgs));
	}
}

/* SVG TASK
 * ------------------------------------------------------------------ */


gulp.task('serve',
	gulp.series(
		base.clean.pre,
		base.scaffold,

		gulp.parallel(
			fonts.main,
			images.main,
			svgs.main,

			styles.main,
			scripts.vendors,
			scripts.modernizr,
			scripts.main
		),

		scripts.concat,

		gulp.parallel(
			base.browserSync,
			base.watch,
			base.clean.post
		)
));

/* helper functions */
function errorHandler(error) {
	console.log('Error: ' + error.message);
}
