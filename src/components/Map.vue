<template>
  <MglMap
    :accessToken="accessToken"
    :mapStyle="mapStyle"
    :minZoom="minZoom"
    :maxZoom="maxZoom"
    :center="coordinates"
    :pitch="pitch"
    :zoom="zoom"
    @load="onMapLoaded"
  >
    <MglMarker :coordinates="coordinates">
      <b-icon
        icon="user-circle"
        size="is-medium"
        slot="marker"
        v-bind:style="{color: convertIdToColor(userId)}"
      >User</b-icon>
      <MglPopup>
        <div class="card">
          <header class="card-header">
            <p class="card-header-title">This is you!</p>
          </header>
          <div class="card-content">
            <div class="content">
              {{ coordinates[0] }}
              <br />
              {{ coordinates[1] }}
            </div>
          </div>
        </div>
      </MglPopup>
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
        v-bind:style="{color: convertIdToColor(index)}"
      >User</b-icon>
      <MglPopup>
        <div class="card">
          <header class="card-header">
            <p class="card-header-title">{{ user.name }}</p>
          </header>
          <div class="card-content">
            <div class="content">
              {{ user.latitude }}
              <br />
              {{ user.longitude }}
            </div>
          </div>
        </div>
      </MglPopup>
    </MglMarker>
  </MglMap>
</template>

<script>
import Mapbox from "mapbox-gl";
import { MglMap, MglMarker, MglPopup } from "vue-mapbox";
import { hashCode, intToRGB } from "../utils";

export default {
  name: "Map",
  components: {
    MglMap,
    MglMarker,
    MglPopup
  },
  props: {
    coordinates: Array,
    userId: String,
    users: Object
  },
  data() {
    return {
      accessToken: process.env.VUE_APP_MAPBOX_TOKEN,
      mapStyle: "mapbox://styles/mapbox/dark-v10",
      minZoom: 15,
      maxZoom: 22,
      pitch: 60,
      zoom: 18
    };
  },
  methods: {
    convertIdToColor(id) {
      if (!id) return "#FFFFFF";
      return "#" + intToRGB(hashCode(id));
    },
    onMapLoaded(event) {
      // in component
      this.map = event.map;
      // Insert the layer beneath any symbol layer.
      var layers = this.map.getStyle().layers;

      var labelLayerId;
      for (var i = 0; i < layers.length; i++) {
        if (layers[i].type === "symbol" && layers[i].layout["text-field"]) {
          labelLayerId = layers[i].id;
          break;
        }
      }

      this.map.addLayer(
        {
          id: "3d-buildings",
          source: "composite",
          "source-layer": "building",
          filter: ["==", "extrude", "true"],
          type: "fill-extrusion",
          minzoom: 15,
          paint: {
            "fill-extrusion-color": "#aaa",

            // use an 'interpolate' expression to add a smooth transition effect to the
            // buildings as the user zooms in
            "fill-extrusion-height": [
              "interpolate",
              ["linear"],
              ["zoom"],
              15,
              0,
              15.05,
              ["get", "height"]
            ],
            "fill-extrusion-base": [
              "interpolate",
              ["linear"],
              ["zoom"],
              15,
              0,
              15.05,
              ["get", "min_height"]
            ],
            "fill-extrusion-opacity": 0.6
          }
        },
        labelLayerId
      );
    }
  },
  created() {
    // We need to set mapbox-gl library here in order to use it in template
    this.mapbox = Mapbox;
  }
};
</script>

<style scoped>
@import "~mapbox-gl/dist/mapbox-gl.css";
</style>
