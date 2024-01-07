<template>
  <el-row
    style="
      padding-bottom: 14px;
      font-size: 14px;
      font-weight: 600;
      min-width: 900px;
    "
    type="flex"
    align="top"
  >
    <el-col :span="24">
      <div class="item-row">
        <el-row
          :gutter="20"
          style="margin-left: 0; margin-right: 0; padding: 20px 10px"
          type="flex"
          align="middle"
        >
          <el-col class="_fave-btn-wrapper" style="height: 100%" :span="1">
            <button
              v-if="asset.isFavorite"
              class="_fave-btn active"
              @click="() => removeTokenAsFavourite(asset.id)"
            >
              <i class="fa-solid fa-star"></i>
            </button>
            <button
              v-else
              class="_fave-btn"
              @click="() => setTokenAsFavourite(asset.id)"
            >
              <i class="fa-regular fa-star"></i>
            </button>
          </el-col>
          <el-col
            :span="23"
            :style="{
              'padding-right': isMobile ? '0px' : '10px',
            }"
          >
            <router-link :to="'/token/' + asset.id" exact>
              <el-row class="tokenTracker-row" type="flex" align="middle">
                <el-col v-if="asset.isRanked" :span="2">{{
                  asset.order
                }}</el-col>
                <el-col v-else :span="2">-</el-col>
                <el-col style="text-align: left" :span="3">
                  <el-row type="flex" style="align-items: center">
                    <el-avatar
                      :src="asset.thumbnailUri"
                      fit="cover"
                      shape="circle"
                      :size="isMobile ? 34 : 40"
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
                  <price-format
                    prefix="$"
                    :precision="!isMobile ? 5 : 2"
                    :value="asset.currentPrice"
                    :usd-value="asset.usdValue"
                  />
                </el-col>
                <el-col style="text-align: right" :span="4">
                  <price-format
                    v-if="asset.softCalcDone"
                    prefix="$"
                    :precision="!isMobile ? 4 : 1"
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
                  :class="
                    handleChangeclass(asset, 'change1Day', 'change1DayUsd')
                  "
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
                  :class="
                    handleChangeclass(asset, 'change7Day', 'change7DayUsd')
                  "
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
                  :class="
                    handleChangeclass(asset, 'change30Day', 'change30DayUsd')
                  "
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
            </router-link>
          </el-col>
        </el-row>
      </div>
    </el-col>
  </el-row>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
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
    isMobile() {
      return window.innerWidth <= 450;
    },
  },
  methods: {
    ...mapActions(["setTokenAsFavourite", "removeTokenAsFavourite"]),
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

._fave-btn {
  background: none;
  border: none;
  outline: none;
  cursor: pointer;
  margin: 0;
  font-size: 18px;
  color: var(--primary-text);
  transition: all 0.3s ease-in-out;
  padding: 2px;

  &.active {
    color: #ffd54f;
  }
  &:hover {
    opacity: 0.65;
  }
}
@media (max-width: 450px) {
  .tokenTracker-row .el-col:nth-child(1) {
    position: sticky;
    left: 38px;
    z-index: 1;
    background-color: #191b1f;
  }

  .tokenTracker-row .el-col:nth-child(2) {
    position: sticky;
    left: 100px;
    z-index: 2;
    background-color: #191b1f;
  }
  .tokenTracker-row {
    display: flex;
    justify-content: space-between;
  }
  ._fave-btn-wrapper {
    position: sticky;
    left: 0px;
    z-index: 2;
    background-color: #191b1f;
  }
}
</style>
