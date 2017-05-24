module.exports=function(grunt){
    grunt.initConfig({
        watch:{
            jade:{
                files: ['app/views/**'],
                options: {
                    livereload: true
                }
            },
            js: {
                files: ['public/js/**','app/models/**/*.js','app/schemas/**/*.js'],
                //task: ['jshint'],
                options: {
                    livereload: true //当文件有改动，从新启动任务
                }
            }
        },
        nodemon:{//监控文件改变自动重启服务
            dev: {
                options: {
                    file: 'app.js',
                    args: [],
                    ignoredFiles: ['README.md','node_modules/**','.DS.Store'],
                    watchedExtensions: ['js'],
                    watchedFolders: ['app','config'],
                    debug: true,
                    delayTime: 1,
                    env: {
                        PORT: 3000
                    },
                    cwd: __dirname
                }
            }
        },
        concurrent: {//实时监控
            tasks:['nodemon','watch'],
            options: {
                logConcurrentOutput: true
            }
        },
        mochaTest: {//测试
            options: {
                reporter: 'spec'//内置报告的格式
            },
            src: ['test/**/*.js']
        }
    });
    grunt.option('force',true);//忽略警告
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-nodemon');
    grunt.loadNpmTasks('grunt-concurrent');
    grunt.loadNpmTasks('grunt-mocha-test');

    grunt.registerTask('default',['concurrent']);
    grunt.registerTask('test',['mochaTest']);
};
