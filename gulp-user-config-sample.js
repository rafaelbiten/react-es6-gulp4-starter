var config = require('./gulp-project-config.js');
var extend = require('lodash').extend;

/* THESE ARE USER SPECIFIC OPTIONS
 * copy the content of this file into a new gulp-user-config.js
 * ------------------------------------------------------------------- */

module.exports = extend(config, {

	// if you already have a server (ie.: running vagrant),
	// comment server and set proxy with your local ip or en.name.local:8080

	browserSync: {
		server: { baseDir: './' },
		// "proxy": "192.168.0.1:8080",
		// "host": "192.168.0.1",

		open: false,
		notify: false,
		browser: ['google chrome']
	},

	// sourcemaps for scripts and styles
	sourcemaps: {
		scripts: true,
		styles: true
	}
});
