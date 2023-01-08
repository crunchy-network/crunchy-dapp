<template>
  <el-row type="flex" class="freezer-list">
    <el-col :span="24">
      <div class="grid-content">
        <el-card v-loading="lockers.loading" class="box-card" shadow="always">
          <div class="responsive-table">
            <div>
              <el-row
                type="flex"
                align="middle"
                style="
                  color: #757679;
                  font-size: 14px;
                  font-weight: 600;
                  border-bottom: 2px solid #f4f4f4;
                  padding-bottom: 14px;
                  margin-bottom: 14px;
                "
              >
                <el-col :span="24">
                  <el-row
                    :gutter="20"
                    type="flex"
                    align="middle"
                    style="padding: 0 20px"
                  >
                    <el-col :sm="7" :lg="5">Pair</el-col>
                    <el-col :sm="2" :lg="5">DEX</el-col>
                    <el-col style="text-align: right" :sm="7" :lg="4"
                      >TVL
                      <el-tooltip
                        content="Total Value Locked"
                        placement="top"
                        effect="light"
                      >
                        <i class="fas fa-question-circle"></i>
                      </el-tooltip>
                    </el-col>
                    <el-col
                      class="hidden-md-and-down"
                      style="text-align: right"
                      :span="4"
                      >Total Liquidity</el-col
                    >
                    <el-col style="text-align: right" :sm="7" :lg="5"
                      >Next Unlock</el-col
                    >
                    <el-col style="text-align: right" :span="1">&nbsp;</el-col>
                  </el-row>
                </el-col>
              </el-row>

              <LpLockerMyLockersRow
                v-for="locker in orderedLockers"
                :key="locker.id"
                :locker="locker"
                :show-usd="showUsd"
              ></LpLockerMyLockersRow>

              <el-empty
                v-if="!lockers.length"
                description="You have no LP Lockers"
              >
                <i class="fak fa-crunchy-locker"></i>
              </el-empty>
            </div>
          </div>
        </el-card>
      </div>
    </el-col>
  </el-row>
</template>

<script>
import _ from "lodash";
import LpLockerMyLockersRow from "./LpLockerMyLockersRow.vue";

const imgLock = require("../assets/svg-icons/lock.svg");

export default {
  name: "LpLockerMyLockers",
  components: {
    LpLockerMyLockersRow,
  },
  props: {
    lockers: {
      type: Array,
      required: true,
    },
    showUsd: {
      type: Boolean,
      required: true,
    },
  },
  data() {
    return {
      imgLock,
    };
  },
  computed: {
    orderedLockers: function () {
      return _.orderBy(
        this.lockers,
        ["active", "isUnlocked", "tvlTez"],
        ["desc", "asc", "desc"]
      );
    },
  },
};
</script>

<style lang="scss" scoped>
@import "../crunchy-variables.scss";
@import "~element-ui/packages/theme-chalk/src/common/var";

::v-deep {
  .el-empty__image {
    display: none;
  }
  .el-empty__bottom {
    font-size: 72px;
    color: $--color-text-light-gray;
  }
}
</style>
