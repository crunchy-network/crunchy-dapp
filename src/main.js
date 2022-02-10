import Vue from "vue";
import App from "./App.vue";
import "./plugins/element.js";
import "./plugins/axios.js";
import VueNumberFormat from "vue-number-format";
import VueMoment from "vue-moment";
import router from "./plugins/routes.js";
import store from "./store";
import { AsyncFilterMixin } from "@tygr/vue-async-filter";
import humanizeDuration from "humanize-duration";

Vue.use(VueNumberFormat, {
  prefix: "",
  decimal: ".",
  thousand: ",",
  precision: 4,
});
Vue.use(VueMoment);

Vue.mixin(AsyncFilterMixin);

Vue.filter("humanizeDuration", function (value, opts = {}) {
  return humanizeDuration(value, { largest: 3, ...opts });
});

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");
