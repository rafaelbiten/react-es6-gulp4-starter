var production	= require('yargs').argv.prod;
if (production) { process.env.NODE_ENV = 'production'; }

var gulp		= require('gulp');
var babelify	= require('babelify');
var browserify	= require('browserify');
var bsync		= require('browser-sync');
var source		= require('vinyl-source-stream');
var buffer		= require('vinyl-buffer');
var del			= require('del');
var $			= require('gulp-load-plugins')();

var config;
	try { config = require('./gulp-user-config.js'); }
	catch (e) { config = require('./gulp-project-config.js'); } // e.code === MODULE_NOT_FOUND

var paths		= config.paths;
var bsyncReload	= bsync.reload;
var cacheBuster = '?v=' + Math.round(new Date().getTime() / 1000);


/* INTERFACE / USE
 * ------------------------------------------------------------------ */
gulp.task('serve',
	gulp.series(
		gulp.parallel(
			timerInit,
			cleanBefore,
			svgSprite
		),
		scaffold,
		gulp.parallel(
			fonts,
			images,
			styles,
			vendors,
			modernizr,
			scripts
		),
		concat,
		gulp.parallel(
			browserSync,
			watch,
			cleanAfter,
			timerEnd
		)
));


/* IMPLEMENTATION
 * ------------------------------------------------------------------ */

// Scaffold: -------------------------------------------- ** /
// global: by default, will turn base.src into index.html
// development: inject main.css, vendors.js, main.js, modernizr.js and svg sprites
// production: inject styles.min.css, scripts.min.js, modernizr.js and svg sprites
// production: cacheBust styles.min.css and scripts.min.js
function scaffold() {
	return gulp.src(paths.source, { base: './' })

		// development: vendors.js and main.js
		// in different files to speed up workflow
		.pipe( $.if( !production, $.htmlReplace({
			styles: paths.dist.styles + 'main.css',
			scripts: [
				paths.dist.scripts + 'vendors.js',
				paths.dist.scripts + 'main.js'
			],
			modernizr: paths.dist.scripts + 'modernizr.js',
			svgs: config.svgs.sprite ? { src: config.svgs.sprite, tpl: '%s' } : ''
		})))

		// production
		// minify and cacheBust
		.pipe( $.if( production, $.htmlReplace({
			styles: paths.dist.styles + 'styles.min.css' + cacheBuster,
			scripts: paths.dist.scripts + 'scripts.min.js' + cacheBuster,
			modernizr: paths.dist.scripts + 'modernizr.js',
			svgs: config.svgs.sprite ? { src: config.svgs.sprite, tpl: '%s' } : ''
		})))

		// base.src becomes index.{extension} - config.path.source
		.pipe($.rename(paths.base))
		.pipe(gulp.dest('.'));
}


// Styles -------------------------------------------- ** /
// global: autoprefixer
// production: combine media queries, minify and strip comments
function styles() {
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


// Scripts: vendors -------------------------------------------- ** /
// production: minify
function vendors() {
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
}


// Scripts -------------------------------------------- ** /
// global: bundles main.js while referencing external dependencies (vendors)
function scripts() {
	var stream = browserify({
			fullPaths: false,
			entries: paths.src.scripts + 'main.js',
			debug: config.sourcemaps.scripts,
			extensions: config.extensions
		});

	// references to the vendors' bundle
	config.vendors.forEach(function(vendor) {
		stream.external(vendor);
	});

	return stream
		.transform(babelify, { presets: config.presets })
		.bundle().on('error', errorHandler.bind(this))
		.pipe(source('main.js'))
		.pipe(gulp.dest(paths.dist.scripts))
		.pipe(bsync.reload({stream: true, once: true}));
}


// Scripts: concat -------------------------------------------- ** /
// production: concat vendors and main into scripts.min.js
function concat(done) {
	if (!production) { done(); return; }

	var source = gulp.src([
			paths.dist.scripts + 'vendors.js',
			paths.dist.scripts + 'main.js'
		]);

	return source
		.pipe($.concat('scripts.min.js'))
		.pipe($.uglify(config.uglify))
		.pipe(gulp.dest(paths.dist.scripts));
}


// Scripts: modernizr -------------------------------------------- ** /
// global: if src/modernizr exists, move it to dist/scripts/
// production: minify
function modernizr(done) {
	if (!paths.src.modernizr) { done(); return; }

	return gulp.src(paths.src.modernizr + '*.js')
		.pipe($.if( production, $.uglify(config.uglify) ))
		.pipe(gulp.dest(paths.dist.scripts));
}


// Fonts -------------------------------------------- ** /
// global: copy fonts to dist/fonts/
function fonts() {
	return gulp.src(paths.src.fonts + '**/*.{eot,svg,ttf,woff,woff2}')
		.pipe(gulp.dest(paths.dist.fonts));
}


// Images -------------------------------------------- ** /
// global: copy images to dist/images
// production: run imagemin on all images
function images() {
	return gulp.src(paths.src.images + '**/*')
		.pipe($.changed(paths.dist.images))
		.pipe($.if( production, $.imagemin(config.imagemin) ))
		.pipe(gulp.dest(paths.dist.images));
}


// SVGs -------------------------------------------- ** /
// global: save a copy of the SVG sprite inside config.svgs.sprite (used by the scaffold task)
function svgSprite() {
	return gulp.src(paths.src.svgs + '**/*')
		.pipe($.svgSprite(config.svgs));
}


// Watch -------------------------------------------- ** /
// development: base.src, styles, scripts, images and svgs
// production: by default, this task won't run for production
function watch() {
	if(!production) {
		gulp.watch(paths.source, gulp.series( scaffold, reload ));
		gulp.watch(paths.src.styles + '**/*', styles);
		gulp.watch(paths.src.scripts + '**/*', scripts);
		gulp.watch(paths.src.images + '**/*', images);
		gulp.watch(paths.src.svgs + '**/*', gulp.series( svgSprite, scaffold ));
	}
}


// Clean: before -------------------------------------------- ** /
// production: delete dist/
function cleanBefore(done) {
	if (!production) { done(); return; }
	del(paths.dist.root);
	done();
}


// Clean: after -------------------------------------------- ** /
// production: remove unused files from dist/scripts/
function cleanAfter(done) {
	if (!production) { done(); return; }

	del([
		paths.dist.scripts + 'main.js',
		paths.dist.scripts + 'vendors.js',

		'!' + paths.dist.scripts + 'scripts.min.js',
		'!' + paths.dist.scripts + 'modernizr.js'
	]);

	done();
}


// Browsersync -------------------------------------------- ** /
// global: will serve both dev and prod builds
function browserSync() { bsync.init(config.browserSync); }


// Reload -------------------------------------------- ** /
// development only task
function reload() { if(!production) { bsyncReload(); } }


// Sprites -------------------------------------------- ** /
// TODO...


/* HELPER FUNCTIONS
 * ------------------------------------------------------------------ */
function errorHandler(error) { console.log('Error: ' + error.message); }
function timerInit(done) { console.time('\n\n---------------- ALL TASKS FINISHED IN: '); done(); }
function timerEnd(done) { console.timeEnd('\n\n---------------- ALL TASKS FINISHED IN: '); done(); }
