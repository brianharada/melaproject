var path = require('path');

function createGulpFile (_pathobj,_optionsobj) {
  var csspath = _pathobj.cssclean === true ? _pathobj.cssclean : _pathobj.csspath;
  var imagepath = _pathobj.imageclean === true ? _pathobj.imageclean : _pathobj.imagepath;
  var code = "var gulp = require('gulp'),\n" +
    "\tsass = require('gulp-sass'),\n" +
    "\tautoprefixer = require('gulp-autoprefixer'),\n" +
    "\tminifycss = require('gulp-minify-css'),\n" +
    "\tscsslint = require('gulp-scss-lint'),\n" +
    "\tjshint = require('gulp-jshint'),\n" +
    "\tuglify = require('gulp-uglify'),\n" +
    "\timagemin = require('gulp-imagemin'),\n" +
    "\trename = require('gulp-rename'),\n" +
    "\tconcat = require('gulp-concat'),\n" +
    "\tnotify = require('gulp-notify'),\n" +
    "\tcompass = require('gulp-compass'),\n" +
    "\tcache = require('gulp-cache');\n" + 

  "var filesToMove = [\n" +
  "\t'./*.*',\n" +
  "\t'./html/**/*',\n" +
  "\t'./js/**/*',\n" +
  "\t'./sass/**/*',\n" +
  "\t'./images/**/*'\n" +
  "];\n" +

  "gulp.task('styles',function(){\n" +
    "\treturn gulp.src('sass/**/*.scss')\n";
      if ( _optionsobj.c_compass ) {
        code += "\t\t.pipe(scsslint())\n";
        code += "\t\t.pipe(compass({\n" +
          "\t\t\tproject: '/',\n" +
          "\t\t\tcss: '#',\n".replace('#',csspath) +
          "\t\t\tsass: '#',\n".replace('#',path.join(_pathobj.homepath,'sass')) +
          "\t\t\timage: '#',\n".replace('#',imagepath) +
          "\t\t\tcomments: false,\n" +
          "\t\t\trelative: false\n" +
          "\t\t}))\n";
      } else {
        code += "\t\t.pipe(scsslint())\n";
        code += "\t\t.pipe(sass({ style: 'expanded', errLogToConsole: true }))\n";
        code += "\t\t.pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))\n";
      }      
      if (_pathobj.networkpath){
       code += "\t\t.pipe(gulp.dest('#'))\n".replace('#',path.join(_pathobj.networkpath,'css'));
      }
      code += "\t\t.pipe(rename({suffix: '.min'}))\n" +
      "\t\t.pipe(minifycss())\n" +
      "\t\t.pipe(gulp.dest('#'))\n".replace('#',_pathobj.csspath) +
      "\t\t.pipe(notify({message: 'styles task complete' }));\n" +
  "});\n" +

  "gulp.task('scripts', function(){\n" +
    "\treturn gulp.src('js/**/*.js')\n" +
      "\t\t.pipe(jshint())\n" +
      "\t\t.pipe(jshint.reporter('default'))\n";
      if (_pathobj.networkpath){
        code += "\t\t.pipe(gulp.dest('#'))\n".replace('#',path.join(_pathobj.networkpath,'js'));
      }
      code += "\t\t.pipe(concat('#.js'))\n".replace('#',_pathobj.projectname) +
      "\t\t.pipe(rename({suffix:'.min'}))\n" +
      "\t\t.pipe(uglify())\n" +
      "\t\t.pipe(gulp.dest('#'))\n".replace('#',_pathobj.jspath) +
      "\t\t.pipe(notify({message: 'scripts task complete' }));\n" +
  "});\n" +

  "gulp.task('images', function() {\n" +
    "\treturn gulp.src('images/**/*')\n" +
      "\t\t.pipe(cache(imagemin({ optimizationLevel: 3, progressive: true, interlaced: true })))\n" +
      "\t\t.pipe(gulp.dest('#'))\n".replace('#',_pathobj.imagepath) +
      "\t\t.pipe(notify({ message: 'images task complete' }));\n" +
  "});\n" +

  "gulp.task('copy', function(){\n" +
    "\treturn gulp.src(filesToMove,{base:'./'})\n" +
    "\t\t.pipe(gulp.dest('#'))\n".replace('#',path.join( _pathobj.networkpath,_pathobj.projectname + '-gulp'));
    code+= "\t\t.pipe(notify({message: 'project copied' }));\n" +
    "});\n" +
  
  "gulp.task('watch', function() {\n" +

    "\tgulp.watch('sass/**/*.scss',['styles']);\n" +
    "\tgulp.watch('js/**/*.js',['scripts']);\n" +
    "\tgulp.watch('images/**/*', ['images']);\n" +
  "});"; 
  return code;
};

function createPackageJson(_pathobj){
  var code = '{\n' +
  '\t"name": "#",\n'.replace('#',_pathobj.projectname);
  code += '\t"latest": "#",\n'.replace('#', new Date());
  code += '\t"devDependencies": {\n' +
    '\t\t"gulp": "^3.6.2",\n' +
    '\t\t"gulp-rename": "^1.2.0",\n' +
    '\t\t"gulp-concat": "^2.2.0",\n' +
    '\t\t"gulp-sass": "^0.7.1",\n' +
    '\t\t"gulp-minify-css": "^0.3.4",\n' +
    '\t\t"gulp-uglify": "^0.2.1",\n' +
    '\t\t"gulp-clean": "^0.2.4",\n' +
    '\t\t"gulp-livereload": "^1.3.1",\n' +
    '\t\t"gulp-autoprefixer": "0.0.7",\n' +
    '\t\t"gulp-notify": "^1.2.5",\n' +
    '\t\t"gulp-jshint": "^1.5.5",\n' +
    '\t\t"gulp-cache": "^0.1.3",\n' +
    '\t\t"gulp-imagemin": "^0.5.0",\n' +    
    '\t\t"gulp-compass": "^1.1.9",\n' +
    '\t\t"gulp-scss-lint": "^0.1.3"\n' +
  '\t}\n' +
  '}\n';
  return code;
}

function createMainSass(){
  var code = '@import \'utility\';\n\n';
  return code;
}

function createUtilitySass(_pathobj,_optionsobj) {
  var imgpath = _pathobj.imageclean !== false ? _pathobj.imageclean : _pathobj.imagepath;
  var code = "//*-------------------------------*//\n" +
  "//    Mixins\n" +
  "//*-------------------------------*//\n\n" +
  "@mixin bg-img($img-name, $repeat:no-repeat, $x-pos:left, $y-pos:top, $color:transparent) {\n" +
  "  background: url(&/#{$img-name}) $repeat $x-pos $y-pos $color;\n".replace('&',imgpath);
  code += "}\n\n" +
   "//*-------------------------------*//\n" +
   "//    Misc\n" +
   "//*-------------------------------*//\n\n" +
   "//*** clearfix ***/\n" +
   ".cf:before,\n" +
   ".cf:after {\n" +
   "  content: ' ';\n" +
   "  display: table;\n" +
   "}\n\n" +
   ".cf:after {\n" +
   "  clear: both;\n" +
   "}\n";
   if ( _optionsobj.c_detail ) {
     code += "\n//*-------------------------------*//\n" +
     "//    Detail page reset\n" +
     "//*-------------------------------*//\n\n" +
     ".page-container,\n#pdp_wrapper { overflow: visible;}\n\n" +
     "#dvTabContentContainer p { margin: 0; }\n\n" +
     "#dvTabContentContainer ul {\n  margin: 0;\n  padding: 0;\n  li { list-style: none; }\n}\n\n";
   }
   return code;
}

function createHtml(_pathobj, _optionsobj) {
  var jspath = _pathobj.jsclean !== false ? _pathobj.jsclean : _pathobj.jspath;
  var csspath = _pathobj.cssclean !== false ? _pathobj.cssclean : _pathobj.csspath;

  var code ='<link rel="stylesheet" href="#">\n\n\n\n'.replace('#', csspath + '/' + _pathobj.projectname + '.min.css');
  
  if ( _optionsobj.c_detail ) {
    code+='[externalScript src="#"]'.replace('#', jspath + '/' + _pathobj.projectname + '.min.js');
  } else {
    code+='<script src="#"></script>\n'.replace('#', jspath + '/' + _pathobj.projectname + '.min.js');
  }
  return code;
}

function createDetailJS(){
  var code = "productStory = {\n" +
  "\tinit:function(){\n\n\n" +
  "\t}\n" +
  "};\n" +
  "productStory.init();";
  return code;
}

function createSublimeProject() {
  var code = '{\n' +
  '\t"folders":\n' +
  '\t[\n' +
  '\t\t{\n' +
  '\t\t\t"follow_symlinks": true,\n' +
  '\t\t\t"folder_exclude_patterns": ["node_modules"],\n' +
  '\t\t\t"path": "."\n' +
  '\t\t}\n' +
  '\t]\n' +
  '}';
  return code;
}



module.exports.createGulpFile = createGulpFile;
module.exports.createPackageJson = createPackageJson;
module.exports.createMainSass = createMainSass;
module.exports.createUtilitySass = createUtilitySass;
module.exports.createHtml = createHtml;
module.exports.createDetailJS = createDetailJS;
module.exports.createSublimeProject = createSublimeProject;