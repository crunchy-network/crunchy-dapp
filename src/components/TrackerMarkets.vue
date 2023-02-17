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
                          "
                        />

                        <a
                          :href="`https://tzkt.io/${item.address}`"
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
          return "https://res.cloudinary.com/melvin-manni/image/upload/v1645292809/nstgjnest4jrhcsgwymf.png";

        case "quipuswap":
          return "https://res.cloudinary.com/melvin-manni/image/upload/v1645292809/c1rutxlzllilmtuibcdo.png";

        case "youves":
          return "https://pbs.twimg.com/profile_images/1397080302196039680/teEliSzA_400x400.png";

        case "vortex":
          return "https://www.gitbook.com/cdn-cgi/image/width=40,height=40,fit=contain,dpr=1,format=auto/https%3A%2F%2F3533877337-files.gitbook.io%2F~%2Ffiles%2Fv0%2Fb%2Fgitbook-x-prod.appspot.com%2Fo%2Fspaces%252FyX7WTYr0YMeQcemP26Of%252Ficon%252F76rbNGaJiDxSJwFIjsLQ%252FGroup%25201494.png%3Falt%3Dmedia%26token%3D829a380f-2d70-4ceb-ac23-8c2aaddf8fe5";

        case "spicyswap":
          return "https://docs.spicyswap.xyz/img/spicy.png";
        case "lb":
          return "https://res.cloudinary.com/melvin-manni/image/upload/v1663433569/lcmsyxatxezrrcovuklr.png";

        default:
          return "";
      }
    },

    capitalize(str) {
      if (str === "lb") {
        return "SIRS (Liquidity Baking)";
      }
      return str.replace(/\b[a-z]/gi, function (char) {
        return char.toUpperCase();
      });
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
