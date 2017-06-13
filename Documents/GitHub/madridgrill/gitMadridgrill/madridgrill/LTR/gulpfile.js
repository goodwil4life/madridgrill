'use strict';
/**
 * Required and included Gulp & Gulp Packages
 *
 * These are required to build distribution,
 * The most important one is nunjucks-render
 * Renders the .nunjucks files to browser friendly html files
 */
var nunjucksRender  = require('gulp-nunjucks-render'),
	htmlmin         = require('gulp-htmlmin'),
	changed         = require('gulp-changed'),
	replace         = require('gulp-replace'),
	pump            = require('pump'),
	gulp            = require('gulp');

/**
 * Renders the .nunjucks & .html files from source to distribution
 */
gulp.task('nunjucksRender', function() {
	gulp.src(['source/*.+(html|nunjucks)'])
		.pipe(nunjucksRender({path: ['source']}))
		.pipe(gulp.dest('dist'));
});

/**
 * Copies the given "src" to distribution
 */
gulp.task('copy', function () {
	gulp.src(['source/assets/Mail_Sender/**/*'])
		.pipe(gulp.dest('dist/assets/Mail_Sender'));

	gulp.src(['source/*.json'])
		.pipe(gulp.dest('dist'));

	gulp.src(['source/.htaccess'])
		.pipe(gulp.dest('dist'));

	gulp.src(['source/*.js'])
		.pipe(gulp.dest('dist'));

	gulp.src(['node_modules/sw-toolbox/*.js'])
		.pipe(gulp.dest('dist'));

	gulp.src(['node_modules/sw-toolbox/*.map.json'])
		.pipe(gulp.dest('dist'));

	gulp.src(['source/assets/video/*'])
		.pipe(gulp.dest('dist/assets/video'));

	gulp.src(['source/assets/img/**/*'])
		.pipe(gulp.dest('dist/assets/img'));

	gulp.src(['source/assets/fonts/*'])
		.pipe(gulp.dest('dist/assets/fonts'));
});

/**
 * Gulp dist task,
 * This allows you to run just "gulp dist" command from terminal,
 * And It automatically runs tasks above.
 *
 * To run individual task you can run "gulp TASKNAME",
 * E.g. "gulp nunjucksRender".
 */
gulp.task('dist', ['nunjucksRender', 'copy'], function() {});

/**
 * Replaces the strings in files with the regular expression
 * Copies everything in assets folder
 */
gulp.task('replaceAndCopy', function(){
	gulp.src(['dist/*.*','dist/.htaccess','dist/*.map.json'])
		.pipe(replace(/(\/tasty\/LTR\/)dist\//g, '/themes$1'))
		.pipe(replace(/http:\/\/localhost/g, 'https://mobius.studio'))
		.pipe(replace(/https:\/\/localhost/g, 'https://mobius.studio'))
		.pipe(replace(/assets\/img/g, 'https://img.mobius.studio/themes/tasty/LTR/assets/img'))
		.pipe(gulp.dest('prod'));

	gulp.src(['dist/assets/**/*'])
		.pipe(gulp.dest('prod/assets'));
});

/**
 * Minifies every possible file
 */
gulp.task('minify', function(cb){
	setTimeout(function (cb) {
		pump(
			[
				gulp.src('prod/*.html'),
				htmlmin(
					{
						collapseWhitespace: true,
						processScripts: ['application/ld+json'],
						removeComments: true,
						minifyCSS: true,
						minifyJS: false
					}
				),
				gulp.dest('prod')
			],
			cb
		);
	},100)
});

/**
 * Gulp prod task,
 * This allows you to run just "gulp prod" command from terminal,
 *
 * I created this task because my production and localhost paths are -
 * different. With this task, you can copy everything in dist/ folder -
 * and paste in prod/ folder then use Regular Expression to replace -
 * individual text with new text. minify task also minifies all .html files.
 *
 * To run individual task you can run "gulp TASKNAME",
 * E.g. "gulp nunjucksRender".
 */
gulp.task('prod', ['replaceAndCopy', 'minify'], function() {});