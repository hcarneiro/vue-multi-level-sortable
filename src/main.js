import Vue from 'vue';
import Buefy from 'buefy';
import App from './App.vue';
import store from './store';
import 'buefy/dist/buefy.css';
import './scss/index.scss';

Vue.config.productionTip = false;

Vue.use(Buefy);

new Vue({
  store,
  render: (h) => h(App),
}).$mount('#app');
