module.exports = function (grunt) {

    var taskConfig = {
        pkg: grunt.file.readJSON('package.json'),
        meta: {
        banner: '/*\n' +
            ' *  <%= pkg.title || pkg.name %> - v<%= pkg.version %>\n' +
            ' *  <%= pkg.description %>\n' +
            ' *  <%= pkg.url %>\n' +
            ' *\n' +
            ' *  Made by <%= pkg.author %>\n' +
            ' *  Under <%= pkg.license %> License\n' +
            ' */\n'
        },
        concat: {
            options: {
                stripBanners: false,
                separator: ';\n',
                banner: '<%= meta.banner %>',
            },
            dist: {
                files: {
                    'dist/concat-standalone.js': ['src/loaderminigame/loader.js', 'src/loaderminigame/loaderminigame.js'],
                    'dist/concat-jquery.js': ['src/loaderminigame/loader.js', 'src/loaderminigame/loaderminigame.js', 'src/loaderminigame/jquery-loaderminigame.js'],
                },
//                src: [
//                    'src/loaderminigame/loader.js',
//                    'src/loaderminigame/loaderminigame.js'
//                ],
//                dest: 'dist/concat-standalone.js',
            },
//            jqueryplugin: {
//                src: [
//                    'src/loaderminigame/loader.js',
//                    'src/loaderminigame/loaderminigame.js'
//                    'src/loaderminigame/jquery-loaderminigame.js'
//                ],
//                dest: 'dist/concat-jquery.js',
//            },
        },
        jshint: {
            all: ['Gruntfile.js', 'src/**/*.js', 'tests/**/*.js'],
            options: {
                jshintrc: 'jshintrc.json'
            }
        },
        qunit: {
            all: ['tests/unit-tests.html']
        },
        uglify: {
            scripts: {
              src: ['dist/jquery-loaderminigame.js'],
              dest: 'dist/jquery-loaderminigame.min.js'
            },
            options: {
              banner: '<%= meta.banner %>'
            }
        },
        umd: {
//            all: {
//                options: {
//                    src: 'dist/concat-standalone.js',
//                    dest: 'dist/loaderminigame.js', // optional, if missing the src will be used
//
//                    // optional, a template from templates subdir
//                    // can be specified by name (e.g. 'umd'); if missing, the templates/umd.hbs
//                    // file will be used from [libumd](https://github.com/bebraw/libumd)
////            template: 'path/to/template.hbs',
//
//                    objectToExport: 'LoaderMiniGame', // optional, internal object that will be exported
//                    amdModuleId: 'loaderminigame', // optional, if missing the AMD module will be anonymous
//                    globalAlias: 'loaderminigame', // optional, changes the name of the global variable
//
//                    deps: {// optional, `default` is used as a fallback for rest!
//                        'default': ['$'],
//                        amd: ['jquery'],
//                        cjs: ['jquery'],
//                        global: ['jQuery']
//                    }
//                }
//            },
            jquery: {
                options: {
                    src: 'dist/concat-jquery.js',
                    dest: 'dist/jquery-loaderminigame.js', // optional, if missing the src will be used

                    // optional, a template from templates subdir
                    // can be specified by name (e.g. 'umd'); if missing, the templates/umd.hbs
                    // file will be used from [libumd](https://github.com/bebraw/libumd)
                    //template: 'path/to/template.hbs',

                    objectToExport: '$', // optional, internal object that will be exported
                    amdModuleId: 'loaderminigame', // optional, if missing the AMD module will be anonymous
                    //globalAlias: '$', // optional, changes the name of the global variable

                    deps: {// optional, `default` is used as a fallback for rest!
                        'default': ['$'],
                        amd: ['jquery'],
                        cjs: ['jquery'],
                        global: ['jQuery']
                    }
                }
            }
        },
        watch: {
            scripts: {
                files: ['src/**/*.js'],
                tasks: ['build'],
                options: {
//                    spawn: false,
                },
            },
        },
        clean: {
            build: {
                src: ['dist/concat-standalone.js', 'dist/concat-jquery.js']
            }
        }
    };

    grunt.initConfig(taskConfig);

    grunt.loadNpmTasks('grunt-umd');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-qunit');
    grunt.loadNpmTasks('grunt-contrib-uglify');

    grunt.registerTask('default', ['jshint', 'concat', 'umd', 'uglify', 'clean']);
    grunt.registerTask('test', ['default', 'qunit']);
    grunt.registerTask('build', ['default']);
};

