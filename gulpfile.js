var gulp = require("gulp");
var sass = require("gulp-sass");
var plumber = require("gulp-plumber");
var postcss = require("gulp-postcss");
var autoprefixer = require("gulp-autoprefixer");
var minify = require("gulp-csso");
var rename = require("gulp-rename");
var imagemin = require("gulp-imagemin");
var webp = require("gulp-webp");
var sprite = require("gulp-svgstore");
var posthtml = require("gulp-posthtml");
var include = require("posthtml-include");
var ttf2woff = require("gulp-ttf2woff");
var ttf2woff2 = require("gulp-ttf2woff2");
var del = require("del");
var server = require("browser-sync").create();

gulp.task("style", function () {
    gulp.src("app/source/css/style.scss")
        .pipe(plumber())
        .pipe(sass())
        .pipe(postcss([autoprefixer()]))
        .pipe(gulp.dest("app/source/css"))
        .pipe(minify())
        .pipe(rename("style.min.css"))
        .pipe(gulp.dest("app/sourse/css"));
});

gulp.task("images", function () {
    return gulp.src("app/source/img/**/*.{png,jpg,svg}")
        .pipe(imagemin([
            imagemin.optipng({
                optimizationLevel: 3
            }),
            imagemin.jpegtran({
                progressive: true
            }),
            imagemin.svgo()
        ]))
        .pipe(gulp.dest("app/build/img"));
});

gulp.task("webp", function () {
    return gulp.src("app/source/img/**/*.{png,jpg")
        .pipe(webp({
            quality: 90
        }))
        .pipe(gulp.dest("app/build/img"));
});

gulp.task("sprite", function () {
    return gulp.src("app/source/img/icon-*.svg")
        .pipe(svgstore({
            inlineSvg: true
        }))
        .pipe(rename("sprite.svg"))
        .pipe(gulp.dest("app/build/img"));
});

gulp.task("html", function () {
    return gulp.src("app/source/*.html")
        .pipe(posthtml([include()]))
        .pipe(gulp.dest("app/build"));
});

gulp.task("fonts", function () {
    gulp.src("app/source/fonts/*.ttf")
        .pipe(ttf2woff())
        .pipe(gulp.dest("app/build/fonts"));
    gulp.src("app/source/fonts/*.ttf")
        .pipe(ttf2woff2())
        .pipe(gulp.dest("app/build/fonts"));
})

gulp.task("copy", function () {
    return gulp.src([
            "app/source/fonts/**/*.{woff, woff2}",
            "app/source/js/**"
        ], {
            base: "app/source"
        })
        .pipe(gulp.dest("app/build"));
});

gulp.task("clean", function () {
    console.log("start clean");
    return del("app/build");
});

gulp.task("serve", function () {
    server.init({
        server: "app/build/"
    });

    gulp.watch("app/source/scss/**/*.scss", gulp.parallel("style"));
    gulp.watch("app/source/*.html", gulp.parallel("html"));
});

gulp.task("build", function (done) {
    gulp.series("clean", "copy", "style", "sprite", "html");
    done();
});