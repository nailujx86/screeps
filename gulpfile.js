const gulp = require("gulp")
const ts = require("gulp-typescript")
const screeps = require("gulp-screeps")
const rename = require("gulp-rename")
const { series } = require("gulp")
const fs = require("fs-extra")
const screepsTS = ts.createProject("tsconfig.json")
const credentials = require("./credentials")

function clean(cb) {
    fs.removeSync("dist")
    cb()
}

function compile() {
    return screepsTS.src().pipe(screepsTS()).js.pipe(gulp.dest("dist"))
}

function deploy(cb) {
    gulp.src("dist/*.js")
        .pipe(screeps(credentials))
    cb()
}

exports.deploy = deploy
exports.build = series(compile)
exports.clean = clean
exports.screeps = series(clean, compile, deploy)
