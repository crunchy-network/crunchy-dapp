<template>
  <div id="farm-listing">

      <!-- class="hidden-sm-and-down" -->
      <el-header style="position: fixed; height: 90px; top: 0; left: 230px; right: 0; background: #fff; z-index: 999; border-bottom: 1px solid #e8e8e9;">
        <el-row type="flex" class="row-bg" justify="space-between">
          <el-col :span="24">
            <div class="grid-content" style="text-align: right;">
              <el-button @click="$router.push({name: 'farm-create'})" type="primary" round style="font-weight: bold;"><i class="fak fa-crunchy-farm-add" style="margin-right: 6px;"></i> Create a Farm</el-button>
              <el-divider direction="vertical"></el-divider>
              <NavWallet />
            </div>
          </el-col>
        </el-row>
      </el-header>

      <!-- class="hidden-sm-and-down" -->
      <el-main style="margin-top: 90px;">

        <el-row :gutter="20" type="flex" style="margin-bottom: 50px;" v-show="farms.searchInput.length === 0">
          <el-col :span="16">
            <el-row :gutter="20" type="flex">
              <el-col :span="8">
                <div class="grid-content" style="height: 100%;">
                  <el-card v-loading="farms.loading" class="box-card" shadow="never" style="height: 100%;">
                    <el-avatar shape="circle" icon="fas fa-farm" :size="48" style="background: #1EC37F; font-size: 24px;"></el-avatar>
                    <el-avatar shape="circle" icon="fas fa-user-cowboy" :size="48" style="font-size: 24px; float: right;"></el-avatar>
                    <div style="font-size: 24px; font-weight: 600; margin-top: 14px; margin-bottom: 8px;">
                      {{ totalFarms.toFixed(0) }} <span style="float: right;">{{ vueNumberFormat(farms.storage.vaults.activeKeys, {prefix: '', decimal: '.', thousand: ',', precision: 0}) }}</span>
                    </div>
                    <h2 style="color: #191B1F; opacity: 0.4; font-size: 14px; margin-bottom: 0px;">Active Farms <span style="float: right;">Farmers</span></h2>
                  </el-card>
                </div>
              </el-col>
              <el-col :span="8">
                <div class="grid-content" style="height: 100%;">
                  <el-card v-loading="farms.loading" class="box-card" shadow="never" style="height: 100%;">
                    <el-avatar shape="circle" :size="48" style="background: #555CFF;">
                      <img src="./../assets/svg-icons/lock.svg" style="width: 24px; height: 24px; padding: 12px;">
                    </el-avatar>
                    <div style="font-size: 24px; font-weight: 600; margin-top: 14px; margin-bottom: 8px;">
                      {{ vueNumberFormat(farms.totalTvlTez) }} ꜩ
                    </div>
                    <h2 style="color: #191B1F; opacity: 0.4; font-size: 14px; margin-bottom: 0px;">Total Value Locked (XTZ)</h2>
                  </el-card>
                </div>
              </el-col>
              <el-col :span="8">
                <div class="grid-content" style="height: 100%;">
                  <el-card v-loading="farms.loading" class="box-card" shadow="never" style="height: 100%;">
                    <el-avatar shape="circle" :size="48" style="background: #FFCF36;">
                      <img src="./../assets/svg-icons/lock.svg" style="width: 24px; height: 24px; padding: 12px;">
                    </el-avatar>
                    <div style="font-size: 24px; font-weight: 600; margin-top: 14px; margin-bottom: 8px;">
                      {{ vueNumberFormat(farms.totalTvlTez * farms.usdVwap, {prefix: '$', decimal: '.', thousand: ',', precision: 2}) }}
                    </div>
                    <h2 style="color: #191B1F; opacity: 0.4; font-size: 14px; margin-bottom: 0px;">Total Value Locked (USD)</h2>
                  </el-card>
                </div>
              </el-col>
            </el-row>

            <el-row :gutter="20" type="flex" style="margin-top: 20px;">
              <el-col :span="8">
                <div class="grid-content" style="height: 100%;">
                  <el-card v-loading="farms.loading" class="box-card" shadow="never" style="height: 100%;">
                    <el-avatar shape="circle" :size="48" src="data:image/png;base64,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"></el-avatar>
                    <div style="font-size: 18px; font-weight: 600; margin-top: 14px;">
                      {{ vueNumberFormat(farms.usdVwap, {prefix: '$', decimal: '.', thousand: ',', precision: 2}) }}
                    </div>
                  </el-card>
                </div>
              </el-col>
              <el-col :span="8">
                <div class="grid-content" style="height: 100%;">
                  <el-card v-loading="farms.loading" class="box-card" shadow="never" style="height: 100%;">
                    <el-avatar src="https://ipfs.fleek.co/ipfs/bafybeienhhbxz53n3gtg7stjou2zs3lmhupahwovv2kxwh5uass3bc5xzq" fit="cover" shape="circle" :size="48"></el-avatar>
                    <div style="font-size: 18px; font-weight: 600; margin-top: 14px;">
                      {{ vueNumberFormat(farms.crunchTez) }} ꜩ <span style="color: #bbbbbb; float: right;">{{ vueNumberFormat(farms.crunchTez * farms.usdVwap, {prefix: '$', decimal: '.', thousand: ',', precision: 2}) }}</span>
                    </div>
                  </el-card>
                </div>
              </el-col>
              <el-col :span="8">
                <div class="grid-content" style="height: 100%;">
                  <el-card v-loading="farms.loading" class="box-card" shadow="never" style="height: 100%;">
                    <el-avatar src="https://ipfs.fleek.co/ipfs/bafybeigulbzm5x72qtmckxqvd3ksk6q3vlklxjgpnvvnbcofgdp6qwu43u" fit="cover" shape="circle" :size="48"></el-avatar>
                    <div style="font-size: 18px; font-weight: 600; margin-top: 14px;">
                      {{ vueNumberFormat(farms.crdaoTez) }} ꜩ <span style="color: #bbbbbb; float: right;">{{ vueNumberFormat(farms.crdaoTez * farms.usdVwap, {prefix: '$', decimal: '.', thousand: ',', precision: 2}) }}</span>
                    </div>
                  </el-card>
                </div>
              </el-col>
            </el-row>

          </el-col>
          <el-col :span="8">
            <div class="grid-content">
              <DaasCard />
            </div>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="24">
            <div class="grid-content">
              <h2 style="margin-top: 0; margin-bottom: 5px;">Farms &amp; Gardens</h2>
              <span style="font-size: 14px;">Stake tokens to earn rewards. Help Gardens grow into Farms
              <el-tooltip content="Gardens are smaller farms with less than 10,000 ꜩ TVL" placement="top" effect="light">
                <i class="fas fa-question-circle"></i>
              </el-tooltip>
              </span>
            </div>
          </el-col>
        </el-row>
        <el-row :gutter="20" type="flex" align="bottom" style="margin-top: 20px;">
          <el-col :span="8">
            <div class="grid-content search-input">
              <el-input
                :value="farms.searchInput"
                @input="updateSearchInput"
                placeholder="Search farms and pools"
                prefix-icon="fad fa-search">
              </el-input>
            </div>
          </el-col>
          <el-col :span="16">
            <div class="grid-content" style="text-align: right;">

              <el-select multiple collapse-tags :value="farms.filters" @input="updateFilters" placeholder="All Farms & Gardens">
                <el-option-group
                  v-for="group in filterOptions"
                  :key="group.label"
                  :label="group.label">
                  <el-option
                    v-for="item in group.options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-option-group>
              </el-select>

              <!-- <el-switch
                v-model="showOnlyGardens"
                active-color="#1EC37F"
                inactive-color="#555CFF"
                active-text="Gardens"
                inactive-text="Farms">
              </el-switch>
              <el-divider direction="vertical"></el-divider>
              <el-switch
                v-if="wallet.connected"
                v-model="showOnlyStaked"
                active-color="#1EC37F"
                inactive-color="#555CFF"
                active-text="Staked"
                inactive-text="All">
              </el-switch> -->
              <el-divider direction="vertical"></el-divider>
              <el-switch
                style="margin-right: 24px;"
                v-model="showUsd"
                active-color="#1EC37F"
                inactive-color="#555CFF"
                active-text="USD"
                inactive-text="XTZ">
              </el-switch>
              <el-button type="primary" plain :disabled="wallet.connected === false" style="border-radius: 10px; font-weight: bold; padding-left: 48px; padding-right: 48px;" @click="harvestAllFarms">Harvest All</el-button>
            </div>
          </el-col>
        </el-row>

        <el-row type="flex" class="farm-list" style="margin-top: 25px;">
          <el-col :span="24">
            <div class="grid-content">
              <el-card class="box-card" v-loading="farms.loading">

                <el-row type="flex" align="middle" style="color: #757679; font-size: 14px; font-weight: 600; border-bottom: 2px solid #f4f4f4; padding-bottom: 14px; margin-bottom: 14px;">
                  <el-col :span="24">
                    <el-row :gutter="20" type="flex" align="middle" style="padding: 0 20px;">
                      <el-col :span="7">Farm</el-col>
                      <el-col style="text-align: right;" :span="4">Earned</el-col>
                      <el-col style="text-align: right;" :span="3">APR</el-col>
                      <el-col style="text-align: right;" :span="4">TVL
                        <el-tooltip content="Total Value Locked" placement="top" effect="light">
                          <i class="fas fa-question-circle"></i>
                        </el-tooltip>
                      </el-col>
                      <el-col style="text-align: right;" :span="3">Multiplier</el-col>
                      <el-col :span="3" v-show="farms.expanded === false" style="text-align: right;"><el-button type="text" @click="expandAllFarmRows" style="font-weight: bold;">Expand All <i class="fas fa-chevron-down fa-icon-right"></i></el-button></el-col>
                      <el-col :span="3" v-show="farms.expanded === true" style="text-align: right;"><el-button type="text" @click="collapseAllFarmRows" style="font-weight: bold;">Collapse All <i class="fas fa-chevron-up fa-icon-right"></i></el-button></el-col>
                    </el-row>
                  </el-col>
                </el-row>

                <FarmListingRow
                  v-for="farm in orderedFarms"
                  :key="farm.id"
                  :farm="farm"
                  v-show="farm.visible"
                  :showUsd="showUsd"
                  v-on:request-unstake-farm="showUnstakeDialog"
                  v-on:request-stake-farm="showStakeDialog"
                ></FarmListingRow>

              </el-card>
            </div>
          </el-col>
        </el-row>

        <FarmStakeDialog ref="stakeDialog" />
        <FarmUnstakeDialog ref="unstakeDialog" />

      </el-main>

    <!-- Mobile -->
    <!-- <el-container class="hidden-md-and-up" style="margin-top: 50px;">
      <el-main>
        <el-row :gutter="20" type="flex" align="bottom">
          <el-col :span="24">
            <div class="grid-content">
              <h2 style="margin-top: 0; margin-bottom: 5px;">Farms</h2>
              <span style="font-size: 14px;">Stake tokens to earn rewards.</span>
            </div>
          </el-col>
        </el-row>
        <el-row :gutter="20" type="flex" style="margin-top: 20px;">
          <el-col :span="24">
            <div class="grid-content">
              <el-card v-loading="farms.loading" class="box-card" shadow="never" style="height: 100%;">
                <h2 style="color: #191B1F; opacity: 0.4; font-size: 14px;">Total Value Locked (TVL) Across All Farms</h2>
                <div style="font-size: 24px; font-weight: bold; margin-bottom: 24px;">
                  {{ vueNumberFormat(farms.totalTvlTez) }} ꜩ <span style="color: #bbbbbb;">({{ vueNumberFormat(farms.totalTvlTez * farms.usdVwap, {prefix: '$', decimal: '.', thousand: ',', precision: 2}) }})</span>
                </div>
                <el-row type="flex" align="middle" style="font-size: 14px; font-weight: bold; border-radius: 14px; padding: 10px 20px; background: #f6f6f6;">
                  <el-col :span="8">
                    <el-avatar shape="circle" :size="24" style="position: relative; vertical-align: middle; margin-right: 6px;" src="data:image/png;base64,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"></el-avatar>
                    {{ vueNumberFormat(farms.usdVwap, {prefix: '$', decimal: '.', thousand: ',', precision: 2}) }}
                    <div style="color: #bbbbbb; margin-left: 34px;">(24-hour VWAP)</div>
                  </el-col>
                  <el-col :span="8">
                    <el-avatar src="https://ipfs.fleek.co/ipfs/bafybeienhhbxz53n3gtg7stjou2zs3lmhupahwovv2kxwh5uass3bc5xzq" fit="cover" shape="circle" :size="24" style="position: relative; vertical-align: middle; margin-right: 6px;"></el-avatar>
                    {{ vueNumberFormat(farms.crunchTez) }} ꜩ
                    <div style="color: #bbbbbb; margin-left: 34px;">({{ vueNumberFormat(farms.crunchTez * farms.usdVwap, {prefix: '$', decimal: '.', thousand: ',', precision: 2}) }})</div>
                  </el-col>
                  <el-col :span="8">
                    <el-avatar src="https://ipfs.fleek.co/ipfs/bafybeigulbzm5x72qtmckxqvd3ksk6q3vlklxjgpnvvnbcofgdp6qwu43u" fit="cover" shape="circle" :size="24" style="position: relative; vertical-align: middle; margin-right: 6px;"></el-avatar>
                    {{ vueNumberFormat(farms.crdaoTez) }} ꜩ
                    <div style="color: #bbbbbb; margin-left: 34px;">({{ vueNumberFormat(farms.crdaoTez * farms.usdVwap, {prefix: '$', decimal: '.', thousand: ',', precision: 2}) }})</div>
                  </el-col>
                </el-row>
              </el-card>
            </div>
          </el-col>
        </el-row>

        <el-row :gutter="20" type="flex" align="bottom" style="margin-top: 50px;">
          <el-col :span="18">
            <div class="grid-content">
              <el-switch
                v-if="wallet.connected"
                v-model="showOnlyStaked"
                active-color="#1EC37F"
                inactive-color="#555CFF"
                active-text="Staked Farms"
                inactive-text="All Farms">
              </el-switch>
              <el-divider direction="vertical"></el-divider>
              <el-switch
                style="margin-right: 24px;"
                v-model="showUsd"
                active-color="#1EC37F"
                inactive-color="#555CFF"
                active-text="USD"
                inactive-text="XTZ">
              </el-switch>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="grid-content" style="text-align: right;">
              <el-button type="primary" plain :disabled="wallet.connected === false" style="border-radius: 10px; font-weight: bold; width: 100%" @click="harvestAllFarms">Harvest All</el-button>
            </div>
          </el-col>
        </el-row>

        <el-row type="flex" class="farm-list" style="margin-top: 25px;">
          <el-col :span="24">
            <div class="grid-content">
              <el-card class="box-card" v-loading="farms.loading">

                <el-row type="flex" align="middle" style="color: #757679; font-size: 14px; font-weight: 600; border-bottom: 2px solid #f4f4f4; padding-bottom: 14px; margin-bottom: 14px;">
                  <el-col :span="24">
                    <el-row :gutter="20" type="flex" align="middle" style="padding: 0 20px;">
                      <el-col :span="12">Farm</el-col>
                      <el-col style="text-align: right;" :span="5">Earned</el-col>
                      <el-col style="text-align: right;" :span="4">APR</el-col>
                      <el-col :span="3" v-show="farms.expanded === false" style="text-align: right;"><el-button type="text" @click="expandAllFarmRows" style="font-weight: bold;">Expand All <i class="fas fa-chevron-down fa-icon-right"></i></el-button></el-col>
                      <el-col :span="3" v-show="farms.expanded === true" style="text-align: right;"><el-button type="text" @click="collapseAllFarmRows" style="font-weight: bold;">Collapse All <i class="fas fa-chevron-up fa-icon-right"></i></el-button></el-col>
                    </el-row>
                  </el-col>
                </el-row>
                <el-row v-for="farm in farms.data" v-bind:key="farm.id" v-show="farm.visible && (showOnlyStaked === false || farm.depositAmount > 0)" style="padding-bottom: 14px; font-size: 14px; font-weight: bold;" type="flex" align="top">
                  <el-col :span="24">
                    <div
                      style="border: 1px solid #EBEEF5; border-radius: 14px;"
                      v-bind:style="[farm.rowExpanded ? {borderColor: '#EBEEF5'} : {borderColor: '#fff'}]"
                      v-loading="farm.loading"
                    >
                      <el-row :gutter="20" class="farm-row" v-bind:class="{ expanded: farm.rowExpanded }" style="margin-left: 0; margin-right: 0;" type="flex" align="middle">
                        <el-col v-if="farm.poolToken.isQuipuLp" :span="7" style="font-weight: bold;">
                          <el-avatar shape="circle" :size="40" style="position: relative; border: 4px solid #fff; vertical-align: middle;" src="data:image/png;base64,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"></el-avatar>
                          <el-avatar :src="farm.poolToken.thumbnailUri" fit="cover" shape="circle" :size="40" style="position: relative; border: 4px solid #fff; vertical-align: middle; margin-left: -18px; margin-right: 14px;"></el-avatar>
                          XTZ/{{ farm.poolToken.symbol }}
                        </el-col>
                        <el-col v-else :span="7" style="font-weight: bold;">
                          <el-avatar :src="farm.poolToken.thumbnailUri" fit="cover" shape="circle" :size="40" style="position: relative; border: 4px solid #fff; vertical-align: middle; margin-right: 14px;"></el-avatar>
                          {{ farm.poolToken.symbol }}
                        </el-col>
                        <el-col :span="5" style="font-weight: bold;">
                          <i class="fas fa-arrow-alt-right" style="color: #999; margin-left: 0px; margin-right: 6px;"></i>
                          <el-avatar :src="farm.rewardToken.thumbnailUri" fit="cover" shape="circle" :size="40" style="position: relative; border: 4px solid #fff; vertical-align: middle;"></el-avatar>
                          <span style="margin-left: 14px;">{{ farm.rewardToken.symbol }}</span>
                        </el-col>

                        <el-col style="text-align: right;" :span="5" v-if="wallet.connected && farm.depositAmount > 0">{{ vueNumberFormat(farm.rewardsEarned) }}</el-col>
                        <el-col style="text-align: right;" :span="5" v-else>-</el-col>
                        <el-col style="text-align: right;" :span="4">{{ vueNumberFormat(farm.apr, {prefix: '', decimal: '.', thousand: ',', precision: 2}) }}%</el-col>
                        <el-col :span="3" v-show="farm.rowExpanded === false" style="text-align: right;"><el-button type="text" @click="expandFarmRow(farm.id)" style="font-weight: bold;">View Details <i class="fas fa-chevron-down fa-icon-right"></i></el-button></el-col>
                        <el-col :span="3" v-show="farm.rowExpanded === true" style="text-align: right;"><el-button type="text" @click="collapseFarmRow(farm.id)" style="font-weight: bold;">Hide Details <i class="fas fa-chevron-up fa-icon-right"></i></el-button></el-col>
                      </el-row>
                    </div>
                  </el-col>
                </el-row>

              </el-card>
            </div>
          </el-col>
        </el-row>

        <el-row :gutter="20" type="flex" style="margin-top: 20px;">
          <el-col :span="24">
            <div class="grid-content" style="height: 100%;">
              <DaasCard />
            </div>
          </el-col>
        </el-row>
      </el-main>
    </el-container> -->

  </div>
</template>

<script>
import _ from 'lodash';
import { mapState, mapActions } from 'vuex'
import NavWallet from './NavWallet.vue';
import DaasCard from './DaasCard.vue';
import FarmListingRow from './FarmListingRow.vue';
import FarmStakeDialog from './FarmStakeDialog.vue';
import FarmUnstakeDialog from './FarmUnstakeDialog.vue';

export default {
  name: 'FarmListing',
  components: {
    NavWallet,
    DaasCard,
    FarmListingRow,
    FarmStakeDialog,
    FarmUnstakeDialog
  },
  data() {
    return {
      showUsd: false,
      filterOptions: [{
        label: 'Type',
        options: [{
          value: 'farm',
          label: 'Farms'
        }, {
          value: 'garden',
          label: 'Gardens'
        }, {
          value: 'flash',
          label: 'Flash Farms'
        }]
      }, {
        label: 'Staking',
        options: [
          { value: 'staked', label: 'Staked' }
        ]
      }, {
        label: 'Status',
        options: [
          { value: 'pending', label: 'Pending' },
          { value: 'running', label: 'Running' },
          { value: 'ended', label: 'Complete' },
        ]
      }, {
        label: 'Badges',
        options: [
          { value: 'verified', label: 'Verified' },
          { value: 'core', label: 'Crunchy Core' },
          { value: 'partner', label: 'Trusted Partner' },
          { value: 'lpLocked', label: 'LP Locked' },
        ]
      }]
    }
  },
  // watch: {
  //   '$route.query': {
  //     immediate: true,
  //     handler(newVal) {
  //       console.log("newVal", newVal);
  //     }
  //   }
  // },
  computed: {
    ...mapState([
      'wallet',
      'farms'
    ]),

    orderedFarms: function () {
      return _.orderBy(this.farms.data, ['ended', 'badges.core', 'tvlTez'], ['asc', 'desc', 'desc']);
    },

    totalFarms: function () {
      return Object.values(this.farms.data).length;
    }
  },
  created() {
    if (this.$route.query.q) {
      this.$store.commit('updateFarmsSearchInput', this.$route.query.q);
    }

    if (this.$route.query.f) {
      let filters = this.$route.query.f;
      if (!Array.isArray(filters)) {
        filters = [ filters ];
      }
      this.$store.commit('updateFarmsFilters', filters);
    }

    this.refresh();
  },
  methods: {
    ...mapActions([
      'connectWallet',
      'disconnectWallet',
      'fetchAllFarms',
      'harvestAllFarms',
      'expandAllFarmRows',
      'collapseAllFarmRows',
      'filterAllFarmRows',
      'searchAllFarmRows'
    ]),

    refresh() {
      this.fetchAllFarms();
    },

    updateSearchInput(input) {
      this.$router.replace({
        query: {
            ...this.$route.query,
            q: input
        }
      });
      this.$store.commit('updateFarmsSearchInput', input);
      this.filterAllFarmRows();
    },

    updateFilters(filters) {
      this.$router.replace({
        query: {
            ...this.$route.query,
            f: filters
        }
      });
      this.$store.commit('updateFarmsFilters', filters);
      this.filterAllFarmRows();
    },

    showStakeDialog(farmId) {
      this.$refs.stakeDialog.showDialog(farmId);
    },

    showUnstakeDialog(farmId) {
      this.$refs.unstakeDialog.showDialog(farmId);
    },

    viewFarmStats(farm) {
      console.log("viewFarmStats", farm); // this will go to dedicated farm page
    }

  }
}
</script>

<style scoped>
    #farm-listing {
        position: relative;
        width: 100%;
        max-width: 1450px;
        margin: 0 auto;
    }
</style>
