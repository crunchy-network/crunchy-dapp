<template>
  <div id="farm-listing">
    <!-- class="hidden-sm-and-down" -->
    <nav-menu> </nav-menu>
    <!-- class="hidden-sm-and-down" -->
    <el-main>
      <el-row
        :gutter="20"
        type="flex"
        align="middle"
        style="margin-bottom: 24px; flex-wrap: wrap; row-gap: 10px"
      >
        <el-col :span="isMobile ? 24 : 16">
          <div class="grid-content">
            <h2
              style="
                margin-top: 0;
                margin-bottom: 4px;
                font-weight: 700;
                font-size: 24px;
                line-height: 36px;
              "
            >
              Farms & Gardens
            </h2>
            <span
              style="
                color: var(--color-subheading-text);
                font-weight: 400;
                font-size: 14px;
                line-height: 21px;
              "
              >Stake tokens to earn rewards or <strong>create</strong> your own
              farm to allow others to earn rewards staking your tokens.
            </span>
          </div>
        </el-col>
      </el-row>
      <el-row v-show="isMobile" :span="24">
        <el-col
          :span="6"
          style="
            font-size: 16px;
            font-weight: 600;
            line-height: 19px;
            letter-spacing: 0.02em;
            text-align: left;
            color: var(--color-subheading-text);
            display: flex;
            align-items: end;
            margin-bottom: 8px;
          "
        >
          Stats
        </el-col></el-row
      >
      <el-row
        v-show="farms.searchInput.length === 0"
        :gutter="20"
        type="flex"
        style="margin-bottom: 50px; flex-wrap: wrap-reverse; row-gap: 20px"
      >
        <el-col :span="24">
          <el-row
            :gutter="20"
            type="flex"
            style="flex-wrap: wrap; row-gap: 20px"
          >
            <el-col class="farm-box" :sm="12" :md="6">
              <div class="grid-content" style="height: 100%">
                <el-card
                  v-loading="farms.loading"
                  class="box-card"
                  shadow="always"
                  style="height: 100%"
                >
                  <p class="farm-box-content">
                    {{ isMobile ? "Total Farms" : "Total Farms Created" }}
                  </p>
                  <el-row
                    type="flex"
                    justify="space-between"
                    style="align-items: center"
                  >
                    <div
                      style="
                        font-size: 24px;
                        font-weight: 600;
                        margin-right: 8px;
                      "
                    >
                      {{ totalFarms.toFixed(0) }}
                    </div>
                  </el-row>
                </el-card>
              </div>
            </el-col>
            <el-col class="farm-box" :sm="12" :md="6">
              <div class="grid-content" style="height: 100%">
                <el-card
                  v-loading="farms.loading"
                  class="box-card"
                  shadow="always"
                  style="height: 100%"
                >
                  <p class="farm-box-content">Total Farmers</p>
                  <el-row
                    type="flex"
                    justify="space-between"
                    style="align-items: center"
                  >
                    <div
                      style="
                        font-size: 24px;
                        font-weight: 600;
                        margin-right: 8px;
                      "
                    >
                      {{
                        vueNumberFormat(farms.storage.vaults.activeKeys, {
                          prefix: "",
                          decimal: ".",
                          thousand: ",",
                          precision: 0,
                        })
                      }}
                    </div>
                  </el-row>
                </el-card>
              </div>
            </el-col>
            <el-col class="farm-box" :sm="12" :md="6">
              <div class="grid-content" style="height: 100%">
                <el-card
                  v-loading="farms.loading"
                  class="box-card"
                  shadow="always"
                  style="height: 100%"
                >
                  <p class="farm-box-content">Total USD Locked</p>
                  <el-row
                    type="flex"
                    justify="space-between"
                    style="align-items: center"
                  >
                    <div
                      style="
                        font-size: 24px;
                        font-weight: 600;
                        margin-right: 8px;
                      "
                    >
                      ${{
                        formatNumShorthand(farms.totalTvlTez * farms.usdVwap, 2)
                          .value
                      }}{{
                        formatNumShorthand(farms.totalTvlTez * farms.usdVwap, 2)
                          .suffix
                      }}
                    </div>
                  </el-row>
                </el-card>
              </div>
            </el-col>
            <el-col class="farm-box" :sm="12" :md="6">
              <div class="grid-content" style="height: 100%">
                <el-card
                  v-loading="farms.loading"
                  class="box-card"
                  shadow="always"
                  style="height: 100%"
                >
                  <p class="farm-box-content">Total XTZ Locked</p>
                  <el-row
                    type="flex"
                    justify="space-between"
                    style="align-items: center"
                  >
                    <div
                      style="
                        font-size: 24px;
                        font-weight: 600;
                        margin-right: 8px;
                      "
                    >
                      {{ formatNumShorthand(farms.totalTvlTez, 2).value
                      }}{{ formatNumShorthand(farms.totalTvlTez, 2).suffix }}ꜩ
                    </div>
                  </el-row>
                </el-card>
              </div>
            </el-col>
          </el-row>
        </el-col>
      </el-row>
      <el-row
        :gutter="20"
        type="flex"
        align="bottom"
        style="
          margin-top: 20px;
          flex-wrap: wrap;
          row-gap: 20px;
          padding-bottom: 2px;
        "
      >
        <el-col
          class="farm-search-filter"
          :sm="24"
          style="display: flex; justify-content: space-between"
        >
          <span class="btns-wrapper">
            <el-input
              :sm="8"
              :value="farms.searchInput"
              placeholder="Search farms and pools"
              prefix-icon="fad fa-search"
              class="farm-search el-card is-always-shadow"
              style="margin-right: 8px"
              @input="updateSearchInput"
            >
            </el-input>

            <el-select
              :sm="8"
              multiple
              collapse-tags
              :value="farms.filters"
              placeholder="All Farms & Gardens"
              @input="updateFilters"
            >
              <el-option-group
                v-for="group in filterOptions"
                :key="group.label"
                :label="group.label"
              >
                <el-option
                  v-for="item in group.options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-option-group>
            </el-select>
          </span>

          <span>
            <el-button
              class="create-farm-btn"
              type="primary"
              round
              style="font-weight: bold; margin-right: 16px"
              @click="$router.push({ name: 'farm-create' })"
            >
              + Create a Farm
            </el-button>
            <el-button
              class="harvest-farm-btn"
              type="primary"
              plain
              :disabled="wallet.connected === false"
              style="
                border-radius: 20px;
                font-weight: bold;
                padding-left: 48px;
                padding-right: 48px;
                margin-left: 5px;
                background: var(--color-alt-btn);
                color: #fff;
                border: 1px solid var(--color-alt-btn);
              "
              @click="harvestAllFarms"
              >Harvest All</el-button
            >
          </span>
        </el-col>
      </el-row>

      <template v-if="farms.searchInput.length === 0 || myOrderedFarmsVisible > 0">
      <el-row class="myFarm" style="margin-top: 16px">
        <el-col v-show="isMobile" class="farm-box-title" :span="6">
          My Farms
        </el-col>
      </el-row>

      <el-row type="flex" class="farm-list" style="margin-top: 8px">
        <el-col :span="24">
          <div class="grid-content">
            <el-card v-loading="farms.loading" shadow="always" class="box-card">
              <div class="responsive-table">
                <div>
                  <el-row
                    v-show="!isMobile"
                    class="farm-box-title"
                    style="margin-left: 15px"
                    :span="6"
                  >
                    My Farms
                  </el-row>
                  <el-row
                    type="flex"
                    align="middle"
                    style="
                      font-size: 14px;
                      font-weight: 600;
                      border-bottom: var(--line-border);
                      padding-bottom: 4px;
                    "
                  >
                    <el-col :span="24">
                      <el-row
                        :gutter="20"
                        type="flex"
                        align="middle"
                        style="
                          margin-left: 10px;
                          margin-right: 5px;
                          padding: 0 16px;
                          color: var(--color-subheading-text) !important;
                        "
                      >
                        <el-col class="card-title" :span="isMobile ? 6 : 4"
                          >Stake</el-col
                        >
                        <el-col class="card-title" :span="isMobile ? 6 : 4"
                          >Farm</el-col
                        >
                        <el-col
                          class="card-title"
                          style="text-align: right"
                          :span="isMobile ? 6 : 4"
                          >Earned</el-col
                        >
                        <el-col
                          class="card-title"
                          style="text-align: right"
                          :span="isMobile ? 6 : 3"
                          >APR</el-col
                        >
                        <el-col
                          v-show="!isMobile"
                          class="card-title"
                          style="text-align: right"
                          :span="4"
                          >TVL
                          <el-tooltip
                            content="Total Value Locked"
                            placement="top"
                            effect="light"
                          >
                            <i class="fas fa-question-circle"></i>
                          </el-tooltip>
                        </el-col>
                        <el-col
                          v-show="!isMobile"
                          style="text-align: right"
                          :span="3"
                          >Multiplier</el-col
                        >
                        <el-col
                          v-show="farms.myFarmExpanded === false"
                          class="card-title"
                          :span="3"
                          style="text-align: right"
                        >
                          <el-button
                            type="text"
                            style="font-weight: bold"
                            @click="expandMyFarmRows('myFarms')"
                          >
                            <span v-show="!isMobile">Expand All</span>
                            <i
                              v-show="!isMobile"
                              class="fas fa-chevron-down fa-icon-right"
                            ></i>
                          </el-button>
                        </el-col>
                        <el-col
                          v-show="farms.myFarmExpanded === true"
                          class="card-title"
                          :span="3"
                          style="text-align: right"
                        >
                          <el-button
                            type="text"
                            style="font-weight: bold"
                            @click="collapseMyFarmRows('myFarms')"
                          >
                            <span v-show="!isMobile">Collapse All</span>
                            <i
                              v-show="!isMobile"
                              class="fas fa-chevron-up fa-icon-right"
                            ></i>
                          </el-button>
                        </el-col>
                      </el-row>
                    </el-col>
                  </el-row>

                  <el-row
                    v-if="myOrderedFarmsVisible === 0"
                    style="text-align: center; padding-top: 16px"
                  >
                    <span
                      style="
                        color: var(--color-subheading-text);
                        font-weight: 400;
                        font-size: 16px;
                        line-height: 24px;
                      "
                      >When you join a farm, it will show here.
                    </span>
                  </el-row>
                  <FarmListingRow
                    v-for="farm in myOrderedFarms"
                    v-else
                    v-show="farm.visible"
                    :key="farm.id"
                    :farm-tab="activeTab"
                    :farm="farm"
                    :show-usd="showUsd"
                    :farm-type="'myFarms'"
                    @request-unstake-farm="showUnstakeDialogMyFarm"
                    @request-stake-farm="showStakeDialogMyFarm"
                  >
                  </FarmListingRow>
                </div>
              </div>
            </el-card>
          </div>
        </el-col>
      </el-row>

      </template>

      <el-row style="margin-top: 16px">
        <el-col v-show="isMobile" :span="24" class="farm-box-title">
          All Farms
        </el-col>
      </el-row>
      <el-row type="flex" class="farm-list" style="margin-top: 8px">
        <el-col :span="24">
          <div class="grid-content">
            <el-card v-loading="farms.loading" shadow="always" class="box-card">
              <div class="responsive-table">
                <div>
                  <el-row
                    v-show="!isMobile"
                    class="farm-box-title"
                    style="margin-left: 15px"
                    :span="6"
                  >
                    All Farms
                  </el-row>
                  <el-row
                    type="flex"
                    align="middle"
                    style="
                      font-size: 14px;
                      font-weight: 600;
                      border-bottom: var(--line-border);
                      padding-bottom: 4px;
                    "
                  >
                    <el-col :span="24">
                      <el-row
                        :gutter="20"
                        type="flex"
                        align="middle"
                        style="
                          margin-left: 10px;
                          margin-right: 5px;
                          padding: 0 16px;
                          color: var(--color-subheading-text) !important;
                        "
                      >
                        <el-col :span="isMobile ? 6 : 4">Stake</el-col>
                        <el-col :span="isMobile ? 6 : 4">Farm</el-col>
                        <el-col
                          style="text-align: right"
                          :span="isMobile ? 6 : 4"
                          >Earned</el-col
                        >
                        <el-col
                          style="text-align: right"
                          :span="isMobile ? 6 : 3"
                          >APR</el-col
                        >
                        <el-col
                          v-show="!isMobile"
                          style="text-align: right"
                          :span="4"
                          >TVL
                          <el-tooltip
                            content="Total Value Locked"
                            placement="top"
                            effect="light"
                          >
                            <i class="fas fa-question-circle"></i>
                          </el-tooltip>
                        </el-col>
                        <el-col
                          v-show="!isMobile"
                          style="text-align: right"
                          :span="3"
                          >Multiplier</el-col
                        >
                        <el-col
                          v-show="farms.expanded === false"
                          :span="3"
                          style="text-align: right"
                        >
                          <el-button
                            type="text"
                            style="font-weight: bold"
                            @click="expandAllFarmRows('allFarms')"
                          >
                            <span v-show="!isMobile">Expand All</span>
                            <i
                              v-show="!isMobile"
                              class="fas fa-chevron-down fa-icon-right"
                            ></i>
                          </el-button>
                        </el-col>
                        <el-col
                          v-show="farms.expanded === true"
                          :span="3"
                          style="text-align: right"
                        >
                          <el-button
                            type="text"
                            style="font-weight: bold"
                            @click="collapseAllFarmRows('allFarms')"
                          >
                            <span v-show="!isMobile">Collapse All</span>
                            <i
                              v-show="!isMobile"
                              class="fas fa-chevron-up fa-icon-right"
                            ></i>
                          </el-button>
                        </el-col>
                      </el-row>
                    </el-col>
                  </el-row>

                  <FarmListingRow
                    v-for="farm in allOrderedFarms"
                    v-show="farm.visible"
                    :key="farm.id"
                    :farm-tab="activeTab"
                    :farm="farm"
                    :show-usd="showUsd"
                    :farm-type="'allFarms'"
                    @request-unstake-farm="showUnstakeDialogMyFarm"
                    @request-stake-farm="showStakeDialogAllFarm"
                  >
                  </FarmListingRow>
                </div>
              </div>
            </el-card>
          </div>
        </el-col>
      </el-row>

      <FarmStakeDialog ref="stakeDialog" />
      <FarmUnstakeDialog ref="unstakeDialog" />
    </el-main>
  </div>
</template>

<script>
import _ from "lodash";
import { mapState, mapActions, mapGetters } from "vuex";
import FarmListingRow from "./FarmListingRow.vue";
import FarmStakeDialog from "./FarmStakeDialog.vue";
import FarmUnstakeDialog from "./FarmUnstakeDialog.vue";
import NavMenu from "./NavMenu.vue";

export default {
  name: "FarmListing",
  components: {
    FarmListingRow,
    FarmStakeDialog,
    FarmUnstakeDialog,
    NavMenu,
  },
  data() {
    return {
      activeTab: "allFarms",
      defaultFilterOptions: ["farm", "garden", "flash", "pending", "running"],
      filterOptions: [
        {
          label: "Type",
          options: [
            {
              value: "farm",
              label: "Farms",
            },
            {
              value: "garden",
              label: "Gardens",
            },
            {
              value: "flash",
              label: "Flash Farms",
            },
          ],
        },
        {
          label: "Status",
          options: [
            { value: "pending", label: "Pending" },
            { value: "running", label: "Running" },
            { value: "ended", label: "Complete" },
          ],
        },
        {
          label: "Badges",
          options: [
            { value: "verified", label: "Verified" },
            { value: "core", label: "Crunchy Core" },
            { value: "partner", label: "Trusted Partner" },
            { value: "lpLocked", label: "LP Locked" },
          ],
        },
      ],
    };
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
    ...mapState(["wallet", "farms"]),
    ...mapGetters(["getShowUsd"]),
    showUsd() {
      return this.getShowUsd;
    },
    isMobile() {
      return window.innerWidth <= 450;
    },

    allOrderedFarms: function () {
      const farms = this.farms.data;

      return _.orderBy(
        farms,
        ["ended", "badges.core", "tvlTez"],
        ["asc", "desc", "desc"]
      );
    },

    myOrderedFarms: function () {
      const farms = Object.values(this.farms.data).filter(
        (farm) => farm.depositAmount > 0
      );

      return _.orderBy(
        farms,
        ["ended", "badges.core", "tvlTez"],
        ["asc", "desc", "desc"]
      );
    },

    myOrderedFarmsVisible: function () {
      return this.myOrderedFarms.filter(f => f.visible).length;
    },

    totalFarms: function () {
      return Object.values(this.farms.data).length;
    },
  },

  created() {
    this.$store.commit("updateFarmsFilters", this.defaultFilterOptions);
    this.refresh();

    if (this.$route.query.q) {
      this.updateSearchInput(this.$route.query.q);
    }

    if (this.$route.query.f) {
      let filters = this.$route.query.f;
      if (!Array.isArray(filters)) {
        filters = [filters];
      }
      this.updateFilters(filters);
    }
  },
  methods: {
    ...mapActions([
      "connectWallet",
      "disconnectWallet",
      "fetchAllFarms",
      "harvestAllFarms",
      "expandAllFarmRows",
      "expandMyFarmRows",
      "collapseAllFarmRows",
      "collapseMyFarmRows",
      "filterAllFarmRows",
      "searchAllFarmRows",
      "updateFirstLoad",
    ]),

    setActiveTab(val) {
      if (["allFarms", "myFarms"].includes(val)) {
        this.activeTab = val;

        // this.$store.commit("updateFarmsFilters", []);
        // if (val === "myFarms") {
        //   this.$store.commit("updateFarmsFilters", ["staked"]);
        // }
      }
    },

    async refresh() {
      this.updateFirstLoad(true);
      await this.fetchAllFarms();
    },

    updateSearchInput(input) {
      if (this.$route.query.q !== input) {
        this.$router.replace({
          query: {
            ...this.$route.query,
            q: input,
          },
        });
      }
      this.$store.commit("updateFarmsSearchInput", input);
      this.updateFirstLoad(false);
      this.filterAllFarmRows();
    },

    updateFilters(filters) {
      this.$router.replace({
        query: {
          ...this.$route.query,
          f: filters,
        },
      });
      this.$store.commit("updateFarmsFilters", filters);
      this.updateFirstLoad(false);
      this.filterAllFarmRows();
    },

    showStakeDialogMyFarm(farmId) {
      this.$refs.stakeDialog.showDialog(farmId);
    },

    showUnstakeDialogMyFarm(farmId) {
      this.$refs.unstakeDialog.showDialog(farmId);
    },

    showStakeDialogAllFarm(farmId) {
      this.$refs.stakeDialog.showDialog(farmId);
    },

    viewFarmStats(farm) {
      console.log("viewFarmStats", farm); // this will go to dedicated farm page
    },

    formatNumShorthand(value, precision) {
      const number = precision
        ? parseFloat(value).toFixed(precision)
        : Number(value);
      if (isNaN(number)) return { value: 0, suffix: "" };
      if (number < 1000) {
        return { value: number, suffix: "" };
      } else if (number < 1000000) {
        const value = number / 1000;
        const precisedValue = parseFloat(value).toFixed(precision);
        return { value: precisedValue, suffix: "K" };
      } else if (number < 1000000000) {
        const value = (number / 1000000).toFixed(precision);
        return { value, suffix: "M" };
      } else if (number < 1000000000000) {
        const value = number / 1000000000;
        const precisedValue = parseFloat(value).toFixed(precision);
        return { value: precisedValue, suffix: "B" };
      } else {
        const value = number / 1000000000000;
        const precisedValue = parseFloat(value).toFixed(precision);
        return { value: precisedValue, suffix: "T" };
      }
    },
  },
};
</script>

<style lang="scss" scoped>
#farm-listing {
  position: relative;
  width: 100%;
  max-width: 1450px;
  margin: 0 auto;

  input.el-input__inner,
  .search-input .el-input__inner {
    border-radius: 28px;
    background: var(--background-color) !important;
    color: var(--primary-text) !important;
    border: var(--line-border) !important;
    &::placeholder {
      color: var(--color-subheading-text) !important;
    }
  }

  .tab-wrapper {
    display: flex;
    align-items: flex-start;
  }

  .tab-wrapper button {
    min-width: max-content;
    text-align: center;
    padding: 2px 4px;
    font-weight: 600;
    font-size: 16px;
    line-height: 24px;
    text-align: center;
    text-transform: capitalize;
    color: var(--color-menu-inactive);
    cursor: pointer;
    transition: 0.3s ease all;
    margin: 0;
    border: 0;
    border-bottom: 3px solid transparent;
    background: transparent;
    margin-right: 7px;
  }

  .tab-wrapper button.active {
    border-bottom: 3px solid var(--color-menu-active);
    color: var(--color-menu-active);
    font-weight: 700;
  }

  .farm-box-content {
    font-size: 14px;
    font-weight: 600;
    line-height: 19px;
    letter-spacing: 0.02em;
    text-align: left;
    margin-bottom: 5px;
    color: var(--color-subheading-text);
  }

  .farm-box-value {
    font-size: 24px;
    font-weight: 600;
    line-height: 19px;
    letter-spacing: 0.02em;
    text-align: left;
  }
  .farm-search {
    width: 50%;
    border: 0 !important;
  }
  .btns-wrapper {
    width: 52%;
  }
  .farm-box-title {
    font-size: 16px;
    font-weight: 600;
    line-height: 19px;
    letter-spacing: 0.02em;
    text-align: left;
    color: var(--color-subheading-text);
    display: flex;
    align-items: end;
  }
  .card-title {
    font-size: 14px;
    font-weight: 600;
    line-height: 19px;
    letter-spacing: 0.02em;
  }
  @media (max-width: 450px) {
    .responsive-table > div {
      min-width: 100%;
      max-width: 100%;
    }
    .grid-content-filter {
      display: flex;
      flex-direction: column;
      justify-content: center;
      /* align-items: center; */
      row-gap: 10px;
    }

    .grid-content-filter .el-divider {
      margin: 0;
      width: 100% !important;
      height: 1px !important;
    }

    .farm-box {
      width: 50%;
    }
    .farm-box-content {
      font-size: 14px;
      font-weight: 600;
      line-height: 19px;
      letter-spacing: 0.02em;
      text-align: left;
    }
    .farm-box-value {
      font-size: 20px;
      font-weight: 600;
      line-height: 19px;
      letter-spacing: 0.02em;
      text-align: left;
    }
    .btns-wrapper {
      width: 100%;
    }
    .create-farm-btn {
      width: 100%;
      margin-bottom: 16px;
    }
    .harvest-farm-btn {
      width: 100%;
      margin-left: 0 !important;
    }
    .farm-search-filter {
      flex-direction: column;
      gap: 16px;
    }
    .farm-search {
      width: 100%;
      margin-bottom: 16px;
    }
    .el-select {
      width: 100%;
    }
    .el-input__inner {
      text-align: center;
    }
    .myFarm {
      margin-top: 40px !important;
    }
    .farm-box-title {
      align-items: center;
    }
  }
}
</style>
