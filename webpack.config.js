module.exports = {
    entry: {
        index:"./app/src/components/Index.jsx"
    },
    output: {
        path: __dirname,
        filename: "./public/js/[name]Bundle.js"
    },
     module: {
        loaders: [
            {
                //tell webpack to use jsx-loader for all *.jsx files
                test: /\.jsx$/,
                loader: 'jsx-loader?insertPragma=React.DOM&harmony'
            },
            // SASS
            {
              test: /\.scss$/,
              loader: 'style!css!sass'
            }
        ]
    },
    resolve: {
        extensions: ['', '.js', '.jsx']
    }
};