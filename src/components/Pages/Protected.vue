<template>
  <div>
    <Map 
      id="gamemap"
      :coordinates="userCoordinates"
      :userColor="userColor"
      :users="users"
    />
    <nav id="actionbar-bottom" class="navbar" role="navigation" aria-label="game navigation">
      <div class="navbar-menu is-active">
        <div class="navbar-start">
          <div class="navbar-item is-expanded">
            <div class="buttons has-addons is-centered">
              <button v-on:click="moveLeft" class="button">
                Left
              </button>
              <button v-on:click="moveUp" class="button">
                Up
              </button>
              <button v-on:click="moveDown" class="button">
                Down
              </button>
              <button v-on:click="moveRight" class="button">
                Right
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  </div>
</template>

<script>
import firebase from "firebase";
import Map from "../Map";
import { hashCode, intToRGB } from '../../utils';

export default {
  name: "Protected",
  components: {
    Map
  },
  data() {
    return {
      user: null,
      users: [],
      movementIncrement: 0.0001
    };
  },
  computed: {
    id: function() {
      return firebase.auth().currentUser.uid;
    },
    userCoordinates: function() {
      if (this.user) {
        return [this.user.latitude, this.user.longitude];
      }
      return [0, 0];
    },
    userColor: function() {
      if (!this.id) return '#FFFFFF';
      return '#' + intToRGB(hashCode(this.id));
    },
  },
  created: function() {
    let that = this;
    this.$db.ref('users').on('value', function (snapshot) {
      if (!snapshot.val()) return;
      that.users = Array(snapshot.val()).filter(function (val) {
        // filter out the current user
        return !val.hasOwnProperty(that.id);
      });
    });
  },
  watch: {
    id: {
      // call it upon creation too
      immediate: true,
      handler(id) {
        this.$rtdbBind("user", this.$db.ref("users").child(id));
      }
    }
  },
  methods: {
    moveLeft() {
      if (!this.id) return;
      this.$db.ref("users/" + this.id).update({ latitude: Number(this.user.latitude) - this.movementIncrement }).then(() => {
      })
    },
    moveUp() {
      if (!this.id) return;
      this.$db.ref("users/" + this.id).update({ longitude: Number(this.user.longitude) + this.movementIncrement }).then(() => {
      })
    },
    moveDown() {
      if (!this.id) return;
      this.$db.ref("users/" + this.id).update({ longitude: Number(this.user.longitude) - this.movementIncrement }).then(() => {
      })
    },
    moveRight() {
      if (!this.id) return;
      this.$db.ref("users/" + this.id).update({ latitude: Number(this.user.latitude) + this.movementIncrement }).then(() => {
      })
    },
    logout() {
      firebase
        .auth()
        .signOut()
        .then(() => {
          localStorage.setItem("authenticated", false);
          this.$router.replace("login");
          this.$toast.open({
            message: "Successfully logged out!",
            position: "is-bottom",
            type: "is-success"
          });
        });
    }
  }
};
</script>

<style scoped>
#gamemap
{
  width: 100%;
  height: 90%;
  position: relative;
  top: 0;
  left: 0;
}

#actionbar-bottom
{
  height: 10%;
  position: relative;
  bottom: 0;
}

#actionbar-bottom .navbar-menu .navbar-start
{
  margin: auto;
}
</style>
