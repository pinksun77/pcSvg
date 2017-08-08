// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-default/index.css'
import App from './App.vue'
import router from './router'

Vue.use(ElementUI)

Vue.filter("color", function (value) {
  if (!value && value != 0) {
    return ""
  }
  let result = "";
  result = "#"+value.slice(0,4);
  return result;
});
Vue.prototype.filterColor = function (valve) {
  if (!value && value != 0) {
    return ""
  }
  let result = "";
  result = "#"+value.slice(0,4);
  return result;
};
global.filterColor = function (valve) {
  if (!value && value != 0) {
    return ""
  }
  let result = "";
  result = "#"+value.slice(0,4);
  return result;
};


Vue.config.productionTip = false;

/* eslint-disable no-new */
new Vue({
  el: '#app',
    render: h => h(App),
  router,
  template: '<App/>',
  components: { App }
});
