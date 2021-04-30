import Vue from 'vue';
import axios from 'axios';
import VueAxios from 'vue-axios';
import { BootstrapVue, IconsPlugin } from 'bootstrap-vue';
import App from './App.vue';

// Import Bootstrap an BootstrapVue CSS files (order is important)
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-vue/dist/bootstrap-vue.css';

// Make BootstrapVue available throughout your project
Vue.use(BootstrapVue);
// Optionally install the BootstrapVue icon components plugin
Vue.use(IconsPlugin);

Vue.use(VueAxios, axios);

/* Integrating Axios */
axios.defaults.baseURL = 'http://localhost:3000/';

Vue.config.productionTip = false;

new Vue({
  render: (h) => h(App),
}).$mount('#app');
