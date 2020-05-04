import Vue from 'vue';
// firebase
import * as firebase from 'firebase/app';
import { rtdbPlugin } from 'vuefire';
// css framework buefy
import Buefy from 'buefy';
import 'buefy/dist/buefy.css'
import { library } from '@fortawesome/fontawesome-svg-core';
import { faExclamationCircle, faCheck, faUserCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
// app files
import App from './App.vue';
import router from './router';
import store from './store';
import './validations';

library.add(faExclamationCircle, faCheck, faUserCircle);
Vue.component('vue-fontawesome', FontAwesomeIcon);
Vue.use(Buefy, {
  defaultIconComponent: 'vue-fontawesome',
  defaultIconPack: 'fa',
});

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
