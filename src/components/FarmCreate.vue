<template>
  <div id="farm-create" class="farm-create">

      <!-- class="hidden-sm-and-down" -->
      <el-header style="position: fixed; height: 90px; top: 0; left: 230px; right: 0; background: #fff; z-index: 999;">
        <el-row type="flex" class="row-bg" justify="space-between">
          <el-col :span="6">
          </el-col>
          <el-col :span="12">
            <div class="grid-content" style="text-align: right;">
              <NavWallet />
            </div>
          </el-col>
        </el-row>
        <el-divider></el-divider>
      </el-header>

      <!-- class="hidden-sm-and-down" -->
      <el-main style="margin-top: 90px;">

        <el-row :gutter="20" type="flex" align="bottom">
          <el-col :span="24">
            <div class="grid-content">
              <h2 style="margin-top: 0; margin-bottom: 5px;">Create a Farm</h2>
              <span style="font-size: 14px;">Create your own farm</span>
            </div>
          </el-col>
        </el-row>

        <el-row type="flex" style="margin-top: 25px;">
          <el-col :span="24">
            <div class="grid-content">
              <el-card class="box-card" shadow="never">
                <el-form ref="form" :model="form" label-width="120px" label-position="right">

                  <el-form-item label="Pool Token">
                    <el-col :span="4" style="padding-right: 10px">
                      <el-select v-model="form.poolTokenType" placeholder="Token Type">
                        <el-option label="FA2" value="fa2"></el-option>
                        <el-option label="FA1.2" value="fa1"></el-option>
                      </el-select>
                    </el-col>
                    <el-col :span="12" style="padding-left: 10px; padding-right: 10px">
                      <el-autocomplete
                        class="el-input"
                        :fetch-suggestions="queryPoolTokens"
                        :trigger-on-focus="false"
                        v-model="form.poolTokenAddress"
                        @select="handlePoolTokenSelect"
                        placeholder="Token Address"
                      ></el-autocomplete>
                    </el-col>
                    <el-col :span="3" style="padding-left: 10px;">
                      <el-input v-model="form.poolTokenId" placeholder="Token Id" :disabled="form.poolTokenType === 'fa1'"></el-input>
                    </el-col>
                  </el-form-item>

                  <el-form-item label="Reward Token">
                    <el-col :span="4" style="padding-right: 10px">
                      <el-select v-model="form.rewardTokenType" placeholder="Token Type">
                        <el-option label="FA2" value="fa2"></el-option>
                        <el-option label="FA1.2" value="fa1"></el-option>
                      </el-select>
                    </el-col>
                    <el-col :span="12" style="padding-left: 10px; padding-right: 10px">
                      <el-autocomplete
                        class="el-input"
                        :fetch-suggestions="queryRewardTokens"
                        :trigger-on-focus="false"
                        v-model="form.rewardTokenAddress"
                        @select="handleRewardTokenSelect"
                        placeholder="Token Address"
                      ></el-autocomplete>
                    </el-col>
                    <el-col :span="3" style="padding-left: 10px;">
                      <el-input v-model="form.rewardTokenId" placeholder="Token Id" :disabled="form.rewardTokenType === 'fa1'"></el-input>
                    </el-col>
                  </el-form-item>

                  <el-form-item label="Timeframe">
                    <el-date-picker
                      v-model="form.startEndTime"
                      type="datetimerange"
                      start-placeholder="Start Date & Time"
                      end-placeholder="End Date & Time"
                      :default-time="['12:00:00', '12:00:00']"
                      :picker-options="pickerOptions"
                      range-separator="To"
                    ></el-date-picker>
                  </el-form-item>

                  <el-form-item
                    label="Reward Deposit"
                  >
                    <el-input v-model="form.rewardTokenAmount" placeholder="Amount of Reward Tokens" style="width: 400px;">
                      <span slot="suffix">{{ form.rewardTokenName }}</span>
                    </el-input>
                  </el-form-item>

                </el-form>
              </el-card>
            </div>
          </el-col>
        </el-row>

      </el-main>

  </div>
</template>

<script>
import NavWallet from './NavWallet.vue';
import { mapState, mapActions } from 'vuex'

export default {
  name: 'FarmCreate',
  components: {
    NavWallet
  },
  data() {
    return {
      form: {
        poolTokenType: "",
        poolTokenAddress: "",
        poolTokenId: "",
        rewardTokenName: "",
        rewardTokenType: "",
        rewardTokenAddress: "",
        rewardTokenId: "",
        rewardTokenAmount: "",
      },
      pickerOptions: {
        disabledDate(d) {
          return d <= new Date()
        }
      }
    }
  },
  computed: {
    ...mapState([
      'farms'
    ])
  },
  created() {
    this.updateCurrentPrices()
  },
  methods: {
    ...mapActions([
      'updateCurrentPrices'
    ]),

    queryPoolTokens(keywords, cb) {
      let matches = [];
      for (const t of this.farms.priceFeed) {
        if (
          (Object.prototype.hasOwnProperty.call(t, 'name') && t.name.toLowerCase().includes(keywords.toLowerCase())) ||
          (Object.prototype.hasOwnProperty.call(t, 'symbol') && t.symbol.toLowerCase().includes(keywords.toLowerCase()))
        ) {
          matches.push({ value: t.symbol || t.name, type: t.type, address: t.tokenAddress, tokenId: t.tokenId || 0 });
          matches.push({ value: "XTZ/" + (t.symbol || t.name) + " LP", type: t.type, address: t.address, tokenId: 0 });
        }
      }
      cb(matches); // _.orderBy(matches, 'tvlTez', 'desc');
    },

    handlePoolTokenSelect(i) {
      this.form.poolTokenType = i.type === 'fa2' ? 'fa2' : 'fa1';
      this.form.poolTokenAddress = i.address;
      this.form.poolTokenId = i.type === 'fa2' ? i.tokenId : '';
    },

    queryRewardTokens(keywords, cb) {
      let matches = [];
      for (const t of this.farms.priceFeed) {
        if (
          (Object.prototype.hasOwnProperty.call(t, 'name') && t.name.toLowerCase().includes(keywords.toLowerCase())) ||
          (Object.prototype.hasOwnProperty.call(t, 'symbol') && t.symbol.toLowerCase().includes(keywords.toLowerCase()))
        ) {
          matches.push({ value: t.symbol || t.name, type: t.type, address: t.tokenAddress, tokenId: t.tokenId || 0 });
        }
      }
      cb(matches); // _.orderBy(matches, 'tvlTez', 'desc');
    },

    handleRewardTokenSelect(i) {
      this.form.rewardTokenName = i.value;
      this.form.rewardTokenType = i.type === 'fa2' ? 'fa2' : 'fa1';
      this.form.rewardTokenAddress = i.address;
      this.form.rewardTokenId = i.type === 'fa2' ? i.tokenId : '';
    },

  }
}
</script>

<style lang="scss" scoped>
@import "../crunchy-variables.scss";
@import "~element-ui/packages/theme-chalk/src/common/var";

#farm-create {
    position: relative;
    width: 100%;
}


</style>
