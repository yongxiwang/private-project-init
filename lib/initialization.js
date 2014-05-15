'use strict';

module.exports = function(project, version) {
    var fs = require('fs'),
        fsTools = require('fs-tools'),
        mkdirp = require('mkdirp'),
        path = require('path'),
        colors = require('colors'),
        _ = require('lodash'),
        Promise = require('promise'),
        info = require('./info');

    var workDir = process.cwd(),
        baseDir = path.join(__dirname, '..'),
        assetsDir = path.join(baseDir, 'assets'),
        templatesDir = path.join(baseDir, 'templates');

    var readFile = Promise.denodeify(fs.readFile),
        writeFile = Promise.denodeify(fs.writeFile);

    function start() {
        version = version || '0.0.1';
        info.log('开始生成项目，项目名:' + project.cyan + '，项目版本:' + version.cyan);
        info.log('工作目录: ' + workDir.cyan);
        startCreateFolder();
    }

    function startCreateFolder() {
        info.log('创建必要的目录:');
        Promise.all([
                createFolder('app'),
                createFolder('app/images'),
                createFolder('app/styles'),
                createFolder('app/scripts'),
                createFolder('app/pages'),
                createFolder('test'),
                createFolder('docs')
            ])
            .done(startCreateFiles, failed);
    }

    function createFolder(dir) {
        return new Promise(function(resolve, reject) {
            mkdirp(dir, function(err) {
                if (err) {
                    reject('创建目录失败: ' + dir);
                }
                else {
                    info.log('+ ' + (dir + '/').cyan);
                    resolve();
                }
            });
        });
    }

    function startCreateFiles() {
        info.log('创建必要的配置文件:');
        var promiseArr = [];
        fsTools.walkSync(assetsDir, function(path) {
            path = path.replace(/\\/g, '\/');
            var sub = path.replace(new RegExp('^' + assetsDir + '/'), '');
            promiseArr.push(copyFile(path, workDir + '/' + sub));
        });
        promiseArr.push.apply(promiseArr, [createPackageFile(), createGruntFile()]);
        Promise.all(promiseArr)
            .done(done, failed);
    }

    function copyFile(src, dest) {
        return new Promise(function(resolve, reject) {
            if (fs.existsSync(src)) {
                info.log('+ ' + (workDir ? dest.replace(new RegExp('^' + workDir + '/'), '') : dest).cyan);
                fsTools.copy(src, dest, function(err) {
                    if (err) {
                        reject('拷贝文件失败: "' + src + '" -> "' + dest + '"');
                    } else {
                        resolve();
                    }
                });
            } else {
                reject('源文件不存在: ' + src);
            }
        });
    }

    function createPackageFile() {
        info.log('+ ' + 'package.json'.cyan);
        return readFile(templatesDir + '/package.tmpl', 'utf8').then(function(data) {
            return writeFile(workDir + '/package.json', _.template(data, { project: project, version: version }), 'utf8');
        });
    }

    function createGruntFile() {
        info.log('+ ' + 'Gruntfile.js'.cyan);
        return readFile(templatesDir + '/gruntfile.tmpl', 'utf8').then(function(data) {
            return writeFile(workDir + '/Gruntfile.js', _.template(data, { project: project, version: version }), 'utf8');
        });
    }

    function done() {
        info.log('');
        info.log('快速搭建项目完成'.green);
        info.log('* 如果使用 Mac OS X 系统，还需要安装libpng组件，grunt-contrib-imagemin依赖libpng组件压缩PNG图片');
        info.log('* 执行命令 "sudo brew install libpng" 安装');
        info.log('* 执行命令 "grunt build"，测试项目生成是否成功');
    }

    function failed(err) {
        info.fatal(err);
    }

    start();
};