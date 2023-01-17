<template>
  <el-card
    v-loading="loading"
    shadow="always"
    body-style="padding-bottom: 50px"
    style="height: 100%"
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
      Tokenn Metrics
    </h3>
    <el-row
      type="flex"
      align="middle"
      style="
        font-size: 14px;
        font-weight: 600;
        padding-bottom: 4px;
        width: 100%;
        margin-top: auto;
      "
    >
      <el-col :span="24">
        <el-row type="flex" style="color: #757679">
          <el-col :span="11">
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
                {{
                  vueNumberFormat(getTokenOverview.holders, {
                    decimal: ".",
                    thousand: ",",
                    precision: 0,
                  })
                }}
              </p></el-col
            >
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
          <el-col :span="11">
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
              <price-format
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
    <!-- <el-row
            style="font-size: 14px; font-weight: 600"
            type="flex"
            align="top"
          >
            <el-col :span="24">
              <div class="item-row">
                <el-row
                  class="farm-row"
                  type="flex"
                  align="middle"
                  style="
                    display: grid;
                    grid-template-columns: repeat(7, 1fr);
                    gap: 10px;
                  "
                >
                  <el-col>
                   
                  </el-col>
                  <el-col>
                
                  </el-col>
                  <el-col></el-col>
                  <el-col style="text-align: center">
                  
                  </el-col>
                  <el-col style="text-align: right">
                    
                  </el-col>
                  <el-col style="text-align: right"> - </el-col>
                  <el-col style="text-align: right"> - </el-col>
                </el-row>
              </div>
            </el-col>
          </el-row> -->
  </el-card>
</template>

<script>
import { mapGetters, mapState } from "vuex";
import PriceFormat from "./PriceFormat.vue";
export default {
  name: "TokenMetrics",
  components: { PriceFormat },

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
}
</style>
