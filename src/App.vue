<template>
  <b-container fluid class="px-0 bg-dark" id="app">
    <b-navbar toggleable="lg" type="dark" variant="dark">
      <b-navbar-brand href="#">
        <b>The Game</b> <span><i>You lost</i></span>
      </b-navbar-brand>
      <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

      <b-collapse id="nav-collapse" is-nav>
        <b-navbar-nav v-if="authenticated" class="ml-auto">
          <b-nav-item class="button" @click="logout">Logout</b-nav-item>
        </b-navbar-nav>
        <b-navbar-nav v-else class="ml-auto">
          <b-nav-item class="button is-primary" to="/sign-up">
            <strong>Sign up</strong>
          </b-nav-item>
          <b-nav-item class="button is-light" to='/'>Login</b-nav-item>
        </b-navbar-nav>
      </b-collapse>
    </b-navbar>
    <router-view class="content" />
  </b-container>
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
