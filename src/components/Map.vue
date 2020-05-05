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
            v-bind:style="{color: convertIdToColor(userId)}">
            User
        </b-icon>
    </MglMarker>
    <MglMarker 
      v-for="(user, index) in users"
      v-bind:item="user" 
      v-bind:index="index" 
      v-bind:key="user.id" 
      v-bind:coordinates="[user.latitude, user.longitude]"
    >    
      <b-icon
          icon="user-circle"
          size="is-medium"
          slot="marker"
          v-bind:style="{color: convertIdToColor(index)}">
          User
      </b-icon>
    </MglMarker>
  </MglMap>
</template>

<script>
import Mapbox from 'mapbox-gl';
import { MglMap, MglMarker } from 'vue-mapbox';
import { hashCode, intToRGB } from '../utils';

export default {
  name: 'Map',
  components: {
    MglMap,
    MglMarker
  },
  props: {
      coordinates: Array,
      userId: String,
      users: Object
  },
  data() {
    return {
      accessToken: process.env.VUE_APP_MAPBOX_TOKEN,
      mapStyle: 'mapbox://styles/mapbox/dark-v10',
      minZoom: 14,
      maxZoom: 22
    };
  },
  methods: {
    convertIdToColor(id) {
      if (!id) return '#FFFFFF';
      return '#' + intToRGB(hashCode(id));
    }
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
