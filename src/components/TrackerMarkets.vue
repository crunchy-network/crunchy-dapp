<template>
  <div>
    <el-card v-loading="loading" shadow="always">
      <div class="responsive-table">
        <div>
          <el-row
            type="flex"
            align="middle"
            style="
              font-size: 14px;
              font-weight: 600;
              padding-bottom: 4px;
              margin-bottom: 4px;
              min-width: 900px;
            "
          >
            <el-col :span="24">
              <el-row
                :gutter="20"
                type="flex"
                align="middle"
                style="padding: 0 20px; color: var(--color-subheading-text)"
              >
                <el-col :span="2">#</el-col>
                <el-col :span="7">Exchange</el-col>
                <el-col style="text-align: right" :span="5">Market</el-col>
                <el-col style="text-align: right" :span="5">TVL</el-col>
                <el-col style="text-align: right" :span="5">24h Volume</el-col>
                <el-col style="text-align: right" :span="5">Price</el-col>
              </el-row>
            </el-col>
          </el-row>
          <div v-for="(item, index) in sortedExchanges" :key="index">
            <el-row
              style="font-size: 14px; font-weight: 600"
              type="flex"
              align="top"
            >
              <el-col :span="24">
                <div class="item-row">
                  <el-row
                    :gutter="20"
                    class="farm-row"
                    type="flex"
                    align="middle"
                  >
                    <el-col :span="2">{{ index + 1 }}</el-col>
                    <el-col :span="7">
                      <el-row type="flex" style="align-items: center">
                        <img
                          :src="handleDexUri(item.name)"
                          style="
                            position: relative;
                            margin-right: 10px;
                            width: 30px;
                            height: 29px;
                          "
                        />

                        <a
                          :href="`https://tzkt.io/${item.dex.address}`"
                          target="_blank"
                          style="
                            font-weight: 600;
                            font-size: 14px;
                            line-height: 19px;
                            letter-spacing: 0.02em;
                            color: var(--link-btn-color);
                            text-decoration: none;
                          "
                        >
                          {{ capitalize(item.name) }}
                        </a>
                      </el-row></el-col
                    >
                    <el-col style="text-align: right" :span="5"
                      ><p>{{ item.symbol }}</p></el-col
                    >
                    <el-col style="text-align: right" :span="5">
                      <price-format
                        prefix="$"
                        :value="item.tokenTvl"
                        :usd-value="item.tokenTvlUsd"
                      />
                    </el-col>
                    <el-col style="text-align: right" :span="5">
                      <price-format
                        prefix="$"
                        :value="item.volume24"
                        :usd-value="item.volume24Usd"
                      />
                    </el-col>
                    <el-col style="text-align: right" :span="5">
                      <price-format
                        prefix="$"
                        :precision="5"
                        :value="item.lpPrice"
                        :usd-value="item.lpPriceUsd"
                      />
                    </el-col>
                  </el-row>
                </div>
              </el-col>
            </el-row>
          </div>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import PriceFormat from "./PriceFormat.vue";
import _ from "lodash";
export default {
  name: "TrackerMarkets",
  components: { PriceFormat },
  props: {
    loading: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    ...mapGetters(["getTokenOverview"]),
    sortedExchanges() {
      return (
        _.orderBy(this.getTokenOverview.exchanges, "tokenTvl", "desc") || []
      );
    },
    // markets() {
    //   return this.getTokenOverview.exchanges;
    // },
  },

  watch: {
    getTokenOverview(val) {
      console.log(val);
    },
  },

  methods: {
    handleDexUri(dex = "") {
      switch (dex?.toLowerCase()) {
        case "plenty network":
        case "plenty_stable":
        case "plenty":
        case "plenty_tez":
        case "plenty_ctez":
          return require("../assets/dex-icons/Plenty.png");

        case "quipuswap":
        case "quipuswap_v2":
        case "quipuswap_v3":
        case "quipuswap_stable":
        case "quipuswap_token2token":
          return require("../assets/dex-icons/QuipuswapUpdate.png");

        case "youves":
          return require("../assets/dex-icons/YouvesUpdate.png");

        case "vortex":
          return require("../assets/dex-icons/Vortex.svg");

        case "spicyswap":
        case "spicy":
          return require("../assets/dex-icons/Spicy.png");
        case "lb":
        case "sirius":
          return require("../assets/dex-icons/Sirius.svg");
        case "alien":
          return require("../assets/dex-icons/Alien.png");
        case "flame":
          return require("../assets/dex-icons/Flame.png");
        case "wtz":
          return require("../assets/dex-icons/Wtz.png");
        case "ctez":
          return require("../assets/dex-icons/Ctez.png");
        default:
          return "";
      }
    },

    capitalize(str) {
      switch (str) {
        case "lb":
        case "sirius":
          return "SIRS (Liquidity Baking)";
        case "quipuswap":
          return "Quipuswap";
        case "quipuswap_v2":
          return "Quipuswap V2";
        case "quipuswap_v3":
          return "Quipuswap V3";
        case "quipuswap_stable":
          return "Quipuswap Stable";
        case "quipuswap_token2token":
          return "Quipuswap Token to Token";
        case "plenty_stable":
          return "Plenty stable";
        case "plenty":
          return "Plenty network";
        case "plenty_ctez":
          return "Plenty Ctez";
        case "plenty_tez":
          return "Plenty Tez";
        case "spicy":
          return "Spicyswap";
        default:
          return str.replace(/\b[a-z]/gi, function (char) {
            return char.toUpperCase();
          });
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.tab-wrapper {
  display: flex;
  align-items: flex-start;
}

.tab-text {
  text-align: center;
  padding: 2px 10px;
  font-weight: 600;
  font-size: 14px;
  line-height: 24px;
  text-align: center;
  text-transform: capitalize;
  color: #757679;
  cursor: pointer;
  transition: 0.3s ease all;
  margin: 0;
  border: 0;
  background: transparent;
  &:disabled {
    color: #191b1f66;
    cursor: not-allowed;
  }
}

@media (max-width: 576px) {
  .tab-flex {
    flex-direction: column;
  }
  .tab-custom-element {
    margin-bottom: 0px;
  }
}
</style>
