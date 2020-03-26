import Vue from 'vue';
import Buefy from 'buefy';
import App from './App';
import 'buefy/dist/buefy.css';
import './scss/index.scss';

Vue.use(Buefy);

/* eslint-disable no-new */
new Vue({
  el: 'body',
  components: { App },
});
