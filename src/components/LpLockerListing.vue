<template>
  <div id="lp-locker-listing">

      <el-header style="position: fixed; height: 90px; top: 0; left: 230px; right: 0; background: #fff; z-index: 999; border-bottom: 1px solid #e8e8e9;">
        <el-row type="flex" class="row-bg" justify="space-between">
          <el-col :span="6">
            <!-- <div class="grid-content">
              <el-input
                :value="farms.searchInput"
                @input="updateSearchInput"
                placeholder="Search farms and pools"
                prefix-icon="fad fa-search">
              </el-input>
            </div> -->
          </el-col>
          <el-col :span="12">
            <div class="grid-content" style="text-align: right;">
              <el-button @click="showCreateDialog" type="primary" round style="font-weight: bold;"><img src="./../assets/svg-icons/lock.svg" style="width: 24px; height: 24px; vertical-align: middle; margin-right: 6px; margin-top: -6px; margin-bottom: -6px;">Lock LP Tokens</el-button>
              <el-divider direction="vertical"></el-divider>
              <NavWallet />
            </div>
          </el-col>
        </el-row>
      </el-header>

      <el-main style="margin-top: 90px;">

        <el-row :gutter="20" type="flex" style="margin-bottom: 50px;">
          <el-col :span="16">

            <el-row :gutter="20" type="flex">
              <el-col :span="8">
                <div class="grid-content" style="height: 100%;">
                  <el-card v-loading="lpLockers.loading" class="box-card" shadow="never" style="height: 100%;">
                    <el-avatar shape="circle" icon="fas fa-coins" :size="48" style="background: #1EC37F; font-size: 24px;"></el-avatar>
                    <div style="font-size: 24px; font-weight: 600; margin-top: 14px; margin-bottom: 8px;">
                      {{ vueNumberFormat(totalTokens) }}
                    </div>
                    <h2 style="color: #191B1F; opacity: 0.4; font-size: 14px; margin-bottom: 0px;">Total Tokens</h2>
                  </el-card>
                </div>
              </el-col>
              <el-col :span="8">
                <div class="grid-content" style="height: 100%;">
                  <el-card v-loading="lpLockers.loading" class="box-card" shadow="never" style="height: 100%;">
                    <el-avatar shape="circle" :size="48" src="data:image/png;base64,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"></el-avatar>
                    <div style="font-size: 24px; font-weight: 600; margin-top: 14px; margin-bottom: 8px;">
                      {{ vueNumberFormat(totalLiquidityTez) }} ꜩ
                    </div>
                    <h2 style="color: #191B1F; opacity: 0.4; font-size: 14px; margin-bottom: 0px;">Total Value XTZ</h2>
                  </el-card>
                </div>
              </el-col>
              <el-col :span="8">
                <div class="grid-content" style="height: 100%;">
                  <el-card v-loading="lpLockers.loading" class="box-card" shadow="never" style="height: 100%;">
                    <el-avatar shape="circle" icon="fas fa-sack-dollar" :size="48" style="background: #FFCF36; font-size: 24px;"></el-avatar>
                    <div style="font-size: 24px; font-weight: 600; margin-top: 14px; margin-bottom: 8px;">
                      {{ vueNumberFormat(totalLiquidityTez * lpLockers.usdVwap, {prefix: '$', decimal: '.', thousand: ',', precision: 2}) }}
                    </div>
                    <h2 style="color: #191B1F; opacity: 0.4; font-size: 14px; margin-bottom: 0px;">Total Value USD</h2>
                  </el-card>
                </div>
              </el-col>
            </el-row>
            <el-row :gutter="20" type="flex" style="margin-top: 20px;">
              <el-col :span="8">
                <div class="grid-content lp-locker-progress" style="height: 100%;">
                  <el-card v-loading="lpLockers.loading" class="box-card" shadow="never" style="height: 100%;">
                    <el-avatar shape="circle" :size="48" style="background: #1EC37F;">
                      <img src="./../assets/svg-icons/lock.svg" style="width: 24px; height: 24px; padding: 12px;">
                    </el-avatar>
                    <el-progress :percentage="totalTokensLockedPct" type="circle" :width="48" :stroke-width="8" color="#1EC37F" style="float: right;"></el-progress>
                    <div style="font-size: 24px; font-weight: 600; margin-top: 14px; margin-bottom: 8px;">
                      {{ vueNumberFormat(totalTokensLocked) }}
                    </div>
                    <h2 style="color: #191B1F; opacity: 0.4; font-size: 14px; margin-bottom: 0px;">Total Tokens Locked</h2>
                  </el-card>
                </div>
              </el-col>
              <el-col :span="8">
                <div class="grid-content lp-locker-progress" style="height: 100%;">
                  <el-card v-loading="lpLockers.loading" class="box-card" shadow="never" style="height: 100%;">
                    <el-avatar shape="circle" :size="48" style="background: #555CFF;">
                      <img src="./../assets/svg-icons/lock.svg" style="width: 24px; height: 24px; padding: 12px;">
                    </el-avatar>
                    <el-progress :percentage="totalTvlTezPct" type="circle" :width="48" :stroke-width="8" color="#555CFF" style="float: right;"></el-progress>
                    <div style="font-size: 24px; font-weight: 600; margin-top: 14px; margin-bottom: 8px;">
                      {{ vueNumberFormat(lpLockers.totalTvlTez) }} ꜩ
                    </div>
                    <h2 style="color: #191B1F; opacity: 0.4; font-size: 14px; margin-bottom: 0px;">Total Value Locked (XTZ)</h2>
                  </el-card>
                </div>
              </el-col>
              <el-col :span="8">
                <div class="grid-content" style="height: 100%;">
                  <el-card v-loading="lpLockers.loading" class="box-card" shadow="never" style="height: 100%;">
                    <el-avatar shape="circle" :size="48" style="background: #FFCF36;">
                      <img src="./../assets/svg-icons/lock.svg" style="width: 24px; height: 24px; padding: 12px;">
                    </el-avatar>
                    <div style="font-size: 24px; font-weight: 600; margin-top: 14px; margin-bottom: 8px;">
                      {{ vueNumberFormat(lpLockers.totalTvlTez * lpLockers.usdVwap, {prefix: '$', decimal: '.', thousand: ',', precision: 2}) }}
                    </div>
                    <h2 style="color: #191B1F; opacity: 0.4; font-size: 14px; margin-bottom: 0px;">Total Value Locked (USD)</h2>
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

        <el-row :gutter="20" type="flex" align="bottom">
          <el-col :span="8">
            <div class="grid-content">
              <h2 style="margin-top: 0; margin-bottom: 5px;">Deep Freezers</h2>
              <span style="font-size: 14px;">Lock Liquidity Pool (LP) tokens and unlock at a fixed date.</span>
            </div>
          </el-col>
          <el-col :span="16">
            <div class="grid-content" style="text-align: right;">
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
        </el-row>

        <el-row type="flex" class="freezer-list" style="margin-top: 25px;">
          <el-col :span="24">
            <div class="grid-content">
              <el-card class="box-card" v-loading="lpLockers.loading">

                <el-row type="flex" align="middle" style="color: #757679; font-size: 14px; font-weight: 600; border-bottom: 2px solid #f4f4f4; padding-bottom: 14px; margin-bottom: 14px;">
                  <el-col :span="24">
                    <el-row :gutter="20" type="flex" align="middle" style="padding: 0 20px;">
                      <el-col :span="1">DEX</el-col>
                      <el-col :span="6">LP Pair</el-col>
                      <el-col style="text-align: right;" :span="4">Total Liquidity</el-col>
                      <el-col style="text-align: right;" :span="4">TVL
                        <el-tooltip content="Total Value Locked" placement="top" effect="light">
                          <i class="fas fa-question-circle"></i>
                        </el-tooltip>
                      </el-col>
                      <el-col style="text-align: right;" :span="4">Tokens Locked</el-col>
                      <el-col style="text-align: right;" :span="5">Next Unlock</el-col>
                    </el-row>
                  </el-col>
                </el-row>

                <LpLockerListingRow
                  v-for="locker in orderedLockers"
                  :key="locker.id"
                  :locker="locker"
                  :showUsd="showUsd"
                ></LpLockerListingRow>

              </el-card>
            </div>
          </el-col>
        </el-row>

        <LpLockerCreateDialog ref="createDialog" />

      </el-main>

  </div>
</template>

<script>
import _ from 'lodash';
import { mapState, mapActions } from 'vuex'
import NavWallet from './NavWallet.vue';
import DaasCard from './DaasCard.vue';
import LpLockerListingRow from './LpLockerListingRow.vue';
import LpLockerCreateDialog from './LpLockerCreateDialog.vue';
import { BigNumber } from 'bignumber.js'

export default {
  name: 'LpLockerListing',
  components: {
    NavWallet,
    DaasCard,
    LpLockerListingRow,
    LpLockerCreateDialog
  },
  data() {
    return {
      showUsd: false
    }
  },
  computed: {
    ...mapState([
      'wallet',
      'lpLockers'
    ]),

    orderedLockers: function () {
      return _.orderBy(this.lpLockers.data, 'tvlTez', 'desc');
    },

    totalTokens: function () {
      return Object.values(this.lpLockers.data).reduce((prev, current) => {
        return prev.plus(BigNumber(current.token.qptTokenSupply))
      }, BigNumber(0)).toNumber();
    },

    totalTokensLocked: function () {
      return Object.values(this.lpLockers.data).reduce((prev, current) => {
        return prev.plus(BigNumber(current.amountLocked))
      }, BigNumber(0)).toNumber();
    },

    totalTokensLockedPct: function () {
      return ((this.totalTokensLocked / this.totalTokens) * 100).toFixed(1);
    },

    totalLiquidityTez: function () {
      return Object.values(this.lpLockers.data).reduce((prev, current) => {
        return prev.plus(BigNumber(current.totalLiquidityTez))
      }, BigNumber(0)).toNumber();
    },

    totalTvlTezPct: function () {
      return ((this.lpLockers.totalTvlTez / this.totalLiquidityTez) * 100).toFixed(1);
    }
  },
  created() {
    this.refresh();
  },
  methods: {
    ...mapActions([
      'fetchAllLpLocks',
    ]),

    refresh() {
      this.fetchAllLpLocks();
    },

    showCreateDialog() {
      this.$refs.createDialog.showDialog();
    }

  }
}
</script>

<style lang="scss" scoped>
@import "../crunchy-variables.scss";
@import "~element-ui/packages/theme-chalk/src/common/var";

#lp-locker-listing {
    position: relative;
    width: 100%;
    max-width: 1450px;
    margin: 0 auto;
}

</style>
