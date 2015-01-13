/* global Window: false */
/* global $: false */
/* global require: false */
/* global console: false */

Window.width = 800;
Window.height = 800;
var fs = require('fs');
var path = require('path');
var createFile = require('../js/createFiles');

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

$('.js-closewindow').on('click', function () {
  $(this).closest('.window-message').fadeOut();
});

$('#js-createReset').on('click', reset);

$('#js-createButton').on('click', function () {
  console.log('clicked');
  $(this).html('<img src="images/ajax-loader.gif" />');
  var pathcheck = populatePaths();
  if (!pathcheck) return;
  console.log('passed pathcheck');
  createHomeDirs();
  createNetworkDirs();

  var gulpfile = createFile.createGulpFile(pathobj,optionsobj);
  var packagejson = createFile.createPackageJson(pathobj);
  var mainsass = createFile.createMainSass(pathobj);
  var html = createFile.createHtml(pathobj,optionsobj);
  var sbproj = createFile.createSublimeProject();
  var js;
  if (optionsobj.c_detail) {
    js = createFile.createDetailJS();
  } else {
    js = '';
  }

  fs.writeFile(path.join(pathobj.homepath, 'gulpfile.js'), gulpfile, function (err) {
    if (err) {
      showError(err);
    } else {
      console.log('gulpfile.js created');
    }
  });

  fs.writeFile(path.join(pathobj.homepath, 'package.json'), packagejson, function (err) {
    if (err) {
      showError(err);
    } else {
      console.log('package.json created');
    }
  });

  fs.writeFile(path.join(pathobj.homepath, pathobj.projectname + '.sublime-project'), sbproj, function (err) {
    if (err) {
      showError(err);
    } else {
      console.log('package.json created');
    }
  });

  fs.writeFile(path.join(pathobj.homepath, 'sass', pathobj.projectname + '.scss'), mainsass, function (err) {
    if (err) {
      showError(err);
    } else {
      console.log('main Sass created');
    }
  });

  fs.writeFile(path.join(pathobj.homepath, 'sass', '_utility.scss'), utilitysass, function (err) {
    if (err) {
      showError(err);
    } else {
      console.log('utility Sass created');
    }
  });

  fs.writeFile(path.join(pathobj.homepath, 'js', pathobj.projectname + '.js'), js, function (err) {
    if (err) {
      showError(err);
    } else {
      console.log('js file created');
    }
  });

  fs.writeFile(path.join(pathobj.homepath, 'html', pathobj.projectname + '.html'), html, function (err) {
    if (err) {
      showError(err);
    } else {
      console.log('html created');
    }
  });
  // copy jshint file from server to local directory
  var jshintpath = pathobj.networkpath.split('500 Web Marketing')[0] + '500 Web Marketing/Design and Front-end/front-end/jshint/jshintrc.json';

  if ( fs.existsSync(jshintpath) ){
    var jshintfile = fs.readFileSync(jshintpath);
    fs.writeFile(path.join(pathobj.homepath,'.jshintrc'),jshintfile,function (err) {
      if(err) {
        showError(err);
      } else {
        console.log('.jshintrc file created');
      }
    });
  }


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

function showError (message) {
  $('#js-createButton').text('create project');
  $('.js-window-error').find('.js-message').text(message);
  $('.js-window-error').fadeIn(100);
  console.log(message);
}

function showSuccess (message) {
  $('#js-createButton').text('create project');
  $('.js-window-success').find('.js-message').text(message);
  $('.js-window-success').fadeIn(100);
  console.log(message);
}

function populatePaths () {
  // check to see if project name is there and store it if not return error and throw false
  if ($('#projectname').val()) {
    pathobj.projectname = $('#projectname').val().split(' ').join('-');
  } else {
    showError('project name required');
    return false;
  }
  console.log('projectname passed');
  // check to see if home directory is there and store it if not return error and throw false, these first two values must be there
  if ($('#homedir').val()) {
    pathobj.homepath = path.join($('#homedir').val(), pathobj.projectname + '-gulp');
  } else {
    showError('home directory required');
    return false;
  }
  console.log('homedir passed');
  if ($('#networkdir').val()) pathobj.networkpath = path.join($('#networkdir').val(), 'front-end');
  if ($('#cssdir').val()) pathobj.csspath = path.join($('#cssdir').val(), pathobj.projectname);
  if ($('#jsdir').val()) pathobj.jspath = path.join($('#jsdir').val(), pathobj.projectname);
  if ($('#imagedir').val()) pathobj.imagepath = path.join($('#imagedir').val(), pathobj.projectname);

  if (pathobj.csspath.split('Volumes').length > 1) {
    pathobj.cssclean = pathobj.csspath.split('Volumes')[1];
  }
  if (pathobj.jspath.split('Volumes').length > 1) {
    pathobj.jsclean = pathobj.jspath.split('Volumes')[1];
  }
  if (pathobj.imagepath.split('Volumes').length > 1) {
    pathobj.imageclean = pathobj.imagepath.split('Volumes')[1];
  }

  optionsobj.c_detail = $('#check-detail').prop('checked');
  optionsobj.c_compass = $('#check-compass').prop('checked');

  return true;
}

function createHomeDirs() {
  // create home directory called projectname-gulp
  try { fs.mkdirSync(pathobj.homepath); }
  catch (e) { showError(e); }
  // create html dir
  try { fs.mkdirSync(path.join(pathobj.homepath, 'html')); }
  catch (e) { showError(e); }
  // create projectname.html

  // create js dir
  try { fs.mkdirSync(path.join(pathobj.homepath, 'js')); }
  catch (e) { showError(e); }
  // create projectname.js

  // create sass dir
  try { fs.mkdirSync(path.join(pathobj.homepath, 'sass')); }
  catch (e) { showError(e); }
  // create projectname.scss utility.scss with mixins

  // create images dir
  try { fs.mkdirSync(path.join(pathobj.homepath, 'images')); }
  catch (e) { showError(e); }
}

function createNetworkDirs() {
  // create front end directory
  try { fs.mkdirSync(pathobj.networkpath); }
  catch (e) { showError(e); }

  // create css directory in network directory
  try { fs.mkdirSync(path.join(pathobj.networkpath, 'css')); }
  catch (e) { showError(e); }

  // create js directory in network directory
  try { fs.mkdirSync(path.join(pathobj.networkpath, 'js')); }
  catch (e) { showError(e); }

  // create gulp directory in network directory
  try { fs.mkdirSync(path.join(pathobj.networkpath, pathobj.projectname + '-gulp')); }
  catch (e) { showError(e); }

  // create css directory for final site
  try { fs.mkdirSync(pathobj.csspath); }
  catch (e) { showError(e); }

  // create js directory for final site
  try { fs.mkdirSync(pathobj.jspath); }
  catch (e) { showError(e); }

  // create image directory for final site
  try { fs.mkdirSync(pathobj.imagepath); }
  catch (e) { showError(e); }
}

function reset() {
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

  $('#check-detail').prop('checked', false);
  $('#check-compass').prop('checked', false);
}




// require('nw.gui').Window.get().showDevTools();