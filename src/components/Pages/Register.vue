<template>
  <b-container class="h-50 m-auto pt-5">
    <b-row>
      <b-col></b-col>
      <b-col md="5">
        <b-card
          title="Create an Account">
          <b-card-text>
            <ValidationObserver ref="observer" v-slot="{ passes }">
              <b-form @submit.stop.prevent="handleSubmit(register)">
                <section class="section">
                  <h3>Account</h3>

                  <ValidationProvider
                    name="email"
                    rules="required|email"
                    v-slot="validationContext"
                  >
                    <b-form-group
                      label="Email"
                      label-for="input-email"
                    >
                      <b-form-input
                        id="input-email"
                        type="email"
                        placeholder="youremail@email.com"
                        v-model="email"
                        :state="getValidationState(validationContext)"
                        aria-describedby="input-email-feedback"
                      ></b-form-input>
                      <b-form-invalid-feedback id="input-email-feedback">{{ validationContext.errors[0] }}</b-form-invalid-feedback>
                    </b-form-group>
                  </ValidationProvider>

                  <ValidationProvider rules="required|min:6|password:@confirm" v-slot="validationContext">
                    <b-form-group
                      label="Password"
                      label-for="input-password"
                    >
                      <b-form-input
                        id="input-password"
                        type="password"
                        v-model="password"
                        :state="getValidationState(validationContext)"
                        aria-describedby="input-password-feedback"
                      ></b-form-input>
                      <b-form-invalid-feedback id="input-password-feedback">{{ validationContext.errors[0] }}</b-form-invalid-feedback>
                    </b-form-group>
                  </ValidationProvider>

                  <ValidationProvider name="confirm" rules="required" v-slot="validationContext">
                    <b-form-group
                      label="Verify Password"
                      label-for="input-password-verify"
                    >
                      <b-form-input
                        id="input-password-verify"
                        type="password"
                        v-model="verifyPassword"
                        :state="getValidationState(validationContext)"
                        aria-describedby="input-password-verify-feedback"
                      ></b-form-input>
                      <b-form-invalid-feedback id="input-password-verify-feedback">{{ validationContext.errors[0] }}</b-form-invalid-feedback>
                    </b-form-group>
                  </ValidationProvider>
                </section>

                <section class="section">
                  <h3 class="title is-3">Character</h3>

                  <ValidationProvider name="name" rules="required" v-slot="validationContext">
                    <b-form-group
                      label="Name"
                      label-for="input-name"
                    >
                      <b-form-input
                        id="input-name"
                        type="text"
                        placeholder="Joe Doe"
                        v-model="name"
                        :state="getValidationState(validationContext)"
                        aria-describedby="input-name-feedback"
                      ></b-form-input>
                      <b-form-invalid-feedback id="input-name-feedback">{{ validationContext.errors[0] }}</b-form-invalid-feedback>
                    </b-form-group>
                  </ValidationProvider>

                  <ValidationProvider
                    name="startingLocation"
                    rules="required|startingLocation"
                    v-slot="validationContext"
                  >
                    <b-form-group
                      label="Choose starting location"
                      label-for="input-location"
                    >
                      <b-select
                        id="input-location"
                        placeholder="Select a location"
                        v-model="startingLocation"
                        :state="getValidationState(validationContext)"
                        aria-describedby="input-location-feedback"
                      >
                        <option
                          v-for="location in locations"
                          :value="location.coordinate"
                          :key="location.id"
                        >{{ location.name }}</option>
                      </b-select>
                      <b-form-invalid-feedback id="input-location-feedback">{{ validationContext.errors[0] }}</b-form-invalid-feedback>
                    </b-form-group>
                  </ValidationProvider>
                </section>

                <b-button type="submit" variant="primary" @click="passes(register)">Sign Up</b-button>
              </b-form>
            </ValidationObserver>
          </b-card-text>
        </b-card>
      </b-col>
      <b-col></b-col>
    </b-row>
  </b-container>
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
        coordinate: [4.4777, 51.9244],
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
    getValidationState({ dirty, validated, valid = null }) {
      return dirty || validated ? valid : null;
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
