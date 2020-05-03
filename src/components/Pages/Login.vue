<template>
  <div class="container">
    <div class="columns is-desktop">
      <div class="column is-half is-offset-one-quarter">
        <div class="card" style="margin-top:50px;">
          <div class="card-content">
            <h2 class="title is-2">Login</h2>

            <div class="field">
              <p class="control has-icons-left has-icons-right">
                <input class="input" type="email" placeholder="Email" v-model="email">
                <span class="icon is-small is-left">
                  <i class="fa fa-envelope"></i>
                </span>
                <span class="icon is-small is-right">
                  <i class="fa fa-check"></i>
                </span>
              </p>
            </div>
            <div class="field">
              <p class="control has-icons-left">
                <input
                  class="input"
                  type="password"
                  placeholder="Password"
                  v-model="password"
                  v-on:keyup.enter="login">
                <span class="icon is-small is-left">
                  <i class="fa fa-lock"></i>
                </span>
              </p>
            </div>
            <div class="field">
              <p class="control">
                <button @click="login" class="button is-success">Login</button>
              </p>
            </div>

            <p>
              Don't have an account?
              <router-link to="/sign-up">Create one!</router-link>
            </p>

            <p>
              <a @click="resetPassword">Reset password</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import firebase from 'firebase';

export default {
  name: 'Login',
  data() {
    return {
      email: '',
      password: '',
    };
  },
  methods: {
    login() {
      firebase
        .auth()
        .signInWithEmailAndPassword(this.email, this.password)
        .then(
          () => {
            localStorage.setItem('authenticated', true);
            this.$router.replace('protected');
            this.$toast.open({
              message: 'Successfully logged in!',
              position: 'is-bottom',
              type: 'is-success',
            });
          },
          (error) => {
            this.$toast.open({
              message: `Error logging in: ${error.message}`,
              position: 'is-bottom',
              type: 'is-danger',
            });
          },
        );
    },
    resetPassword() {
      if (!this.email) {
        this.$toast.open({
          message: 'Enter your email address to reset password.',
          position: 'is-bottom',
          type: 'is-danger',
        });
      } else {
        firebase
          .auth()
          .sendPasswordResetEmail(this.email)
          .then(
            () => {
              this.$toast.open({
                message: 'Password reset email sent!',
                position: 'is-bottom',
                type: 'is-success',
              });
            },
            (error) => {
              this.$toast.open({
                message: `Error: ${error.message}`,
                position: 'is-bottom',
                type: 'is-danger',
              });
            },
          );
      }
    },
  },
};
</script>

<style scoped>
</style>
