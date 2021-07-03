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
              <el-card class="box-card" shadow="never" v-loading="loading">
                <el-form ref="form" :model="form" :rules="rules" label-width="135px" label-position="right">

                  <el-row type="flex">
                    <el-col :span="15">

                      <el-alert
                        title="Helpful Tip"
                        type="info"
                        description="Search for tokens instead of looking up the contract info. All tokens on QuipuSwap will come up in the search."
                        :closable="false"
                        style="margin-bottom: 18px;">
                      </el-alert>

                      <el-form-item label="Pool Token" required>
                        <el-col :span="5" style="padding-right: 10px">
                          <el-form-item prop="poolTokenType">
                            <el-select v-model="form.poolTokenType" placeholder="Token Type">
                              <el-option label="FA2" value="fa2"></el-option>
                              <el-option label="FA1.2" value="fa1"></el-option>
                            </el-select>
                          </el-form-item>
                        </el-col>
                        <el-col :span="14" style="padding-left: 10px; padding-right: 10px">
                          <el-form-item prop="poolTokenAddress">
                            <el-autocomplete
                              class="el-input"
                              :fetch-suggestions="queryPoolTokens"
                              :trigger-on-focus="false"
                              v-model="form.poolTokenAddress"
                              @select="handlePoolTokenSelect"
                              placeholder="Search for Token or Enter Token Address"
                            >
                              <template slot-scope="{ item }">
                                <div style="padding: 6px 0;">
                                  <el-avatar v-if="item.isQuipuLp" shape="circle" :size="40" style="position: relative; border: 4px solid #fff; vertical-align: middle;" src="data:image/png;base64,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"></el-avatar>
                                  <el-avatar v-if="item.isQuipuLp" :src="item.thumbnailUri" fit="cover" shape="circle" :size="40" style="position: relative; border: 4px solid #fff; vertical-align: middle; margin-left: -18px; margin-right: 14px;"></el-avatar>
                                  <el-avatar v-if="!item.isQuipuLp" :src="item.thumbnailUri" fit="cover" shape="circle" :size="40" style="position: relative; border: 4px solid #fff; vertical-align: middle; margin-left: 22px; margin-right: 14px;"></el-avatar>
                                  {{ item.value }}
                                </div>
                              </template>
                            </el-autocomplete>
                          </el-form-item>
                        </el-col>
                        <el-col :span="5" style="padding-left: 10px;">
                          <el-form-item prop="poolTokenId">
                            <el-input v-model="form.poolTokenId" placeholder="Token Id" :disabled="form.poolTokenType === 'fa1'"></el-input>
                          </el-form-item>
                        </el-col>
                      </el-form-item>

                      <el-form-item label="Reward Token" required>
                        <el-col :span="5" style="padding-right: 10px">
                          <el-form-item prop="rewardTokenType">
                            <el-select v-model="form.rewardTokenType" placeholder="Token Type">
                              <el-option label="FA2" value="fa2"></el-option>
                              <el-option label="FA1.2" value="fa1"></el-option>
                            </el-select>
                          </el-form-item>
                        </el-col>
                        <el-col :span="14" style="padding-left: 10px; padding-right: 10px">
                          <el-form-item prop="rewardTokenAddress">
                            <el-autocomplete
                              class="el-input"
                              :fetch-suggestions="queryRewardTokens"
                              :trigger-on-focus="false"
                              v-model="form.rewardTokenAddress"
                              @select="handleRewardTokenSelect"
                              placeholder="Search for Token or Enter Token Address"
                            >
                              <template slot-scope="{ item }">
                                <div style="padding: 6px 0;">
                                  <el-avatar :src="item.thumbnailUri" fit="cover" shape="circle" :size="40" style="position: relative; border: 4px solid #fff; vertical-align: middle; margin-right: 14px;"></el-avatar>
                                  {{ item.value }}
                                </div>
                              </template>
                            </el-autocomplete>
                          </el-form-item>
                        </el-col>
                        <el-col :span="5" style="padding-left: 10px;">
                          <el-form-item prop="rewardTokenId">
                            <el-input v-model="form.rewardTokenId" placeholder="Token Id" :disabled="form.rewardTokenType === 'fa1'"></el-input>
                          </el-form-item>
                        </el-col>
                      </el-form-item>

                      <el-form-item label="Timeframe" prop="startEndTime">
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

                      <el-form-item label="Reward Deposit" prop="rewardTokenAmount">
                        <el-input v-model="form.rewardTokenAmount" placeholder="Amount of Reward Tokens" style="width: 400px;">
                          <span slot="suffix">{{ form.rewardTokenName }}</span>
                        </el-input>
                      </el-form-item>

                      <el-form-item
                        v-for="(bonus, index) in form.bonuses"
                        :label="index === 0 ? 'Bonus Periods' : ''"
                        :key="`bonus-${index}`"
                      >
                        <el-date-picker
                          v-model="bonus.endTime"
                          type="datetime"
                          placeholder="Bonus Period Ends"
                          :default-time="'12:00:00'"
                          :picker-options="pickerOptions"
                        ></el-date-picker>
                        <el-input v-model="bonus.multiplier" placeholder="Multiplier" style="margin-left: 20px; margin-right: 20px; width: 125px;">
                          <span slot="suffix">X</span>
                        </el-input>
                        <el-button type="info" plain style="border-radius: 10px; padding: 10px 12px;" @click="addBonus(index)"><i class="fas fa-plus"></i></el-button>
                        <el-button :disabled="index === 0" type="info" plain style="border-radius: 10px; padding: 10px 12px;" @click="removeBonus(index)"><i class="fas fa-minus"></i></el-button>
                      </el-form-item>

                      <el-form-item label="Service Fee" prop="serviceFeeId">
                        <el-select v-model="form.serviceFeeId" placeholder="Select Service Fee" style="width: 220px;">
                          <el-option
                            v-for="item in serviceFees"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                          </el-option>
                        </el-select>
                      </el-form-item>

                    </el-col>
                    <el-col :span="1" style="border-right: 2px solid #DCDFE6;">
                    </el-col>
                    <el-col :span="8">
                      <div style="padding-left: 20px">
                        <h3 style="margin-top: 0;">Farm Summary</h3>
                        <el-row type="flex" align="middle" style="font-size: 14px; margin-bottom: 14px;">
                          <el-col :span="8" style="font-weight: bold;">Pool Token:</el-col>
                          <el-col :span="16" v-if="form.poolTokenName.length && form.poolTokenIsQuipuLp">
                            <el-avatar shape="circle" :size="40" style="position: relative; border: 4px solid #fff; vertical-align: middle;" src="data:image/png;base64,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"></el-avatar>
                            <el-avatar :src="form.poolTokenThumbnailUri" fit="cover" shape="circle" :size="40" style="position: relative; border: 4px solid #fff; vertical-align: middle; margin-left: -18px; margin-right: 14px;"></el-avatar>
                            {{ form.poolTokenName }}
                          </el-col>
                          <el-col :span="16" v-if="form.poolTokenName.length && !form.poolTokenIsQuipuLp">
                            <el-avatar :src="form.poolTokenThumbnailUri" fit="cover" shape="circle" :size="40" style="position: relative; border: 4px solid #fff; vertical-align: middle; margin-right: 14px;"></el-avatar>
                            {{ form.poolTokenName }}
                          </el-col>
                          <el-col :span="16" v-if="form.poolTokenName.length === 0">--</el-col>
                        </el-row>
                        <el-row type="flex" align="middle" style="font-size: 14px; margin-bottom: 14px;">
                          <el-col :span="8" style="font-weight: bold;">Reward Token:</el-col>
                          <el-col :span="16" v-if="form.rewardTokenName.length">
                            <el-avatar :src="form.rewardTokenThumbnailUri" fit="cover" shape="circle" :size="40" style="position: relative; border: 4px solid #fff; vertical-align: middle; margin-right: 14px;"></el-avatar>
                            {{ form.rewardTokenName }}
                          </el-col>
                          <el-col :span="16" v-if="form.rewardTokenName.length === 0">--</el-col>
                        </el-row>
                        <el-row type="flex" style="font-size: 14px; margin-bottom: 14px;">
                          <el-col :span="8" style="font-weight: bold;">Starts:</el-col>
                          <el-col :span="16" v-if="form.startEndTime.length">{{ form.startEndTime[0] }}</el-col>
                          <el-col :span="16" v-if="form.startEndTime.length === 0">--</el-col>
                        </el-row>
                        <el-row type="flex" style="font-size: 14px; margin-bottom: 14px;">
                          <el-col :span="8" style="font-weight: bold;">Ends:</el-col>
                          <el-col :span="16" v-if="form.startEndTime.length">{{ form.startEndTime[1] }}</el-col>
                          <el-col :span="16" v-if="form.startEndTime.length === 0">--</el-col>
                        </el-row>

                        <el-divider></el-divider>

                        <el-row type="flex" style="font-size: 14px; margin-bottom: 14px;">
                          <el-col :span="8" style="font-weight: bold;">Total Rewards:</el-col>
                          <el-col :span="16" v-if="form.rewardTokenAmount">{{ vueNumberFormat(form.rewardTokenAmount * 1) }} {{ form.rewardTokenName }}</el-col>
                          <el-col :span="16" v-if="!form.rewardTokenAmount">--</el-col>
                        </el-row>
                        <el-row type="flex" style="font-size: 14px; margin-bottom: 14px;">
                          <el-col :span="8" style="font-weight: bold;">Rewards/Sec:</el-col>
                          <el-col :span="16" v-if="rewardAmountPerSecond">{{ vueNumberFormat(rewardAmountPerSecond / (10 ** form.rewardTokenDecimals), {prefix: '', decimal: '.', thousand: ',', precision: form.rewardTokenDecimals}) }} {{ form.rewardTokenName }}</el-col>
                          <el-col :span="16" v-if="!rewardAmountPerSecond">--</el-col>
                        </el-row>

                        <el-divider></el-divider>

                        <el-row type="flex" style="font-size: 14px; margin-bottom: 14px;">
                          <el-col :span="8" style="font-weight: bold;">Service Fee:</el-col>
                          <el-col :span="16" v-if="form.serviceFeeId && form.rewardTokenName">
                            <div v-if="form.serviceFeeId === '0'">100 CRUNCH</div>
                            <div v-if="form.serviceFeeId === '1'">1,000 CRUNCH</div>
                            <div v-if="form.serviceFeeId === '2'">10,000 CRUNCH</div>
                            <div v-if="form.serviceFeeId === '0'">{{ vueNumberFormat(form.rewardTokenAmount * 0.015) }} {{ form.rewardTokenName }}</div>
                            <div v-if="form.serviceFeeId === '1'">{{ vueNumberFormat(form.rewardTokenAmount * 0.010) }} {{ form.rewardTokenName }}</div>
                            <div v-if="form.serviceFeeId === '2'">{{ vueNumberFormat(form.rewardTokenAmount * 0.005) }} {{ form.rewardTokenName }}</div>
                          </el-col>
                          <el-col :span="16" v-if="form.serviceFeeId.length === 0 || form.rewardTokenName.length === 0">--</el-col>
                        </el-row>

                        <el-divider></el-divider>

                        <el-row type="flex" style="font-size: 14px; margin-bottom: 14px;">
                          <el-col :span="8" style="font-weight: bold;">Total Required:</el-col>
                          <el-col :span="16" v-if="form.serviceFeeId && form.rewardTokenName">
                            <div v-if="form.serviceFeeId === '0'">100 CRUNCH</div>
                            <div v-if="form.serviceFeeId === '1'">1,000 CRUNCH</div>
                            <div v-if="form.serviceFeeId === '2'">10,000 CRUNCH</div>
                            <div v-if="form.serviceFeeId === '0'">{{ vueNumberFormat(form.rewardTokenAmount * 1.015) }} {{ form.rewardTokenName }}</div>
                            <div v-if="form.serviceFeeId === '1'">{{ vueNumberFormat(form.rewardTokenAmount * 1.010) }} {{ form.rewardTokenName }}</div>
                            <div v-if="form.serviceFeeId === '2'">{{ vueNumberFormat(form.rewardTokenAmount * 1.005) }} {{ form.rewardTokenName }}</div>
                          </el-col>
                          <el-col :span="16" v-if="form.serviceFeeId.length === 0 || form.rewardTokenName.length === 0">--</el-col>
                        </el-row>

                        <el-divider></el-divider>

                        <el-row type="flex" style="font-size: 14px; margin-bottom: 14px;">
                          <el-col :span="8" style="font-weight: bold;"></el-col>
                          <el-col :span="16">
                            <el-button v-if="wallet.connected" type="primary" @click="onSubmit" style="border-radius: 10px; font-weight: bold;">Create Farm</el-button>
                            <el-button v-if="wallet.connected === false" type="success" @click="connectWallet" style="border-radius: 10px; font-weight: bold;">Connect Wallet</el-button>
                          </el-col>
                        </el-row>

                      </div>
                    </el-col>

                  </el-row>

                </el-form>
              </el-card>
            </div>
          </el-col>
        </el-row>

      </el-main>

  </div>
</template>

<script>
import _ from 'lodash';
import NavWallet from './NavWallet.vue';
import { mapState, mapActions } from 'vuex'
import ipfs from './../utils/ipfs'
import farmUtils from './../utils/farm'
import { getTokenMetadata } from './../utils/tezos'
import { BigNumber } from 'bignumber.js';
import { ValidationResult, validateContractAddress } from '@taquito/utils';

export default {
  name: 'FarmCreate',
  components: {
    NavWallet
  },
  data() {
    var validateTokenAddress = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('Enter token address'));
      } else {
        const validation = validateContractAddress(value);
        if (validation !== ValidationResult.VALID) {
          callback(new Error('Enter valid token address'));
        } else {
          callback();
        }
      }
    };

    var validatePoolTokenId = (rule, value, callback) => {
      if (this.form.poolTokenType === 'fa1') {
        callback();
      } else {
        if (value === '') {
          callback(new Error('Enter token id'));
        } else {
          callback();
        }
      }
    };

    var validateRewardTokenId = (rule, value, callback) => {
      if (this.form.rewardTokenType === 'fa1') {
        callback();
      } else {
        if (value === '') {
          callback(new Error('Enter token id'));
        } else {
          callback();
        }
      }
    };

    return {
      loading: true,
      form: {
        poolTokenIsQuipuLp: true,
        poolTokenName: "",
        poolTokenType: "",
        poolTokenAddress: "",
        poolTokenId: "",
        poolTokenThumbnailUri: "",
        rewardTokenName: "",
        rewardTokenType: "",
        rewardTokenAddress: "",
        rewardTokenId: "",
        rewardTokenAmount: "",
        rewardTokenDecimals: 0,
        rewardTokenThumbnailUri: "",
        startEndTime: [],
        bonuses: [{ endTime: "", multiplier: "" }],
        serviceFeeId: "",
      },
      pickerOptions: {
        disabledDate(d) {
          return d <= new Date()
        }
      },
      serviceFees: [
        { value: '0', label: '100 CRUNCH + 1.5%' },
        { value: '1', label: '1,000 CRUNCH + 1.0%' },
        { value: '2', label: '10,000 CRUNCH + 0.5%' }
      ],
      rules: {
        poolTokenType: [
          { required: true, message: 'Select token type' }
        ],
        poolTokenAddress: [
          { required: true, validator: validateTokenAddress }
        ],
        poolTokenId: [
          { validator: validatePoolTokenId }
        ],
        rewardTokenType: [
          { required: true, message: 'Select token type' }
        ],
        rewardTokenAddress: [
          { required: true, validator: validateTokenAddress }
        ],
        rewardTokenId: [
          { validator: validateRewardTokenId }
        ],
        startEndTime: [
          { required: true, message: 'Select a start and end date & time' }
        ],
        rewardTokenAmount: [
          { required: true, message: 'Enter an amount'},
          { type: 'number', required: true, message: 'Enter a valid amount', transform: (v) => Number(v) }
        ],
        serviceFeeId: [
          { required: true, message: 'Select a service fee' }
        ]
      }
    }
  },
  computed: {
    ...mapState([
      'wallet',
      'farms'
    ]),

    rewardAmountPerSecond: function() {
      if (!this.form.rewardTokenAmount || !this.form.rewardTokenName) {
        return 0;
      }

      if (this.form.startEndTime.length === 0) {
        return 0;
      }

      let start = this.form.startEndTime[0];
      const end = this.form.startEndTime[1];
      let effectiveSec = 0;

      if (this.form.bonuses.length && this.form.bonuses[0].endTime && this.form.bonuses[0].multiplier) {
        let bonuses = _.orderBy(this.form.bonuses, 'endTime', 'asc');
        for (const bonus of bonuses) {
          effectiveSec += (((bonus.endTime - start) / 1000) * parseInt(bonus.multiplier));
          start = bonus.endTime;
        }
      }

      effectiveSec += ((end - start) / 1000);

      return BigNumber(this.form.rewardTokenAmount)
        .times(BigNumber(10).pow(this.form.rewardTokenDecimals))
        .div(effectiveSec)
        .integerValue(BigNumber.ROUND_CEIL)
        .toNumber();
    }
  },
  watch: {
    form: {
      async handler(val) {
        if (!val.rewardTokenThumbnailUri && val.rewardTokenType && val.rewardTokenAddress && (val.rewardTokenType === 'fa1' || val.rewardTokenId)) {
          const validation = validateContractAddress(val.rewardTokenAddress);
          if (validation === ValidationResult.VALID) {
            let rewardTokenMeta = await getTokenMetadata(val.rewardTokenAddress, val.rewardTokenId || 0);
            rewardTokenMeta = farmUtils.overrideMetadata(rewardTokenMeta);
            this.form.rewardTokenName = rewardTokenMeta.symbol || rewardTokenMeta.name;
            this.form.rewardTokenDecimals = rewardTokenMeta.decimals;
            this.form.rewardTokenThumbnailUri = ipfs.transformUri(rewardTokenMeta.thumbnailUri);
          }
        } else {
          const validation = validateContractAddress(val.rewardTokenAddress);
          if (validation !== ValidationResult.VALID) {
            this.form.rewardTokenThumbnailUri = "";
          }
        }
      },
      deep: true
    }
  },
  created() {
    const vm = this;
    this.updateCurrentPrices().then(() => {
      vm.loading = false;
    });
  },
  methods: {
    ...mapActions([
      'connectWallet',
      'updateCurrentPrices',
      'createFarm'
    ]),

    onSubmit() {
      const vm = this;
      this.$refs.form.validate((valid) => {
        if (valid) {
          let bonuses = [];
          for (const b of vm.form.bonuses) {
            if (b.endTime && b.multiplier) {
              bonuses.push(b);
            }
          }

          let serviceFeeMultiplier = 1.015;
          if (vm.form.serviceFeeId == '1') {
            serviceFeeMultiplier = 1.010;
          } else if (vm.form.serviceFeeId == '2') {
            serviceFeeMultiplier = 1.005;
          }

          const params = {
            poolToken: {
              tokenType: vm.form.poolTokenType,
              tokenAddress: vm.form.poolTokenAddress,
              tokenId: vm.form.poolTokenId || 0
            },
            rewardToken: {
              tokenType: vm.form.rewardTokenType,
              tokenAddress: vm.form.rewardTokenAddress,
              tokenId: vm.form.rewardTokenId || 0
            },
            rewardSupply: BigNumber(vm.form.rewardTokenAmount).times(BigNumber(10).pow(vm.form.rewardTokenDecimals)).idiv(1).toNumber(),
            rewardSupplyApprove: BigNumber(vm.form.rewardTokenAmount).times(BigNumber(serviceFeeMultiplier)).times(BigNumber(10).pow(vm.form.rewardTokenDecimals)).idiv(1).toNumber(),
            rewardPerSec: vm.rewardAmountPerSecond,
            startTime: vm.form.startEndTime[0],
            endTime: vm.form.startEndTime[1],
            lockDuration: 0,
            bonuses: bonuses,
            serviceFeeId: vm.form.serviceFeeId
          };
          vm.loading = true;
          vm.createFarm(params)
            .then(() => {
              vm.loading = false;
              vm.$router.push({ name: 'farm-listing' });
            })
            .catch((e) => {
              console.log(e);
              vm.loading = false;
            });
        } else {
          return false;
        }
      });
    },

    addBonus(index) {
      this.form.bonuses.splice(index + 1, 0, { endTime: "", multiplier: "" });
    },

    removeBonus(index) {
      this.form.bonuses.splice(index, 1);
    },

    queryPoolTokens(keywords, cb) {
      let matches = [];
      for (let t of this.farms.priceFeed) {
        if (
          (Object.prototype.hasOwnProperty.call(t, 'name') && t.name.toLowerCase().includes(keywords.toLowerCase())) ||
          (Object.prototype.hasOwnProperty.call(t, 'symbol') && t.symbol.toLowerCase().includes(keywords.toLowerCase()))
        ) {
          t = farmUtils.overrideMetadata(t);
          if (!Object.prototype.hasOwnProperty.call(t, 'thumbnailUri')) {
            t.thumbnailUri = "https://static.thenounproject.com/png/796573-200.png";
          }
          t.thumbnailUri = ipfs.transformUri(t.thumbnailUri);
          matches.push({ value: t.symbol || t.name, type: t.type, address: t.tokenAddress, tokenId: t.tokenId || 0, isQuipuLp: false, thumbnailUri: t.thumbnailUri });
          matches.push({ value: "XTZ/" + (t.symbol || t.name) + " LP", type: t.type, address: t.address, tokenId: 0, isQuipuLp: true, thumbnailUri: t.thumbnailUri });
        }
      }
      cb(matches);
    },

    handlePoolTokenSelect(i) {
      this.form.poolTokenIsQuipuLp = i.isQuipuLp;
      this.form.poolTokenName = i.value;
      this.form.poolTokenType = i.type === 'fa2' ? 'fa2' : 'fa1';
      this.form.poolTokenAddress = i.address;
      this.form.poolTokenId = i.type === 'fa2' ? i.tokenId : '';
      this.form.poolTokenThumbnailUri = i.thumbnailUri;
    },

    queryRewardTokens(keywords, cb) {
      let matches = [];
      for (let t of this.farms.priceFeed) {
        if (
          (Object.prototype.hasOwnProperty.call(t, 'name') && t.name.toLowerCase().includes(keywords.toLowerCase())) ||
          (Object.prototype.hasOwnProperty.call(t, 'symbol') && t.symbol.toLowerCase().includes(keywords.toLowerCase()))
        ) {
          t = farmUtils.overrideMetadata(t);
          if (!Object.prototype.hasOwnProperty.call(t, 'thumbnailUri')) {
            t.thumbnailUri = "https://static.thenounproject.com/png/796573-200.png";
          }
          t.thumbnailUri = ipfs.transformUri(t.thumbnailUri);
          matches.push({
            value: t.symbol || t.name,
            type: t.type,
            address: t.tokenAddress,
            tokenId: t.tokenId || 0,
            thumbnailUri: t.thumbnailUri,
            decimals: t.decimals || 0
          });
        }
      }
      cb(matches);
    },

    handleRewardTokenSelect(i) {
      this.form.rewardTokenName = i.value;
      this.form.rewardTokenType = i.type === 'fa2' ? 'fa2' : 'fa1';
      this.form.rewardTokenAddress = i.address;
      this.form.rewardTokenId = i.type === 'fa2' ? i.tokenId : '';
      this.form.rewardTokenDecimals = i.decimals;
      this.form.rewardTokenThumbnailUri = i.thumbnailUri;
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
