module.exports = {
    configureWebpack: {
        devtool: 'source-map'
    },    
    publicPath: process.env.NODE_ENV === 'production'
      ? '/dsci-554-projects/team1/'  //production path
      : '/'  //development path
  }