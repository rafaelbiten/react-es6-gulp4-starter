var gulp		= require('gulp');
var args		= require('yargs').argv;
var babelify	= require('babelify');
var browserify	= require('browserify');
var browserSync	= require('browser-sync');
var source		= require('vinyl-source-stream');
var buffer		= require('vinyl-buffer');
var $			= require('gulp-load-plugins')();
var config		= require('./gulp.config.js');

/* SCRIPTS
 * ------------------------------------------------------------------ */

	// js: vendors' bundle
	gulp.task('vendors', function() {
		var stream = browserify({
				debug: false,
				require: config.vendors
			});

		stream
			.bundle()
			.pipe(source('vendors.js'))
			.pipe(buffer())
			.pipe($.uglify())
			.pipe(gulp.dest(config.paths.dist.scripts));

		return stream;
	});

	// js: main bundle
	gulp.task('scripts', function() {
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

		stream
			.transform(babelify)
			.bundle().on('error', errorHandler.bind(this))
			.pipe(source('main.js'))
			.pipe(gulp.dest(config.paths.dist.scripts))
			.pipe(browserSync.reload({stream: true, once: true}));

		return stream;
	});

/* STYLES
 * ------------------------------------------------------------------ */

	gulp.task('styles', function() {
		return gulp.src(config.paths.src.styles + '**/*.scss')
			.pipe($.sourcemaps.init())
			.pipe($.sass().on('error', $.sass.logError))
			.pipe($.autoprefixer(config.autoprefixer))
			.pipe($.sourcemaps.write())

				// run gulp with --prod flag
				.pipe($.if( args.prod, $.combineMq() ))
				.pipe($.if( args.prod, $.minifyCss() ))
				.pipe($.if( args.prod, $.stripCssComments() ))

			.pipe(gulp.dest(config.paths.dist.styles))
			.pipe(browserSync.reload({stream: true}));
	});


/* SERVE
 * ------------------------------------------------------------------ */

	gulp.task('serve', ['vendors', 'scripts', 'styles'], function() {
		browserSync(config.browserSync);
	});

/* WATCH
 * ------------------------------------------------------------------ */

	gulp.task('watch', function() {
		gulp.watch(config.paths.src.styles + '**/*.*', ['styles']);
		gulp.watch(config.paths.src.scripts + '**/*.*', ['scripts']);
	});

/* BUILD
 * ------------------------------------------------------------------ */

	// gulp.task('build', ['vendors', 'scripts', 'styles'], function() {
	// 	// set styles for production
	// 	gulp.src(config.paths.dist.styles + '*.css')
	// 		.pipe($.combineMq())
	// 		.pipe($.minifyCss())
	// 		.pipe($.stripCssComments())
	// 		.pipe(gulp.dest(config.paths.dist.styles));

	// 	// set scripts for production
	// 	gulp.src([	config.paths.dist.scripts + 'vendors.js',
	// 				config.paths.dist.scripts + 'main.js' ])
	// 		.pipe($.concat('all.js'))
	// 		.pipe($.uglify())
	// 		.pipe(gulp.dest(config.paths.dist.scripts));

	// 	// TODO CSS:	combineMq, minifyCSS
	// 	// TODO JS:		concat, minify and gulp-inject on HTML
	// });


/* MAIN TASKS
 * ------------------------------------------------------------------ */

	// default
	gulp.task('default', ['serve', 'watch']);

/**********************************************************************/

/* helper functions */
function errorHandler(error) {
	console.log('Error: ' + error.message);
}
