<template>
  <el-card
    id="token-metrics"
    v-loading="loading"
    shadow="always"
    body-style="padding-bottom: 50px; flex: 1;  display: flex;
      flex-direction: column;
      justify-content: stretch;"
    style="
      height: 100%;
      display: flex;
      flex-direction: column;
      justify-content: stretch;
    "
  >
    <h3
      style="
        font-weight: 700;
        font-size: 16px;
        line-height: 24px;
        color: #191b1f;
        margin-bottom: 32px;
      "
    >
      Token Metrics
    </h3>
    <el-row
      type="flex"
      align="stretch"
      style="
        font-size: 14px;
        font-weight: 600;
        padding-bottom: 4px;
        width: 100%;
        flex: 1;
      "
    >
      <el-col :span="24">
        <el-row type="flex" style="color: #757679; height: 100%">
          <el-col
            style="
              display: flex;
              flex-direction: column;
              justify-content: space-between;
            "
            :span="11"
          >
            <el-col
              >Market Cap Rank
              <p
                style="
                  font-weight: 600;
                  font-size: 14px;
                  line-height: unset;
                  margin: 0;
                  color: rgb(48, 49, 51);
                "
              >
                {{ getTokenOverview.order }}
              </p>
            </el-col>
            <el-col><el-divider direction="horizontal"></el-divider></el-col>
            <el-col
              >24h Trading Vol<price-format
                :precision="4"
                prefix="$"
                :value="getTokenOverview.volume24"
                :usd-value="getTokenOverview.volume24Usd"
            /></el-col>
            <el-col><el-divider direction="horizontal"></el-divider></el-col>
            <el-col
              >Holders
              <p
                style="
                  font-weight: 600;
                  font-size: 14px;
                  line-height: unset;
                  margin: 0;
                  color: rgb(48, 49, 51);
                "
              >
                <number-format
                  :value="getTokenOverview.holders"
                  :precision="2"
                /></p
            ></el-col>
          </el-col>
          <el-col :span="2">
            <div
              style="
                display: flex;
                flex-direction: column;
                align-items: stretch;
                justify-content: center;
                width: 100%;
                height: 100%;
              "
            >
              <el-divider id="center-divider" direction="vertical"></el-divider>
            </div>
          </el-col>
          <el-col
            style="
              display: flex;
              flex-direction: column;
              justify-content: space-between;
            "
            :span="11"
          >
            <el-col style="text-align: right"
              >Market Cap
              <price-format
                :precision="4"
                :value="getTokenOverview.mktCap"
                :usd-value="getTokenOverview.mktCapUsd"
              />
            </el-col>
            <el-col><el-divider direction="horizontal"></el-divider></el-col>
            <el-col style="text-align: right"
              >Total Supply
              <number-format
                :precision="4"
                :value="getTokenOverview.calcSupply"
                custom-setting
            /></el-col>
            <el-col><el-divider direction="horizontal"></el-divider></el-col>
            <el-col style="text-align: right"
              >DEX Tvl
              <price-format
                :precision="4"
                prefix="$"
                :value="getTokenOverview.tokenTvl"
                :usd-value="getTokenOverview.tokenTvlUsd"
            /></el-col>
          </el-col>
        </el-row>
      </el-col>
    </el-row>
  </el-card>
</template>

<script>
import { mapGetters, mapState } from "vuex";
import NumberFormat from "./NumberFormat.vue";
import PriceFormat from "./PriceFormat.vue";
export default {
  name: "TokenMetrics",
  components: { PriceFormat, NumberFormat },

  computed: {
    ...mapGetters(["getTokenOverview"]),
    ...mapState(["tokenTracker"]),
    loading() {
      return this.tokenTracker.loading;
    },
  },
};
</script>

<style lang="scss">
#center-divider {
  height: 100% !important;
  margin: auto !important;
  width: 1px !important;
  background: #e8e9e9;
}

#token-metrics .el-divider--horizontal {
  height: 1px !important;
  background: #e8e9e9;
}
</style>
