<template>
  <MglMap
    :accessToken="accessToken"
    :mapStyle="mapStyle"
    :minZoom="minZoom"
    :maxZoom="maxZoom"
    :center="coordinates"
    :zoom="18"
  >
    <MglMarker :coordinates="coordinates">    
        <b-icon
            icon="user-circle"
            size="is-medium"
            slot="marker"
            v-bind:style="userIconStyle">
            User
        </b-icon>
    </MglMarker>
  </MglMap>
</template>

<script>
import Mapbox from 'mapbox-gl';
import { MglMap, MglMarker } from 'vue-mapbox';

export default {
  name: 'Map',
  components: {
    MglMap,
    MglMarker
  },
  props: {
      coordinates: Array,
      userColor: String,
      users: Array
  },
  data() {
    return {
      accessToken: process.env.VUE_APP_MAPBOX_TOKEN,
      mapStyle: 'mapbox://styles/mapbox/dark-v10',
      minZoom: 14,
      maxZoom: 22,
      userIconStyle: {
          color: this.userColor
      }
    };
  },
  methods: {
  },
  created() {
    // We need to set mapbox-gl library here in order to use it in template
    this.mapbox = Mapbox;
  },
};
</script>

<style scoped>
@import "~mapbox-gl/dist/mapbox-gl.css";
</style>
