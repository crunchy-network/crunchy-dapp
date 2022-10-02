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
        <el-col :lg="16">
          <el-row
            :gutter="20"
            type="flex"
            style="flex-wrap: wrap; row-gap: 20px"
          >
            <el-col :md="12" :lg="8">
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
                      font-size: 24px;
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
                      font-size: 14px;
                      margin-bottom: 0px;
                    "
                  >
                    Active Farms <span style="float: right">Farmers</span>
                  </h2>
                </el-card>
              </div>
            </el-col>
            <el-col :md="12" :lg="8">
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
                    style="background: #555cff"
                  >
                    <img
                      src="./../assets/svg-icons/lock.svg"
                      style="width: 24px; height: 24px; padding: 12px"
                    />
                  </el-avatar>
                  <div
                    style="
                      font-size: 24px;
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
                      font-size: 14px;
                      margin-bottom: 0px;
                    "
                  >
                    Total Value Locked (XTZ)
                  </h2>
                </el-card>
              </div>
            </el-col>
            <el-col :md="12" :lg="8">
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
                      font-size: 24px;
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
                      font-size: 14px;
                      margin-bottom: 0px;
                    "
                  >
                    Total Value Locked (USD)
                  </h2>
                </el-card>
              </div>
            </el-col>

            <el-col :md="12" :lg="8">
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
                    src="data:image/png;base64,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"
                  >
                  </el-avatar>
                  <div
                    style="font-size: 18px; font-weight: 600; margin-top: 14px"
                  >
                    {{
                      vueNumberFormat(farms.usdVwap, {
                        prefix: "$",
                        decimal: ".",
                        thousand: ",",
                        precision: 2,
                      })
                    }}
                  </div>
                </el-card>
              </div>
            </el-col>
            <el-col :md="12" :lg="8">
              <div class="grid-content" style="height: 100%">
                <el-card
                  v-loading="farms.loading"
                  class="box-card"
                  shadow="always"
                  style="height: 100%"
                >
                  <el-avatar
                    src="https://ipfs.fleek.co/ipfs/bafybeienhhbxz53n3gtg7stjou2zs3lmhupahwovv2kxwh5uass3bc5xzq"
                    fit="cover"
                    shape="circle"
                    :size="48"
                  ></el-avatar>
                  <div
                    style="font-size: 18px; font-weight: 600; margin-top: 14px"
                  >
                    {{ vueNumberFormat(farms.crunchTez) }} ꜩ
                    <span style="color: #bbbbbb; float: right">{{
                      vueNumberFormat(farms.crunchTez * farms.usdVwap, {
                        prefix: "$",
                        decimal: ".",
                        thousand: ",",
                        precision: 2,
                      })
                    }}</span>
                  </div>
                </el-card>
              </div>
            </el-col>
            <el-col :md="12" :lg="8">
              <div class="grid-content" style="height: 100%">
                <el-card
                  v-loading="farms.loading"
                  class="box-card"
                  shadow="always"
                  style="height: 100%"
                >
                  <el-avatar
                    src="https://ipfs.fleek.co/ipfs/bafybeigulbzm5x72qtmckxqvd3ksk6q3vlklxjgpnvvnbcofgdp6qwu43u"
                    fit="cover"
                    shape="circle"
                    :size="48"
                  ></el-avatar>
                  <div
                    style="font-size: 18px; font-weight: 600; margin-top: 14px"
                  >
                    {{ vueNumberFormat(farms.crdaoTez) }} ꜩ
                    <span style="color: #bbbbbb; float: right">{{
                      vueNumberFormat(farms.crdaoTez * farms.usdVwap, {
                        prefix: "$",
                        decimal: ".",
                        thousand: ",",
                        precision: 2,
                      })
                    }}</span>
                  </div>
                </el-card>
              </div>
            </el-col>
          </el-row>
        </el-col>
        <el-col :lg="8">
          <div class="grid-content">
            <DaasCard />
          </div>
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

            <el-divider direction="vertical"></el-divider>
            <el-switch
              v-model="showUsd"
              style="margin-right: 24px"
              active-color="#1EC37F"
              inactive-color="#555CFF"
              active-text="USD"
              inactive-text="XTZ"
            >
            </el-switch>
            <el-button
              type="primary"
              plain
              :disabled="wallet.connected === false"
              style="
                border-radius: 10px;
                font-weight: bold;
                padding-left: 48px;
                padding-right: 48px;
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
import { mapState, mapActions } from "vuex";
// import NavWallet from "./NavWallet.vue";
import DaasCard from "./DaasCard.vue";
import FarmListingRow from "./FarmListingRow.vue";
import FarmStakeDialog from "./FarmStakeDialog.vue";
import FarmUnstakeDialog from "./FarmUnstakeDialog.vue";
import NavMenu from "./NavMenu.vue";

export default {
  name: "FarmListing",
  components: {
    // NavWallet,
    DaasCard,
    FarmListingRow,
    FarmStakeDialog,
    FarmUnstakeDialog,
    NavMenu,
  },
  data() {
    return {
      showUsd: false,
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

  // watch: {
  //   activeTab() {
  //     console.log("++++++++");
  //     console.log(this.farms.userData);
  //   },
  // },

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
