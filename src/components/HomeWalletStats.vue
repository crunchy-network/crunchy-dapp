<template>
  <el-row :gutter="40" type="flex" align="middle" style="flex-wrap: wrap">
    <el-col :md="14">
      <el-col style="padding: 0" :md="12">
        <el-card v-loading="loading" shadows="never">
          <div >
            <p class="title">Net Worth</p>
            <h1 class="value fs__32">
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
        </el-card>
      </el-col>

      <el-col style="padding: 0" class="mt__24" :span="24">
        <el-row :gutter="20" type="flex" style="flex-wrap: wrap; row-gap: 20px;">
          <el-col :md="8">
            <el-card v-loading="loading" shadows="never">
              <div >
                <p class="small-title">Portfolio Balance</p>
                <h2 class="value fs__24">
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
              </div>
            </el-card>
          </el-col>
          <!-- <el-col
          style="display: flex; justify-content: center; align-items: center"
          :sm="1"
          class="divider"
        >
          <el-divider direction="vertical"></el-divider>
        </el-col> -->
          <el-col :md="8">
            <el-card v-loading="loading" shadows="never">
              <div >
                <p class="small-title">Staked Balance</p>
                <h2 class="value fs__24">
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
              </div>
            </el-card>
          </el-col>
          <!-- <el-col
          style="display: flex; justify-content: center; align-items: center"
          :sm="1"
          class="divider"
        >
          <el-divider direction="vertical"></el-divider>
        </el-col> -->

          <el-col :md="8">
            <el-card v-loading="loading" shadows="never">
              <div >
                <p class="small-title">Liquidity Balance</p>
                <h2 class="value fs__24">
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
              </div>
            </el-card>
          </el-col>
        </el-row></el-col
      >
    </el-col>
    <el-col class="vector" :md="10">
      <portfolio-vector :width="'100%'" />
    </el-col>
  </el-row>
</template>

<script>
import { mapGetters } from "vuex";
import PortfolioVector from "./PortfolioVector.vue";

export default {
  name: "HomeWalletStats",
  components: { PortfolioVector },
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
  color: var(--color-subheading-text);
  letter-spacing: -0.02em;
}

p.small-title {
  font-weight: 600;
  font-size: 14px;
  line-height: 21px;
  letter-spacing: -0.02em;
  color: var(--color-subheading-text);
}

.value {
  font-weight: 600;
  letter-spacing: -0.02em;
  color: var(--primary-text);
  margin-top: 15px;
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
