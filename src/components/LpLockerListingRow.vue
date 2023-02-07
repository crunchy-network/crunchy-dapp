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
        style="border: 1px solid #ebeef5; border-radius: 14px"
        :style="[
          locker.rowExpanded
            ? { borderColor: '#EBEEF5' }
            : { borderColor: '#fff' },
        ]"
      >
        <el-row
          :gutter="20"
          class="locker-row"
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
                order: 4px solid var(--bg-avatar);
                        background: var(--bg-avatar);
                vertical-align: middle;
              "
              src="data:image/png;base64,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"
            ></el-avatar>
            <el-avatar
              :src="locker.token.thumbnailUri"
              fit="cover"
              shape="circle"
              :size="40"
              style="
                position: relative;
                order: 4px solid var(--bg-avatar);
                        background: var(--bg-avatar);
                vertical-align: middle;
                margin-left: -18px;
                margin-right: 14px;
              "
            ></el-avatar>
            XTZ/{{ locker.token.symbol }}
          </el-col>

          <el-col :sm="2" :lg="5">
            <template v-if="locker.token.isQuipuLp">
              <el-avatar
                :src="logos.quipuswap"
                fit="cover"
                shape="circle"
                :size="40"
                style="
                  position: relative;
                  order: 4px solid var(--bg-avatar);
                        background: var(--bg-avatar);
                  vertical-align: middle;
                  margin-right: 14px;
                "
              ></el-avatar>
              Quipuswap
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
              <span style="color: var(--color-primary); text-transform: uppercase"
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
      },
    };
  },
  computed: {
    ...mapState(["wallet", "lpLockers"]),
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
</style>
