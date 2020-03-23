import Vue from 'vue';
import { Plugin } from 'vue-fragment';
import Buefy from 'buefy';
import App from './App.vue';
import 'buefy/dist/buefy.css';
import './scss/index.scss';

Vue.use(Buefy);
Vue.use(Plugin);

Vue.config.productionTip = false;

new Vue({
  render: (h) => h(App),
}).$mount('#app');
