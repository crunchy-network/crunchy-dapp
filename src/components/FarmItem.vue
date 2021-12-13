<template>
  <div>
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
            <el-button @click="$router.push({ name: 'farm-create' })" type="primary" round style="font-weight: bold;"
              ><i class="fak fa-crunchy-farm-add" style="margin-right: 6px;"></i> Create a Farm</el-button
            >
            <el-divider direction="vertical"></el-divider>
            <nav-wallet />
          </div>
        </el-col>
      </el-row>
      <el-divider></el-divider>
    </el-header>

    <el-main style="margin-top: 90px;">
      <nav>
        <router-link class="router-link" tag="span" :to="{ name: 'home' }" exact active-class="is-active">
          Home
        </router-link>
        <i class="fal fa-angle-right"></i>
        <router-link class="router-link" tag="span" :to="{ name: 'farms' }" exact active-class="is-active">
          Farms
        </router-link>
        <i class="fal fa-angle-right"></i>
        <span>Crunch/XTZ</span>
      </nav>

      <div class="page-header row-between">
        <div>
          <h2 style="margin-bottom: 0px; font-size: 24px">CRUNCH/TXZ <span style="opacity:0.4">57.6%</span></h2>
        </div>
        <el-row type="flex" align="stretch" justify="space-between" style="margin-top: 25px">
          <el-row type="flex">
            <div style="margin-right: 16px" class="legend-bar">
              <div style="margin-right: 8px; background: #555CFF" class="circle"></div>
              <h2>Farm Total Value</h2>
            </div>

            <div style="margin-right: 16px" class="legend-bar">
              <div style="margin-right: 8px; background: #1EC391" class="circle"></div>
              <h2>Farm Liquidity</h2>
            </div>
          </el-row>
          <el-row>
            <el-button
              plain
              circle
              type="primary"
              icon="far fa-external-link-alt"
              style="font-weight: bold; background: #fff; color: #555CFF; border:1.5px solid #555CFF"
            >
            </el-button>
            <el-button round type="primary" style="font-weight: bold;">
              Buy LP Tokens
            </el-button>
            <el-button plain round type="primary" style="font-weight: bold; background: #fff; color: #555CFF;  border:1.5px solid #555CFF;">
              View Contract
            </el-button>
          </el-row>
        </el-row>
      </div>

      <el-row class="_main-content" style="margin-top: 32px;" :gutter="40">
        <el-col :xs="24" :lg="16" :xl="17">
          <FarmChart
            :labels="['Day 1', 'Day 2', 'Day 3', 'Day 4', 'Day 5', 'Day 6']"
            :liquidity="[16, 50, 33, 21, 30, 9]"
            :totalValue="[24, 79, 55, 32, 92, 11]"
          />
          <el-card>
            <el-row type="flex" justify="space-between">
              <div style="flex: 1">
                <el-row type="flex" justify="space-between">
                  <div>
                    <h2 style="margin: 0 0 16px 0; font-size: 14px; color: #191B1F; opacity: 0.4; font-weight: 800">
                      CRUNCH EARNED
                    </h2>
                    <h2 style="margin: 0px">
                      3.9363829643
                    </h2>
                  </div>

                  <div>
                    <el-avatar
                      src="https://ipfs.fleek.co/ipfs/bafybeienhhbxz53n3gtg7stjou2zs3lmhupahwovv2kxwh5uass3bc5xzq"
                      shape="circle"
                      :size="38"
                    ></el-avatar>
                  </div>
                </el-row>

                <el-button type="success" style="width: 100%; margin-top: 28px; font-weight:800">
                  Harvest Now
                </el-button>
              </div>
              <el-divider direction="vertical" style="margin: 0 28px; height: 100% !important"> </el-divider>
              <div style="flex: 1">
                <el-row type="flex" justify="space-between">
                  <div>
                    <h2 style="margin: 0 0 16px 0; font-size: 14px; color: #191B1F; opacity: 0.4; font-weight: 800">
                      LP TOKENS STAKED
                    </h2>
                    <h2 style="margin: 0px; display: flex; align-items: center">
                      <el-avatar shape="circle" :size="20" style="background: #191B1F; margin-right: 3px">
                        <img src="./../assets/svg-icons/lock.svg" style="width: 10px; margin: auto;" />
                      </el-avatar>
                      3,234.12
                    </h2>
                  </div>

                  <div>
                    <img src="../assets/lp-tokens.svg" />
                  </div>
                </el-row>

                <el-row type="flex" :gutter="5" style="margin-top: 28px">
                  <el-button style="flex: 1; background: rgba(25,27,31,.05); color:  rgba(25,27,31,.8); border: 0; font-weight:800">
                    Deposit
                  </el-button>

                  <el-button disabled style="flex: 1; background: rgba(25,27,31,.05); font-weight:800">
                    Withdraw
                  </el-button>
                </el-row>
              </div>
            </el-row>
          </el-card>
        </el-col>

        <el-col :xs="24" :lg="8" :xl="7">
          <el-card>
            <div>
              <el-row type="flex" justify="space-between" :gutter="10">
                <el-col>
                  <h2 style="margin: 0 0 12px 0; font-size: 14px; color: #191B1F; opacity: 0.4; font-weight: 800">
                    CURRENT BONUS
                  </h2>

                  <h2 style="margin: 0px; font-size: 24px">40X</h2>
                  <h2 style="margin: 0; font-size: 14px; color: #191B1F; font-weight: 800"><span style=" opacity: 0.4">Farm Ends on </span>4 Mar 2021</h2>
                </el-col>

                <el-button style="padding-left: 14px; padding-right: 14px;" type="primary" plain icon="fal fa-calendar"> </el-button>
              </el-row>
            </div>

            <el-divider style="margin: 32px 0 "></el-divider>

            <Timeline :items="timeline" />
          </el-card>
        </el-col>

        <el-col :xs="24" :lg="16" :xl="17">
          <h2 style="margin-bottom: 0px; font-size: 24px">Farm History</h2>
          <h2 style="font-size:16px; color: #191B1F; font-weight: 300; opacity: 0.5; margin-bottom: 19px; margin-top: 5px;">Recent Farm Transactions</h2>

          <el-card>
            <FarmHistoryTable
              :columns="[
                { name: 'Type', accessor: 'type', align: 'left' },
                { name: 'DAI Amount', accessor: 'daiAmount' },
                {
                  name: 'Account',
                  accessor: 'account',
                  color: ' #555CFF',
                  operation: function(param) {
                    const str = param.toString() || '';
                    if (str) {
                      return str.substring(0, 6) + '...' + str.substring(str.length - 3);
                    }
                  },
                },
                { name: 'Time', accessor: 'time', color: 'rgba(25,27,31,0.40)' },
              ]"
              :data="farmersHistory"
            />
          </el-card>
        </el-col>

        <el-col :xs="24" :lg="8" :xl="7">
          <el-card>
            <h2 style="margin: 10px 0 24px 0; font-size: 14px; color: rgba(25,27,31,.40); font-weight: 800">TOP FARMERS • (OUT OF 12,513)</h2>

            <div v-for="(item, index) in farmersList" :key="index">
              <TopFarmerItem :first="index === 0" :last="index + 1 === farmersList.length" :name="item.name" :position="item.position" :own="item.own" />
            </div>
          </el-card>
        </el-col>
      </el-row>
    </el-main>
  </div>
</template>

<script>
import FarmChart from "./FarmChart.vue";
import FarmHistoryTable from "./FarmHistoryTable.vue";
import NavWallet from "./NavWallet.vue";
import Timeline from "./TimelineStep.vue";
import TopFarmerItem from "./TopFarmerItem.vue";

export default {
  name: "FarmItem",
  components: { NavWallet, Timeline, TopFarmerItem, FarmHistoryTable, FarmChart },
  data() {
    return {
      timeline: [
        {
          date: new Date("4 mar 2021"),
          multiple: 40,
          daysLeft: 0,
          status: "completed",
        },
        {
          date: new Date("21 apr 2021"),
          multiple: 30,
          daysLeft: 0,
          status: "completed",
        },
        {
          date: new Date("12 may 2021"),
          multiple: 20,
          daysLeft: 16,
          status: "active",
        },
        {
          date: new Date("3 june 2021"),
          multiple: 10,
          daysLeft: 0,
          status: "pending",
        },
        {
          date: new Date("28 july 2021"),
          multiple: 5,
          daysLeft: 0,
          status: "pending",
        },
      ],
      farmersList: [
        { name: "Jonny Ornaldo", own: "31.567", position: "1st" },
        { name: "Adriana Torres", own: "28.416", position: "2nd" },
        { name: "David Curry", own: "25.967", position: "3rd" },
        { name: "Patricia R Zielke", own: "20.328", position: "4" },
        { name: "Joyce Jones", own: "16.567", position: "5" },
        { name: "Joyce Jones", own: "16.567", position: "6" },
        { name: "Joyce Jones", own: "16.567", position: "6" },
      ],
      farmersHistory: [
        { type: "swap", daiAmount: "47.89%", account: "tz1aYiq11ajxTXA4WfiAvkA7uu7f4eP1vMKX", time: "Just now" },
        { type: "Added", daiAmount: "$648.60m", account: "tz1aYiq11ajxTXA4WfiAvkA7uu7f4eP1vMKX", time: "45 min ago" },
        { type: "swap", daiAmount: "230.23%", account: "tz1aYiq11ajxTXA4WfiAvkA7uu7f4eP1vMKX", time: "1h ago" },
        { type: "swap", daiAmount: "120.42%", account: "tz1aYiq11ajxTXA4WfiAvkA7uu7f4eP1vMKX", time: "24h ago" },
        { type: "Removed", daiAmount: "2,234.02%", account: "tz1aYiq11ajxTXA4WfiAvkA7uu7f4eP1vMKX", time: "45 min ago" },
        { type: "Added", daiAmount: "3,255.02%", account: "tz1aYiq11ajxTXA4WfiAvkA7uu7f4eP1vMKX", time: "16h ago" },
        { type: "Removed", daiAmount: "541.34%", account: "tz1aYiq11ajxTXA4WfiAvkA7uu7f4eP1vMKX", time: "13 min ago" },
      ],
    };
  },

  methods: {},
};
</script>

<style lang="scss" scoped>
@import "../crunchy-variables.scss";
@import "~element-ui/packages/theme-chalk/src/common/var";

nav {
  display: flex;
  align-items: center;
  span {
    font-weight: 600;
    font-size: 16px;
    line-height: 24px;
    letter-spacing: 0.02em;
    color: #191b1f6b;
  }
  .router-link {
    color: #555cff;
    cursor: pointer;
  }
  i {
    margin: 0 10px;
  }
}

.legend-bar {
  background: rgba(25, 27, 31, 0.04);
  border-radius: 8px;
  padding: 4px 8px;
  display: flex;
  align-items: center;
  width: max-content;
  .circle {
    width: 20px;
    height: 20px;
    border-radius: 50%;
  }
  h2 {
    font-weight: 800;
    font-size: 14px;
    margin: 0;
    color: rgba(25, 27, 31, 0.5);
  }
}

._main-content > .el-col {
  margin-bottom: 24px;
}

._main-content .el-divider--vertical {
  height: unset !important;
}
</style>
