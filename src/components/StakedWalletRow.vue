<template>
  <el-row
    :data-farm-id="farm.id"
    style="padding-bottom: 14px; font-size: 14px; font-weight: 600"
    :style="
      rowExpanded
        ? 'border: 1px solid #f3f3f3; border-radius: 14px; margin-bottom: 24px;'
        : 'border: 1px solid #fff; border-radius: 14px; margin-bottom: 0px;'
    "
    type="flex"
    align="top"
  >
    <el-col style="padding: 0px !important" :span="24">
      <div>
        <el-row
          :gutter="20"
          class="farm-row"
          :class="{ expanded: rowExpanded }"
          style="margin-left: 0; margin-right: 0"
          type="flex"
          align="middle"
        >
          <el-col style="padding: 0px !important" :span="24">
            <div class="item-row">
              <el-row
                :gutter="20"
                style="margin-left: 0; margin-right: 0"
                type="flex"
                align="middle"
              >
                <el-col style="text-align: left" :span="6">
                  <el-row type="flex" style="align-items: center">
                    <img
                      :src="farm.icon"
                      style="
                        position: relative;
                        margin-right: 10px;
                        width: 50px;
                      "
                    />

                    <span
                      style="
                        font-weight: 600;
                        font-size: 14px;
                        line-height: 19px;
                        letter-spacing: 0.02em;
                        color: #555cff;
                      "
                    >
                      {{ farm.protocol }}
                    </span>
                  </el-row>
                </el-col>

                <el-col style="text-align: right" :span="4">
                  {{
                    !showUsd
                      ? vueNumberFormat(farm.staked, {
                          prefix: "",
                          suffix: " ꜩ",
                          decimal: ".",
                          thousand: ",",
                          precision: 4,
                        })
                      : vueNumberFormat(farm.stakedUsd, {
                          prefix: "$",
                          decimal: ".",
                          thousand: ",",
                          precision: 2,
                        })
                  }}
                </el-col>

                <el-col style="text-align: right" :span="4">
                  {{
                    !showUsd
                      ? vueNumberFormat(farm.claimable, {
                          prefix: "",
                          suffix: " ꜩ",
                          decimal: ".",
                          thousand: ",",
                          precision: 4,
                        })
                      : vueNumberFormat(farm.claimableUsd, {
                          prefix: "$",
                          decimal: ".",
                          thousand: ",",
                          precision: 2,
                        })
                  }}
                </el-col>
                <el-col style="text-align: right" :span="4">
                  {{
                    !showUsd
                      ? vueNumberFormat(farm.totalValue, {
                          prefix: "",
                          suffix: " ꜩ",
                          decimal: ".",
                          thousand: ",",
                          precision: 4,
                        })
                      : vueNumberFormat(farm.totalValueUsd, {
                          prefix: "$",
                          decimal: ".",
                          thousand: ",",
                          precision: 2,
                        })
                  }}
                </el-col>

                <el-col
                  v-show="rowExpanded === false"
                  :span="6"
                  style="text-align: right"
                  ><el-button
                    type="text"
                    style="font-weight: bold"
                    @click="expandRow"
                    >View Details
                    <i class="fas fa-chevron-down fa-icon-right"></i></el-button
                ></el-col>
                <el-col
                  v-show="rowExpanded === true"
                  :span="6"
                  style="text-align: right"
                  ><el-button
                    type="text"
                    style="font-weight: bold"
                    @click="collapseRow"
                    >Hide Details
                    <i class="fas fa-chevron-up fa-icon-right"></i></el-button
                ></el-col>
              </el-row>
            </div>
          </el-col>
        </el-row>
        <collapse-transition :duration="250" name="slide">
          <div v-show="rowExpanded">
            <el-row
              type="flex"
              align="top"
              style="
                padding: 10px 20px;
                color: #757679;
                font-size: 14px;
                font-weight: 600;
              "
            >
              <el-col :span="6"> Staked Token</el-col>
              <el-col style="text-align: right" :span="4">Staked Value</el-col>
              <el-col style="text-align: right" :span="4">Claimable</el-col>
              <el-col style="text-align: right" :span="4">Total Value</el-col>
            </el-row>

            <div v-for="(stake, index) in farm.data" :key="index">
              <el-row
                type="flex"
                align="top"
                style="
                  padding: 10px 20px;
                  color: #191b1f;
                  font-size: 14px;
                  font-weight: 600;
                "
              >
                <el-col :span="6">
                  <span v-if="stake.poolToken.isLbLp" style="color: #555cff">
                    XTZ/{{ stake.poolToken.symbol }}
                  </span>
                  <span
                    v-else-if="stake.poolToken.isQuipuLp"
                    style="color: #555cff"
                  >
                    XTZ/{{ stake.poolToken.symbol }}
                  </span>
                  <span
                    v-else-if="stake.poolToken.isPlentyLp"
                    style="color: #555cff"
                  >
                    {{ stake.poolToken.token1.symbol }}/{{
                      stake.poolToken.token2.symbol
                    }}
                  </span>
                  <span v-else style="color: #555cff">
                    {{ stake.poolToken.symbol }}
                  </span>
                </el-col>
                <el-col style="text-align: right" :span="4">
                  {{
                    !showUsd
                      ? vueNumberFormat(stake.depositValue, {
                          prefix: "",
                          suffix: " ꜩ",
                          decimal: ".",
                          thousand: ",",
                          precision: 4,
                        })
                      : vueNumberFormat(stake.depositValueUsd, {
                          prefix: "$",
                          decimal: ".",
                          thousand: ",",
                          precision: 2,
                        })
                  }}
                </el-col>
                <el-col style="text-align: right" :span="4">
                  {{
                    !showUsd
                      ? vueNumberFormat(stake.rewardValue, {
                          prefix: "",
                          suffix: " ꜩ",
                          decimal: ".",
                          thousand: ",",
                          precision: 4,
                        })
                      : vueNumberFormat(stake.rewardValueUsd, {
                          prefix: "$",
                          decimal: ".",
                          thousand: ",",
                          precision: 2,
                        })
                  }}
                </el-col>
                <el-col style="text-align: right" :span="4">
                  {{
                    !showUsd
                      ? vueNumberFormat(stake.totalValue, {
                          prefix: "",
                          suffix: " ꜩ",
                          decimal: ".",
                          thousand: ",",
                          precision: 4,
                        })
                      : vueNumberFormat(stake.totalValueUsd, {
                          prefix: "$",
                          decimal: ".",
                          thousand: ",",
                          precision: 2,
                        })
                  }}
                </el-col>
              </el-row>
            </div>
          </div>
        </collapse-transition>
      </div>
    </el-col>
  </el-row>
</template>

<script>
import { CollapseTransition } from "@ivanv/vue-collapse-transition";
export default {
  name: "StakeWalletRow",
  components: {
    CollapseTransition,
  },
  props: ["farm", "showUsd"],
  data() {
    return {
      rowExpanded: false,
    };
  },

  methods: {
    collapseRow() {
      this.rowExpanded = false;
    },
    expandRow() {
      this.rowExpanded = true;
    },
  },
};
</script>

<style lang="scss" scoped>
@import "../crunchy-variables.scss";
@import "~element-ui/packages/theme-chalk/src/common/var";
</style>
