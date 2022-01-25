import Vue from 'vue'
import VueRouter from 'vue-router'
// import Home from './../components/Home.vue'
import LpLockerListing from './../components/LpLockerListing.vue'
import LpLockerItem from './../components/LpLockerItem.vue'
import FarmListing from './../components/FarmListing.vue'
import FarmCreate from './../components/FarmCreate.vue'
import FirePit from './../components/FirePit.vue'
import WtzMain from './../components/WtzMain.vue'
import IFO from './../components/IFO.vue'
import HomeWalletPage from './../components/HomeWalletPage.vue'
import IFOList from './../components/IFOList.vue'
// import Bakery from './../components/Bakery.vue'

Vue.use(VueRouter);

const routes = [
  { name: 'home', path: '/', component: HomeWalletPage },
  // { path: '/', redirect: '/farms' },
  
  // { name: 'home-wallet', path: '/home-wallet', component: HomeWalletPage },
  { name: 'wtz', path: '/wtz', component: WtzMain },

  { name: 'deep-freezer-listing', path: '/freezers', component: LpLockerListing },
  { name: 'deep-freezer-item', path: '/freezers/item', component: LpLockerItem },
  { name: 'ifo-list', path: '/ifo', component: IFOList },
  { name: 'ifo', path: '/ifo/:tokenName', component: IFO },
  { name: 'farm-listing', path: '/farms', component: FarmListing },
  { name: 'farm-create', path: '/farms/create', component: FarmCreate },

  // { name: 'bakery', path: '/bakery', component: Bakery },
  { name: 'fire-pit', path: '/fire-pit', component: FirePit },
];

export default new VueRouter({
  routes
});
