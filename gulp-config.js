module.exports = (function() {
	var options = {

		// install dependencies using npm --save-dev
		// and list them here to be bundled into vendors.js
		vendors: [
			'react',
			'jquery'
		],

		browserSync: {
			server: { baseDir: './' },
			// "proxy": "192.168.0.1:8080", // or en.name.local:8080
			// "host": "192.168.0.1",

			open: false,
			notify: false,
			browser: ['google chrome']
		},

		// --------------------------------------------------------- //
		// YOU PROBABLY DON'T NEED TO CHANGE ANYTHING PAST THIS LINE //
		// --------------------------------------------------------- //

		// sourcemaps for scripts and styles
		sourcemaps: { scripts: true, styles: true },

		// allowed extensions for scripts
		extensions: [ '.js', '.jsx', '.es' ],

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
		}
	};

	return {
		paths: options.paths,
		vendors: options.vendors,
		sourcemaps: options.sourcemaps,
		extensions: options.extensions,
		autoprefixer: options.autoprefixer,

		browserSync: {
			open: false,
			notify: false,
			debugInfo: false,
			server: { baseDir: './' },
			browser: ['google chrome']
		}
	};

	/* helper functions */
	function pathsTo(path) {
		return {
			styles:		'assets/' + path + '/styles/',
			scripts:	'assets/' + path + '/scripts/',
			fonts:		'assets/' + path + '/fonts/',
			images:		'assets/' + path + '/images/'
		};
	}
}());
