<template>
  <div id="fire-pit">
    <el-header style="position: fixed; height: 90px; top: 0; left: 230px; right: 0; background: #fff; z-index: 999; border-bottom: 1px solid #e8e8e9;">
      <el-row type="flex" class="row-bg" justify="space-between">
        <el-col :span="6">
          <div class="grid-content">
          </div>
        </el-col>
        <el-col :span="12">
          <div class="grid-content" style="text-align: right;">
            <NavWallet />
          </div>
        </el-col>
      </el-row>
    </el-header>
    <el-main style="margin-top: 90px;">
      <el-row :gutter="20" type="flex">
        <el-col :span="16">
          <div class="grid-content" style="height: 100%;">
            <el-card class="box-card fire-pit" shadow="never" style="height: 100%;">
              <h2>Fire Pit</h2>
              <p>Crunchy offers a free to use public burner contract. Send any tokens here that you want to burn for good!</p>
              <el-row type="flex" align="middle" :gutter="20">
                <el-col :span="8" style="text-align: right"><strong>Burner Contract:</strong></el-col>
                <el-col :span="16">
                  <el-link :href="`https://better-call.dev/${wallet.network}/${burnRecord.contract}`" target="_blank">{{ burnRecord.contract }} <i class="far fa-external-link fa-icon-right"></i></el-link>
                </el-col>
              </el-row>
              <el-row type="flex" align="middle" :gutter="20" style="margin-top: 14px">
                <el-col :span="8" style="text-align: right"><strong>Tezos Domain Alias:</strong></el-col>
                <el-col :span="16">
                  <el-link href="https://app.tezos.domains/domain/burner.crunchy.tez" target="_blank">burner.crunchy.tez <i class="far fa-external-link fa-icon-right"></i></el-link>
                </el-col>
              </el-row>
            </el-card>
          </div>
        </el-col>
        <el-col :span="8">
          <div class="grid-content" style="height: 100%;">
            <DaasCard />
          </div>
        </el-col>
      </el-row>

      <el-row :gutter="20" type="flex" align="bottom" style="margin-top: 50px;">
        <el-col :span="12">
          <div class="grid-content">
            <h2 style="margin-top: 0; margin-bottom: 5px;">Burn Record</h2>
          </div>
        </el-col>
        <el-col :span="12">
          <div class="grid-content" style="text-align: right;">
              <el-button type="primary" plain :disabled="burnRecord.loading" style="border-radius: 10px; font-weight: bold; padding-left: 48px; padding-right: 48px;" @click="refresh">Refresh</el-button>
          </div>
        </el-col>
      </el-row>

        <el-row type="flex" class="farm-list" style="margin-top: 25px;">
          <el-col :span="24">
            <div class="grid-content">
              <el-card class="box-card">
                <el-table
                  :data="burnRecord.records"
                  v-loading="burnRecord.loading"
                  style="width: 100%">
                  <el-table-column
                    prop="level"
                    label="Block Level"
                    width="180">
                  </el-table-column>
                  <el-table-column label="Burned By">
                    <template slot-scope="scope">
                      <el-link :href="`https://tzkt.io/${scope.row.from}`" target="_blank">{{ $async(scope.row.fromDomain, `tez-domain-${scope.row.from}`) || scope.row.from }} <i class="far fa-external-link fa-icon-right"></i></el-link>
                    </template>
                  </el-table-column>
                  <el-table-column label="Burn Amount" width="180" align="right">
                    <template slot-scope="scope">
                      {{ vueNumberFormat(Number.parseInt(scope.row.amount) / Math.pow(10, scope.row.token.decimals)) }}
                    </template>
                  </el-table-column>
                  <el-table-column label="Token" width="280">
                    <template slot-scope="scope">
                      <el-link :href="`https://better-call.dev/${scope.row.token.network}/${scope.row.token.contract}`" target="_blank">{{ scope.row.token.name || scope.row.token.symbol }} <i class="far fa-external-link fa-icon-right"></i></el-link>
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
                        popper-class="popover">
                        <span slot="reference" class="applied"><i class="far fa-check-double"></i></span>
                      </el-popover>
                      <el-popover
                        v-if="scope.row.status == 'backtracked'"
                        placement="bottom"
                        width="100"
                        trigger="hover"
                        content="Backtracked"
                        popper-class="popover">
                        <span slot="reference" class="backtracked"><i class="far fa-undo"></i></span>
                      </el-popover>
                    </template>
                  </el-table-column>

                  <el-table-column label="" width="110" align="right">
                    <template slot-scope="scope">
                      <el-link :href="`https://better-call.dev/${scope.row.token.network}/opg/${scope.row.hash}`" target="_blank">View Op <i class="far fa-external-link fa-icon-right"></i></el-link>
                    </template>
                  </el-table-column>

                </el-table>
              </el-card>
            </div>
          </el-col>
        </el-row>

    </el-main>
  </div>
</template>

<script>
import NavWallet from './NavWallet.vue';
import DaasCard from './DaasCard.vue';
import { mapState, mapActions } from 'vuex'

export default {
  name: 'FirePit',
  components: {
    NavWallet,
    DaasCard
  },
  computed: {
    ...mapState([
      'burnRecord',
      'wallet'
    ])
  },
  created() {
    this.refresh();
  },
  methods: {
    ...mapActions([
      'fetchBurnRecords'
    ]),
    refresh() {
      this.fetchBurnRecords();
    }
  }
}
</script>

<style lang="scss" scoped>
@import "../crunchy-variables.scss";
@import "~element-ui/packages/theme-chalk/src/common/var";

#fire-pit {
    position: relative;
    width: 100%;
    max-width: 1450px;
    margin: 0 auto;
}

.fire-pit {
    position: relative;

    &:before {
        position: absolute;
        font-family: 'Font Awesome 5 Pro';
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
        color: rgb(117, 118, 121);
    }
}

.fire-pit div, .fire-pit p {
    position: relative;
    z-index: 1;
}

.applied {
    color: $--color-success;
}

.backtracked {
    color: $--color-danger;
}

</style>
