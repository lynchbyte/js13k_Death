const gulp = require('gulp');
const concat = require('gulp-concat');
const terser = require('gulp-terser');
const zip = require('gulp-zip');
const advzip = require('gulp-advzip');
const { src, series, parallel, dest, watch } = require('gulp');

const htmlPath = './src/*.html';
const mediaPath = './src/media/*.*';
const shaderPath = './src/media/sh/**/*.*';
//const jsPath = ['./js/*.js', './src/j/mk.js', './src/j/sel.js', './src/j/game.js'];
const jsPath = './src/js/*.js';


function copyHtml() {
  return src(htmlPath).pipe(gulp.dest('dist'));
}

function copyMedia() {
  return src(mediaPath).pipe(gulp.dest('dist/media/'));
}


function copyShaders() {
  return src(shaderPath).pipe(gulp.dest('dist/media/sh/'));
}

function jsConCat() {
  return gulp.src(jsPath)
    .pipe(concat('script.js'))
    .pipe(gulp.dest('./dist/js/'));

}

function miniJS() {
  return gulp.src('./dist/js/script.js')
    .pipe(terser({
      module: true,
      // mangle: {
      //   toplevel: true
      // }



}))
    .pipe(gulp.dest('./dist/js/'));
}

function zipAll() {

  return src('dist/**/*.*')
    .pipe(zip('archive.zip'))
    .pipe(gulp.dest('dist'))
  /////////////////////////////////////////////////////////////////
  // return src(zipPath)
  // .pipe(zip('archive.zip'))
   .pipe(advzip('archive.zip'))
   .pipe(gulp.dest('dist'));

}

// function watchTask() {
//   watch([htmlPath, jsPath, picPath], { interval: 1000 }, parallel( copyHtml, jsConCat));
// }

exports.default = series(
  copyHtml,
   copyMedia,
   copyShaders,
  jsConCat, 
     miniJS, 
   zipAll
);

//exports.default = copyHtml 

//exports.jsConCat = jsConCat;
//exports.zipAll = zipAll;
//exports.default = series(
//   parallel(copyHtml,  jsTask, zipAll),
//   watchTask
// );

//copy folder from network to loacl drive to C:, rename *_local

//create dist folder

//at cmd prompt, not powershell

//npm install --global gulp-cli

//npm install --save-dev gulp

//test copyHtml  , exports.default = copyHtml , terminal type gulp return

//in js files, remove import / export, except three & vr button (occurs only once at start)

//in js files, remove dat.gui and stats

//copy ar button and orbit controls from R136 to js folder

//npm install --save-dev gulp-concat

//test, exports.default = parallel(copyHtml, jsConCat);, terminal type gulp return

//npm install gulp-terser --save-dev  , it is different to all others

//test, now in series, exports.default = series(copyHtml, jsConCat, miniJS);, terminal type gulp return

//npm install --save-dev gulp-zip

//npm install --save-dev gulp-advzip
