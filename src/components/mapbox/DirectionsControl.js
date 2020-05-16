import MapboxDirections from '@mapbox/mapbox-gl-directions/dist/mapbox-gl-directions';
import { asControl } from "vue-mapbox";

const directionsEvents = {
  clear: "clear",
  loading: "loading",
  results: "results",
  result: "result",
  error: "error"
}

export default {
  name: "DirectionsControl",
  mixins: [asControl],

  inject: ["mapbox", "map"],

  props: {
    accessToken: {
      type: String,
      required: true
    },
    origin: {
      type: Array
    },
    destination: {
      type: Array
    },
    unit: {
      type: String,
      default: 'metric'
    },
    profile: {
      type: String,
      default: 'mapbox/walking'
    }
  },

  data() {
    return {
      initial: true
    };
  },

  created() {
    this.control = null;
    if (this.accessToken && !this.mapbox.accessToken) {
      this.mapbox.accessToken = this.accessToken;
    }
    this.control = new MapboxDirections({
      accessToken: this.accessToken,
      unit: this.unit,
      profile: this.profile
    });

    if (this.origin) {
      this.control.setOrigin(this.origin);
    }
    if (this.destination) {
      this.control.setDestination(this.destination);
    }

    this.control.on('route', ()=>{
      try {
        this.control.mapState()
      }catch(e){
        // console.error(e);
      }
    })
    this.control.on("results", this.$_updateInput);

    this.$_deferredMount();
  },

  methods: {
    $_deferredMount() {
      this.$_addControl();
      if (this.input) {
        this.control.setInput(this.input);
      }
      this.$_emitEvent("added", { directions: this.control });
      this.$_bindSelfEvents(Object.keys(directionsEvents));
      this.initial = false;
    },

    $_updateInput(results) {
      if (!this.initial) {
        const input = results.query ? results.query.join("") : "";
        this.$emit("update:input", input);
      }
    },
  }
};