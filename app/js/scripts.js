/* global Window: false */
/* global $: false */
/* global require: false */
/* global console: false */

Window.width = 800;
Window.height = 800;
var fs = require('fs');
var path = require('path');

var pathobj = {
  projectname: false,
  homepath: false,
  networkpath: false,
  csspath: false,
  cssclean: false,
  jspath: false,
  jsclean: false,
  imagepath: false,
  imageclean: false
};
var optionsobj = {
  c_compass: false,
  c_detail: false
};

$('.dirinput').change(function () {
  var dirval = $(this).val();
  $(this).siblings('.feedback').val(dirval);
});

$('.js-closewindow').on('click',function(){
  $(this).closest('.window-message').fadeOut();
});

$('#js-createReset').on('click', reset );

$('#js-createButton').on('click', function(){
  console.log('clicked');
  $(this).html('<img src="images/ajax-loader.gif" />');
  var pathcheck = populatePaths();
  if(!pathcheck) return;
  console.log('passed pathcheck');
  createHomeDirs();
  createNetworkDirs();

  var gulpfile = createGulpFile();
  var packagejson = createPackageJson();
  var mainsass = createMainSass();
  var utilitysass = createUtilitySass();
  var html = createHtml();
  var sbproj = createSublimeProject();
  var js;
  if ( optionsobj.c_detail ) {
    js = createDetailJS();
  } else {
    js = '';
  }

  fs.writeFile(path.join( pathobj.homepath,'gulpfile.js' ),gulpfile,function(err){
    if(err){
      showError(err);
    }else{
      console.log('gulpfile.js created');
    }
  });

  fs.writeFile(path.join( pathobj.homepath,'package.json' ),packagejson,function(err){
    if(err){
      showError(err);
    }else{
      console.log('package.json created');
    }
  });

  fs.writeFile(path.join( pathobj.homepath, pathobj.projectname + '.sublime-project' ),sbproj, function(err){
    if(err){
      showError(err);
    }else{
      console.log('package.json created');
    }
  });

  fs.writeFile(path.join( pathobj.homepath, 'sass', pathobj.projectname +'.scss' ),mainsass, function(err){
    if(err){
      showError(err);
    }else{
      console.log('main Sass created');
    }
  });

  fs.writeFile(path.join( pathobj.homepath, 'sass', '_utility.scss' ), utilitysass, function(err){
    if(err){
      showError(err);
    }else{
      console.log('utility Sass created');
    }
  });

  fs.writeFile(path.join( pathobj.homepath, 'js', pathobj.projectname + '.js' ), js, function(err){
    if(err){
      showError(err);
    }else{
      console.log('js file created');
    }
  });

  fs.writeFile(path.join( pathobj.homepath, 'html', pathobj.projectname + '.html' ), html, function(err){
    if(err){
      showError(err);
    }else{
      console.log('html created');
    }    
  });
  // npminstall = childProcess.exec('ls -l',{cwd:pathobj.homepath,env:'npm'}, function(error, stdout, stderr){
  //   if(error){
  //     showError(error.stack);
  //     console.log('Error code:', error.code);
  //     console.log('Signal received:', error.signal);
  //   }
  //   console.log('Child Process STDOUT:', stdout);
  //   console.log('Child Process STDERR:', stderr);
  // });

  // npminstall.on('exit', function(code){
  //   console.log('Child proces exited with exit code', code);
  //   showSuccess('project created');
  // });
  showSuccess('Project files and directories created. Please go to ' + pathobj.homepath + ' in the terminal and type npm install');

});

function showError(message){
  $('#js-createButton').text('create project');
  $('.js-window-error').find('.js-message').text(message);
  $('.js-window-error').fadeIn(100);
  console.log(message);
}

function showSuccess(message){
  $('#js-createButton').text('create project');
  $('.js-window-success').find('.js-message').text(message);
  $('.js-window-success').fadeIn(100);
  console.log(message);
}

function populatePaths(){
  // check to see if project name is there and store it if not return error and throw false
  if( $('#projectname').val() ) {
    pathobj.projectname = $('#projectname').val().split(' ').join('-');
  }else{
    showError('project name required');
    return false;
  }
  console.log('projectname passed');
  // check to see if home directory is there and store it if not return error and throw false, these first two values must be there
  if( $('#homedir').val() ){
    pathobj.homepath = path.join( $('#homedir').val(), pathobj.projectname + '-gulp' );
  }else{
    showError('home directory required');
    return false;
  }
  console.log('homedir passed');
  if( $('#networkdir').val() ) pathobj.networkpath = path.join( $('#networkdir').val(), 'Front-end' );
  if( $('#cssdir').val() ) pathobj.csspath = path.join( $('#cssdir').val(), pathobj.projectname );
  if( $('#jsdir').val() ) pathobj.jspath = path.join( $('#jsdir').val(), pathobj.projectname );
  if( $('#imagedir').val() ) pathobj.imagepath = path.join( $('#imagedir').val(), pathobj.projectname );

  if ( pathobj.csspath.split('Volumes').length > 1 ){
    pathobj.cssclean = pathobj.csspath.split('Volumes')[1];
  }
  if ( pathobj.jspath.split('Volumes').length > 1 ){
    pathobj.jsclean = pathobj.jspath.split('Volumes')[1];
  }
  if ( pathobj.imagepath.split('Volumes').length > 1 ){
    pathobj.imageclean = pathobj.imagepath.split('Volumes')[1];
  }

  optionsobj.c_detail = $('#check-detail').prop('checked');
  optionsobj.c_compass = $('#check-compass').prop('checked');

  return true;
}

function createHomeDirs(){
  // create home directory called projectname-gulp
  try{ fs.mkdirSync(pathobj.homepath); }
  catch(e){ showError(e); }
  // create html dir
  try{ fs.mkdirSync(path.join(pathobj.homepath,'html')); }
  catch(e){ showError(e); }
  // create projectname.html

  // create js dir
  try{ fs.mkdirSync(path.join(pathobj.homepath,'js')); }
  catch(e){ showError(e); }
  // create projectname.js

  // create sass dir
  try{ fs.mkdirSync(path.join(pathobj.homepath,'sass')); }
  catch(e){ showError(e); }
  // create projectname.scss utility.scss with mixins

  // create images dir
  try{ fs.mkdirSync(path.join(pathobj.homepath,'images')); }
  catch(e){ showError(e); }
}

function createNetworkDirs(){
  // create front end directory
  try{ fs.mkdirSync(pathobj.networkpath); }
  catch(e){ showError(e); }

  // create css directory in network directory
  try{ fs.mkdirSync(path.join( pathobj.networkpath, 'css' )); }
  catch(e){ showError(e); }

  // create js directory in network directory
  try{ fs.mkdirSync(path.join( pathobj.networkpath, 'js' )); }
  catch(e){ showError(e); }

  // create gulp directory in network directory
  try{ fs.mkdirSync(path.join( pathobj.networkpath, pathobj.projectname + '-gulp' )); }
  catch(e){ showError(e); }

  // create css directory for final site
  try{ fs.mkdirSync( pathobj.csspath ); }
  catch(e){ showError(e); }

  // create js directory for final site
  try{ fs.mkdirSync( pathobj.jspath ); }
  catch(e){ showError(e); }

  // create image directory for final site
  try{ fs.mkdirSync( pathobj.imagepath ); }
  catch(e){ showError(e); }
}

function reset(){
  $('#projectname').val('');

  $('#networkdir').val('');
  $('#networkdir').siblings('.feedback').val(' ');

  $('#homedir').val('');
  $('#homedir').siblings('.feedback').val(' ');

  $('#cssdir').val('');
  $('#cssdir').siblings('.feedback').val(' ');

  $('#jsdir').val('');
  $('#jsdir').siblings('.feedback').val(' ');

  $('#imagedir').val('');
  $('#imagedir').siblings('.feedback').val(' ');

  for (each in pathobj){
    pathobj[each] = false;
  }
  for (each in optionsobj){
    optionsobj[each] = false;
  }

  $('#check-detail').prop('checked',false);
  $('#check-compass').prop('checked',false);
}

function createGulpFile(){
  var csspath = pathobj.cssclean === true ? pathobj.cssclean : pathobj.csspath;
  var imagepath = pathobj.imageclean === true ? pathobj.imageclean : pathobj.imagepath;
  var code = "var gulp = require('gulp'),\n" +
    "\tsass = require('gulp-sass'),\n" +
    "\tautoprefixer = require('gulp-autoprefixer'),\n" +
    "\tminifycss = require('gulp-minify-css'),\n" +
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
      if ( optionsobj.c_compass ) {
        code += "\t\t.pipe(compass({\n" +
          "\t\t\tproject: '/',\n" +
          "\t\t\tcss: '#',\n".replace('#',csspath) +
          "\t\t\tsass: '#',\n".replace('#',path.join(pathobj.homepath,'sass')) +
          "\t\t\timage: '#',\n".replace('#',imagepath) +
          "\t\t\tcomments: false,\n" +
          "\t\t\trelative: false\n" +
          "\t\t}))\n";
      } else {
        code += "\t\t.pipe(sass({ style: 'expanded' }))\n";
      }
      code += "\t\t.pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))\n";
      if (pathobj.networkpath){
       code += "\t\t.pipe(gulp.dest('#'))\n".replace('#',path.join(pathobj.networkpath,'css'));
      }
      code += "\t\t.pipe(rename({suffix: '.min'}))\n" +
      "\t\t.pipe(minifycss())\n" +
      "\t\t.pipe(gulp.dest('#'))\n".replace('#',pathobj.csspath) +
      "\t\t.pipe(notify({message: 'styles task complete' }));\n" +
  "});\n" +

  "gulp.task('scripts', function(){\n" +
    "\treturn gulp.src('js/**/*.js')\n" +
      "\t\t.pipe(jshint())\n" +
      "\t\t.pipe(jshint.reporter('default'))\n";
      if (pathobj.networkpath){
        code += "\t\t.pipe(gulp.dest('#'))\n".replace('#',path.join(pathobj.networkpath,'js'));
      }
      code += "\t\t.pipe(concat('#.js'))\n".replace('#',pathobj.projectname) +
      "\t\t.pipe(rename({suffix:'.min'}))\n" +
      "\t\t.pipe(uglify())\n" +
      "\t\t.pipe(gulp.dest('#'))\n".replace('#',pathobj.jspath) +
      "\t\t.pipe(notify({message: 'scripts task complete' }));\n" +
  "});\n" +

  "gulp.task('images', function() {\n" +
    "\treturn gulp.src('images/**/*')\n" +
      "\t\t.pipe(cache(imagemin({ optimizationLevel: 3, progressive: true, interlaced: true })))\n" +
      "\t\t.pipe(gulp.dest('#'))\n".replace('#',pathobj.imagepath) +
      "\t\t.pipe(notify({ message: 'images task complete' }));\n" +
  "});\n" +

  "gulp.task('copy', function(){\n" +
    "\treturn gulp.src(filesToMove,{base:'./'})\n" +
    "\t\t.pipe(gulp.dest('#'))\n".replace('#',path.join( pathobj.networkpath,pathobj.projectname + '-gulp'));
    code+= "\t\t.pipe(notify({message: 'project copied' }));\n" +
    "});\n" +
  
  "gulp.task('watch', function() {\n" +

    "\tgulp.watch('sass/**/*.scss',['styles']);\n" +
    "\tgulp.watch('js/**/*.js',['scripts']);\n" +
    "\tgulp.watch('images/**/*', ['images']);\n" +
  "});"; 
  return code;
}

function createPackageJson(){
  var code = '{\n' +
  '\t"name": "#",\n'.replace('#',pathobj.projectname);
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
    '\t\t"gulp-compass": "^1.1.9"\n' +
  '\t}\n' +
  '}\n';
  return code;
}

function createMainSass(){
  var code = '@import "utility";\n';
  return code;
}

function createUtilitySass() {
  var code = "//*-------------------------------*//\n" +
  "//    Mixins\n" +
  "//*-------------------------------*//\n\n" +
  "@mixin bgImg($imgName,$repeat:no-repeat,$xPos:left,$yPos:top,$color:transparent) {\n" +
  "\tbackground: url(&/#{imgName}) $repeat $xPos $yPos $color;\n".replace('&',pathobj.imagepath);
  code += "}\n\n" +
   "//*-------------------------------*//\n" +
   "//    Misc\n" +
   "//*-------------------------------*//\n\n" +
   "//*** clearfix ***/\n" +
   ".cf:before,\n" +
   ".cf:after {\n" +
   "\tcontent:' ';\n" +
   "\tdisplay: table;\n" +
   "}\n" +
   ".cf:after {\n" +
   "\tclear:both;\n" +
   "}";
   if ( optionsobj.c_detail ) {
     code += "\n//*-------------------------------*//\n" +
     "//    Detail page reset\n" +
     "//*-------------------------------*//\n\n" +
     ".page-container, #pdp_wrapper { overflow: visible;}\n" +
     "#dvTabContentContainer p { margin:0; }\n" +
     "#dvTabContentContainer ul li { list-style:none; }\n" +
     "#dvTabContentContainer ul { padding:0; margin:0; }";
   }
   return code;
}

function createHtml() {
  var jspath = pathobj.jsclean !== false ? pathobj.jsclean : pathobj.jspath;
  var csspath = pathobj.cssclean !== false ? pathobj.cssclean : pathobj.csspath;

  var code ='<link rel="stylesheet" href="#">\n\n\n\n'.replace('#', csspath + '/' + pathobj.projectname + '.min.css');
  
  if ( optionsobj.c_detail ) {
    code+='[externalScript src="#"]'.replace('#', jspath + '/' + pathobj.projectname + '.min.js');
  } else {
    code+='<script src="#"></script>\n'.replace('#', jspath + '/' + pathobj.projectname + '.min.js');
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


// require('nw.gui').Window.get().showDevTools();