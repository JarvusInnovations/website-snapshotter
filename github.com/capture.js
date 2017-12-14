require('website-snapshotter').capture(__dirname, 'https://github.com', {
    'homepage': '/',
    'repository': '/JarvusInnovations/website-snapshotter',

    'source-js': {
        path: '/JarvusInnovations/website-snapshotter/blob/master/index.js',
        waitFor: 'td#L1'
    }
});
