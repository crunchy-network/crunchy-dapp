<template>
  <el-row
    :data-farm-id="lp.id"
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
                <el-col style="text-align: left" :span="4">
                  <el-row type="flex" style="align-items: center">
                    <img
                      :src="lp.thumbnailUri"
                      style="
                        position: relative;
                        margin-right: 10px;
                        width: 50px;
                      "
                    />

                    <a
                      :href="lp.url"
                      target="_blank"
                      style="
                        font-weight: 600;
                        font-size: 14px;
                        line-height: 19px;
                        letter-spacing: 0.02em;
                        color: #555cff;
                        text-decoration: none;
                      "
                    >
                      {{ lp.dex }}
                    </a>
                  </el-row>
                </el-col>
                <el-col style="text-align: left" :span="4"></el-col>

                <el-col style="text-align: right" :span="4">
                  {{ lp.positionsCount }}
                </el-col>

                <el-col style="text-align: left" :span="4"></el-col>
                <template aria-describedby=" Total Value">
                  <el-col style="text-align: right" :span="4">
                    {{
                      !showUsd
                        ? vueNumberFormat(lp.totalValue, {
                            prefix: "",
                            suffix: " ꜩ",
                            decimal: ".",
                            thousand: ",",
                            precision: 2,
                          })
                        : vueNumberFormat(lp.totalValueUsd, {
                            prefix: "$",
                            decimal: ".",
                            thousand: ",",
                            precision: 2,
                          })
                    }}
                  </el-col>
                </template>

                <el-col
                  v-show="rowExpanded === false"
                  :span="4"
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
                  :span="4"
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
          <div v-if="lp.positions.length > 0" v-show="rowExpanded">
            <el-row
              :gutter="20"
              type="flex"
              align="top"
              style="padding: 10px 20px; color: #757679; font-size: 14px"
            >
              <el-col :span="4"> Liquidity Pairs</el-col>
              <el-col style="text-align: right" :span="4">LP Tokens</el-col>
              <el-col style="text-align: right" :span="4">XTZ Side</el-col>
              <el-col style="text-align: right" :span="4">Token Side</el-col>
              <el-col style="text-align: right" :span="4">Total Value</el-col>
              <el-col style="text-align: right" :span="4"></el-col>
            </el-row>

            <div v-for="(position, index) in lp.positions" :key="index">
              <el-row
                :gutter="20"
                type="flex"
                style="
                  padding: 10px 20px;
                  color: #191b1f;
                  font-size: 14px;
                  font-weight: 600;
                "
              >
                <el-col :span="4">
                  <el-row v-if="lp.isLbLp" type="flex" style="flex-wrap: wrap">
                    <div style="width: max-content">
                      <el-avatar
                        shape="circle"
                        :size="25"
                        style="
                          position: relative;
                          border: 3px solid #fff;
                          vertical-align: middle;
                        "
                        src="data:image/png;base64,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"
                      ></el-avatar>
                      <el-avatar
                        :src="position.thumbnailUri"
                        fit="cover"
                        shape="circle"
                        :size="25"
                        style="
                          position: relative;
                          border: 3px solid #fff;
                          vertical-align: middle;
                          margin-left: -12px;
                          margin-right: 10px;
                        "
                      ></el-avatar>
                    </div>
                    <span style="color: #555cff">
                      XTZ/{{ position.symbol }}
                    </span>
                  </el-row>

                  <el-row
                    v-else-if="lp.isQuipuLp || lp.isVortexLp"
                    type="flex"
                    style="flex-wrap: wrap"
                  >
                    <div>
                      <el-avatar
                        shape="circle"
                        :size="25"
                        style="
                          position: relative;
                          border: 3px solid #fff;
                          vertical-align: middle;
                        "
                        src="data:image/png;base64,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"
                      ></el-avatar>
                      <el-avatar
                        :src="position.thumbnailUri"
                        fit="cover"
                        shape="circle"
                        :size="25"
                        style="
                          position: relative;
                          border: 3px solid #fff;
                          vertical-align: middle;
                          margin-left: -12px;
                          margin-right: 10px;
                        "
                      ></el-avatar>
                    </div>
                    <span style="color: #555cff">
                      XTZ/{{ position.symbol }}
                    </span>
                  </el-row>

                  <el-row
                    v-else-if="lp.isPlentyLp"
                    type="flex"
                    style="flex-wrap: wrap"
                  >
                    <div>
                      <el-avatar
                        shape="circle"
                        :size="25"
                        style="
                          position: relative;
                          border: 3px solid #fff;
                          vertical-align: middle;
                        "
                        :src="position.token1.thumbnailUri"
                      ></el-avatar>
                      <el-avatar
                        :src="position.token2.thumbnailUri"
                        fit="cover"
                        shape="circle"
                        :size="25"
                        style="
                          position: relative;
                          border: 43px solid #fff;
                          vertical-align: middle;
                          margin-left: -12px;
                          margin-right: 10px;
                        "
                      ></el-avatar>
                    </div>
                    <span style="color: #555cff">
                      {{ position.token1.symbol }}/{{ position.token2.symbol }}
                    </span>
                  </el-row>
                  <el-row v-else type="flex" style="flex-wrap: wrap">
                    <div>
                      <el-tooltip placement="top" effect="light">
                        <el-avatar
                          :src="position.thumbnailUri"
                          fit="cover"
                          shape="circle"
                          :size="25"
                          style="
                            position: relative;
                            border: 3px solid #fff;
                            vertical-align: middle;
                            margin-right: 10px;
                          "
                        ></el-avatar>
                      </el-tooltip>
                    </div>
                    <span style="color: #555cff">
                      {{ position.symbol }}
                    </span>
                  </el-row>
                </el-col>
                <el-col style="text-align: right" :span="4">
                  {{
                    vueNumberFormat(position.lpBalance, {
                      decimal: ".",
                      thousand: ",",
                      precision: 2,
                    })
                  }}
                </el-col>
                <el-col style="text-align: right" :span="4">
                  {{
                    !showUsd
                      ? vueNumberFormat(position.xtzSide, {
                          prefix: "",
                          suffix: " ꜩ",
                          decimal: ".",
                          thousand: ",",
                          precision: 2,
                        })
                      : vueNumberFormat(position.xtzSideUsd, {
                          prefix: "$",
                          decimal: ".",
                          thousand: ",",
                          precision: 2,
                        })
                  }}
                </el-col>
                <template aria-describedby=" Reward Value">
                  <el-col
                    style="text-align: right; vertical-align: center"
                    :span="4"
                  >
                    {{
                      vueNumberFormat(position.tokenSide, {
                        prefix: "",
                        suffix: "",
                        decimal: ".",
                        thousand: ",",
                        precision: 2,
                      })
                    }}
                  </el-col>
                </template>
                <template aria-describedby="Total Value">
                  <el-col style="text-align: right" :span="4">
                    {{
                      !showUsd
                        ? vueNumberFormat(position.totalValue, {
                            prefix: "",
                            suffix: " ꜩ",
                            decimal: ".",
                            thousand: ",",
                            precision: 2,
                          })
                        : vueNumberFormat(position.totalValueUsd, {
                            prefix: "$",
                            decimal: ".",
                            thousand: ",",
                            precision: 2,
                          })
                    }}
                  </el-col>
                </template>
                <el-col style="text-align: right" :span="4"> </el-col>
              </el-row>
            </div>
          </div>
          <div v-else v-show="rowExpanded">
            <h2
              style="
                text-align: center;
                color: #909399;
                font-size: 16px;
                margin-top: 20px;
              "
            >
              You currently do not have any {{ lp.dex }} liquidity pool tokens.
            </h2>
          </div>
        </collapse-transition>
      </div>
    </el-col>
  </el-row>
</template>

<script>
import { CollapseTransition } from "@ivanv/vue-collapse-transition";
import { mapActions } from "vuex";
import { sectionNotAvailable } from "../utils/home-wallet-stake";
export default {
  name: "LiquidityWalletRow",
  components: {
    CollapseTransition,
  },
  props: {
    lp: {
      type: Object,
      required: true,
    },
    showUsd: {
      type: Boolean,
      required: true,
    },
  },
  data() {
    return {
      rowExpanded: false,
    };
  },

  methods: {
    ...mapActions(["harvestFarm", "harvestQuipuLpStake"]),
    collapseRow() {
      this.rowExpanded = false;
    },
    expandRow() {
      this.rowExpanded = true;
    },
    notAvailable(protocol) {
      return sectionNotAvailable(protocol);
    },
  },
};
</script>

<style lang="scss" scoped>
@import "../crunchy-variables.scss";
@import "~element-ui/packages/theme-chalk/src/common/var";
</style>
