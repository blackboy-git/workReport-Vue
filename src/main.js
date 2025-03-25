// import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate';
// 引入 lucide-vue-next 中的图标组件
import { CheckCircle, XCircle } from 'lucide-vue-next';
// 如果您正在使用CDN引入，请删除下面一行。
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

//引入ECharts
import * as echarts from 'echarts';

import App from './App.vue'
import router from './router'

try{
    const pinia = createPinia();
    pinia.use(piniaPluginPersistedstate);
    
    const app = createApp(App);
    app.use(pinia);
    app.use(router);
    app.use(ElementPlus);
    for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
        app.component(key, component)
      }

    app.config.globalProperties.$echarts = echarts;

    
    app.mount('#app');
}catch(error){
    console.error('应用初始化失败:',error);
}

