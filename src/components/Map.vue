<template>
  <MglMap
    :accessToken="accessToken"
    :mapStyle.sync="mapStyle"
    :minZoom="minZoom"
    :maxZoom="maxZoom"
    :center="coordinates"
    :pitch="pitch"
    :zoom="zoom"
    @load="onMapLoaded"
    ref="map"
    :attributionControl="false"
  >
    <MglFullscreenControl position="top-right" />
    <!-- <MglNavigationControl position="top-right" /> -->
    <!-- <MglDirectionsControl 
      position="top-left" 
      :accessToken="accessToken"
      :origin="[coordinates[0], coordinates[1]]"
      :alternatives="false"
      :flyTo="false"
    /> -->


    <MglMarker :coordinates.sync="coordinates">
      <font-awesome-icon
        icon="user"
        size="2x"
        slot="marker"
        v-bind:style="{color: convertIdToColor(userId)}"
      >User</font-awesome-icon>
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
      v-for="(user, index) in otherUsers"
      v-bind:item="user"
      v-bind:index="index"
      v-bind:key="user.id"
      v-bind:coordinates="[user.latitude, user.longitude]"
    >
      <font-awesome-icon
        icon="user-circle"
        size="2x"
        slot="marker"
        v-bind:style="{color: convertIdToColor(index)}"
      >User</font-awesome-icon>
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
    <MglAttributionControl :compact="true" position="bottom-right" />
  </MglMap>
</template>

<script>
import { Mapbox, mapboxgl } from "mapbox-gl";
import { MglMap, MglFullscreenControl, MglAttributionControl, MglNavigationControl, MglMarker, MglPopup } from "vue-mapbox";
import MglDirectionsControl from "./mapbox/DirectionsControl";
import { hashCode, intToRGB } from "../utils";

export default {
  name: "Map",
  components: {
    MglMap,
    MglFullscreenControl,
    MglAttributionControl,
    // TODO: implement navigation using cloud functions
    // MglNavigationControl,
    // MglDirectionsControl,
    MglMarker,
    MglPopup
  },
  props: {
    coordinates: Array,
    userId: String,
    otherUsers: Object
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
      this.map.flyTo(this.coordinates);
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
    this.map = null;
  }
};
</script>

<style scoped>
@import "~mapbox-gl/dist/mapbox-gl.css";
@import '~@mapbox/mapbox-gl-directions/dist/mapbox-gl-directions.css';
</style>
