// default settings. fis3 release
// fis.set('project.charset', 'utf8');
// fis.set('project.fileType.text', 'htm');
fis.set('project.ignore', ['/fis-conf.js', '/iisnode/**', '/css/**.less', '/node_modules/**', 'server.log', '/app.js', '/**/**.cs', '/bin/**','/obj/**','**.csproj**','.jshintrc','**eb.*.config']);
fis.config.set('settings.optimizer.uglify-js', {
    mangle: false
});

// Global start
fis.match('/css/**.css', {
    release: '/static$0',
    useHash: true
});

fis.match('/css/**.css.map', {
    release: '/static$0'
});

fis.match('/widget/**', {
    release: false
});

fis.match('/widget/aio.js', {
    release: '/static$0',
    useHash: true
});

fis.match('/images/**', {
    release: '/static$0',
    useHash: true
});


// Global end

// test start
// fis.media('test').match('/widget/**.js', {
// optimizer: fis.plugin('uglify-js')
// });

// fis.media('test').match('/images/**.png', {
// optimizer: fis.plugin('png-compressor')
// });

fis.media('test').match('/css/**.css', {
    optimizer: fis.plugin('clean-css')
});

fis.media('test').match('*.html', {
    optimizer: fis.plugin('html-compress')
});
// test end

// Publish start
fis.media('pub').match('/inc/**', {
    url: '$0',
    domain: 'http://wechat.ieye.net.cn'
});

fis.media('pub').match('{/css/**,/images/**,/widget/**}', {
    url: '$0',
    domain: 'http://wechat.ieye.net.cn/static'
});

fis.media('pub').match('/widget/**.js', {
    optimizer: fis.plugin('uglify-js')
});

// fis.media('pub').match('/images/**.png', {
// optimizer: fis.plugin('png-compressor')
// });

fis.media('pub').match('/css/**.css', {
    optimizer: fis.plugin('clean-css')
});

fis.media('pub').match('*.html', {
    optimizer: fis.plugin('html-compress')
})
// Publish end