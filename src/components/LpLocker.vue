<template>
  <div id="lp-locker">
    <nav-menu />
    <el-main style="margin-top: 90px">
      <el-row
        :gutter="20"
        type="flex"
        align="middle"
        style="margin-bottom: 24px; flex-wrap: wrap; row-gap: 10px"
      >
        <el-col :span="16">
          <div class="grid-content">
            <h2
              style="
                margin-top: 0;
                margin-bottom: 5px;
                font-weight: 700;
                font-size: 28px;
                line-height: 42px;
              "
            >
              Deep Freezers
            </h2>
            <span
              style="
                color: var(--color-subheading-text);
                font-weight: 400;
                font-size: 16px;
                line-height: 24px;
              "
              >Lock Liquidity Pool (LP) tokens and unlock at a fixed date.</span
            >
          </div>
        </el-col>
        <el-col :span="8" style="text-align: right">
          <el-button
            type="primary"
            round
            style="font-weight: bold"
            @click="showCreateDialog"
            ><img
              src="./../assets/svg-icons/lock.svg"
              style="
                width: 24px;
                height: 24px;
                vertical-align: middle;
                margin-right: 6px;
                margin-top: -6px;
                margin-bottom: -6px;
              "
            />Lock LP Tokens</el-button
          >
        </el-col>
      </el-row>

      <el-row
        type="flex"
        :gutter="20"
        style="margin-bottom: 50px; flex-wrap: wrap; row-gap: 20px"
      >
        <el-col :sm="12" :md="8">
          <div class="grid-content lp-locker-progress" style="height: 100%">
            <el-card
              v-loading="lpLockers.loading"
              class="box-card"
              shadow="always"
              style="height: 100%"
            >
              <el-avatar shape="circle" :size="48" style="background: #1ec37f">
                <img
                  src="./../assets/svg-icons/lock.svg"
                  style="width: 24px; height: 24px; padding: 12px"
                />
              </el-avatar>
              <div
                style="
                  font-size: 20px;
                  font-weight: 600;
                  margin-top: 14px;
                  margin-bottom: 8px;
                "
              >
                {{ vueNumberFormat(totalTokensLocked) }}
              </div>
              <h2
                style="
                  color: var(--color-subheading-text);
                  font-size: 12px;
                  margin-bottom: 0px;
                "
              >
                Total Tokens Locked
              </h2>
            </el-card>
          </div>
        </el-col>
        <el-col :sm="12" :md="8">
          <div class="grid-content lp-locker-progress" style="height: 100%">
            <el-card
              v-loading="lpLockers.loading"
              class="box-card"
              shadow="always"
              style="height: 100%"
            >
              <el-avatar shape="circle" :size="48" style="background: #555cff">
                <img
                  src="./../assets/svg-icons/lock.svg"
                  style="width: 24px; height: 24px; padding: 12px"
                />
              </el-avatar>
              <div
                style="
                  font-size: 20px;
                  font-weight: 600;
                  margin-top: 14px;
                  margin-bottom: 8px;
                "
              >
                {{ vueNumberFormat(lpLockers.totalTvlTez) }} ꜩ
              </div>
              <h2
                style="
                  color: var(--color-subheading-text);
                  font-size: 12px;
                  margin-bottom: 0px;
                "
              >
                Total Value Locked (XTZ)
              </h2>
            </el-card>
          </div>
        </el-col>
        <el-col :sm="12" :md="8">
          <div class="grid-content lp-locker-progress" style="height: 100%">
            <el-card
              v-loading="lpLockers.loading"
              class="box-card"
              shadow="always"
              style="height: 100%"
            >
              <el-avatar shape="circle" :size="48" style="background: #ffcf36">
                <img
                  src="./../assets/svg-icons/lock.svg"
                  style="width: 24px; height: 24px; padding: 12px"
                />
              </el-avatar>
              <div
                style="
                  font-size: 20px;
                  font-weight: 600;
                  margin-top: 14px;
                  margin-bottom: 8px;
                "
              >
                {{
                  vueNumberFormat(lpLockers.totalTvlTez * lpLockers.usdVwap, {
                    prefix: "$",
                    decimal: ".",
                    thousand: ",",
                    precision: 2,
                  })
                }}
              </div>
              <h2
                style="
                  color: var(--color-subheading-text);
                  font-size: 12px;
                  margin-bottom: 0px;
                "
              >
                Total Value Locked (USD)
              </h2>
            </el-card>
          </div>
        </el-col>
      </el-row>

      <el-tabs v-model="activeTab">
        <el-tab-pane label="All Locks" name="all">
          <LpLockerListing
            :lockers="activeLockers"
            :show-usd="showUsd"
          ></LpLockerListing>
        </el-tab-pane>
        <el-tab-pane label="My Freezer" name="mine">
          <LpLockerMyLockers
            :lockers="myLockers"
            :show-usd="showUsd"
          ></LpLockerMyLockers>
        </el-tab-pane>
      </el-tabs>

      <LpLockerCreateDialog ref="createDialog" />
    </el-main>
  </div>
</template>

<script>
import _ from "lodash";
import { mapState, mapActions, mapGetters } from "vuex";
import LpLockerListing from "./LpLockerListing.vue";
import LpLockerMyLockers from "./LpLockerMyLockers.vue";
import LpLockerCreateDialog from "./LpLockerCreateDialog.vue";
import { BigNumber } from "bignumber.js";
import NavMenu from "./NavMenu.vue";

export default {
  name: "LpLocker",
  components: {
    LpLockerListing,
    LpLockerMyLockers,
    LpLockerCreateDialog,
    NavMenu,
  },
  data() {
    return {
      activeTab: "all",
    };
  },
  computed: {
    ...mapState(["wallet", "lpLockers"]),
    ...mapGetters(["getShowUsd"]),
    showUsd() {
      return this.getShowUsd;
    },
    myLockers: function () {
      const vm = this;
      return _.filter(this.lpLockers.data, (l) => l.owner === vm.wallet.pkh);
    },

    activeLockers: function () {
      return _.filter(this.lpLockers.data, (l) => l.active === true);
    },

    totalTokens: function () {
      return this.activeLockers
        .reduce((prev, current) => {
          return prev.plus(BigNumber(current.token.qptTokenSupply));
        }, BigNumber(0))
        .toNumber();
    },

    totalTokensLocked: function () {
      return this.activeLockers
        .reduce((prev, current) => {
          return prev.plus(BigNumber(current.amountLocked));
        }, BigNumber(0))
        .toNumber();
    },

    totalTokensLockedPct: function () {
      return ((this.totalTokensLocked / this.totalTokens) * 100).toFixed(1);
    },

    totalLiquidityTez: function () {
      return this.activeLockers
        .reduce((prev, current) => {
          return prev.plus(BigNumber(current.totalLiquidityTez));
        }, BigNumber(0))
        .toNumber();
    },

    totalTvlTezPct: function () {
      return Number(
        ((this.lpLockers.totalTvlTez / this.totalLiquidityTez) * 100).toFixed(1)
      );
    },
  },
  created() {
    this.refresh();
  },
  methods: {
    ...mapActions(["fetchAllLpLocks"]),

    refresh() {
      this.fetchAllLpLocks();
    },

    showCreateDialog() {
      this.$refs.createDialog.showDialog();
    },
  },
};
</script>

<style lang="scss" scoped>
@import "../crunchy-variables.scss";
@import "~element-ui/packages/theme-chalk/src/common/var";

#lp-locker {
  position: relative;
  width: 100%;
  max-width: 1450px;
  margin: 0 auto;
}

::v-deep {
  .el-tabs__item {
    font-size: 16px;
    font-weight: 600;
    color: var(--color-menu-inactive);
    &.is-active {
      color: var(--color-menu-active);
    }
  }
  .el-tabs__active-bar {
    background-color: var(--color-menu-active);
    height: 3px;
  }
  .el-tabs__nav-wrap::after {
    background: $--color-outter-light-gray-border;
  }
  .el-tabs__content {
    overflow: visible;
  }
}
</style>
