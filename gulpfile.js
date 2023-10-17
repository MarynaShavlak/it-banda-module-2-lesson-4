import gulp from 'gulp';
import {path} from "./gulp/config/path.js";
import {copy} from "./gulp/tasks/copy.js"
 
global.app = {
  path: path,
  gulp: gulp
}

gulp.task('default', copy)