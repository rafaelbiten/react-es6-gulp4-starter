module.exports = (function() {
	return {

	/* THESE ARE PROJECT SPECIFIC OPTIONS
	 * they're meant to be changed as needed for each new projects
	 * ------------------------------------------------------------------- */

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

		// by default it assumes folders for styles, scripts, fonts and images
		// ie.: path.src.styles will return 'assets/src/styles'
		// check 'pathTo' function to customize the name of folders and paths
		paths: {
			src: pathsTo('src'),
			dist: pathsTo('dist')
		},


	/* YOU SHOULDN'T NEED TO TOUCH ANYTHING BELOW THIS LINE
	 * ------------------------------------------------------------------- */

		// install dependencies using npm --save
		// and they will be compiled into vendors.js
		vendors: Object.keys(require('./package').dependencies),

		// allowed extensions for scripts
		extensions:		[ '.js', '.jsx', '.es' ],


	/* THESE ARE THE DEFAULT USER SPECIFIC OPTIONS
	 * if you'd like to change something, please create a
	 * gulp-user-config.js file from gulp-user-config-sample.js
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
}());

// helper functions
function pathsTo(path) {
	return {
		styles:		'assets/' + path + '/styles/',
		scripts:	'assets/' + path + '/scripts/',
		fonts:		'assets/' + path + '/fonts/',
		images:		'assets/' + path + '/images/'
	};
}
