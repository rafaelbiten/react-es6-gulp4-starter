var gulp		= require('gulp');
var babelify	= require('babelify');
var browserify	= require('browserify');
var bsync		= require('browser-sync');
var production	= require('yargs').argv.prod;
var source		= require('vinyl-source-stream');
var buffer		= require('vinyl-buffer');
var $			= require('gulp-load-plugins')();

var config		= require('./gulp-config.js');

/* STYLES TASKS
 * ------------------------------------------------------------------ */

var styles = {
	main: function styles() {
		return gulp.src(config.paths.src.styles + '**/*.scss')
			.pipe($.if( config.sourcemaps.styles, $.sourcemaps.init() ))
			.pipe($.sass().on('error', $.sass.logError))
			.pipe($.autoprefixer(config.autoprefixer))
			.pipe($.if( config.sourcemaps.styles, $.sourcemaps.write() ))

					// run gulp with --prod flag
					.pipe($.if( production, $.combineMq() ))
					.pipe($.if( production, $.minifyCss() ))
					.pipe($.if( production, $.stripCssComments() ))

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
			.pipe($.uglify())
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
	concat: function concat() {
		if (!production) { return false; }

		var source = gulp.src([
				config.paths.dist.scripts + 'vendors.js',
				config.paths.dist.scripts + 'main.js'
			]);

		return source
			.pipe($.concat('app.min.js'))
			.pipe($.uglify())
			.pipe(gulp.dest(config.paths.dist.scripts));
	}
};

function watch() {
	gulp.watch(config.paths.src.styles + '**/*.scss', styles.main);
	gulp.watch(config.paths.src.scripts + '**/*.*', scripts.main);
}

function browserSync() {
	bsync.init(config.browserSync);
}

gulp.task('serve', gulp.series(
	gulp.parallel(scripts.vendors, scripts.main, styles.main),
	gulp.parallel(browserSync, watch)
));

gulp.task(watch);

gulp.task('build', gulp.series(
	gulp.parallel(scripts.vendors, scripts.main),
	scripts.concat
));

/* helper functions */
function errorHandler(error) {
	console.log('Error: ' + error.message);
}

