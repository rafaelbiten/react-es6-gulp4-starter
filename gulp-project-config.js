module.exports = (function() {
	return {

	/* THESE ARE PROJECT SPECIFIC OPTIONS
	 * they're meant to be changed as needed for each new projects
	 * ------------------------------------------------------------------- */

		// autoprefixer
		autoprefixer: {
			support: [
				'last 2 version',
				'ie >= 8',
				'safari >= 6',
				'ios >= 6',
				'android >= 4',
				'bb >= 7'
			]
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
			open: false,
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
