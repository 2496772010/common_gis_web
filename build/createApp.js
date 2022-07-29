'use strict';
const path = require('path')
const fileSave = require('file-save')

const appName = process.argv[2]

if (!appName) {
    console.log('组件名不能为空！')
    process.exit(1)
}

const app = path.resolve(__dirname, '../src/pages', appName)

const appNameVue = appName + 'App'
const Files = [
    //main.js
    {
        fileName: `${appName}.js`,
        content: `import { createApp } from 'vue'
        import ElementPlus from 'element-plus'
        import 'element-plus/dist/index.css'
        import App from './${appNameVue}.vue'
        const app = createApp(App)
        app.use(ElementPlus)
        app.mount('#${appNameVue}')
`
    },
    //index.html
    {
        fileName: `${appName}.html`,
        content: `<!DOCTYPE html>
<html lang="">
<head>
  <meta charset="utf-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width,initial-scale=1.0">
  <title><%= htmlWebpackPlugin.options.title %></title>
  <style>
    body {
      width: 100%;
      height: 100%;
      position: absolute;
      padding: 0;
      margin: 0;
    }
  </style>
</head>
<body>
<noscript>
  <strong>We're sorry but <%= htmlWebpackPlugin.options.title %> doesn't work properly without JavaScript enabled.
    Please enable it to continue.</strong>
</noscript>
<div id="${appNameVue}"></div>
<!-- built files will be auto injected -->
</body>

</html>
`
    },
    //App.vue
    {
        fileName: `${appName}App.vue`,
        content: `<template>
  <div id="${appNameVue}">
    
  </div>
</template>

<script>

  export default {
    name: "${appNameVue}",
    data() {
      return {
        
      }
    },
    methods: {
     
  }}
</script>

<style scoped>
  #${appNameVue} {
    width: 100%;
    height: 100%;
    position: absolute;
    padding: 0;
    margin: 0;
    
  }
</style>
`
    }
]

// 创建页面
Files.forEach(file => {
    fileSave(path.join(app, file.fileName))
        .write(file.content, 'utf8')
        .end('\n');
});


