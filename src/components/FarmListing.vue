<template>
  <div id="farm-listing">

      <!-- class="hidden-sm-and-down" -->
      <el-header style="position: fixed; height: 90px; top: 0; left: 230px; right: 0; background: #fff; z-index: 999;">
        <el-row type="flex" class="row-bg" justify="space-between">
          <el-col :span="6">
            <div class="grid-content">
              <el-input
                :value="farms.searchInput"
                @input="updateSearchInput"
                placeholder="Search farms and pools"
                prefix-icon="fad fa-search">
              </el-input>
            </div>
          </el-col>
          <el-col :span="12">
            <div class="grid-content" style="text-align: right;">
              <el-button @click="$router.push({name: 'farm-create'})" type="primary" round style="font-weight: bold;"><i class="fas fa-plus" style="margin-right: 6px;"></i> Create a Farm</el-button>
              <el-divider direction="vertical"></el-divider>
              <NavWallet />
            </div>
          </el-col>
        </el-row>
        <el-divider></el-divider>
      </el-header>

      <!-- class="hidden-sm-and-down" -->
      <el-main style="margin-top: 90px;">

        <el-row :gutter="20" type="flex" style="margin-bottom: 50px;" v-show="farms.searchInput.length === 0">
          <el-col :span="16">
            <div class="grid-content" style="height: 100%;">
              <el-card v-loading="farms.loading" class="box-card" shadow="never" style="height: 100%;">
                <h2 style="color: #191B1F; opacity: 0.4; font-size: 14px;">Total Value Locked (TVL) Across All Farms</h2>
                <div style="font-size: 24px; font-weight: bold; margin-bottom: 24px;">
                  {{ vueNumberFormat(farms.totalTvlTez) }} ꜩ <span style="color: #bbbbbb;">({{ vueNumberFormat(farms.totalTvlTez * farms.usdVwap, {prefix: '$', decimal: '.', thousand: ',', precision: 2}) }})</span>
                </div>
                <el-row type="flex" align="middle" style="font-size: 14px; font-weight: bold; border-radius: 14px; padding: 10px 20px; background: #f6f6f6;">
                  <el-col :span="8">
                    <el-avatar shape="circle" :size="24" style="position: relative; vertical-align: middle; margin-right: 6px;" src="data:image/png;base64,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"></el-avatar>
                    {{ vueNumberFormat(farms.usdVwap, {prefix: '$', decimal: '.', thousand: ',', precision: 2}) }} <!-- <span style="color: #bbbbbb;">(CoinGecko)</span> -->
                  </el-col>
                  <el-col :span="8">
                    <el-avatar src="https://ipfs.fleek.co/ipfs/bafybeienhhbxz53n3gtg7stjou2zs3lmhupahwovv2kxwh5uass3bc5xzq" fit="cover" shape="circle" :size="24" style="position: relative; vertical-align: middle; margin-right: 6px;"></el-avatar>
                    {{ vueNumberFormat(farms.crunchTez) }} ꜩ <span style="color: #bbbbbb;">({{ vueNumberFormat(farms.crunchTez * farms.usdVwap, {prefix: '$', decimal: '.', thousand: ',', precision: 2}) }})</span>
                  </el-col>
                  <el-col :span="8">
                    <el-avatar src="https://ipfs.fleek.co/ipfs/bafybeigulbzm5x72qtmckxqvd3ksk6q3vlklxjgpnvvnbcofgdp6qwu43u" fit="cover" shape="circle" :size="24" style="position: relative; vertical-align: middle; margin-right: 6px;"></el-avatar>
                    {{ vueNumberFormat(farms.crdaoTez) }} ꜩ <span style="color: #bbbbbb;">({{ vueNumberFormat(farms.crdaoTez * farms.usdVwap, {prefix: '$', decimal: '.', thousand: ',', precision: 2}) }})</span>
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

        <el-row :gutter="20" type="flex" align="bottom">
          <el-col :span="8">
            <div class="grid-content">
              <h2 style="margin-top: 0; margin-bottom: 5px;">Farms &amp; Gardens</h2>
              <span style="font-size: 14px;">Stake tokens to earn rewards. Help Gardens grow into Farms
              <el-tooltip content="Gardens are smaller farms with less than 10,000 ꜩ TVL" placement="top" effect="light">
                <i class="fas fa-question-circle"></i>
              </el-tooltip>
              </span>
            </div>
          </el-col>
          <el-col :span="16">
            <div class="grid-content" style="text-align: right;">

              <el-select multiple collapse-tags :value="farms.filters" @input="updateFilters" placeholder="All Farms & Gardens">
                <el-option-group
                  v-for="group in filterOptions"
                  :key="group.label"
                  :label="group.label">
                  <el-option
                    v-for="item in group.options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-option-group>
              </el-select>

              <!-- <el-switch
                v-model="showOnlyGardens"
                active-color="#1EC37F"
                inactive-color="#555CFF"
                active-text="Gardens"
                inactive-text="Farms">
              </el-switch>
              <el-divider direction="vertical"></el-divider>
              <el-switch
                v-if="wallet.connected"
                v-model="showOnlyStaked"
                active-color="#1EC37F"
                inactive-color="#555CFF"
                active-text="Staked"
                inactive-text="All">
              </el-switch> -->
              <el-divider direction="vertical"></el-divider>
              <el-switch
                style="margin-right: 24px;"
                v-model="showUsd"
                active-color="#1EC37F"
                inactive-color="#555CFF"
                active-text="USD"
                inactive-text="XTZ">
              </el-switch>
              <el-button type="primary" plain :disabled="wallet.connected === false" style="border-radius: 10px; font-weight: bold; padding-left: 48px; padding-right: 48px;" @click="harvestAllFarms">Harvest All</el-button>
            </div>
          </el-col>
        </el-row>

        <el-row type="flex" class="farm-list" style="margin-top: 25px;">
          <el-col :span="24">
            <div class="grid-content">
              <el-card class="box-card" v-loading="farms.loading">

                <el-row type="flex" align="middle" style="color: #757679; font-size: 14px; font-weight: 600; border-bottom: 2px solid #f4f4f4; padding-bottom: 14px; margin-bottom: 14px;">
                  <el-col :span="24">
                    <el-row :gutter="20" type="flex" align="middle" style="padding: 0 20px;">
                      <el-col :span="7">Farm</el-col>
                      <el-col style="text-align: right;" :span="4">Earned</el-col>
                      <el-col style="text-align: right;" :span="3">APR</el-col>
                      <el-col style="text-align: right;" :span="4">TVL
                        <el-tooltip content="Total Value Locked" placement="top" effect="light">
                          <i class="fas fa-question-circle"></i>
                        </el-tooltip>
                      </el-col>
                      <el-col style="text-align: right;" :span="3">Multiplier</el-col>
                      <el-col :span="3" v-show="farms.expanded === false" style="text-align: right;"><el-button type="text" @click="expandAllFarmRows" style="font-weight: bold;">Expand All <i class="fas fa-chevron-down fa-icon-right"></i></el-button></el-col>
                      <el-col :span="3" v-show="farms.expanded === true" style="text-align: right;"><el-button type="text" @click="collapseAllFarmRows" style="font-weight: bold;">Collapse All <i class="fas fa-chevron-up fa-icon-right"></i></el-button></el-col>
                    </el-row>
                  </el-col>
                </el-row>

                <el-row v-for="farm in orderedFarms" v-bind:key="farm.id" v-show="farm.visible" :data-farm-id="farm.id" style="padding-bottom: 14px; font-size: 14px; font-weight: bold;" type="flex" align="top">
                  <el-col :span="24">
                    <div
                      style="border: 1px solid #EBEEF5; border-radius: 14px;"
                      v-bind:style="[farm.rowExpanded ? {borderColor: '#EBEEF5'} : {borderColor: '#fff'}]"
                      v-loading="farm.loading"
                    >
                      <el-row :gutter="20" class="farm-row" v-bind:class="{ expanded: farm.rowExpanded }" style="margin-left: 0; margin-right: 0;" type="flex" align="middle">
                        <el-col v-if="farm.poolToken.isQuipuLp" :span="4" style="font-weight: bold;">
                          <el-tooltip v-if="farm.flashFarm" content="Flash Farm" placement="top" effect="light">
                            <i class="fas fa-bolt" style="position: absolute; left: 14px; top: 22px; color: #fece00; font-size: 18px;"></i>
                          </el-tooltip>
                          <el-avatar shape="circle" :size="40" style="position: relative; border: 4px solid #fff; vertical-align: middle;" src="data:image/png;base64,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"></el-avatar>
                          <el-avatar :src="farm.poolToken.thumbnailUri" fit="cover" shape="circle" :size="40" style="position: relative; border: 4px solid #fff; vertical-align: middle; margin-left: -18px; margin-right: 14px;"></el-avatar>
                          XTZ/{{ farm.poolToken.symbol }}
                        </el-col>
                        <el-col v-else :span="4" style="font-weight: bold;">
                          <el-tooltip v-if="farm.flashFarm" content="Flash Farm" placement="top" effect="light">
                            <i class="fas fa-bolt" style="position: absolute; left: 14px; top: 22px; color: #fece00; font-size: 18px;"></i>
                          </el-tooltip>
                          <el-avatar :src="farm.poolToken.thumbnailUri" fit="cover" shape="circle" :size="40" style="position: relative; border: 4px solid #fff; vertical-align: middle; margin-right: 14px;"></el-avatar>
                          {{ farm.poolToken.symbol }}
                        </el-col>
                        <el-col :span="3" style="font-weight: bold;">
                          <i class="fas fa-arrow-alt-right" style="color: #999; margin-left: 0px; margin-right: 6px;"></i>
                          <el-avatar :src="farm.rewardToken.thumbnailUri" fit="cover" shape="circle" :size="40" style="position: relative; border: 4px solid #fff; vertical-align: middle;"></el-avatar>
                          <span style="margin-left: 14px;">{{ farm.rewardToken.symbol }}</span>
                        </el-col>

                        <el-col style="text-align: right;" :span="4" v-if="wallet.connected && farm.depositAmount > 0">{{ vueNumberFormat(farm.rewardsEarned) }}</el-col>
                        <el-col style="text-align: right;" :span="4" v-else>-</el-col>

                        <el-col style="text-align: right; color: #555CFF; text-transform: uppercase;" :span="3" v-if="farm.ended">Complete</el-col>
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
                            <el-row v-if="farm.depositAmount > 0" type="flex" align="middle" justify="space-between">
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
                                <el-button type="success" style="border-radius: 10px; font-weight: bold; width: 100%;" @click="showStakeForm(farm.id)">Stake Now to Earn Rewards</el-button>
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
                              <strong v-if="farm.poolToken.isQuipuLp" style="color: #757679; font-size: 14px;">LP STAKED</strong>
                              <strong v-if="farm.poolToken.isQuipuLp === false" style="color: #757679; font-size: 14px;">{{ farm.poolToken.symbol }} STAKED</strong>
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
                                <el-button type="info" plain style="border-radius: 10px; padding: 12px 14px;" :disabled="farm.ended" @click="showStakeForm(farm.id)"><i class="fas fa-plus"></i></el-button>
                                <el-button type="info" plain style="border-radius: 10px; padding: 12px 14px;" :disabled="farm.depositAmount <= 0" @click="showUnstakeForm(farm.id)"><i class="fas fa-minus"></i></el-button>
                              </el-col>
                            </el-row>
                            <div style="margin-top: 16px;">
                              <el-link v-if="farm.poolToken.isQuipuLp && isFa1(farm.poolToken)" style="color: #555CFF; font-weight: bold;" :href="`https://quipuswap.com/invest/add-liquidity/${farm.poolToken.realTokenAddress}`" target="_blank">Get XTZ/{{ farm.poolToken.symbol }} LP <i class="far fa-external-link fa-icon-right"></i></el-link>
                              <el-link v-if="farm.poolToken.isQuipuLp && isFa2(farm.poolToken)" style="color: #555CFF; font-weight: bold;" :href="`https://quipuswap.com/invest/add-liquidity/${farm.poolToken.realTokenAddress}_${farm.poolToken.realTokenId}`" target="_blank">Get XTZ/{{ farm.poolToken.symbol }} LP <i class="far fa-external-link fa-icon-right"></i></el-link>
                              <el-link v-if="farm.poolToken.isQuipuLp === false && isFa1(farm.poolToken)" style="color: #555CFF; font-weight: bold;" :href="`https://quipuswap.com/swap?from=tez&to=${farm.poolToken.address}`" target="_blank">Buy {{ farm.poolToken.symbol }} <i class="far fa-external-link fa-icon-right"></i></el-link>
                              <el-link v-if="farm.poolToken.isQuipuLp === false && isFa2(farm.poolToken)" style="color: #555CFF; font-weight: bold;" :href="`https://quipuswap.com/swap?from=tez&to=${farm.poolToken.address}_${farm.poolToken.tokenId}`" target="_blank">Buy {{ farm.poolToken.symbol }} <i class="far fa-external-link fa-icon-right"></i></el-link>
                            </div>
                          </el-col>
                          <el-col :span="8" v-if="wallet.connected === false" style="padding: 10px 20px; border-right: 1px solid #EBEEF5;">
                            <div style="margin-bottom: 8px;"><strong style="color: #757679; font-size: 14px;">START FARMING</strong></div>
                            <el-button type="success" @click="connectWallet" style="border-radius: 10px; font-weight: bold; width: 100%;">Connect Wallet</el-button>
                          </el-col>
                          <el-col :span="8" style="padding: 10px 20px;">
                            <div style="margin-bottom: 8px;">
                              <strong style="color: #1EC37F; font-size: 14px; text-transform: uppercase;" v-if="!farm.started">
                                  Farming starts {{ farm.startTime | moment("calendar") }} {{ localAbbrevTimeZone }} and lasts {{ farm.duration | humanizeDuration }}
                              </strong>
                              <strong style="color: #757679; font-size: 14px; text-transform: uppercase;" v-if="farm.started && !farm.ended">Farming ends {{ farm.endTime | moment("dddd, MMMM Do YYYY, h:mm a") }}</strong>
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

              </el-card>
            </div>
          </el-col>
        </el-row>

        <el-dialog title="Stake Tokens" :visible.sync="stakeForm.visible" width="380px" class="stake-dialog">
          <p v-if="stakeForm.farm.poolToken.isQuipuLp">Stake XTZ/{{ stakeForm.farm.poolToken.symbol }} LP tokens to earn {{ stakeForm.farm.rewardToken.symbol }}.</p>
          <p v-else>Stake {{ stakeForm.farm.poolToken.symbol }} to earn {{ stakeForm.farm.rewardToken.symbol }}.</p>
          <el-form v-loading.lock="stakeForm.loading" :model="stakeForm" ref="stakeForm" label-position="top" hide-required-asterisk>
            <div class="current-balance" style="border-radius: 22px; background: #FFEECC; padding: 12px 20px; margin-bottom: 18px;">
              <el-row type="flex" align="middle" justify="space-between">
                <el-col :span="8" style="font-size: 12px;">BALANCE</el-col>
                <el-col :span="16" style="color: #303133; font-weight: bold; text-align: right;">{{ vueNumberFormat(stakeForm.farm.poolToken.balance) }}</el-col>
              </el-row>
            </div>
            <el-form-item
              label="Stake Tokens"
              prop="input"
              :rules="[
                { type: 'number', required: true, message: 'Enter an amount', transform: (v) => Number(v) },
                { type: 'number', min: 0.000001, message: 'Enter a valid amount (at least 0.000001)', transform: (v) => Number(v) }
              ]"
              style="margin-bottom: 14px;"
            >
              <el-input v-model="stakeForm.input" label="Stake Tokens">
                <span v-if="stakeForm.farm.poolToken.isQuipuLp" slot="suffix">XTZ/{{ stakeForm.farm.poolToken.symbol }} LP</span>
                <span v-else slot="suffix">{{ stakeForm.farm.poolToken.symbol }}</span>
              </el-input>
            </el-form-item>
            <el-button type="success" size="small" round style="margin-bottom: 22px;" @click="stakeForm.input = stakeForm.farm.poolToken.balance">USE MAX</el-button>
            <el-button type="primary" @click="stakeFarm(stakeForm.farm.id)" style="border-radius: 12px; font-weight: bold; width: 100%; padding: 20px; margin-left: 0;">STAKE</el-button>
          </el-form>
        </el-dialog>

        <el-dialog title="Unstake Tokens" :visible.sync="unstakeForm.visible" width="380px" class="stake-dialog">
          <p v-if="unstakeForm.farm.poolToken.isQuipuLp" style="word-break: normal;">Withdrawing XTZ/{{ unstakeForm.farm.poolToken.symbol }} LP tokens will reduce your ability to earn {{ unstakeForm.farm.rewardToken.symbol }}.</p>
          <p v-else style="word-break: normal;">Withdrawing {{ unstakeForm.farm.poolToken.symbol }} will reduce your ability to earn {{ unstakeForm.farm.rewardToken.symbol }}.</p>
          <el-form v-loading.lock="unstakeForm.loading" :model="unstakeForm" ref="unstakeForm" label-position="top" hide-required-asterisk>
            <div class="current-balance" style="border-radius: 22px; background: #FFEECC; padding: 12px 20px; margin-bottom: 18px;">
              <el-row type="flex" align="middle" justify="space-between">
                <el-col :span="11" style="font-size: 12px;">STAKED BALANCE</el-col>
                <el-col :span="13" style="color: #303133; font-weight: bold; text-align: right;">{{ vueNumberFormat(unstakeForm.farm.depositAmount) }}</el-col>
              </el-row>
            </div>
            <el-form-item
              label="Unstake Tokens"
              prop="input"
              :rules="[
                { type: 'number', required: true, message: 'Enter an amount', transform: (v) => Number(v) },
                { type: 'number', min: 0.000001, message: 'Enter a valid amount (at least 0.000001)', transform: (v) => Number(v) }
              ]"
              style="margin-bottom: 14px;"
            >
              <el-input v-model="unstakeForm.input" label="Unstake Tokens">
                <span v-if="unstakeForm.farm.poolToken.isQuipuLp" slot="suffix">XTZ/{{ unstakeForm.farm.poolToken.symbol }} LP</span>
                <span v-else slot="suffix">{{ unstakeForm.farm.poolToken.symbol }}</span>
              </el-input>
            </el-form-item>
            <el-button type="success" size="small" round style="margin-bottom: 22px;" @click="unstakeForm.input = unstakeForm.farm.depositAmount">USE MAX</el-button>
            <el-button type="primary" @click="unstakeFarm(unstakeForm.farm.id)" style="border-radius: 12px; font-weight: bold; width: 100%; padding: 20px; margin-left: 0;">UNSTAKE</el-button>
          </el-form>
        </el-dialog>

      </el-main>

    <!-- Mobile -->
    <!-- <el-container class="hidden-md-and-up" style="margin-top: 50px;">
      <el-main>
        <el-row :gutter="20" type="flex" align="bottom">
          <el-col :span="24">
            <div class="grid-content">
              <h2 style="margin-top: 0; margin-bottom: 5px;">Farms</h2>
              <span style="font-size: 14px;">Stake tokens to earn rewards.</span>
            </div>
          </el-col>
        </el-row>
        <el-row :gutter="20" type="flex" style="margin-top: 20px;">
          <el-col :span="24">
            <div class="grid-content">
              <el-card v-loading="farms.loading" class="box-card" shadow="never" style="height: 100%;">
                <h2 style="color: #191B1F; opacity: 0.4; font-size: 14px;">Total Value Locked (TVL) Across All Farms</h2>
                <div style="font-size: 24px; font-weight: bold; margin-bottom: 24px;">
                  {{ vueNumberFormat(farms.totalTvlTez) }} ꜩ <span style="color: #bbbbbb;">({{ vueNumberFormat(farms.totalTvlTez * farms.usdVwap, {prefix: '$', decimal: '.', thousand: ',', precision: 2}) }})</span>
                </div>
                <el-row type="flex" align="middle" style="font-size: 14px; font-weight: bold; border-radius: 14px; padding: 10px 20px; background: #f6f6f6;">
                  <el-col :span="8">
                    <el-avatar shape="circle" :size="24" style="position: relative; vertical-align: middle; margin-right: 6px;" src="data:image/png;base64,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"></el-avatar>
                    {{ vueNumberFormat(farms.usdVwap, {prefix: '$', decimal: '.', thousand: ',', precision: 2}) }}
                    <div style="color: #bbbbbb; margin-left: 34px;">(24-hour VWAP)</div>
                  </el-col>
                  <el-col :span="8">
                    <el-avatar src="https://ipfs.fleek.co/ipfs/bafybeienhhbxz53n3gtg7stjou2zs3lmhupahwovv2kxwh5uass3bc5xzq" fit="cover" shape="circle" :size="24" style="position: relative; vertical-align: middle; margin-right: 6px;"></el-avatar>
                    {{ vueNumberFormat(farms.crunchTez) }} ꜩ
                    <div style="color: #bbbbbb; margin-left: 34px;">({{ vueNumberFormat(farms.crunchTez * farms.usdVwap, {prefix: '$', decimal: '.', thousand: ',', precision: 2}) }})</div>
                  </el-col>
                  <el-col :span="8">
                    <el-avatar src="https://ipfs.fleek.co/ipfs/bafybeigulbzm5x72qtmckxqvd3ksk6q3vlklxjgpnvvnbcofgdp6qwu43u" fit="cover" shape="circle" :size="24" style="position: relative; vertical-align: middle; margin-right: 6px;"></el-avatar>
                    {{ vueNumberFormat(farms.crdaoTez) }} ꜩ
                    <div style="color: #bbbbbb; margin-left: 34px;">({{ vueNumberFormat(farms.crdaoTez * farms.usdVwap, {prefix: '$', decimal: '.', thousand: ',', precision: 2}) }})</div>
                  </el-col>
                </el-row>
              </el-card>
            </div>
          </el-col>
        </el-row>

        <el-row :gutter="20" type="flex" align="bottom" style="margin-top: 50px;">
          <el-col :span="18">
            <div class="grid-content">
              <el-switch
                v-if="wallet.connected"
                v-model="showOnlyStaked"
                active-color="#1EC37F"
                inactive-color="#555CFF"
                active-text="Staked Farms"
                inactive-text="All Farms">
              </el-switch>
              <el-divider direction="vertical"></el-divider>
              <el-switch
                style="margin-right: 24px;"
                v-model="showUsd"
                active-color="#1EC37F"
                inactive-color="#555CFF"
                active-text="USD"
                inactive-text="XTZ">
              </el-switch>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="grid-content" style="text-align: right;">
              <el-button type="primary" plain :disabled="wallet.connected === false" style="border-radius: 10px; font-weight: bold; width: 100%" @click="harvestAllFarms">Harvest All</el-button>
            </div>
          </el-col>
        </el-row>

        <el-row type="flex" class="farm-list" style="margin-top: 25px;">
          <el-col :span="24">
            <div class="grid-content">
              <el-card class="box-card" v-loading="farms.loading">

                <el-row type="flex" align="middle" style="color: #757679; font-size: 14px; font-weight: 600; border-bottom: 2px solid #f4f4f4; padding-bottom: 14px; margin-bottom: 14px;">
                  <el-col :span="24">
                    <el-row :gutter="20" type="flex" align="middle" style="padding: 0 20px;">
                      <el-col :span="12">Farm</el-col>
                      <el-col style="text-align: right;" :span="5">Earned</el-col>
                      <el-col style="text-align: right;" :span="4">APR</el-col>
                      <el-col :span="3" v-show="farms.expanded === false" style="text-align: right;"><el-button type="text" @click="expandAllFarmRows" style="font-weight: bold;">Expand All <i class="fas fa-chevron-down fa-icon-right"></i></el-button></el-col>
                      <el-col :span="3" v-show="farms.expanded === true" style="text-align: right;"><el-button type="text" @click="collapseAllFarmRows" style="font-weight: bold;">Collapse All <i class="fas fa-chevron-up fa-icon-right"></i></el-button></el-col>
                    </el-row>
                  </el-col>
                </el-row>
                <el-row v-for="farm in farms.data" v-bind:key="farm.id" v-show="farm.visible && (showOnlyStaked === false || farm.depositAmount > 0)" style="padding-bottom: 14px; font-size: 14px; font-weight: bold;" type="flex" align="top">
                  <el-col :span="24">
                    <div
                      style="border: 1px solid #EBEEF5; border-radius: 14px;"
                      v-bind:style="[farm.rowExpanded ? {borderColor: '#EBEEF5'} : {borderColor: '#fff'}]"
                      v-loading="farm.loading"
                    >
                      <el-row :gutter="20" class="farm-row" v-bind:class="{ expanded: farm.rowExpanded }" style="margin-left: 0; margin-right: 0;" type="flex" align="middle">
                        <el-col v-if="farm.poolToken.isQuipuLp" :span="7" style="font-weight: bold;">
                          <el-avatar shape="circle" :size="40" style="position: relative; border: 4px solid #fff; vertical-align: middle;" src="data:image/png;base64,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"></el-avatar>
                          <el-avatar :src="farm.poolToken.thumbnailUri" fit="cover" shape="circle" :size="40" style="position: relative; border: 4px solid #fff; vertical-align: middle; margin-left: -18px; margin-right: 14px;"></el-avatar>
                          XTZ/{{ farm.poolToken.symbol }}
                        </el-col>
                        <el-col v-else :span="7" style="font-weight: bold;">
                          <el-avatar :src="farm.poolToken.thumbnailUri" fit="cover" shape="circle" :size="40" style="position: relative; border: 4px solid #fff; vertical-align: middle; margin-right: 14px;"></el-avatar>
                          {{ farm.poolToken.symbol }}
                        </el-col>
                        <el-col :span="5" style="font-weight: bold;">
                          <i class="fas fa-arrow-alt-right" style="color: #999; margin-left: 0px; margin-right: 6px;"></i>
                          <el-avatar :src="farm.rewardToken.thumbnailUri" fit="cover" shape="circle" :size="40" style="position: relative; border: 4px solid #fff; vertical-align: middle;"></el-avatar>
                          <span style="margin-left: 14px;">{{ farm.rewardToken.symbol }}</span>
                        </el-col>

                        <el-col style="text-align: right;" :span="5" v-if="wallet.connected && farm.depositAmount > 0">{{ vueNumberFormat(farm.rewardsEarned) }}</el-col>
                        <el-col style="text-align: right;" :span="5" v-else>-</el-col>
                        <el-col style="text-align: right;" :span="4">{{ vueNumberFormat(farm.apr, {prefix: '', decimal: '.', thousand: ',', precision: 2}) }}%</el-col>
                        <el-col :span="3" v-show="farm.rowExpanded === false" style="text-align: right;"><el-button type="text" @click="expandFarmRow(farm.id)" style="font-weight: bold;">View Details <i class="fas fa-chevron-down fa-icon-right"></i></el-button></el-col>
                        <el-col :span="3" v-show="farm.rowExpanded === true" style="text-align: right;"><el-button type="text" @click="collapseFarmRow(farm.id)" style="font-weight: bold;">Hide Details <i class="fas fa-chevron-up fa-icon-right"></i></el-button></el-col>
                      </el-row>
                    </div>
                  </el-col>
                </el-row>

              </el-card>
            </div>
          </el-col>
        </el-row>

        <el-row :gutter="20" type="flex" style="margin-top: 20px;">
          <el-col :span="24">
            <div class="grid-content" style="height: 100%;">
              <DaasCard />
            </div>
          </el-col>
        </el-row>
      </el-main>
    </el-container> -->

  </div>
</template>

<script>
import _ from 'lodash';
import { CollapseTransition } from "@ivanv/vue-collapse-transition";
import { mapState, mapActions } from 'vuex'
import NavWallet from './NavWallet.vue';
import DaasCard from './DaasCard.vue';
import farmUtils from './../utils/farm';

export default {
  name: 'FarmListing',
  components: {
    CollapseTransition,
    NavWallet,
    DaasCard
  },
  data() {
    return {
      localAbbrevTimeZone: new Date().toLocaleTimeString('en-us',{ timeZoneName:'short' }).split(' ')[2],
      showUsd: false,
      stakeForm: {
        input: "",
        loading: false,
        visible: false,
        farm: { poolToken: { balance: 0 }, rewardToken: {} }
      },
      unstakeForm: {
        input: "",
        loading: false,
        visible: false,
        farm: { poolToken: {}, rewardToken: {}, depositAmount: 0 }
      },
      filterOptions: [{
        label: 'Type',
        options: [{
          value: 'farm',
          label: 'Farms'
        }, {
          value: 'garden',
          label: 'Gardens'
        }, {
          value: 'flash',
          label: 'Flash Farms'
        }]
      }, {
        label: 'Staking',
        options: [
          { value: 'staked', label: 'Staked' }
        ]
      }, {
        label: 'Status',
        options: [
          { value: 'pending', label: 'Pending' },
          { value: 'running', label: 'Running' },
          { value: 'ended', label: 'Complete' },
        ]
      }, {
        label: 'Badges',
        options: [
          { value: 'verified', label: 'Verified' },
          { value: 'core', label: 'Crunchy Core' },
          { value: 'partner', label: 'Trusted Partner' },
          { value: 'lpLocked', label: 'LP Locked' },
        ]
      }]
    }
  },
  // watch: {
  //   '$route.query': {
  //     immediate: true,
  //     handler(newVal) {
  //       console.log("newVal", newVal);
  //     }
  //   }
  // },
  computed: {
    ...mapState([
      'wallet',
      'farms'
    ]),

    orderedFarms: function () {
      return _.orderBy(this.farms.data, 'tvlTez', 'desc');
    }
  },
  created() {
    if (this.$route.query.q) {
      this.$store.commit('updateFarmsSearchInput', this.$route.query.q);
    }

    if (this.$route.query.f) {
      let filters = this.$route.query.f;
      if (!Array.isArray(filters)) {
        filters = [ filters ];
      }
      this.$store.commit('updateFarmsFilters', filters);
    }

    this.refresh();
  },
  methods: {
    ...mapActions([
      'connectWallet',
      'disconnectWallet',
      'fetchAllFarms',
      'softUpdateFarm',
      'stakeInFarm',
      'unstakeFromFarm',
      'harvestFarm',
      'harvestAllFarms',
      'expandFarmRow',
      'collapseFarmRow',
      'expandAllFarmRows',
      'collapseAllFarmRows',
      'filterAllFarmRows',
      'searchAllFarmRows'
    ]),

    refresh() {
      this.fetchAllFarms();
    },

    isFa1(token) {
      return farmUtils.isFa1(token);
    },

    isFa2(token) {
      return farmUtils.isFa2(token);
    },

    updateSearchInput(input) {
      this.$router.replace({
        query: {
            ...this.$route.query,
            q: input
        }
      });
      this.$store.commit('updateFarmsSearchInput', input);
      this.filterAllFarmRows();
    },

    updateFilters(filters) {
      this.$router.replace({
        query: {
            ...this.$route.query,
            f: filters
        }
      });
      this.$store.commit('updateFarmsFilters', filters);
      this.filterAllFarmRows();
    },

    async showStakeForm(farmId) {
      this.stakeForm.input = "";
      this.stakeForm.farm = this.farms.data[farmId];
      if (Object.prototype.hasOwnProperty.call(this.$refs, 'stakeForm')) {
        this.$refs.stakeForm.resetFields();
      }
      this.stakeForm.loading = true;
      this.stakeForm.visible = true;
      await this.softUpdateFarm(farmId);
      this.stakeForm.farm = this.farms.data[farmId];
      this.stakeForm.loading = false;
    },

    async showUnstakeForm(farmId) {
      this.unstakeForm.input = "";
      this.unstakeForm.farm = this.farms.data[farmId];
      if (Object.prototype.hasOwnProperty.call(this.$refs, 'unstakeForm')) {
        this.$refs.unstakeForm.resetFields();
      }
      this.unstakeForm.loading = true;
      this.unstakeForm.visible = true;
      await this.softUpdateFarm(farmId);
      this.unstakeForm.farm = this.farms.data[farmId];
      this.unstakeForm.loading = false;
    },

    async stakeFarm(farmId) {
      const vm = this;
      this.$refs.stakeForm.validate((valid) => {
        if (valid) {
          vm.stakeInFarm({ farmId: farmId, amount: vm.stakeForm.input });
          vm.stakeForm.visible = false;
        } else {
          return false;
        }
      });
    },

    async unstakeFarm(farmId) {
      const vm = this;
      this.$refs.unstakeForm.validate((valid) => {
        if (valid) {
          vm.unstakeFromFarm({ farmId: farmId, amount: vm.unstakeForm.input });
          vm.unstakeForm.visible = false;
        } else {
          return false;
        }
      });
    },

    viewFarmStats(farm) {
      console.log("viewFarmStats", farm); // this will go to dedicated farm page
    }

  }
}
</script>

<style scoped>
    #farm-listing {
        position: relative;
        width: 100%;
    }
</style>
