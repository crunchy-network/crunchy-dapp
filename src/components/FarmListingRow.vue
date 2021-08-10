<template>
                <el-row :data-farm-id="farm.id" style="padding-bottom: 14px; font-size: 14px; font-weight: bold;" type="flex" align="top">
                  <el-col :span="24">
                    <div
                      style="border: 1px solid #EBEEF5; border-radius: 14px;"
                      v-bind:style="[farm.rowExpanded ? {borderColor: '#EBEEF5'} : {borderColor: '#fff'}]"
                      v-loading="farm.loading"
                    >
                      <el-row :gutter="20" class="farm-row" v-bind:class="{ expanded: farm.rowExpanded }" style="margin-left: 0; margin-right: 0;" type="flex" align="middle">
                        <el-col v-if="farm.poolToken.isLbLp" :span="4" style="font-weight: bold;">
                          <el-tooltip content="Liquidity Baking" placement="top" effect="light">
                            <i class="fas fa-heat" style="position: absolute; left: 14px; top: 22px; color: #fece00; font-size: 18px;"></i>
                          </el-tooltip>
                          <el-avatar shape="circle" :size="40" style="position: relative; border: 4px solid #fff; vertical-align: middle;" src="data:image/png;base64,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"></el-avatar>
                          <el-tooltip placement="top" effect="light">
                            <div slot="content">
                              <div style="color: #1EC37F; text-align: center; font-weight: bold; margin-bottom: 8px; text-transform: uppercase;">Total Staked</div>
                              <div style="text-align: center;">{{ vueNumberFormat(farm.poolBalance) }} XTZ/{{ farm.poolToken.symbol }}</div>
                            </div>
                            <el-avatar :src="farm.poolToken.thumbnailUri" fit="cover" shape="circle" :size="40" style="position: relative; border: 4px solid #fff; vertical-align: middle; margin-left: -18px; margin-right: 14px;"></el-avatar>
                          </el-tooltip>
                          XTZ/{{ farm.poolToken.symbol }}
                        </el-col>
                        <el-col v-else-if="farm.poolToken.isQuipuLp" :span="4" style="font-weight: bold;">
                          <el-tooltip v-if="farm.errant" content="Farm Error" placement="top" effect="light">
                            <i class="fas fa-exclamation-triangle" style="position: absolute; left: 10px; top: 22px; color: #F64947; font-size: 18px;"></i>
                          </el-tooltip>
                          <el-tooltip v-else-if="farm.flashFarm" content="Flash Farm" placement="top" effect="light">
                            <i class="fas fa-bolt" style="position: absolute; left: 14px; top: 22px; color: #fece00; font-size: 18px;"></i>
                          </el-tooltip>
                          <el-avatar shape="circle" :size="40" style="position: relative; border: 4px solid #fff; vertical-align: middle;" src="data:image/png;base64,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"></el-avatar>
                          <el-tooltip placement="top" effect="light">
                            <div slot="content">
                              <div style="color: #1EC37F; text-align: center; font-weight: bold; margin-bottom: 8px; text-transform: uppercase;">Total Staked</div>
                              <div style="text-align: center;">{{ vueNumberFormat(farm.poolBalance) }} XTZ/{{ farm.poolToken.symbol }}</div>
                            </div>
                            <el-avatar :src="farm.poolToken.thumbnailUri" fit="cover" shape="circle" :size="40" style="position: relative; border: 4px solid #fff; vertical-align: middle; margin-left: -18px; margin-right: 14px;"></el-avatar>
                          </el-tooltip>
                          XTZ/{{ farm.poolToken.symbol }}
                        </el-col>
                        <el-col v-else :span="4" style="font-weight: bold;">
                          <el-tooltip v-if="farm.errant" content="Farm Error" placement="top" effect="light">
                            <i class="fas fa-exclamation-triangle" style="position: absolute; left: 10px; top: 22px; color: #F64947; font-size: 18px;"></i>
                          </el-tooltip>
                          <el-tooltip v-else-if="farm.flashFarm" content="Flash Farm" placement="top" effect="light">
                            <i class="fas fa-bolt" style="position: absolute; left: 14px; top: 22px; color: #fece00; font-size: 18px;"></i>
                          </el-tooltip>
                          <el-tooltip placement="top" effect="light">
                            <div slot="content">
                              <div style="color: #1EC37F; text-align: center; font-weight: bold; margin-bottom: 8px; text-transform: uppercase;">Total Staked</div>
                              <div style="text-align: center;">{{ vueNumberFormat(farm.poolBalance) }} {{ farm.poolToken.symbol }}</div>
                            </div>
                            <el-avatar :src="farm.poolToken.thumbnailUri" fit="cover" shape="circle" :size="40" style="position: relative; border: 4px solid #fff; vertical-align: middle; margin-left: 22px; margin-right: 14px;"></el-avatar>
                          </el-tooltip>
                          {{ farm.poolToken.symbol }}
                        </el-col>
                        <el-col :span="3" style="font-weight: bold;">
                          <i class="fas fa-arrow-alt-right" style="color: #999; margin-left: 0px; margin-right: 6px;"></i>
                          <el-tooltip placement="top" effect="light">
                            <div slot="content">
                              <div style="color: #1EC37F; text-align: center; font-weight: bold; margin-bottom: 8px; text-transform: uppercase;">Total Rewards</div>
                              <div style="text-align: center;">{{ vueNumberFormat(farm.rewardSupply) }} {{ farm.rewardToken.symbol }}</div>
                            </div>
                            <el-avatar :src="farm.rewardToken.thumbnailUri" fit="cover" shape="circle" :size="40" style="position: relative; border: 4px solid #fff; vertical-align: middle;"></el-avatar>
                          </el-tooltip>
                          <span style="margin-left: 14px;">{{ farm.rewardToken.symbol }}</span>
                        </el-col>

                        <el-col style="text-align: right;" :span="4" v-if="wallet.connected && farm.depositAmount > 0">
                          <!-- <ICountUp
                            :delay="countUpDelay"
                            :endVal="farm.rewardsEarned"
                            :options="countUpOpts"
                          /> -->
                          {{ vueNumberFormat(farm.rewardsEarned) }}
                        </el-col>
                        <el-col style="text-align: right;" :span="4" v-else>-</el-col>

                        <el-col style="text-align: right; color: #F64947; text-transform: uppercase;" :span="3" v-if="farm.errant">Error</el-col>
                        <el-col style="text-align: right; color: #555CFF; text-transform: uppercase;" :span="3" v-else-if="farm.ended">Complete</el-col>
                        <el-col style="text-align: right;" :span="3" v-else-if="farm.apr >= 0">{{ vueNumberFormat(farm.apr, {prefix: '', decimal: '.', thousand: ',', precision: 2}) }}%</el-col>
                        <el-col style="text-align: right;" :span="3" v-else>Pending</el-col>

                        <el-col style="text-align: right;" :span="4" v-if="showUsd === false">{{ vueNumberFormat(farm.tvlTez) }} ꜩ</el-col>
                        <el-col style="text-align: right;" :span="4" v-if="showUsd === true">{{ vueNumberFormat(farm.tvlTez * farms.usdVwap, {prefix: '$', decimal: '.', thousand: ',', precision: 2}) }}</el-col>
                        <el-col style="text-align: right;" :span="3">{{ farm.multiplier }}x</el-col>
                        <el-col :span="3" v-show="farm.rowExpanded === false" style="text-align: right;"><el-button type="text" @click="expandFarmRow(farm.id)" style="font-weight: bold;">View Details <i class="fas fa-chevron-down fa-icon-right"></i></el-button></el-col>
                        <el-col :span="3" v-show="farm.rowExpanded === true" style="text-align: right;"><el-button type="text" @click="collapseFarmRow(farm.id)" style="font-weight: bold;">Hide Details <i class="fas fa-chevron-up fa-icon-right"></i></el-button></el-col>
                      </el-row>
                      <collapse-transition :duration="250" name="slide">
                        <div v-show="farm.rowExpanded">
                        <el-row type="flex" align="top" style="padding: 10px 20px;">
                          <el-col v-if="wallet.connected" :span="8" style="padding: 10px 20px; border-right: 1px solid #EBEEF5;">
                            <div style="margin-bottom: 8px;">
                              <strong style="color: #757679; font-size: 14px;">EST. {{ farm.rewardToken.symbol }} EARNED</strong>
                            </div>
                            <el-row v-if="farm.errant" type="flex" align="middle" justify="space-between">
                              <el-col :span="24" style="font-weight: bold; color: #F64947;">
                                An issue has been detected with the rewards of this farm. Please unstake all tokens.
                              </el-col>
                            </el-row>
                            <el-row v-else-if="farm.depositAmount > 0" type="flex" align="middle" justify="space-between">
                              <el-col :span="10" style="font-weight: bold;">{{ vueNumberFormat(farm.rewardsEarned) }}</el-col>
                              <el-col :span="10">
                                <el-button type="primary" :disabled="farm.started === false" style="border-radius: 10px; font-weight: bold; width: 100%" @click="harvestFarm(farm.id)">Harvest</el-button>
                              </el-col>
                            </el-row>
                            <el-row v-else-if="farm.ended" type="flex" align="middle" justify="space-between">
                              <el-col :span="10" style="font-weight: bold;">-</el-col>
                              <el-col :span="10">
                                <el-button type="primary" :disabled="true" style="border-radius: 10px; font-weight: bold; width: 100%">Harvest</el-button>
                              </el-col>
                            </el-row>
                            <el-row v-else type="flex" align="middle" justify="space-between">
                              <el-col :span="24">
                                <el-button type="success" style="border-radius: 10px; font-weight: bold; width: 100%;" @click="$emit('request-stake-farm', farm.id)">Stake Now to Earn Rewards</el-button>
                              </el-col>
                            </el-row>
                            <div style="margin-top: 16px;">
                              <el-link style="color: #555CFF; font-weight: bold;" :href="`https://better-call.dev/${wallet.network}/${farm.rewardToken.address}`" target="_blank">View {{ farm.rewardToken.symbol }} Contract <i class="far fa-external-link fa-icon-right"></i></el-link>
                            </div>
                          </el-col>
                          <el-col v-if="wallet.connected === false" :span="8" style="padding: 10px 20px; border-right: 1px solid #EBEEF5;">
                            <div style="margin-bottom: 8px;">
                              <strong style="color: #757679; font-size: 14px;">&nbsp;</strong>
                            </div>
                          </el-col>
                          <el-col :span="8" v-if="wallet.connected" style="padding: 10px 20px; border-right: 1px solid #EBEEF5;">
                            <div style="margin-bottom: 8px;">
                              <strong v-if="farm.poolToken.isQuipuLp || farm.poolToken.isLbLp" style="color: #757679; font-size: 14px;">LP STAKED</strong>
                              <strong v-else style="color: #757679; font-size: 14px;">{{ farm.poolToken.symbol }} STAKED</strong>
                            </div>
                            <el-row type="flex" align="middle" justify="space-between">
                              <el-col v-if="farm.depositAmount > 0" :span="14" style="font-weight: bold;">
                                {{ vueNumberFormat(farm.depositAmount) }}
                                <el-popover
                                  placement="bottom"
                                  width="100"
                                  trigger="hover"
                                  content="Your percentage of the farm"
                                  popper-class="farm-info">
                                  <el-tag slot="reference" type="primary" size="medium" effect="plain" style="margin-left: 14px; cursor: help;">{{ vueNumberFormat(farm.depositAmount / farm.poolBalance * 100, {prefix: '', decimal: '.', thousand: ',', precision: 2}) }}%</el-tag>
                                </el-popover>
                              </el-col>
                              <el-col v-else :span="14" style="font-weight: bold;">-</el-col>
                              <el-col :span="10" style="text-align: right;">
                                <el-button type="info" plain style="border-radius: 10px; padding: 12px 14px;" :disabled="farm.ended || farm.errant" @click="$emit('request-stake-farm', farm.id)"><i class="fas fa-plus"></i></el-button>
                                <el-button type="info" plain style="border-radius: 10px; padding: 12px 14px;" :disabled="farm.depositAmount <= 0" @click="$emit('request-unstake-farm', farm.id)"><i class="fas fa-minus"></i></el-button>
                              </el-col>
                            </el-row>
                            <div style="margin-top: 16px;">
                              <el-link v-if="farm.poolToken.isLbLp" style="color: #555CFF; font-weight: bold;" href="https://tzkt.io/KT1TxqZ8QtKvLu3V3JH7Gx58n7Co8pgtpQU5/dex" target="_blank">Get XTZ/{{ farm.poolToken.symbol }} LP <i class="far fa-external-link fa-icon-right"></i></el-link>
                              <el-link v-if="farm.poolToken.isQuipuLp && isFa1(farm.poolToken)" style="color: #555CFF; font-weight: bold;" :href="`https://quipuswap.com/invest/add-liquidity/${farm.poolToken.realTokenAddress}`" target="_blank">Get XTZ/{{ farm.poolToken.symbol }} LP <i class="far fa-external-link fa-icon-right"></i></el-link>
                              <el-link v-if="farm.poolToken.isQuipuLp && isFa2(farm.poolToken)" style="color: #555CFF; font-weight: bold;" :href="`https://quipuswap.com/invest/add-liquidity/${farm.poolToken.realTokenAddress}_${farm.poolToken.realTokenId}`" target="_blank">Get XTZ/{{ farm.poolToken.symbol }} LP <i class="far fa-external-link fa-icon-right"></i></el-link>
                              <el-link v-if="farm.poolToken.isQuipuLp === false && farm.poolToken.isLbLp === false && isFa1(farm.poolToken)" style="color: #555CFF; font-weight: bold;" :href="`https://quipuswap.com/swap?from=tez&to=${farm.poolToken.address}`" target="_blank">Buy {{ farm.poolToken.symbol }} <i class="far fa-external-link fa-icon-right"></i></el-link>
                              <el-link v-if="farm.poolToken.isQuipuLp === false && farm.poolToken.isLbLp === false && isFa2(farm.poolToken)" style="color: #555CFF; font-weight: bold;" :href="`https://quipuswap.com/swap?from=tez&to=${farm.poolToken.address}_${farm.poolToken.tokenId}`" target="_blank">Buy {{ farm.poolToken.symbol }} <i class="far fa-external-link fa-icon-right"></i></el-link>
                            </div>
                          </el-col>
                          <el-col :span="8" v-if="wallet.connected === false" style="padding: 10px 20px; border-right: 1px solid #EBEEF5;">
                            <div style="margin-bottom: 8px;"><strong style="color: #757679; font-size: 14px;">START FARMING</strong></div>
                            <el-button type="success" @click="connectWallet" style="border-radius: 10px; font-weight: bold; width: 100%;">Connect Wallet</el-button>
                          </el-col>
                          <el-col :span="8" v-if="farm.errant" style="padding: 10px 20px;">
                            <div style="margin-bottom: 8px;">
                              <strong style="color: #F64947; font-size: 14px; text-transform: uppercase;">Farming Error Detected</strong>
                            </div>
                          </el-col>
                          <el-col :span="8" v-if="farm.errant === false" style="padding: 10px 20px;">
                            <div style="margin-bottom: 8px;">
                              <strong style="color: #1EC37F; font-size: 14px; text-transform: uppercase;" v-if="!farm.started">
                                  Farming starts {{ farm.startTime | moment("calendar") }} {{ localAbbrevTimeZone }} and lasts {{ farm.duration | humanizeDuration }}
                              </strong>
                              <strong style="color: #757679; font-size: 14px; text-transform: uppercase;" v-if="farm.started && !farm.ended">Farming ends {{ farm.endTime | moment("dddd, MMMM Do YYYY, h:mm a") }} {{ localAbbrevTimeZone }}</strong>
                              <strong style="color: #555CFF; font-size: 14px; text-transform: uppercase;" v-if="farm.ended">Farming complete</strong>
                            </div>
                            <el-row type="flex" align="middle" justify="space-between">
                              <el-col :span="18">
                                <el-popover
                                  v-if="farm.badges.verified"
                                  placement="bottom"
                                  width="100"
                                  trigger="hover"
                                  content="Verified"
                                  popper-class="farm-verified">
                                  <el-avatar slot="reference" icon="far fa-shield-check" style="color: #1EC37F; background: #e9f9f2; border-color: #a5e7cc; border: 1px solid #a5e7cc; margin-right: 14px;"></el-avatar>
                                </el-popover>
                                <el-popover
                                  v-if="farm.badges.core"
                                  placement="bottom"
                                  width="100"
                                  trigger="hover"
                                  content="Crunchy Core"
                                  popper-class="farm-verified">
                                  <el-avatar slot="reference" icon="far fa-taco" style="color: #1EC37F; background: #e9f9f2; border-color: #a5e7cc; border: 1px solid #a5e7cc; margin-right: 14px;"></el-avatar>
                                </el-popover>
                                <el-popover
                                  v-if="farm.badges.partner"
                                  placement="bottom"
                                  width="100"
                                  trigger="hover"
                                  content="Trusted Partner"
                                  popper-class="farm-verified">
                                  <el-avatar slot="reference" icon="far fa-handshake-alt" style="color: #1EC37F; background: #e9f9f2; border-color: #a5e7cc; border: 1px solid #a5e7cc; margin-right: 14px;"></el-avatar>
                                </el-popover>
                                <el-popover
                                  v-if="farm.badges.lpLocked"
                                  placement="bottom"
                                  width="125"
                                  trigger="hover"
                                  content="LP Liquidity Locked"
                                  popper-class="farm-verified">
                                  <el-avatar slot="reference" icon="far fa-lock-alt" style="color: #1EC37F; background: #e9f9f2; border-color: #a5e7cc; border: 1px solid #a5e7cc; margin-right: 14px;"></el-avatar>
                                </el-popover>
                              </el-col>
                              <!-- <el-col :span="6" style="text-align: right;">
                                <el-popover
                                  placement="bottom"
                                  width="100"
                                  trigger="hover"
                                  content="View Farm Stats"
                                  popper-class="farm-info">
                                  <el-button slot="reference" type="primary" icon="fad fad-no-mr fa-analytics" plain circle @click="viewFarmStats(farm)"></el-button>
                                </el-popover>
                              </el-col> -->
                            </el-row>
                          </el-col>
                        </el-row>
                        </div>
                      </collapse-transition>
                    </div>
                  </el-col>
                </el-row>
</template>

<script>
import { CollapseTransition } from "@ivanv/vue-collapse-transition";
// import ICountUp from 'vue-countup-v2';
import { mapState, mapActions } from 'vuex'
import farmUtils from './../utils/farm';

export default {
  name: 'FarmListingRow',
  props: [ 'farm', 'showUsd' ],
  components: {
    CollapseTransition,
    // ICountUp
  },
  data() {
    return {
      localAbbrevTimeZone: new Date().toLocaleTimeString('en-us',{ timeZoneName:'short' }).split(' ')[2],
      // countUpDelay: 0,
      // countUpOpts: {
      //   useEasing: true,
      //   useGrouping: true,
      //   decimalPlaces: 4,
      //   duration: 2,
      //   separator: ',',
      //   decimal: '.',
      //   prefix: '',
      //   suffix: ''
      // }
    }
  },
  computed: {
    ...mapState([
      'wallet',
      'farms'
    ])
  },
  methods: {
    ...mapActions([
      'connectWallet',
      'harvestFarm',
      'expandFarmRow',
      'collapseFarmRow'
    ]),

    isFa1(token) {
      return farmUtils.isFa1(token);
    },

    isFa2(token) {
      return farmUtils.isFa2(token);
    }
  }
}
</script>

<style lang="scss" scoped>
@import "../crunchy-variables.scss";
@import "~element-ui/packages/theme-chalk/src/common/var";

</style>
