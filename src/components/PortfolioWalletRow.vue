<template>
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
          <el-col style="text-align: left" :span="4">
            <el-row type="flex" style="align-items: center">
              <el-avatar
                :src="asset.icon"
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
                v-if="asset.contract !== 'tez'"
                style="color: #f15d59; text-decoration: none"
                target="_blank"
                :href="`https://tzkt.io/${asset.contract}/operations/`"
              >
                {{ asset.asset }}
              </a>
              <span style="color: #f15d59" v-if="asset.contract === 'tez'">
                {{ asset.asset }}
              </span>
            </el-row>
          </el-col>

          <el-col style="text-align: right" :span="4">
            <number-format
              :precision="4"
              :value="asset.balance"
              :custom-setting="true"
            />
          </el-col>
          <el-col style="text-align: right" :span="4">
            <price-format
              :precision="4"
              :show-usd="showUsd"
              :usd-value="asset.priceUsd"
              :value="asset.price"
            />
          </el-col>
          <el-col style="text-align: right" :span="4">
            <price-format
              :precision="4"
              :show-usd="showUsd"
              :usd-value="asset.valueUsd"
              :value="asset.value"
            />
          </el-col>

          <el-col
            style="text-align: right"
            :span="2"
            :class="
              handleChangeclass(asset, 'priceChange1Day', 'priceChange1DayUsd')
            "
          >
            {{
              asset.contract === "tez"
                ? "-"
                : getShowUsd
                ? vueNumberFormat(asset.priceChange1DayUsd, {
                    prefix: "",
                    suffix: "%",
                    decimal: ".",
                    thousand: ",",
                    precision: 2,
                  })
                : vueNumberFormat(asset.priceChange1Day, {
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
            :class="
              handleChangeclass(asset, 'priceChange7Day', 'priceChange7DayUsd')
            "
          >
            {{
              asset.contract === "tez"
                ? "-"
                : getShowUsd
                ? vueNumberFormat(asset.priceChange7DayUsd, {
                    prefix: "",
                    suffix: "%",
                    decimal: ".",
                    thousand: ",",
                    precision: 2,
                  })
                : vueNumberFormat(asset.priceChange7Day, {
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
            :class="
              handleChangeclass(
                asset,
                'priceChange30Day',
                'priceChange30DayUsd'
              )
            "
          >
            {{
              asset.contract === "tez"
                ? "-"
                : getShowUsd
                ? vueNumberFormat(asset.priceChange30DayUsd, {
                    prefix: "",
                    suffix: "%",
                    decimal: ".",
                    thousand: ",",
                    precision: 2,
                  })
                : vueNumberFormat(asset.priceChange30Day, {
                    prefix: "",
                    suffix: "%",
                    decimal: ".",
                    thousand: ",",
                    precision: 2,
                  })
            }}
          </el-col>

          <el-col style="text-align: right" :span="2">
            <router-link
              v-if="asset.contract !== 'tez'"
              tag="a"
              :to="getToParams(asset)"
            >
              <el-button style="font-weight: 600" type="text">
                <span style="color: #f15d59">TRADE</span>
              </el-button>
            </router-link>
            <router-link
              v-if="asset.contract === 'tez'"
              tag="a"
              :to="{ name: 'wtz' }"
            >
              <el-button style="font-weight: 600" type="text">
                <span style="color: #f15d59">TRADE</span>
              </el-button>
            </router-link>
          </el-col>
        </el-row>
      </div>
    </el-col>
  </el-row>
</template>

<script>
import { mapGetters } from "vuex";
import NumberFormat from './NumberFormat.vue';
import PriceFormat from "./PriceFormat.vue";
export default {
  name: "PortfolioWalletRow",
  components: { PriceFormat, NumberFormat },
  props: {
    asset: { type: Object, required: true },
    showUsd: { type: Boolean, required: true },
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
