const path = require('path')

module.exports = {
    configureWebpack: {
        devtool: 'source-map'
    },
    publicPath: process.env.NODE_ENV === 'production' ?
        path.resolve(__dirname,'/dsci-554-projects/survivors') //production path
        :
        '/' //development path
}