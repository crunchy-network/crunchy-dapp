import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from './../components/Home.vue'
import LpLockerListing from './../components/LpLockerListing.vue'
import FarmListing from './../components/FarmListing.vue'
import FarmCreate from './../components/FarmCreate.vue'
import FirePit from './../components/FirePit.vue'
// import Bakery from './../components/Bakery.vue'

Vue.use(VueRouter);

const routes = [
  { name: 'home', path: '/', component: Home },
  // { path: '/', redirect: '/farms' },

  { name: 'deep-freezer-listing', path: '/freezers', component: LpLockerListing },

  { name: 'farm-listing', path: '/farms', component: FarmListing },
  { name: 'farm-create', path: '/farms/create', component: FarmCreate },

  // { name: 'bakery', path: '/bakery', component: Bakery },
  { name: 'fire-pit', path: '/fire-pit', component: FirePit },
];

export default new VueRouter({
  routes
});
