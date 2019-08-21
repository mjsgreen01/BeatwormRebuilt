var path = require('path');
var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');
const isDev = process.env.NODE_ENV === 'development';
const isProd = !isDev;
const mode = isDev ? 'development' : 'production';

console.log(`
Building for ${process.env.NODE_ENV}:
    - process.env.NODE_ENV: ${process.env.NODE_ENV}
    - isDev: ${isDev}
    - isProd: ${isProd}
Directories:    
    - dist: ${path.resolve(__dirname, 'dist')}
    - src: ${path.resolve(__dirname, 'src')}
`);

const plugins = [
    new webpack.DefinePlugin({
        'process.env': {
            'NODE_ENV': `"${process.env.NODE_ENV}"`
        }
    }),
    new HtmlWebpackPlugin({
        filename: path.resolve(__dirname, 'dist/index.html'),
        template: path.resolve(__dirname, 'src/index.html'),
    })
];

module.exports = {
    plugins,
    entry: ["@babel/polyfill", './src/index.jsx'],
    mode,
    output: {
        path: path.join(__dirname, 'dist'),
        filename: 'index.[contenthash].js',
        publicPath: '/',
    },
    resolve: {
        modules: [path.resolve(__dirname, "node_modules"), path.resolve(__dirname, 'src')],
        extensions: ['.ts', '.tsx', '.js', '.jsx']
    },
    devtool: 'inline-source-map',
    devServer: {
        contentBase: path.resolve(__dirname, 'dist'),
        publicPath: '/',
        // port: 8888,
        historyApiFallback: true,
        // https: true,
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/
            },
            {
                test: /\.jsx?$/,
                loaders: [
                    'babel-loader',
                ],
                exclude: /node_modules/
            },
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader'],
            },
            {
                test: /\.scss$/,
                exclude: /node_modules/,
                use: [{
                    loader: "style-loader" // creates style nodes from JS strings
                }, {
                    loader: "css-loader", options: { importLoaders: 2 } // translates CSS into CommonJS
                }, {
                    loader: "postcss-loader" // auto-prefixer
                }, {
                    loader: "sass-loader" // compiles Sass to CSS
                }]
            },{
                test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
                use: [{
                    loader: 'file-loader',
                    options: {
                        name: '[name].[ext]',
                        outputPath: 'fonts/'
                    }
                }]
            }]
    },
    stats: {
        colors: true,
        chunks: false
    }
};
