const gulp = require("gulp")
const ts = require("gulp-typescript")
const screeps = require("gulp-screeps")
const { series, parallel } = require("gulp")
const fs = require("fs-extra")
const screepsTS = ts.createProject("tsconfig_gulp.json")
const credentials = require("./credentials")
const rename = require("gulp-rename")
const replace = require("gulp-replace")

function cleanDist(cb) {
    fs.removeSync("dist")
    cb()
}

function cleanBuild(cb) {
    fs.removeSync("build")
    cb()
}	

function prepareTS() {
    return gulp.src(["src/**/*.ts", "src/**/*.js"])
        .pipe(replace(/import\s*(.+?)\s*from\s*"[\.\/]*(.+?)"/g, (match, p1, p2) => { // replace relative imports with absolute imports
            return `import ${p1} from "${p2.replace("\/", "_")}";`
        })).pipe(rename((path) => { // flatten directory structure
            path.basename = path.dirname != '.' ? path.dirname.replace(/\//g, "_") + "_" + path.basename : path.basename
            path.dirname = ""
        }))
        .pipe(gulp.dest("build"))
}

function compile() {
    return gulp.src("build/**.*").pipe(screepsTS()).js.pipe(gulp.dest("dist"))
}

function deploy(cb) {
    gulp.src("dist/*.js")
        .pipe(screeps(credentials))
    cb()
}

exports.deploy = deploy
exports.build = series(prepareTS, compile)
exports.clean = parallel(cleanDist, cleanBuild)
exports.screeps = series(
    parallel(
        cleanDist,
        cleanBuild
    ), 
    prepareTS,
    compile, 
    deploy)
