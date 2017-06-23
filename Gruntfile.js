module.exports = function(grunt) {
  var version = 'iarxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
    return v.toString(16);
  });

  var taskConfig = {
    umd: {
        all: {
          options: {
            src: 'src/loaderminigame/*.js',
            dest: 'dist/loaderminigame.js', // optional, if missing the src will be used

            // optional, a template from templates subdir
            // can be specified by name (e.g. 'umd'); if missing, the templates/umd.hbs
            // file will be used from [libumd](https://github.com/bebraw/libumd)
//            template: 'path/to/template.hbs',

            objectToExport: '$', // optional, internal object that will be exported
//            amdModuleId: 'id', // optional, if missing the AMD module will be anonymous
//            globalAlias: 'alias', // optional, changes the name of the global variable

            deps: { // optional, `default` is used as a fallback for rest!
              'default': ['$'],
              amd: ['jquery'],
              cjs: ['jquery'],
              global: ['jQuery']
            }
          }
        }
      }
  };

  grunt.initConfig( taskConfig );

  grunt.loadNpmTasks('grunt-umd');

};

