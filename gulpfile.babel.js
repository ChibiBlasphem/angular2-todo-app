import gulp                 from 'gulp';
import gutil, {PluginError} from 'gulp-util';
import source               from 'vinyl-source-stream';
import buffer               from 'vinyl-buffer';
import sourcemaps           from 'gulp-sourcemaps';

import assign               from 'object-assign';
import browserify           from 'browserify';
import watchify             from 'watchify';
import babelify             from 'babelify';

import del                  from 'del';

let watchedFile     = 'client/app.js',
    destinationPath = 'client/dist',
    destinationFile = 'bundle.js';

// Copy task
// Copy the defined files (included the watched file) to the destination folder
gulp.task('copy', () => {
    return gulp.src([
        watchedFile,
        'node_modules/angular2/bundles/angular2-polyfills.js',
        'node_modules/angular2/bundles/angular2-polyfills.min.js'
    ])
    .pipe(gulp.dest(destinationPath));
});

// Build task
// Executes copy task before
// Then bundles files
gulp.task('build', ['copy'], () => {
    const b = browserify(watchedFile, {debug: true})
        .transform(babelify);
    return bundle(b);
});

// Watch task
// Use watchify to detect changes on file,
// Then bundle it on update and log to console via gutil on log event
gulp.task('watch', () => {
    const b = browserify(watchedFile, assign({debug: true}, watchify.args))
        .transform(babelify);
    const w = watchify(b)
        .on('update', () => bundle(b))
        .on('log', gutil.log);
    return bundle(w);
});

// Clean the destination folder
gulp.task('clean', () => {
    return del(destinationPath);
});

// Defaults task when none is specified
gulp.task('default', ['copy', 'watch']);

// Bundle file in one file in the destination file (folder + file)
function bundle(b) {
    return b.bundle()
        .on('error', (e) => {
            console.log(e.stack);
        })
        .pipe(source(destinationFile))
        .pipe(buffer())
        .pipe(sourcemaps.init({loadMaps: true}))
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest(destinationPath));
}
