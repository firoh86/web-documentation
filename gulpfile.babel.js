//Constantes para el automatizador de tareas
const gulp = require("gulp")
const babel = require("gulp-babel")
const concat = require("gulp-concat")
const plumber = require("gulp-plumber")
const htmlmin = require('gulp-htmlmin')
const cleanCSS = require('gulp-clean-css')
const autoprefixer = require('gulp-autoprefixer')
const uglify = require("gulp-uglify")

//Constante para el modulo de recarga automática del sitio web al hacer cambios
const browserSync = require('browser-sync')

//Instancia del servidor de desarrollo
const server = browserSync.create()

//tarea para los estilos de la UX
gulp.task("styles", () => {
    return gulp
        .src('server/css/*.css')
        .pipe(plumber())
        .pipe(cleanCSS())
        .pipe(autoprefixer({
            browsers: ['last 2 versions'],
            cascade: false
        }))
        .pipe(concat('styles.css'))
        .pipe(gulp.dest('public/css'))
        .pipe(server.stream())
})

//tarea para el html
gulp.task('html', () => {
    return gulp.src('server/views/*.html')
        .pipe(htmlmin({ collapseWhitespace: true }))
        .pipe(gulp.dest('public'));
})

//tarea para el js
gulp.task("scripts", () => {
    return gulp
        .src("./server/js/*.js")
        .pipe(plumber())
        .pipe(
            babel({
                presets: ["@babel/preset-env"]
            })
        )
        .pipe(concat("scripts-min.js"))
        .pipe(uglify())
        .pipe(gulp.dest("./public/js"))
})

//tarea por defecto para que se ejecuten todas
gulp.task('default', () => {
    //Iniciación del servidor en el puerto 3000
    server.init({
        proxy: "localhost:80"

    })
    //CSS
    gulp.watch('./server/css/*.css', gulp.series('styles'))

    //HTML
    gulp.watch('./server/views/*.html', gulp.series('html')).on('change', server.reload)

    //JS
    gulp.watch("./server/js/*.js", gulp.series('scripts')).on('change', server.reload)
})