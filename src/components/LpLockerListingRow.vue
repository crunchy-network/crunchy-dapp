<template>
  <el-row
    :data-lock-id="locker.id"
    style="padding-bottom: 14px; font-size: 14px; font-weight: 600"
    type="flex"
    align="top"
  >
    <el-col :span="24">
      <div
        v-loading="locker.loading"
        style="border: var(--line-border); border-radius: 14px"
        :style="[
          locker.rowExpanded
            ? { borderColor: 'var(--border-color)' }
            : { borderColor: 'transparent' },
        ]"
      >
        <el-row
          :gutter="20"
          class="locker-item-row"
          :class="{ expanded: locker.rowExpanded }"
          style="margin-left: 0; margin-right: 0"
          type="flex"
          align="middle"
        >
          <el-col :sm="8" :lg="6" style="font-weight: bold">
            <el-avatar
              shape="circle"
              :size="40"
              style="
                position: relative;
                border: 4px solid #fff;
                vertical-align: middle;
              "
              :src="locker.token.token1.thumbnailUri"
            ></el-avatar>
            <el-avatar
              :src="locker.token.token2.thumbnailUri"
              fit="cover"
              shape="circle"
              :size="40"
              style="
                position: relative;
                border: 4px solid #fff;
                vertical-align: middle;
                margin-left: -18px;
                margin-right: 14px;
              "
            ></el-avatar>
            <p v-show="!isMobile">
              {{ locker.token.token1.symbol }} /
              {{ locker.token.token2.symbol }}
            </p>
          </el-col>

          <el-col :sm="2" :lg="5">
            <template
              v-if="
                locker.token.isQuipuLp ||
                locker.token.isQuipuStableLp ||
                locker.token.isQuipuV2Lp ||
                locker.token.isQuipuToken2TokenLp
              "
            >
              <el-avatar
                :src="logos.quipuswap"
                fit="cover"
                shape="circle"
                :size="40"
                style="
                  position: relative;
                  border: 4px solid #fff;
                  vertical-align: middle;
                  margin-right: 14px;
                "
              ></el-avatar>
              {{
                !isMobile
                  ? locker.token.isQuipuToken2TokenLp
                    ? "QuipuswapTokenToToken"
                    : locker.token.isQuipuV2Lp
                    ? "QuipuswapV2"
                    : locker.token.isQuipuStableLp
                    ? "QuipuswapStable"
                    : "Quipuswap"
                  : ""
              }}
            </template>
            <template v-else-if="locker.token.isSpicyLp">
              <el-avatar
                :src="logos.spicy"
                fit="cover"
                shape="circle"
                :size="40"
                style="
                  position: relative;
                  border: 4px solid #fff;
                  vertical-align: middle;
                  margin-right: 14px;
                "
              ></el-avatar>
              {{ !isMobile ? "Spicyswap" : "" }}
            </template>
            <template
              v-else-if="
                locker.token.isPlentyLp ||
                locker.token.isPlentyCtezLp ||
                locker.token.isPlentyTezLp ||
                locker.token.isPlentyStableLp
              "
            >
              <el-avatar
                :src="logos.plenty"
                fit="cover"
                shape="circle"
                :size="40"
                style="
                  position: relative;
                  border: 4px solid #fff;
                  vertical-align: middle;
                  margin-right: 14px;
                "
              ></el-avatar>
              {{ !isMobile ? Plenty : "" }}
            </template>
          </el-col>

          <el-col style="text-align: right" :sm="7" :lg="4">
            <span v-if="showUsd === false" style="margin-right: 6px"
              >{{ vueNumberFormat(locker.tvlTez) }} ꜩ</span
            >
            <span v-if="showUsd === true" style="margin-right: 6px">{{
              vueNumberFormat(locker.tvlTez * lpLockers.usdVwap, {
                prefix: "$",
                decimal: ".",
                thousand: ",",
                precision: 2,
              })
            }}</span>
            <el-tooltip
              content="Total Value Locked"
              placement="top"
              effect="light"
            >
              <div slot="content">
                <span style="font-weight: 600; padding-bottom: 8px"
                  >{{ vueNumberFormat(locker.amountLocked) }} Tokens</span
                ><br />
                <span style="color: #1ec37f; font-weight: 600"
                  >{{
                    vueNumberFormat(locker.percentLocked, {
                      prefix: "",
                      decimal: ".",
                      thousand: ",",
                      precision: 2,
                    })
                  }}% of LP Locked</span
                >
              </div>
              <el-progress
                :percentage="locker.percentLocked"
                :format="format"
                type="circle"
                :width="24"
                :stroke-width="5"
                color="#1EC37F"
                style="vertical-align: middle"
              ></el-progress>
            </el-tooltip>
          </el-col>

          <el-col
            v-if="showUsd === false"
            class="hidden-md-and-down"
            style="text-align: right"
            :span="4"
            >{{ vueNumberFormat(locker.totalLiquidityTez) }} ꜩ</el-col
          >
          <el-col
            v-if="showUsd === true"
            class="hidden-md-and-down"
            style="text-align: right"
            :span="4"
            >{{
              vueNumberFormat(locker.totalLiquidityTez * lpLockers.usdVwap, {
                prefix: "$",
                decimal: ".",
                thousand: ",",
                precision: 2,
              })
            }}</el-col
          >

          <el-col style="text-align: right" :sm="7" :lg="5">
            <template v-if="locker.isUnlocked">
              <span style="color: #555cff; text-transform: uppercase"
                >Complete</span
              >
            </template>
            <template v-else>
              {{ locker.timeUntilUnlocked | humanizeDuration }}
            </template>
          </el-col>
        </el-row>
      </div>
    </el-col>
  </el-row>
</template>

<script>
import { mapState } from "vuex";

export default {
  name: "LpLockerListingRow",
  components: {},
  props: {
    locker: {
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
      localAbbrevTimeZone: new Date()
        .toLocaleTimeString("en-us", { timeZoneName: "short" })
        .split(" ")[2],
      logos: {
        quipuswap: require("./../assets/logos/quipuswap.png"),
        spicy: require("./../assets/logos/spicy.png"),
        plenty: require("./../assets/dex-icons/Plenty.png"),
      },
    };
  },
  computed: {
    ...mapState(["wallet", "lpLockers"]),
    isMobile() {
      return window.innerWidth <= 450;
    },
  },
  methods: {
    format() {
      return "";
      // return percentage === 100 ? 'Full' : `${percentage}%`;
    },
  },
};
</script>

<style lang="scss" scoped>
@import "../crunchy-variables.scss";
@import "~element-ui/packages/theme-chalk/src/common/var";
@media (max-width: 450px) {
  .locker-item-row .el-col:nth-child(1) {
    position: sticky;
    left: 5px;
    z-index: 1;
    background-color: #191b1f;
  }
  .locker-item-row .el-col:nth-child(2) {
    position: sticky;
    left: 130px;
    z-index: 1;
    background-color: #191b1f;
  }
}
</style>
