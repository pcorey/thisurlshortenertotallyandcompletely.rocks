module.exports = function(grunt) {
    grunt.initConfig({
        jekyll: {
            serve: {
                options: {
                    serve: true,
                    watch: true
                }
            }
        },
        less: {
            development: {
                options: {
                    paths: ['./_less'],
                    yuicompress: true
                },
                files: {
                    'css/main.css': '_less/main.less'
                }
            }
        },
        watch: {
            less: {
                files: ['_less/**/*.less'],
                tasks: ['less']
            }
        },
        concurrent: {
            all: {
                tasks: ['jekyll:serve', 'watch'],
                options: {
                    logConcurrentOutput: true
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-jekyll');
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-concurrent');

    grunt.registerTask('default', ['concurrent:all']);
};