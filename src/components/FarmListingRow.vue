<template>
  <el-row
    :data-farm-id="farm.id"
    style="padding-bottom: 14px; font-size: 14px; font-weight: 600"
    type="flex"
    align="top"
  >
    <el-col :span="24">
      <div
        v-loading="farm.loading"
        style="border: var(--line-border); border-radius: 14px"
        :style="[
          (farm.rowExpandedMyFarm && farmType === 'myFarms') ||
          (farm.rowExpandedAllFarm && farmType === 'allFarms')
            ? { borderColor: 'var(--border-color)' }
            : { borderColor: 'transparent !important' },
        ]"
      >
        <el-row
          :gutter="20"
          class="farm-row"
          :class="{ expanded: farm.rowExpanded }"
          style="margin-left: 0; margin-right: 0; color: var(--primary-text)"
          type="flex"
          align="middle"
        >
          <el-col
            v-if="farm.poolToken.isLbLp"
            :span="isMobile ? 6 : 4"
            style="font-weight: bold; display: flex; align-items: center"
          >
            <el-tooltip
              content="Liquidity Baking"
              placement="top"
              effect="light"
            >
              <i
                class="fas fa-heat"
                style="
                  position: absolute;
                  left: 14px;
                  top: 22px;
                  color: #fece00;
                  font-size: 18px;
                "
              ></i>
            </el-tooltip>
            <el-avatar
              shape="circle"
              :size="isMobile ? 36 : 40"
              style="
                position: relative;
                border: 4px solid #fff;
                vertical-align: middle;
              "
              src="data:image/png;base64,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"
            ></el-avatar>
            <el-tooltip placement="top" effect="light">
              <div slot="content">
                <div
                  style="
                    color: #1ec37f;
                    text-align: center;
                    font-weight: bold;
                    margin-bottom: 8px;
                    text-transform: uppercase;
                  "
                >
                  Total Staked
                </div>
                <div style="text-align: center">
                  {{ vueNumberFormat(farm.poolBalance) }} XTZ/{{
                    farm.poolToken.symbol
                  }}
                </div>
              </div>
              <el-avatar
                class="farm-poolTokens"
                :src="farm.poolToken.thumbnailUri"
                fit="cover"
                shape="circle"
                :size="isMobile ? 36 : 40"
              ></el-avatar>
            </el-tooltip>
            <p v-show="!isMobile">XTZ/{{ farm.poolToken.symbol }}</p>
          </el-col>
          <el-col
            v-else-if="farm.poolToken.isQuipuLp"
            :span="isMobile ? 6 : 4"
            style="font-weight: bold; display: flex; align-items: center"
          >
            <el-tooltip
              v-show="!isMobile"
              v-if="farm.poolToken.isQuipuLp"
              content="Quipuswap"
              placement="top"
              effect="light"
            >
              <img
                src="../assets/dex-icons/QuipuSwap.png"
                style="
                  position: absolute;
                  left: 8px;
                  top: 22px;
                  width: 18px;
                  height: 18px;
                "
              />
            </el-tooltip>
            <el-tooltip
              v-if="farm.errant"
              content="Farm Error"
              placement="top"
              effect="light"
            >
              <i
                class="fas fa-exclamation-triangle"
                style="
                  position: absolute;
                  left: 10px;
                  top: 22px;
                  color: #f64947;
                  font-size: 18px;
                "
              ></i>
            </el-tooltip>
            <el-tooltip
              v-else-if="farm.flashFarm"
              content="Flash Farm"
              placement="top"
              effect="light"
            >
              <i
                class="fas fa-bolt"
                style="
                  position: absolute;
                  left: 14px;
                  top: 22px;
                  color: #fece00;
                  font-size: 18px;
                "
              ></i>
            </el-tooltip>
            <el-avatar
              shape="circle"
              :size="isMobile ? 36 : 40"
              style="
                position: relative;
                border: 4px solid #fff;
                vertical-align: middle;
              "
              :src="farm.poolToken.token1.thumbnailUri"
            ></el-avatar>
            <el-tooltip placement="top" effect="light">
              <div slot="content">
                <div
                  style="
                    color: #1ec37f;
                    text-align: center;
                    font-weight: bold;
                    margin-bottom: 8px;
                    text-transform: uppercase;
                  "
                >
                  Total Staked
                </div>
                <div style="text-align: center">
                  {{ vueNumberFormat(farm.poolBalance) }}
                  {{ farm.poolToken.token1.symbol }}/{{
                    farm.poolToken.token2.symbol
                  }}
                </div>
              </div>
              <el-avatar
                class="farm-poolTokens"
                :src="farm.poolToken.token2.thumbnailUri"
                fit="cover"
                shape="circle"
                :size="isMobile ? 36 : 40"
              ></el-avatar>
            </el-tooltip>
            <p v-show="!isMobile">
              {{ farm.poolToken.token1.symbol }}/{{
                farm.poolToken.token2.symbol
              }}
            </p>
          </el-col>

          <el-col
            v-else-if="
              farm.poolToken.isPlentyLp ||
              farm.poolToken.isPlentyCtezLp ||
              farm.poolToken.isPlentyTezLp ||
              farm.poolToken.isPlentyStableLp ||
              farm.poolToken.isSpicyLp
            "
            :span="isMobile ? 6 : 4"
            style="font-weight: bold; display: flex; align-items: center"
          >
            <el-tooltip
              v-if="
                farm.poolToken.isPlentyLp ||
                farm.poolToken.isPlentyCtezLp ||
                farm.poolToken.isPlentyTezLp ||
                farm.poolToken.isPlentyStableLp
              "
              content="Plenty"
              placement="top"
              effect="light"
            >
              <img
                src="https://res.cloudinary.com/melvin-manni/image/upload/v1677417526/nstgjnest4jrhcsgwymf.png"
                style="
                  position: absolute;
                  left: 8px;
                  top: 22px;
                  width: 18px;
                  height: 18px;
                "
              />
            </el-tooltip>
            <el-tooltip
              v-show="!isMobile"
              v-else-if="farm.poolToken.isSpicyLp"
              content="SpicySwap"
              placement="top"
              effect="light"
            >
              <img
                src="../assets/dex-icons/Spicy.png"
                style="
                  position: absolute;
                  left: 8px;
                  top: 22px;
                  width: 18px;
                  height: 18px;
                "
              />
            </el-tooltip>
            <el-avatar
              :src="farm.poolToken.token1.thumbnailUri"
              fit="cover"
              shape="circle"
              :size="isMobile ? 36 : 40"
              style="
                position: relative;
                border: 4px solid #fff;
                vertical-align: middle;
              "
            ></el-avatar>
            <el-tooltip placement="top" effect="light">
              <div slot="content">
                <div
                  style="
                    color: #1ec37f;
                    text-align: center;
                    font-weight: bold;
                    margin-bottom: 8px;
                    text-transform: uppercase;
                  "
                >
                  Total Staked
                </div>
                <div style="text-align: center">
                  {{ vueNumberFormat(farm.poolBalance) }}
                  {{ farm.poolToken.token1.symbol }}/{{
                    farm.poolToken.token2.symbol
                  }}
                </div>
              </div>
              <el-avatar
                class="farm-poolTokens"
                :src="farm.poolToken.token2.thumbnailUri"
                fit="cover"
                shape="circle"
                :size="isMobile ? 36 : 40"
              ></el-avatar>
            </el-tooltip>
            <p v-show="!isMobile">
              {{ farm.poolToken.token1.symbol }}/{{
                farm.poolToken.token2.symbol
              }}
            </p>
          </el-col>

          <el-col
            v-else-if="
              farm.poolToken.isQuipuV2Lp ||
              farm.poolToken.isQuipuToken2TokenLp ||
              farm.poolToken.isQuipuStableLp
            "
            :span="isMobile ? 6 : 4"
            style="font-weight: bold; display: flex; align-items: center"
          >
            <el-tooltip
              v-show="!isMobile"
              v-if="farm.poolToken.isQuipuV2Lp"
              content="Quipuswap V2"
              placement="top"
              effect="light"
            >
              <img
                src="../assets/dex-icons/QuipuSwap.png"
                style="
                  position: absolute;
                  left: 8px;
                  top: 22px;
                  width: 18px;
                  height: 18px;
                "
              />
            </el-tooltip>
            <el-tooltip
              v-show="!isMobile"
              v-else-if="farm.poolToken.isQuipuToken2TokenLp"
              content="Quipuswap Token to Token"
              placement="top"
              effect="light"
            >
              <img
                src="../assets/dex-icons/QuipuSwap.png"
                style="
                  position: absolute;
                  left: 8px;
                  top: 22px;
                  width: 18px;
                  height: 18px;
                "
              />
            </el-tooltip>
            <el-tooltip
              v-show="!isMobile"
              v-else-if="farm.poolToken.isQuipuStableLp"
              content="Quipuswap Stable"
              placement="top"
              effect="light"
            >
              <img
                src="../assets/dex-icons/QuipuSwap.png"
                style="
                  position: absolute;
                  left: 8px;
                  top: 22px;
                  width: 18px;
                  height: 18px;
                "
              />
            </el-tooltip>
            <el-avatar
              :src="farm.poolToken.token1.thumbnailUri"
              fit="cover"
              shape="circle"
              :size="isMobile ? 36 : 40"
              style="
                position: relative;
                border: 4px solid #fff;
                vertical-align: middle;
              "
            ></el-avatar>
            <el-tooltip placement="top" effect="light">
              <div slot="content">
                <div
                  style="
                    color: #1ec37f;
                    text-align: center;
                    font-weight: bold;
                    margin-bottom: 8px;
                    text-transform: uppercase;
                  "
                >
                  Total Staked
                </div>
                <div style="text-align: center">
                  {{ vueNumberFormat(farm.poolBalance) }}
                  {{ farm.poolToken.token1.symbol }}/{{
                    farm.poolToken.token2.symbol
                  }}
                </div>
              </div>
              <el-avatar
                class="farm-poolTokens"
                :src="farm.poolToken.token2.thumbnailUri"
                fit="cover"
                shape="circle"
                :size="isMobile ? 36 : 40"
              ></el-avatar>
            </el-tooltip>
            <p v-show="!isMobile">
              {{ farm.poolToken.token1.symbol }}/{{
                farm.poolToken.token2.symbol
              }}
            </p>
          </el-col>

          <el-col
            v-else-if="farm.poolToken.isQuipuToken2TokenLp"
            :span="isMobile ? 6 : 4"
            style="font-weight: bold; display: flex; align-items: center"
          >
            <el-tooltip
              v-show="!isMobile"
              v-if="farm.poolToken.isQuipuToken2TokenLp"
              content="Quipuswap Token to Token"
              placement="top"
              effect="light"
            >
              <img
                src="../assets/dex-icons/QuipuSwap.png"
                style="
                  position: absolute;
                  left: 8px;
                  top: 22px;
                  width: 18px;
                  height: 18px;
                "
              />
            </el-tooltip>
            <el-avatar
              :src="farm.poolToken.token1.thumbnailUri"
              fit="cover"
              shape="circle"
              :size="isMobile ? 36 : 40"
              style="
                position: relative;
                border: 4px solid #fff;
                vertical-align: middle;
              "
            ></el-avatar>
            <el-tooltip placement="top" effect="light">
              <div slot="content">
                <div
                  style="
                    color: #1ec37f;
                    text-align: center;
                    font-weight: bold;
                    margin-bottom: 8px;
                    text-transform: uppercase;
                  "
                >
                  Total Staked
                </div>
                <div style="text-align: center">
                  {{ vueNumberFormat(farm.poolBalance) }}
                  {{ farm.poolToken.token1.symbol }}/{{
                    farm.poolToken.token2.symbol
                  }}
                </div>
              </div>
              <el-avatar
                class="farm-poolTokens"
                :src="farm.poolToken.token2.thumbnailUri"
                fit="cover"
                shape="circle"
                :size="isMobile ? 36 : 40"
              ></el-avatar>
            </el-tooltip>
            <p v-show="!isMobile">
              {{ farm.poolToken.token1.symbol }}/{{
                farm.poolToken.token2.symbol
              }}
            </p>
          </el-col>

          <el-col
            v-else-if="farm.poolToken.isQuipuStableLp"
            :span="isMobile ? 6 : 4"
            style="font-weight: bold; display: flex; align-items: center"
          >
            <el-tooltip
              v-show="!isMobile"
              v-if="farm.poolToken.isQuipuStableLp"
              content="Quipuswap Stable"
              placement="top"
              effect="light"
            >
              <img
                src="../assets/dex-icons/QuipuSwap.png"
                style="
                  position: absolute;
                  left: 8px;
                  top: 22px;
                  width: 18px;
                  height: 18px;
                "
              />
            </el-tooltip>
            <el-avatar
              :src="farm.poolToken.token1.thumbnailUri"
              fit="cover"
              shape="circle"
              :size="isMobile ? 36 : 40"
              style="
                position: relative;
                border: 4px solid #fff;
                vertical-align: middle;
              "
            ></el-avatar>
            <el-tooltip placement="top" effect="light">
              <div slot="content">
                <div
                  style="
                    color: #1ec37f;
                    text-align: center;
                    font-weight: bold;
                    margin-bottom: 8px;
                    text-transform: uppercase;
                  "
                >
                  Total Staked
                </div>
                <div style="text-align: center">
                  {{ vueNumberFormat(farm.poolBalance) }}
                  {{ farm.poolToken.token1.symbol }}/{{
                    farm.poolToken.token2.symbol
                  }}
                </div>
              </div>
              <el-avatar
                class="farm-poolTokens"
                :src="farm.poolToken.token2.thumbnailUri"
                fit="cover"
                shape="circle"
                :size="isMobile ? 36 : 40"
              ></el-avatar>
            </el-tooltip>
            <p v-show="!isMobile">
              {{ farm.poolToken.token1.symbol }}/{{
                farm.poolToken.token2.symbol
              }}
            </p>
          </el-col>

          <el-col
            v-else
            :span="isMobile ? 6 : 4"
            style="font-weight: bold; display: flex; align-items: center"
          >
            <el-tooltip
              v-if="farm.errant"
              content="Farm Error"
              placement="top"
              effect="light"
            >
              <i
                class="fas fa-exclamation-triangle"
                style="
                  position: absolute;
                  left: 10px;
                  top: 22px;
                  color: #f64947;
                  font-size: 18px;
                "
              ></i>
            </el-tooltip>
            <el-tooltip
              v-else-if="farm.flashFarm"
              content="Flash Farm"
              placement="top"
              effect="light"
            >
              <i
                class="fas fa-bolt"
                style="
                  position: absolute;
                  left: 14px;
                  top: 22px;
                  color: #fece00;
                  font-size: 18px;
                "
              ></i>
            </el-tooltip>
            <el-tooltip placement="top" effect="light">
              <div slot="content">
                <div
                  style="
                    color: #1ec37f;
                    text-align: center;
                    font-weight: bold;
                    margin-bottom: 8px;
                    text-transform: uppercase;
                  "
                >
                  Total Staked
                </div>
                <div style="text-align: center">
                  {{ vueNumberFormat(farm.poolBalance) }}
                  {{ farm.poolToken.symbol }}
                </div>
              </div>
              <el-avatar
                class="farm-poolToken"
                :src="farm.poolToken.thumbnailUri"
                fit="cover"
                shape="circle"
                :size="isMobile ? 36 : 40"
              ></el-avatar>
            </el-tooltip>
            <p v-show="!isMobile">{{ farm.poolToken.symbol }}</p>
          </el-col>
          <i class="fas fa-arrow-alt-right"></i>
          <el-col
            class="farm-rewardToken"
            :span="isMobile ? 6 : 4"
            style="font-weight: bold; display: flex; align-items: center"
          >
            <el-tooltip placement="top" effect="light">
              <div slot="content">
                <div
                  style="
                    color: #1ec37f;
                    text-align: center;
                    font-weight: bold;
                    margin-bottom: 8px;
                    text-transform: uppercase;
                  "
                >
                  Total Rewards
                </div>
                <div style="text-align: center">
                  {{ vueNumberFormat(farm.rewardSupply) }}
                  {{ farm.rewardToken.symbol }}
                </div>
              </div>
              <el-avatar
                :src="farm.rewardToken.thumbnailUri"
                fit="cover"
                shape="circle"
                :size="isMobile ? 36 : 40"
                style="
                  position: relative;
                  border: 4px solid #fff;
                  vertical-align: middle;
                "
              ></el-avatar>
            </el-tooltip>
            <span v-show="!isMobile" style="margin-left: 14px">{{
              farm.rewardToken.symbol
            }}</span>
          </el-col>

          <el-col
            v-if="wallet.connected && farm.depositAmount > 0"
            style="text-align: right"
            :span="isMobile ? 6 : 4"
          >
            <!-- <ICountUp
                            :delay="countUpDelay"
                            :endVal="farm.rewardsEarned"
                            :options="countUpOpts"
                          /> -->
            {{
              isMobile
                ? formatNumShorthand(farm.rewardsEarned, 2).value +
                  formatNumShorthand(farm.rewardsEarned, 2).suffix
                : vueNumberFormat(farm.rewardsEarned)
            }}
          </el-col>
          <el-col v-else style="text-align: right" :span="isMobile ? 6 : 4"
            >-</el-col
          >

          <el-col
            v-if="farm.errant"
            style="text-align: right; color: #f64947; text-transform: uppercase"
            :span="isMobile ? 6 : 3"
            >Error</el-col
          >
          <el-col
            v-else-if="farm.ended"
            style="text-align: right; text-transform: uppercase"
            :span="isMobile ? 6 : 3"
            >Complete</el-col
          >
          <el-col
            v-else-if="farm.apr >= 0"
            style="text-align: right"
            :span="isMobile ? 6 : 3"
            >{{
              vueNumberFormat(farm.apr, {
                prefix: "",
                decimal: ".",
                thousand: ",",
                precision: 2,
              })
            }}%</el-col
          >
          <el-col v-else style="text-align: right" :span="isMobile ? 6 : 3"
            >Pending</el-col
          >

          <el-col
            v-show="!isMobile"
            v-if="showUsd === false"
            style="text-align: right"
            :span="4"
            >{{ vueNumberFormat(farm.tvlTez) }} ꜩ</el-col
          >
          <el-col
            v-show="!isMobile"
            v-if="showUsd === true"
            style="text-align: right"
            :span="4"
            >{{
              vueNumberFormat(farm.tvlTez * farms.usdVwap, {
                prefix: "$",
                decimal: ".",
                thousand: ",",
                precision: 2,
              })
            }}</el-col
          >
          <el-col v-show="!isMobile" style="text-align: right" :span="3"
            >{{ farm.multiplier }}x</el-col
          >
          <el-col
            v-if="
              (farm.rowExpandedMyFarm === false && farmType === 'myFarms') ||
              (farm.rowExpandedAllFarm === false && farmType === 'allFarms')
            "
            :span="3"
            style="text-align: right; display: flex; justify-content: end"
            ><el-button
              type="text"
              style="font-weight: bold; display: flex; align-items: center"
              @click="expandFarmRow({ farmId: farm.id, farmType })"
            >
              <span v-show="!isMobile">View Details</span>
              <i class="fas fa-chevron-down fa-icon-right"></i></el-button
          ></el-col>
          <el-col
            v-if="
              (farm.rowExpandedMyFarm === true && farmType === 'myFarms') ||
              (farm.rowExpandedAllFarm === true && farmType === 'allFarms')
            "
            :span="3"
            style="text-align: right; display: flex; justify-content: end"
            ><el-button
              type="text"
              style="font-weight: bold; display: flex; align-items: center"
              @click="collapseFarmRow({ farmId: farm.id, farmType })"
            >
              <span v-show="!isMobile">Hide Details</span>
              <i class="fas fa-chevron-up fa-icon-right"></i></el-button
          ></el-col>
        </el-row>
        <collapse-transition :duration="250" name="slide">
          <div
            v-show="
              (farm.rowExpandedMyFarm && farmType === 'myFarms') ||
              (farm.rowExpandedAllFarm && farmType === 'allFarms')
            "
          >
            <el-row
              class="row-expanded"
              type="flex"
              align="top"
              style="padding: 10px 20px; color: var(--primary-text)"
            >
              <el-col
                v-if="wallet.connected"
                :span="isMobile ? 24 : 8"
                style="padding: 10px 20px; border-right: var(--line-border)"
              >
                <div
                  style="
                    display: flex;
                    justify-content: space-between;
                    margin-bottom: 8px;
                  "
                >
                  <strong
                    style="
                      color: var(--color-subheading-text);
                      font-size: 14px;
                      font-weight: 600;
                    "
                    >EST. {{ farm.rewardToken.symbol }} EARNED</strong
                  >
                  <strong
                    v-show="isMobile"
                    style="
                      color: var(--color-subheading-text);
                      font-size: 14px;
                      font-weight: 600;
                    "
                    >Farm Multiplier</strong
                  >
                </div>
                <el-row
                  v-if="farm.errant"
                  type="flex"
                  align="middle"
                  justify="space-between"
                >
                  <el-col :span="24" style="font-weight: 600; color: #f64947">
                    An issue has been detected with the rewards of this farm.
                    Please unstake all tokens.
                  </el-col>
                </el-row>
                <el-row
                  v-else-if="farm.depositAmount > 0"
                  type="flex"
                  align="middle"
                  justify="space-between"
                >
                  <el-col :span="10" style="font-weight: 600">{{
                    vueNumberFormat(farm.rewardsEarned)
                  }}</el-col>
                  <el-col v-if="!isMobile" :span="10">
                    <el-button
                      :disabled="farm.started === false"
                      style="
                        border-radius: 10px;
                        font-weight: bold;
                        width: 100%;
                        background-color: var(--color-alt-btn) !important;
                        color: #fff !important;
                        border: 0;
                      "
                      @click="harvestFarm(farm.id)"
                      >Harvest</el-button
                    >
                  </el-col>
                  <el-col v-else style="text-align: right" :span="10">
                    {{ farm.multiplier }}x
                  </el-col>
                </el-row>
                <el-row
                  v-else-if="farm.ended"
                  type="flex"
                  align="middle"
                  justify="space-between"
                >
                  <el-col :span="10" style="font-weight: 600">-</el-col>
                  <el-col :span="10">
                    <el-button
                      type="primary"
                      :disabled="true"
                      style="
                        border-radius: 10px;
                        font-weight: bold;
                        width: 100%;
                        background-color: var(--color-alt-btn) !important;
                        color: #fff !important;
                        border: 0;
                      "
                      >Harvest</el-button
                    >
                  </el-col>
                </el-row>
                <el-row
                  v-else-if="!isMobile"
                  type="flex"
                  align="middle"
                  justify="space-between"
                >
                  <el-col :span="24">
                    <el-button
                      type="success"
                      style="border-radius: 10px; font-weight: 600; width: 100%"
                      @click="$emit('request-stake-farm', farm.id)"
                      >Stake Now to Earn Rewards</el-button
                    >
                  </el-col>
                </el-row>
                <el-row
                  v-else-if="isMobile"
                  type="flex"
                  align="middle"
                  justify="space-between"
                >
                  <el-col :span="10" style="font-weight: 600">-</el-col>
                  <el-col style="text-align: right" :span="10">
                    {{ farm.multiplier }}x
                  </el-col>
                </el-row>

                <div style="margin-top: 16px">
                  <el-link
                    v-show="!isMobile"
                    style="color: #555cff; font-weight: 600"
                    :href="`https://tzkt.io/${farm.rewardToken.address}`"
                    target="_blank"
                    >View {{ farm.rewardToken.symbol }} Contract
                    <i class="far fa-external-link fa-icon-right"></i
                  ></el-link>
                </div>
              </el-col>
              <el-col
                v-if="wallet.connected === false"
                :span="isMobile ? 24 : 8"
                style="padding: 10px 20px; border-right: var(--line-border)"
              >
                <div style="margin-bottom: 8px">
                  <strong
                    style="color: var(--color-subheading-text); font-size: 14px"
                    >&nbsp;</strong
                  >
                </div>
              </el-col>
              <el-col
                v-if="wallet.connected"
                :span="isMobile ? 24 : 8"
                style="padding: 10px 20px; border-right: var(--line-border)"
              >
                <div style="margin-bottom: 8px">
                  <strong
                    v-if="farm.poolToken.isQuipuLp || farm.poolToken.isLbLp"
                    style="
                      color: var(--color-subheading-text);
                      font-size: 14px;
                      font-weight: 600;
                    "
                    >LP STAKED</strong
                  >
                  <strong
                    v-else-if="farm.poolToken.isPlentyLp"
                    style="
                      color: var(--color-subheading-text);
                      font-size: 14px;
                      font-weight: 600;
                    "
                    >PLP STAKED</strong
                  >
                  <strong
                    v-else
                    style="
                      color: var(--color-subheading-text);
                      font-size: 14px;
                      font-weight: 600;
                    "
                    >{{ farm.poolToken.symbol }} STAKED</strong
                  >
                </div>
                <el-row type="flex" align="middle" justify="space-between">
                  <el-col
                    v-if="farm.depositAmount > 0"
                    :span="14"
                    style="font-weight: 600"
                  >
                    {{ vueNumberFormat(farm.depositAmount) }}
                    <el-popover
                      placement="bottom"
                      width="100"
                      trigger="hover"
                      content="Your percentage of the farm"
                      popper-class="farm-info"
                    >
                      <el-tag
                        slot="reference"
                        type="primary"
                        size="medium"
                        effect="plain"
                        style="margin-left: 14px; cursor: help"
                        >{{
                          vueNumberFormat(
                            (farm.depositAmount / farm.poolBalance) * 100,
                            {
                              prefix: "",
                              decimal: ".",
                              thousand: ",",
                              precision: 2,
                            }
                          )
                        }}%</el-tag
                      >
                    </el-popover>
                  </el-col>
                  <el-col
                    v-else-if="!isMobile"
                    :span="14"
                    style="font-weight: 600"
                    >-</el-col
                  >
                  <el-col v-else :span="14" style="font-weight: 600">
                    <el-button
                      type="success"
                      style="border-radius: 10px; font-weight: 600; width: 100%"
                      @click="$emit('request-stake-farm', farm.id)"
                      >Stake to Earn Rewards</el-button
                    >
                  </el-col>
                  <el-col :span="10" style="text-align: right">
                    <el-button
                      class="_action-btn"
                      type="info"
                      plain
                      style="border-radius: 10px; padding: 12px 14px"
                      :disabled="farm.ended || farm.errant"
                      @click="$emit('request-stake-farm', farm.id)"
                      ><i class="fas fa-plus"></i
                    ></el-button>
                    <el-button
                      class="_action-btn"
                      type="info"
                      plain
                      style="border-radius: 10px; padding: 12px 14px"
                      :disabled="farm.depositAmount <= 0"
                      @click="$emit('request-unstake-farm', farm.id)"
                      ><i class="fas fa-minus"></i
                    ></el-button>
                  </el-col>
                </el-row>
                <div style="margin-top: 16px">
                  <el-link
                    v-if="farm.poolToken.isLbLp"
                    style="color: #555cff; font-weight: 600"
                    href="https://tzkt.io/KT1TxqZ8QtKvLu3V3JH7Gx58n7Co8pgtpQU5/dex"
                    target="_blank"
                    >Get XTZ/{{ farm.poolToken.symbol }} LP
                    <i class="far fa-external-link fa-icon-right"></i
                  ></el-link>
                  <el-link
                    v-else-if="farm.poolToken.isPlentyLp"
                    style="color: #555cff; font-weight: 600"
                    :href="`https://app.plenty.network/pools`"
                    target="_blank"
                    >Get {{ farm.poolToken.token1.symbol }}/{{
                      farm.poolToken.token2.symbol
                    }}
                    PLP <i class="far fa-external-link fa-icon-right"></i
                  ></el-link>
                  <el-link
                    v-if="farm.poolToken.isSpicyLp"
                    style="color: #555cff; font-weight: 600"
                    :href="`https://spicyswap.xyz/#/liq?tokenLeft=${farm.poolToken.token1.tokenAddress}:${farm.poolToken.token1.tokenId}&tokenRight=${farm.poolToken.token2.tokenAddress}:${farm.poolToken.token2.tokenId}`"
                    target="_blank"
                    >Get {{ farm.poolToken.token1.symbol }}/{{
                      farm.poolToken.token2.symbol
                    }}
                    SSLP <i class="far fa-external-link fa-icon-right"></i
                  ></el-link>
                  <el-link
                    v-else-if="
                      farm.poolToken.isQuipuLp && isFa1(farm.poolToken)
                    "
                    style="color: #555cff; font-weight: 600"
                    :href="`https://quipuswap.com/liquidity/add/tez-${farm.poolToken.realTokenAddress}`"
                    target="_blank"
                    >Get {{ farm.poolToken.symbol }} LP
                    <i class="far fa-external-link fa-icon-right"></i
                  ></el-link>
                  <el-link
                    v-else-if="
                      farm.poolToken.isQuipuLp && isFa2(farm.poolToken)
                    "
                    style="color: #555cff; font-weight: 600"
                    :href="`https://quipuswap.com/liquidity/add/tez-${farm.poolToken.realTokenAddress}_${farm.poolToken.realTokenId}`"
                    target="_blank"
                    >Get {{ farm.poolToken.symbol }} LP
                    <i class="far fa-external-link fa-icon-right"></i
                  ></el-link>
                  <el-link
                    v-else-if="
                      farm.poolToken.isQuipuV2Lp &&
                      isFa2(farm.poolToken.token1) &&
                      isFa2(farm.poolToken.token2)
                    "
                    style="color: #555cff; font-weight: 600"
                    :href="`https://quipuswap.com/liquidity/cpmm/add/${farm.poolToken.token1.tokenAddress}_${farm.poolToken.token1.tokenId}-${farm.poolToken.token2.tokenAddress}_${farm.poolToken.token2.tokenId}`"
                    target="_blank"
                    >Get {{ farm.poolToken.symbol }} LP
                    <i class="far fa-external-link fa-icon-right"></i
                  ></el-link>
                  <el-link
                    v-else-if="
                      farm.poolToken.isQuipuV2Lp &&
                      !isFa2(farm.poolToken.token1) &&
                      isFa2(farm.poolToken.token2)
                    "
                    style="color: #555cff; font-weight: 600"
                    :href="`https://quipuswap.com/liquidity/cpmm/add/${farm.poolToken.token1.tokenAddress}-${farm.poolToken.token2.tokenAddress}_${farm.poolToken.token2.tokenId}`"
                    target="_blank"
                    >Get {{ farm.poolToken.symbol }} LP
                    <i class="far fa-external-link fa-icon-right"></i
                  ></el-link>
                  <el-link
                    v-else-if="
                      farm.poolToken.isQuipuV2Lp &&
                      isFa2(farm.poolToken.token1) &&
                      !isFa2(farm.poolToken.token2)
                    "
                    style="color: #555cff; font-weight: 600"
                    :href="`https://quipuswap.com/liquidity/cpmm/add/${farm.poolToken.token1.tokenAddress}_${farm.poolToken.token1.tokenId}-${farm.poolToken.token2.tokenAddress}`"
                    target="_blank"
                    >Get {{ farm.poolToken.symbol }} LP
                    <i class="far fa-external-link fa-icon-right"></i
                  ></el-link>
                  <el-link
                    v-else-if="
                      farm.poolToken.isQuipuV2Lp &&
                      !isFa2(farm.poolToken.token1) &&
                      !isFa2(farm.poolToken.token2)
                    "
                    style="color: #555cff; font-weight: 600"
                    :href="`https://quipuswap.com/liquidity/cpmm/add/${farm.poolToken.token1.tokenAddress}-${farm.poolToken.token2.tokenAddress}`"
                    target="_blank"
                    >Get {{ farm.poolToken.symbol }} LP
                    <i class="far fa-external-link fa-icon-right"></i
                  ></el-link>
                  <el-link
                    v-else-if="
                      farm.poolToken.isQuipuToken2TokenLp &&
                      isFa2(farm.poolToken.token1) &&
                      isFa2(farm.poolToken.token2)
                    "
                    style="color: #555cff; font-weight: 600"
                    :href="`https://quipuswap.com/liquidity/add/${farm.poolToken.token1.tokenAddress}_${farm.poolToken.token1.tokenId}-${farm.poolToken.token2.tokenAddress}_${farm.poolToken.token2.tokenId}`"
                    target="_blank"
                    >Get {{ farm.poolToken.symbol }} LP
                    <i class="far fa-external-link fa-icon-right"></i
                  ></el-link>
                  <el-link
                    v-else-if="
                      farm.poolToken.isQuipuToken2TokenLp &&
                      !isFa2(farm.poolToken.token1) &&
                      isFa2(farm.poolToken.token2)
                    "
                    style="color: #555cff; font-weight: 600"
                    :href="`https://quipuswap.com/liquidity/add/${farm.poolToken.token1.tokenAddress}-${farm.poolToken.token2.tokenAddress}_${farm.poolToken.token2.tokenId}`"
                    target="_blank"
                    >Get {{ farm.poolToken.symbol }} LP
                    <i class="far fa-external-link fa-icon-right"></i
                  ></el-link>
                  <el-link
                    v-else-if="
                      farm.poolToken.isQuipuToken2TokenLp &&
                      isFa2(farm.poolToken.token1) &&
                      !isFa2(farm.poolToken.token2)
                    "
                    style="color: #555cff; font-weight: 600"
                    :href="`https://quipuswap.com/liquidity/add/${farm.poolToken.token1.tokenAddress}_${farm.poolToken.token1.tokenId}-${farm.poolToken.token2.tokenAddress}`"
                    target="_blank"
                    >Get {{ farm.poolToken.symbol }} LP
                    <i class="far fa-external-link fa-icon-right"></i
                  ></el-link>
                  <el-link
                    v-else-if="
                      farm.poolToken.isQuipuToken2TokenLp &&
                      !isFa2(farm.poolToken.token1) &&
                      !isFa2(farm.poolToken.token2)
                    "
                    style="color: #555cff; font-weight: 600"
                    :href="`https://quipuswap.com/liquidity/add/${farm.poolToken.token1.tokenAddress}-${farm.poolToken.token2.tokenAddress}`"
                    target="_blank"
                    >Get {{ farm.poolToken.symbol }} LP
                    <i class="far fa-external-link fa-icon-right"></i
                  ></el-link>
                  <el-link
                    v-else-if="farm.poolToken.isQuipuStableLp"
                    style="color: #555cff; font-weight: 600"
                    :href="`https://quipuswap.com/liquidity/cpmm/add/${farm.poolToken.token1.tokenAddress}_${farm.poolToken.token1.tokenId}-${farm.poolToken.token2.tokenAddress}_${farm.poolToken.token2.tokenId}`"
                    target="_blank"
                    >Get {{ farm.poolToken.symbol }} LP
                    <i class="far fa-external-link fa-icon-right"></i
                  ></el-link>
                  <el-link
                    v-else-if="isFa1(farm.poolToken)"
                    style="color: #555cff; font-weight: 600"
                    :href="`/#/?from=tez&to=${farm.poolToken.tokenAddress}_${farm.poolToken.tokenId}`"
                    target="_blank"
                    >Buy {{ farm.poolToken.symbol }}
                    <i class="far fa-external-link fa-icon-right"></i
                  ></el-link>
                  <el-link
                    v-else-if="isFa2(farm.poolToken)"
                    style="color: #555cff; font-weight: 600"
                    :href="`/#/?from=tez&to=${farm.poolToken.tokenAddress}_${farm.poolToken.tokenId}`"
                    target="_blank"
                    >Buy {{ farm.poolToken.symbol }}
                    <i class="far fa-external-link fa-icon-right"></i
                  ></el-link>
                </div>
              </el-col>
              <el-col
                v-if="wallet.connected === false"
                :span="isMobile ? 24 : 8"
                style="padding: 10px 20px; border-right: var(--line-border)"
              >
                <div style="margin-bottom: 8px">
                  <strong
                    style="
                      color: var(--color-subheading-text);
                      font-size: 14px;
                      font-weight: 600;
                    "
                    >START FARMING</strong
                  >
                </div>
                <connect-button></connect-button>
              </el-col>
              <el-col
                v-if="farm.errant"
                :span="isMobile ? 24 : 8"
                style="padding: 10px 20px; border-right: var(--line-border)"
              >
                <div style="margin-bottom: 8px">
                  <strong
                    style="
                      color: #f64947;
                      font-size: 14px;
                      font-weight: 600;
                      text-transform: uppercase;
                    "
                    >Farming Error Detected</strong
                  >
                </div>
              </el-col>
              <el-col
                v-if="farm.errant === false"
                :span="isMobile ? 24 : 8"
                style="padding: 10px 20px"
              >
                <div style="margin-bottom: 8px">
                  <strong
                    v-if="!farm.started"
                    style="
                      color: #1ec37f;
                      font-size: 14px;
                      font-weight: 600;
                      text-transform: uppercase;
                    "
                  >
                    Farming starts {{ farm.startTime | moment("calendar") }}
                    {{ localAbbrevTimeZone }} and lasts
                    {{ farm.duration | humanizeDuration }}
                  </strong>
                  <strong
                    v-if="farm.started && !farm.ended"
                    style="
                      color: var(--color-subheading-text);
                      font-size: 14px;
                      font-weight: 600;
                      text-transform: uppercase;
                    "
                    >Farming ends
                    {{ farm.endTime | moment("dddd, MMMM Do YYYY, h:mm a") }}
                    {{ localAbbrevTimeZone }}</strong
                  >
                  <strong
                    v-if="farm.ended"
                    style="
                      font-size: 14px;
                      font-weight: 600;
                      text-transform: uppercase;
                    "
                    >Farming was completed on
                    {{ farm.endTime | moment("dddd, MMMM Do YYYY, h:mm a") }}
                    {{ localAbbrevTimeZone }}</strong
                  >
                </div>
                <el-row type="flex" align="middle" justify="space-between">
                  <el-col :span="18">
                    <el-popover
                      v-if="farm.badges.verified"
                      placement="bottom"
                      width="100"
                      trigger="hover"
                      content="Verified"
                      popper-class="farm-verified"
                    >
                      <el-avatar
                        slot="reference"
                        icon="far fa-shield-check"
                        style="
                          color: #1ec37f;
                          background: var(--badge-background);
                          border: 1px solid var(--badge-border-color);
                          margin-right: 14px;
                        "
                      ></el-avatar>
                    </el-popover>
                    <el-popover
                      v-if="farm.badges.core"
                      placement="bottom"
                      width="100"
                      trigger="hover"
                      content="Crunchy Core"
                      popper-class="farm-verified"
                    >
                      <el-avatar
                        slot="reference"
                        icon="far fa-taco"
                        style="
                          color: #1ec37f;
                          background: var(--badge-background);
                          border: 1px solid var(--badge-border-color);
                          margin-right: 14px;
                        "
                      ></el-avatar>
                    </el-popover>
                    <el-popover
                      v-if="farm.badges.partner"
                      placement="bottom"
                      width="100"
                      trigger="hover"
                      content="Trusted Partner"
                      popper-class="farm-verified"
                    >
                      <el-avatar
                        slot="reference"
                        icon="far fa-handshake-alt"
                        style="
                          color: #1ec37f;
                          background: var(--badge-background);
                          border: 1px solid var(--badge-border-color);
                          margin-right: 14px;
                        "
                      ></el-avatar>
                    </el-popover>
                    <el-popover
                      v-if="farm.badges.lpLocked"
                      placement="bottom"
                      width="125"
                      trigger="hover"
                      content="LP Liquidity Locked"
                      popper-class="farm-verified"
                    >
                      <el-avatar
                        slot="reference"
                        icon="fak fa-crunchy-locked"
                        style="
                          color: #1ec37f;
                          background: var(--badge-background);
                          border: 1px solid var(--badge-border-color);

                          margin-right: 14px;
                        "
                      ></el-avatar>
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
import { mapState, mapActions } from "vuex";
import farmUtils from "./../utils/farm";
import ConnectButton from "./ConnectButton.vue";

export default {
  name: "FarmListingRow",
  components: {
    CollapseTransition,
    ConnectButton,
    // ICountUp
  },
  props: {
    farm: {
      type: Object,
      required: true,
    },
    showUsd: {
      type: Boolean,
      required: true,
    },
    farmType: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      localAbbrevTimeZone: new Date()
        .toLocaleTimeString("en-us", { timeZoneName: "short" })
        .split(" ")[2],
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
    };
  },
  computed: {
    isMobile() {
      return window.innerWidth <= 450;
    },
    ...mapState(["wallet", "farms"]),
  },
  methods: {
    ...mapActions([
      "connectWallet",
      "harvestFarm",
      "expandFarmRow",
      "collapseFarmRow",
    ]),

    isFa1(token) {
      return farmUtils.isFa1(token);
    },

    isFa2(token) {
      return farmUtils.isFa2(token);
    },

    formatNumShorthand(value, precision) {
      const number = precision
        ? parseFloat(value).toFixed(precision)
        : Number(value);
      if (isNaN(number)) return { value: 0, suffix: "" };
      if (number < 1000) {
        return { value: number, suffix: "" };
      } else if (number < 1000000) {
        const value = number / 1000;
        const precisedValue = parseFloat(value).toFixed(precision);
        return { value: precisedValue, suffix: "K" };
      } else if (number < 1000000000) {
        const value = (number / 1000000).toFixed(precision);
        return { value, suffix: "M" };
      } else if (number < 1000000000000) {
        const value = number / 1000000000;
        const precisedValue = parseFloat(value).toFixed(precision);
        return { value: precisedValue, suffix: "B" };
      } else {
        const value = number / 1000000000000;
        const precisedValue = parseFloat(value).toFixed(precision);
        return { value: precisedValue, suffix: "T" };
      }
    },
  },
};
</script>

<style lang="scss" scoped>
@import "../crunchy-variables.scss";
@import "~element-ui/packages/theme-chalk/src/common/var";
.farm-poolToken {
  position: relative;
  border: 4px solid #fff;
  vertical-align: middle;
  margin-right: 14px;
  @media (max-width: 450px) {
    margin-left: 0;
  }
}
.farm-poolTokens {
  position: relative;
  border: 4px solid #fff;
  vertical-align: middle;
  margin-left: -18px;
  margin-right: 14px;
  @media (max-width: 450px) {
    margin-right: 0;
  }
}
.farm-rewardToken {
  @media (max-width: 450px) {
    display: flex;
    align-items: center;
    padding-left: 0 !important;
    margin-left: 0px;
  }
}
.row-expanded {
  @media (max-width: 450px) {
    flex-direction: column;
    padding-left: 0 !important;
    padding-right: 0 !important;
  }
}
.fa-arrow-alt-right {
  font-size: 24px;
  color: #999;
  margin-left: -10px;
  margin-right: 6px;
  @media (max-width: 450px) {
    margin-left: -15px;
  }
}
</style>
