var config = module.exports = {

/* THESE ARE PROJECT SPECIFIC OPTIONS
 * they're meant to be changed as needed for each new projects
 * ------------------------------------------------------------------- */

	// babel presets
	presets: ['es2015', 'react'],

	// autoprefixer
	autoprefixer: {
		browsers: [
			'> 1%',
			'last 2 versions',

			'Opera 12.1',
			'Firefox ESR',
			'Safari >= 6',
			'Explorer >= 8',

			'iOS >= 6',
			'Android >= 4',
			'BlackBerry >= 7'
		]
	},

	// combine media queries
	combineMq: { beautify: false },

	// uglify
	uglify: {
		compress: {
			pure_funcs: [],
			drop_console: true,
			drop_debugger: true
		}
	},

	// imagemin
	imagemin: {
		interlaced: true,
		progressive: true,
		optimizationLevel: 3,
		svgoPlugins: [{removeViewBox: false}]
	},

	// svgs
	svgs: {
		mode: {
			css: false,
			inline: true,
			symbol: true
		},
		svg: {
			xmlDeclaration: false,
			doctypeDeclaration: false,
			transform: [ function(sprite) { config.svgs.sprite = sprite; } ]
		}
	},

	paths: {
		// check 'pathTo' function
		// to customize default folders and paths
		src: pathsTo('src'),
		dist: pathsTo('dist'),

		// change 'base' to the name and extension of the project entry point
		// ie.: index.html, index.php, index.php.twig
		source: 'base.src',
		base: 'index.html'
	},

/* YOU SHOULDN'T NEED TO TOUCH ANYTHING BELOW THIS LINE
 * ------------------------------------------------------------------- */

	// install dependencies using npm --save
	// and they will be compiled into vendors.js
	vendors: Object.keys(require('./package').dependencies),

	// allowed extensions for scripts
	extensions: [ '.js', '.jsx', '.es' ],


/* THESE ARE THE DEFAULT USER SPECIFIC OPTIONS
 * if you'd like to change something, please create a
 * gulp-user-config.js file based on gulp-user-config-sample.js
 * ------------------------------------------------------------------- */

	browserSync: {
		open: true,
		notify: false,
		server: { baseDir: './' },
		browser: ['google chrome']
	},

	sourcemaps: {
		scripts: true,
		styles: true
	}
};


// helper function
function pathsTo(path) {

	// by default the Starter assumes folders for
	// styles, scripts, fonts images, sprites and svgs
	// ie.: calling path.src.styles will return 'assets/src/styles'

	return {
		root:		'assets/' + path + '/',

		styles:		'assets/' + path + '/styles/',
		scripts:	'assets/' + path + '/scripts/',

		fonts:		'assets/' + path + '/fonts/',

		images:		'assets/' + path + '/images/',
		sprites:	'assets/' + path + '/sprites/',
		svgs:		'assets/' + path + '/svgs/',

		// use the provided (bare bones) modernizr file
		// or replace it with a custom one specific to the project
		// by default the Starter will automatically inject it to the header
		modernizr:	'assets/' + path + '/modernizr/'
	};
}
