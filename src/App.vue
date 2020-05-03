<template>
  <div id="app">
    <nav id="topmenu" class="navbar" role="navigation" aria-label="main navigation">
      <div class="navbar-brand">
        <a class="navbar-item" href="/">
          <b>The Game</b> <span><i>You lost</i></span>
        </a>
        <!-- eslint-disable-next-line -->
        <a role="button" class="navbar-burger burger" aria-label="menu" aria-expanded="false" data-target="navbarTopMenu" v-on:click="showNav = !showNav" v-bind:class="{ 'is-active' : showNav }">
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
        </a>
      </div>
      <div id="navbarTopMenu" class="navbar-menu" v-bind:class="{ 'is-active' : showNav }">
        <div class="navbar-start">
        </div>
        <div class="navbar-end">
          <div class="navbar-item">
            <div class="buttons">
              <a v-if="authenticated" class="button" @click="logout">Logout</a>
              <span v-else>
                <router-link class="button is-primary" to="/sign-up">
                  <strong>Sign up</strong>
                </router-link>
                <router-link class="button is-light" to='/'>Login</router-link>
              </span>
            </div>
          </div>
        </div>
      </div>
    </nav>
    <router-view class="content" />
  </div>
</template>

<script>
import firebase from 'firebase';

export default {
  name: 'App',
  data() {
    return {
      showNav: false,
      latitude: '',
      longitude: ''
    }
  },
  computed: {
    authenticated() {
      let { currentUser } = firebase.auth();
      console.debug(currentUser);
      return currentUser != null;
    },
  },
  methods: {
    createUserData() {
      let userId = firebase.auth().currentUser.uid;
      let userData = {
        name: 'test',
        latitude: null,
        longitude: null
      };
      this.$db.ref("users/" + userId)
        .set(userData)
        .then(() => {
          console.log('user updated!')
        });
    },
    updatePosition() {
      let userId = firebase.auth().currentUser.uid;
      this.$db.ref("users/" + userId).update({ latitude: Number(this.latitude), longitude: Number(this.longitude) }).then(() => {
        console.log('user updated!')
      })
    },
    logout() {
      firebase.auth().signOut().then(() => {
        this.$router.replace('login');
        this.$toast.open({
          message: 'Successfully logged out!',
          position: 'is-bottom',
          type: 'is-success',
        });
      });
    },
  },
};
</script>

<style lang="scss">
$fa-font-path: "~font-awesome/fonts";

html, body
{
  height: 100%;
  overflow: hidden;
}

#app
{
  height: 100%;
}

#topmenu
{
  height: 7%
}

.content
{
  position: relative;
  height: 93%;
}
</style>
