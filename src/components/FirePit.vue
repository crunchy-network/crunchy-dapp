<template>
  <div id="fire-pit">
    <nav-menu></nav-menu>
    <el-main style="margin-top: 90px">
      <el-row
        :gutter="20"
        type="flex"
        justify="space-between"
        style="flex-wrap: wrap; row-gap: 20px"
      >
        <el-col :lg="16">
          <div class="grid-content" style="height: 100%">
            <el-card
              class="box-card fire-pit"
              shadow="always"
              style="height: 100%"
            >
              <h2>Fire Pit</h2>
              <p>
                Crunchy offers a free to use public burner contract. Send any
                tokens here that you want to burn for good!
              </p>
              <el-row
                class="column"
                type="flex"
                align="middle"
                :gutter="20"
                style="flex-wrap: wrap"
              >
                <el-col :sm="8" class="text-left" style="text-align: right"
                  ><strong>Burner Contract:</strong></el-col
                >
                <el-col :sm="16">
                  <el-link
                    :href="`https://tzkt.io/${burnRecord.contract}`"
                    target="_blank"
                    style="
                      word-break: break-all;
                      color: var(--color-subheading-text);
                    "
                    >{{ burnRecord.contract }}
                    <i
                      style="color: var(--link-btn-color)"
                      class="far fa-external-link fa-icon-right"
                    ></i
                  ></el-link>
                </el-col>
              </el-row>
              <el-row
                type="flex"
                class="column"
                align="middle"
                :gutter="20"
                style="margin-top: 14px; flex-wrap: wrap"
              >
                <el-col :span="8" class="text-left" style="text-align: right"
                  ><strong>Tezos Domain Alias:</strong></el-col
                >
                <el-col :span="16">
                  <el-link
                    href="https://app.tezos.domains/domain/burner.crunchy.tez"
                    target="_blank"
                    style="color: var(--color-subheading-text)"
                    >burner.crunchy.tez
                    <i
                      style="color: var(--link-btn-color)"
                      class="far fa-external-link fa-icon-right"
                    ></i
                  ></el-link>
                </el-col>
              </el-row>
            </el-card>
          </div>
        </el-col>
        <el-col :lg="6">
          <div class="grid-content" style="height: 100%">
            <CrunchBurned />
          </div>
        </el-col>
      </el-row>

      <el-row
        :gutter="20"
        type="flex"
        align="bottom"
        style="margin-top: 50px; row-gap: 20px; flex-wrap: wrap"
      >
        <el-col :sm="12">
          <div class="grid-content">
            <h2 style="margin-top: 0; margin-bottom: 5px">Burn Record</h2>
          </div>
        </el-col>
        <el-col :sm="12">
          <div class="grid-content" style="text-align: right">
            <el-button
              type="primary"
              plain
              :disabled="burnRecord.loading"
              style="
                border-radius: 10px;
                font-weight: bold;
                padding-left: 48px;
                padding-right: 48px;
                background: var(--color-alt-btn);
                color: #fff;
                border: 0;
              "
              @click="refresh"
              >Refresh</el-button
            >
          </div>
        </el-col>
      </el-row>

      <el-row type="flex" class="farm-list" style="margin-top: 25px">
        <el-col :span="24">
          <div class="grid-content">
            <el-card shadow="always" class="box-card">
              <div class="responsive-table">
                <div>
                  <el-table
                    v-loading="burnRecord.loading"
                    :data="burnRecord.records"
                    style="
                      width: 100%;
                      background-color: var(--background-card) !important;
                    "
                  >
                    <el-table-column
                      prop="level"
                      label="Block Level"
                      width="180"
                    >
                    </el-table-column>
                    <el-table-column label="Burned By">
                      <template slot-scope="scope">
                        <el-link
                          :href="`https://tzkt.io/${scope.row.from.address}`"
                          target="_blank"
                          >{{
                            $async(
                              scope.row.from.domain,
                              `tez-domain-${scope.row.from.address}`
                            ) ||
                            scope.row.from.alias ||
                            scope.row.from.address
                          }}
                          <i class="far fa-external-link fa-icon-right"></i
                        ></el-link>
                      </template>
                    </el-table-column>
                    <el-table-column
                      label="Burn Amount"
                      width="180"
                      align="right"
                    >
                      <template slot-scope="scope">
                        {{
                          vueNumberFormat(
                            Number.parseInt(scope.row.amount) /
                              Math.pow(10, scope.row.token.metadata.decimals)
                          )
                        }}
                      </template>
                    </el-table-column>
                    <el-table-column label="Token" width="280">
                      <template slot-scope="scope">
                        <el-link
                          :href="`https://tzkt.io/${scope.row.token.contract.address}`"
                          target="_blank"
                          >{{
                            scope.row.token.metadata.name ||
                            scope.row.token.metadata.symbol
                          }}
                          <i class="far fa-external-link fa-icon-right"></i
                        ></el-link>
                      </template>
                    </el-table-column>

                    <!-- applied, failed, backtracked, skipped -->
                    <el-table-column label="Status" width="125" align="center">
                      <template slot-scope="scope">
                        <el-popover
                          v-if="scope.row.status == 'applied'"
                          placement="bottom"
                          width="100"
                          trigger="hover"
                          content="Applied"
                          popper-class="popover"
                        >
                          <span slot="reference" class="applied"
                            ><i class="far fa-check-double"></i
                          ></span>
                        </el-popover>
                        <el-popover
                          v-if="scope.row.status == 'backtracked'"
                          placement="bottom"
                          width="100"
                          trigger="hover"
                          content="Backtracked"
                          popper-class="popover"
                        >
                          <span slot="reference" class="backtracked"
                            ><i class="far fa-undo"></i
                          ></span>
                        </el-popover>
                      </template>
                    </el-table-column>

                    <el-table-column label="" width="110" align="right">
                      <template slot-scope="scope">
                        <el-link
                          :href="`https://tzkt.io/${scope.row.hash}`"
                          target="_blank"
                          >View Op
                          <i class="far fa-external-link fa-icon-right"></i
                        ></el-link>
                      </template>
                    </el-table-column>
                  </el-table>
                </div>
              </div>
            </el-card>
          </div>
        </el-col>
      </el-row>
    </el-main>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";
import NavMenu from "./NavMenu.vue";
import CrunchBurned from "./CrunchBurned.vue";

export default {
  name: "FirePit",
  components: {
    NavMenu,
    CrunchBurned,
  },
  computed: {
    ...mapState(["burnRecord", "wallet"]),
  },
  created() {
    this.refresh();
  },
  methods: {
    ...mapActions(["fetchBurnRecords"]),
    refresh() {
      this.fetchBurnRecords();
    },
  },
};
</script>

<style lang="scss" scoped>
@import "../crunchy-variables.scss";
@import "~element-ui/packages/theme-chalk/src/common/var";
html[data-theme="dark"] {
  .fire-pit {
    &:before {
      color: var(--border-color) !important ;
    }
  }
}

#fire-pit {
  position: relative;
  width: 100%;
  max-width: 1450px;
  margin: 0 auto;
}

.fire-pit {
  position: relative;
  overflow: hidden;

  &:before {
    position: absolute;
    font-family: "Font Awesome 5 Pro";
    font-weight: 400;
    bottom: -75px;
    right: 25px;
    content: "\f7e4";
    font-size: 172px;
    color: $--color-danger-lighter;
    z-index: 0;
  }

  p {
    font-size: 14px;
    color: var(--color-subheading-text);
  }
}

.fire-pit div,
.fire-pit p {
  position: relative;
  z-index: 1;
}

.applied {
  color: $--color-success;
}

.backtracked {
  color: $--color-danger;
}

@media (max-width: 768px) {
  .column {
    flex-direction: column !important;
    align-items: flex-start !important;
  }

  .text-left {
    text-align: left !important;
  }
}
</style>
