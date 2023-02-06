<template>
  <div id="farm-listing">
    <!-- class="hidden-sm-and-down" -->
    <nav-menu> </nav-menu>
    <!-- class="hidden-sm-and-down" -->
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
              Farms & Gardens
            </h2>
            <span
              style="
                color: #8c8d8f;
                font-weight: 400;
                font-size: 16px;
                line-height: 24px;
              "
              >Stake tokens to earn rewards. Help Gardens grow into Farms
            </span>
          </div>
        </el-col>
        <el-col :span="8" style="text-align: right">
          <el-button
            type="primary"
            round
            style="font-weight: bold"
            @click="$router.push({ name: 'farm-create' })"
          >
            Create a Farm
          </el-button>
        </el-col>
      </el-row>
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
            <el-col :sm="12" :md="8">
              <div class="grid-content" style="height: 100%">
                <el-card
                  v-loading="farms.loading"
                  class="box-card"
                  shadow="always"
                  style="height: 100%"
                >
                  <el-avatar
                    shape="circle"
                    icon="fas fa-farm"
                    :size="48"
                    style="background: #1ec37f; font-size: 24px"
                  >
                  </el-avatar>
                  <el-avatar
                    shape="circle"
                    icon="fas fa-user-cowboy"
                    :size="48"
                    style="font-size: 24px; float: right"
                  >
                  </el-avatar>
                  <div
                    style="
                      font-size: 20px;
                      font-weight: 600;
                      margin-top: 14px;
                      margin-bottom: 8px;
                    "
                  >
                    {{ totalFarms.toFixed(0) }}
                    <span style="float: right">{{
                      vueNumberFormat(farms.storage.vaults.activeKeys, {
                        prefix: "",
                        decimal: ".",
                        thousand: ",",
                        precision: 0,
                      })
                    }}</span>
                  </div>
                  <h2
                    style="
                      color: #191b1f;
                      opacity: 0.4;
                      font-size: 12px;
                      margin-bottom: 0px;
                    "
                  >
                    Active Farms <span style="float: right">Farmers</span>
                  </h2>
                </el-card>
              </div>
            </el-col>
            <el-col :sm="12" :md="8">
              <div class="grid-content" style="height: 100%">
                <el-card
                  v-loading="farms.loading"
                  class="box-card"
                  shadow="always"
                  style="height: 100%"
                >
                  <el-avatar
                    shape="circle"
                    :size="48"
                    style="background: var(--color-primary)"
                  >
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
                    {{ vueNumberFormat(farms.totalTvlTez) }} ꜩ
                  </div>
                  <h2
                    style="
                      color: #191b1f;
                      opacity: 0.4;
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
              <div class="grid-content" style="height: 100%">
                <el-card
                  v-loading="farms.loading"
                  class="box-card"
                  shadow="always"
                  style="height: 100%"
                >
                  <el-avatar
                    shape="circle"
                    :size="48"
                    style="background: #ffcf36"
                  >
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
                      vueNumberFormat(farms.totalTvlTez * farms.usdVwap, {
                        prefix: "$",
                        decimal: ".",
                        thousand: ",",
                        precision: 2,
                      })
                    }}
                  </div>
                  <h2
                    style="
                      color: #191b1f;
                      opacity: 0.4;
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
          border-bottom: 1.5px solid rgba(117, 118, 121, 0.1);
          padding-bottom: 2px;
        "
      >
        <el-col :sm="8">
          <div class="tab-wrapper tab-custom-element">
            <button
              :class="activeTab === 'allFarms' && 'active'"
              @click="setActiveTab('allFarms')"
            >
              All Farms
            </button>
            <button
              :class="activeTab === 'myFarms' && 'active'"
              @click="setActiveTab('myFarms')"
            >
              My Farms
            </button>
          </div>
        </el-col>
        <el-col :sm="16">
          <div
            class="grid-content grid-content-filter"
            style="text-align: right"
          >
            <el-select
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

            <el-button
              type="primary"
              plain
              :disabled="wallet.connected === false"
              style="
                border-radius: 10px;
                font-weight: bold;
                padding-left: 48px;
                padding-right: 48px;
                margin-left: 5px;
              "
              @click="harvestAllFarms"
              >Harvest All</el-button
            >
          </div>
        </el-col>
      </el-row>
      <el-row style="margin-top: 10px">
        <el-col :span="24">
          <div class="grid-content search-input">
            <el-input
              :value="farms.searchInput"
              placeholder="Search farms and pools"
              prefix-icon="fad fa-search"
              @input="updateSearchInput"
            >
            </el-input></div
        ></el-col>
      </el-row>
      <el-row type="flex" class="farm-list" style="margin-top: 25px">
        <el-col :span="24">
          <div class="grid-content">
            <el-card v-loading="farms.loading" shadow="always" class="box-card">
              <div class="responsive-table">
                <div>
                  <el-row
                    type="flex"
                    align="middle"
                    style="
                      color: #757679;
                      font-size: 14px;
                      font-weight: 600;
                      border-bottom: 2px solid #f4f4f4;
                      padding-bottom: 14px;
                      margin-bottom: 14px;
                    "
                  >
                    <el-col :span="24">
                      <el-row
                        :gutter="20"
                        type="flex"
                        align="middle"
                        style="padding: 0 20px"
                      >
                        <el-col :span="7">Farm</el-col>
                        <el-col style="text-align: right" :span="4"
                          >Earned</el-col
                        >
                        <el-col style="text-align: right" :span="3">APR</el-col>
                        <el-col style="text-align: right" :span="4"
                          >TVL
                          <el-tooltip
                            content="Total Value Locked"
                            placement="top"
                            effect="light"
                          >
                            <i class="fas fa-question-circle"></i>
                          </el-tooltip>
                        </el-col>
                        <el-col style="text-align: right" :span="3"
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
                            @click="expandAllFarmRows"
                            >Expand All
                            <i class="fas fa-chevron-down fa-icon-right"></i>
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
                            @click="collapseAllFarmRows"
                            >Collapse All
                            <i class="fas fa-chevron-up fa-icon-right"></i>
                          </el-button>
                        </el-col>
                      </el-row>
                    </el-col>
                  </el-row>

                  <FarmListingRow
                    v-for="farm in orderedFarms"
                    v-show="farm.visible"
                    :key="farm.id"
                    :farm-tab="activeTab"
                    :farm="farm"
                    :show-usd="showUsd"
                    @request-unstake-farm="showUnstakeDialog"
                    @request-stake-farm="showStakeDialog"
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
    orderedFarms: function () {
      const farms =
        this.activeTab === "myFarms" ? this.farms.userData : this.farms.data;
      return _.orderBy(
        farms,
        ["ended", "badges.core", "tvlTez"],
        ["asc", "desc", "desc"]
      );
    },

    totalFarms: function () {
      return Object.values(this.farms.data).length;
    },
  },

  created() {
    if (this.$route.query.q) {
      this.$store.commit("updateFarmsSearchInput", this.$route.query.q);
    }

    if (this.$route.query.f) {
      let filters = this.$route.query.f;
      if (!Array.isArray(filters)) {
        filters = [filters];
      }
      this.$store.commit("updateFarmsFilters", filters);
    }

    this.refresh();
  },
  methods: {
    ...mapActions([
      "connectWallet",
      "disconnectWallet",
      "fetchAllFarms",
      "harvestAllFarms",
      "expandAllFarmRows",
      "collapseAllFarmRows",
      "filterAllFarmRows",
      "searchAllFarmRows",
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

    refresh() {
      this.fetchAllFarms();
    },

    updateSearchInput(input) {
      this.$router.replace({
        query: {
          ...this.$route.query,
          q: input,
        },
      });
      this.$store.commit("updateFarmsSearchInput", input);
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
    },
  },
};
</script>

<style scoped>
#farm-listing {
  position: relative;
  width: 100%;
  max-width: 1450px;
  margin: 0 auto;
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
  color: #757679;
  cursor: pointer;
  transition: 0.3s ease all;
  margin: 0;
  border: 0;
  border-bottom: 3px solid transparent;
  background: transparent;
  margin-right: 7px;
}

.tab-wrapper button.active {
  border-bottom: 3px solid #ff4d4b;
  color: #ff4d4b;
  font-weight: 700;
}

@media (max-width: 450px) {
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
}
</style>
