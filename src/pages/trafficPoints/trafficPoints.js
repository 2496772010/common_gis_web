import {createApp} from 'vue'
import {
    ElButton,
    ElAutocomplete,
    ElAside,
    ElContainer,
    ElMain,
    ElMenu,
    ElMenuItem,
    ElSubmenu, ElInput, ElInputNumber,
    ElSelect, ElOption, ElForm, ElFormItem, ElTable, ElTableColumn, ElDialog, ElColorPicker
} from 'element-plus';
import App from './trafficPointsApp.vue';
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
app.component(ElForm.name, ElForm)
app.component(ElFormItem.name, ElFormItem)
app.component(ElTable.name, ElTable)
app.component(ElTableColumn.name, ElTableColumn)
app.component(ElDialog.name, ElDialog)
app.component(ElColorPicker.name, ElColorPicker)
app.mount('#trafficPointsApp')

