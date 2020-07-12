const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
    entry:  './src/js/index.js',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'bundle.js'
    },
    devServer: {
        contentBase: './dist'
    },
    plugins: [
        new HtmlWebpackPlugin({
            filename: 'index.html',
            template: './src/index.html'
        })
    ],
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: [
                            [
                                // Fix Uncaught ReferenceError: regeneratorRuntime is not defined when using async/await
                                // https://github.com/babel/babel/issues/9849#issuecomment-656703232
                                '@babel/preset-env', 
                                {
                                    targets: {
                                        esmodules: true
                                    }
                                }
                            ]
                        ],
                    },
                }
            }
        ]
    }
}