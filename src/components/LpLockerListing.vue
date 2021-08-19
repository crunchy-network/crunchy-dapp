<template>
  <div id="lp-locker-listing">

      <el-header style="position: fixed; height: 90px; top: 0; left: 230px; right: 0; background: #fff; z-index: 999;">
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
              <el-button @click="showCreateDialog" type="primary" round style="font-weight: bold;"><i class="fas fa-lock-alt" style="margin-right: 6px;"></i> Lock LP Tokens</el-button>
              <el-divider direction="vertical"></el-divider>
              <NavWallet />
            </div>
          </el-col>
        </el-row>
        <el-divider></el-divider>
      </el-header>

      <el-main style="margin-top: 90px;">

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
                      <el-col :span="7">LP Pair</el-col>
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
import LpLockerListingRow from './LpLockerListingRow.vue';
import LpLockerCreateDialog from './LpLockerCreateDialog.vue';

export default {
  name: 'LpLockerListing',
  components: {
    NavWallet,
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
}
</style>
