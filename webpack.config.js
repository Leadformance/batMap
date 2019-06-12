const path = require('path');
const LoaderOptionsPlugin = require('webpack').LoaderOptionsPlugin;

module.exports = {
    entry: {
        gmaps: './src/providers/gmaps/Gmaps.js',
        mappy: './src/providers/mappy/Mappy.js'
    },
    output: {
        filename: '[name].js',
        path: path.join(__dirname, 'dist')
    },
    plugins: [
       new LoaderOptionsPlugin({ options: {} })
    ],
    mode: "development",
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                enforce: "pre",
                loader: "jshint-loader",
                options: {
                    bitwise: true,
                    camelcase: true,
                    curly: true,
                    eqeqeq: true,
                    freeze: true,
                    immed: true,
                    indent: 4,
                    latedef: 'nofunc',
                    maxcomplexity: 8,
                    maxdepth: 4,
                    newcap: true,
                    noarg: true,
                    noempty: true,
                    nonbsp: true,
                    nonew: true,
                    quotmark: 'single',
                    strict: true,
                    undef: true,
                    unused: true,
                    varstmt: true,

                    // Relaxing options
                    eqnull: true,
                    esnext: true,
                    globalstrict: true,

                    // Environments
                    browser: true,
                    globals: {
                        console: true,
                        google: true,
                        L: true,
                        window: true
                    }
                },
            },
            {
                test:/\.js$/,
                exclude: /node_modules/,
                loader: 'babel-loader',
                options: {
                    presets: ['@babel/preset-env']
                }
            },
            {
                test:/\.css$/,
                loader: 'style-loader!css-loader'
            }
        ]
    }
};
