<template>
  <b-container class="h-50 m-auto pt-5">
    <b-row>
      <b-col></b-col>
      <b-col md="5">
        <b-card
          title="Login">
          <b-card-text>
            <b-form @submit.stop.prevent="login">
              <b-form-group>
                <b-form-input
                  name="email"
                  type="email"
                  placeholder="Email"
                  v-model="email"
                  ></b-form-input>
              </b-form-group>
              <b-form-group>
                  <b-form-input
                    name="password"
                    type="password"
                    placeholder="Password"
                    v-model="password"
                    v-on:keyup.enter="login"
                    ></b-form-input>
              </b-form-group>
              <b-button type="submit" variant="primary">Login</b-button>
            </b-form>

            <div class="pt-2">
              <p>
                Don't have an account?
                <router-link to="/sign-up">Create one!</router-link>
              </p>

              <p>
                <b-button variant="secondary" @click="resetPassword">Reset password</b-button>
              </p>
            </div>
          </b-card-text>
        </b-card>
      </b-col>
      <b-col></b-col>
    </b-row>
  </b-container>
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
