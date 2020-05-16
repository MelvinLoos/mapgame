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
    },
    alternatives: {
      type: Boolean,
      default: false
    },
    controls: {
      type: Object,
      default: function() {
        return {
          inputs: true,
          instructions: true,
          profileSwitcher: true
        }
      }
    },
    flyTo: {
      type: Boolean,
      default: true
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
      profile: this.profile,
      controls: this.controls,
      alternatives: this.alternatives,
      flyTo: this.flyTo
    });

    if (this.origin) {
      this.control.setOrigin(this.origin);
    }
    if (this.destination) {
      this.control.setDestination(this.destination);
    }

    this.control.on('route', ()=>{
      try {
        this.control.mapState();
      }catch(e){
        // console.error(e);
      }
    })
    this.control.on("results", this.$_updateInput);

    this.$_deferredMount();
  },

  watch: {
    origin: {
      handler(newValue) {
        this.control.setOrigin(newValue);
      }
    },
    destination: {
      handler(newValue) {
        this.control.setDestination(newValue);
      }
    },
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