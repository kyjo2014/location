// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import VueSocket from 'vue-socket.io'
import AMap from 'vue-amap';


Vue.use(VueSocket, 'http://localhost:3000');
Vue.use(AMap);



// 初始化vue-amap
AMap.initAMapApiLoader({
  // 高德的key
  key: 'aebe6fc99979b76fec3d0ea5a6884e3d',
  // 插件集合
  plugin: ['AMap.Geolocation', 'AMap.Autocomplete', 'AMap.PlaceSearch', 'AMap.Scale', 'AMap.OverView', 'AMap.ToolBar', 'AMap.MapType', 'AMap.PolyEditor', 'AMap.CircleEditor']
});

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: {
    App
  }
})
