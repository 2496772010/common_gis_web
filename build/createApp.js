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
        content: `import {createApp} from 'vue'
import {
  ElButton,
  ElAutocomplete,
  ElAside,
  ElContainer,
  ElMain,
  ElMenu,
  ElMenuItem,
  ElSubmenu, ElInput, ElInputNumber,
  ElSelect, ElOption, ElForm, ElFormItem, ElTable, ElTableColumn
} from 'element-plus';
import App from './${appNameVue}.vue';
// 如果要使用.scss样式文件，则需要引入base.scss文件
import 'element-plus/lib/theme-chalk/index.css';
// import 'element-plus/packages/theme-chalk/src/base.scss'

const app = createApp(App)
app.component(ElButton.name, ElButton)
app.component(ElAutocomplete.name, ElAutocomplete)
app.component(ElAside.name, ElAside)
app.component(ElContainer.name, ElContainer)
app.component(ElMain.name, ElMain)
app.component(ElMenu.name, ElMenu)
app.component(ElMenuItem.name, ElMenuItem)
app.component(ElSubmenu.name, ElSubmenu)
app.component(ElInput.name, ElInput)
app.component(ElInputNumber.name, ElInputNumber)
app.component(ElSelect.name, ElSelect)
app.component(ElOption.name, ElOption)
app.component(ElForm.name,ElForm)
app.component(ElFormItem.name,ElFormItem)
app.component(ElTable.name,ElTable)
app.component(ElTableColumn.name,ElTableColumn)
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


