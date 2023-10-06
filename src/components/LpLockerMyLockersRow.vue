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
            ? { borderColor: 'transparent' }
            : { borderColor: 'var(--border-color)' },
        ]"
      >
        <el-row
          :gutter="20"
          class="locker-row"
          :class="{ expanded: locker.rowExpanded, withdrawn: !locker.active }"
          style="margin-left: 0; margin-right: 0"
          type="flex"
          align="middle"
        >
          <el-col :sm="7" :lg="5" style="font-weight: bold">
            <el-avatar
              :src="locker.token.token1.thumbnailUri"
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
            {{ locker.token.symbol }}
          </el-col>

          <el-col :sm="2" :lg="5">
            <template
              v-if="
                locker.token.isQuipuLp ||
                locker.token.isQuipuV2Lp ||
                locker.token.isQuipuToken2TokenLp ||
                locker.token.isQuipuStableLp
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
                locker.token.isQuipuToken2TokenLp
                  ? "QuipuswapTokenToToken"
                  : locker.token.isQuipuV2Lp
                  ? "QuipuswapV2"
                  : locker.token.isQuipuStableLp
                  ? "QuipuswapStable"
                  : "Quipuswap"
              }}
            </template>
            <template
              v-if="
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
              Plenty
            </template>
            <template v-if="locker.token.isSpicyLp">
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
              Spicy
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
                v-if="locker.active"
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
            <template v-if="!locker.active">
              <span style="color: #1ec37f; text-transform: uppercase"
                >Withdrawn</span
              >
            </template>
            <template v-else-if="locker.isUnlocked">
              <span style="color: #555cff; text-transform: uppercase"
                >Complete</span
              >
            </template>
            <template v-else>
              {{ locker.timeUntilUnlocked | humanizeDuration }}
            </template>
          </el-col>

          <el-col class="locker-menu" style="text-align: right" :span="1">
            <el-dropdown
              v-if="locker.active"
              trigger="click"
              @command="handleCommand"
            >
              <el-button
                type="primary"
                icon="fak fa-crunchy-more-alt"
                class="_more-btn"
                plain
                circle
              ></el-button>
              <el-dropdown-menu slot="dropdown" :data-lock-id="locker.id">
                <!-- <el-dropdown-item command="add" v-if="!locker.isUnlocked">Add to Lock</el-dropdown-item> -->
                <!-- <el-dropdown-item command="relock" v-if="locker.isUnlocked">Relock</el-dropdown-item> -->
                <!-- <el-dropdown-item command="split">Split Lock</el-dropdown-item> -->
                <el-dropdown-item v-if="locker.isUnlocked" command="withdraw"
                  >Withdrawal LP</el-dropdown-item
                >
                <el-dropdown-item
                  v-if="locker.token.isQuipuLp"
                  command="withdrawProfit"
                  >Claim Baking Rewards</el-dropdown-item
                >
                <!-- <el-dropdown-item command="transfer">Transfer Ownership</el-dropdown-item> -->
              </el-dropdown-menu>
            </el-dropdown>
          </el-col>
        </el-row>
      </div>
    </el-col>
  </el-row>
</template>

<script>
import { mapState, mapActions } from "vuex";

export default {
  name: "LpLockerMyLockersRow",
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
        plenty: require("./../assets/dex-icons/Plenty.png"),
        spicy: require("./../assets/logos/spicy.png"),
      },
    };
  },
  computed: {
    ...mapState(["wallet", "lpLockers"]),
  },
  methods: {
    ...mapActions(["withdrawLp", "withdrawLpProfit"]),

    async handleCommand(command, dropdownItem) {
      const lockId = dropdownItem.$parent.$el.dataset.lockId;

      switch (command) {
        case "withdraw":
          this.withdrawLp({ lockId });
          break;
        case "withdrawProfit":
          this.withdrawLpProfit({ lockId });
          break;
      }
    },

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

::v-deep {
  .withdrawn {
    opacity: 0.5;
  }
  .locker-menu {
    .el-button--primary.is-plain {
      background: #fff;
      border: 2px solid $--color-primary;
      &:hover,
      &:focus {
        background: $--color-primary;
      }

      i {
        width: 14px;
      }
    }
  }
}

html[data-theme="dark"] ._more-btn {
  border: 1px solid #555cff !important;
  background: transparent !important;
  &:hover {
    background: #eeefff !important;
    color: #555cff;
  }
}
</style>
