var program = require('commander'),
    fs = require('fs'),
    shell = require('child_process');


// 处理参数
program
    .version('0.1.0')
    .option('-e, --env [env]', 'environment type [test|pub]', /^pub$/i, 'test')
    .option('-c, --clearcache [no cache]', 'environment type [true|false]', /^true|false$/i, false)
    .parse(process.argv);

process.stdout.write("please wait a moment ");
var interval_print = setInterval(function() {
    process.stdout.write(".");
}, 500);

// less
var doLess = function() {
    var r_index = 0,
        r_count = 1;

    var check_r_count = function() {
        if (++r_index >= r_count)
            doFis();
    };
    shell.exec("lessc css/style.less css/style.css", function(error) {
        if (error)
            console.log("\n", 50, error, "\n");
        check_r_count();
    });
}

// 执行fis操作
var doFis = function() {

    if (program.env == "test") {
        delete_tempFile();
        finish("./");
        return;
    }

    var fis_media = program.env,
        fis_releaseDir = "../" + program.env,
        fis_no_cache = Boolean(program.clearcache);

    // console.log(fis_no_cache);

    var cmd = "fis3 release " + fis_media;
    if (fis_no_cache)
        cmd += " -c ";
    cmd += " -d " + fis_releaseDir;

    shell.exec(cmd, function(error, stdout, stderr) {

        delete_tempFile();

        // 获取命令执行的输出
        if (error)
            console.log(error);

        finish(fis_releaseDir);
    });
};

// 修改index.html后缀
var change_index_ext = function(fis_releaseDir) {
    // fs.renameSync(fis_releaseDir + '/index.aspx', fis_releaseDir + '/index.html');
    // fs.unlink()
};

// 删除临时文件
var delete_tempFile = function() {
    // fs.unlink('./widget/aio.js');
};

// 输出成功信息，结束命令集
var finish = function(fis_releaseDir) {
    clearInterval(interval_print);
    console.log("\n" + "success. release dir:", fis_releaseDir);
};

// 开始方法：打包js
var r = function() {
    var r_index = 0,
        r_count = 1;

    if (program.env == "test") {
        doLess();
    } else {

        var check_r_count = function() {
            if (++r_index >= r_count)
                doLess();
        };
        shell.exec("node widget/r.js -o widget/build.js", function(error) {
            if (error)
                console.log("\n", 34, error, "\n");
            check_r_count();
        });
    }
}();