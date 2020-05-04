<template>
  <div class="container">
    <div class="columns is-mobile">
      <div class="column is-half is-offset-one-quarter">
        <div class="card" style="margin-top:50px;">
          <div class="card-content">
            <h2 class="title is-2">Create an Account</h2>
            <ValidationObserver ref="observer" v-slot="{ passes }">
              <section class="section">
                <h3 class="title is-3">Account</h3>

                <ValidationProvider name="email" rules="required|email" v-slot="{ errors, valid }">
                  <b-field
                    label="Email"
                    :type="{ 'is-danger': errors[0], 'is-success': valid }"
                    :message="errors"
                  >
                    <b-input type="email" placeholder="youremail@email.com" v-model="email"></b-input>
                  </b-field>
                </ValidationProvider>

                <ValidationObserver>
                  <ValidationProvider rules="required|min:6|password:@confirm" v-slot="{ errors, valid }">
                    <b-field
                      label="Password"
                      :type="{ 'is-danger': errors[0], 'is-success': valid }"
                      :message="errors"
                    >
                      <b-input type="password" v-model="password"></b-input>
                    </b-field>
                  </ValidationProvider>
                  <ValidationProvider name="confirm" rules="required" v-slot="{ errors, valid }">
                    <b-field
                      label="Verify Password"
                      :type="{ 'is-danger': errors[0], 'is-success': valid }"
                      :message="errors"
                    >
                      <b-input type="password" v-model="verifyPassword"></b-input>
                    </b-field>
                  </ValidationProvider>
                </ValidationObserver>
              </section>

              <section class="section">
                <h3 class="title is-3">Character</h3>

                <ValidationProvider name="name" rules="required" v-slot="{ errors, valid }">
                  <b-field
                    label="Name"
                    :type="{ 'is-danger': errors[0], 'is-success': valid }"
                    :message="errors"
                  >
                    <b-input type="text" placeholder="Joe Doe" v-model="name"></b-input>
                  </b-field>
                </ValidationProvider>
                <ValidationProvider
                  name="startingLocation"
                  rules="required|startingLocation"
                  v-slot="{ errors, valid }"
                >
                  <b-field
                    label="Choose starting location"
                    :type="{ 'is-danger': errors[0], 'is-success': valid }"
                    :message="errors"
                  >
                    <b-select placeholder="Select a location" v-model="startingLocation">
                      <option
                        v-for="location in locations"
                        :value="location.coordinate"
                        :key="location.id"
                      >{{ location.name }}</option>
                    </b-select>
                  </b-field>
                </ValidationProvider>
              </section>

              <div class="field">
                <p class="control">
                  <button @click="passes(register)" class="button is-success">Sign Up</button>
                </p>
              </div>
            </ValidationObserver>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import firebase from "firebase";
import { ValidationProvider, ValidationObserver } from "vee-validate";

export default {
  name: "Register",
  components: {
    ValidationProvider,
    ValidationObserver
  },
  data() {
    const locations = [
      {
        id: 1,
        coordinate: [51.9244, 4.4777],
        name: "Rotterdam"
      }
    ];
    return {
      email: "",
      password: "",
      verifyPassword: "",
      locations: locations,
      name: "",
      startingLocation: []
    };
  },
  methods: {
    isValidPassword() {
      return this.password === this.verifyPassword || false;
    },
    register() {
      if (this.isValidPassword()) {
        let { currentUser } = firebase.auth();
        firebase
          .auth()
          .createUserWithEmailAndPassword(this.email, this.password)
          .then(
            () => {
              let userId = firebase.auth().currentUser.uid;
              let userData = {
                name: this.name,
                latitude: this.startingLocation[0],
                longitude: this.startingLocation[1]
              };
              this.$db
                .ref("users/" + userId)
                .set(userData)
                .then(() => {
                  console.log("user updated!");
                });
              this.$router.replace("protected");
              this.$toast.open({
                message: "Account successfully created!",
                position: "is-bottom",
                type: "is-success"
              });
            },
            error => {
              this.$toast.open({
                message: `Error creating account: ${error.message}`,
                position: "is-bottom",
                type: "is-danger"
              });
            }
          );
      } else {
        this.$toast.open({
          message: "Passwords do not match.",
          position: "is-bottom",
          type: "is-danger"
        });
      }
    }
  }
};
</script>

<style scoped>
</style>
