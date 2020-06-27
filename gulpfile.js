const gulp = require('gulp');
const imagemin = require('gulp-imagemin');
const concat = require('gulp-concat');
const terser = require('gulp-terser');
const uglify = require('gulp-uglify');
const sourcemaps = require('gulp-sourcemaps');
const postcss = require('gulp-postcss');
const cssnano = require('cssnano');
const autoprefixer = require('autoprefixer');
const babel = require('gulp-babel');
const {src, series, parallel, dest, watch} = require('gulp');

// const jsPath = 'src/js/**/*.js';

const jsPath = [
  'src/js/ui.js',
  'src/js/game.js',
  'src/js/card.js',
  'src/js/player.js',
  'src/js/app.js'
]
const cssPath = 'src/css/**/*.css';

// simply copy html to the dist folder
function copyHtml(){
	return src('src/*.html')
	.pipe(gulp.dest('dist'));
}

// simply copy sound files to the dist folder
function copySoundFiles(){
	return src('src/sound/*')
	.pipe(gulp.dest('dist/sound'))
}

// basic task that optimaize the images
function imgTask(){
	return src('src/img/**')
	.pipe(imagemin())
	.pipe(gulp.dest('dist/img'));
}

// bundle js
function jsTask(){
	return src(jsPath)
	.pipe(sourcemaps.init())
	.pipe(concat('all.js'))
 	.pipe(babel({
		presets: ['@babel/preset-env']
	}))
	// .pipe(uglify())
	.pipe(terser({
      ecma: 6,
      keep_fnames: false,
      mangle: {
        toplevel: true,
      },
    }))
 	// .pipe(terser())
	.pipe(sourcemaps.write('.'))
	.pipe(dest('dist/js'));
}

function cssTask(){
	return src(cssPath)
	.pipe(sourcemaps.init())
	.pipe(concat('style.css'))
	.pipe(postcss([autoprefixer(), cssnano()]))
	.pipe(sourcemaps.write('.'))
	.pipe(dest('dist/css'));

}

function watchTask(){
	watch([cssPath, jsPath], {interval: 1000}, parallel(cssTask, jsTask));
}

exports.copyHtml = copyHtml;
exports.copySoundFiles = copySoundFiles;
exports.imgTask = imgTask;
exports.jsTask = jsTask;
exports.cssTask = cssTask;
exports.default = parallel(copyHtml, imgTask, jsTask, cssTask, copySoundFiles);
// exports.default = series(parallel(copyHtml, imgTask, jsTask, cssTask), watchTask);