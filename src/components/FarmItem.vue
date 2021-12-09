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
              <p>Farm Total Value</p>
            </div>

            <div style="margin-right: 16px" class="legend-bar">
              <div style="margin-right: 8px; background: #1EC391" class="circle"></div>
              <p>Farm Liquidity</p>
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
        <el-col :xs="24" :lg="15">
          <el-card>
            <el-row type="flex" justify="space-between">
              <div style="flex: 1">
                <el-row type="flex" justify="space-between">
                  <div>
                    <p style="margin: 0 0 16px 0; font-size: 14px; color: #191B1F; opacity: 0.4; font-weight: 800">
                      CRUNCH EARNED
                    </p>
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
                    <p style="margin: 0 0 16px 0; font-size: 14px; color: #191B1F; opacity: 0.4; font-weight: 800">
                      LP TOKENS STAKED
                    </p>
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
                  <el-button style="flex: 1; background: rgba(25,27,31,.05); font-weight:800">
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

        <el-col :xs="24" :lg="9">
          <el-card>
            <div>
              <el-row type="flex" justify="space-between" :gutter="10">
                <el-col>
                  <p style="margin: 0 0 12px 0; font-size: 14px; color: #191B1F; opacity: 0.4; font-weight: 800">
                    CURRENT BONUS
                  </p>

                  <h2 style="margin: 0px; font-size: 24px">40X</h2>
                  <p style="margin: 0; font-size: 14px; color: #191B1F; font-weight: 800"><span style=" opacity: 0.4">Farm Ends on </span>4 Mar 2021</p>
                </el-col>

                <el-button style="padding-left: 14px; padding-right: 14px;" type="primary" plain icon="fal fa-calendar"> </el-button>
              </el-row>
            </div>

            <el-divider style="margin: 32px 0 "></el-divider>
            
          </el-card>
        </el-col>

        <el-col :xs="24" :lg="15"><el-card></el-card></el-col>

        <el-col :xs="24" :lg="9"><el-card></el-card> </el-col>
      </el-row>
    </el-main>
  </div>
</template>

<script>
import NavWallet from "./NavWallet.vue";
export default {
  components: { NavWallet },
  name: "FarmItem",
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
  p {
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
