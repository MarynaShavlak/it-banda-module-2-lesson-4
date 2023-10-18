const {src, dest, watch, parallel, series} = require('gulp');
const scss = require('gulp-sass')(require('sass'));
const concat = require('gulp-concat');
const uglify = require('gulp-uglify-es').default;
const browserSync  =  require('browser-sync').create();
const autoprefixer  =  require('gulp-autoprefixer');
const clean =  require('gulp-clean');
const avif=  require('gulp-avif');
const webp =  require('gulp-webp');
const imagemin=  require('gulp-imagemin');
const newer =  require('gulp-newer');
const svgSprite =  require('gulp-svg-sprite');
const ttf2woff2 =  require('gulp-ttf2woff2');
const fonter =  require('gulp-fonter');
const include =  require('gulp-include');


function pages() {
  return src('app/pages/*.html')
  .pipe(include({
    // includePaths: 'app/components'
    includePaths: 'app/partials'
  }))
  .pipe(dest('app'))
  .pipe(browserSync.stream())
}



function fonts() {
    return src('app/fonts/src/*.*')
    .pipe(fonter({
      formats: ['woff', 'ttf']
    }))
    .pipe(src('app/fonts/*.ttf'))
    .pipe(ttf2woff2())
    .pipe(dest('app/fonts'))

}


// function concatScss() {
//   return src(scssFiles)
//     .pipe(concat('index.scss'))
//     .pipe(scss().on('error', scss.logError))
//     .pipe(dest('app/styles'));
// }



function styles() {
  return src('app/styles/index.scss')
  // return src(scssFiles )
  .pipe(autoprefixer({overrideBrowsersList:['last 10 version']}))
  .pipe(concat('style.min.css'))
  .pipe(scss({outputStyle: 'compressed'}))
  .pipe(dest('app/css'))
  .pipe(browserSync.stream())
}

function images() {
  return src(['app/images/src/*.*', '!app/images/src/*.svg'])
  .pipe(newer('app/images'))
  .pipe(avif({quality : 50}))

  .pipe(src('app/images/src/*.*'))
  .pipe(newer('app/images'))
  .pipe(webp())

  .pipe(src('app/images/src/*.*'))
  .pipe(newer('app/images'))
  .pipe(imagemin())

  .pipe(dest('app/images'))
}

function sprite() {
 return src('app/images/*.svg')
 .pipe(svgSprite({
mode: {
  stack: {
    sprite: '../sprite.svg',
    example: true
  }
}
 }))
 .pipe(dest('app/images'))
}

function scripts() {
  return src([
    'node_modules/swiper/swiper-bundle.js',
    'app/js/main.js',


    // 'app/js/*.js',
    // '!app/js/main.min.js'


  ])
  .pipe(concat('main.min.js'))
  .pipe(uglify())
  .pipe(dest('app/js'))
  .pipe(browserSync.stream())
}

function watching() {
  browserSync.init({server:{
    baseDir: "app/"
  }})
  watch(['app/styles/style.scss'], styles)
  watch(['app/images/src'], images)
  watch(['app/js/main.js'], scripts)
  // watch(['app/components/*', 'app/pages/*'], pages)
  watch(['app/partials/*', 'app/pages/*'], pages)
  watch(['app/**/*.html']).on('change', browserSync.reload) 
}

function building() {
  return src([
    'app/css/style.min.css',
    'app/images/*.*',
    '!app/images/*svg',
    '!app/images/stack/sprite.stack.html',
    'app/images/sprite.svg',
    'app/fonts/*.*',
    'app/js/main.min.js',
    'app/**/*.html',
],{base:'app'})
.pipe(dest('dist'))
}

function cleanDist() {
  return src('dist')
  .pipe(clean())
}


const scssFiles = [
  'app/styles/utils/common.scss',
  'app/styles/utils/variables.scss',
  'app/styles/utils/visually-hidden.scss',
  'app/styles/base/base.scss',
  'app/styles/base/container.scss',
  'app/styles/base/section.scss',
  'app/styles/components/calendar.scss',
  'app/styles/components/time-picker.scss',
  'app/styles/components/buttons.scss',
  'app/styles/components/home_header.scss',
  'app/styles/components/hero.scss',
  'app/styles/components/benefits.scss',
  'app/styles/components/cleaning-types.scss',
  'app/styles/components/buildings.scss',
  'app/styles/components/cleaning-package.scss',
  'app/styles/components/reviews.scss',
  'app/styles/components/trust.scss',
  'app/styles/components/questions.scss',
  'app/styles/components/connection.scss',
  'app/styles/components/order-banner.scss',
  'app/styles/components/support-modal.scss',
  'app/styles/components/subscription-modal.scss',
  'app/styles/components/office-calculation.scss',
  'app/styles/components/success-order-table.scss',
  'app/styles/components/footer.scss',
  'app/styles/components/scroll-to-top-btn.scss',
  'app/styles/components/work-shedule.scss',
  'app/styles/components/theme-toggler.scss',
  'app/styles/components/animations.scss',
  'app/styles/base/modifiers.scss',
];










// exports.concatScss = concatScss;
exports.pages= pages;
exports.styles= styles;
exports.images= images;
exports.fonts= fonts;
exports.sprite= sprite;
exports.building= building;
exports.scripts= scripts;
exports.watching= watching;


exports.build = series(cleanDist,building)
// exports.default = parallel(concatScss, styles, scripts, pages, watching );
exports.default = parallel( styles, scripts, pages, watching );