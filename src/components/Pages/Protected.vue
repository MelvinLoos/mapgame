<template>
  <div>
    <!-- <b-menu>
      <b-menu-list label="Menu">
        <b-menu-item icon="suitcase" label="Inventory"></b-menu-item>
      </b-menu-list>
    </b-menu> -->
    <Map 
      id="gamemap"
      :coordinates="userCoordinates"
      :userId="id"
      :otherUsers="otherUsers"
    />
    
    <b-container class="pt-4 text-center">
      <b-button-group>
        <b-button v-on:click="moveLeft">
          Left
        </b-button>
        <b-button v-on:click="moveUp">
          Up
        </b-button>
        <b-button v-on:click="moveDown">
          Down
        </b-button>
        <b-button v-on:click="moveRight">
          Right
        </b-button>
      </b-button-group>
      <b-button v-on:click="centerView" class="mx-2">
        Center
      </b-button>
    </b-container>
  </div>
</template>

<script>
import firebase from "firebase";
import Map from "../Map";
import { hashCode, intToRGB } from '../../utils';
import gsap from 'gsap';

export default {
  name: "Protected",
  components: {
    Map
  },
  data() {
    return {
      user: null,
      otherUsers: null,
      movementIncrement: 0.0005,
      tweenedLatitude: 0,
      tweenedLongitude: 0,
      menuOpen: true
    };
  },
  computed: {
    id: function() {
      return firebase.auth().currentUser.uid;
    },
    userCoordinates: function() {
      return [this.tweenedLatitude, this.tweenedLongitude];
    },
    userLatitude: function() {
      return this.user ? this.user.latitude : 0;
    },
    userLongitude: function() {
      return this.user ? this.user.longitude : 0;
    },
  },
  created: function() {
    let that = this;
    this.$db.ref('users').on('value', function (snapshot) {
      if (!snapshot.val()) return;
      let users = snapshot.val();
      // remove current user from list
      delete users[that.id];
      if (that.otherUsers) {
        for (let userId in users) {
          if (that.otherUsers.hasOwnProperty(userId)) {
            gsap.to(that.$data, { duration: 0.5,  latitude: users[userId].latitude});
            gsap.to(that.$data, { duration: 0.5,  longitude: users[userId].longitude});
          }
        };
      }
      that.otherUsers = users;
    });
  },
  watch: {
    id: {
      // call it upon creation too
      immediate: true,
      handler(id) {
        this.$rtdbBind("user", this.$db.ref("users").child(id));
      }
    },
    userLatitude: {
      immediate: true,
      handler(newValue) {
        gsap.to(this.$data, { duration: 0.5,  tweenedLatitude: newValue});
      }
    },
    userLongitude: {
      immediate: true,
      handler(newValue) {
        gsap.to(this.$data, { duration: 0.5,  tweenedLongitude: newValue});
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
    centerView() {
      console.log('TODO: implement center function');
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
