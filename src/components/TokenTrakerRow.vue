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
            <el-col :span="2"> {{ asset.order }} </el-col>
            <el-col style="text-align: left" :span="4">
              <el-row type="flex" style="align-items: center">
                <el-avatar
                  :src="asset.thumbnailUri"
                  fit="cover"
                  shape="circle"
                  :size="40"
                  style="
                    position: relative;
                    border: 4px solid #fff;
                    vertical-align: middle;
                    margin-right: 10px;
                  "
                ></el-avatar>
                <a
                  style="color: #555cff; text-decoration: none"
                  target="_blank"
                  :href="`https://tzkt.io/${asset.address}/operations/`"
                >
                  {{ asset.symbol || asset.name }}
                </a>
              </el-row>
            </el-col>

            <el-col style="text-align: right" :span="4">
              <price-format prefix="$" :precision="4" :value="asset.usdValue" />
            </el-col>
            <el-col style="text-align: right" :span="4">
              <price-format
                v-if="asset.softCalcDone"
                prefix="$"
                :precision="4"
                :value="asset.volume24"
              />
              <span v-else> - </span>
            </el-col>
            <el-col style="text-align: right" :span="4">
              <price-format :precision="4" prefix="$" :value="asset.mktCap" />
            </el-col>

            <el-col
              style="text-align: right"
              :span="2"
              :class="asset.change1Day < 0 ? 'n-change' : 'p-change'"
            >
              {{
                asset.contract !== "tez"
                  ? vueNumberFormat(asset.change1DayUsd, {
                      prefix: "",
                      suffix: "%",
                      decimal: ".",
                      thousand: ",",
                      precision: 2,
                    })
                  : "-"
              }}
            </el-col>
            <el-col
              style="text-align: right"
              :span="2"
              :class="asset.change7DayUsd < 0 ? 'n-change' : 'p-change'"
            >
              {{
                asset.contract !== "tez"
                  ? vueNumberFormat(asset.change7DayUsd, {
                      prefix: "",
                      suffix: "%",
                      decimal: ".",
                      thousand: ",",
                      precision: 2,
                    })
                  : "-"
              }}
            </el-col>
            <el-col
              style="text-align: right"
              :span="2"
              :class="asset.change30DayUsd < 0 ? 'n-change' : 'p-change'"
            >
              {{
                asset.contract !== "tez"
                  ? vueNumberFormat(asset.change30DayUsd, {
                      prefix: "",
                      suffix: "%",
                      decimal: ".",
                      thousand: ",",
                      precision: 2,
                    })
                  : "-"
              }}
            </el-col>
          </el-row>
        </div>
      </el-col>
    </el-row>
  </router-link>
</template>

<script>
import numberFormat from "../utils/number-format";
import PriceFormat from "./PriceFormat.vue";

export default {
  name: "PortfolioWalletRow",
  components: { PriceFormat },
  props: {
    asset: { type: Object, required: true },
  },
  methods: {
    getToParams(asset) {
      const tokenId = asset.tokenid ? asset.tokenid : 0;
      return {
        name: "swap",
        query: { from: "tez", to: `${asset.contract}_${tokenId}` },
      };
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
