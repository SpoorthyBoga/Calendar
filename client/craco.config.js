module.exports = {
    webpack: {
      configure: (webpackConfig) => {
        // Find the source-map-loader rule
        const sourceMapRule = webpackConfig.module.rules.find(
          (rule) =>
            rule.use && rule.use.some && rule.use.some((use) => use.loader && use.loader.includes("source-map-loader")),
        )
  
        if (sourceMapRule) {
          // Exclude problematic packages from source-map-loader
          sourceMapRule.exclude = [
            /node_modules\/@reduxjs\/toolkit/,
            /node_modules\/react-redux/,
            /node_modules\/react-dom/,
          ]
        }
  
        return webpackConfig
      },
    },
  }
  