const gulp = require("gulp");
const ts = require("gulp-typescript");
const sourcemaps = require('gulp-sourcemaps');
const gulpMultiProcess = require('gulp-multi-process');
const cache = require("gulp-cached");

gulp.task("default", function (cb) {
    return gulpMultiProcess(['build-src'], cb);
});

gulp.task("build-src", function () {
    const tsProject = ts.createProject("tsconfig.json");
    const srcPath = "./src";
    return gulp.src([srcPath + "/**/*", "!" + srcPath + "/**/*.spec.ts"])
        .pipe(cache())
        .pipe(sourcemaps.init())
        .pipe(tsProject())
        .js
        .pipe(sourcemaps.write('.', {includeContent: false, sourceRoot: './src'}))
        .pipe(gulp.dest("dist"));
});
