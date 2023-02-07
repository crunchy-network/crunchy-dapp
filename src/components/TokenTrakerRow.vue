<template>
  <router-link :to="'/token/' + asset.id" exact>
    <el-row
      style="padding-bottom: 14px; font-size: 14px; font-weight: 600"
      type="flex"
      align="top"
    >
      <el-col :span="24">
        <div class="item-row">
          <el-row
            :gutter="20"
            class="farm-row"
            style="margin-left: 0; margin-right: 0"
            type="flex"
            align="middle"
          >
            <el-col :span="2" style="color: var(--color-text)"> {{ asset.order }} </el-col>
            <el-col style="text-align: left" :span="4">
              <el-row type="flex" style="align-items: center">
                <el-avatar
                  :src="asset.thumbnailUri"
                  fit="cover"
                  shape="circle"
                  :size="40"
                  style="
                    position: relative;
                    border: 4px solid var(--bg-avatar);
                    background: transparent;
                    vertical-align: middle;
                    margin-right: 10px;
                  "
                ></el-avatar>
                <a
                  style="color: var(--color-primary); text-decoration: none"
                  target="_blank"
                  :href="`https://tzkt.io/${asset.address}/operations/`"
                >
                  {{ asset.symbol || asset.name }}
                </a>
              </el-row>
            </el-col>

            <el-col style="text-align: right" :span="4">
              <price-format
                prefix="$"
                :precision="4"
                :value="asset.currentPrice"
                :usd-value="asset.usdValue"
              />
            </el-col>
            <el-col style="text-align: right" :span="4">
              <price-format
                v-if="asset.softCalcDone"
                prefix="$"
                :precision="4"
                :value="asset.volume24"
                :usd-value="asset.volume24Usd"
              />
              <span v-else> - </span>
            </el-col>
            <el-col style="text-align: right" :span="4">
              <price-format
                :precision="4"
                prefix="$"
                :value="asset.mktCap"
                :usd-value="asset.mktCapUsd"
              />
            </el-col>

            <el-col
              style="text-align: right"
              :span="2"
              :class="handleChangeclass(asset, 'change1Day', 'change1DayUsd')"
            >
              {{
                asset.contract === "tez"
                  ? "-"
                  : getShowUsd
                  ? vueNumberFormat(asset.change1DayUsd, {
                      prefix: "",
                      suffix: "%",
                      decimal: ".",
                      thousand: ",",
                      precision: 2,
                    })
                  : vueNumberFormat(asset.change1Day, {
                      prefix: "",
                      suffix: "%",
                      decimal: ".",
                      thousand: ",",
                      precision: 2,
                    })
              }}
            </el-col>
            <el-col
              style="text-align: right"
              :span="2"
              :class="handleChangeclass(asset, 'change7Day', 'change7DayUsd')"
            >
              {{
                asset.contract === "tez"
                  ? "-"
                  : getShowUsd
                  ? vueNumberFormat(asset.change7DayUsd, {
                      prefix: "",
                      suffix: "%",
                      decimal: ".",
                      thousand: ",",
                      precision: 2,
                    })
                  : vueNumberFormat(asset.change7Day, {
                      prefix: "",
                      suffix: "%",
                      decimal: ".",
                      thousand: ",",
                      precision: 2,
                    })
              }}
            </el-col>
            <el-col
              style="text-align: right"
              :span="2"
              :class="handleChangeclass(asset, 'change30Day', 'change30DayUsd')"
            >
              {{
                asset.contract === "tez"
                  ? "-"
                  : getShowUsd
                  ? vueNumberFormat(asset.change30DayUsd, {
                      prefix: "",
                      suffix: "%",
                      decimal: ".",
                      thousand: ",",
                      precision: 2,
                    })
                  : vueNumberFormat(asset.change30Day, {
                      prefix: "",
                      suffix: "%",
                      decimal: ".",
                      thousand: ",",
                      precision: 2,
                    })
              }}
            </el-col>
          </el-row>
        </div>
      </el-col>
    </el-row>
  </router-link>
</template>

<script>
import { mapGetters } from "vuex";
import numberFormat from "../utils/number-format";
import PriceFormat from "./PriceFormat.vue";

export default {
  name: "PortfolioWalletRow",
  components: { PriceFormat },
  props: {
    asset: { type: Object, required: true },
  },
  computed: {
    ...mapGetters(["getShowUsd"]),
  },
  methods: {
    getToParams(asset) {
      const tokenId = asset.tokenid ? asset.tokenid : 0;
      return {
        name: "swap",
        query: { from: "tez", to: `${asset.contract}_${tokenId}` },
      };
    },
    handleChangeclass(asset, param, usdParam) {
      let className = "";
      if (this.getShowUsd) {
        className = asset[usdParam] < 0 ? "n-change" : "p-change";
      } else {
        className = asset[param] < 0 ? "n-change" : "p-change";
      }

      return className;
    },
    formatNumShorthand(val) {
      return numberFormat.shorthand(val);
    },
  },
};
</script>

<style lang="scss" scoped>
@import "../crunchy-variables.scss";
@import "~element-ui/packages/theme-chalk/src/common/var";

.item-row {
  /* border: 1px solid #ebeef5; */
  border-radius: 14px;
}

.n-change {
  color: $--color-danger;
}

.p-change {
  color: $--color-success;
}
</style>
