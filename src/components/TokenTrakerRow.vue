<template>
  <router-link :to="'/token-tracker/' + id" exact>
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
            <el-col :span="2"> {{ id }} </el-col>
            <el-col style="text-align: left" :span="4">
              <el-row type="flex" style="align-items: center">
                <el-avatar
                  :src="asset.thumbnail"
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
                  :href="`https://tzkt.io/${asset.contract}/operations/`"
                >
                  {{ asset.token }}
                </a>
              </el-row>
            </el-col>

            <el-col style="text-align: right" :span="4">
              {{
                vueNumberFormat(formatNumShorthand(asset.price).value, {
                  prefix: "$",
                  suffix: formatNumShorthand(asset.price).suffix,
                  decimal: ".",
                  thousand: ",",
                  precision: 2,
                })
              }}
            </el-col>
            <el-col style="text-align: right" :span="4">
              {{
                vueNumberFormat(formatNumShorthand(asset.volume24).value, {
                  prefix: "$",
                  suffix: formatNumShorthand(asset.volume24).suffix,
                  decimal: ".",
                  thousand: ",",
                  precision: 2,
                })
              }}
            </el-col>
            <el-col style="text-align: right" :span="4">
              {{
                vueNumberFormat(formatNumShorthand(asset.mktCap).value, {
                  prefix: "$",
                  suffix: formatNumShorthand(asset.mktCap).suffix,
                  decimal: ".",
                  thousand: ",",
                  precision: 2,
                })
              }}
            </el-col>

            <el-col
              style="text-align: right"
              :span="2"
              :class="asset.change1d < 0 ? 'n-change' : 'p-change'"
            >
              {{
                asset.contract !== "tez"
                  ? vueNumberFormat(asset.change1d, {
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
              :class="asset.change7d < 0 ? 'n-change' : 'p-change'"
            >
              {{
                asset.contract !== "tez"
                  ? vueNumberFormat(asset.change7d, {
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
              :class="asset.change30d < 0 ? 'n-change' : 'p-change'"
            >
              {{
                asset.contract !== "tez"
                  ? vueNumberFormat(asset.change30d, {
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

export default {
  name: "PortfolioWalletRow",
  props: {
    asset: { type: Object, required: true },
    showUsd: { type: Boolean, required: true },
    id: { type: Number, required: true },
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
