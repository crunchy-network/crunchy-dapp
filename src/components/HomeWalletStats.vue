<template>
  <el-row :gutter="40" type="flex" align="stretch" style="flex-wrap: wrap">
    <el-col :md="14">
      <el-card
        v-loading="loading"
        style="height: 100%"
        body-style="padding: 32px 42px; height: 100%; box-sizing: border-box; display: flex; flex-direction: column; justify-content: space-between"
        shadows="never"
      >
        <div style="margin-bottom: 65px">
          <p class="title">Net Worth</p>
          <h1 class="value">
            {{
              !showUsd
                ? vueNumberFormat(getStatsValues.netWorth.xtz, {
                    prefix: "",
                    suffix: " ꜩ",
                    decimal: ".",
                    thousand: ",",
                    precision: 2,
                  })
                : vueNumberFormat(getStatsValues.netWorth.usd, {
                    prefix: "$",
                    decimal: ".",
                    thousand: ",",
                    precision: 2,
                  })
            }}
          </h1>
        </div>
        <el-row
          type="flex"
          style="row-gap: 10px; flex-wrap: wrap; justify-content: space-between"
        >
          <el-col :span="8" :xs="24" :sm="7">
            <p class="small-title">Portfolio Balance</p>
            <h2 class="value">
              {{
                !showUsd
                  ? vueNumberFormat(getStatsValues.portfolio.xtz, {
                      prefix: "",
                      suffix: " ꜩ",
                      decimal: ".",
                      thousand: ",",
                      precision: 2,
                    })
                  : vueNumberFormat(getStatsValues.portfolio.usd, {
                      prefix: "$",
                      decimal: ".",
                      thousand: ",",
                      precision: 2,
                    })
              }}
            </h2>
          </el-col>
          <el-col
            style="display: flex; justify-content: center; align-items: center"
            :sm="1"
            class="divider"
          >
            <el-divider direction="vertical"></el-divider>
          </el-col>
          <el-col :span="8" :xs="24" :sm="7">
            <p class="small-title">Staked Balance</p>
            <h2 class="value">
              {{
                !showUsd
                  ? vueNumberFormat(getStatsValues.staked.xtz, {
                      prefix: "",
                      suffix: " ꜩ",
                      decimal: ".",
                      thousand: ",",
                      precision: 2,
                    })
                  : vueNumberFormat(getStatsValues.staked.usd, {
                      prefix: "$",
                      decimal: ".",
                      thousand: ",",
                      precision: 2,
                    })
              }}
            </h2>
          </el-col>
          <el-col
            style="display: flex; justify-content: center; align-items: center"
            :sm="1"
            class="divider"
          >
            <el-divider direction="vertical"></el-divider>
          </el-col>
          <el-col :span="8" :xs="24" :sm="7">
            <p class="small-title">Liquidity Balance</p>
            <h2 class="value">
              {{
                !showUsd
                  ? vueNumberFormat(getStatsValues.lp.xtz, {
                      prefix: "",
                      suffix: " ꜩ",
                      decimal: ".",
                      thousand: ",",
                      precision: 2,
                    })
                  : vueNumberFormat(getStatsValues.lp.usd, {
                      prefix: "$",
                      decimal: ".",
                      thousand: ",",
                      precision: 2,
                    })
              }}
            </h2>
          </el-col>
        </el-row>
      </el-card>
    </el-col>
    <el-col class="vector" :md="10">
      <img src="../assets/home-wallet.svg" alt="" />
    </el-col>
  </el-row>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: "HomeWalletStats",
  props: {
    loading: {
      type: Boolean,
    },
    showUsd: {
      type: Boolean,
    },
  },
  computed: {
    ...mapGetters(["getStatsValues"]),
  },

  watch: {
    getStatsValues(val) {
      console.log(val);
    },
  },
};
</script>

<style scoped>
@import "~element-ui/lib/theme-chalk/display.css";

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
p.title {
  font-weight: 600;
  font-size: 16px;
  color: #757679;
  letter-spacing: -0.02em;
}

p.small-title {
  font-weight: 600;
  font-size: 14px;
  line-height: 21px;
  letter-spacing: -0.02em;
  color: #757679;
}

.value {
  font-weight: 600;
  letter-spacing: -0.02em;
  color: #000000;
}

h1.value {
  font-size: 28px;
  line-height: 42px;
}

h2.value {
  font-size: 18px;
  line-height: 27px;
}

.divider {
  opacity: 0.26;
}

.divider .el-divider.el-divider--horizontal {
  margin: 0 !important;
}

img {
  width: 100%;
}

@media (max-width: 991px) {
  .vector {
    display: none;
  }
}
</style>
