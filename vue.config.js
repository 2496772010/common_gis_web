const debug = process.env.NODE_ENV !== 'production'
const path = require('path')
const fs = require('fs')
const root = './src/pages/'
const root1 = 'src/pages/'
const pages = fs.readdirSync(root)
let pageDict = {}
const agrv = process.argv
pages.forEach(file => {
  const page = root + file
  pageDict[file] = {
    template: '',
    entry: '',
    title: '',
    chunks: []
  }
  pageDict[file]['title'] = file
  pageDict[file]['chunks'] = ['chunk-vendors', 'chunk-common', file]
  fs.readdirSync(page).forEach(childFile => {
    if (childFile.search('.html') !== -1) {
      pageDict[file]['template'] = `${root1}${file}/${childFile}`
    } else if (childFile.search('.js') !== -1) {
      pageDict[file]['entry'] = `${root1}${file}/${childFile}`
    }
  })
})
const pageKey = agrv[4]
if (pageKey) {
  const tempDict = {}
  tempDict[pageKey] = pageDict[pageKey]
  pageDict = tempDict
}
module.exports = {
  publicPath: './', // 根域上下文目录
  outputDir: 'dist', // 构建输出目录
  assetsDir: 'assets', // 静态资源目录 (js, css, img, fonts)
  lintOnSave: false, // 是否开启eslint保存检测，有效值：ture | false | 'error'
  runtimeCompiler: true, // 运行时版本是否需要编译
  productionSourceMap: false, // 是否在构建生产包时生成 sourceMap 文件，false将提高构建速度
  configureWebpack: config => { // webpack配置，值位对象时会合并配置，为方法时会改写配置
    if (debug) { // 开发环境配置
      config.devtool = 'cheap-module-eval-source-map'
    } else { // 生产环境配置
    }
  },
  transpileDependencies: [
    'vuetify'
  ],
  pluginOptions: {
    'style-resources-loader': {
      preProcessor: 'less',
      patterns: [
        path.resolve(__dirname, './src/assets/style/varibles.less')
      ]
    }
  },
  css: {
    loaderOptions: {
      less: {
        lessOptions: {
          modifyVars: {
            'primary-color': '#ec6800'
          },
          javascriptEnabled: true
        }
      }
    }
  },
  devServer: {
    open: true,
    host: 'localhost',
    port: 8080,
    https: false,
    hotOnly: false,
    proxy: {
      '/': {
        target: 'http://localhost:8288',
        changeOrigin: true,
        pathRewrite: {
          '^/': ''
        }
      }
    }

  },
  pages: {
    index: 'src/main.js',
    medical: {
      entry: 'src/main.js',
      template: 'public/index.html',
      chunks: ['chunk-vendors', 'chunk-common', 'medical']
    },
    ...pageDict
  }
}

console.log(JSON.stringify(module.exports))
