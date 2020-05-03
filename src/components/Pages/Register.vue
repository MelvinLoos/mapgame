<template>
  <div class="container">

    <div class="columns is-mobile">

      <div class="column is-half is-offset-one-quarter">

        <div class="card" style="margin-top:50px;">
          <div class="card-content">

            <h2 class="title is-2">Create an Account</h2>

              <div class="field">
                <label class="label">Email</label>
                <div class="control">
                  <input
                    class="input"
                    type="email"
                    placeholder="youremail@email.com"
                    v-model="email"
                  >
                </div>
              </div>

              <div class="field">
                <label class="label">Password</label>
                <div class="control">
                  <input
                    class="input"
                    type="password"
                    v-model="password"
                  >
                </div>
              </div>

              <div class="field">
                <label class="label">Verify Password</label>
                <div class="control">
                  <input
                    class="input"
                    type="password"
                    v-model="verifyPassword"
                  >
                </div>
              </div>

              <div class="field">
                <p class="control">
                  <button @click="register" class="button is-success">
                    Sign Up
                  </button>
                </p>
              </div>

          </div>
        </div>

      </div>
    </div>

  </div>
</template>

<script>
import firebase from 'firebase';

export default {
  name: 'Register',
  data() {
    return {
      email: '',
      password: '',
      verifyPassword: '',
    };
  },
  methods: {
    isValidPassword() {
      return (this.password === this.verifyPassword) || false;
    },
    register() {
      if (this.isValidPassword()) {
        let { currentUser } = firebase.auth();
        firebase
          .auth()
          .createUserWithEmailAndPassword(this.email, this.password)
          .then(() => {
            // create user data collection
            
            // TODO: create starting user data
            this.$router.replace('protected');
            this.$toast.open({
              message: 'Account successfully created!',
              position: 'is-bottom',
              type: 'is-success',
            });
          }, (error) => {
            this.$toast.open({
              message: `Error creating account: ${error.message}`,
              position: 'is-bottom',
              type: 'is-danger',
            });
          });
      } else {
        this.$toast.open({
          message: 'Passwords do not match.',
          position: 'is-bottom',
          type: 'is-danger',
        });
      }
    },
  },
};
</script>

<style scoped>
</style>
