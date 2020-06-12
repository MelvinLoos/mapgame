import Vue from 'vue';
// firebase
import * as firebase from 'firebase/app';
import { rtdbPlugin } from 'vuefire';
// css framework buefy
import { BootstrapVue, IconsPlugin } from 'bootstrap-vue';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-vue/dist/bootstrap-vue.css';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faExclamationCircle, faCheck, faUserCircle, faUser, faSuitcase } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
// app files
import App from './App.vue';
import router from './router';
import store from './store';
import './validations';

library.add(faExclamationCircle, faCheck, faUserCircle, faUser, faSuitcase);
Vue.component('font-awesome-icon', FontAwesomeIcon);
// Install BootstrapVue
Vue.use(BootstrapVue)
// Optionally install the BootstrapVue icon components plugin
Vue.use(IconsPlugin)

Vue.config.productionTip = false;

let app = '';

const firebaseConfig = {
  apiKey: process.env.VUE_APP_APIKEY,
  authDomain: process.env.VUE_APP_AUTHDOMAIN,
  databaseURL: process.env.VUE_APP_DATABASEURL,
  projectId: process.env.VUE_APP_PROJECTID,
  storageBucket: process.env.VUE_APP_STORAGEBUCKET,
  messagingSenderId: process.env.VUE_APP_MESSAGINGSENDERID,
  appId: process.env.VUE_APP_APPID,
};

firebase.initializeApp(firebaseConfig);
Vue.prototype.$db = firebase.database();
Vue.use(rtdbPlugin);

firebase.auth().onAuthStateChanged(() => {
  if (!app) {
    app = new Vue({
      router,
      store,
      render: h => h(App),
    }).$mount('#app');
  }
});
