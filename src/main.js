import Vue from 'vue';
import Buefy from 'buefy';
import App from './App.vue';
import 'buefy/dist/buefy.css';
import './scss/index.scss';

Vue.use(Buefy);

Vue.config.productionTip = false;

new Vue({
  render: (h) => h(App),
}).$mount('#app');
