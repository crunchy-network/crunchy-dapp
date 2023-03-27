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
                  font-size: 14px;
                  font-weight: 600;
                  border-bottom: var(--line-border);
                  padding-bottom: 14px;
                  margin-bottom: 14px;
                "
              >
                <el-col :span="24">
                  <el-row
                    :gutter="20"
                    type="flex"
                    align="middle"
                    style="padding: 0 20px; color: var(--color-subheading-text)"
                  >
                    <el-col :sm="8" :lg="6">Pair</el-col>
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
                  </el-row>
                </el-col>
              </el-row>

              <LpLockerListingRow
                v-for="locker in orderedLockers"
                :key="locker.id"
                :locker="locker"
                :show-usd="showUsd"
              ></LpLockerListingRow>
            </div>
          </div>
        </el-card>
      </div>
    </el-col>
  </el-row>
</template>

<script>
import _ from "lodash";
import LpLockerListingRow from "./LpLockerListingRow.vue";

export default {
  name: "LpLockerListing",
  components: {
    LpLockerListingRow,
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
    return {};
  },
  computed: {
    orderedLockers: function () {
      return _.orderBy(this.lockers, ["isUnlocked", "tvlTez"], ["asc", "desc"]);
    },
  },
};
</script>
